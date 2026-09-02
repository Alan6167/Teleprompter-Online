/**
 * Turn an uploaded file into prompter-ready plain text.
 *
 * Everything here runs in the browser — no file is ever uploaded — which is the whole
 * point of the product's privacy promise. That constraint rules out a server-side
 * converter, so .docx is unzipped with the platform's own DecompressionStream rather than
 * by pulling in a ZIP library.
 */

export type ImportErrorReason = 'unsupported' | 'docxUnsupported' | 'empty' | 'failed';

export class ScriptImportError extends Error {
  reason: ImportErrorReason;
  constructor(reason: ImportErrorReason) {
    super(reason);
    this.name = 'ScriptImportError';
    this.reason = reason;
  }
}

export const ACCEPTED_FILE_TYPES =
  '.txt,.md,.markdown,.srt,.vtt,.rtf,.docx,text/plain,text/markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

/** Decode the handful of XML entities Word actually emits. */
function decodeXmlEntities(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, '&');
}

/**
 * Read one file out of a ZIP archive.
 *
 * Only what .docx needs is implemented: the central directory is scanned for the entry,
 * then its local header is skipped to reach the data. Stored (method 0) and deflated
 * (method 8) entries are both handled; anything else is treated as unreadable.
 */
async function readZipEntry(buffer: ArrayBuffer, entryName: string): Promise<Uint8Array | null> {
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  // The End Of Central Directory record sits at the tail, after an optional comment.
  const EOCD_SIGNATURE = 0x06054b50;
  let eocd = -1;
  const scanFrom = Math.max(0, bytes.length - 66_000);
  for (let i = bytes.length - 22; i >= scanFrom; i--) {
    if (view.getUint32(i, true) === EOCD_SIGNATURE) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) return null;

  const entryCount = view.getUint16(eocd + 10, true);
  let pointer = view.getUint32(eocd + 16, true); // central directory offset
  const decoder = new TextDecoder();

  for (let i = 0; i < entryCount; i++) {
    if (pointer + 46 > bytes.length) return null;
    if (view.getUint32(pointer, true) !== 0x02014b50) return null;

    const method = view.getUint16(pointer + 10, true);
    const compressedSize = view.getUint32(pointer + 20, true);
    const nameLength = view.getUint16(pointer + 28, true);
    const extraLength = view.getUint16(pointer + 30, true);
    const commentLength = view.getUint16(pointer + 32, true);
    const localOffset = view.getUint32(pointer + 42, true);
    const name = decoder.decode(bytes.subarray(pointer + 46, pointer + 46 + nameLength));

    if (name === entryName) {
      if (view.getUint32(localOffset, true) !== 0x04034b50) return null;
      const localNameLength = view.getUint16(localOffset + 26, true);
      const localExtraLength = view.getUint16(localOffset + 28, true);
      const dataStart = localOffset + 30 + localNameLength + localExtraLength;
      const data = bytes.subarray(dataStart, dataStart + compressedSize);

      if (method === 0) return data;
      if (method !== 8) return null;

      if (typeof DecompressionStream === 'undefined') {
        throw new ScriptImportError('docxUnsupported');
      }
      const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      return new Uint8Array(await new Response(stream).arrayBuffer());
    }

    pointer += 46 + nameLength + extraLength + commentLength;
  }

  return null;
}

/** Pull the readable text out of a Word document, one paragraph per line. */
async function parseDocx(file: File): Promise<string> {
  const entry = await readZipEntry(await file.arrayBuffer(), 'word/document.xml');
  if (!entry) throw new ScriptImportError('failed');

  const xml = new TextDecoder().decode(entry);
  const paragraphs: string[] = [];

  // Word splits a sentence across runs, so a paragraph's text is the concatenation of its
  // <w:t> nodes — but explicit breaks and tabs are their own elements sitting *between*
  // those runs, so they have to be picked up in the same pass or they are lost.
  const TOKEN = /<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>|<w:br\s*\/?>|<w:tab\s*\/?>/g;

  for (const chunk of xml.split(/<\/w:p>/)) {
    let text = '';
    let match: RegExpExecArray | null;
    TOKEN.lastIndex = 0;
    while ((match = TOKEN.exec(chunk)) !== null) {
      if (match[1] !== undefined) {
        text += decodeXmlEntities(match[1]);
      } else if (match[0].startsWith('<w:br')) {
        text += '\n';
      } else {
        text += '\t';
      }
    }
    paragraphs.push(text);
  }

  return paragraphs
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Drop cue numbers and timecodes from subtitle files, keeping only spoken lines. */
function parseSubtitles(raw: string): string {
  return raw
    .replace(/^﻿/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim() !== 'WEBVTT')
    .filter((line) => !/^\d+$/.test(line.trim()))
    .filter(
      (line) => !/^\d{2}:\d{2}(:\d{2})?[,.]\d{3}\s*-->/.test(line.trim())
    )
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Strip RTF control words and groups down to the underlying text. */
function parseRtf(raw: string): string {
  return raw
    .replace(/\{\\\*?[^{}]*\}/g, '')
    .replace(/\\'[0-9a-fA-F]{2}/g, '')
    .replace(/\\par[d]?\s?/g, '\n')
    .replace(/\\[a-zA-Z]+-?\d* ?/g, '')
    .replace(/[{}]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Read `file` and return prompter-ready text.
 *
 * Throws {@link ScriptImportError} with a reason the UI can translate rather than a raw
 * platform error, so an unreadable file never surfaces as a stack trace.
 */
export async function importScriptFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  let text: string;
  try {
    if (name.endsWith('.docx')) {
      text = await parseDocx(file);
    } else if (name.endsWith('.srt') || name.endsWith('.vtt')) {
      text = parseSubtitles(await file.text());
    } else if (name.endsWith('.rtf')) {
      text = parseRtf(await file.text());
    } else if (/\.(txt|md|markdown)$/.test(name) || file.type.startsWith('text/')) {
      text = await file.text();
    } else if (name.endsWith('.doc')) {
      // The legacy binary format is not a ZIP and cannot be read client-side.
      throw new ScriptImportError('unsupported');
    } else {
      text = await file.text();
    }
  } catch (error) {
    if (error instanceof ScriptImportError) throw error;
    throw new ScriptImportError('failed');
  }

  if (!text.trim()) throw new ScriptImportError('empty');
  return text;
}

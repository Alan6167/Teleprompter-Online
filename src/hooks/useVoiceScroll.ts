'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Voice-following scroll.
 *
 * The browser's own speech recognition turns what the reader says into a rolling
 * transcript; the last few words of that transcript are matched against the script so the
 * page can be scrolled to wherever they actually are.
 *
 * Matching is local: the script itself is never transmitted. The audio is another matter —
 * several browsers (Chrome among them) relay it to the vendor's own speech service, so the
 * UI and the privacy policy say so rather than claiming the whole feature is on-device.
 */

export type VoiceStatus = 'idle' | 'listening' | 'denied' | 'unsupported' | 'error';

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}
interface SpeechRecognitionResultLike {
  readonly length: number;
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternativeLike;
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    readonly length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** BCP-47 tags the recognizer understands, keyed by the site's locales. */
const RECOGNITION_LANGS: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
  pt: 'pt-BR',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
};

/** Strip punctuation and case so "Hello," and "hello" compare equal. */
export function normalizeWord(word: string): string {
  return word
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, '')
    .trim();
}

/** Split a script into the word tokens the matcher works on. */
export function tokenizeScript(script: string): string[] {
  const trimmed = script.trim();
  if (!trimmed) return [];
  return trimmed.split(/\s+/).map(normalizeWord);
}

/**
 * Locate the spoken phrase inside the script.
 *
 * Only a window around the current position is searched: a script often repeats a phrase,
 * and a reader is far more likely to be a few words further on than to have jumped back to
 * an identical line elsewhere. Returns the index of the last matched word, or -1 when the
 * phrase does not match confidently enough to move the page.
 */
export function findScriptPosition(
  scriptWords: string[],
  spokenTail: string[],
  cursor: number
): number {
  const tail = spokenTail.filter(Boolean).slice(-4);
  if (tail.length === 0 || scriptWords.length === 0) return -1;

  const from = Math.max(0, cursor - 8);
  const to = Math.min(scriptWords.length, cursor + 60);

  let bestEnd = -1;
  let bestScore = 0;

  for (let i = from; i < to; i++) {
    let score = 0;
    for (let j = 0; j < tail.length; j++) {
      if (scriptWords[i + j] && scriptWords[i + j] === tail[j]) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestEnd = i + tail.length - 1;
    }
  }

  // One matching word is noise — a filler word will match almost anywhere.
  const required = Math.min(2, tail.length);
  if (bestScore < required) return -1;

  return Math.min(bestEnd, scriptWords.length - 1);
}

interface UseVoiceScrollOptions {
  enabled: boolean;
  locale: string;
  scriptWords: string[];
  /** Called with the index of the word the reader has just spoken. */
  onPosition: (wordIndex: number) => void;
}

export function useVoiceScroll({
  enabled,
  locale,
  scriptWords,
  onPosition,
}: UseVoiceScrollOptions) {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [supported, setSupported] = useState(true);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const cursorRef = useRef(0);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const wordsRef = useRef(scriptWords);
  wordsRef.current = scriptWords;
  const onPositionRef = useRef(onPosition);
  onPositionRef.current = onPosition;

  useEffect(() => {
    setSupported(getRecognitionCtor() != null);
  }, []);

  /** Reset the search window — used when playback restarts from the top. */
  const resetCursor = useCallback(() => {
    cursorRef.current = 0;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setStatus('unsupported');
      return;
    }

    const recognition = new Ctor();
    recognition.lang = RECOGNITION_LANGS[locale] ?? 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      // Interim results arrive constantly; only the newest chunk matters for position.
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0]?.transcript ?? '';
      }
      const spoken = transcript.split(/\s+/).map(normalizeWord).filter(Boolean);
      if (spoken.length === 0) return;

      const match = findScriptPosition(wordsRef.current, spoken, cursorRef.current);
      if (match >= 0) {
        cursorRef.current = match;
        onPositionRef.current(match);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setStatus('denied');
        enabledRef.current = false;
      } else if (event.error === 'no-speech' || event.error === 'aborted') {
        // Routine during a pause — the onend handler restarts recognition.
        return;
      } else {
        setStatus('error');
      }
    };

    // Recognition ends itself after a stretch of silence; restart while still enabled.
    recognition.onend = () => {
      if (!enabledRef.current) {
        setStatus('idle');
        return;
      }
      try {
        recognition.start();
      } catch {
        setStatus('idle');
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setStatus('listening');
    } catch {
      setStatus('error');
    }

    return () => {
      enabledRef.current = false;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
      setStatus('idle');
    };
  }, [enabled, locale]);

  return { status, supported, resetCursor };
}

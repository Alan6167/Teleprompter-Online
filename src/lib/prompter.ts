/**
 * Shared prompter display settings.
 *
 * Everything the reader can tune lives in one object so it can be persisted, restored and
 * reset as a unit.
 */

export type FontFamily = 'sans' | 'serif' | 'mono';
export type Alignment = 'left' | 'center' | 'right';

export interface PrompterSettings {
  speed: number; // px per second
  fontSize: number; // px
  lineHeight: number; // unitless multiplier
  fontFamily: FontFamily;
  textColor: string;
  backgroundColor: string;
  alignment: Alignment;
  mirrorH: boolean;
  mirrorV: boolean;
  countdownSeconds: number;
}

export const DEFAULT_SETTINGS: PrompterSettings = {
  speed: 80,
  fontSize: 48,
  lineHeight: 1.5,
  fontFamily: 'sans',
  textColor: '#FFFFFF',
  backgroundColor: '#000000',
  alignment: 'center',
  mirrorH: false,
  mirrorV: false,
  countdownSeconds: 3,
};

export const FONT_FAMILIES: Record<FontFamily, string> = {
  sans:
    '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  serif: '"Source Serif 4", Georgia, Cambria, "Times New Roman", Times, serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Liberation Mono", monospace',
};

/** Reader-friendly presets, ordered from most to least common on a real prompter. */
export const TEXT_COLORS = ['#FFFFFF', '#FFE066', '#9BE68A', '#8FD3FF', '#111111'] as const;
export const BACKGROUND_COLORS = ['#000000', '#0A0F1E', '#14181F', '#3A3A3A', '#FFFFFF'] as const;

export const SPEED_RANGE = { min: 10, max: 400, step: 5 } as const;
export const FONT_SIZE_RANGE = { min: 16, max: 128, step: 2 } as const;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const isHexColor = (value: unknown): value is string =>
  typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);

/**
 * Rebuild a settings object from whatever was in storage.
 *
 * Stored settings outlive the code that wrote them: a value can be missing because it was
 * added in a later release, or out of range because a slider's bounds changed. Every field
 * is validated individually and falls back to the default rather than rejecting the whole
 * object, so a reader never loses all their preferences over one bad key.
 */
export function reviveSettings(stored: unknown, fallback: PrompterSettings): PrompterSettings {
  if (!stored || typeof stored !== 'object') return fallback;
  const raw = stored as Partial<Record<keyof PrompterSettings, unknown>>;

  const num = (value: unknown, min: number, max: number, dflt: number) =>
    typeof value === 'number' && Number.isFinite(value) ? clamp(value, min, max) : dflt;

  return {
    speed: num(raw.speed, SPEED_RANGE.min, SPEED_RANGE.max, fallback.speed),
    fontSize: num(raw.fontSize, FONT_SIZE_RANGE.min, FONT_SIZE_RANGE.max, fallback.fontSize),
    lineHeight: num(raw.lineHeight, 1, 2.4, fallback.lineHeight),
    fontFamily:
      raw.fontFamily === 'sans' || raw.fontFamily === 'serif' || raw.fontFamily === 'mono'
        ? raw.fontFamily
        : fallback.fontFamily,
    textColor: isHexColor(raw.textColor) ? raw.textColor : fallback.textColor,
    backgroundColor: isHexColor(raw.backgroundColor)
      ? raw.backgroundColor
      : fallback.backgroundColor,
    alignment:
      raw.alignment === 'left' || raw.alignment === 'center' || raw.alignment === 'right'
        ? raw.alignment
        : fallback.alignment,
    mirrorH: typeof raw.mirrorH === 'boolean' ? raw.mirrorH : fallback.mirrorH,
    mirrorV: typeof raw.mirrorV === 'boolean' ? raw.mirrorV : fallback.mirrorV,
    countdownSeconds: num(raw.countdownSeconds, 0, 10, fallback.countdownSeconds),
  };
}

/** Restore a persisted draft, ignoring anything that is not a string. */
export function reviveDraft(stored: unknown, fallback: string): string {
  return typeof stored === 'string' ? stored : fallback;
}

/**
 * Words per minute implied by the current scroll speed and type size.
 *
 * A line of text occupies roughly `fontSize * lineHeight` pixels, and an average line at a
 * comfortable reading measure holds about 7 words, so the scroll rate in px/s converts to
 * words per minute as: (speed / lineHeightPx) lines per second * 7 words * 60.
 */
export function impliedWordsPerMinute(settings: PrompterSettings): number {
  const lineHeightPx = settings.fontSize * settings.lineHeight;
  if (lineHeightPx <= 0) return 0;
  const WORDS_PER_LINE = 7;
  return (settings.speed / lineHeightPx) * WORDS_PER_LINE * 60;
}

/** Scroll speed in px/s that delivers a target words-per-minute at the current type size. */
export function speedForWordsPerMinute(wpm: number, fontSize: number, lineHeight: number): number {
  const lineHeightPx = fontSize * lineHeight;
  const WORDS_PER_LINE = 7;
  return clamp(
    Math.round((wpm * lineHeightPx) / (WORDS_PER_LINE * 60)),
    SPEED_RANGE.min,
    SPEED_RANGE.max
  );
}

/** Count words in a way that works for both space-separated and CJK scripts. */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const cjk = trimmed.match(/[㐀-鿿豈-﫿぀-ヿ가-힯]/g)?.length ?? 0;
  const latin = trimmed
    .replace(/[㐀-鿿豈-﫿぀-ヿ가-힯]/g, ' ')
    .trim();
  const latinWords = latin ? latin.split(/\s+/).length : 0;
  // CJK has no word delimiters; ~1.5 characters ≈ one spoken word.
  return latinWords + Math.round(cjk / 1.5);
}

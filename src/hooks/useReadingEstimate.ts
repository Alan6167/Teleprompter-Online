'use client';

import { useCallback, useEffect, useState } from 'react';

interface ReadingEstimate {
  /** Seconds the script takes to pass the reading line at the current speed. */
  seconds: number;
  /** Words per minute that speed actually delivers, given how the text is laid out. */
  wordsPerMinute: number;
  /** Rendered height of the script itself, excluding the lead-in and lead-out padding. */
  textHeight: number;
}

/**
 * Measure the real reading pace instead of estimating it.
 *
 * A scroll speed in px/s means very different things on different screens: at the default
 * type size a phone in portrait fits about two words per line while a laptop fits five, so
 * the same 80 px/s is a relaxed 133 wpm on one and an unreadable 333 wpm on the other.
 * Any formula with a words-per-line constant baked in is therefore wrong on most devices.
 *
 * The rendered block already knows the answer: its height is exactly how far the text has
 * to travel, so duration is height / speed and the pace follows from the word count.
 */
export function useReadingEstimate(
  blockRef: React.RefObject<HTMLElement | null>,
  { speed, wordCount }: { speed: number; wordCount: number }
): ReadingEstimate {
  const [textHeight, setTextHeight] = useState(0);

  const measure = useCallback(() => {
    const el = blockRef.current;
    if (!el) return;
    // The block carries a 50vh lead-in and lead-out so the first and last lines can reach
    // the centre reading line; neither is script to read.
    const style = getComputedStyle(el);
    const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    setTextHeight(Math.max(0, el.scrollHeight - padding));
  }, [blockRef]);

  useEffect(() => {
    measure();
    const el = blockRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [blockRef, measure]);

  // Re-measure when anything that changes the layout changes.
  useEffect(() => {
    measure();
  }, [measure, wordCount]);

  const seconds = speed > 0 ? textHeight / speed : 0;
  const wordsPerMinute = seconds > 0 ? (wordCount / seconds) * 60 : 0;

  return { seconds, wordsPerMinute, textHeight };
}

/** Format a duration for display as m:ss, or "—" when there is nothing to read. */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  return `${minutes}:${String(total % 60).padStart(2, '0')}`;
}

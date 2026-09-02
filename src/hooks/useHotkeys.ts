'use client';

import { useEffect, useRef } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;
type HotkeyMap = Record<string, KeyHandler>;

/**
 * Simple hotkey hook. Keys are matched against `event.code` or `event.key`.
 * Skips events dispatched on editable elements (textarea, input) unless `ignoreInputs` is false.
 *
 * The map is held in a ref so callers can pass a fresh object literal on every render —
 * which they all do — without the window listener being torn down and re-attached each
 * time a slider moves.
 */
export function useHotkeys(
  hotkeys: HotkeyMap,
  options: { enabled?: boolean; ignoreInputs?: boolean } = {}
) {
  const { enabled = true, ignoreInputs = true } = options;

  const hotkeysRef = useRef(hotkeys);
  hotkeysRef.current = hotkeys;

  useEffect(() => {
    if (!enabled) return;

    const handler = (event: KeyboardEvent) => {
      if (ignoreInputs) {
        const target = event.target as HTMLElement | null;
        const tag = target?.tagName;
        if (tag === 'TEXTAREA' || tag === 'INPUT' || target?.isContentEditable) {
          return;
        }
      }

      for (const key of [event.code, event.key]) {
        const fn = hotkeysRef.current[key];
        if (fn) {
          fn(event);
          return;
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enabled, ignoreInputs]);
}

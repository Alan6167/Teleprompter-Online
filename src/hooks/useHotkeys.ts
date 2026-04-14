'use client';

import { useEffect } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;
type HotkeyMap = Record<string, KeyHandler>;

/**
 * Simple hotkey hook. Keys are matched against `event.code` or the `event.key`.
 * Skips events dispatched on editable elements (textarea, input) unless `ignoreInputs` is false.
 */
export function useHotkeys(hotkeys: HotkeyMap, options: { enabled?: boolean; ignoreInputs?: boolean } = {}) {
  const { enabled = true, ignoreInputs = true } = options;

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

      const keys: string[] = [event.code, event.key];
      for (const k of keys) {
        const fn = hotkeys[k];
        if (fn) {
          fn(event);
          return;
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [hotkeys, enabled, ignoreInputs]);
}

'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * State that survives a page reload by mirroring itself into localStorage.
 *
 * The first render always returns `initialValue` so the server-rendered markup and the
 * first client render agree; the stored value is applied in an effect immediately after
 * hydration. Consumers that need to know whether that has happened yet can read the
 * third tuple member.
 *
 * Writes are debounced so that typing into a large script does not hit storage on every
 * keystroke, and every storage access is guarded — private-mode browsers and full quotas
 * throw rather than returning null.
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T,
  options: { debounceMs?: number; revive?: (stored: unknown, fallback: T) => T } = {}
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const { debounceMs = 250, revive } = options;

  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  const reviveRef = useRef(revive);
  reviveRef.current = revive;
  const initialRef = useRef(initialValue);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore once, right after hydration.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) {
        const parsed: unknown = JSON.parse(raw);
        const next = reviveRef.current
          ? reviveRef.current(parsed, initialRef.current)
          : (parsed as T);
        if (next !== undefined) setValue(next);
      }
    } catch {
      // Unreadable or corrupt entry — keep the default.
    }
    setHydrated(true);
  }, [key]);

  // Persist changes, but never before the restore above has run: writing first would
  // clobber the stored value with the default.
  useEffect(() => {
    if (!hydrated) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Quota exceeded or storage disabled — the app keeps working in memory.
      }
    }, debounceMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [key, value, hydrated, debounceMs]);

  // Flush a pending debounced write when the tab goes away.
  useEffect(() => {
    if (!hydrated) return;
    const flush = () => {
      if (!timerRef.current) return;
      clearTimeout(timerRef.current);
      timerRef.current = null;
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // ignore
      }
    };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', flush);
    };
  }, [key, value, hydrated]);

  return [value, setValue, hydrated];
}

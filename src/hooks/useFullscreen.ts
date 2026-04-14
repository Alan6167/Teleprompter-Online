'use client';

import { useCallback, useEffect, useState } from 'react';

export function useFullscreen(targetRef: React.RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const enter = useCallback(async () => {
    const el = targetRef.current;
    if (!el) return;
    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      }
      // Try to lock orientation to landscape on mobile; gracefully ignore failures.
      const screenOrientation: ScreenOrientation | undefined = (screen as unknown as { orientation?: ScreenOrientation }).orientation;
      const maybeLock = (screenOrientation as ScreenOrientation & { lock?: (o: string) => Promise<void> })?.lock;
      if (typeof maybeLock === 'function') {
        try {
          await maybeLock.call(screenOrientation, 'landscape');
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore
    }
  }, [targetRef]);

  const exit = useCallback(async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        // ignore
      }
    }
  }, []);

  const toggle = useCallback(() => {
    if (document.fullscreenElement) {
      exit();
    } else {
      enter();
    }
  }, [enter, exit]);

  return { isFullscreen, enter, exit, toggle };
}

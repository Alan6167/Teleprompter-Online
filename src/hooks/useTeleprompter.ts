'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseTeleprompterOptions {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  speed: number; // pixels per second
  onEnd?: () => void;
}

export function useTeleprompter({ scrollRef, speed, onEnd }: UseTeleprompterOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const step = useCallback(
    (now: number) => {
      const el = scrollRef.current;
      if (!el) return;
      if (lastTimeRef.current == null) lastTimeRef.current = now;
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;

      el.scrollTop += (speedRef.current * dt) / 1000;

      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? Math.min(1, el.scrollTop / max) : 0;
      setProgress(p);

      if (max > 0 && el.scrollTop >= max - 0.5) {
        setIsPlaying(false);
        if (onEnd) onEnd();
        return;
      }

      rafRef.current = requestAnimationFrame(step);
    },
    [scrollRef, onEnd]
  );

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = null;
      rafRef.current = requestAnimationFrame(step);
    }
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isPlaying, step]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(() => setIsPlaying((v) => !v), []);
  const stop = useCallback(() => {
    setIsPlaying(false);
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = 0;
      setProgress(0);
    }
  }, [scrollRef]);
  const restart = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = 0;
      setProgress(0);
    }
    setIsPlaying(true);
  }, [scrollRef]);

  return { isPlaying, progress, play, pause, toggle, stop, restart };
}

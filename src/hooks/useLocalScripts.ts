'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'tpo:scripts';

export interface SavedScript {
  id: string;
  name: string;
  content: string;
  updatedAt: number;
}

function readStorage(): SavedScript[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function writeStorage(items: SavedScript[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota / unavailable storage
  }
}

export function useLocalScripts() {
  const [scripts, setScripts] = useState<SavedScript[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setScripts(readStorage());
    setHydrated(true);
  }, []);

  const saveScript = useCallback((name: string, content: string) => {
    const next: SavedScript = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim() || 'Untitled',
      content,
      updatedAt: Date.now(),
    };
    setScripts((prev) => {
      const updated = [next, ...prev].slice(0, 100);
      writeStorage(updated);
      return updated;
    });
    return next;
  }, []);

  const deleteScript = useCallback((id: string) => {
    setScripts((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      writeStorage(updated);
      return updated;
    });
  }, []);

  const renameScript = useCallback((id: string, name: string) => {
    setScripts((prev) => {
      const updated = prev.map((s) =>
        s.id === id ? { ...s, name: name.trim() || 'Untitled', updatedAt: Date.now() } : s
      );
      writeStorage(updated);
      return updated;
    });
  }, []);

  return { scripts, saveScript, deleteScript, renameScript, hydrated };
}

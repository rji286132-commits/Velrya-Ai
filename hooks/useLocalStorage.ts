'use client';
import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage after mount - fixes SSR
  useEffect(() => {
    setIsHydrated(true);
    try {
      const item = window.localStorage.getItem(`velrya-ai-${key}`);
      if (item) {
        setStored(JSON.parse(item));
      }
    } catch {
      // VELRYA AI: ignore parse errors
    }
  }, [key]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(`velrya-ai-${key}`, JSON.stringify(stored));
    } catch {
      // VELRYA AI: storage full
    }
  }, [key, stored, isHydrated]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStored((prev) => (typeof value === 'function' ? (value as any)(prev) : value));
  }, []);

  return [stored, setValue];
}

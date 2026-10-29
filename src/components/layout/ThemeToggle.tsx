'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'theme';

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return () => observer.disconnect();
}

const getSnapshot = () => document.documentElement.classList.contains('light');
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const isLight = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !isLight;
    document.documentElement.classList.toggle('light', next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'light' : 'dark');
    } catch {
      // Storage unavailable (private mode); the choice just won't persist.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      className="rounded-md p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}

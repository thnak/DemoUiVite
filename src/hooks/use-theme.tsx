import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'theme';
const TRANSITION_MS = 520; // matches CSS timing

function createCircleElement(x = 0.5, y = 0.5, toTheme: Theme) {
  const el = document.createElement('div');
  el.className = 'theme-transition-circle';
  el.setAttribute('data-theme', toTheme === 'dark' ? 'to-dark' : 'to-light');
  // set CSS custom properties for position and a base size
  el.style.setProperty('--theme-x', `${x * 100}%`);
  el.style.setProperty('--theme-y', `${y * 100}%`);
  el.style.setProperty('--theme-size', '4rem');
  // compute a scale large enough to cover viewport diagonally
  const maxDim = Math.hypot(window.innerWidth, window.innerHeight);
  const base = 64; // base circle diameter in px (4rem ~ 64px)
  const scale = Math.ceil((maxDim / base) * 1.2);
  el.style.setProperty('--theme-scale', String(scale));
  return el;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored) return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  const toggle = useCallback((opts?: { x?: number; y?: number }) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';

    if (typeof document !== 'undefined') {
      const x = opts?.x ?? 0.5;
      const y = opts?.y ?? 0.5;

      // Create soft-edge circle and animate
      const el = createCircleElement(x, y, next);
      document.documentElement.appendChild(el);

      // trigger a reflow then add animate class
       
      el.getBoundingClientRect();
      requestAnimationFrame(() => {
        el.classList.add('animate');
      });

      // Flip theme class on documentElement right away so the background/colors switch
      document.documentElement.classList.toggle('dark', next === 'dark');

      // remove the element after the animation
      window.setTimeout(() => {
        el.classList.remove('animate');
        if (el.parentNode) el.parentNode.removeChild(el);
      }, TRANSITION_MS);
    }

    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, [theme]);

  return { theme, toggle } as const;
}

import { useMemo, useState, useEffect, useContext, useCallback, createContext } from 'react';

// ----------------------------------------------------------------------

export type ThemeModeValue = 'system' | 'light' | 'dark';

export type ThemeModeContextType = {
  mode: ThemeModeValue;
  setMode: (mode: ThemeModeValue) => void;
  resolvedMode: 'light' | 'dark';
};

const STORAGE_KEY = 'theme-mode';

// Get the initial theme mode from localStorage or default to 'system'
function getInitialMode(): ThemeModeValue {
  if (typeof window === 'undefined') {
    return 'system';
  }

  const storedMode = localStorage.getItem(STORAGE_KEY);
  if (storedMode === 'light' || storedMode === 'dark' || storedMode === 'system') {
    return storedMode;
  }

  return 'system';
}

// Get the system preference
function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Resolve the mode to light or dark
function resolveMode(mode: ThemeModeValue): 'light' | 'dark' {
  if (mode === 'system') {
    return getSystemPreference();
  }
  return mode;
}

// Apply theme to document
function applyTheme(resolvedMode: 'light' | 'dark') {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-color-scheme', resolvedMode);
  }
}

// ----------------------------------------------------------------------

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

export function useThemeMode() {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }

  return context;
}

// ----------------------------------------------------------------------

type ThemeModeProviderProps = {
  children: React.ReactNode;
};

export function ThemeModeProvider({ children }: ThemeModeProviderProps) {
  const [mode, setModeState] = useState<ThemeModeValue>(getInitialMode);
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>(() => resolveMode(mode));

  const setMode = useCallback((newMode: ThemeModeValue) => {
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newMode);
    }
  }, []);

  // Update resolved mode when mode changes
  useEffect(() => {
    const newResolvedMode = resolveMode(mode);
    setResolvedMode(newResolvedMode);
    applyTheme(newResolvedMode);
  }, [mode]);

  // Listen to system preference changes when mode is 'system'
  useEffect(() => {
    if (typeof window === 'undefined' || mode !== 'system') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event: MediaQueryListEvent) => {
      const newResolvedMode = event.matches ? 'dark' : 'light';
      setResolvedMode(newResolvedMode);
      applyTheme(newResolvedMode);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      resolvedMode,
    }),
    [mode, setMode, resolvedMode]
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

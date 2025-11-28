import { useMemo, useState, useContext, useCallback, createContext } from 'react';

// ----------------------------------------------------------------------

export type NavLayoutValue = 'vertical' | 'horizontal' | 'mini';
export type NavColorValue = 'integrate' | 'apparent';
export type FontFamilyValue = 'Public Sans' | 'Inter' | 'DM Sans' | 'Nunito Sans';

export type ColorPresetValue = 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red';

export type SettingsState = {
  contrast: boolean;
  rtl: boolean;
  compact: boolean;
  navLayout: NavLayoutValue;
  navColor: NavColorValue;
  colorPreset: ColorPresetValue;
  fontFamily: FontFamilyValue;
  fontSize: number;
};

export type SettingsContextType = {
  settings: SettingsState;
  updateSettings: (key: keyof SettingsState, value: SettingsState[keyof SettingsState]) => void;
  resetSettings: () => void;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'app-settings';

const defaultSettings: SettingsState = {
  contrast: false,
  rtl: false,
  compact: false,
  navLayout: 'vertical',
  navColor: 'integrate',
  colorPreset: 'default',
  fontFamily: 'DM Sans',
  fontSize: 16,
};

function getStoredSettings(): SettingsState {
  if (typeof window === 'undefined') {
    return defaultSettings;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch {
    // Invalid stored settings
  }

  return defaultSettings;
}

function saveSettings(settings: SettingsState) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }
}

// ----------------------------------------------------------------------

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
}

// ----------------------------------------------------------------------

type SettingsProviderProps = {
  children: React.ReactNode;
};

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<SettingsState>(getStoredSettings);

  const updateSettings = useCallback(
    (key: keyof SettingsState, value: SettingsState[keyof SettingsState]) => {
      setSettings((prev) => {
        const updated = { ...prev, [key]: value };
        saveSettings(updated);
        return updated;
      });
    },
    []
  );

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
  }, []);

  const value = useMemo(
    () => ({
      settings,
      updateSettings,
      resetSettings,
    }),
    [settings, updateSettings, resetSettings]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

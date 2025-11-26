import type { ThemeProviderProps as MuiThemeProviderProps } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as ThemeVarsProvider } from '@mui/material/styles';

import { createTheme } from './create-theme';
import { useThemeMode, ThemeModeProvider } from './theme-mode-context';

import type { ThemeOptions } from './types';

// ----------------------------------------------------------------------

export type ThemeProviderProps = Partial<MuiThemeProviderProps> & {
  themeOverrides?: ThemeOptions;
};

function ThemeProviderInner({ themeOverrides, children, ...other }: ThemeProviderProps) {
  const { resolvedMode } = useThemeMode();

  const theme = createTheme({
    themeOverrides: {
      ...themeOverrides,
      defaultColorScheme: resolvedMode,
    },
  });

  return (
    <ThemeVarsProvider disableTransitionOnChange theme={theme} {...other} noSsr>
      <CssBaseline />
      {children}
    </ThemeVarsProvider>
  );
}

export function ThemeProvider({ themeOverrides, children, ...other }: ThemeProviderProps) {
  return (
    <ThemeModeProvider>
      <ThemeProviderInner themeOverrides={themeOverrides} {...other}>
        {children}
      </ThemeProviderInner>
    </ThemeModeProvider>
  );
}

import 'src/global.css';

import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { usePathname } from 'src/routes/hooks';

import { queryClient } from 'src/api';
import { NavProvider } from 'src/layouts/nav-context';
import { ThemeProvider } from 'src/theme/theme-provider';
import { TranslationManager } from 'src/services/translation';

// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  useScrollToTop();
  useTranslationSystemInit();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NavProvider>{children}</NavProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function useTranslationSystemInit() {
  useEffect(() => {
    // Initialize translation system on app mount
    TranslationManager.initialize({
      pollingInterval: 30 * 60 * 1000, // 30 minutes
      autoSync: true,
    }).catch((error) => {
      console.error('[App] Failed to initialize translation system:', error);
    });

    // Cleanup on unmount
    return () => {
      TranslationManager.terminate();
    };
  }, []);
}

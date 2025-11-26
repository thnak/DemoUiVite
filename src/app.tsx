import 'src/global.css';

import { useEffect } from 'react';

import { usePathname } from 'src/routes/hooks';

import { ThemeProvider } from 'src/theme/theme-provider';

// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};


export default function App({ children }: AppProps) {
  useScrollToTop();

  return (
    /* 
      SSR is disabled for ThemeProvider using the `noSsr` prop.
      This is necessary to avoid hydration mismatches or because the theme depends on client-only features.
      Please ensure this is intentional and update this comment if the reason changes.
    */
    <ThemeProvider noSsr>
      {children}
    </ThemeProvider>
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

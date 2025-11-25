import type { CSSObject } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';

import { MainSection } from '../core/main-section';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';

// ----------------------------------------------------------------------

export type AuthLayoutProps = {
  children?: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  const renderHeader = () => {
    const headerSlots = {
      leftArea: <Logo />,
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          <Link href="#" component={RouterLink} color="inherit" sx={{ typography: 'subtitle2' }}>
            Need help?
          </Link>
        </Box>
      ),
    };

    return (
      <HeaderSection
        disableElevation
        layoutQuery="md"
        slots={headerSlots}
        slotProps={{
          container: { maxWidth: false },
        }}
        sx={{
          bgcolor: 'transparent',
          position: { md: 'fixed' },
        }}
      />
    );
  };

  const renderMain = () => (
    <MainSection
      sx={{
        alignItems: 'center',
        p: { xs: 3, md: 10 },
        justifyContent: { md: 'center' },
      }}
    >
      <Box
        sx={{
          py: 5,
          px: 3,
          width: 1,
          zIndex: 2,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '420px',
          bgcolor: 'background.default',
        }}
      >
        {children}
      </Box>
    </MainSection>
  );

  return (
    <LayoutSection
      headerSection={renderHeader()}
      cssVars={{
        '--layout-auth-content-width': '420px',
        '--layout-header-zIndex': '1100',
        '--layout-header-mobile-height': '64px',
        '--layout-header-desktop-height': '72px',
      }}
      sx={{
        position: 'relative',
        '&::before': backgroundStyles(),
      }}
    >
      {renderMain()}
    </LayoutSection>
  );
}

// ----------------------------------------------------------------------

const backgroundStyles = (): CSSObject => ({
  zIndex: 1,
  opacity: 0.24,
  width: '100%',
  height: '100%',
  content: "''",
  position: 'absolute',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center',
  backgroundImage: 'url(/assets/background/overlay.jpg)',
});

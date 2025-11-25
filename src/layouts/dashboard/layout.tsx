import type { Theme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { Logo } from 'src/components/logo';

import { layoutClasses } from '../core/classes';
import { MainSection } from '../core/main-section';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';

// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
  children?: React.ReactNode;
};

function dashboardLayoutVars(theme: Theme) {
  return {
    '--layout-nav-zIndex': '1101',
    '--layout-nav-mobile-width': '280px',
    '--layout-nav-vertical-width': '280px',
    '--layout-header-zIndex': '1100',
    '--layout-header-mobile-height': '64px',
    '--layout-header-desktop-height': '72px',
    '--layout-transition-easing': 'linear',
    '--layout-transition-duration': '120ms',
    '--layout-dashboard-content-pt': theme.spacing(1),
    '--layout-dashboard-content-pb': theme.spacing(8),
    '--layout-dashboard-content-px': theme.spacing(5),
  };
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useTheme();

  const renderHeader = () => {
    const headerSlots = {
      leftArea: <Logo />,
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.75 } }}>
          {/* Add header components here */}
        </Box>
      ),
    };

    return (
      <HeaderSection
        disableElevation
        layoutQuery="lg"
        slots={headerSlots}
        slotProps={{
          container: {
            maxWidth: false,
            sx: { px: { xs: 2, lg: 5 } },
          },
        }}
        sx={{
          bgcolor: 'var(--palette-background-default)',
        }}
      />
    );
  };

  const renderMain = () => (
    <MainSection
      sx={{
        px: { xs: 2, lg: 5 },
        pt: 'var(--layout-dashboard-content-pt)',
        pb: 'var(--layout-dashboard-content-pb)',
      }}
    >
      {children}
    </MainSection>
  );

  return (
    <LayoutSection
      headerSection={renderHeader()}
      cssVars={dashboardLayoutVars(theme)}
      sx={{
        [`& .${layoutClasses.sidebarContainer}`]: {
          transition: theme.transitions.create(['padding-left'], {
            easing: 'var(--layout-transition-easing)',
            duration: 'var(--layout-transition-duration)',
          }),
        },
      }}
    >
      {renderMain()}
    </LayoutSection>
  );
}

import type { AppBarProps } from '@mui/material/AppBar';
import type { ContainerProps } from '@mui/material/Container';
import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';

import { layoutClasses } from './classes';

// ----------------------------------------------------------------------

export type HeaderSectionProps = AppBarProps & {
  layoutQuery?: Breakpoint;
  disableElevation?: boolean;
  slots?: {
    topArea?: React.ReactNode;
    leftArea?: React.ReactNode;
    rightArea?: React.ReactNode;
  };
  slotProps?: {
    container?: Partial<ContainerProps>;
    toolbar?: SxProps<Theme>;
  };
};

export function HeaderSection({
  sx,
  slots,
  className,
  slotProps,
  layoutQuery = 'md',
  disableElevation,
  ...other
}: HeaderSectionProps) {
  const theme = useTheme();

  const toolbarStyles: SxProps<Theme> = {
    minHeight: 'auto',
    height: 'var(--layout-header-desktop-height)',
    transition: theme.transitions.create(['height', 'background-color'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter,
    }),
    [theme.breakpoints.down(layoutQuery)]: {
      height: 'var(--layout-header-mobile-height)',
    },
    ...slotProps?.toolbar,
  };

  return (
    <AppBar
      position="sticky"
      className={mergeClasses([layoutClasses.header, className])}
      sx={[
        {
          zIndex: 'var(--layout-header-zIndex)',
          ...(disableElevation && { boxShadow: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {slots?.topArea}

      <Toolbar disableGutters sx={toolbarStyles}>
        <Container
          sx={{
            height: 1,
            display: 'flex',
            alignItems: 'center',
          }}
          {...slotProps?.container}
        >
          {slots?.leftArea}

          <Box sx={{ display: 'flex', flex: '1 1 auto', justifyContent: 'center' }} />

          {slots?.rightArea}
        </Container>
      </Toolbar>
    </AppBar>
  );
}

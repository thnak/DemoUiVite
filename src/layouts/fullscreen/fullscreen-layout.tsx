import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

/**
 * Fullscreen Layout for OI Module
 * No header, no sidebar - just full content
 */

export type FullscreenLayoutProps = BoxProps;

export function FullscreenLayout({ children, sx, ...other }: FullscreenLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

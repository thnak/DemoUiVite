import type { BoxProps } from '@mui/material/Box';

import { mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';

import { layoutClasses } from './classes';

// ----------------------------------------------------------------------

export type MainSectionProps = BoxProps;

export function MainSection({ children, className, sx, ...other }: MainSectionProps) {
  return (
    <Box
      component="main"
      className={mergeClasses([layoutClasses.main, className])}
      sx={[
        {
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {children}
    </Box>
  );
}

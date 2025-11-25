import type { Theme, SxProps } from '@mui/material/styles';

import { mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import GlobalStyles from '@mui/material/GlobalStyles';

import { layoutClasses } from './classes';

// ----------------------------------------------------------------------

export type LayoutSectionProps = React.ComponentProps<typeof Box> & {
  sx?: SxProps<Theme>;
  cssVars?: Record<string, string | number>;
  children?: React.ReactNode;
  sidebarSection?: React.ReactNode;
  headerSection?: React.ReactNode;
  footerSection?: React.ReactNode;
};

export function LayoutSection({
  sx,
  cssVars,
  children,
  className,
  sidebarSection,
  headerSection,
  footerSection,
  ...other
}: LayoutSectionProps) {
  const inputGlobalStyles = (
    <GlobalStyles
      styles={{
        body: {
          ...cssVars,
        },
      }}
    />
  );

  return (
    <>
      {inputGlobalStyles}

      <Box
        id="root__layout"
        className={mergeClasses([
          layoutClasses.root,
          sidebarSection ? layoutClasses.hasSidebar : undefined,
          className,
        ])}
        sx={sx}
        {...other}
      >
        {sidebarSection}

        <Box className={layoutClasses.sidebarContainer}>
          {headerSection}
          {children}
          {footerSection}
        </Box>
      </Box>
    </>
  );
}

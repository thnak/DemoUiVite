import type { CardProps } from '@mui/material/Card';
import type { PaletteColorKey } from 'src/theme/core';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { fShortenNumber } from 'src/utils/format-number';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title: string;
  value: number;
  subtitle?: string;
  unit?: string;
  color?: PaletteColorKey;
  icon: React.ReactNode;
};

export function DowntimeSummaryWidget({
  title,
  value,
  subtitle,
  unit = 'hrs',
  color = 'primary',
  icon,
  sx,
  ...other
}: Props) {
  const theme = useTheme();

  // Convert minutes to hours for display
  const displayValue = value / 60;

  return (
    <Card
      sx={[
        () => ({
          p: 3,
          boxShadow: 'none',
          position: 'relative',
          color: `${color}.darker`,
          backgroundColor: 'common.white',
          backgroundImage: `linear-gradient(135deg, ${varAlpha(theme.vars.palette[color].lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette[color].lightChannel, 0.48)})`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ width: 48, height: 48, mb: 3 }}>{icon}</Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 112 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h3">
            {fShortenNumber(displayValue)}
            <Typography
              component="span"
              variant="subtitle1"
              sx={{ ml: 0.5, color: 'text.secondary' }}
            >
              {unit}
            </Typography>
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      <SvgColor
        src="/assets/background/shape-square.svg"
        sx={{
          top: 0,
          left: -20,
          width: 240,
          zIndex: -1,
          height: 240,
          opacity: 0.24,
          position: 'absolute',
          color: `${color}.main`,
        }}
      />
    </Card>
  );
}

import type { CardProps } from '@mui/material/Card';
import type { PaletteColorKey } from 'src/theme/core';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { fPercent } from 'src/utils/format-number';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title: string;
  value: number;
  color?: PaletteColorKey;
  icon: React.ReactNode;
  subtitle?: string;
};

export function OEEWidgetSummary({
  sx,
  icon,
  title,
  value,
  subtitle,
  color = 'primary',
  ...other
}: Props) {
  const theme = useTheme();

  const getStatusColor = (val: number): PaletteColorKey => {
    if (val >= 85) return 'success';
    if (val >= 60) return 'warning';
    return 'error';
  };

  const statusColor = color === 'primary' ? getStatusColor(value) : color;

  return (
    <Card
      sx={[
        () => ({
          p: 3,
          boxShadow: 'none',
          position: 'relative',
          color: `${statusColor}.darker`,
          backgroundColor: 'common.white',
          backgroundImage: `linear-gradient(135deg, ${varAlpha(theme.vars.palette[statusColor].lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette[statusColor].lightChannel, 0.48)})`,
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
          <Typography variant="h3">{fPercent(value)}</Typography>
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
          color: `${statusColor}.main`,
        }}
      />
    </Card>
  );
}

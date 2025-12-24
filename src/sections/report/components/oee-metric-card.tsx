import type { ReactNode } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type OEEMetricCardProps = {
  title: string;
  value: number;
  unit?: string;
  icon: string;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  children?: ReactNode;
};

export function OEEMetricCard({
  title,
  value,
  unit = '%',
  icon,
  color = 'primary',
  trend,
  subtitle,
  onClick,
  size = 'medium',
  children,
}: OEEMetricCardProps) {
  const theme = useTheme();

  const getCardHeight = () => {
    switch (size) {
      case 'small':
        return 180;
      case 'large':
        return 320;
      default:
        return 240;
    }
  };

  const getValueSize = () => {
    switch (size) {
      case 'small':
        return 'h3';
      case 'large':
        return 'h1';
      default:
        return 'h2';
    }
  };

  const getStatusColor = () => {
    if (value >= 85) return theme.palette.success.main;
    if (value >= 70) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const statusColor = color === 'primary' ? getStatusColor() : theme.palette[color].main;

  return (
    <Card
      sx={{
        p: 3,
        height: getCardHeight(),
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': onClick
          ? {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[12],
            }
          : {},
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          bgcolor: statusColor,
        },
      }}
      onClick={onClick}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {title}
        </Typography>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(statusColor, 0.12),
          }}
        >
          <Iconify icon={icon as any} width={28} sx={{ color: statusColor }} />
        </Box>
      </Stack>

      {/* Value */}
      <Stack spacing={0.5} sx={{ flex: 1 }}>
        <Stack direction="row" alignItems="baseline" spacing={1}>
          <Typography variant={getValueSize()} sx={{ fontWeight: 700, color: statusColor }}>
            {value.toFixed(1)}
          </Typography>
          <Typography variant="h5" sx={{ color: 'text.secondary' }}>
            {unit}
          </Typography>
        </Stack>

        {subtitle && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        )}

        {trend && (
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
            <Iconify
              icon={trend.isPositive ? 'eva:trending-up-fill' : 'eva:trending-down-fill'}
              width={20}
              sx={{ color: trend.isPositive ? 'success.main' : 'error.main' }}
            />
            <Typography
              variant="body2"
              sx={{
                color: trend.isPositive ? 'success.main' : 'error.main',
                fontWeight: 600,
              }}
            >
              {Math.abs(trend.value).toFixed(1)}%
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              vs last period
            </Typography>
          </Stack>
        )}
      </Stack>

      {/* Custom content */}
      {children && <Box sx={{ mt: 2 }}>{children}</Box>}
    </Card>
  );
}

import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { fCurrency, fPercent, fShortenNumber } from 'src/utils/format-number';

import { Iconify, type IconifyName } from 'src/components/iconify';

import type { StatCardData } from './sales-report-data';

// ----------------------------------------------------------------------

const iconMap: Record<string, IconifyName> = {
  sales: 'mdi:currency-usd',
  orders: 'mdi:package-variant-closed',
  visitor: 'mdi:account-group',
  products: 'mdi:cube',
};

type StatCardProps = CardProps & {
  stat: StatCardData;
};

export function StatCard({ stat, sx, ...other }: StatCardProps) {
  const isPositive = stat.percentChange >= 0;

  return (
    <Card
      sx={[
        {
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          bgcolor: 'background.paper',
          borderRadius: 2,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {/* Icon with circle background and badge */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: `${stat.color}.lighter`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Iconify
            icon={iconMap[stat.icon]}
            width={28}
            sx={{ color: `${stat.color}.main` }}
          />
        </Box>

        {/* Percent change badge */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.5,
            borderRadius: 1,
            bgcolor: isPositive ? 'success.lighter' : 'error.lighter',
            color: isPositive ? 'success.dark' : 'error.dark',
          }}
        >
          <Iconify
            width={16}
            icon={isPositive ? 'eva:trending-up-fill' : 'eva:trending-down-fill'}
          />
          <Typography variant="caption" fontWeight={600}>
            {isPositive ? '+' : ''}{fPercent(stat.percentChange)}
          </Typography>
        </Box>
      </Box>

      {/* Title */}
      <Typography
        variant="subtitle2"
        sx={{
          mb: 0.5,
          color: `${stat.color}.main`,
          fontWeight: 600,
        }}
      >
        {stat.title}
      </Typography>

      {/* Value */}
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        {stat.icon === 'sales' ? fCurrency(stat.value) : fShortenNumber(stat.value)}
      </Typography>

      {/* Description */}
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary' }}
      >
        {stat.description}
      </Typography>
    </Card>
  );
}

import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { fNumber, fPercent, fShortenNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';

import { SvgColor } from '../../components/svg-color';

import type { MetricData } from './demo-dashboard-data';

// ----------------------------------------------------------------------

type MetricCardProps = CardProps & {
  metric: MetricData;
};

export function MetricCard({ metric, sx, ...other }: MetricCardProps) {
  const theme = useTheme();

  const chartColors = [theme.palette[metric.color].dark];

  const chartOptions: ChartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    xaxis: { categories: metric.sparklineData.map((_, i) => `W${i + 1}`) },
    grid: {
      padding: {
        top: 6,
        left: 6,
        right: 6,
        bottom: 6,
      },
    },
    tooltip: {
      y: { formatter: (value: number) => fNumber(value), title: { formatter: () => '' } },
    },
    markers: {
      strokeWidth: 0,
    },
  });

  const renderTrending = () => (
    <Box
      sx={{
        top: 16,
        gap: 0.5,
        right: 16,
        display: 'flex',
        position: 'absolute',
        alignItems: 'center',
      }}
    >
      <Iconify
        width={20}
        icon={metric.percentChange < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'}
      />
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {metric.percentChange > 0 && '+'}
        {fPercent(metric.percentChange)}
      </Box>
    </Box>
  );

  return (
    <Card
      sx={[
        () => ({
          p: 3,
          boxShadow: 'none',
          position: 'relative',
          color: `${metric.color}.darker`,
          backgroundColor: 'common.white',
          backgroundImage: `linear-gradient(135deg, ${varAlpha(theme.vars.palette[metric.color].lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette[metric.color].lightChannel, 0.48)})`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ width: 48, height: 48, mb: 3 }}>
        <img alt={metric.title} src={metric.icon} style={{ width: 48, height: 48 }} />
      </Box>

      {renderTrending()}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 112 }}>
          <Box sx={{ mb: 1, typography: 'subtitle2' }}>{metric.title}</Box>

          <Box sx={{ typography: 'h4' }}>{fShortenNumber(metric.value)}</Box>
        </Box>

        <Chart
          type="line"
          series={[{ data: metric.sparklineData }]}
          options={chartOptions}
          sx={{ width: 84, height: 56 }}
        />
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
          color: `${varAlpha(theme.vars.palette[metric.color].lighterChannel, 0.8)}.main`,
        }}
      />
    </Card>
  );
}

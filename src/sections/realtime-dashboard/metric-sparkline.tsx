/**
 * Real-Time Sparkline Chart
 * Shows historical trend for a metric
 */

import type { MetricConfig } from 'src/services/realtime/types';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { useMetricHistory } from 'src/hooks/use-metric-history';

import { Chart, useChart } from 'src/components/chart';

interface MetricSparklineProps {
  config: MetricConfig;
}

export function MetricSparkline({ config }: MetricSparklineProps) {
  const theme = useTheme();
  const { history, current, min, max, avg } = useMetricHistory(config.id, {
    maxPoints: 50,
    throttleMs: config.refreshInterval,
  });

  const chartData = useMemo(
    () => ({
      categories: history.map((point) => new Date(point.timestamp).toLocaleTimeString()),
      series: [
        {
          name: config.name,
          data: history.map((point) => point.value),
        },
      ],
    }),
    [history, config.name]
  );

  const chartOptions = useChart({
    chart: {
      sparkline: { enabled: true },
      animations: { enabled: true, dynamicAnimation: { speed: 300 } },
    },
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    colors: [theme.palette.primary.main],
    xaxis: {
      categories: chartData.categories,
    },
    yaxis: {
      min,
      max,
    },
    tooltip: {
      x: { show: true },
      y: {
        formatter: (value: number) => `${value.toFixed(2)} ${config.unit ?? ''}`,
      },
    },
  });

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={config.name}
        subheader={`Current: ${current?.toFixed(2) ?? '--'} ${config.unit ?? ''}`}
      />
      <CardContent>
        <Box sx={{ mb: 2, height: 120 }}>
          <Chart type="line" series={chartData.series} options={chartOptions} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ color: 'text.secondary', fontSize: 12 }}>Min</Box>
            <Box sx={{ fontWeight: 600, color: 'info.main' }}>
              {min.toFixed(2)} {config.unit}
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ color: 'text.secondary', fontSize: 12 }}>Avg</Box>
            <Box sx={{ fontWeight: 600, color: 'text.primary' }}>
              {avg.toFixed(2)} {config.unit}
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ color: 'text.secondary', fontSize: 12 }}>Max</Box>
            <Box sx={{ fontWeight: 600, color: 'error.main' }}>
              {max.toFixed(2)} {config.unit}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

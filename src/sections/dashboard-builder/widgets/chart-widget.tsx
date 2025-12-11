import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import { Chart, useChart } from 'src/components/chart';

import type { ChartWidgetConfig } from '../types';

// ----------------------------------------------------------------------

type ChartWidgetProps = CardProps & {
  config: ChartWidgetConfig;
};

export function ChartWidget({ config, sx, ...other }: ChartWidgetProps) {
  const chartOptions = useChart({
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    xaxis: {
      categories: config.categories ?? [],
    },
    ...config.options,
  });

  // Determine if this is an axis chart or non-axis chart
  const isNonAxisChart = ['pie', 'donut', 'radialBar'].includes(config.chartType);

  const chartSx = isNonAxisChart ? { height: '100%', mx: 'auto' } : { height: '100%' };

  return (
    <Card
      sx={[
        {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <CardHeader title={config.title} sx={{ pb: 1 }} />
      <Box
        sx={{
          flex: 1,
          p: 2,
          pt: 0,
          minHeight: 0,
        }}
      >
        <Chart type={config.chartType} series={config.series} options={chartOptions} sx={chartSx} />
      </Box>
    </Card>
  );
}

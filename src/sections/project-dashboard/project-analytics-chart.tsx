import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Chart, useChart } from 'src/components/chart';

import type { WeeklyAnalyticsData } from './project-dashboard-data';

// ----------------------------------------------------------------------

type ProjectAnalyticsChartProps = CardProps & {
  title?: string;
  subheader?: string;
  data: WeeklyAnalyticsData[];
};

export function ProjectAnalyticsChart({
  title = 'Project Analytics',
  subheader,
  data,
  sx,
  ...other
}: ProjectAnalyticsChartProps) {
  const theme = useTheme();

  const chartColors = [theme.palette.success.main];

  const categories = data.map((item) => item.day);
  const seriesData = data.map((item) => item.value);

  // Find max value index for highlighting
  const maxValue = Math.max(...seriesData);
  const maxIndex = seriesData.indexOf(maxValue);

  const chartOptions: ChartOptions = useChart({
    chart: {
      type: 'bar',
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    colors: chartColors,
    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 6,
        borderRadiusApplication: 'end',
        distributed: false,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number, opts) => {
        if (opts.dataPointIndex === maxIndex) {
          return `${Math.round((val / 100) * 100)}%`;
        }
        return '';
      },
      offsetY: -20,
      style: {
        fontSize: '11px',
        colors: [theme.palette.text.primary],
      },
    },
    fill: {
      type: 'pattern',
      pattern: {
        style: 'verticalLines',
        width: 4,
        height: 4,
        strokeWidth: 2,
      },
      colors: chartColors,
    },
    grid: {
      show: false,
      padding: { top: 20, right: 0, bottom: 0, left: 0 },
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: Array(7).fill(theme.palette.text.secondary),
          fontSize: '12px',
          fontWeight: 500,
        },
      },
    },
    yaxis: { show: false },
    tooltip: {
      y: { formatter: (value: number) => `${value}%` },
    },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
  });

  return (
    <Card
      sx={[
        {
          p: 2.5,
          borderRadius: 3,
          bgcolor: alpha(theme.palette.success.lighter, 0.4),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>

      <Chart type="bar" series={[{ data: seriesData }]} options={chartOptions} sx={{ height: 180 }} />
    </Card>
  );
}

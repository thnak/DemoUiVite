import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart } from 'src/components/chart';

import type { GenderSalesData } from './demo-dashboard-data';

// ----------------------------------------------------------------------

type CircularRingsChartProps = CardProps & {
  title: string;
  subheader?: string;
  data: GenderSalesData[];
  total: number;
};

export function CircularRingsChart({
  title,
  subheader,
  data,
  total,
  sx,
  ...other
}: CircularRingsChartProps) {
  const theme = useTheme();

  const chartSeries = data.map((item) => item.value);
  const chartColors = data.map((item) => item.color);

  const chartOptions: ChartOptions = useChart({
    chart: {
      sparkline: { enabled: true },
    },
    colors: chartColors,
    labels: data.map((item) => item.label),
    stroke: { width: 0 },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        opacityFrom: 1,
        opacityTo: 0.8,
        stops: [0, 100],
      },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 10,
          size: '32%',
        },
        track: {
          margin: 10,
          background: theme.vars.palette.grey[200],
        },
        dataLabels: {
          name: {
            fontSize: '14px',
            fontWeight: 500,
          },
          value: {
            fontSize: '18px',
            fontWeight: 700,
            formatter: (val: number) => `${val}%`,
          },
          total: {
            show: true,
            label: 'Total',
            fontSize: '14px',
            fontWeight: 500,
            color: theme.vars.palette.text.secondary,
            formatter: () => fNumber(total),
          },
        },
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      labels: {
        colors: theme.vars.palette.text.primary,
      },
      markers: {
        shape: 'circle',
      },
      itemMargin: {
        horizontal: 12,
        vertical: 8,
      },
    },
  });

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Chart
          type="radialBar"
          series={chartSeries}
          options={chartOptions}
          sx={{ width: 280, height: 280 }}
        />
      </Box>
    </Card>
  );
}

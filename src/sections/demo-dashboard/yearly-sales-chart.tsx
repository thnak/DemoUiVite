import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart } from 'src/components/chart';

import type { MonthlySalesData } from './demo-dashboard-data';

// ----------------------------------------------------------------------

type YearlySalesChartProps = CardProps & {
  title: string;
  subheader?: string;
  data: MonthlySalesData[];
};

export function YearlySalesChart({ title, subheader, data, sx, ...other }: YearlySalesChartProps) {
  const theme = useTheme();

  const categories = data.map((item) => item.month);
  const incomeData = data.map((item) => item.income);
  const expensesData = data.map((item) => item.expenses);

  const chartOptions: ChartOptions = useChart({
    colors: [theme.palette.success.main, theme.palette.warning.main],
    fill: {
      type: 'gradient',
      gradient: {
        type: 'vertical',
        shadeIntensity: 0.5,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `$${fNumber(value)}`,
      },
    },
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: theme.vars.palette.text.primary,
      },
      markers: {
        shape: 'circle',
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => `$${fNumber(value)}`,
      },
    },
    grid: {
      strokeDashArray: 3,
      borderColor: theme.vars.palette.divider,
    },
  });

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pt: 1 }}>
        <Chart
          type="area"
          series={[
            { name: 'Total income', data: incomeData },
            { name: 'Total expenses', data: expensesData },
          ]}
          options={chartOptions}
          sx={{ height: 320 }}
        />
      </Box>
    </Card>
  );
}

import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';
import type { DailyDowntimeData, MonthlyDowntimeData } from 'src/_mock';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  data: MonthlyDowntimeData[] | DailyDowntimeData[];
  viewType: 'monthly' | 'daily';
};

function isMonthlyData(item: MonthlyDowntimeData | DailyDowntimeData): item is MonthlyDowntimeData {
  return 'month' in item;
}

export function DowntimeTimelineChart({ title, subheader, data, viewType, sx, ...other }: Props) {
  const theme = useTheme();

  const categories = data.map((item) =>
    isMonthlyData(item) ? item.month.substring(0, 3) : `Day ${item.dayNumber}`
  );

  const uptimeData = data.map((item) => Math.round((item.totalUptimeMinutes / 60) * 10) / 10);
  const downtimeData = data.map((item) => Math.round((item.totalDowntimeMinutes / 60) * 10) / 10);
  const breakTimeData = data.map((item) => Math.round((item.breakTimeMinutes / 60) * 10) / 10);

  const chartOptions: ChartOptions = useChart({
    chart: {
      stacked: true,
    },
    colors: [
      theme.palette.success.main,
      theme.palette.error.main,
      hexAlpha(theme.palette.grey[500], 0.5),
    ],
    plotOptions: {
      bar: {
        columnWidth: '60%',
        borderRadius: 4,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: theme.vars.palette.text.secondary,
        },
      },
    },
    yaxis: {
      title: { text: 'Hours' },
      labels: {
        formatter: (value: number) => `${fNumber(value)}`,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => `${fNumber(value)} hours`,
      },
    },
    legend: {
      show: true,
      position: 'top',
      labels: {
        colors: theme.vars.palette.text.primary,
      },
    },
    dataLabels: {
      enabled: false,
    },
  });

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Chart
        type="bar"
        series={[
          { name: 'Uptime', data: uptimeData },
          { name: 'Downtime', data: downtimeData },
          { name: 'Break Time', data: breakTimeData },
        ]}
        options={chartOptions}
        slotProps={{ loading: { p: 2.5 } }}
        sx={{
          pl: 1,
          py: 2.5,
          pr: 2.5,
          height: 400,
        }}
      />
    </Card>
  );
}

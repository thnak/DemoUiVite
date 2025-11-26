import type { CardProps } from '@mui/material/Card';
import type { DowntimeReasonCategory } from 'src/_mock';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  data: Record<DowntimeReasonCategory, number>;
};

const REASON_COLORS: Record<DowntimeReasonCategory, string> = {
  'Material Issue': '#FF6B6B',
  'Human Resource': '#4ECDC4',
  Technical: '#FFE66D',
  'Planned Maintenance': '#95E1D3',
  'Quality Issue': '#F38181',
  External: '#AA96DA',
  'Setup/Changeover': '#A8D8EA',
  Utilities: '#FCBAD3',
};

export function DowntimeByReasonChart({ title, subheader, data, sx, ...other }: Props) {
  const theme = useTheme();

  // Convert to sorted array
  const sortedData = Object.entries(data)
    .map(([reason, minutes]) => ({
      reason: reason as DowntimeReasonCategory,
      minutes,
      hours: Math.round((minutes / 60) * 10) / 10,
    }))
    .sort((a, b) => b.minutes - a.minutes);

  const categories = sortedData.map((item) => item.reason);
  const series = sortedData.map((item) => item.hours);
  const colors = sortedData.map((item) => REASON_COLORS[item.reason]);

  const chartOptions: ChartOptions = useChart({
    colors,
    chart: {
      stacked: false,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '60%',
        borderRadius: 4,
        distributed: true,
      },
    },
    xaxis: {
      categories,
      labels: {
        formatter: (value: string) => `${value} hrs`,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.vars.palette.text.secondary,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${fNumber(value)} hours`,
      },
    },
    legend: { show: false },
    dataLabels: {
      enabled: true,
      formatter: (value: number) => `${fNumber(value)} hrs`,
      style: {
        colors: [hexAlpha(theme.palette.common.white, 0.9)],
      },
    },
  });

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Chart
        type="bar"
        series={[{ name: 'Downtime', data: series }]}
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

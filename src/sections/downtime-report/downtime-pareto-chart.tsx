import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type ParetoItem = {
  name: string;
  value: number;
};

type Props = CardProps & {
  title?: string;
  subheader?: string;
  data: ParetoItem[];
  valueLabel?: string;
};

export function DowntimeParetoChart({
  title,
  subheader,
  data,
  valueLabel = 'Downtime',
  sx,
  ...other
}: Props) {
  const theme = useTheme();

  // Sort by value descending
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  // Calculate cumulative percentage
  const total = sortedData.reduce((sum, item) => sum + item.value, 0);
  let cumulative = 0;
  const cumulativeData = sortedData.map((item) => {
    cumulative += item.value;
    return Math.round((cumulative / total) * 100);
  });

  const categories = sortedData.map((item) => item.name);
  const values = sortedData.map((item) => Math.round((item.value / 60) * 10) / 10);

  const chartOptions: ChartOptions = useChart({
    chart: {
      stacked: false,
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        borderRadius: 4,
      },
    },
    stroke: {
      width: [0, 3],
      curve: 'smooth',
    },
    colors: [theme.palette.primary.main, theme.palette.warning.main],
    xaxis: {
      categories,
      labels: {
        rotate: -45,
        style: {
          colors: theme.vars.palette.text.secondary,
          fontSize: '11px',
        },
      },
    },
    yaxis: [
      {
        title: { text: 'Hours' },
        labels: {
          formatter: (value: number) => `${fNumber(value)}`,
        },
      },
      {
        opposite: true,
        title: { text: 'Cumulative %' },
        min: 0,
        max: 100,
        labels: {
          formatter: (value: number) => `${value}%`,
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number, { seriesIndex }) =>
          seriesIndex === 0 ? `${fNumber(value)} hours` : `${value}%`,
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
    markers: {
      size: 5,
      colors: [theme.palette.warning.main],
      strokeColors: hexAlpha(theme.palette.common.white, 0.9),
      strokeWidth: 2,
    },
  });

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Chart
        type="line"
        series={[
          { name: valueLabel, type: 'column', data: values },
          { name: 'Cumulative %', type: 'line', data: cumulativeData },
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

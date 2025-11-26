import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { Chart, useChart } from 'src/components/chart';

import type { DataActivityYear } from './file-dashboard-data';

// ----------------------------------------------------------------------

type DataActivityChartProps = CardProps & {
  title: string;
  data: DataActivityYear[];
};

export function DataActivityChart({ title, data, sx, ...other }: DataActivityChartProps) {
  const theme = useTheme();

  const categories = data.map((item) => item.year);
  const imagesData = data.map((item) => item.images);
  const mediaData = data.map((item) => item.media);
  const documentsData = data.map((item) => item.documents);
  const otherData = data.map((item) => item.other);

  const chartColors = ['#00AB55', '#FF5630', '#FFAB00', '#919EAB'];

  const chartOptions: ChartOptions = useChart({
    chart: {
      stacked: true,
    },
    colors: chartColors,
    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 4,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
      },
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${value}`,
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      labels: {
        colors: theme.vars.palette.text.primary,
      },
      markers: {
        shape: 'circle',
      },
      itemMargin: {
        horizontal: 12,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    grid: {
      strokeDashArray: 3,
      borderColor: theme.vars.palette.divider,
    },
  });

  return (
    <Card sx={sx} {...other}>
      <CardHeader
        title={title}
        action={
          <Select defaultValue="yearly" size="small" sx={{ minWidth: 100 }}>
            <MenuItem value="yearly">Yearly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
          </Select>
        }
      />

      <Box sx={{ p: 3, pt: 1 }}>
        <Chart
          type="bar"
          series={[
            { name: 'Images', data: imagesData },
            { name: 'Media', data: mediaData },
            { name: 'Documents', data: documentsData },
            { name: 'Other', data: otherData },
          ]}
          options={chartOptions}
          sx={{ height: 320 }}
        />
      </Box>
    </Card>
  );
}

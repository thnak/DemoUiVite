import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { fNumber, fShortenNumber } from 'src/utils/format-number';

import { Chart, useChart } from 'src/components/chart';

import type { CustomerHabbitsMonthlyData, CustomerHabbitsSummary } from './sales-report-data';

// ----------------------------------------------------------------------

type CustomerHabbitsProps = CardProps & {
  data: CustomerHabbitsMonthlyData[];
  summary: CustomerHabbitsSummary;
};

export function CustomerHabbits({ data, summary, sx, ...other }: CustomerHabbitsProps) {
  const theme = useTheme();

  const categories = data.map((item) => item.month);
  const seenProductData = data.map((item) => item.seenProduct);
  const salesData = data.map((item) => item.sales);

  const chartOptions: ChartOptions = useChart({
    colors: [theme.palette.grey[300], theme.palette.primary.main],
    chart: {
      stacked: false,
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${fShortenNumber(value)}`,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 4,
      },
    },
    stroke: {
      width: 0,
    },
    legend: {
      show: false,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => fNumber(value),
      },
    },
    grid: {
      strokeDashArray: 3,
      borderColor: theme.vars.palette.divider,
    },
    dataLabels: {
      enabled: false,
    },
  });

  return (
    <Card
      sx={[
        {
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h6">Customer Habbits</Typography>
          <Typography variant="body2" color="text.secondary">
            Track your customer habbits
          </Typography>
        </Box>
        <Select
          size="small"
          defaultValue="year"
          sx={{ minWidth: 110 }}
        >
          <MenuItem value="year">This year</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
          <MenuItem value="week">This Week</MenuItem>
        </Select>
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'grey.300',
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Seen product
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'primary.main',
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Sales
          </Typography>
        </Box>

        {/* Summary badges */}
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              bgcolor: 'grey.100',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'grey.400',
              }}
            />
            <Typography variant="caption" fontWeight={600}>
              {fShortenNumber(summary.seenProductTotal)} Products
            </Typography>
          </Box>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              bgcolor: 'primary.lighter',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'primary.main',
              }}
            />
            <Typography variant="caption" fontWeight={600} color="primary.dark">
              {fShortenNumber(summary.salesTotal)} Products
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Chart */}
      <Box sx={{ flexGrow: 1 }}>
        <Chart
          type="bar"
          series={[
            { name: 'Seen product', data: seenProductData },
            { name: 'Sales', data: salesData },
          ]}
          options={chartOptions}
          sx={{ height: 280 }}
        />
      </Box>
    </Card>
  );
}

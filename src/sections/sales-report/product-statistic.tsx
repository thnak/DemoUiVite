import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { fNumber, fPercent, fShortenNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';

import type { ProductStatisticData } from './sales-report-data';

// ----------------------------------------------------------------------

type ProductStatisticProps = CardProps & {
  data: ProductStatisticData;
};

export function ProductStatistic({ data, sx, ...other }: ProductStatisticProps) {
  const theme = useTheme();

  const chartColors = [
    theme.palette.primary.main,
    theme.palette.primary.light,
    theme.palette.primary.lighter,
    theme.palette.grey[200],
  ];

  // Create chart series for donut chart
  const chartSeries = data.categories.map((cat) => cat.value);
  const remaining = data.totalSales - chartSeries.reduce((a, b) => a + b, 0);
  chartSeries.push(remaining > 0 ? remaining : 0);

  const chartOptions: ChartOptions = useChart({
    chart: {
      sparkline: { enabled: true },
    },
    colors: chartColors,
    labels: [...data.categories.map((cat) => cat.name), 'Other'],
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 700,
              color: theme.palette.text.primary,
              formatter: () => fShortenNumber(data.totalSales),
            },
            total: {
              show: true,
              label: 'Products Sales',
              fontSize: '12px',
              fontWeight: 400,
              color: theme.palette.text.secondary,
              formatter: () => fShortenNumber(data.totalSales),
            },
          },
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (value: number) => fNumber(value),
      },
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h6">Product Statistic</Typography>
          <Typography variant="body2" color="text.secondary">
            Track your product sales
          </Typography>
        </Box>
        <Select
          size="small"
          defaultValue="today"
          sx={{ minWidth: 100 }}
        >
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="week">This Week</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
        </Select>
      </Box>

      {/* Chart */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <Chart
          type="donut"
          series={chartSeries}
          options={chartOptions}
          sx={{ width: 180, height: 180 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          <Iconify
            icon="eva:trending-up-fill"
            width={16}
            sx={{ color: 'success.main' }}
          />
          <Typography variant="caption" color="success.main" fontWeight={600}>
            +{fPercent(data.percentChange)}
          </Typography>
        </Box>
      </Box>

      {/* Categories */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {data.categories.map((category) => (
          <Box
            key={category.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Iconify icon={category.icon} width={20} sx={{ color: 'text.secondary' }} />
              <Typography variant="body2">{category.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2">{fShortenNumber(category.value)}</Typography>
              <Typography
                variant="caption"
                sx={{
                  color: category.percentChange >= 0 ? 'success.main' : 'error.main',
                  fontWeight: 600,
                }}
              >
                {category.percentChange >= 0 ? '+' : ''}{fPercent(category.percentChange)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
}

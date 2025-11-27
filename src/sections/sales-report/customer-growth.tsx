import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { fNumber, fShortenNumber } from 'src/utils/format-number';

import { Chart, useChart } from 'src/components/chart';

import type { CustomerGrowthData } from './sales-report-data';

// ----------------------------------------------------------------------

type CustomerGrowthProps = CardProps & {
  data: CustomerGrowthData;
};

export function CustomerGrowth({ data, sx, ...other }: CustomerGrowthProps) {
  const chartColors = data.countries.map((c) => c.color);
  const chartSeries = data.countries.map((c) => c.value);

  const chartOptions: ChartOptions = useChart({
    chart: {
      sparkline: { enabled: true },
    },
    colors: chartColors,
    labels: data.countries.map((c) => c.name),
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: false,
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h6">Customer Growth</Typography>
          <Typography variant="body2" color="text.secondary">
            Track customer by locations
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

      {/* Chart and Values */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          mb: 3,
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Chart
            type="donut"
            series={chartSeries}
            options={chartOptions}
            sx={{ width: 200, height: 200 }}
          />
          {/* Values overlaid on chart */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" fontWeight={700}>
              {fShortenNumber(data.total)}
            </Typography>
          </Box>
          {/* Country value labels positioned around the chart */}
          {data.countries.length >= 4 && (
            <>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%) translateY(-50%)',
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: data.countries[0].color,
                    color: 'white',
                    fontWeight: 700,
                  }}
                >
                  {fShortenNumber(data.countries[0].value)}
                </Typography>
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 0,
                  transform: 'translateY(-50%) translateX(50%)',
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: data.countries[1].color,
                    color: 'white',
                    fontWeight: 700,
                  }}
                >
                  {fShortenNumber(data.countries[1].value)}
                </Typography>
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%) translateY(50%)',
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: data.countries[2].color,
                    color: 'white',
                    fontWeight: 700,
                  }}
                >
                  {fShortenNumber(data.countries[2].value)}
                </Typography>
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  transform: 'translateY(-50%) translateX(-50%)',
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: data.countries[3].color,
                    color: 'white',
                    fontWeight: 700,
                  }}
                >
                  {fShortenNumber(data.countries[3].value)}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Country Legend */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {data.countries.map((country) => (
          <Box
            key={country.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: country.color,
              }}
            />
            <Typography variant="body2">{country.name}</Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
}

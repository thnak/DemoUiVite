import type { ApexOptions } from 'apexcharts';

import Chart from 'react-apexcharts';

import Box from '@mui/material/Box';

interface OEEAPQChartProps {
  oee: number;
  availability: number;
  performance: number;
  quality: number;
}

/**
 * Combined OEE + APQ Chart with 270-degree coverage
 */
export function OEEAPQChart({ oee, availability, performance, quality }: OEEAPQChartProps) {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'radialBar',
      height: 400,
    },
    plotOptions: {
      radialBar: {
        startAngle: -135, // 270-degree: -135 to 135
        endAngle: 135,
        track: {
          background: '#e7e7e7',
          strokeWidth: '70%',
          margin: 12, // Space between bars
        },
        dataLabels: {
          name: {
            fontSize: '16px',
            color: '#666',
            offsetY: 120,
          },
          value: {
            offsetY: 76,
            fontSize: '28px',
            fontWeight: 'bold',
            formatter: (val: number) => `${Math.round(Math.min(val, 100))}%`,
          },
          total: {
            show: true,
            label: 'OEE',
            fontSize: '18px',
            color: '#666',
            formatter: () => `${Math.round(Math.min(oee, 100))}%`,
          },
        },
        hollow: {
          size: '20%',
        },
      },
    },
    colors: ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6'], // OEE (Green), Availability (Blue), Performance (Orange), Quality (Purple)
    labels: ['OEE', 'Availability', 'Performance', 'Quality'],
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '14px',
      markers: {
        size: 6,
        strokeWidth: 4,
      },
      itemMargin: {
        horizontal: 12,
        vertical: 8,
      },
    },
    stroke: {
      lineCap: 'round', // Rounded corners
    },
  };

  // Cap values at 100% to prevent overflow
  const series = [
    Math.min(oee, 100),
    Math.min(availability, 100),
    Math.min(performance, 100),
    Math.min(quality, 100),
  ];

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 500,
        mx: 'auto',
        borderRadius: 3, // Rounded container corners
        p: 2,
      }}
    >
      <Chart options={chartOptions} series={series} type="radialBar" height={400} />
    </Box>
  );
}

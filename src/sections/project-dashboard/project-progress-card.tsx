import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Chart, useChart } from 'src/components/chart';

import type { ProjectProgressData } from './project-dashboard-data';

// ----------------------------------------------------------------------

type ProjectProgressCardProps = CardProps & {
  title?: string;
  data: ProjectProgressData;
};

export function ProjectProgressCard({
  title = 'Project Progress',
  data,
  sx,
  ...other
}: ProjectProgressCardProps) {
  const theme = useTheme();

  const chartColors = [
    theme.palette.success.main,
    theme.palette.success.light,
    theme.palette.grey[300],
  ];

  const chartOptions: ChartOptions = useChart({
    chart: {
      type: 'donut',
      sparkline: { enabled: true },
    },
    colors: chartColors,
    labels: ['Completed', 'In Progress', 'Pending'],
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: { show: false },
            value: { show: false },
            total: { show: false },
          },
        },
      },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value: number) => `${value}%`,
      },
    },
    legend: { show: false },
  });

  return (
    <Card
      sx={[
        {
          p: 2.5,
          borderRadius: 3,
          bgcolor: 'background.paper',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        {title}
      </Typography>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Chart
          type="donut"
          series={[data.completed, data.inProgress, data.pending]}
          options={chartOptions}
          sx={{ width: 160, height: 160 }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            {data.completed}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Project Ended
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'success.main',
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Completed
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'success.light',
            }}
          />
          <Typography variant="caption" color="text.secondary">
            In Progress
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'grey.300',
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Pending
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

import type { WeekSummary } from 'src/types/shift';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { Chart, useChart } from 'src/components/chart';

import { DAY_LABELS, minutesToHoursString } from 'src/types/shift';

// ----------------------------------------------------------------------

interface WeekSummaryChartProps {
  summary: WeekSummary;
  title?: string;
}

export function WeekSummaryChart({ summary, title = 'Weekly Summary' }: WeekSummaryChartProps) {
  const categories = summary.dailySummaries.map((day) => DAY_LABELS[day.day].slice(0, 3));
  const workHours = summary.dailySummaries.map((day) => Math.round((day.workMinutes / 60) * 10) / 10);
  const breakHours = summary.dailySummaries.map(
    (day) => Math.round((day.breakMinutes / 60) * 10) / 10
  );

  const chartOptions = useChart({
    chart: {
      stacked: true,
    },
    xaxis: {
      categories,
    },
    yaxis: {
      title: {
        text: 'Hours',
      },
      labels: {
        formatter: (value: number) => `${value}h`,
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} hours`,
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
    },
    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 4,
      },
    },
  });

  return (
    <Card>
      <CardHeader
        title={title}
        subheader={
          <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Total Work: <strong>{minutesToHoursString(summary.totalWorkMinutes)}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Breaks: <strong>{minutesToHoursString(summary.totalBreakMinutes)}</strong>
            </Typography>
          </Box>
        }
      />
      <Box sx={{ p: 3 }}>
        <Chart
          type="bar"
          series={[
            { name: 'Work Hours', data: workHours },
            { name: 'Break Hours', data: breakHours },
          ]}
          options={chartOptions}
          slotProps={{ loading: { p: 2.5 } }}
          sx={{ height: 300 }}
        />
      </Box>
    </Card>
  );
}

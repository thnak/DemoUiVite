import type { ApexOptions } from 'apexcharts';
import type { CurrentMachineRunStateRecords } from 'src/api/types/generated';

import Chart from 'react-apexcharts';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface TimelineVisualizationProps {
  records: CurrentMachineRunStateRecords[];
}

/**
 * ApexCharts Timeline Visualization Component
 */
export function TimelineVisualization({ records }: TimelineVisualizationProps) {
  const getStateColor = (state?: string, isUnlabeled?: boolean) => {
    if (isUnlabeled) return '#ef4444'; // Red for unlabeled downtime
    if (state === 'running') return '#22c55e'; // Green
    if (state === 'speedLoss') return '#f59e0b'; // Orange
    if (state === 'unPlannedDowntime' || state === 'plannedDowntime') return '#64748b'; // Gray for labeled downtime
    return '#94a3b8'; // Light gray default
  };

  // Convert records to ApexCharts timeline format
  const timelineData = records.map((record) => {
    const isUnlabeled =
      record.stateId === '000000000000000000000000' &&
      (record.state === 'unPlannedDowntime' || record.state === 'plannedDowntime');
    const color = getStateColor(record.state, isUnlabeled);
    const stateName = record.stateName || (isUnlabeled ? 'Unlabeled Downtime' : 'Unknown');

    return {
      x: stateName,
      y: [
        new Date(record.startTime || '').getTime(),
        record.endTime ? new Date(record.endTime).getTime() : new Date().getTime(),
      ],
      fillColor: color,
    };
  });

  const chartOptions: ApexOptions = {
    chart: {
      type: 'rangeBar',
      height: 150,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '80%',
        rangeBarGroupRows: true,
      },
    },
    colors: ['#22c55e', '#f59e0b', '#ef4444', '#64748b'],
    fill: {
      type: 'solid',
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeFormatter: {
          hour: 'HH:mm',
        },
        datetimeUTC: false, // Use local time, not UTC
      },
    },
    yaxis: {
      show: true,
    },
    tooltip: {
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const data = w.config.series[seriesIndex].data[dataPointIndex];
        const start = new Date(data.y[0]);
        const end = new Date(data.y[1]);
        const duration = Math.round((end.getTime() - start.getTime()) / 60000); // minutes

        return `<div style="padding: 10px;">
          <strong>${data.x}</strong><br/>
          Start: ${start.toLocaleTimeString()}<br/>
          End: ${end.toLocaleTimeString()}<br/>
          Duration: ${duration} minutes
        </div>`;
      },
    },
    legend: {
      show: false,
    },
  };

  const series = [
    {
      data: timelineData,
    },
  ];

  return (
    <Box>
      <Chart options={chartOptions} series={series} type="rangeBar" height={150} />

      {/* Legend */}
      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 2 }}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 16, height: 16, bgcolor: '#22c55e', borderRadius: 0.5 }} />
          <Typography variant="caption">Running</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 16, height: 16, bgcolor: '#f59e0b', borderRadius: 0.5 }} />
          <Typography variant="caption">Speed Loss</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 16, height: 16, bgcolor: '#64748b', borderRadius: 0.5 }} />
          <Typography variant="caption">Labeled Downtime</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 16, height: 16, bgcolor: '#ef4444', borderRadius: 0.5 }} />
          <Typography variant="caption">Unlabeled Downtime</Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

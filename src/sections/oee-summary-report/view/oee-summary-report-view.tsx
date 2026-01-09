import { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  _areas,
  _shifts,
  _machines,
  type TimeRangeMode,
  generateOEESummaryReport,
  type OEESummaryFilters as OEESummaryFiltersType,
} from 'src/_mock';

import { Iconify } from 'src/components/iconify';

import { OEESummaryChart } from '../oee-summary-chart';
import { OEESummaryFilters } from '../oee-summary-filters';
import { OEESummaryTimeTable } from '../oee-summary-time-table';
import { OEESummaryMetricCard } from '../oee-summary-metric-card';
import { OEESummaryMachineTable } from '../oee-summary-machine-table';

// ----------------------------------------------------------------------

type TabValue = 'machines' | 'times';

// Easing constants
const EASE_OUT = [0.4, 0, 0.2, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASE_OUT,
    },
  },
};

const tabContentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: EASE_OUT,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.3,
      ease: EASE_IN,
    },
  },
};

const tabsCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.4,
    },
  },
};

export function OEESummaryReportView() {
  const [currentTab, setCurrentTab] = useState<TabValue>('machines');

  // Filter state
  const [timeRange, setTimeRange] = useState<TimeRangeMode>('months');
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);

  // Create filters object
  const filters: OEESummaryFiltersType = useMemo(
    () => ({
      timeRange,
      startDate,
      endDate,
      machines: selectedMachines,
      areas: selectedAreas,
      shifts: selectedShifts,
    }),
    [timeRange, startDate, endDate, selectedMachines, selectedAreas, selectedShifts]
  );

  // Generate report data
  const reportData = useMemo(() => generateOEESummaryReport(filters), [filters]);

  // Prepare chart data for machines tab
  const machineChartData = useMemo(() => {
    const topMachines = reportData.byMachines
      .sort((a, b) => b.metrics.oee - a.metrics.oee)
      .slice(0, 10);

    return {
      categories: topMachines.map((m) => m.machineName),
      series: [
        {
          name: 'OEE',
          data: topMachines.map((m) => m.metrics.oee),
        },
        {
          name: 'Availability',
          data: topMachines.map((m) => m.metrics.availability),
        },
        {
          name: 'Performance',
          data: topMachines.map((m) => m.metrics.performance),
        },
        {
          name: 'Quality',
          data: topMachines.map((m) => m.metrics.quality),
        },
      ],
    };
  }, [reportData.byMachines]);

  // Prepare chart data for times tab
  const timeChartData = useMemo(() => ({
      categories: reportData.byTimes.map((t) => t.periodLabel),
      series: [
        {
          name: 'OEE',
          data: reportData.byTimes.map((t) => t.metrics.oee),
        },
        {
          name: 'Availability',
          data: reportData.byTimes.map((t) => t.metrics.availability),
        },
        {
          name: 'Performance',
          data: reportData.byTimes.map((t) => t.metrics.performance),
        },
        {
          name: 'Quality',
          data: reportData.byTimes.map((t) => t.metrics.quality),
        },
      ],
    }), [reportData.byTimes]);

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: TabValue) => {
    setCurrentTab(newValue);
  }, []);

  // Prepare machine and area data for filters
  const machineOptions = useMemo(
    () => _machines.map((m) => ({ id: m.id, name: m.name })),
    []
  );

  const areaOptions = useMemo(() => _areas.map((a) => ({ id: a.name, name: a.name })), []);

  const shiftOptions = useMemo(() => _shifts.map((s) => ({ id: s.id, name: s.name })), []);

  return (
    <DashboardContent maxWidth="xl">
      {/* Header */}
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            OEE Summary Report
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Reports
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              OEE Summary
            </Typography>
          </Box>
        </Box>

        {/* Global Filters */}
        <OEESummaryFilters
          timeRange={timeRange}
          startDate={startDate}
          endDate={endDate}
          selectedMachines={selectedMachines}
          selectedAreas={selectedAreas}
          selectedShifts={selectedShifts}
          machines={machineOptions}
          areas={areaOptions}
          shifts={shiftOptions}
          onTimeRangeChange={setTimeRange}
          onStartDateChange={(value: Date | null) => value && setStartDate(value)}
          onEndDateChange={(value: Date | null) => value && setEndDate(value)}
          onMachinesChange={setSelectedMachines}
          onAreasChange={setSelectedAreas}
          onShiftsChange={setSelectedShifts}
        />
      </Box>

      {/* Overall Metrics */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <motion.div variants={itemVariants}>
              <OEESummaryMetricCard
                title="Overall OEE"
                value={reportData.overallMetrics.oee}
                icon={<Iconify icon='solar:chart-bold' width={32} />}
                subtitle="Target: 85%"
              />
            </motion.div>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <motion.div variants={itemVariants}>
              <OEESummaryMetricCard
                title="Availability"
                value={reportData.overallMetrics.availability}
                icon={<Iconify icon='solar:clock-circle-bold' width={32} />}
                color="info"
              />
            </motion.div>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <motion.div variants={itemVariants}>
              <OEESummaryMetricCard
                title="Performance"
                value={reportData.overallMetrics.performance}
                icon={<Iconify icon='solar:bolt-bold' width={32} />}
                color="warning"
              />
            </motion.div>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <motion.div variants={itemVariants}>
              <OEESummaryMetricCard
                title="Quality"
                value={reportData.overallMetrics.quality}
                icon={<Iconify icon='solar:star-bold' width={32} />}
                color="success"
              />
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={tabsCardVariants} initial="hidden" animate="visible">
        <Card sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.vars.palette.background.neutral}`,
            }}
          >
            <Tab
              value="machines"
              label="By Machines"
              icon={<Iconify icon='solar:widget-2-bold' width={24} />}
              iconPosition="start"
            />
            <Tab
              value="times"
              label="By Times"
              icon={<Iconify icon='solar:calendar-mark-bold' width={24} />}
              iconPosition="start"
            />
          </Tabs>
        </Card>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {currentTab === 'machines' && (
          <motion.div
            key="machines"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Stack spacing={3}>
              {/* Machine Chart */}
              <OEESummaryChart
                title="Top 10 Machines OEE Performance"
                subheader="Comparison of OEE metrics across machines"
                chart={machineChartData}
              />

              {/* Machine Table */}
              <OEESummaryMachineTable
                title="Detailed Machine OEE Report"
                subheader="All machines sorted by OEE performance"
                data={reportData.byMachines}
              />
            </Stack>
          </motion.div>
        )}

        {currentTab === 'times' && (
          <motion.div
            key="times"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Stack spacing={3}>
              {/* Time Chart */}
              <OEESummaryChart
                title="OEE Trend Over Time"
                subheader="OEE metrics progression across time periods"
                chart={timeChartData}
              />

              {/* Time Table */}
              <OEESummaryTimeTable
                title="Detailed Time Period OEE Report"
                subheader="OEE performance by time period"
                data={reportData.byTimes}
              />
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardContent>
  );
}

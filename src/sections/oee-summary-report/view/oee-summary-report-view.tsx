import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetAreaPage } from 'src/api/hooks/generated/use-area';
import { useGetMachinePage } from 'src/api/hooks/generated/use-machine';
import { useGetTimeBlockNamePage } from 'src/api/hooks/generated/use-time-block-name';
import {
  usePostapiproductionsreportsoeebytime,
  usePostapiproductionsreportsoeebymachine,
} from 'src/api/hooks/generated/use-production-report';

import { Iconify } from 'src/components/iconify';

import { OEESummaryChart } from '../oee-summary-chart';
import { OEESummaryFilters } from '../oee-summary-filters';
import { OEESummaryTimeTable } from '../oee-summary-time-table';
import { OEESummaryMetricCard } from '../oee-summary-metric-card';
import { OEESummaryMachineTable } from '../oee-summary-machine-table';

// ----------------------------------------------------------------------

type TabValue = 'machines' | 'times';
type TimeRangeMode = 'days' | 'months' | 'years';

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
  const [timeRange] = useState<TimeRangeMode>('months');
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);

  // Fetch machines for filter dropdown
  const { mutate: fetchMachines, data: machinesData, isPending: loadingMachines } = useGetMachinePage();

  // Fetch areas for filter dropdown
  const { mutate: fetchAreas, data: areasData, isPending: loadingAreas } = useGetAreaPage();

  // Fetch time block names (shifts) for filter dropdown
  const { mutate: fetchShifts, data: shiftsData, isPending: loadingShifts } = useGetTimeBlockNamePage();

  // Fetch OEE data by machine
  const {
    mutate: fetchOEEByMachine,
    data: oeeByMachineData,
    isPending: loadingOEEByMachine,
    error: oeeByMachineError,
  } = usePostapiproductionsreportsoeebymachine();

  // Fetch OEE data by time
  const {
    mutate: fetchOEEByTime,
    data: oeeByTimeData,
    isPending: loadingOEEByTime,
    error: oeeByTimeError,
  } = usePostapiproductionsreportsoeebytime();

  // Initial data fetch for dropdowns
  useEffect(() => {
    fetchMachines({
      data: [],
      params: { pageNumber: 0, pageSize: 100 },
    });

    fetchAreas({
      data: [],
      params: { pageNumber: 0, pageSize: 100 },
    });

    fetchShifts({
      data: [],
      params: { pageNumber: 0, pageSize: 100 },
    });
  }, [fetchMachines, fetchAreas, fetchShifts]);

  // Fetch OEE data when filters change
  useEffect(() => {
    const fromDate = startDate.toISOString().split('T')[0];
    const toDate = endDate.toISOString().split('T')[0];

    fetchOEEByMachine({
      data: {
        fromDate,
        toDate,
        machineIds: selectedMachines.length > 0 ? selectedMachines : null,
        timeBlockNameIds: selectedShifts.length > 0 ? selectedShifts : null,
      },
    });

    fetchOEEByTime({
      data: {
        fromDate,
        toDate,
        machineIds: selectedMachines.length > 0 ? selectedMachines : null,
        timeBlockNameIds: selectedShifts.length > 0 ? selectedShifts : null,
      },
    });
  }, [startDate, endDate, selectedMachines, selectedShifts, fetchOEEByMachine, fetchOEEByTime]);

  // Prepare machine and area data for filters
  const machineOptions = useMemo(
    () =>
      machinesData?.items?.map((m) => ({
        id: m.id || '',
        name: m.name || m.code || 'Unknown',
      })) || [],
    [machinesData]
  );

  const areaOptions = useMemo(
    () =>
      areasData?.items?.map((a) => ({
        id: a.id || '',
        name: a.name || a.code || 'Unknown',
      })) || [],
    [areasData]
  );

  const shiftOptions = useMemo(
    () =>
      shiftsData?.items?.map((s) => ({
        id: s.id || '',
        name: s.name || s.code || 'Unknown',
      })) || [],
    [shiftsData]
  );

  // Prepare chart data for machines tab
  const machineChartData = useMemo(() => {
    const machines = oeeByMachineData?.machines || [];
    const topMachines = [...machines]
      .sort((a, b) => (b.metrics?.oee || 0) - (a.metrics?.oee || 0))
      .slice(0, 10);

    return {
      categories: topMachines.map((m) => m.machineName || 'Unknown'),
      series: [
        {
          name: 'OEE',
          data: topMachines.map((m) => m.metrics?.oee || 0),
        },
        {
          name: 'Availability',
          data: topMachines.map((m) => m.metrics?.availability || 0),
        },
        {
          name: 'Performance',
          data: topMachines.map((m) => m.metrics?.performance || 0),
        },
        {
          name: 'Quality',
          data: topMachines.map((m) => m.metrics?.quality || 0),
        },
      ],
    };
  }, [oeeByMachineData]);

  // Prepare chart data for times tab
  const timeChartData = useMemo(() => {
    const timePeriods = oeeByTimeData?.timePeriods || [];

    return {
      categories: timePeriods.map((t) => t.workDate || 'Unknown'),
      series: [
        {
          name: 'OEE',
          data: timePeriods.map((t) => t.metrics?.oee || 0),
        },
        {
          name: 'Availability',
          data: timePeriods.map((t) => t.metrics?.availability || 0),
        },
        {
          name: 'Performance',
          data: timePeriods.map((t) => t.metrics?.performance || 0),
        },
        {
          name: 'Quality',
          data: timePeriods.map((t) => t.metrics?.quality || 0),
        },
      ],
    };
  }, [oeeByTimeData]);

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: TabValue) => {
    setCurrentTab(newValue);
  }, []);

  // Overall summary metrics
  const overallMetrics = useMemo(() => {
    const summary = currentTab === 'machines' 
      ? oeeByMachineData?.overallSummary 
      : oeeByTimeData?.overallSummary;

    return {
      oee: summary?.oee || 0,
      availability: summary?.availability || 0,
      performance: summary?.performance || 0,
      quality: summary?.quality || 0,
    };
  }, [currentTab, oeeByMachineData, oeeByTimeData]);

  const isLoading = loadingMachines || loadingAreas || loadingShifts || loadingOEEByMachine || loadingOEEByTime;
  const hasError = oeeByMachineError || oeeByTimeError;

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
          onTimeRangeChange={() => {}} // Not used - timeRange is constant
          onStartDateChange={(value: Date | null) => value && setStartDate(value)}
          onEndDateChange={(value: Date | null) => value && setEndDate(value)}
          onMachinesChange={setSelectedMachines}
          onAreasChange={setSelectedAreas}
          onShiftsChange={setSelectedShifts}
        />
      </Box>

      {/* Overall Metrics */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {hasError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {oeeByMachineError?.message || oeeByTimeError?.message || 'Failed to load OEE data'}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <motion.div variants={itemVariants}>
                  <OEESummaryMetricCard
                    title="Overall OEE"
                    value={overallMetrics.oee}
                    icon={<Iconify icon="solar:chart-bold" width={32} />}
                    subtitle="Target: 85%"
                  />
                </motion.div>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <motion.div variants={itemVariants}>
                  <OEESummaryMetricCard
                    title="Availability"
                    value={overallMetrics.availability}
                    icon={<Iconify icon="solar:clock-circle-bold" width={32} />}
                    color="info"
                  />
                </motion.div>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <motion.div variants={itemVariants}>
                  <OEESummaryMetricCard
                    title="Performance"
                    value={overallMetrics.performance}
                    icon={<Iconify icon="solar:bolt-bold" width={32} />}
                    color="warning"
                  />
                </motion.div>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <motion.div variants={itemVariants}>
                  <OEESummaryMetricCard
                    title="Quality"
                    value={overallMetrics.quality}
                    icon={<Iconify icon="solar:star-bold" width={32} />}
                    color="success"
                  />
                </motion.div>
              </Grid>
            </Grid>

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
                    icon={<Iconify icon="solar:widget-2-bold" width={24} />}
                    iconPosition="start"
                  />
                  <Tab
                    value="times"
                    label="By Times"
                    icon={<Iconify icon="solar:calendar-mark-bold" width={24} />}
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
                      data={oeeByMachineData?.machines || []}
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
                      data={oeeByTimeData?.timePeriods || []}
                    />
                  </Stack>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>
    </DashboardContent>
  );
}

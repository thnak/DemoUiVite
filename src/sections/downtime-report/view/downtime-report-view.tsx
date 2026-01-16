import type { SelectChangeEvent } from '@mui/material/Select';

import { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { generateDowntimeReportData } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { DowntimeParetoChart } from '../downtime-pareto-chart';
import { DowntimeMachineTable } from '../downtime-machine-table';
import { DowntimeSummaryWidget } from '../downtime-summary-widget';
import { DowntimeTimelineChart } from '../downtime-timeline-chart';
import { DowntimeByReasonChart } from '../downtime-by-reason-chart';

// ----------------------------------------------------------------------

type TabValue = 'overview' | 'machines' | 'products' | 'timeline';

// Easing constants
const EASE_OUT = [0.4, 0, 0.2, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;

// Animation variants for tab content
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

export function DowntimeReportView() {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [currentTab, setCurrentTab] = useState<TabValue>('overview');

  const availableYears = [2023, 2024, 2025];

  // Generate report data
  const reportData = useMemo(() => generateDowntimeReportData(selectedYear), [selectedYear]);

  const currentMonthData = useMemo(
    () => reportData.monthlyData[selectedMonth - 1],
    [reportData, selectedMonth]
  );

  // Prepare Pareto data for machines
  const machineParetoData = useMemo(
    () =>
      reportData.machinesSummary.map((m) => ({
        name: m.machineName,
        value: m.totalDowntimeMinutes,
      })),
    [reportData]
  );

  // Prepare Pareto data for reasons
  const reasonParetoData = useMemo(
    () =>
      Object.entries(reportData.downtimeByReason).map(([reason, minutes]) => ({
        name: reason,
        value: minutes,
      })),
    [reportData]
  );

  // Prepare Pareto data for products
  const productParetoData = useMemo(
    () =>
      reportData.productsSummary.map((p) => ({
        name: p.productName,
        value: p.totalDowntimeMinutes,
      })),
    [reportData]
  );

  const handleYearChange = useCallback((event: SelectChangeEvent<number>) => {
    setSelectedYear(event.target.value as number);
  }, []);

  const handleMonthChange = useCallback((event: SelectChangeEvent<number>) => {
    setSelectedMonth(event.target.value as number);
  }, []);

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: TabValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <DashboardContent maxWidth="xl">
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Downtime Report
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
              Downtime
            </Typography>
          </Box>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Year</InputLabel>
            <Select value={selectedYear} label="Year" onChange={handleYearChange}>
              {availableYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Month</InputLabel>
            <Select value={selectedMonth} label="Month" onChange={handleMonthChange}>
              {reportData.monthlyData.map((m) => (
                <MenuItem key={m.monthNumber} value={m.monthNumber}>
                  {m.month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Tabs */}
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
            value="overview"
            label="Overview"
            icon={<Iconify icon="mdi:gauge" />}
            iconPosition="start"
          />
          <Tab
            value="machines"
            label="By Machine"
            icon={<Iconify icon="mdi:speedometer" />}
            iconPosition="start"
          />
          <Tab
            value="products"
            label="By Product"
            icon={<Iconify icon="solar:cart-3-bold" />}
            iconPosition="start"
          />
          <Tab
            value="timeline"
            label="Timeline"
            icon={<Iconify icon="mdi:calendar" />}
            iconPosition="start"
          />
        </Tabs>
      </Card>

      {/* Summary Widgets */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DowntimeSummaryWidget
            title="Total Runtime"
            value={reportData.totalRuntimeMinutes}
            icon={<Iconify icon="solar:clock-circle-outline" width={32} />}
            color="info"
            subtitle="Planned operating time"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DowntimeSummaryWidget
            title="Total Uptime"
            value={reportData.totalUptimeMinutes}
            icon={<Iconify icon="solar:check-circle-bold" width={32} />}
            color="success"
            subtitle="Actual production time"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DowntimeSummaryWidget
            title="Total Downtime"
            value={reportData.totalDowntimeMinutes}
            icon={<Iconify icon="mdi:speedometer" width={32} />}
            color="error"
            subtitle="Unplanned + planned stops"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DowntimeSummaryWidget
            title="Break Time"
            value={reportData.totalBreakTimeMinutes}
            icon={<Iconify icon="mdi:clock-check" width={32} />}
            color="warning"
            subtitle="Scheduled breaks"
          />
        </Grid>
      </Grid>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {currentTab === 'overview' && (
          <motion.div
            key="overview"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 6 }}>
                <DowntimeByReasonChart
                  title="Downtime by Reason Category"
                  subheader={`${selectedYear} - All machines`}
                  data={reportData.downtimeByReason}
                />
              </Grid>

              <Grid size={{ xs: 12, lg: 6 }}>
                <DowntimeParetoChart
                  title="Pareto Analysis - Reasons"
                  subheader="Identify top downtime contributors"
                  data={reasonParetoData}
                  valueLabel="Downtime"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <DowntimeTimelineChart
                  title="Monthly Downtime Timeline"
                  subheader={`${selectedYear} - Runtime distribution`}
                  data={reportData.monthlyData}
                  viewType="monthly"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <DowntimeMachineTable
                  title="Top Machines by Downtime"
                  subheader="Machines with highest downtime impact"
                  data={reportData.machinesSummary}
                />
              </Grid>
            </Grid>
          </motion.div>
        )}

        {currentTab === 'machines' && (
          <motion.div
            key="machines"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 8 }}>
                <DowntimeParetoChart
                  title="Pareto Analysis - Machines"
                  subheader="Identify machines causing most downtime"
                  data={machineParetoData}
                  valueLabel="Downtime"
                />
              </Grid>

              <Grid size={{ xs: 12, lg: 4 }}>
                <DowntimeByReasonChart
                  title={`${currentMonthData.month} Reasons`}
                  subheader="Monthly breakdown"
                  data={currentMonthData.downtimeByReason}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <DowntimeMachineTable
                  title="Machine Downtime Details"
                  subheader="Complete machine performance overview"
                  data={reportData.machinesSummary}
                />
              </Grid>
            </Grid>
          </motion.div>
        )}

        {currentTab === 'products' && (
          <motion.div
            key="products"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 8 }}>
                <DowntimeParetoChart
                  title="Pareto Analysis - Products"
                  subheader="Products associated with most downtime"
                  data={productParetoData}
                  valueLabel="Downtime"
                />
              </Grid>

              <Grid size={{ xs: 12, lg: 4 }}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Product Downtime Summary
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Products experiencing the most issues during production
                  </Typography>

                  {reportData.productsSummary.slice(0, 5).map((product, index) => (
                    <Box
                      key={product.productId}
                      sx={{
                        py: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: (theme) =>
                          index < 4 ? `1px dashed ${theme.vars.palette.divider}` : 'none',
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2">{product.productName}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {product.totalDowntimeEvents} events
                        </Typography>
                      </Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: 'error.main', fontWeight: 'fontWeightBold' }}
                      >
                        {Math.round((product.totalDowntimeMinutes / 60) * 10) / 10} hrs
                      </Typography>
                    </Box>
                  ))}
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {currentTab === 'timeline' && (
          <motion.div
            key="timeline"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <DowntimeTimelineChart
                  title="Monthly Overview"
                  subheader={`${selectedYear} - Complete year view`}
                  data={reportData.monthlyData}
                  viewType="monthly"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <DowntimeTimelineChart
                  title={`Daily Breakdown - ${currentMonthData.month}`}
                  subheader="Day by day performance"
                  data={currentMonthData.dailyData}
                  viewType="daily"
                />
              </Grid>

              <Grid size={{ xs: 12, lg: 6 }}>
                <DowntimeByReasonChart
                  title={`${currentMonthData.month} Downtime by Reason`}
                  subheader="Selected month breakdown"
                  data={currentMonthData.downtimeByReason}
                />
              </Grid>

              <Grid size={{ xs: 12, lg: 6 }}>
                <DowntimeParetoChart
                  title={`${currentMonthData.month} Pareto Analysis`}
                  subheader="Monthly reason analysis"
                  data={Object.entries(currentMonthData.downtimeByReason).map(
                    ([reason, minutes]) => ({
                      name: reason,
                      value: minutes,
                    })
                  )}
                  valueLabel="Downtime"
                />
              </Grid>
            </Grid>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardContent>
  );
}

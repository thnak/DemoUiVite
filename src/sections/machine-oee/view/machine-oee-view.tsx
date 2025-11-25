import type { SelectChangeEvent } from '@mui/material/Select';

import { useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

import { DashboardContent } from 'src/layouts/dashboard';
import { _machines, getMachineOEEHistory } from 'src/_mock';

import { Iconify } from 'src/components/iconify';

import { OEETrendChart } from '../oee-trend-chart';
import { OEEBestProduct } from '../oee-best-product';
import { OEEWeeklyTable } from '../oee-weekly-table';
import { OEEProductTable } from '../oee-product-table';
import { OEEWidgetSummary } from '../oee-widget-summary';

// ----------------------------------------------------------------------

type TimePeriod = 'year' | 'month' | 'week';

export function MachineOEEView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the machine or use the first one
  const machine = useMemo(
    () => _machines.find((m) => m.id === id) || _machines[0],
    [id]
  );

  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('year');

  // Get OEE data for the machine
  const oeeHistory = useMemo(
    () => getMachineOEEHistory(machine.id, 2023, 2025),
    [machine.id]
  );

  const currentYearData = useMemo(
    () => oeeHistory.find((y) => y.year === selectedYear) || oeeHistory[oeeHistory.length - 1],
    [oeeHistory, selectedYear]
  );

  const currentMonthData = useMemo(
    () => currentYearData.monthlyData.find((m) => m.monthNumber === selectedMonth) || currentYearData.monthlyData[0],
    [currentYearData, selectedMonth]
  );

  // Get the appropriate OEE data based on time period
  const displayOEEData = useMemo(() => {
    switch (timePeriod) {
      case 'year':
        return currentYearData.oeeData;
      case 'month':
        return currentMonthData.oeeData;
      case 'week':
        return currentMonthData.weeklyData[0]?.oeeData || currentMonthData.oeeData;
      default:
        return currentYearData.oeeData;
    }
  }, [timePeriod, currentYearData, currentMonthData]);

  // Get products for the selected period
  const displayProducts = useMemo(() => {
    switch (timePeriod) {
      case 'year':
        return currentYearData.monthlyData.flatMap((m) => m.productData);
      case 'month':
        return currentMonthData.productData;
      case 'week':
        return currentMonthData.weeklyData.flatMap((d) => d.productData);
      default:
        return currentYearData.monthlyData.flatMap((m) => m.productData);
    }
  }, [timePeriod, currentYearData, currentMonthData]);

  // Generate chart data
  const chartData = useMemo(() => {
    const months = currentYearData.monthlyData.map((m) => m.month.substring(0, 3));
    return {
      categories: months,
      series: [
        {
          name: 'OEE',
          data: currentYearData.monthlyData.map((m) => m.oeeData.oee),
        },
        {
          name: 'Availability',
          data: currentYearData.monthlyData.map((m) => m.oeeData.availability),
        },
        {
          name: 'Performance',
          data: currentYearData.monthlyData.map((m) => m.oeeData.performance),
        },
        {
          name: 'Quality',
          data: currentYearData.monthlyData.map((m) => m.oeeData.quality),
        },
      ],
    };
  }, [currentYearData]);

  const handleMachineChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      navigate(`/machines/${event.target.value}/oee`);
    },
    [navigate]
  );

  const handleYearChange = useCallback((event: SelectChangeEvent<number>) => {
    setSelectedYear(event.target.value as number);
  }, []);

  const handleMonthChange = useCallback((event: SelectChangeEvent<number>) => {
    setSelectedMonth(event.target.value as number);
  }, []);

  const handleTimePeriodChange = useCallback(
    (_event: React.SyntheticEvent, newValue: TimePeriod) => {
      setTimePeriod(newValue);
    },
    []
  );

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
            OEE Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Machine
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              OEE
            </Typography>
          </Box>
        </Box>

        {/* Machine Selector */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Machine</InputLabel>
            <Select
              value={machine.id}
              label="Machine"
              onChange={handleMachineChange}
            >
              {_machines.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              label="Year"
              onChange={handleYearChange}
            >
              {oeeHistory.map((y) => (
                <MenuItem key={y.year} value={y.year}>
                  {y.year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {(timePeriod === 'month' || timePeriod === 'week') && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                label="Month"
                onChange={handleMonthChange}
              >
                {currentYearData.monthlyData.map((m) => (
                  <MenuItem key={m.monthNumber} value={m.monthNumber}>
                    {m.month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </Box>

      {/* Time Period Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={timePeriod}
          onChange={handleTimePeriodChange}
          sx={{
            px: 2.5,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.vars.palette.background.neutral}`,
          }}
        >
          <Tab value="year" label="Yearly" icon={<Iconify icon="mdi:calendar" />} iconPosition="start" />
          <Tab value="month" label="Monthly" icon={<Iconify icon="mdi:calendar-month" />} iconPosition="start" />
          <Tab value="week" label="Weekly" icon={<Iconify icon="mdi:calendar-week" />} iconPosition="start" />
        </Tabs>
      </Card>

      <Grid container spacing={3}>
        {/* OEE Summary Widgets */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <OEEWidgetSummary
            title="Overall OEE"
            value={displayOEEData.oee}
            icon={<Iconify icon="mdi:gauge" width={48} />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <OEEWidgetSummary
            title="Availability"
            value={displayOEEData.availability}
            color="info"
            icon={<Iconify icon="mdi:clock-check" width={48} />}
            subtitle="Planned vs Actual runtime"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <OEEWidgetSummary
            title="Performance"
            value={displayOEEData.performance}
            color="warning"
            icon={<Iconify icon="mdi:speedometer" width={48} />}
            subtitle="Actual vs Ideal cycle time"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <OEEWidgetSummary
            title="Quality"
            value={displayOEEData.quality}
            color="success"
            icon={<Iconify icon="mdi:check-decagram" width={48} />}
            subtitle="Good units vs Total units"
          />
        </Grid>

        {/* OEE Trend Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <OEETrendChart
            title="OEE Trend"
            subheader={`${selectedYear} - Monthly breakdown`}
            chart={chartData}
          />
        </Grid>

        {/* Best Product */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <OEEBestProduct
            title="Best Product Performance"
            subheader={`Top performer for ${timePeriod === 'year' ? selectedYear : currentMonthData.month}`}
            product={currentYearData.bestProduct}
          />
        </Grid>

        {/* Product OEE Table */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <OEEProductTable
            title="Product OEE Breakdown"
            subheader={`All products for selected ${timePeriod}`}
            products={displayProducts}
          />
        </Grid>

        {/* Weekly OEE Table */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <OEEWeeklyTable
            title="Weekly Performance"
            subheader={`${currentMonthData.month} ${selectedYear}`}
            weekData={currentMonthData.weeklyData}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

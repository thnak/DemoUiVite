import type { SelectChangeEvent } from '@mui/material/Select';
import type { GetWorkDateCalendarStatisticByCalendarResult } from 'src/api/types/generated';

import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { getCalendarById } from 'src/api/services/generated/calendar';
import { getapiWorkDateCalendarStatisticbycalendar } from 'src/api/services/generated/work-date-calendar-statistic';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type ViewType = 'date' | 'month' | 'year' | 'calendar';

interface CalendarInfo {
  code: string;
  name: string;
}

// Helper function to format date to YYYY-MM-DD
function formatDateForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper function to format date-time for display
function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Helper function to format date for display
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Helper function to calculate duration in hours
function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return (end - start) / (1000 * 60 * 60); // Convert to hours
}

// Helper function to generate calendar grid for a month
function generateCalendarGrid(year: number, month: number): Date[][] {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
  const daysInMonth = lastDay.getDate();

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  // Add empty slots for days before the month starts
  for (let i = 0; i < startDayOfWeek; i += 1) {
    const prevDate = new Date(year, month - 1, -startDayOfWeek + i + 1);
    currentWeek.push(prevDate);
  }

  // Add all days in the month
  for (let day = 1; day <= daysInMonth; day += 1) {
    currentWeek.push(new Date(year, month - 1, day));
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Add empty slots for remaining days to complete the last week
  if (currentWeek.length > 0) {
    const remainingDays = 7 - currentWeek.length;
    for (let i = 1; i <= remainingDays; i += 1) {
      currentWeek.push(new Date(year, month, i));
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

// Helper function to check if date is in current month
function isCurrentMonth(date: Date, month: number): boolean {
  return date.getMonth() === month - 1;
}

// Helper function to format date as YYYY-MM-DD for comparison
function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ----------------------------------------------------------------------

export function CalendarDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [viewType, setViewType] = useState<ViewType>('date');
  const [calendarInfo, setCalendarInfo] = useState<CalendarInfo | null>(null);
  const [statistics, setStatistics] = useState<GetWorkDateCalendarStatisticByCalendarResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Date range state
  const today = new Date();
  const [fromDate, setFromDate] = useState(formatDateForAPI(today));
  const [toDate, setToDate] = useState(() => {
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return formatDateForAPI(nextMonth);
  });

  // Year and month selection for month/year views
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);

  // Available years for selection
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  }, []);

  // Fetch calendar info
  useEffect(() => {
    const fetchCalendarInfo = async () => {
      if (!id) return;

      try {
        const calendar = await getCalendarById(id);
        if (calendar) {
          setCalendarInfo({
            code: calendar.code || '',
            name: calendar.name || '',
          });
        }
      } catch (err) {
        console.error('Error fetching calendar info:', err);
      }
    };

    fetchCalendarInfo();
  }, [id]);

  // Update date range when view type or year/month changes
  useEffect(() => {
    if (viewType === 'year') {
      const yearStart = new Date(selectedYear, 0, 1);
      const yearEnd = new Date(selectedYear, 11, 31);
      setFromDate(formatDateForAPI(yearStart));
      setToDate(formatDateForAPI(yearEnd));
    } else if (viewType === 'month') {
      const monthStart = new Date(selectedYear, selectedMonth - 1, 1);
      const monthEnd = new Date(selectedYear, selectedMonth, 0);
      setFromDate(formatDateForAPI(monthStart));
      setToDate(formatDateForAPI(monthEnd));
    }
  }, [viewType, selectedYear, selectedMonth]);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getapiWorkDateCalendarStatisticbycalendar({
        calendarId: id,
        fromDate,
        toDate,
      });

      setStatistics(response.items || []);
    } catch (err) {
      setError('Failed to load calendar statistics');
      console.error('Error fetching calendar statistics:', err);
    } finally {
      setLoading(false);
    }
  }, [id, fromDate, toDate]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const handleViewTypeChange = useCallback((_: React.SyntheticEvent, newValue: ViewType) => {
    setViewType(newValue);
  }, []);

  const handleYearChange = useCallback((event: SelectChangeEvent<number>) => {
    setSelectedYear(event.target.value as number);
  }, []);

  const handleMonthChange = useCallback((event: SelectChangeEvent<number>) => {
    setSelectedMonth(event.target.value as number);
  }, []);

  const handleFromDateChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(event.target.value);
  }, []);

  const handleToDateChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(event.target.value);
  }, []);

  // Group statistics by date
  const groupedStatistics = useMemo(() => {
    const grouped = new Map<string, GetWorkDateCalendarStatisticByCalendarResult[]>();

    statistics.forEach((stat) => {
      if (stat.startTime) {
        const dateKey = formatDate(stat.startTime);
        if (!grouped.has(dateKey)) {
          grouped.set(dateKey, []);
        }
        grouped.get(dateKey)!.push(stat);
      }
    });

    return grouped;
  }, [statistics]);

  // Group statistics by date key (YYYY-MM-DD) for calendar view
  const statisticsByDateKey = useMemo(() => {
    const grouped = new Map<string, GetWorkDateCalendarStatisticByCalendarResult[]>();

    statistics.forEach((stat) => {
      if (stat.startTime) {
        const date = new Date(stat.startTime);
        const dateKey = formatDateKey(date);
        if (!grouped.has(dateKey)) {
          grouped.set(dateKey, []);
        }
        grouped.get(dateKey)!.push(stat);
      }
    });

    return grouped;
  }, [statistics]);

  // Generate calendar grid for calendar view
  const calendarGrid = useMemo(
    () => generateCalendarGrid(selectedYear, selectedMonth),
    [selectedYear, selectedMonth]
  );

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    let totalShiftHours = 0;
    let totalBreakHours = 0;
    let totalOvertimeHours = 0;
    let totalPlannedStopHours = 0;

    statistics.forEach((stat) => {
      if (stat.startTime && stat.endTime) {
        const duration = calculateDuration(stat.startTime, stat.endTime);

        if (stat.isShiftTime && !stat.isBreakTime) {
          totalShiftHours += duration;
        }
        if (stat.isBreakTime) {
          totalBreakHours += duration;
        }
        if (stat.isOverTimeShift) {
          totalOvertimeHours += duration;
        }
        if (stat.isPlannedStopTime) {
          totalPlannedStopHours += duration;
        }
      }
    });

    return {
      totalShiftHours: totalShiftHours.toFixed(2),
      totalBreakHours: totalBreakHours.toFixed(2),
      totalOvertimeHours: totalOvertimeHours.toFixed(2),
      totalPlannedStopHours: totalPlannedStopHours.toFixed(2),
    };
  }, [statistics]);

  const renderStatisticCard = (
    stat: GetWorkDateCalendarStatisticByCalendarResult,
    index: number
  ) => {
    const duration = stat.startTime && stat.endTime 
      ? calculateDuration(stat.startTime, stat.endTime).toFixed(2)
      : '0';

    let cardColor = 'background.paper';
    let icon: 'solar:clock-circle-outline' | 'eva:briefcase-outline' | 'solar:trash-bin-trash-bold' | 'solar:restart-bold' = 'solar:clock-circle-outline';
    let typeLabel = 'Period';

    if (stat.isShiftTime && !stat.isBreakTime) {
      cardColor = 'primary.lighter';
      icon = 'eva:briefcase-outline';
      typeLabel = 'Shift Time';
    } else if (stat.isBreakTime) {
      cardColor = 'warning.lighter';
      icon = 'solar:clock-circle-outline';
      typeLabel = 'Break Time';
    } else if (stat.isOverTimeShift) {
      cardColor = 'info.lighter';
      icon = 'solar:restart-bold';
      typeLabel = 'Overtime';
    } else if (stat.isPlannedStopTime) {
      cardColor = 'error.lighter';
      icon = 'solar:trash-bin-trash-bold';
      typeLabel = 'Planned Stop';
    }

    return (
      <Card key={index} sx={{ p: 2, bgcolor: cardColor }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Iconify icon={icon} width={24} sx={{ mr: 1 }} />
          <Typography variant="subtitle2">{typeLabel}</Typography>
        </Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {stat.name || 'Unnamed Period'}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Start:</strong> {stat.startTime ? formatDateTime(stat.startTime) : '-'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>End:</strong> {stat.endTime ? formatDateTime(stat.endTime) : '-'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Duration:</strong> {duration} hours
          </Typography>
        </Box>
      </Card>
    );
  };

  // Render calendar day cell
  const renderCalendarDay = (date: Date) => {
    const dateKey = formatDateKey(date);
    const dayStats = statisticsByDateKey.get(dateKey) || [];
    const isOtherMonth = !isCurrentMonth(date, selectedMonth);
    const isToday =
      date.toDateString() === new Date().toDateString();

    // Calculate total hours for the day
    let totalShiftHours = 0;
    let totalBreakHours = 0;
    let hasOvertime = false;
    let hasPlannedStop = false;

    dayStats.forEach((stat) => {
      if (stat.startTime && stat.endTime) {
        const duration = calculateDuration(stat.startTime, stat.endTime);
        if (stat.isShiftTime && !stat.isBreakTime) {
          totalShiftHours += duration;
        }
        if (stat.isBreakTime) {
          totalBreakHours += duration;
        }
        if (stat.isOverTimeShift) {
          hasOvertime = true;
        }
        if (stat.isPlannedStopTime) {
          hasPlannedStop = true;
        }
      }
    });

    return (
      <Card
        key={dateKey}
        sx={{
          minHeight: 120,
          p: 1,
          bgcolor: isOtherMonth ? 'action.hover' : 'background.paper',
          border: 1,
          borderColor: isToday ? 'primary.main' : 'divider',
          borderWidth: isToday ? 2 : 1,
          opacity: isOtherMonth ? 0.5 : 1,
          position: 'relative',
          '&:hover': {
            bgcolor: isOtherMonth ? 'action.hover' : 'action.hover',
            cursor: dayStats.length > 0 ? 'pointer' : 'default',
          },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: isToday ? 'bold' : 'normal',
            color: isToday ? 'primary.main' : 'text.primary',
            mb: 0.5,
          }}
        >
          {date.getDate()}
        </Typography>

        {dayStats.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {totalShiftHours > 0 && (
              <Box
                sx={{
                  bgcolor: 'primary.lighter',
                  px: 0.5,
                  py: 0.25,
                  borderRadius: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Iconify icon="eva:briefcase-outline" width={14} />
                <Typography variant="caption">{totalShiftHours.toFixed(1)}h</Typography>
              </Box>
            )}

            {totalBreakHours > 0 && (
              <Box
                sx={{
                  bgcolor: 'warning.lighter',
                  px: 0.5,
                  py: 0.25,
                  borderRadius: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Iconify icon="solar:clock-circle-outline" width={14} />
                <Typography variant="caption">{totalBreakHours.toFixed(1)}h</Typography>
              </Box>
            )}

            {hasOvertime && (
              <Box
                sx={{
                  bgcolor: 'info.lighter',
                  px: 0.5,
                  py: 0.25,
                  borderRadius: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Iconify icon="solar:restart-bold" width={14} />
                <Typography variant="caption">OT</Typography>
              </Box>
            )}

            {hasPlannedStop && (
              <Box
                sx={{
                  bgcolor: 'error.lighter',
                  px: 0.5,
                  py: 0.25,
                  borderRadius: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" width={14} />
                <Typography variant="caption">Stop</Typography>
              </Box>
            )}
          </Box>
        )}
      </Card>
    );
  };

  return (
    <DashboardContent>
      {/* Page Header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Calendar Details
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'text.primary', cursor: 'pointer' }}
            onClick={() => navigate('/calendars')}
          >
            Calendars
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            {calendarInfo?.code || 'Details'}
          </Typography>
        </Box>
      </Box>

      {/* Calendar Info */}
      {calendarInfo && (
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {calendarInfo.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Code: {calendarInfo.code}
          </Typography>
        </Card>
      )}

      {/* View Type Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={viewType} onChange={handleViewTypeChange} sx={{ px: 2, pt: 2 }}>
          <Tab value="calendar" label="Calendar View" />
          <Tab value="date" label="Date Range View" />
          <Tab value="month" label="Month View" />
          <Tab value="year" label="Year View" />
        </Tabs>

        {/* Filters */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {viewType === 'date' && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="From Date"
                    type="date"
                    value={fromDate}
                    onChange={handleFromDateChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="To Date"
                    type="date"
                    value={toDate}
                    onChange={handleToDateChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </>
            )}

            {viewType === 'month' && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Year</InputLabel>
                    <Select value={selectedYear} onChange={handleYearChange} label="Year">
                      {availableYears.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Month</InputLabel>
                    <Select value={selectedMonth} onChange={handleMonthChange} label="Month">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <MenuItem key={month} value={month}>
                          {new Date(2000, month - 1).toLocaleString('en-US', { month: 'long' })}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            {viewType === 'year' && (
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Year</InputLabel>
                  <Select value={selectedYear} onChange={handleYearChange} label="Year">
                    {availableYears.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {viewType === 'calendar' && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Year</InputLabel>
                    <Select value={selectedYear} onChange={handleYearChange} label="Year">
                      {availableYears.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Month</InputLabel>
                    <Select value={selectedMonth} onChange={handleMonthChange} label="Month">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <MenuItem key={month} value={month}>
                          {new Date(2000, month - 1).toLocaleString('en-US', { month: 'long' })}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Card>

      {/* Summary Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 3, bgcolor: 'primary.lighter' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Iconify icon="eva:briefcase-outline" width={24} sx={{ mr: 1 }} />
              <Typography variant="subtitle2">Total Shift Hours</Typography>
            </Box>
            <Typography variant="h4">{summaryStats.totalShiftHours}</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 3, bgcolor: 'warning.lighter' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Iconify icon="solar:clock-circle-outline" width={24} sx={{ mr: 1 }} />
              <Typography variant="subtitle2">Total Break Hours</Typography>
            </Box>
            <Typography variant="h4">{summaryStats.totalBreakHours}</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 3, bgcolor: 'info.lighter' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Iconify icon="solar:restart-bold" width={24} sx={{ mr: 1 }} />
              <Typography variant="subtitle2">Total Overtime Hours</Typography>
            </Box>
            <Typography variant="h4">{summaryStats.totalOvertimeHours}</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 3, bgcolor: 'error.lighter' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Iconify icon="solar:trash-bin-trash-bold" width={24} sx={{ mr: 1 }} />
              <Typography variant="subtitle2">Planned Stop Hours</Typography>
            </Box>
            <Typography variant="h4">{summaryStats.totalPlannedStopHours}</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Statistics Content */}
      {loading ? (
        <Card sx={{ p: 10, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Card>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : statistics.length === 0 ? (
        <Alert severity="info">No scheduled time periods found for the selected date range.</Alert>
      ) : viewType === 'calendar' ? (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {new Date(selectedYear, selectedMonth - 1).toLocaleString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </Typography>

          {/* Calendar Header - Days of Week */}
          <Grid container spacing={1} sx={{ mb: 1 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Grid key={day} size={{ xs: 12 / 7 }}>
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 1,
                    fontWeight: 'bold',
                    color: 'text.secondary',
                  }}
                >
                  <Typography variant="body2">{day}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Calendar Grid - Weeks and Days */}
          {calendarGrid.map((week, weekIndex) => (
            <Grid container spacing={1} key={weekIndex} sx={{ mb: 1 }}>
              {week.map((date) => (
                <Grid key={formatDateKey(date)} size={{ xs: 12 / 7 }}>
                  {renderCalendarDay(date)}
                </Grid>
              ))}
            </Grid>
          ))}

          {/* Legend */}
          <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Legend
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: 'primary.lighter', borderRadius: 0.5 }} />
                  <Typography variant="caption">Shift Time</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: 'warning.lighter', borderRadius: 0.5 }} />
                  <Typography variant="caption">Break Time</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: 'info.lighter', borderRadius: 0.5 }} />
                  <Typography variant="caption">Overtime</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: 'error.lighter', borderRadius: 0.5 }} />
                  <Typography variant="caption">Planned Stop</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Card>
      ) : (
        <Box>
          {Array.from(groupedStatistics.entries()).map(([date, stats]) => (
            <Box key={date} sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {date}
              </Typography>
              <Grid container spacing={2}>
                {stats.map((stat, index) => (
                  <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                    {renderStatisticCard(stat, index)}
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      )}
    </DashboardContent>
  );
}

import type {
  MachineRunState,
  MachineOeeUpdate,
  MachineRunStateTimeBlock,
} from 'src/services/machineHub';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { apiConfig } from 'src/api/config';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetMachineById } from 'src/api/hooks/generated/use-machine';
import { MachineHubService, MachineRunState as MachineRunStateEnum } from 'src/services/machineHub';

import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export function MachineTrackingView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [hubService] = useState(() => new MachineHubService(apiConfig.baseUrl));
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [machineState, setMachineState] = useState<MachineOeeUpdate | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  // Fetch machine details
  const { data: machine, isLoading: isLoadingMachine } = useGetMachineById(id || '', {
    enabled: !!id,
  });

  // Initialize SignalR connection and subscribe to machine
  useEffect(() => {
    if (!id) return undefined;

    const mounted = true;

    const initializeConnection = async () => {
      try {
        setConnectionStatus('connecting');

        // Start hub connection
        await hubService.start();

        if (!mounted) return;

        setConnectionStatus('connected');

        // Subscribe to machine updates
        await hubService.subscribeToMachine(id, (update: MachineOeeUpdate) => {
          if (!mounted) return;

          setMachineState(update);
          setLastUpdateTime(new Date());
        });

        // Get initial machine aggregation
        const initialAggregation = await hubService.getMachineAggregation(id);
        if (mounted && initialAggregation) {
          // Convert aggregation to update format
          setMachineState({
            availability: initialAggregation.availability,
            performance: initialAggregation.performance,
            quality: initialAggregation.quality,
            oee: initialAggregation.oee,
            goodCount: initialAggregation.goodCount,
            totalCount: initialAggregation.totalCount,
            plannedProductionTime: '',
            runTime: initialAggregation.totalRunTime,
            downtime: initialAggregation.totalDowntime,
            speedLossTime: initialAggregation.totalSpeedLossTime,
            currentProductName: '',
            runStateHistory: [],
          });
          setLastUpdateTime(new Date());
        }

        // Get subscriber count
        const count = await hubService.getSubscriberCount(id);
        if (mounted) {
          setSubscriberCount(count);
        }
      } catch (error) {
        if (!mounted) return;

        console.error('Failed to connect to machine hub:', error);
        setConnectionStatus('error');
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to connect to machine hub'
        );
      }
    };

    initializeConnection();

    // Cleanup function
    return () => {
      // Unsubscribe and stop connection
      if (id) {
        hubService
          .unsubscribeFromMachine(id)
          .then(() => hubService.stop())
          .catch((err) => console.error('Error during cleanup:', err));
      }
    };
  }, [id, hubService]);

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleBackToList = useCallback(() => {
    navigate('/machines');
  }, [navigate]);

  const getOeeColor = (oee: number): 'success' | 'warning' | 'error' => {
    if (oee >= 85) return 'success';
    if (oee >= 60) return 'warning';
    return 'error';
  };

  const getConnectionStatusColor = (
    status: ConnectionStatus
  ): 'success' | 'error' | 'warning' | 'info' => {
    switch (status) {
      case 'connected':
        return 'success';
      case 'connecting':
        return 'info';
      case 'disconnected':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  // Helper to normalize state - SignalR serializes enum as string
  const normalizeState = (state: MachineRunState): string => {
    // If it's already a string, normalize it to consistent format
    if (typeof state === 'string') {
      // Handle both 'SpeedLoss' and 'Speed Loss' variations
      const stateStr = state as string;
      const normalized = stateStr.replace(/\s+/g, '');
      return normalized;
    }
    // If it's a number, convert to string representation
    switch (state) {
      case MachineRunStateEnum.Running:
        return 'Running';
      case MachineRunStateEnum.SpeedLoss:
        return 'SpeedLoss';
      case MachineRunStateEnum.Downtime:
        return 'Downtime';
      default:
        return 'Unknown';
    }
  };

  // State color constants
  const STATE_COLORS = {
    running: '#4caf50', // Green
    speedloss: '#ff9800', // Orange
    downtime: '#f44336', // Red
    unknown: '#9e9e9e', // Gray
  } as const;

  const getStateColor = (state: MachineRunState): string =>
    STATE_COLORS[state as keyof typeof STATE_COLORS] || STATE_COLORS.unknown;

  const getStateName = (state: MachineRunState): string => {
    switch (state) {
      case 'running':
        return 'Running';
      case 'speedloss':
        return 'Speed Loss';
      case 'downtime':
        return 'Downtime';
      default:
        return 'Unknown';
    }
  };

  // Prepare data for range bar chart
  const prepareRangeBarData = () => {
    if (!machineState?.runStateHistory || machineState.runStateHistory.length === 0) {
      return [];
    }

    return machineState.runStateHistory.map((block: MachineRunStateTimeBlock) => {
      const startTime = new Date(block.startTime).getTime();
      const endTime = new Date(block.endTime).getTime();

      return {
        x: 'Machine State',
        y: [startTime, endTime],
        fillColor: getStateColor(block.state),
        stateName: getStateName(block.state),
      };
    });
  };

  const rangeBarChartOptions = useChart({
    chart: {
      type: 'rangeBar',
      height: 150,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 0,
        rangeBarGroupRows: false,
      },
    },
    dataLabels: {
      enabled: false, // <--- HERE
    },
    stroke: {
      show: false,
      curve: 'straight',
      lineCap: 'butt',
      colors: undefined,
      width: 2,
      dashArray: 0,
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        format: 'HH:mm:ss',
      },
    },
    yaxis: {
      show: false,
    },
    tooltip: {
      custom: (opts: {
        seriesIndex: number;
        dataPointIndex: number;
        w: {
          config: { series: Array<{ data: Array<{ y: [number, number]; stateName: string }> }> };
        };
      }) => {
        const { dataPointIndex, w } = opts;
        const data = w.config.series[0].data[dataPointIndex];
        const startTime = new Date(data.y[0]).toLocaleTimeString();
        const endTime = new Date(data.y[1]).toLocaleTimeString();
        const duration = Math.round((data.y[1] - data.y[0]) / 1000 / 60); // minutes

        return `
          <div style="padding: 8px 12px; background: rgba(0, 0, 0, 0.8); color: white; border-radius: 4px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${data.stateName}</div>
            <div style="font-size: 12px; opacity: 0.9;">${startTime} - ${endTime}</div>
            <div style="font-size: 12px; opacity: 0.9;">Duration: ${duration} min</div>
          </div>
        `;
      },
    },
    legend: {
      show: false,
    },
    grid: {
      padding: {
        top: 0,
        bottom: 0,
        left: 10,
        right: 10,
      },
    },
  });

  const formatDuration = (duration: string): string => {
    if (!duration) return 'N/A';

    // Parse ISO 8601 duration (e.g., PT8H30M, PT30M, PT45S)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/);
    if (!match) return duration;

    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseFloat(match[3] || '0');

    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 && hours === 0) parts.push(`${Math.floor(seconds)}s`);

    return parts.length > 0 ? parts.join(' ') : '0s';
  };

  if (isLoadingMachine) {
    return (
      <DashboardContent>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}
        >
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (!machine) {
    return (
      <DashboardContent>
        <Alert severity="error">Machine not found</Alert>
        <Button onClick={handleBackToList} sx={{ mt: 2 }}>
          Back to Machines
        </Button>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      {/* Page Header */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={
              <Iconify icon="eva:arrow-ios-forward-fill" sx={{ transform: 'rotate(180deg)' }} />
            }
            onClick={handleBackToList}
          >
            Back
          </Button>
          <Typography variant="h4">Realtime Machine Tracking</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Machines
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            Tracking
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Machine Info Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  alt={machine.name || undefined}
                  src={machine.imageUrl || undefined}
                  variant="rounded"
                  sx={{ width: 64, height: 64 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" noWrap>
                    {machine.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                    {machine.code}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
                >
                  Area
                </Typography>
                <Typography variant="body2">{machine.areaId?.toString() || '-'}</Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
                >
                  Work Calendar
                </Typography>
                <Typography variant="body2">{machine.calendarId?.toString() || '-'}</Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
                >
                  Calculation Mode
                </Typography>
                <Typography variant="body2">{machine.calculationMode || '-'}</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Realtime Status Card */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Connection Status */}
            <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Connection Status</Typography>
                <Chip
                  icon={
                    connectionStatus === 'connecting' ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <Iconify
                        icon={
                          connectionStatus === 'connected'
                            ? 'eva:checkmark-fill'
                            : 'solar:danger-triangle-bold-duotone'
                        }
                      />
                    )
                  }
                  label={connectionStatus.toUpperCase()}
                  color={getConnectionStatusColor(connectionStatus)}
                  size="small"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon="solar:users-group-rounded-bold" width={20} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {subscriberCount} viewer{subscriberCount !== 1 ? 's' : ''} watching this machine
                </Typography>
              </Box>
            </Card>

            {/* OEE Metrics */}
            {machineState ? (
              <>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    OEE Metrics
                  </Typography>

                  <Grid container spacing={3}>
                    {/* Overall OEE */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', display: 'block', mb: 1 }}
                        >
                          OEE
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                          <Typography
                            variant="h3"
                            sx={{ color: `${getOeeColor(machineState.oee)}.main` }}
                          >
                            {machineState.oee.toFixed(1)}
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            %
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={machineState.oee}
                          color={getOeeColor(machineState.oee)}
                          sx={{ mt: 1, height: 8, borderRadius: 1 }}
                        />
                      </Box>
                    </Grid>

                    {/* Availability */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', display: 'block', mb: 1 }}
                        >
                          Availability
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                          <Typography variant="h4">
                            {machineState.availability.toFixed(1)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            %
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={machineState.availability}
                          sx={{ mt: 1, height: 6, borderRadius: 1 }}
                        />
                      </Box>
                    </Grid>

                    {/* Performance */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', display: 'block', mb: 1 }}
                        >
                          Performance
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                          <Typography variant="h4">
                            {machineState.performance.toFixed(1)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            %
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={machineState.performance}
                          sx={{ mt: 1, height: 6, borderRadius: 1 }}
                        />
                      </Box>
                    </Grid>

                    {/* Quality */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', display: 'block', mb: 1 }}
                        >
                          Quality
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                          <Typography variant="h4">{machineState.quality.toFixed(1)}</Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            %
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={machineState.quality}
                          sx={{ mt: 1, height: 6, borderRadius: 1 }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Card>

                {/* Production Info */}
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Production
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', display: 'block', mb: 1 }}
                        >
                          Good Count
                        </Typography>
                        <Typography variant="h4" sx={{ color: 'success.main' }}>
                          {machineState.goodCount.toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', display: 'block', mb: 1 }}
                        >
                          Total Count
                        </Typography>
                        <Typography variant="h4">
                          {machineState.totalCount.toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', display: 'block', mb: 1 }}
                        >
                          Current Product
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {machineState.currentProductName || 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>

                {/* Time Metrics */}
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Time Metrics
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', display: 'block', mb: 1 }}
                        >
                          Run Time
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Iconify
                            icon="solar:play-circle-bold"
                            width={24}
                            sx={{ color: 'success.main' }}
                          />
                          <Typography variant="h5">
                            {formatDuration(machineState.runTime)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', display: 'block', mb: 1 }}
                        >
                          Downtime
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Iconify
                            icon="solar:restart-bold"
                            width={24}
                            sx={{ color: 'error.main' }}
                          />
                          <Typography variant="h5">
                            {formatDuration(machineState.downtime)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', display: 'block', mb: 1 }}
                        >
                          Speed Loss
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Iconify
                            icon="solar:danger-triangle-bold-duotone"
                            width={24}
                            sx={{ color: 'warning.main' }}
                          />
                          <Typography variant="h5">
                            {formatDuration(machineState.speedLossTime)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {lastUpdateTime && (
                      <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Last updated: {lastUpdateTime.toLocaleTimeString()}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Card>

                {/* Run State History */}
                {machineState.runStateHistory && machineState.runStateHistory.length > 0 && (
                  <Card sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      Run State History
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Chart
                        type="rangeBar"
                        series={[
                          {
                            data: prepareRangeBarData(),
                          },
                        ]}
                        options={rangeBarChartOptions}
                        sx={{ height: 150 }}
                      />
                    </Box>

                    {/* Legend */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: 0.5,
                            bgcolor: STATE_COLORS.running,
                          }}
                        />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Running
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: 0.5,
                            bgcolor: STATE_COLORS.speedloss,
                          }}
                        />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Speed Loss
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: 0.5,
                            bgcolor: STATE_COLORS.downtime,
                          }}
                        />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Downtime
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                )}
              </>
            ) : (
              <Card sx={{ p: 3 }}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  {connectionStatus === 'connected' ? (
                    <>
                      <CircularProgress size={40} sx={{ mb: 2 }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Waiting for machine data...
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Not connected to machine hub
                    </Typography>
                  )}
                </Box>
              </Card>
            )}
          </Stack>
        </Grid>
      </Grid>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}

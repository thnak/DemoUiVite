import type { MachineOeeUpdate, MachineRuntimeBlock } from 'src/services/machineHub';

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
import { MachineRunState , MachineHubService } from 'src/services/machineHub';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export function MachineTrackingView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [hubService] = useState(() => new MachineHubService(apiConfig.baseUrl));
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [machineState, setMachineState] = useState<MachineOeeUpdate | null>(null);
  const [runtimeBlocks, setRuntimeBlocks] = useState<MachineRuntimeBlock[]>([]);
  const [subscriberCount, setSubscriberCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  // Fetch machine details
  const { data: machine, isLoading: isLoadingMachine } = useGetMachineById(id || '', {
    enabled: !!id,
  });

  // Handle runtime block updates
  const handleRuntimeBlockUpdate = useCallback((block: MachineRuntimeBlock) => {
    setRuntimeBlocks((prev) => {
      // Replace the last block if it matches the start time, otherwise append
      const lastBlock = prev[prev.length - 1];
      if (lastBlock && lastBlock.startTime === block.startTime) {
        return [...prev.slice(0, -1), block];
      }
      return [...prev, block];
    });
  }, []);

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

        // Subscribe to machine updates with runtime block callback
        await hubService.subscribeToMachine(
          id,
          (update: MachineOeeUpdate) => {
            if (!mounted) return;
            // Convert from 0-1 to 0-100 for display
            update.oee = update.oee * 100;
            update.availability = update.availability * 100;
            update.performance = update.performance * 100;
            update.quality = update.quality * 100;
            setMachineState(update);
            setLastUpdateTime(new Date());
          },
          handleRuntimeBlockUpdate
        );

        // Get initial machine aggregation and runtime blocks
        const [initialAggregation, initialBlocks] = await Promise.all([
          hubService.getMachineAggregation(id),
          hubService.getMachineRuntimeBlocks(id),
        ]);

        if (mounted && initialAggregation) {
          // Convert aggregation to update format
          setMachineState({
            machineName: machine?.name || id,
            availability: initialAggregation.availability * 100,
            availabilityVsLastPeriod: 0,
            performance: initialAggregation.performance * 100,
            performanceVsLastPeriod: 0,
            quality: initialAggregation.quality * 100,
            qualityVsLastPeriod: 0,
            oee: initialAggregation.oee * 100,
            oeeVsLastPeriod: 0,
            goodCount: initialAggregation.goodCount,
            goodCountVsLastPeriod: 0,
            totalCount: initialAggregation.totalCount,
            totalCountVsLastPeriod: 0,
            plannedProductionTime: '',
            runTime: initialAggregation.totalRunTime,
            downtime: initialAggregation.totalDowntime,
            speedLossTime: initialAggregation.totalSpeedLossTime,
            currentProductName: '',
            runStateHistory: [],
          });
          setLastUpdateTime(new Date());
        }

        if (mounted && initialBlocks) {
          setRuntimeBlocks(initialBlocks);
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
  }, [id, hubService, handleRuntimeBlockUpdate, machine?.name]);

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

  const getTrendIndicator = (value: number): string => {
    if (value > 0) return '↑';
    if (value < 0) return '↓';
    return '→';
  };

  const getTrendColor = (value: number): string => {
    if (value > 0) return 'success.main';
    if (value < 0) return 'error.main';
    return 'text.secondary';
  };

  // State color constants
  const STATE_COLORS = {
    [MachineRunState.Running]: '#4caf50', // Green
    [MachineRunState.SpeedLoss]: '#ff9800', // Orange
    [MachineRunState.Downtime]: '#f44336', // Red
    unknown: '#9e9e9e', // Gray
  } as const;

  const getStateColor = (state: MachineRunState): string =>
    STATE_COLORS[state as keyof typeof STATE_COLORS] || STATE_COLORS.unknown;

  const getStateName = (state: MachineRunState): string => {
    switch (state) {
      case MachineRunState.Running:
        return 'Running';
      case MachineRunState.SpeedLoss:
        return 'Speed Loss';
      case MachineRunState.Downtime:
        return 'Downtime';
      default:
        return 'Unknown';
    }
  };

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
                        {machineState.oeeVsLastPeriod !== 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                            <Typography
                              variant="caption"
                              sx={{ color: getTrendColor(machineState.oeeVsLastPeriod) }}
                            >
                              {getTrendIndicator(machineState.oeeVsLastPeriod)}{' '}
                              {Math.abs(machineState.oeeVsLastPeriod).toFixed(1)}pp
                            </Typography>
                          </Box>
                        )}
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
                        {machineState.availabilityVsLastPeriod !== 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: getTrendColor(machineState.availabilityVsLastPeriod),
                              }}
                            >
                              {getTrendIndicator(machineState.availabilityVsLastPeriod)}{' '}
                              {Math.abs(machineState.availabilityVsLastPeriod).toFixed(1)}pp
                            </Typography>
                          </Box>
                        )}
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
                        {machineState.performanceVsLastPeriod !== 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                            <Typography
                              variant="caption"
                              sx={{ color: getTrendColor(machineState.performanceVsLastPeriod) }}
                            >
                              {getTrendIndicator(machineState.performanceVsLastPeriod)}{' '}
                              {Math.abs(machineState.performanceVsLastPeriod).toFixed(1)}pp
                            </Typography>
                          </Box>
                        )}
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
                        {machineState.qualityVsLastPeriod !== 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                            <Typography
                              variant="caption"
                              sx={{ color: getTrendColor(machineState.qualityVsLastPeriod) }}
                            >
                              {getTrendIndicator(machineState.qualityVsLastPeriod)}{' '}
                              {Math.abs(machineState.qualityVsLastPeriod).toFixed(1)}pp
                            </Typography>
                          </Box>
                        )}
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
                        {machineState.goodCountVsLastPeriod !== 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <Typography
                              variant="caption"
                              sx={{ color: getTrendColor(machineState.goodCountVsLastPeriod) }}
                            >
                              {getTrendIndicator(machineState.goodCountVsLastPeriod)}{' '}
                              {Math.abs(machineState.goodCountVsLastPeriod).toLocaleString()}
                            </Typography>
                          </Box>
                        )}
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
                        {machineState.totalCountVsLastPeriod !== 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <Typography
                              variant="caption"
                              sx={{ color: getTrendColor(machineState.totalCountVsLastPeriod) }}
                            >
                              {getTrendIndicator(machineState.totalCountVsLastPeriod)}{' '}
                              {Math.abs(machineState.totalCountVsLastPeriod).toLocaleString()}
                            </Typography>
                          </Box>
                        )}
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

                {/* Runtime Blocks & Stop Tracking */}
                {runtimeBlocks && runtimeBlocks.length > 0 && (
                  <Card sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      Runtime Blocks & Stop Tracking
                    </Typography>

                    <Stack spacing={2}>
                      {runtimeBlocks.map((block, index) => (
                        <Box
                          key={`${block.startTime}-${index}`}
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            border: (theme) => `1px solid ${theme.palette.divider}`,
                            bgcolor: 'background.neutral',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              mb: 1,
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  bgcolor: block.color || getStateColor(block.state),
                                }}
                              />
                              <Typography variant="subtitle2">
                                {getStateName(block.state)}
                              </Typography>
                              {block.isUnplannedDowntime && (
                                <Chip
                                  label="Unplanned"
                                  size="small"
                                  color="error"
                                  sx={{ height: 20, fontSize: '0.7rem' }}
                                />
                              )}
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {new Date(block.startTime).toLocaleTimeString()} -{' '}
                              {block.endTime
                                ? new Date(block.endTime).toLocaleTimeString()
                                : 'Ongoing'}
                            </Typography>
                          </Box>
                          {block.name && (
                            <Typography variant="body2" sx={{ color: 'text.secondary', ml: 2.5 }}>
                              {block.name}
                            </Typography>
                          )}
                          {!block.name && block.isUnplannedDowntime && (
                            <Typography
                              variant="body2"
                              sx={{ color: 'warning.main', ml: 2.5, fontStyle: 'italic' }}
                            >
                              ⚠️ Needs labeling
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Stack>

                    {/* Legend */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: 0.5,
                            bgcolor: STATE_COLORS[MachineRunState.Running],
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
                            bgcolor: STATE_COLORS[MachineRunState.SpeedLoss],
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
                            bgcolor: STATE_COLORS[MachineRunState.Downtime],
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

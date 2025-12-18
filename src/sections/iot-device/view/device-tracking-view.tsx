import type { DeviceState, DeviceStateUpdate } from 'src/services/deviceHub';

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
import CircularProgress from '@mui/material/CircularProgress';

import { apiConfig } from 'src/api/config';
import { DashboardContent } from 'src/layouts/dashboard';
import { DeviceHubService } from 'src/services/deviceHub';
import { useGetIoTDeviceById } from 'src/api/hooks/generated/use-io-tdevice';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export function DeviceTrackingView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [hubService] = useState(() => new DeviceHubService(apiConfig.baseUrl));
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [deviceState, setDeviceState] = useState<DeviceState | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  // Fetch device details
  const { data: device, isLoading: isLoadingDevice } = useGetIoTDeviceById(id || '', {
    enabled: !!id,
  });

  // Initialize SignalR connection and subscribe to device
  useEffect(() => {
    if (!id) return undefined;

    let mounted = true;

    const initializeConnection = async () => {
      try {
        setConnectionStatus('connecting');

        // Start hub connection
        await hubService.start();

        if (!mounted) return;

        setConnectionStatus('connected');

        // Subscribe to device updates
        await hubService.subscribeToDevice(id, (update: DeviceStateUpdate) => {
          if (!mounted) return;

          setDeviceState({
            currentState: update.currentState,
            lastSeen: update.lastSeen,
            firmwareVersion: update.firmwareVersion,
            lastError: update.lastError,
          });
          setLastUpdateTime(new Date());
        });

        // Get initial device state
        const initialState = await hubService.getDeviceState(id);
        if (mounted && initialState) {
          setDeviceState(initialState);
          setLastUpdateTime(new Date());
        }

        // Get subscriber count
        const count = await hubService.getSubscriberCount(id);
        if (mounted) {
          setSubscriberCount(count);
        }
      } catch (error) {
        if (!mounted) return;

        console.error('Failed to connect to device hub:', error);
        setConnectionStatus('error');
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to connect to device hub'
        );
      }
    };

    initializeConnection();

    // Cleanup function
    return () => {
      mounted = false;

      // Unsubscribe and stop connection
      if (id) {
        hubService
          .unsubscribeFromDevice(id)
          .then(() => hubService.stop())
          .catch((err) => console.error('Error during cleanup:', err));
      }
    };
  }, [id, hubService]);

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleBackToList = useCallback(() => {
    navigate('/iot-devices');
  }, [navigate]);

  const getStateColor = (
    state: string
  ): 'success' | 'error' | 'warning' | 'info' | 'default' => {
    switch (state) {
      case 'Online':
        return 'success';
      case 'Offline':
        return 'error';
      case 'UpdatingFirmware':
        return 'warning';
      case 'Error':
        return 'error';
      default:
        return 'default';
    }
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

  const formatDateTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString();
    } catch {
      return isoString;
    }
  };

  if (isLoadingDevice) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (!device) {
    return (
      <DashboardContent>
        <Alert severity="error">Device not found</Alert>
        <Button onClick={handleBackToList} sx={{ mt: 2 }}>
          Back to Devices
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
            startIcon={<Iconify icon="eva:arrow-ios-forward-fill" sx={{ transform: 'rotate(180deg)' }} />}
            onClick={handleBackToList}
          >
            Back
          </Button>
          <Typography variant="h4">Realtime Device Tracking</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            IoT Devices
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
        {/* Device Info Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  alt={device.name || undefined}
                  src={device.imageUrl || undefined}
                  variant="rounded"
                  sx={{ width: 64, height: 64 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" noWrap>
                    {device.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                    {device.code}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  MAC Address
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {device.macAddress || '-'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Device Type
                </Typography>
                <Typography variant="body2">{device.type || '-'}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Machine
                </Typography>
                <Typography variant="body2">
                  {device.machineId ? `Machine ID: ${device.machineId}` : 'Not assigned'}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Realtime Status Card */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Connection Status */}
            <Card sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
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
                  {subscriberCount} viewer{subscriberCount !== 1 ? 's' : ''} watching this device
                </Typography>
              </Box>
            </Card>

            {/* Device State */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Device State
              </Typography>

              {deviceState ? (
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                        Current State
                      </Typography>
                      <Label color={getStateColor(deviceState.currentState)} sx={{ px: 2, py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: 'currentColor',
                              animation: deviceState.currentState === 'Online' ? 'pulse 2s infinite' : 'none',
                              '@keyframes pulse': {
                                '0%, 100%': { opacity: 1 },
                                '50%': { opacity: 0.5 },
                              },
                            }}
                          />
                          {deviceState.currentState}
                        </Box>
                      </Label>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                        Firmware Version
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {deviceState.firmwareVersion || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                        Last Seen
                      </Typography>
                      <Typography variant="body2">
                        {deviceState.lastSeen ? formatDateTime(deviceState.lastSeen) : 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                        Last Update
                      </Typography>
                      <Typography variant="body2">
                        {lastUpdateTime ? lastUpdateTime.toLocaleTimeString() : 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  {deviceState.lastError && (
                    <Grid size={{ xs: 12 }}>
                      <Alert severity="error" sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Last Error:
                        </Typography>
                        <Typography variant="body2">{deviceState.lastError}</Typography>
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  {connectionStatus === 'connected' ? (
                    <>
                      <CircularProgress size={40} sx={{ mb: 2 }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Waiting for device state...
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Not connected to device hub
                    </Typography>
                  )}
                </Box>
              )}
            </Card>
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

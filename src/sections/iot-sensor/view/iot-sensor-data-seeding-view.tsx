import type { SensorAutoSeedStatus } from 'src/api/types/generated';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useGetapiIotSensorsensorIdautoseedstatus,
  usePostapiIotSensorsensorIdautoseeddisable,
  usePostapiIotSensorsensorIdautoseedenable,
  usePostapiIotSensorsensorIdautoseedreset,
} from 'src/api/hooks/generated/use-iot-sensor';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface IoTSensorDataSeedingViewProps {
  deviceId: string;
  sensorId: string;
  deviceCode?: string;
  sensorCode?: string;
}

export function IoTSensorDataSeedingView({
  deviceId,
  sensorId,
  deviceCode,
  sensorCode,
}: IoTSensorDataSeedingViewProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch auto-seed status
  const {
    data: autoSeedStatus,
    isLoading: isLoadingStatus,
    refetch: refetchStatus,
  } = useGetapiIotSensorsensorIdautoseedstatus(sensorId);

  // Enable auto-seed mutation
  const { mutate: enableAutoSeed, isPending: isEnabling } =
    usePostapiIotSensorsensorIdautoseedenable({
      onSuccess: () => {
        setSuccessMessage('Auto-seed enabled successfully');
        refetchStatus();
      },
      onError: (error) => {
        setErrorMessage(error.message || 'Failed to enable auto-seed');
      },
    });

  // Disable auto-seed mutation
  const { mutate: disableAutoSeed, isPending: isDisabling } =
    usePostapiIotSensorsensorIdautoseeddisable({
      onSuccess: () => {
        setSuccessMessage('Auto-seed disabled successfully');
        refetchStatus();
      },
      onError: (error) => {
        setErrorMessage(error.message || 'Failed to disable auto-seed');
      },
    });

  // Reset auto-seed mutation
  const { mutate: resetAutoSeed, isPending: isResetting } =
    usePostapiIotSensorsensorIdautoseedreset({
      onSuccess: () => {
        setSuccessMessage('Auto-seed reset successfully');
        refetchStatus();
      },
      onError: (error) => {
        setErrorMessage(error.message || 'Failed to reset auto-seed');
      },
    });

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleCloseSuccess = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  const handleEnable = useCallback(() => {
    enableAutoSeed({ sensorId, data: {} });
  }, [enableAutoSeed, sensorId]);

  const handleDisable = useCallback(() => {
    disableAutoSeed({ sensorId });
  }, [disableAutoSeed, sensorId]);

  const handleReset = useCallback(() => {
    resetAutoSeed({ sensorId });
  }, [resetAutoSeed, sensorId]);

  const handleBack = useCallback(() => {
    router.push(`/iot-devices/${deviceId}/edit`);
  }, [router, deviceId]);

  const isProcessing = isEnabling || isDisabling || isResetting;
  const status = autoSeedStatus as SensorAutoSeedStatus | undefined;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Sensor Data Seeding
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            IoT Device
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'text.primary', cursor: 'pointer' }}
            onClick={handleBack}
          >
            {deviceCode || deviceId}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            Data Seeding
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Sensor Info Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Sensor Information
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Sensor Code
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {sensorCode || sensorId}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Device Code
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {deviceCode || deviceId}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Auto-Seed Controls Card */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Auto-Seed Configuration
            </Typography>

            {isLoadingStatus ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Stack spacing={3}>
                {/* Status Display */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Current Status
                  </Typography>
                  <Label
                    color={status?.isEnabled ? 'success' : 'default'}
                    sx={{ px: 2, py: 1 }}
                  >
                    {status?.isEnabled ? 'Enabled' : 'Disabled'}
                  </Label>
                </Box>

                {/* Status Details */}
                {status && (
                  <Stack spacing={2}>
                    {status.counter !== undefined && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Counter Value
                        </Typography>
                        <Typography variant="body2">{status.counter}</Typography>
                      </Box>
                    )}
                    {status.mean !== undefined && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Mean Delay (seconds)
                        </Typography>
                        <Typography variant="body2">{status.mean}</Typography>
                      </Box>
                    )}
                    {status.std !== undefined && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Standard Deviation (seconds)
                        </Typography>
                        <Typography variant="body2">{status.std}</Typography>
                      </Box>
                    )}
                    {status.intervalMs !== undefined && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Interval (ms)
                        </Typography>
                        <Typography variant="body2">{status.intervalMs}</Typography>
                      </Box>
                    )}
                  </Stack>
                )}

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {!status?.isEnabled ? (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<Iconify icon="solar:play-circle-bold" />}
                      onClick={handleEnable}
                      disabled={isProcessing}
                    >
                      {isEnabling ? <CircularProgress size={24} /> : 'Enable Auto-Seed'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={<Iconify icon="solar:moon-bold" />}
                      onClick={handleDisable}
                      disabled={isProcessing}
                    >
                      {isDisabling ? <CircularProgress size={24} /> : 'Disable Auto-Seed'}
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<Iconify icon="solar:restart-bold" />}
                    onClick={handleReset}
                    disabled={isProcessing}
                  >
                    {isResetting ? <CircularProgress size={24} /> : 'Reset'}
                  </Button>
                </Box>

                {/* Back Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button variant="outlined" color="inherit" onClick={handleBack}>
                    Back to Device
                  </Button>
                </Box>
              </Stack>
            )}
          </Card>
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

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}

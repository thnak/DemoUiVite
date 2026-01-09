import type { SensorAutoSeedStatus } from 'src/api/types/generated';

import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useGetapiIotSensorsensorIdautoseedstatus,
  usePostapiIotSensorsensorIdautoseedreset,
  usePostapiIotSensorsensorIdautoseedenable,
  usePostapiIotSensorsensorIdautoseeddisable,
} from 'src/api/hooks/generated/use-iot-sensor';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';

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

  // Form state for enable auto-seed parameters
  const [mean, setMean] = useState<number>(5);
  const [std, setStd] = useState<number>(1);
  const [intervalMs, setIntervalMs] = useState<number>(5000);

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

  // Generate Gaussian distribution data for chart (10 columns)
  const gaussianData = useMemo(() => {
    const columns = 10;
    const data: number[] = [];
    const categories: string[] = [];

    // Generate x values (time intervals) centered around the mean
    const rangeStart = mean - 3 * std;
    const rangeEnd = mean + 3 * std;
    const step = (rangeEnd - rangeStart) / (columns - 1);

    for (let i = 0; i < columns; i += 1) {
      const x = rangeStart + i * step;
      categories.push(`${x.toFixed(1)}s`);

      // Calculate Gaussian probability density function
      const exponent = -((x - mean) ** 2) / (2 * std ** 2);
      const coefficient = 1 / (std * Math.sqrt(2 * Math.PI));
      const y = coefficient * Math.exp(exponent);

      // Scale for better visualization (multiply by a constant to make values visible)
      data.push(y * 100);
    }

    return { data, categories };
  }, [mean, std]);

  const chartOptions = useChart({
    chart: {
      toolbar: { show: false },
    },
    xaxis: {
      categories: gaussianData.categories,
      title: {
        text: 'Time (seconds)',
      },
    },
    yaxis: {
      title: {
        text: 'Probability Density',
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => value.toFixed(2),
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '60%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
  });

  const handleEnable = useCallback(() => {
    enableAutoSeed({
      sensorId,
      data: {
        mean,
        std,
        intervalMs,
      },
    });
  }, [enableAutoSeed, sensorId, mean, std, intervalMs]);

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

                {/* Configuration Inputs (only show when disabled) */}
                {!status?.isEnabled && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Gaussian Distribution Parameters
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Mean (seconds)"
                        value={mean}
                        onChange={(e) => setMean(Number(e.target.value))}
                        helperText="Average time delay between data generation"
                        slotProps={{
                          htmlInput: { step: 0.1, min: 0 }
                        }}
                      />
                      <TextField
                        fullWidth
                        type="number"
                        label="Standard Deviation (seconds)"
                        value={std}
                        onChange={(e) => setStd(Number(e.target.value))}
                        helperText="Variation in time delay"
                        slotProps={{
                          htmlInput: { step: 0.1, min: 0.1 }
                        }}
                      />
                      <TextField
                        fullWidth
                        type="number"
                        label="Interval (milliseconds)"
                        value={intervalMs}
                        onChange={(e) => setIntervalMs(Number(e.target.value))}
                        helperText="Base interval between data points (deprecated)"
                        slotProps={{
                          htmlInput: { step: 100, min: 0 }
                        }}
                      />
                    </Stack>
                  </Box>
                )}

                {/* Gaussian Distribution Chart */}
                {!status?.isEnabled && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Gaussian Distribution Preview
                    </Typography>
                    <Chart
                      type="bar"
                      series={[
                        {
                          name: 'Probability Density',
                          data: gaussianData.data,
                        },
                      ]}
                      options={chartOptions}
                      slotProps={{ loading: { p: 2.5 } }}
                      sx={{ height: 250 }}
                    />
                  </Box>
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

import type { IoTSensorType } from 'src/api/types/generated';

import { useState, useEffect, useCallback, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useCreateIoTSensor,
  useUpdateIoTSensor,
  useGetIoTSensorById,
} from 'src/api/hooks/generated/use-io-tsensor';

import { IoTDeviceSelector } from 'src/components/selectors/io-tdevice-selector';

// ----------------------------------------------------------------------

const SENSOR_TYPES: { value: IoTSensorType; label: string }[] = [
  { value: 'temperature', label: 'Temperature' },
  { value: 'humidity', label: 'Humidity' },
  { value: 'pressure', label: 'Pressure' },
  { value: 'light', label: 'Light' },
  { value: 'camera', label: 'Camera' },
  { value: 'proximity', label: 'Proximity' },
  { value: 'accelerometer', label: 'Accelerometer' },
  { value: 'gyroscope', label: 'Gyroscope' },
  { value: 'magnetometer', label: 'Magnetometer' },
  { value: 'heartRate', label: 'Heart Rate' },
  { value: 'gps', label: 'GPS' },
  { value: 'pingStatus', label: 'Ping Status' },
  { value: 'counter', label: 'Counter' },
  { value: 'analog', label: 'Analog' },
  { value: 'press', label: 'Press' },
  { value: 'unknown', label: 'Unknown' },
];

interface IoTSensorFormData {
  code: string;
  name: string;
  description: string;
  type: IoTSensorType | '';
  deviceId: string;
  pinNumber: string;
  unitOfMeasurement: string;
}

interface IoTSensorCreateEditViewProps {
  isEdit?: boolean;
  currentSensorId?: string;
}

export function IoTSensorCreateEditView({
  isEdit = false,
  currentSensorId,
}: IoTSensorCreateEditViewProps) {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<IoTSensorFormData>({
    code: '',
    name: '',
    description: '',
    type: '',
    deviceId: '',
    pinNumber: '',
    unitOfMeasurement: '',
  });

  // Load sensor data in edit mode
  const { data: currentSensor, isLoading: isLoadingSensor } = useGetIoTSensorById(
    currentSensorId || '',
    {
      enabled: isEdit && !!currentSensorId,
    }
  );

  useEffect(() => {
    if (currentSensor && isEdit) {
      setFormData({
        code: currentSensor.code || '',
        name: currentSensor.name || '',
        description: currentSensor.description || '',
        type: currentSensor.type || '',
        deviceId: currentSensor.deviceId?.toString() || '',
        pinNumber: currentSensor.pinNumber?.toString() || '',
        unitOfMeasurement: currentSensor.unitOfMeasurement?.toString() || '',
      });
    }
  }, [currentSensor, isEdit]);

  const { mutate: createSensorMutate, isPending: isCreating } = useCreateIoTSensor({
    onSuccess: (result) => {
      if (result.isSuccess) {
        router.push('/iot-sensors');
      } else {
        setErrorMessage(result.message || 'Failed to create sensor');
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to create sensor');
    },
  });

  const { mutate: updateSensorMutate, isPending: isUpdating } = useUpdateIoTSensor({
    onSuccess: (result) => {
      if (result.isSuccess) {
        router.push('/iot-sensors');
      } else {
        setErrorMessage(result.message || 'Failed to update sensor');
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to update sensor');
    },
  });

  const isSubmitting = isCreating || isUpdating;

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof IoTSensorFormData) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: event.target.value,
        }));
      },
    []
  );

  const handleSelectChange = useCallback(
    (field: keyof IoTSensorFormData) => (event: { target: { value: string } }) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    },
    []
  );

  const handleDeviceChange = useCallback((deviceId: string | null) => {
    setFormData((prev) => ({
      ...prev,
      deviceId: deviceId || '',
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!formData.name) {
      setErrorMessage('Sensor name is required');
      return;
    }
    if (!formData.code) {
      setErrorMessage('Sensor code is required');
      return;
    }
    if (!formData.deviceId) {
      setErrorMessage('Device is required');
      return;
    }

    if (isEdit && currentSensorId) {
      updateSensorMutate({
        id: currentSensorId,
        data: [
          { key: 'code', value: formData.code },
          { key: 'name', value: formData.name },
          { key: 'description', value: formData.description },
          { key: 'type', value: formData.type },
          { key: 'deviceId', value: formData.deviceId },
          { key: 'pinNumber', value: formData.pinNumber ? parseInt(formData.pinNumber, 10) : null },
          { key: 'unitOfMeasurement', value: formData.unitOfMeasurement || null },
        ],
      });
    } else {
      createSensorMutate({
        data: {
          code: formData.code,
          name: formData.name,
          description: formData.description || undefined,
          type: formData.type ? (formData.type as IoTSensorType) : undefined,
          deviceId: formData.deviceId,
          pinNumber: formData.pinNumber ? parseInt(formData.pinNumber, 10) : undefined,
          unitOfMeasurement: formData.unitOfMeasurement || undefined,
        },
      });
    }
  }, [formData, isEdit, currentSensorId, createSensorMutate, updateSensorMutate]);

  const handleCancel = useCallback(() => {
    router.push('/iot-sensors');
  }, [router]);

  if (isEdit && isLoadingSensor) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {isEdit ? 'Edit IoT Sensor' : 'Create a new IoT Sensor'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            IoT Sensor
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            {isEdit ? 'Edit' : 'Create'}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Section - Additional Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Additional Information
            </Typography>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleInputChange('description')}
                multiline
                rows={4}
                placeholder="Sensor description..."
              />
            </Stack>
          </Card>
        </Grid>

        {/* Right Section - Main Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Sensor Details
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Sensor code"
                    value={formData.code}
                    onChange={handleInputChange('code')}
                    required
                    placeholder="SEN-001"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Sensor name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    required
                    placeholder="Temperature Sensor"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <IoTDeviceSelector
                    value={formData.deviceId}
                    onChange={handleDeviceChange}
                    label="Device"
                    required
                    disabled={isSubmitting}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Pin Number"
                    value={formData.pinNumber}
                    onChange={handleInputChange('pinNumber')}
                    type="number"
                    placeholder="0"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Sensor Type</InputLabel>
                    <Select
                      value={formData.type}
                      label="Sensor Type"
                      onChange={handleSelectChange('type')}
                    >
                      {SENSOR_TYPES.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Unit of Measurement"
                    value={formData.unitOfMeasurement}
                    onChange={handleInputChange('unitOfMeasurement')}
                    placeholder="°C, %, etc."
                  />
                </Grid>
              </Grid>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="inherit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{
                  bgcolor: 'text.primary',
                  color: (theme) =>
                    theme.palette.mode === 'light' ? 'common.white' : 'grey.800',
                  '&:hover': {
                    bgcolor: 'text.primary',
                  },
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : isEdit ? (
                  'Save changes'
                ) : (
                  'Create sensor'
                )}
              </Button>
            </Box>
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

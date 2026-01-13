import type { IoTSensorType } from 'src/api/types/generated';

import { useMemo, useState, useCallback, type ChangeEvent } from 'react';

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

import { useValidationResult } from 'src/hooks/use-validation-result';

import { isValidationSuccess } from 'src/utils/validation-result';

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

  // Use ValidationResult hook for form validation
  const {
    setValidationResult,
    clearValidationResult,
    getFieldErrorMessage,
    hasError,
    clearFieldError,
    overallMessage,
  } = useValidationResult();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load sensor data in edit mode
  const { data: currentSensor, isLoading: isLoadingSensor } = useGetIoTSensorById(
    currentSensorId || '',
    {
      enabled: isEdit && !!currentSensorId,
    }
  );

  // Initialize form data using useMemo - React Compiler friendly
  const initialFormData = useMemo<IoTSensorFormData>(() => {
    if (isEdit && currentSensor) {
      return {
        code: currentSensor.code || '',
        name: currentSensor.name || '',
        description: currentSensor.description || '',
        type: currentSensor.type || '',
        deviceId: currentSensor.deviceId?.toString() || '',
        pinNumber: currentSensor.pinNumber?.toString() || '',
        unitOfMeasurement: currentSensor.unitOfMeasurement?.toString() || '',
      };
    }
    return {
      code: '',
      name: '',
      description: '',
      type: '',
      deviceId: '',
      pinNumber: '',
      unitOfMeasurement: '',
    };
  }, [isEdit, currentSensor]);

  const [formData, setFormData] = useState<IoTSensorFormData>(initialFormData);

  const { mutate: createSensorMutate, isPending: isCreating } = useCreateIoTSensor({
    onSuccess: (result) => {
      setValidationResult(result);
      if (isValidationSuccess(result)) {
        router.push('/iot-sensors');
      } else {
        if (result.message) {
          setErrorMessage(result.message);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to create sensor');
    },
  });

  const { mutate: updateSensorMutate, isPending: isUpdating } = useUpdateIoTSensor({
    onSuccess: (result) => {
      setValidationResult(result);
      if (isValidationSuccess(result)) {
        router.push('/iot-sensors');
      } else {
        if (result.message) {
          setErrorMessage(result.message);
        }
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
        clearFieldError(field);
      },
    [clearFieldError]
  );

  const handleSelectChange = useCallback(
    (field: keyof IoTSensorFormData) => (event: { target: { value: string } }) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      clearFieldError(field);
    },
    [clearFieldError]
  );

  const handleDeviceChange = useCallback(
    (deviceId: string | null) => {
      setFormData((prev) => ({
        ...prev,
        deviceId: deviceId || '',
      }));
      clearFieldError('deviceId');
    },
    [clearFieldError]
  );

  const handleSubmit = useCallback(() => {
    clearValidationResult();
    setErrorMessage(null);

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
          description: formData.description || '',
          type: formData.type ? (formData.type as IoTSensorType) : undefined,
          deviceId: formData.deviceId || '',
          pinNumber: formData.pinNumber ? parseInt(formData.pinNumber, 10) : undefined,
          unitOfMeasurement: formData.unitOfMeasurement || undefined,
        } as any, // Cast to any to bypass strict type checking for required fields
      });
    }
  }, [formData, isEdit, currentSensorId, createSensorMutate, updateSensorMutate, clearValidationResult]);

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
                error={hasError('description')}
                helperText={getFieldErrorMessage('description')}
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
                    error={hasError('code')}
                    helperText={getFieldErrorMessage('code')}
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
                    error={hasError('name')}
                    helperText={getFieldErrorMessage('name')}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <IoTDeviceSelector
                    value={formData.deviceId}
                    onChange={handleDeviceChange}
                    label="Device"
                    required
                    disabled={isSubmitting}
                    error={hasError('deviceId')}
                    helperText={getFieldErrorMessage('deviceId') || undefined}
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
                    error={hasError('pinNumber')}
                    helperText={getFieldErrorMessage('pinNumber')}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth error={hasError('type')}>
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
                    error={hasError('unitOfMeasurement')}
                    helperText={getFieldErrorMessage('unitOfMeasurement')}
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
        open={!!(errorMessage || overallMessage)}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {errorMessage || overallMessage}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}

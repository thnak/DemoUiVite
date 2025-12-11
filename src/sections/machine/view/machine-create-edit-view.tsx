import type { ChangeEvent } from 'react';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { AreaSelector } from 'src/components/area-selector';
import { CalendarSelector } from 'src/components/calendar-selector';
import { useCreateMachine, useUpdateMachine } from 'src/api/hooks/generated/use-machine';
import { ImageEntityResourceUploader } from 'src/components/image-entity-resource-uploader';
import {
  useGetapiDevicesearchdevice,
  useGetapiDevicegetsensorbydeviceid,
} from 'src/api/hooks/generated/use-device';

import type {
  IoTSensorEntity,
  IoTDeviceEntity,
  OutputCalculationMode,
} from 'src/api/types/generated';

// ----------------------------------------------------------------------

interface MachineFormData {
  code: string;
  name: string;
  imageUrl: string;
  areaId: string | null;
  calendarId: string | null;
  calculationMode: OutputCalculationMode;
}

interface DeviceMapping {
  deviceId: string;
  device: IoTDeviceEntity;
}

interface SensorOutputMapping {
  sensorId: string;
  sensor: IoTSensorEntity;
  index: number;
  scalingFactor: number;
  enabled: boolean;
}

interface MachineCreateEditViewProps {
  isEdit?: boolean;
  currentMachine?: {
    id: string;
    code: string;
    name: string;
    imageUrl: string;
    areaId: string | null;
    calendarId: string | null;
    calculationMode: OutputCalculationMode;
  };
}

export function MachineCreateEditView({
  isEdit = false,
  currentMachine,
}: MachineCreateEditViewProps) {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<MachineFormData>({
    code: currentMachine?.code || '',
    name: currentMachine?.name || '',
    imageUrl: currentMachine?.imageUrl || '',
    areaId: currentMachine?.areaId || null,
    calendarId: currentMachine?.calendarId || null,
    calculationMode: currentMachine?.calculationMode || 'pairParallel',
  });

  // Device mapping state
  const [deviceMappings, setDeviceMappings] = useState<DeviceMapping[]>([]);
  const [deviceSearchKeyword, setDeviceSearchKeyword] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<IoTDeviceEntity | null>(null);

  // Sensor output mapping state
  const [sensorOutputMappings, setSensorOutputMappings] = useState<SensorOutputMapping[]>([]);

  // Search devices
  const { data: deviceSearchResults, isFetching: isDeviceSearching } =
    useGetapiDevicesearchdevice(
      {
        params: {
          keyword: deviceSearchKeyword || undefined,
          pageSize: 10,
        },
      },
      {
        enabled: deviceSearchKeyword.length > 0,
      }
    );

  const devices = deviceSearchResults?.data || [];

  const { mutate: createMachineMutate, isPending: isCreating } = useCreateMachine({
    onSuccess: (result) => {
      if (result.isSuccess) {
        router.push('/machines');
      } else {
        setErrorMessage(result.message || 'Failed to create machine');
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to create machine');
    },
  });

  const { mutate: updateMachineMutate, isPending: isUpdating } = useUpdateMachine({
    onSuccess: (result) => {
      if (result.isSuccess) {
        router.push('/machines');
      } else {
        setErrorMessage(result.message || 'Failed to update machine');
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to update machine');
    },
  });

  const isSubmitting = isCreating || isUpdating;

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof MachineFormData) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: event.target.value,
        }));
      },
    []
  );

  const handleCalculationModeChange = useCallback(
    (event: any) => {
      setFormData((prev) => ({
        ...prev,
        calculationMode: event.target.value as OutputCalculationMode,
      }));
    },
    []
  );

  const handleImageUrlChange = useCallback((newImageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: newImageUrl,
    }));
  }, []);

  const handleAreaChange = useCallback((areaId: string | null) => {
    setFormData((prev) => ({
      ...prev,
      areaId,
    }));
  }, []);

  const handleCalendarChange = useCallback((calendarId: string | null) => {
    setFormData((prev) => ({
      ...prev,
      calendarId,
    }));
  }, []);

  const handleDeviceAdd = useCallback(() => {
    if (selectedDevice && !deviceMappings.some((dm) => dm.deviceId === String(selectedDevice.id))) {
      setDeviceMappings((prev) => [
        ...prev,
        {
          deviceId: String(selectedDevice.id),
          device: selectedDevice,
        },
      ]);
      setSelectedDevice(null);
      setDeviceSearchKeyword('');
    }
  }, [selectedDevice, deviceMappings]);

  const handleDeviceRemove = useCallback((deviceId: string) => {
    setDeviceMappings((prev) => prev.filter((dm) => dm.deviceId !== deviceId));
  }, []);

  const handleSensorScalingFactorChange = useCallback((sensorId: string, value: number) => {
    setSensorOutputMappings((prev) =>
      prev.map((som) => (som.sensorId === sensorId ? { ...som, scalingFactor: value } : som))
    );
  }, []);

  const handleSensorEnabledChange = useCallback((sensorId: string, enabled: boolean) => {
    setSensorOutputMappings((prev) =>
      prev.map((som) => (som.sensorId === sensorId ? { ...som, enabled } : som))
    );
  }, []);

  const handleSubmit = useCallback(() => {
    if (!formData.name) {
      setErrorMessage('Machine name is required');
      return;
    }

    if (isEdit && currentMachine?.id) {
      // Update uses key-value pairs as per API spec
      updateMachineMutate({
        id: currentMachine.id,
        data: [
          { key: 'code', value: formData.code },
          { key: 'name', value: formData.name },
          { key: 'imageUrl', value: formData.imageUrl },
          { key: 'areaId', value: formData.areaId },
          { key: 'calendarId', value: formData.calendarId },
          { key: 'calculationMode', value: formData.calculationMode },
        ],
      });
    } else {
      // Create uses full entity object as per API spec
      createMachineMutate({
        data: {
          code: formData.code,
          name: formData.name,
          imageUrl: formData.imageUrl,
          areaId: formData.areaId,
          calendarId: formData.calendarId,
          calculationMode: formData.calculationMode,
        },
      });
    }
  }, [formData, isEdit, currentMachine?.id, createMachineMutate, updateMachineMutate]);

  const handleCancel = useCallback(() => {
    router.push('/machines');
  }, [router]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {isEdit ? 'Edit machine' : 'Create a new machine'}
        </Typography>
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
            {isEdit ? 'Edit' : 'Create'}
          </Typography>
        </Box>
      </Box>

      <Stack spacing={3}>
        {/* Machine Information Section */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Machine Information
          </Typography>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Machine code"
              value={formData.code}
              onChange={handleInputChange('code')}
            />

            <TextField
              fullWidth
              label="Machine name"
              value={formData.name}
              onChange={handleInputChange('name')}
              required
            />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Machine Image
              </Typography>
              <ImageEntityResourceUploader
                imageUrl={formData.imageUrl}
                onImageUrlChange={handleImageUrlChange}
                aspectRatio={16 / 9}
                previewSize={300}
              />
            </Box>

            <AreaSelector
              value={formData.areaId}
              onChange={handleAreaChange}
              label="Area"
            />

            <CalendarSelector
              value={formData.calendarId}
              onChange={handleCalendarChange}
              label="Calendar"
            />

            <FormControl fullWidth>
              <InputLabel>Calculation Mode</InputLabel>
              <Select
                value={formData.calculationMode}
                onChange={handleCalculationModeChange}
                label="Calculation Mode"
              >
                <MenuItem value="pairParallel">Pair Parallel</MenuItem>
                <MenuItem value="weightedChannels">Weighted Channels</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Card>

        {/* Device Mapping Section */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Device Mapping
          </Typography>

          <Stack spacing={3}>
            <Stack direction="row" spacing={2}>
              <Autocomplete
                fullWidth
                value={selectedDevice}
                onChange={(_, newValue) => setSelectedDevice(newValue)}
                inputValue={deviceSearchKeyword}
                onInputChange={(_, newInputValue) => setDeviceSearchKeyword(newInputValue)}
                options={devices}
                getOptionLabel={(option) => option.name || option.code || ''}
                isOptionEqualToValue={(option, val) => option.id === val.id}
                loading={isDeviceSearching}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Device"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isDeviceSearching ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              <Button
                variant="contained"
                onClick={handleDeviceAdd}
                disabled={!selectedDevice}
                sx={{ minWidth: 120 }}
              >
                Add Device
              </Button>
            </Stack>

            {deviceMappings.length > 0 && (
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: 'left',
                          padding: '12px',
                          borderBottom: '1px solid rgba(224, 224, 224, 1)',
                        }}
                      >
                        Code
                      </th>
                      <th
                        style={{
                          textAlign: 'left',
                          padding: '12px',
                          borderBottom: '1px solid rgba(224, 224, 224, 1)',
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          textAlign: 'left',
                          padding: '12px',
                          borderBottom: '1px solid rgba(224, 224, 224, 1)',
                        }}
                      >
                        MAC Address
                      </th>
                      <th
                        style={{
                          textAlign: 'right',
                          padding: '12px',
                          borderBottom: '1px solid rgba(224, 224, 224, 1)',
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {deviceMappings.map((dm) => (
                      <tr key={dm.deviceId}>
                        <td style={{ padding: '12px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                          {dm.device.code || '-'}
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                          {dm.device.name || '-'}
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                          {dm.device.macAddress || '-'}
                        </td>
                        <td
                          style={{
                            padding: '12px',
                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                            textAlign: 'right',
                          }}
                        >
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleDeviceRemove(dm.deviceId)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            )}

            {deviceMappings.length === 0 && (
              <Box
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'background.neutral',
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No devices mapped yet. Use the search above to add devices.
                </Typography>
              </Box>
            )}
          </Stack>
        </Card>

        {/* Sensor Output Mapping Section */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Sensor Output Mapping
          </Typography>

          {sensorOutputMappings.length > 0 ? (
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '12px',
                        borderBottom: '1px solid rgba(224, 224, 224, 1)',
                      }}
                    >
                      Index
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '12px',
                        borderBottom: '1px solid rgba(224, 224, 224, 1)',
                      }}
                    >
                      Name
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '12px',
                        borderBottom: '1px solid rgba(224, 224, 224, 1)',
                      }}
                    >
                      Factor Scale
                    </th>
                    <th
                      style={{
                        textAlign: 'center',
                        padding: '12px',
                        borderBottom: '1px solid rgba(224, 224, 224, 1)',
                      }}
                    >
                      Enabled
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sensorOutputMappings.map((som, idx) => (
                    <tr key={som.sensorId}>
                      <td style={{ padding: '12px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                        {idx + 1}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                        {som.sensor.sensorName || som.sensor.sensorCode || '-'}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TextField
                          type="number"
                          size="small"
                          value={som.scalingFactor}
                          onChange={(e) =>
                            handleSensorScalingFactorChange(som.sensorId, Number(e.target.value))
                          }
                          sx={{ width: 120 }}
                        />
                      </td>
                      <td
                        style={{
                          padding: '12px',
                          borderBottom: '1px solid rgba(224, 224, 224, 1)',
                          textAlign: 'center',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={som.enabled}
                          onChange={(e) => handleSensorEnabledChange(som.sensorId, e.target.checked)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          ) : (
            <Box
              sx={{
                p: 3,
                textAlign: 'center',
                bgcolor: 'background.neutral',
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No sensor output mappings configured. Add devices first to configure sensor outputs.
              </Typography>
            </Box>
          )}
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" color="inherit" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="inherit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={(theme) => ({
              bgcolor: theme.palette.text.primary,
              color: theme.palette.background.paper,
              '&:hover': {
                bgcolor: theme.palette.text.secondary,
              },
            })}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : isEdit ? (
              'Save changes'
            ) : (
              'Create machine'
            )}
          </Button>
        </Box>
      </Stack>

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

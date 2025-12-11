import type { SelectChangeEvent } from '@mui/material/Select';
import type {
  IoTSensorEntity,
  IoTDeviceEntity,
  OutputCalculationMode,
} from 'src/api/types/generated';

import { useState, useCallback, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetapiDevicesearchdevice } from 'src/api/hooks/generated/use-device';
import { useCreateMachine, useUpdateMachine } from 'src/api/hooks/generated/use-machine';

import { AreaSelector } from 'src/components/area-selector';
import { CalendarSelector } from 'src/components/calendar-selector';
import { ImageEntityResourceUploader } from 'src/components/image-entity-resource-uploader';

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
  const { data: devices, isFetching: isDeviceSearching } =
    useGetapiDevicesearchdevice(
      {
        search: deviceSearchKeyword || undefined,
        pageSize: 10,
      },
      {
        enabled: deviceSearchKeyword.length > 0,
      }
    );

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
    (event: SelectChangeEvent<OutputCalculationMode>) => {
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
          { key: 'areaId', value: formData.areaId || undefined },
          { key: 'calendarId', value: formData.calendarId || undefined },
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
          areaId: formData.areaId || undefined,
          calendarId: formData.calendarId || undefined,
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

      <Grid container spacing={3}>
        {/* Left Section - Image Upload & Settings */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Machine Image
            </Typography>
            <ImageEntityResourceUploader
              imageUrl={formData.imageUrl}
              onImageUrlChange={handleImageUrlChange}
              aspectRatio={16 / 9}
              previewSize={300}
            />

            <Box sx={{ mt: 3 }}>
              <AreaSelector
                value={formData.areaId}
                onChange={handleAreaChange}
                label="Area"
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <CalendarSelector
                value={formData.calendarId}
                onChange={handleCalendarChange}
                label="Calendar"
              />
            </Box>

            <Box sx={{ mt: 3 }}>
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
            </Box>
          </Card>
        </Grid>

        {/* Right Section - Main Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Machine Information */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Machine Information
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Machine code"
                    value={formData.code}
                    onChange={handleInputChange('code')}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Machine name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    required
                  />
                </Grid>
              </Grid>
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
                    options={devices || []}
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
                              {isDeviceSearching ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
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
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Code</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>MAC Address</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {deviceMappings.map((dm) => (
                          <TableRow key={dm.deviceId}>
                            <TableCell>{dm.device.code || '-'}</TableCell>
                            <TableCell>{dm.device.name || '-'}</TableCell>
                            <TableCell>{dm.device.macAddress || '-'}</TableCell>
                            <TableCell align="right">
                              <Button
                                size="small"
                                color="error"
                                onClick={() => handleDeviceRemove(dm.deviceId)}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
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
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Index</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Factor Scale</TableCell>
                        <TableCell align="center">Enabled</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sensorOutputMappings.map((som, idx) => (
                        <TableRow key={som.sensorId}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>
                            {som.sensor.sensorName || som.sensor.sensorCode || '-'}
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={som.scalingFactor}
                              onChange={(e) =>
                                handleSensorScalingFactorChange(som.sensorId, Number(e.target.value))
                              }
                              sx={{ width: 120 }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Switch
                              checked={som.enabled}
                              onChange={(e) =>
                                handleSensorEnabledChange(som.sensorId, e.target.checked)
                              }
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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
                    No sensor output mappings configured. Add devices first to configure sensor
                    outputs.
                  </Typography>
                </Box>
              )}
            </Card>

            {/* Action Buttons */}
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

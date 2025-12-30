import type { IoTDeviceType, IoTSensorEntity } from 'src/api/types/generated';

import { useState, useEffect, useCallback, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Snackbar from '@mui/material/Snackbar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { useSearchIoTSensor } from 'src/api/hooks/generated/use-io-tsensor';
import { useAddSensorToDevice, useRemoveSensorFromDevice } from 'src/api/hooks/use-device';
import { useCreateIoTDevice, useUpdateIoTDevice } from 'src/api/hooks/generated/use-io-tdevice';
import { useGetapiIotSensorgetsensorfromdevicedeviceCode } from 'src/api/hooks/generated/use-iot-sensor';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { MachineSelector } from 'src/components/selectors/machine-selector';
import { ImageEntityResourceUploader } from 'src/components/image-entity-resource-uploader';

// ----------------------------------------------------------------------

const DEVICE_TYPES: { value: IoTDeviceType; label: string }[] = [
  { value: 'gateway', label: 'Gateway' },
  { value: 'sensorNode', label: 'Sensor Node' },
  { value: 'edgeDevice', label: 'Edge Device' },
  { value: 'actuator', label: 'Actuator' },
  { value: 'controller', label: 'Controller' },
  { value: 'other', label: 'Other' },
];

interface IoTDeviceFormData {
  code: string;
  name: string;
  macAddress: string;
  mqttPassword: string;
  mqttUsername: string;
  type: IoTDeviceType | '';
  machineId: string;
  imageUrl: string;
}

interface IoTDeviceCreateEditViewProps {
  isEdit?: boolean;
  currentDevice?: {
    id: string;
    code: string;
    name: string;
    macAddress: string;
    mqttPassword: string;
    mqttUsername: string;
    type: IoTDeviceType | '';
    machineId: string;
    machineName: string;
    imageUrl: string;
  };
}

export function IoTDeviceCreateEditView({
  isEdit = false,
  currentDevice,
}: IoTDeviceCreateEditViewProps) {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<IoTDeviceFormData>({
    code: currentDevice?.code || '',
    name: currentDevice?.name || '',
    macAddress: currentDevice?.macAddress || '',
    mqttPassword: currentDevice?.mqttPassword || '',
    mqttUsername: currentDevice?.mqttUsername || '',
    type: currentDevice?.type || '',
    machineId: currentDevice?.machineId || '',
    imageUrl: currentDevice?.imageUrl || '',
  });

  // Sensor mapping state (only for edit mode)
  const [mappedSensors, setMappedSensors] = useState<IoTSensorEntity[]>([]);
  const [sensorSearchText, setSensorSearchText] = useState('');
  const [selectedSensorToAdd, setSelectedSensorToAdd] = useState<IoTSensorEntity | null>(null);
  const [openPopover, setOpenPopover] = useState<{
    anchorEl: HTMLButtonElement | null;
    sensorId: string;
  } | null>(null);

  // API hooks
  const { data: sensorSearchResult, isLoading: isSearchingSensors } = useSearchIoTSensor(
    { searchText: sensorSearchText, maxResults: 10 },
    { enabled: sensorSearchText.length > 0 && isEdit }
  );

  const { data: deviceSensors, isLoading: isLoadingSensors, refetch: refetchSensors } =
    useGetapiIotSensorgetsensorfromdevicedeviceCode(currentDevice?.id || '', {
      enabled: isEdit && !!currentDevice?.id,
    });

  const { mutate: createDeviceMutate, isPending: isCreating } = useCreateIoTDevice({
    onSuccess: (result) => {
      if (result.isValid) {
        router.push('/iot-devices');
      } else {
        setErrorMessage(result.message || 'Failed to create device');
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to create device');
    },
  });

  const { mutate: updateDeviceMutate, isPending: isUpdating } = useUpdateIoTDevice({
    onSuccess: (result) => {
      if (result.isValid) {
        router.push('/iot-devices');
      } else {
        setErrorMessage(result.message || 'Failed to update device');
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to update device');
    },
  });

  const { mutate: addSensorToDevice, isPending: isAddingSensor } = useAddSensorToDevice({
    onSuccess: (result) => {
      if (result.isSuccess) {
        refetchSensors();
        setSelectedSensorToAdd(null);
        setSensorSearchText('');
      } else {
        setErrorMessage(result.message || 'Failed to add sensor');
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to add sensor');
    },
  });

  const { mutate: removeSensorFromDevice } = useRemoveSensorFromDevice({
    onSuccess: (result) => {
      if (result.isSuccess) {
        refetchSensors();
      } else {
        setErrorMessage(result.message || 'Failed to remove sensor');
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to remove sensor');
    },
  });

  // Load device sensors when in edit mode
  useEffect(() => {
    if (deviceSensors && isEdit) {
      setMappedSensors(deviceSensors);
    }
  }, [deviceSensors, isEdit]);

  const isSubmitting = isCreating || isUpdating;

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof IoTDeviceFormData) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: event.target.value,
        }));
      },
    []
  );

  const handleSelectChange = useCallback(
    (field: keyof IoTDeviceFormData) => (event: { target: { value: string } }) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    },
    []
  );

  const handleMachineChange = useCallback((machineId: string | null) => {
    setFormData((prev) => ({
      ...prev,
      machineId: machineId || '',
    }));
  }, []);

  const handleImageUrlChange = useCallback((newImageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: newImageUrl,
    }));
  }, []);

  const handleImageUploadError = useCallback((error: Error) => {
    setErrorMessage(error.message || 'Failed to upload image');
  }, []);

  const handleAddSensor = useCallback(() => {
    if (selectedSensorToAdd?.id && currentDevice?.id) {
      addSensorToDevice({
        deviceId: currentDevice.id,
        sensorId: selectedSensorToAdd.id.toString(),
      });
    }
  }, [selectedSensorToAdd, currentDevice?.id, addSensorToDevice]);

  const handleRemoveSensor = useCallback(
    (sensorId: string) => {
      if (sensorId && currentDevice?.id) {
        removeSensorFromDevice({ sensorId });
      }
    },
    [currentDevice?.id, removeSensorFromDevice]
  );

  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, sensorId: string) => {
      setOpenPopover({ anchorEl: event.currentTarget, sensorId });
    },
    []
  );

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleNavigateToDataSeeding = useCallback(
    (sensorId: string) => {
      handleClosePopover();
      const sensor = mappedSensors.find((s) => s.id?.toString() === sensorId);
      const params = new URLSearchParams();
      if (currentDevice?.code) params.set('deviceCode', currentDevice.code);
      if (sensor?.code) params.set('sensorCode', sensor.code);
      const queryString = params.toString();
      router.push(
        `/iot-devices/${currentDevice?.id}/sensors/${sensorId}/data-seeding${queryString ? `?${queryString}` : ''}`
      );
    },
    [router, currentDevice?.id, currentDevice?.code, mappedSensors, handleClosePopover]
  );

  const handleRemoveFromMenu = useCallback(
    (sensorId: string) => {
      handleClosePopover();
      handleRemoveSensor(sensorId);
    },
    [handleClosePopover, handleRemoveSensor]
  );

  const handleSubmit = useCallback(() => {
    if (!formData.name) {
      setErrorMessage('Device name is required');
      return;
    }
    if (!formData.code) {
      setErrorMessage('Device code is required');
      return;
    }

    if (isEdit && currentDevice?.id) {
      updateDeviceMutate({
        id: currentDevice.id,
        data: [
          { key: 'code', value: formData.code },
          { key: 'name', value: formData.name },
          { key: 'macAddress', value: formData.macAddress },
          { key: 'mqttPassword', value: formData.mqttPassword },
          { key: 'mqttUsername', value: formData.mqttUsername },
          { key: 'type', value: formData.type },
          { key: 'machineId', value: formData.machineId },
          { key: 'imageUrl', value: formData.imageUrl },
        ],
      });
    } else {
      createDeviceMutate({
        data: {
          code: formData.code,
          name: formData.name,
          macAddress: formData.macAddress || undefined,
          mqttPassword: formData.mqttPassword || undefined,
          mqttUsername: formData.mqttUsername || undefined,
          type: formData.type ? (formData.type as IoTDeviceType) : undefined,
          machineId: formData.machineId || undefined,
          imageUrl: formData.imageUrl || undefined,
        },
      });
    }
  }, [formData, isEdit, currentDevice?.id, createDeviceMutate, updateDeviceMutate]);

  const handleCancel = useCallback(() => {
    router.push('/iot-devices');
  }, [router]);

  const sensors = sensorSearchResult?.data || [];

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {isEdit ? 'Edit IoT Device' : 'Create a new IoT Device'}
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
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            {isEdit ? 'Edit' : 'Create'}
          </Typography>
        </Box>
      </Box>
      <Grid container spacing={3}>
        {/* Left Section - Image */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Device Image
              </Typography>
              <Stack alignItems="center">
                <ImageEntityResourceUploader
                  imageUrl={formData.imageUrl}
                  onImageUrlChange={handleImageUrlChange}
                  onUploadError={handleImageUploadError}
                  disabled={isSubmitting}
                  placeholder="Upload device image"
                  previewSize={200}
                  aspectRatio={1}
                />
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Machine
              </Typography>
              <MachineSelector
                value={formData.machineId}
                onChange={handleMachineChange}
                disabled={isSubmitting}
                label="Select Machine"
              />
            </Card>
          </Stack>
        </Grid>

        {/* Right Section - Device Info Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Device code"
                  value={formData.code}
                  onChange={handleInputChange('code')}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Device name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="MAC Address"
                  value={formData.macAddress}
                  onChange={handleInputChange('macAddress')}
                  placeholder="00:00:00:00:00:00"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Device Type</InputLabel>
                  <Select
                    value={formData.type}
                    label="Device Type"
                    onChange={handleSelectChange('type')}
                  >
                    {DEVICE_TYPES.map((type) => (
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
                  label="MQTT Username"
                  value={formData.mqttUsername}
                  onChange={handleInputChange('mqttUsername')}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="MQTT Password"
                  value={formData.mqttPassword}
                  onChange={handleInputChange('mqttPassword')}
                  type="password"
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
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
                  'Create device'
                )}
              </Button>
            </Box>
          </Card>

          {/* Sensor Mapping Section - Only shown in edit mode */}
          {isEdit && (
            <Card sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Sensor Mapping
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Autocomplete
                  fullWidth
                  value={selectedSensorToAdd}
                  onChange={(_event, value) => setSelectedSensorToAdd(value)}
                  inputValue={sensorSearchText}
                  onInputChange={(_event, newInputValue) => setSensorSearchText(newInputValue)}
                  options={sensors.filter((s) => !mappedSensors.find((m) => m.id === s.id))}
                  getOptionLabel={(option) => option.name || option.code || ''}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  loading={isSearchingSensors}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search sensor to add"
                      placeholder="Search by name or code..."
                      slotProps={{
                        input: {
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {isSearchingSensors ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id?.toString()}>
                      <Box>
                        <Typography variant="body2">{option.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {option.code} • {option.type}
                        </Typography>
                      </Box>
                    </li>
                  )}
                />
                <Button
                  variant="contained"
                  onClick={handleAddSensor}
                  disabled={!selectedSensorToAdd || isAddingSensor}
                  sx={{ minWidth: 100 }}
                >
                  {isAddingSensor ? <CircularProgress size={24} /> : 'Add'}
                </Button>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {isLoadingSensors ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : mappedSensors.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No sensors mapped to this device
                  </Typography>
                </Box>
              ) : (
                <Scrollbar>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Code</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Pin</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mappedSensors.map((sensor) => (
                          <TableRow key={sensor.id?.toString()}>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                {sensor.code}
                              </Typography>
                            </TableCell>
                            <TableCell>{sensor.name}</TableCell>
                            <TableCell>
                              <Label color="info">{sensor.type || '-'}</Label>
                            </TableCell>
                            <TableCell>{sensor.pinNumber ?? '-'}</TableCell>
                            <TableCell>
                              <Label
                                color={
                                  sensor.status === 'operational'
                                    ? 'success'
                                    : sensor.status === 'offline'
                                      ? 'error'
                                      : 'warning'
                                }
                              >
                                {sensor.status || 'unknown'}
                              </Label>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={(e) =>
                                  handleOpenPopover(e, sensor.id?.toString() || '')
                                }
                              >
                                <Iconify icon="eva:more-vertical-fill" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
              )}

              <Popover
                open={!!openPopover}
                anchorEl={openPopover?.anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuList
                  disablePadding
                  sx={{
                    p: 0.5,
                    gap: 0.5,
                    width: 180,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      if (openPopover?.sensorId) {
                        handleNavigateToDataSeeding(openPopover.sensorId);
                      }
                    }}
                  >
                    <Iconify icon="solar:database-bold-duotone" />
                    Data Seeding
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      if (openPopover?.sensorId) {
                        handleRemoveFromMenu(openPopover.sensorId);
                      }
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Remove
                  </MenuItem>
                </MenuList>
              </Popover>
            </Card>
          )}
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

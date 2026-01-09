import type { SelectChangeEvent } from '@mui/material/Select';
import type { OutputCalculationMode, MachineOutputMappingResponse } from 'src/api/types/generated';

import { useState, useEffect, useCallback, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
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
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { useValidationResult } from 'src/hooks/use-validation-result';

import { isValidationSuccess } from 'src/utils/validation-result';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useCreateMachine,
  useUpdateMachine,
  useGetapiMachinemachineIddevicemappings,
  useGetapiMachinemachineIdmachineoutputmappings,
  usePutapiMachinemachineIdupdatemachineoutputmappings,
} from 'src/api/hooks/generated/use-machine';

import { Iconify } from 'src/components/iconify';
import { AreaSelector } from 'src/components/selectors/area-selector';
import { CalendarSelector } from 'src/components/selectors/calendar-selector';
import { MachineTypeSelector } from 'src/components/selectors/machine-type-selector';
import { ImageEntityResourceUploader } from 'src/components/image-entity-resource-uploader';

// ----------------------------------------------------------------------

interface MachineFormData {
  code: string;
  name: string;
  imageUrl: string;
  areaId: string | null;
  calendarId: string | null;
  machineTypeId: string | null;
  calculationMode: OutputCalculationMode;
}

interface SensorOutputMapping extends MachineOutputMappingResponse {
  outputId: string;
}

interface DraggedSensorMapping extends SensorOutputMapping {
  sourceTable: 'good' | 'scrap';
}

// Constants for scale factors
const DEFAULT_GOOD_SCALE_FACTOR = 1;
const DEFAULT_SCRAP_SCALE_FACTOR = -1;

interface MachineCreateEditViewProps {
  isEdit?: boolean;
  currentMachine?: {
    id: string;
    code: string;
    name: string;
    imageUrl: string;
    areaId: string | null;
    calendarId: string | null;
    machineTypeId: string | null;
    calculationMode: OutputCalculationMode;
  };
}

export function MachineCreateEditView({
  isEdit = false,
  currentMachine,
}: MachineCreateEditViewProps) {
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
  const [formData, setFormData] = useState<MachineFormData>({
    code: currentMachine?.code || '',
    name: currentMachine?.name || '',
    imageUrl: currentMachine?.imageUrl || '',
    areaId: currentMachine?.areaId || null,
    calendarId: currentMachine?.calendarId || null,
    machineTypeId: currentMachine?.machineTypeId || null,
    calculationMode: currentMachine?.calculationMode || 'pairParallel',
  });


  // Sensor output mapping state - separated into good and scrap
  const [goodOutputMappings, setGoodOutputMappings] = useState<SensorOutputMapping[]>([]);
  const [scrapOutputMappings, setScrapOutputMappings] = useState<SensorOutputMapping[]>([]);
  const [draggedItem, setDraggedItem] = useState<DraggedSensorMapping | null>(null);

  // Fetch device mappings for edit mode
  const { data: deviceMappings, isLoading: isLoadingDevices } =
    useGetapiMachinemachineIddevicemappings(currentMachine?.id || '', {
      enabled: isEdit && !!currentMachine?.id,
    });

  // Fetch machine output mappings for edit mode
  const {
    data: machineOutputMappings,
    isLoading: isLoadingOutputMappings,
    refetch: refetchOutputMappings,
  } = useGetapiMachinemachineIdmachineoutputmappings(currentMachine?.id || '', {
    enabled: isEdit && !!currentMachine?.id,
  });

  // Load sensor output mappings when data is available
  useEffect(() => {
    if (machineOutputMappings) {
      const goodMappings: SensorOutputMapping[] = [];
      const scrapMappings: SensorOutputMapping[] = [];

      machineOutputMappings.forEach((mapping) => {
        const sensorMapping: SensorOutputMapping = {
          ...mapping,
          outputId: String(mapping.sensorId || ''),
          scalingFactor:
            mapping.scalingFactor ??
            (mapping.mappingMode === 'outputScrap'
              ? DEFAULT_SCRAP_SCALE_FACTOR
              : DEFAULT_GOOD_SCALE_FACTOR),
          enabled: mapping.enabled ?? true,
          mappingMode: mapping.mappingMode || 'outputGood',
        };

        if (mapping.mappingMode === 'outputScrap') {
          scrapMappings.push(sensorMapping);
        } else {
          goodMappings.push(sensorMapping);
        }
      });

      setGoodOutputMappings(goodMappings);
      setScrapOutputMappings(scrapMappings);
    }
  }, [machineOutputMappings]);

  const { mutate: createMachineMutate, isPending: isCreating } = useCreateMachine({
    onSuccess: (result) => {
      setValidationResult(result);
      if (isValidationSuccess(result)) {
        router.push('/machines');
      } else {
        // Show overall message if present
        if (result.message) {
          setErrorMessage(result.message);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to create machine');
    },
  });

  const { mutate: updateMachineMutate, isPending: isUpdating } = useUpdateMachine({
    onSuccess: (result) => {
      setValidationResult(result);
      if (isValidationSuccess(result)) {
        router.push('/machines');
      } else {
        // Show overall message if present
        if (result.message) {
          setErrorMessage(result.message);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to update machine');
    },
  });

  const { mutate: updateOutputMappingsMutate, isPending: isUpdatingMappings } =
    usePutapiMachinemachineIdupdatemachineoutputmappings({
      onSuccess: () => {
        if (refetchOutputMappings) {
          refetchOutputMappings();
        }
      },
      onError: (error) => {
        setErrorMessage(error.message || 'Failed to update output mappings');
      },
    });

  const isSubmitting = isCreating || isUpdating || isUpdatingMappings;

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
        // Clear field error when user starts typing
        clearFieldError(field);
      },
    [clearFieldError]
  );

  const handleCalculationModeChange = useCallback(
    (event: SelectChangeEvent<OutputCalculationMode>) => {
      setFormData((prev) => ({
        ...prev,
        calculationMode: event.target.value as OutputCalculationMode,
      }));
      clearFieldError('calculationMode');
    },
    [clearFieldError]
  );

  const handleImageUrlChange = useCallback((newImageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: newImageUrl,
    }));
    clearFieldError('imageUrl');
  }, [clearFieldError]);

  const handleAreaChange = useCallback((areaId: string | null) => {
    setFormData((prev) => ({
      ...prev,
      areaId,
    }));
    clearFieldError('areaId');
  }, [clearFieldError]);

  const handleCalendarChange = useCallback((calendarId: string | null) => {
    setFormData((prev) => ({
      ...prev,
      calendarId,
    }));
    clearFieldError('calendarId');
  }, [clearFieldError]);

  // Drag and drop handlers
  const handleDragStart = useCallback(
    (item: SensorOutputMapping, sourceTable: 'good' | 'scrap') => {
      setDraggedItem({ ...item, sourceTable });
    },
    []
  );
  
  const handleMachineTypeChange = useCallback((machineTypeId: string | null) => {
    setFormData((prev) => ({
      ...prev,
      machineTypeId,
    }));
    clearFieldError('machineTypeId');
  }, [clearFieldError]);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDropToGood = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!draggedItem) return;

      // Prevent dropping in the same table
      if (draggedItem.sourceTable === 'good') {
        setDraggedItem(null);
        return;
      }

      // Move from scrap to good
      setScrapOutputMappings((prev) =>
        prev.filter((item) => item.outputId !== draggedItem.outputId)
      );
      setGoodOutputMappings((prev) => [
        ...prev,
        {
          ...draggedItem,
          mappingMode: 'outputGood',
          scalingFactor: DEFAULT_GOOD_SCALE_FACTOR,
        },
      ]);

      setDraggedItem(null);
    },
    [draggedItem]
  );

  const handleDropToScrap = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!draggedItem) return;

      // Prevent dropping in the same table
      if (draggedItem.sourceTable === 'scrap') {
        setDraggedItem(null);
        return;
      }

      // Move from good to scrap
      setGoodOutputMappings((prev) =>
        prev.filter((item) => item.outputId !== draggedItem.outputId)
      );
      setScrapOutputMappings((prev) => [
        ...prev,
        {
          ...draggedItem,
          mappingMode: 'outputScrap',
          scalingFactor: DEFAULT_SCRAP_SCALE_FACTOR,
        },
      ]);

      setDraggedItem(null);
    },
    [draggedItem]
  );

  const handleSensorScalingFactorChange = useCallback(
    (outputId: string, value: number, mappingMode: 'good' | 'scrap') => {
      if (mappingMode === 'good') {
        setGoodOutputMappings((prev) =>
          prev.map((som) => (som.outputId === outputId ? { ...som, scalingFactor: value } : som))
        );
      } else {
        setScrapOutputMappings((prev) =>
          prev.map((som) => (som.outputId === outputId ? { ...som, scalingFactor: value } : som))
        );
      }
    },
    []
  );

  const handleSensorEnabledChange = useCallback(
    (outputId: string, enabled: boolean, mappingMode: 'good' | 'scrap') => {
      if (mappingMode === 'good') {
        setGoodOutputMappings((prev) =>
          prev.map((som) => (som.outputId === outputId ? { ...som, enabled } : som))
        );
      } else {
        setScrapOutputMappings((prev) =>
          prev.map((som) => (som.outputId === outputId ? { ...som, enabled } : som))
        );
      }
    },
    []
  );

  const handleSaveOutputMappings = useCallback(() => {
    if (!isEdit || !currentMachine?.id) return;

    const allMappings: MachineOutputMappingResponse[] = [
      ...goodOutputMappings.map((m) => ({
        index: m.index,
        sensorName: m.sensorName,
        sensorId: m.outputId,
        scalingFactor: m.scalingFactor,
        mappingMode: 'outputGood' as const,
        enabled: m.enabled,
      })),
      ...scrapOutputMappings.map((m) => ({
        index: m.index,
        sensorName: m.sensorName,
        sensorId: m.outputId,
        scalingFactor: m.scalingFactor,
        mappingMode: 'outputScrap' as const,
        enabled: m.enabled,
      })),
    ];

    updateOutputMappingsMutate({
      machineId: currentMachine.id,
      data: allMappings,
    });
  }, [
    isEdit,
    currentMachine?.id,
    goodOutputMappings,
    scrapOutputMappings,
    updateOutputMappingsMutate,
  ]);

  const handleSubmit = useCallback(() => {
    // Clear previous validation errors
    clearValidationResult();
    setErrorMessage(null);

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
          { key: 'machineTypeId', value: formData.machineTypeId || undefined },
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
          machineTypeId: formData.machineTypeId || undefined,
          calculationMode: formData.calculationMode,
        } as any, // Cast to any to bypass strict type checking for required fields
      });
    }
  }, [formData, isEdit, currentMachine?.id, createMachineMutate, updateMachineMutate, clearValidationResult]);

  const handleCancel = useCallback(() => {
    router.push('/machines');
  }, [router]);

  const handleNavigateToProductMapping = useCallback(() => {
    if (currentMachine?.id) {
      router.push(`/machines/${currentMachine.id}/product-mapping`);
    }
  }, [router, currentMachine?.id]);

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
              <AreaSelector value={formData.areaId} onChange={handleAreaChange} label="Area" />
            </Box>

            <Box sx={{ mt: 3 }}>
              <CalendarSelector
                value={formData.calendarId}
                onChange={handleCalendarChange}
                label="Calendar"
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <MachineTypeSelector
                value={formData.machineTypeId}
                onChange={handleMachineTypeChange}
                label="Machine Type"
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
                    error={hasError('code')}
                    helperText={getFieldErrorMessage('code')}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Machine name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    required
                    error={hasError('name')}
                    helperText={getFieldErrorMessage('name')}
                  />
                </Grid>
              </Grid>
            </Card>

            {/* Device Mapping Section - Read Only */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Device Mapping
              </Typography>

              {isLoadingDevices ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : deviceMappings && deviceMappings.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Code</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>MAC Address</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {deviceMappings.map((device) => (
                        <TableRow key={String(device.id)}>
                          <TableCell>{device.code || '-'}</TableCell>
                          <TableCell>{device.name || '-'}</TableCell>
                          <TableCell>{device.macAddress || '-'}</TableCell>
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
                    No devices mapped to this machine yet.
                  </Typography>
                </Box>
              )}
            </Card>

            {/* Sensor Output Mapping Section - Good Outputs */}
            <Card
              sx={{
                p: 3,
                border: 2,
                borderColor: 'success.main',
                position: 'relative',
              }}
              onDragOver={handleDragOver}
              onDrop={handleDropToGood}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h6">Good Output Mapping</Typography>
                <Chip label="Good" color="success" size="small" />
              </Box>

              {isLoadingOutputMappings ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : goodOutputMappings.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Index</TableCell>
                        <TableCell>Output Name</TableCell>
                        <TableCell>Scale Factor</TableCell>
                        <TableCell align="center">Enabled</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {goodOutputMappings.map((mapping) => (
                        <TableRow
                          key={mapping.outputId}
                          draggable
                          onDragStart={() => handleDragStart(mapping, 'good')}
                          sx={{
                            cursor: 'grab',
                            '&:active': { cursor: 'grabbing' },
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                        >
                          <TableCell>{mapping.index ?? '-'}</TableCell>
                          <TableCell>{mapping.sensorName || '-'}</TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={mapping.scalingFactor ?? DEFAULT_GOOD_SCALE_FACTOR}
                              onChange={(e) =>
                                handleSensorScalingFactorChange(
                                  mapping.outputId,
                                  Number(e.target.value),
                                  'good'
                                )
                              }
                              sx={{ width: 120 }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Switch
                              checked={mapping.enabled ?? true}
                              onChange={(e) =>
                                handleSensorEnabledChange(
                                  mapping.outputId,
                                  e.target.checked,
                                  'good'
                                )
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
                    No good output mappings configured. Drag items from Scrap section to add.
                  </Typography>
                </Box>
              )}
            </Card>

            {/* Sensor Output Mapping Section - Scrap Outputs */}
            <Card
              sx={{
                p: 3,
                border: 2,
                borderColor: 'error.main',
                position: 'relative',
              }}
              onDragOver={handleDragOver}
              onDrop={handleDropToScrap}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h6">Scrap Output Mapping</Typography>
                <Chip label="Scrap" color="error" size="small" />
              </Box>

              {isLoadingOutputMappings ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : scrapOutputMappings.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Index</TableCell>
                        <TableCell>Output Name</TableCell>
                        <TableCell>Scale Factor</TableCell>
                        <TableCell align="center">Enabled</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {scrapOutputMappings.map((mapping) => (
                        <TableRow
                          key={mapping.outputId}
                          draggable
                          onDragStart={() => handleDragStart(mapping, 'scrap')}
                          sx={{
                            cursor: 'grab',
                            '&:active': { cursor: 'grabbing' },
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                        >
                          <TableCell>{mapping.index ?? '-'}</TableCell>
                          <TableCell>{mapping.sensorName || '-'}</TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={mapping.scalingFactor ?? DEFAULT_SCRAP_SCALE_FACTOR}
                              onChange={(e) =>
                                handleSensorScalingFactorChange(
                                  mapping.outputId,
                                  Number(e.target.value),
                                  'scrap'
                                )
                              }
                              sx={{ width: 120 }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Switch
                              checked={mapping.enabled ?? true}
                              onChange={(e) =>
                                handleSensorEnabledChange(
                                  mapping.outputId,
                                  e.target.checked,
                                  'scrap'
                                )
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
                    No scrap output mappings configured. Drag items from Good section to add.
                  </Typography>
                </Box>
              )}
            </Card>

            {/* Save Output Mappings Button - Only in edit mode */}
            {isEdit && (goodOutputMappings.length > 0 || scrapOutputMappings.length > 0) && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleSaveOutputMappings}
                  disabled={isUpdatingMappings}
                  startIcon={isUpdatingMappings ? <CircularProgress size={20} /> : null}
                >
                  Save Output Mappings
                </Button>
              </Box>
            )}

            {/* Product Mapping Section */}
            {isEdit && currentMachine?.id ? (
              <Card sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Product Mapping</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Iconify icon="solar:settings-bold-duotone" />}
                    onClick={handleNavigateToProductMapping}
                  >
                    Manage Product Mapping
                  </Button>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Click the button above to manage product mappings for this machine on a dedicated page with better performance.
                </Typography>
              </Card>
            ) : (
              <Card sx={{ p: 3, bgcolor: 'background.neutral' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
                  <Typography variant="body2" color="text.secondary">
                    Product mapping will be available after creating the machine. Please save the form first.
                  </Typography>
                </Box>
              </Card>
            )}

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

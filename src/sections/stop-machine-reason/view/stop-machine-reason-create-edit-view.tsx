import type { ChangeEvent } from 'react';
import type { StopMachineReasonEntity } from 'src/api/types/generated';
import type { MappedMachine, AvailableMachine } from 'src/components/machine-mapping';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useCreateStopMachineReason,
  useUpdateStopMachineReason,
  useGetStopMachineReasonById,
  useGenerateNewStopMachineReasonCode,
  usePostapiStopMachineReasonaddmachinestopreasonmapping,
  useGetapiStopMachineReasongetstopreasonmappingsbyreasonidreasonId,
  useDeleteapiStopMachineReasondeletestopmachinereasonmappingmappingId,
  useGetapiStopMachineReasongetavailablemachinesforstopreasonstopReasonId,
} from 'src/api/hooks/generated/use-stop-machine-reason';

import { Iconify } from 'src/components/iconify';
import { ColorPicker } from 'src/components/color-utils';
import { MachineMappingSection } from 'src/components/machine-mapping';
import { StopMachineReasonGroupSelector } from 'src/components/selectors/stop-machine-reason-group-selector';

// ----------------------------------------------------------------------

const COLOR_OPTIONS = [
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
  '#00AB55',
  '#FF6F00',
  '#7635DC',
  '#212B36',
  '#454F5B',
  '#637381',
  '#919EAB',
  '#C4CDD5',
];

interface StopMachineReasonFormData {
  code: string;
  name: string;
  description: string;
  colorHex: string;
  groupId: string;
  requiresApproval: boolean;
  requiresNote: boolean;
  requiresAttachment: boolean;
  requiresComment: boolean;
  translations: Record<string, string>;
}

interface StopMachineReasonCreateEditViewProps {
  isEdit?: boolean;
}

export function StopMachineReasonCreateEditView({
  isEdit = false,
}: StopMachineReasonCreateEditViewProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState<StopMachineReasonFormData>({
    code: '',
    name: '',
    description: '',
    colorHex: '#1976d2',
    groupId: '',
    requiresApproval: false,
    requiresNote: false,
    requiresAttachment: false,
    requiresComment: false,
    translations: {},
  });
  const [isLoadingData, setIsLoadingData] = useState(isEdit);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [translationKey, setTranslationKey] = useState('');
  const [translationValue, setTranslationValue] = useState('');

  // Machine mapping state
  const [availableMachines, setAvailableMachines] = useState<AvailableMachine[]>([]);
  const [searchParams, setSearchParams] = useState<{
    machineTypeId?: string;
    machineGroupId?: string;
  } | null>(null);

  // Fetch stop machine reason data if editing
  const { data: reasonData } = useGetStopMachineReasonById(id || '', {
    enabled: isEdit && !!id,
  });

  // Fetch mapped machines
  const { data: mappedMachinesData, isLoading: isLoadingMapped, refetch: refetchMappedMachines } =
    useGetapiStopMachineReasongetstopreasonmappingsbyreasonidreasonId(id || '', {
      enabled: isEdit && !!id,
    });

  // Get available machines query
  const {
    data: availableMachinesData,
    isLoading: isLoadingAvailable,
    refetch: refetchAvailableMachines,
  } = useGetapiStopMachineReasongetavailablemachinesforstopreasonstopReasonId(
    id || '',
    searchParams || undefined,
    {
      enabled: false, // We'll manually trigger this with refetch
    }
  );

  // Update available machines when data changes
  useEffect(() => {
    if (availableMachinesData) {
      setAvailableMachines(
        availableMachinesData.map((machine) => ({
          machineId: String(machine.machineId),
          machineName: machine.machineName || '',
        }))
      );
    }
  }, [availableMachinesData]);

  // Delete mapping mutation
  const { mutate: deleteMappingMutate } =
    useDeleteapiStopMachineReasondeletestopmachinereasonmappingmappingId({
      onSuccess: () => {
        refetchMappedMachines();
      },
      onError: (error) => {
        throw error;
      },
    });

  // Add mapping mutation
  const { mutate: addMappingMutate } = usePostapiStopMachineReasonaddmachinestopreasonmapping({
    onSuccess: () => {
      refetchMappedMachines();
      setAvailableMachines([]);
    },
    onError: (error) => {
      throw error;
    },
  });

  // Generate new code hook
  const { data: generatedCode, isFetching: isGeneratingCode } =
    useGenerateNewStopMachineReasonCode({
      enabled: !isEdit,
    });

  useEffect(() => {
    if (isEdit && reasonData) {
      setFormData({
        code: reasonData.code || '',
        name: reasonData.name || '',
        description: reasonData.description || '',
        colorHex: reasonData.colorHex || '#1976d2',
        groupId: reasonData.groupId?.toString() || '',
        requiresApproval: reasonData.requiresApproval || false,
        requiresNote: reasonData.requiresNote || false,
        requiresAttachment: reasonData.requiresAttachment || false,
        requiresComment: reasonData.requiresComment || false,
        translations: reasonData.translations || {},
      });
      setIsLoadingData(false);
    } else if (!isEdit && generatedCode) {
      // Set generated code for new reason
      setFormData((prev) => ({ ...prev, code: generatedCode }));
    }
  }, [isEdit, reasonData, generatedCode]);

  const { mutate: createReason, isPending: isCreating } = useCreateStopMachineReason({
    onSuccess: (result) => {
      if (result.isValid) {
        navigate('/stop-machine-reason');
      } else {
        setErrorMessage(result.message || 'Validation failed');
        if (result.errors) {
          const errors: Record<string, string> = {};
          Object.entries(result.errors).forEach(([key, error]) => {
            errors[key] = error.message || 'Invalid value';
          });
          setFieldErrors(errors);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to create stop machine reason');
      if (error.errors) {
        const errors: Record<string, string> = {};
        Object.entries(error.errors).forEach(([key, validationError]) => {
          errors[key] = validationError.message || 'Invalid value';
        });
        setFieldErrors(errors);
      }
    },
  });

  const { mutate: updateReason, isPending: isUpdating } = useUpdateStopMachineReason({
    onSuccess: (result) => {
      if (result.isValid) {
        navigate('/stop-machine-reason');
      } else {
        setErrorMessage(result.message || 'Validation failed');
        if (result.errors) {
          const errors: Record<string, string> = {};
          Object.entries(result.errors).forEach(([key, error]) => {
            errors[key] = error.message || 'Invalid value';
          });
          setFieldErrors(errors);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to update stop machine reason');
      if (error.errors) {
        const errors: Record<string, string> = {};
        Object.entries(error.errors).forEach(([key, validationError]) => {
          errors[key] = validationError.message || 'Invalid value';
        });
        setFieldErrors(errors);
      }
    },
  });

  const handleChange = useCallback(
    (field: keyof StopMachineReasonFormData) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: event.target.value,
        }));
      },
    []
  );

  const handleBooleanChange = useCallback(
    (field: keyof StopMachineReasonFormData) => (event: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.checked,
      }));
    },
    []
  );

  const handleColorChange = useCallback((color: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      colorHex: typeof color === 'string' ? color : color[0] || '#1976d2',
    }));
  }, []);

  const handleGroupChange = useCallback((groupId: string | null) => {
    setFormData((prev) => ({
      ...prev,
      groupId: groupId || '',
    }));
  }, []);

  const handleAddTranslation = useCallback(() => {
    if (translationKey && translationValue) {
      setFormData((prev) => ({
        ...prev,
        translations: {
          ...prev.translations,
          [translationKey]: translationValue,
        },
      }));
      setTranslationKey('');
      setTranslationValue('');
    }
  }, [translationKey, translationValue]);

  const handleRemoveTranslation = useCallback((key: string) => {
    setFormData((prev) => {
      const newTranslations = { ...prev.translations };
      delete newTranslations[key];
      return {
        ...prev,
        translations: newTranslations,
      };
    });
  }, []);

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
    setFieldErrors({});
  }, []);

  const handleSave = useCallback(() => {
    setErrorMessage(null);
    setFieldErrors({});

    if (isEdit && id) {
      updateReason({
        id,
        data: [
          { key: 'code', value: formData.code },
          { key: 'name', value: formData.name },
          { key: 'description', value: formData.description },
          { key: 'colorHex', value: formData.colorHex },
          { key: 'groupId', value: formData.groupId },
          { key: 'requiresApproval', value: formData.requiresApproval },
          { key: 'requiresNote', value: formData.requiresNote },
          { key: 'requiresAttachment', value: formData.requiresAttachment },
          { key: 'requiresComment', value: formData.requiresComment },
          { key: 'translations', value: JSON.stringify(formData.translations) },
        ],
      });
    } else {
      const entityData: StopMachineReasonEntity = {
        code: formData.code,
        name: formData.name,
        description: formData.description,
        colorHex: formData.colorHex,
        groupId: formData.groupId as any,
        requiresApproval: formData.requiresApproval,
        requiresNote: formData.requiresNote,
        requiresAttachment: formData.requiresAttachment,
        requiresComment: formData.requiresComment,
        translations: formData.translations,
      };
      createReason({ data: entityData });
    }
  }, [isEdit, id, formData, createReason, updateReason]);

  // Machine mapping handlers
  const handleSearchAvailable = useCallback(
    (machineTypeId: string | null, machineGroupId: string | null) => {
      if (id && (machineTypeId || machineGroupId)) {
        setSearchParams({
          machineTypeId: machineTypeId || undefined,
          machineGroupId: machineGroupId || undefined,
        });
        // Trigger the query manually
        refetchAvailableMachines();
      } else {
        setAvailableMachines([]);
        setSearchParams(null);
      }
    },
    [id, refetchAvailableMachines]
  );

  const handleAddMachines = useCallback(
    async (machineIds: string[]) => {
      if (!id) {
        throw new Error('Stop reason ID is required');
      }

      return new Promise<void>((resolve, reject) => {
        addMappingMutate(
          {
            data: {
              stopReasonId: id,
              machineIds,
            },
          },
          {
            onSuccess: () => resolve(),
            onError: (error) => reject(error),
          }
        );
      });
    },
    [id, addMappingMutate]
  );

  const handleRemoveMapping = useCallback(
    async (mappingId: string) =>
      new Promise<void>((resolve, reject) => {
        deleteMappingMutate(
          { mappingId },
          {
            onSuccess: () => resolve(),
            onError: (error) => reject(error),
          }
        );
      }),
    [deleteMappingMutate]
  );

  const mappedMachines: MappedMachine[] =
    mappedMachinesData?.map((machine) => ({
      mappingId: String(machine.mappingId),
      machineName: machine.machineName || '',
    })) || [];

  if (isLoadingData) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  const isPending = isCreating || isUpdating;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {isEdit ? 'Edit Stop Machine Reason' : 'Create Stop Machine Reason'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Stop Machine Reason
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
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Basic Information
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Code"
                value={formData.code}
                onChange={handleChange('code')}
                error={!!fieldErrors.code}
                helperText={fieldErrors.code}
                disabled={isGeneratingCode}
                slotProps={{
                  input: {
                    endAdornment: isGeneratingCode ? (
                      <CircularProgress size={20} />
                    ) : null,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={handleChange('name')}
                error={!!fieldErrors.name}
                helperText={fieldErrors.name}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={handleChange('description')}
                error={!!fieldErrors.description}
                helperText={fieldErrors.description}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <StopMachineReasonGroupSelector
                label="Group"
                value={formData.groupId}
                onChange={handleGroupChange}
                error={!!fieldErrors.groupId}
                helperText={fieldErrors.groupId}
                required
              />
            </Grid>
          </Grid>
        </Card>

        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Color
          </Typography>
          <ColorPicker
            value={formData.colorHex}
            onChange={handleColorChange}
            options={COLOR_OPTIONS}
            size={40}
          />
        </Card>

        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Requirements
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.requiresApproval}
                    onChange={handleBooleanChange('requiresApproval')}
                  />
                }
                label="Requires Approval"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.requiresNote}
                    onChange={handleBooleanChange('requiresNote')}
                  />
                }
                label="Requires Note"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.requiresAttachment}
                    onChange={handleBooleanChange('requiresAttachment')}
                  />
                }
                label="Requires Attachment"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.requiresComment}
                    onChange={handleBooleanChange('requiresComment')}
                  />
                }
                label="Requires Comment"
              />
            </Grid>
          </Grid>
        </Card>

        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Translations
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Language Code"
                value={translationKey}
                onChange={(e) => setTranslationKey(e.target.value)}
                placeholder="e.g., en, vi, zh"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Translation"
                value={translationValue}
                onChange={(e) => setTranslationValue(e.target.value)}
                placeholder="Translation text"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={handleAddTranslation}
                disabled={!translationKey || !translationValue}
                sx={{ height: '56px' }}
              >
                Add
              </Button>
            </Grid>
          </Grid>
          {Object.keys(formData.translations).length > 0 && (
            <Stack spacing={1}>
              {Object.entries(formData.translations).map(([key, value]) => (
                <Box
                  key={key}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1.5,
                    bgcolor: 'background.neutral',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ minWidth: 60 }}>
                    {key}:
                  </Typography>
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {value}
                  </Typography>
                  <IconButton size="small" onClick={() => handleRemoveTranslation(key)}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          )}
        </Card>

        {/* Machine Mapping Section */}
        <MachineMappingSection
          disabled={!isEdit}
          entityId={id}
          mappedMachines={mappedMachines}
          isLoadingMapped={isLoadingMapped}
          availableMachines={availableMachines}
          isLoadingAvailable={isLoadingAvailable}
          onSearchAvailable={handleSearchAvailable}
          onAddMachines={handleAddMachines}
          onRemoveMapping={handleRemoveMapping}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate('/stop-machine-reason')}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave} disabled={isPending}>
            {isPending ? <CircularProgress size={24} /> : isEdit ? 'Update' : 'Create'}
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

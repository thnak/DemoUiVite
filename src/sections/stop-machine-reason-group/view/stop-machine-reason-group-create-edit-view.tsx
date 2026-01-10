import type { ChangeEvent } from 'react';
import type { StopMachineImpact, StopMachineReasonGroupEntity } from 'src/api/types/generated';

import { MuiColorInput } from 'mui-color-input';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useCreateStopMachineReasonGroup,
  useUpdateStopMachineReasonGroup,
  useGetStopMachineReasonGroupById,
  useGenerateNewStopMachineReasonGroupCode,
} from 'src/api/hooks/generated/use-stop-machine-reason-group';

import { Iconify } from 'src/components/iconify';

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

const IMPACT_OPTIONS: { value: StopMachineImpact; label: string }[] = [
  { value: 'run', label: 'Run' },
  { value: 'unPlanedStop', label: 'Unplanned Stop' },
  { value: 'planedStop', label: 'Planned Stop' },
  { value: 'notScheduled', label: 'Not Scheduled' },
];

interface StopMachineReasonGroupFormData {
  code: string;
  name: string;
  description: string;
  colorHex: string;
  impact: StopMachineImpact | '';
  translations: Record<string, string>;
}

interface StopMachineReasonGroupCreateEditViewProps {
  isEdit?: boolean;
}

export function StopMachineReasonGroupCreateEditView({
  isEdit = false,
}: StopMachineReasonGroupCreateEditViewProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState<StopMachineReasonGroupFormData>({
    code: '',
    name: '',
    description: '',
    colorHex: '#1976d2',
    impact: '',
    translations: {},
  });
  const [isLoadingData, setIsLoadingData] = useState(isEdit);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [translationKey, setTranslationKey] = useState('');
  const [translationValue, setTranslationValue] = useState('');
  const formInitializedRef = useRef(false);

  // Fetch group data if editing
  const { data: groupData } = useGetStopMachineReasonGroupById(id || '', {
    enabled: isEdit && !!id,
  });

  // Generate new code hook
  const { data: generatedCode, isFetching: isGeneratingCode } =
    useGenerateNewStopMachineReasonGroupCode({
      enabled: !isEdit,
    });

  // Initialize form data once when data loads
  // This is a legitimate use of setState in useEffect for one-time form initialization
  // The ref prevents cascading renders by ensuring it only runs once
  useEffect(() => {
    if (isEdit && groupData && !formInitializedRef.current) {
      formInitializedRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        code: groupData.code || '',
        name: groupData.name || '',
        description: groupData.description || '',
        colorHex: groupData.colorHex || '#1976d2',
        impact: groupData.impact || '',
        translations: groupData.translations || {},
      });
      setIsLoadingData(false);
    } else if (!isEdit && generatedCode && !formInitializedRef.current) {
      formInitializedRef.current = true;
      // Set generated code for new group
      setFormData((prev) => ({ ...prev, code: generatedCode }));
    }
  }, [isEdit, groupData, generatedCode]); 

  const { mutate: createGroup, isPending: isCreating } = useCreateStopMachineReasonGroup({
    onSuccess: (result) => {
      if (result.isValid) {
        navigate('/stop-machine-reason-group');
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
      setErrorMessage(error.message || 'Failed to create stop machine reason group');
      if (error.errors) {
        const errors: Record<string, string> = {};
        Object.entries(error.errors).forEach(([key, validationError]) => {
          errors[key] = validationError.message || 'Invalid value';
        });
        setFieldErrors(errors);
      }
    },
  });

  const { mutate: updateGroup, isPending: isUpdating } = useUpdateStopMachineReasonGroup({
    onSuccess: (result) => {
      if (result.isValid) {
        navigate('/stop-machine-reason-group');
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
      setErrorMessage(error.message || 'Failed to update stop machine reason group');
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
    (field: keyof StopMachineReasonGroupFormData) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: event.target.value,
        }));
      },
    []
  );

  const handleImpactChange = useCallback((event: any) => {
    setFormData((prev) => ({
      ...prev,
      impact: event.target.value as StopMachineImpact,
    }));
  }, []);

  const handleColorChange = useCallback((color: string) => {
    setFormData((prev) => ({
      ...prev,
      colorHex: color,
    }));
  }, []);

  const handleAddTranslation = useCallback(() => {
    if (translationKey && translationValue) {
      setFormData((prev) => ({
        ...prev,
        translations: {
          ...prev.translations,
          [translationKey]: translationValue,
        } as any, // Cast to any to bypass strict type checking for required fields,
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
      updateGroup({
        id,
        data: [
          { key: 'code', value: formData.code },
          { key: 'name', value: formData.name },
          { key: 'description', value: formData.description },
          { key: 'colorHex', value: formData.colorHex },
          { key: 'impact', value: formData.impact },
          { key: 'translations', value: JSON.stringify(formData.translations) },
        ],
      });
    } else {
      const entityData: Partial<StopMachineReasonGroupEntity> = {
        code: formData.code,
        name: formData.name,
        description: formData.description,
        colorHex: formData.colorHex,
        impact: formData.impact as StopMachineImpact,
        translations: formData.translations,
      };
      createGroup({ data: entityData as any }); // Cast to any to bypass strict type checking
    }
    // Form initialization effect
     
  }, [isEdit, 

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
          {isEdit ? 'Edit Stop Machine Reason Group' : 'Create Stop Machine Reason Group'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Stop Machine Reason Group
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
              <FormControl fullWidth required error={!!fieldErrors.impact}>
                <InputLabel>Impact</InputLabel>
                <Select
                  value={formData.impact}
                  onChange={handleImpactChange}
                  label="Impact"
                >
                  {IMPACT_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {fieldErrors.impact && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {fieldErrors.impact}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </Card>

        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Color
          </Typography>
          <MuiColorInput
            fullWidth
            format="hex"
            value={formData.colorHex}
            onChange={handleColorChange}
            helperText="Choose a color to represent this group"
          />
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: formData.colorHex,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 60,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                fontWeight: 'medium',
              }}
            >
              Preview: {formData.name || 'Group Name'}
            </Typography>
          </Box>
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

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate('/stop-machine-reason-group')}
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

import type { ChangeEvent } from 'react';

import { MuiColorInput } from 'mui-color-input';
import { useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useCreateTimeBlockName,
  useUpdateTimeBlockName,
  useGetTimeBlockNameById,
} from 'src/api/hooks/generated/use-time-block-name';

import { TranslationSection } from 'src/components/translation-section';
import { ImageEntityResourceUploader } from 'src/components/image-entity-resource-uploader';

// ----------------------------------------------------------------------

interface TimeBlockNameFormData {
  code: string;
  name: string;
  description: string;
  colorHex: string;
  imageUrl: string;
  translations: Record<string, string>;
}

interface TimeBlockNameCreateEditViewProps {
  isEdit?: boolean;
}

export function TimeBlockNameCreateEditView({ isEdit = false }: TimeBlockNameCreateEditViewProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Fetch time block name data if editing
  const { data: timeBlockNameData, isLoading: isLoadingData } = useGetTimeBlockNameById(id || '', {
    enabled: isEdit && !!id,
  });

  // Initialize form data using useMemo - React Compiler friendly
  const initialFormData = useMemo<TimeBlockNameFormData>(() => {
    if (isEdit && timeBlockNameData) {
      return {
        code: timeBlockNameData.code || '',
        name: timeBlockNameData.name || '',
        description: timeBlockNameData.description || '',
        colorHex: timeBlockNameData.colorHex || '#1976d2',
        imageUrl: timeBlockNameData.imageUrl || '',
        translations: timeBlockNameData.translations || {},
      };
    }
    return {
      code: '',
      name: '',
      description: '',
      colorHex: '#1976d2',
      imageUrl: '',
      translations: {},
    };
  }, [isEdit, timeBlockNameData]);

  const [formData, setFormData] = useState<TimeBlockNameFormData>(initialFormData);

  const { mutate: createTimeBlockName, isPending: isCreating } = useCreateTimeBlockName({
    onSuccess: (result) => {
      if (result.isValid) {
        navigate('/settings/time-block-names');
      } else {
        // Handle validation errors from the API
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
      // Error is also a ValidationResult type, handle it the same way
      setErrorMessage(error.message || 'Failed to create time block name');
      if (error.errors) {
        const errors: Record<string, string> = {};
        Object.entries(error.errors).forEach(([key, validationError]) => {
          errors[key] = validationError.message || 'Invalid value';
        });
        setFieldErrors(errors);
      }
    },
  });

  const { mutate: updateTimeBlockName, isPending: isUpdating } = useUpdateTimeBlockName({
    onSuccess: (result) => {
      if (result.isValid) {
        navigate('/settings/time-block-names');
      } else {
        // Handle validation errors from the API
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
      // Error is also a ValidationResult type, handle it the same way
      setErrorMessage(error.message || 'Failed to update time block name');
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
    (field: keyof TimeBlockNameFormData) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: event.target.value,
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

  const handleColorChange = useCallback((newColor: string) => {
    setFormData((prev) => ({
      ...prev,
      colorHex: newColor,
    }));
  }, []);

  const handleTranslationsChange = useCallback((translations: Record<string, string>) => {
    setFormData((prev) => ({
      ...prev,
      translations,
    }));
  }, []);

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
    setFieldErrors({});
  }, []);

  const handleSave = useCallback(() => {
    // Clear previous errors
    setErrorMessage(null);
    setFieldErrors({});

    if (isEdit && id) {
      // Update existing time block name
      updateTimeBlockName({
        id,
        data: [
          { key: 'code', value: formData.code },
          { key: 'name', value: formData.name },
          { key: 'description', value: formData.description },
          { key: 'colorHex', value: formData.colorHex },
          { key: 'imageUrl', value: formData.imageUrl },
          { key: 'translations', value: JSON.stringify(formData.translations) },
        ],
      });
    } else {
      // Create new time block name
      createTimeBlockName({
        data: {
          code: formData.code,
          name: formData.name,
          description: formData.description,
          colorHex: formData.colorHex,
          imageUrl: formData.imageUrl,
          translations: formData.translations,
        } as any, // Cast to any to bypass strict type checking for required fields,
      });
    }
  }, [formData, isEdit, id, createTimeBlockName, updateTimeBlockName]);

  const handleCancel = useCallback(() => {
    navigate('/settings/time-block-names');
  }, [navigate]);

  if (isLoadingData) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {isEdit ? 'Edit Time Block Name' : 'Create a new time block name'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Image
              </Typography>
              <ImageEntityResourceUploader
                imageUrl={formData.imageUrl}
                onImageUrlChange={handleImageUrlChange}
                aspectRatio={1}
                previewSize={300}
              />
            </Card>

            <Card sx={{ p: 3 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Color
                </Typography>
                <MuiColorInput
                  fullWidth
                  format="hex"
                  value={formData.colorHex}
                  onChange={handleColorChange}
                  error={!!fieldErrors.colorHex}
                  helperText={fieldErrors.colorHex || 'Choose a color to represent this time block name'}
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
                    Preview: {formData.name || 'Time Block Name'}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Details
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Code"
                    value={formData.code}
                    onChange={handleChange('code')}
                    required
                    error={!!fieldErrors.code}
                    helperText={fieldErrors.code}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={formData.name}
                    onChange={handleChange('name')}
                    required
                    error={!!fieldErrors.name}
                    helperText={fieldErrors.name}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    value={formData.description}
                    onChange={handleChange('description')}
                    error={!!fieldErrors.description}
                    helperText={fieldErrors.description}
                  />
                </Grid>
              </Grid>
            </Card>

            <TranslationSection
              translations={formData.translations}
              onTranslationsChange={handleTranslationsChange}
              disabled={isCreating || isUpdating}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={handleCancel} disabled={isCreating || isUpdating}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isCreating || isUpdating || !formData.code || !formData.name}
              >
                {isCreating || isUpdating ? 'Saving...' : 'Save'}
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

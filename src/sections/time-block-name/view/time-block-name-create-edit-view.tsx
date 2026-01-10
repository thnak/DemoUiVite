import type { ChangeEvent } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useCreateTimeBlockName,
  useUpdateTimeBlockName,
  useGetTimeBlockNameById,
} from 'src/api/hooks/generated/use-time-block-name';

import { Iconify } from 'src/components/iconify';
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

  const [formData, setFormData] = useState<TimeBlockNameFormData>({
    code: '',
    name: '',
    description: '',
    colorHex: '#1976d2',
    imageUrl: '',
    translations: {},
  });
  const [isLoadingData, setIsLoadingData] = useState(isEdit);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [translationKey, setTranslationKey] = useState('');
  const [translationValue, setTranslationValue] = useState('');
  const formInitializedRef = useRef(false);

  // Fetch time block name data if editing
  const { data: timeBlockNameData } = useGetTimeBlockNameById(id || '', {
    enabled: isEdit && !!id,
  });

  // Initialize form data once when data loads
  // This is a legitimate use of setState in useEffect for one-time form initialization
  // The ref prevents cascading renders by ensuring it only runs once
  useEffect(() => {
    if (isEdit && timeBlockNameData && !formInitializedRef.current) {
      formInitializedRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        code: timeBlockNameData.code || '',
        name: timeBlockNameData.name || '',
        description: timeBlockNameData.description || '',
        colorHex: timeBlockNameData.colorHex || '#1976d2',
        imageUrl: timeBlockNameData.imageUrl || '',
        translations: timeBlockNameData.translations || {},
      });
      setIsLoadingData(false);
    }
  }, [isEdit, timeBlockNameData]); 

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
              <Typography variant="h6" sx={{ mb: 3 }}>
                Color
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  type="color"
                  label="Color"
                  value={formData.colorHex}
                  onChange={handleChange('colorHex')}
                  error={!!fieldErrors.colorHex}
                  helperText={fieldErrors.colorHex}
                />
                <Box
                  sx={{
                    width: '100%',
                    height: 100,
                    borderRadius: 1,
                    bgcolor: formData.colorHex,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                />
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

            {isEdit && (
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Translations
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <TextField
                      fullWidth
                      label="Language Code"
                      placeholder="e.g., en, vi, fr"
                      value={translationKey}
                      onChange={(e) => setTranslationKey(e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <TextField
                      fullWidth
                      label="Translation"
                      placeholder="Translated name"
                      value={translationValue}
                      onChange={(e) => setTranslationValue(e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleAddTranslation}
                      disabled={!translationKey || !translationValue}
                      sx={{ height: 56 }}
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>

                {Object.keys(formData.translations).length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Current Translations:
                    </Typography>
                    <Stack spacing={1}>
                      {Object.entries(formData.translations).map(([key, value]) => (
                        <Box
                          key={key}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 1.5,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            bgcolor: 'background.neutral',
                          }}
                        >
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {key}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {value}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveTranslation(key)}
                            sx={{ color: 'error.main' }}
                          >
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </IconButton>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Card>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={isCreating || isUpdating}
              >
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

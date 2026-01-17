import { MuiColorInput } from 'mui-color-input';
import { useSearchParams } from 'react-router-dom';
import { useState, useCallback, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { useValidationResult } from 'src/hooks/use-validation-result';

import { isValidationSuccess } from 'src/utils/validation-result';

import { DashboardContent } from 'src/layouts/dashboard';
import { useCreateArea, useUpdateArea } from 'src/api/hooks/generated/use-area';

import { BackButton } from 'src/components/back-button';
import { TranslationSection } from 'src/components/translation-section';

// ----------------------------------------------------------------------

interface AreaFormData {
  code: string;
  name: string;
  description: string;
  colorHex: string;
  translations: Record<string, string>;
}

interface AreaCreateEditViewProps {
  isEdit?: boolean;
  currentArea?: {
    id: string;
    code: string;
    name: string;
    description: string;
    colorHex?: string;
    translations?: Record<string, string>;
  };
}

export function AreaCreateEditView({ isEdit = false, currentArea }: AreaCreateEditViewProps) {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/area';

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
  const [formData, setFormData] = useState<AreaFormData>({
    code: currentArea?.code || '',
    name: currentArea?.name || '',
    description: currentArea?.description || '',
    colorHex: currentArea?.colorHex || '#1976d2',
    translations: currentArea?.translations || {},
  });

  const { mutate: createAreaMutate, isPending: isCreating } = useCreateArea({
    onSuccess: (result) => {
      setValidationResult(result);
      if (isValidationSuccess(result)) {
        router.push(returnUrl);
      } else {
        if (result.message) {
          setErrorMessage(result.message);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to create area');
    },
  });

  const { mutate: updateAreaMutate, isPending: isUpdating } = useUpdateArea({
    onSuccess: (result) => {
      setValidationResult(result);
      if (isValidationSuccess(result)) {
        router.push(returnUrl);
      } else {
        if (result.message) {
          setErrorMessage(result.message);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to update area');
    },
  });

  const isSubmitting = isCreating || isUpdating;

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof AreaFormData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      clearFieldError(field);
    },
    [clearFieldError]
  );

  const handleColorChange = useCallback(
    (newColor: string) => {
      setFormData((prev) => ({
        ...prev,
        colorHex: newColor,
      }));
      clearFieldError('colorHex');
    },
    [clearFieldError]
  );

  const handleTranslationsChange = useCallback((translations: Record<string, string>) => {
    setFormData((prev) => ({
      ...prev,
      translations,
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    clearValidationResult();
    setErrorMessage(null);

    if (!formData.name) {
      setErrorMessage('Area name is required');
      return;
    }

    if (isEdit && currentArea?.id) {
      // Update uses key-value pairs as per API spec (PATCH-like partial update)
      updateAreaMutate({
        id: currentArea.id,
        data: [
          { key: 'code', value: formData.code },
          { key: 'name', value: formData.name },
          { key: 'description', value: formData.description },
          { key: 'colorHex', value: formData.colorHex },
          { key: 'translations', value: JSON.stringify(formData.translations) },
        ],
      });
    } else {
      // Create uses full entity object as per API spec
      createAreaMutate({
        data: {
          code: formData.code,
          name: formData.name,
          description: formData.description,
          colorHex: formData.colorHex,
          translations: formData.translations,
        } as any, // Cast to any to bypass strict type checking for required fields
      });
    }
  }, [formData, isEdit, currentArea, createAreaMutate, updateAreaMutate, clearValidationResult]);

  const handleCancel = useCallback(() => {
    router.push(returnUrl);
  }, [router, returnUrl]);

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BackButton href="/area" variant="icon" buttonProps={{ sx: { mr: 1 } }} />
          <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
              {isEdit ? 'Edit area' : 'Create a new area'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                Dashboard
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                •
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                Area
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                •
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                {isEdit ? 'Edit' : 'Create'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ md: 4, xs: 12 }}>
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
                error={hasError('colorHex')}
                helperText={
                  getFieldErrorMessage('colorHex') || 'Choose a color to represent this area'
                }
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
                  Preview: {formData.name || 'Area Name'}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ md: 8, xs: 12 }}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Basic Information
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Area code"
                    value={formData.code}
                    required
                    onChange={handleInputChange('code')}
                    error={hasError('code')}
                    helperText={getFieldErrorMessage('code')}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Area name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    error={hasError('name')}
                    helperText={getFieldErrorMessage('name')}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    multiline
                    rows={4}
                    error={hasError('description')}
                    helperText={getFieldErrorMessage('description')}
                  />
                </Grid>
              </Grid>
            </Card>

            <TranslationSection
              translations={formData.translations}
              onTranslationsChange={handleTranslationsChange}
              disabled={isSubmitting}
            />

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
                sx={{
                  bgcolor: 'grey.900',
                  color: 'common.white',
                  '&:hover': {
                    bgcolor: 'grey.800',
                  },
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : isEdit ? (
                  'Save changes'
                ) : (
                  'Create area'
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

import { MuiColorInput } from 'mui-color-input';
import { useState, useCallback, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
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
import { useCreateMachineType, useUpdateMachineType } from 'src/api/hooks/generated/use-machine-type';

import { TranslationSection } from 'src/components/translation-section';

// ----------------------------------------------------------------------

interface MachineTypeFormData {
  code: string;
  name: string;
  description: string;
  colorHex: string;
  translations: Record<string, string>;
}

interface MachineTypeCreateEditViewProps {
  isEdit?: boolean;
  currentMachineType?: {
    id: string;
    code: string;
    name: string;
    description: string;
    colorHex?: string;
    translations?: Record<string, string>;
  };
}

export function MachineTypeCreateEditView({ isEdit = false, currentMachineType }: MachineTypeCreateEditViewProps) {
  const router = useRouter();

  const {
    setValidationResult,
    clearValidationResult,
    getFieldErrorMessage,
    hasError,
    clearFieldError,
    overallMessage,
  } = useValidationResult();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<MachineTypeFormData>({
    code: currentMachineType?.code || '',
    name: currentMachineType?.name || '',
    description: currentMachineType?.description || '',
    colorHex: currentMachineType?.colorHex || '#1976d2',
    translations: currentMachineType?.translations || {},
  });

  const { mutate: createMachineTypeMutate, isPending: isCreating } = useCreateMachineType({
    onSuccess: (result) => {
      setValidationResult(result);
      if (isValidationSuccess(result)) {
        router.push('/machine-types');
      } else {
        if (result.message) {
          setErrorMessage(result.message);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to create machine type');
    },
  });

  const { mutate: updateMachineTypeMutate, isPending: isUpdating } = useUpdateMachineType({
    onSuccess: (result) => {
      setValidationResult(result);
      if (isValidationSuccess(result)) {
        router.push('/machine-types');
      } else {
        if (result.message) {
          setErrorMessage(result.message);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to update machine type');
    },
  });

  const isSubmitting = isCreating || isUpdating;

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof MachineTypeFormData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      setErrorMessage('Machine type name is required');
      return;
    }

    if (isEdit && currentMachineType?.id) {
      // Update uses key-value pairs as per API spec
      updateMachineTypeMutate({
        id: currentMachineType.id,
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
      createMachineTypeMutate({
        data: {
          code: formData.code,
          name: formData.name,
          description: formData.description,
          colorHex: formData.colorHex,
          translations: formData.translations,
        } as any, // Cast to any to bypass strict type checking for required fields
      });
    }
  }, [formData, isEdit, currentMachineType, createMachineTypeMutate, updateMachineTypeMutate, clearValidationResult]);

  const handleCancel = useCallback(() => {
    router.push('/machine-types');
  }, [router]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {isEdit ? 'Edit machine type' : 'Create a new machine type'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Machine Types
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            {isEdit ? 'Edit' : 'Create'}
          </Typography>
        </Box>
      </Box>

      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>

          <TextField
            fullWidth
            label="Machine type code"
            value={formData.code}
            onChange={handleInputChange('code')}
            error={hasError('code')}
            helperText={getFieldErrorMessage('code')}
          />

          <TextField
            fullWidth
            label="Machine type name"
            value={formData.name}
            onChange={handleInputChange('name')}
            error={hasError('name')}
            helperText={getFieldErrorMessage('name')}
          />

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
              helperText={getFieldErrorMessage('colorHex') || 'Choose a color to represent this machine type'}
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
                Preview: {formData.name || 'Machine Type Name'}
              </Typography>
            </Box>
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
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
              'Create machine type'
            )}
          </Button>
        </Box>
      </Card>

      <TranslationSection
        translations={formData.translations}
        onTranslationsChange={handleTranslationsChange}
        disabled={isSubmitting}
      />

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

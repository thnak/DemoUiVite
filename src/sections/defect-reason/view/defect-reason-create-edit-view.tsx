
import { MuiColorInput } from 'mui-color-input';
import { useState, useCallback, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { useValidationResult } from 'src/hooks/use-validation-result';

import { isValidationSuccess } from 'src/utils/validation-result';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useCreateDefectReason,
  useUpdateDefectReason,
} from 'src/api/hooks/generated/use-defect-reason';

import { Iconify } from 'src/components/iconify';


// ----------------------------------------------------------------------

interface DefectReasonFormData {
  code: string;
  name: string;
  requireExtraNoteFromOperator: boolean;
  addScrapAndIncreaseTotalQuantity: boolean;
  colorHex: string;
  description: string;
}

interface DefectReasonCreateEditViewProps {
  isEdit?: boolean;
  currentDefectReason?: {
    id: string;
    code: string;
    name: string;
    requireExtraNoteFromOperator: boolean;
    addScrapAndIncreaseTotalQuantity: boolean;
    colorHex: string;
    description: string;
  };
}

export function DefectReasonCreateEditView({
  isEdit = false,
  currentDefectReason,
}: DefectReasonCreateEditViewProps) {
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
  const [formData, setFormData] = useState<DefectReasonFormData>({
    code: currentDefectReason?.code || '',
    name: currentDefectReason?.name || '',
    requireExtraNoteFromOperator: currentDefectReason?.requireExtraNoteFromOperator || false,
    addScrapAndIncreaseTotalQuantity:
      currentDefectReason?.addScrapAndIncreaseTotalQuantity || false,
    colorHex: currentDefectReason?.colorHex || '#1976d2',
    description: currentDefectReason?.description || '',
  });

  const { mutate: createDefectReasonMutate, isPending: isCreating } = useCreateDefectReason({
    onSuccess: (result) => {
      setValidationResult(result);
      if (isValidationSuccess(result)) {
        router.push('/defect-reasons');
      } else {
        if (result.message) {
          setErrorMessage(result.message);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to create defect reason');
    },
  });

  const { mutate: updateDefectReasonMutate, isPending: isUpdating } = useUpdateDefectReason({
    onSuccess: (result) => {
      setValidationResult(result);
      if (isValidationSuccess(result)) {
        router.push('/defect-reasons');
      } else {
        if (result.message) {
          setErrorMessage(result.message);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to update defect reason');
    },
  });

  const isSubmitting = isCreating || isUpdating;

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof DefectReasonFormData) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: event.target.value,
        }));
        clearFieldError(field);
      },
    [clearFieldError]
  );

  const handleSwitchChange = useCallback(
    (field: keyof DefectReasonFormData) => (event: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.checked,
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

  const handleSubmit = useCallback(() => {
    clearValidationResult();
    setErrorMessage(null);

    if (!formData.name) {
      setErrorMessage('Defect reason name is required');
      return;
    }

    if (isEdit && currentDefectReason?.id) {
      // Update uses key-value pairs as per API spec (PATCH-like partial update)
      updateDefectReasonMutate({
        id: currentDefectReason.id,
        data: [
          { key: 'code', value: formData.code },
          { key: 'name', value: formData.name },
          { key: 'requireExtraNoteFromOperator', value: formData.requireExtraNoteFromOperator },
          {
            key: 'addScrapAndIncreaseTotalQuantity',
            value: formData.addScrapAndIncreaseTotalQuantity,
          },
          { key: 'colorHex', value: formData.colorHex },
          { key: 'description', value: formData.description },
        ],
      });
    } else {
      // Create uses full entity object as per API spec
      createDefectReasonMutate({
        data: {
          code: formData.code,
          name: formData.name,
          requireExtraNoteFromOperator: formData.requireExtraNoteFromOperator,
          addScrapAndIncreaseTotalQuantity: formData.addScrapAndIncreaseTotalQuantity,
          colorHex: formData.colorHex,
          description: formData.description,
        } as any, // Cast to any to bypass strict type checking for required fields,
      });
    }
  }, [
    formData,
    isEdit,
    currentDefectReason,
    createDefectReasonMutate,
    updateDefectReasonMutate,
    clearValidationResult,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/defect-reasons');
  }, [router]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {isEdit ? 'Edit defect reason' : 'Create a new defect reason'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Defect Reason
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              fullWidth
              label="Defect reason code"
              value={formData.code}
              onChange={handleInputChange('code')}
              error={hasError('code')}
              helperText={getFieldErrorMessage('code')}
            />

            <TextField
              fullWidth
              label="Defect reason name"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={hasError('name')}
              helperText={getFieldErrorMessage('name')}
            />
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={formData.requireExtraNoteFromOperator}
                onChange={handleSwitchChange('requireExtraNoteFromOperator')}
              />
            }
            label="Require extra note from operator"
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.addScrapAndIncreaseTotalQuantity}
                onChange={handleSwitchChange('addScrapAndIncreaseTotalQuantity')}
              />
            }
            label="Add scrap and increase total quantity"
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
              helperText={getFieldErrorMessage('colorHex') || 'Choose a color to represent this defect reason'}
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
                Preview: {formData.name || 'Defect Reason Name'}
              </Typography>
            </Box>
          </Box>

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
              'Create defect reason'
            )}
          </Button>
        </Box>
      </Card>

      {/* Machine Mapping Section */}
      {isEdit && currentDefectReason?.id ? (
        <Card sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Machine Mapping</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="solar:settings-bold-duotone" />}
              onClick={() => router.push(`/defect-reasons/${currentDefectReason.id}/machine-mapping`)}
            >
              Manage Machine Mapping
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Click the button above to manage machine mappings for this defect reason on a dedicated page with better performance.
          </Typography>
        </Card>
      ) : (
        <Card sx={{ p: 3, bgcolor: 'background.neutral' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
            <Typography variant="body2" color="text.secondary">
              Machine mapping will be available after creating the defect reason. Please save the form first.
            </Typography>
          </Box>
        </Card>
      )}

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

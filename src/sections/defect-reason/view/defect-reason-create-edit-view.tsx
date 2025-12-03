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

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useCreateDefectReason,
  useUpdateDefectReason,
} from 'src/api/hooks/generated/use-defect-reason';

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

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<DefectReasonFormData>({
    code: currentDefectReason?.code || '',
    name: currentDefectReason?.name || '',
    requireExtraNoteFromOperator: currentDefectReason?.requireExtraNoteFromOperator || false,
    addScrapAndIncreaseTotalQuantity: currentDefectReason?.addScrapAndIncreaseTotalQuantity || false,
    colorHex: currentDefectReason?.colorHex || '',
    description: currentDefectReason?.description || '',
  });

  const { mutate: createDefectReasonMutate, isPending: isCreating } = useCreateDefectReason({
    onSuccess: (result) => {
      if (result.isSuccess) {
        router.push('/defect-reasons');
      } else {
        setErrorMessage(result.message || 'Failed to create defect reason');
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to create defect reason');
    },
  });

  const { mutate: updateDefectReasonMutate, isPending: isUpdating } = useUpdateDefectReason({
    onSuccess: (result) => {
      if (result.isSuccess) {
        router.push('/defect-reasons');
      } else {
        setErrorMessage(result.message || 'Failed to update defect reason');
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
      },
    []
  );

  const handleSwitchChange = useCallback(
    (field: keyof DefectReasonFormData) => (event: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.checked,
      }));
    },
    []
  );

  const handleSubmit = useCallback(() => {
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
          { key: 'addScrapAndIncreaseTotalQuantity', value: formData.addScrapAndIncreaseTotalQuantity },
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
        },
      });
    }
  }, [formData, isEdit, currentDefectReason?.id, createDefectReasonMutate, updateDefectReasonMutate]);

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
          <TextField
            fullWidth
            label="Defect reason code"
            value={formData.code}
            onChange={handleInputChange('code')}
          />

          <TextField
            fullWidth
            label="Defect reason name"
            value={formData.name}
            onChange={handleInputChange('name')}
          />

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

          <TextField
            fullWidth
            label="Color (Hex)"
            value={formData.colorHex}
            onChange={handleInputChange('colorHex')}
            placeholder="#FF0000"
            slotProps={{
              input: {
                startAdornment: formData.colorHex && (
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 0.5,
                      bgcolor: formData.colorHex,
                      border: '1px solid',
                      borderColor: 'divider',
                      mr: 1,
                    }}
                  />
                ),
              },
            }}
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={handleInputChange('description')}
            multiline
            rows={4}
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

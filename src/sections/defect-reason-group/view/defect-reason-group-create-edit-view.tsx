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

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useCreateDefectReasonGroup,
  useUpdateDefectReasonGroup,
} from 'src/api/hooks/generated/use-defect-reason-group';

// ----------------------------------------------------------------------

interface DefectReasonGroupFormData {
  code: string;
  name: string;
  colorHex: string;
  description: string;
}

interface DefectReasonGroupCreateEditViewProps {
  isEdit?: boolean;
  currentDefectReasonGroup?: {
    id: string;
    code: string;
    name: string;
    colorHex: string;
    description: string;
  };
}

export function DefectReasonGroupCreateEditView({
  isEdit = false,
  currentDefectReasonGroup,
}: DefectReasonGroupCreateEditViewProps) {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<DefectReasonGroupFormData>({
    code: currentDefectReasonGroup?.code || '',
    name: currentDefectReasonGroup?.name || '',
    colorHex: currentDefectReasonGroup?.colorHex || '#000000',
    description: currentDefectReasonGroup?.description || '',
  });

  const { mutate: createDefectReasonGroupMutate, isPending: isCreating } =
    useCreateDefectReasonGroup({
      onSuccess: (result) => {
        if (result.isSuccess) {
          router.push('/defect-reason-group');
        } else {
          setErrorMessage(result.message || 'Failed to create defect reason group');
        }
      },
      onError: (error) => {
        setErrorMessage(error.message || 'Failed to create defect reason group');
      },
    });

  const { mutate: updateDefectReasonGroupMutate, isPending: isUpdating } =
    useUpdateDefectReasonGroup({
      onSuccess: (result) => {
        if (result.isSuccess) {
          router.push('/defect-reason-group');
        } else {
          setErrorMessage(result.message || 'Failed to update defect reason group');
        }
      },
      onError: (error) => {
        setErrorMessage(error.message || 'Failed to update defect reason group');
      },
    });

  const isSubmitting = isCreating || isUpdating;

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof DefectReasonGroupFormData) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: event.target.value,
        }));
      },
    []
  );

  const handleSubmit = useCallback(() => {
    if (!formData.name) {
      setErrorMessage('Name is required');
      return;
    }

    if (isEdit && currentDefectReasonGroup?.id) {
      // Update uses key-value pairs as per API spec (PATCH-like partial update)
      updateDefectReasonGroupMutate({
        id: currentDefectReasonGroup.id,
        data: [
          { key: 'code', value: formData.code },
          { key: 'name', value: formData.name },
          { key: 'colorHex', value: formData.colorHex },
          { key: 'description', value: formData.description },
        ],
      });
    } else {
      // Create uses full entity object as per API spec
      createDefectReasonGroupMutate({
        data: {
          code: formData.code,
          name: formData.name,
          colorHex: formData.colorHex,
          description: formData.description,
        },
      });
    }
  }, [
    formData,
    isEdit,
    currentDefectReasonGroup?.id,
    createDefectReasonGroupMutate,
    updateDefectReasonGroupMutate,
  ]);

  const handleCancel = useCallback(() => {
    router.push('/defect-reason-group');
  }, [router]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {isEdit ? 'Edit defect reason group' : 'Create a new defect reason group'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Defect Reason Group
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
              label="Code"
              value={formData.code}
              onChange={handleInputChange('code')}
            />

            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={handleInputChange('name')}
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Color
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                component="input"
                type="color"
                value={formData.colorHex}
                onChange={handleInputChange('colorHex')}
                sx={{
                  width: 48,
                  height: 48,
                  border: 'none',
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&::-webkit-color-swatch-wrapper': {
                    padding: 0,
                  },
                  '&::-webkit-color-swatch': {
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  },
                }}
              />
              <TextField
                size="small"
                value={formData.colorHex}
                onChange={handleInputChange('colorHex')}
                placeholder="#000000"
                sx={{ width: 120 }}
              />
            </Box>
          </Box>

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
              'Create group'
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

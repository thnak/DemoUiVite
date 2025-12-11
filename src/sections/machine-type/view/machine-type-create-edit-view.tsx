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
import { useCreateMachineType, useUpdateMachineType } from 'src/api/hooks/generated/use-machine-type';

// ----------------------------------------------------------------------

interface MachineTypeFormData {
  code: string;
  name: string;
  description: string;
}

interface MachineTypeCreateEditViewProps {
  isEdit?: boolean;
  currentMachineType?: {
    id: string;
    code: string;
    name: string;
    description: string;
  };
}

export function MachineTypeCreateEditView({ isEdit = false, currentMachineType }: MachineTypeCreateEditViewProps) {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<MachineTypeFormData>({
    code: currentMachineType?.code || '',
    name: currentMachineType?.name || '',
    description: currentMachineType?.description || '',
  });

  const { mutate: createMachineTypeMutate, isPending: isCreating } = useCreateMachineType({
    onSuccess: (result) => {
      if (result.isSuccess) {
        router.push('/machine-types');
      } else {
        setErrorMessage(result.message || 'Failed to create machine type');
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to create machine type');
    },
  });

  const { mutate: updateMachineTypeMutate, isPending: isUpdating } = useUpdateMachineType({
    onSuccess: (result) => {
      if (result.isSuccess) {
        router.push('/machine-types');
      } else {
        setErrorMessage(result.message || 'Failed to update machine type');
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
    },
    []
  );

  const handleSubmit = useCallback(() => {
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
        ],
      });
    } else {
      // Create uses full entity object as per API spec
      createMachineTypeMutate({
        data: {
          code: formData.code,
          name: formData.name,
          description: formData.description,
        },
      });
    }
  }, [formData, isEdit, currentMachineType?.id, createMachineTypeMutate, updateMachineTypeMutate]);

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
          />

          <TextField
            fullWidth
            label="Machine type name"
            value={formData.name}
            onChange={handleInputChange('name')}
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

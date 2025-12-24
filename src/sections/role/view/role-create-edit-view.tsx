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
import { useCreateRole, useUpdateRole } from 'src/api/hooks/generated/use-role';

// ----------------------------------------------------------------------

interface RoleFormData {
  name: string;
  description: string;
}

interface RoleCreateEditViewProps {
  isEdit?: boolean;
  currentRole?: {
    id: string;
    name: string;
    description: string;
  };
}

export function RoleCreateEditView({ isEdit = false, currentRole }: RoleCreateEditViewProps) {
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
  const [formData, setFormData] = useState<RoleFormData>({
    name: currentRole?.name || '',
    description: currentRole?.description || '',
  });

  const { mutate: createRoleMutate, isPending: isCreating } = useCreateRole({
    onSuccess: (result) => {
      setValidationResult(result);
      if (isValidationSuccess(result)) {
        router.push('/roles');
      } else {
        if (result.message) {
          setErrorMessage(result.message);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to create role');
    },
  });

  const { mutate: updateRoleMutate, isPending: isUpdating } = useUpdateRole({
    onSuccess: (result) => {
      setValidationResult(result);
      if (isValidationSuccess(result)) {
        router.push('/roles');
      } else {
        if (result.message) {
          setErrorMessage(result.message);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to update role');
    },
  });

  const isSubmitting = isCreating || isUpdating;

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof RoleFormData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      clearFieldError(field);
    },
    [clearFieldError]
  );

  const handleSubmit = useCallback(() => {
    clearValidationResult();
    setErrorMessage(null);

    if (!formData.name) {
      setErrorMessage('Role name is required');
      return;
    }

    if (isEdit && currentRole?.id) {
      // Update uses key-value pairs as per API spec (PATCH-like partial update)
      updateRoleMutate({
        id: currentRole.id,
        data: [
          { key: 'name', value: formData.name },
          { key: 'description', value: formData.description },
        ],
      });
    } else {
      // Create uses full entity object as per API spec
      createRoleMutate({
        data: {
          name: formData.name,
          description: formData.description,
        },
      });
    }
  }, [formData, isEdit, currentRole?.id, createRoleMutate, updateRoleMutate, clearValidationResult]);

  const handleCancel = useCallback(() => {
    router.push('/roles');
  }, [router]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {isEdit ? 'Edit role' : 'Create a new role'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Role
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
            label="Role name"
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
              'Create role'
            )}
          </Button>
        </Box>
      </Card>

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

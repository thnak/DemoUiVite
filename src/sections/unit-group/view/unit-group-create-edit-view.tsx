import type { ChangeEvent } from 'react';
import type { UnitGroupEntity } from 'src/api/types/generated';

import { useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { useValidationResult } from 'src/hooks/use-validation-result';

import { isValidationSuccess } from 'src/utils/validation-result';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useCreateUnitGroup,
  useUpdateUnitGroup,
} from 'src/api/hooks/generated/use-unit-group';

// ----------------------------------------------------------------------

interface UnitGroupFormData {
  name: string;
  description: string;
}

interface UnitGroupCreateEditViewProps {
  isEdit?: boolean;
  currentUnitGroup?: UnitGroupEntity;
}

export function UnitGroupCreateEditView({
  isEdit = false,
  currentUnitGroup,
}: UnitGroupCreateEditViewProps) {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/settings/unit-groups';

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
  const [formData, setFormData] = useState<UnitGroupFormData>({
    name: '',
    description: '',
  });
  const formInitializedRef = useRef(false);

  // Initialize form data once when data is available
  // This is a legitimate use of setState in useEffect for one-time form initialization
  // The ref prevents cascading renders by ensuring it only runs once
  useEffect(() => {
    if (isEdit && currentUnitGroup && !formInitializedRef.current) {
      formInitializedRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: currentUnitGroup.name || '',
        description: currentUnitGroup.description || '',
      });
    }
  }, [isEdit, currentUnitGroup]); 

  const { mutate: createUnitGroup, isPending: isCreating } = useCreateUnitGroup({
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
      setErrorMessage(error.message || 'Failed to create unit group');
    },
  });

  const { mutate: updateUnitGroup, isPending: isUpdating } = useUpdateUnitGroup({
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
      setErrorMessage(error.message || 'Failed to update unit group');
    },
  });

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleChange = useCallback(
    (field: keyof UnitGroupFormData) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: event.target.value,
        }));
        clearFieldError(field);
      },
    [clearFieldError]
  );

  const handleSave = useCallback(() => {
    clearValidationResult();
    setErrorMessage(null);

    if (isEdit && currentUnitGroup?.id) {
      // Update existing unit group
      updateUnitGroup({
        id: currentUnitGroup.id.toString(),
        data: [
          { key: 'name', value: formData.name },
          { key: 'description', value: formData.description },
        ],
      });
    } else {
      // Create new unit group
      createUnitGroup({
        data: {
          name: formData.name,
          description: formData.description,
        } as any, // Cast to any to bypass strict type checking for required fields,
      });
    }
  }, [
    isEdit,
    currentUnitGroup,
    formData.name,
    formData.description,
    updateUnitGroup,
    createUnitGroup,
    clearValidationResult,
  ]); 

  const handleCancel = useCallback(() => {
    router.push(returnUrl);
  }, [router, returnUrl]);

  const isSubmitting = isCreating || isUpdating;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {isEdit ? 'Edit Unit Group' : 'Create a new unit group'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Unit Group Details
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={formData.name}
                    onChange={handleChange('name')}
                    error={hasError('name')}
                    helperText={getFieldErrorMessage('name')}
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
                    error={hasError('description')}
                    helperText={getFieldErrorMessage('description')}
                  />
                </Grid>
              </Grid>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <LoadingButton
                variant="contained"
                onClick={handleSave}
                loading={isSubmitting}
                disabled={!formData.name}
              >
                {isEdit ? 'Update' : 'Create'}
              </LoadingButton>
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

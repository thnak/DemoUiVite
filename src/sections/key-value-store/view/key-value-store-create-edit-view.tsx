import { useParams, useSearchParams } from 'react-router-dom';
import { useMemo, useState, useCallback, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { useValidationResult } from 'src/hooks/use-validation-result';

import { isValidationSuccess } from 'src/utils/validation-result';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useCreateKeyValueStore,
  useUpdateKeyValueStore,
  useGetKeyValueStoreById,
} from 'src/api/hooks/generated/use-key-value-store';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface KeyValueStoreFormData {
  key: string;
  value: string;
  typeName: string;
  tags: string[];
  expiresAt: Date | null;
  isEncrypted: boolean;
}

interface KeyValueStoreCreateEditViewProps {
  isEdit?: boolean;
}

export function KeyValueStoreCreateEditView({ isEdit = false }: KeyValueStoreCreateEditViewProps) {
  const router = useRouter();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/settings/key-value-store';

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

  // Fetch key-value store data if editing
  const { data: keyValueStoreData, isLoading: isLoadingKeyValueStore } = useGetKeyValueStoreById(
    id || '',
    {
      enabled: isEdit && !!id,
    }
  );

  // Initialize form data using useMemo - React Compiler friendly
  const initialFormData = useMemo<KeyValueStoreFormData>(() => {
    if (isEdit && keyValueStoreData) {
      return {
        key: keyValueStoreData.key || '',
        value: keyValueStoreData.value || '',
        typeName: keyValueStoreData.typeName || '',
        tags: keyValueStoreData.tags || [],
        expiresAt: keyValueStoreData.expiresAt ? new Date(keyValueStoreData.expiresAt) : null,
        isEncrypted: keyValueStoreData.isEncrypted || false,
      };
    }
    return {
      key: '',
      value: '',
      typeName: '',
      tags: [],
      expiresAt: null,
      isEncrypted: false,
    };
  }, [isEdit, keyValueStoreData]);

  const [formData, setFormData] = useState<KeyValueStoreFormData>(initialFormData);

  const { mutate: createKeyValueStoreMutate, isPending: isCreating } = useCreateKeyValueStore({
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
      setErrorMessage(error.message || 'Failed to create key-value store');
    },
  });

  const { mutate: updateKeyValueStoreMutate, isPending: isUpdating } = useUpdateKeyValueStore({
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
      setErrorMessage(error.message || 'Failed to update key-value store');
    },
  });

  const isSubmitting = isCreating || isUpdating;

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof KeyValueStoreFormData) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: event.target.value,
        }));
        clearFieldError(field);
      },
    [clearFieldError]
  );

  const handleCheckboxChange = useCallback(
    (field: keyof KeyValueStoreFormData) => (event: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.checked,
      }));
      clearFieldError(field);
    },
    [clearFieldError]
  );

  const handleTagsChange = useCallback(
    (_event: any, newValue: string[]) => {
      setFormData((prev) => ({
        ...prev,
        tags: newValue,
      }));
      clearFieldError('tags');
    },
    [clearFieldError]
  );

  const handleDateChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        expiresAt: value ? new Date(value) : null,
      }));
      clearFieldError('expiresAt');
    },
    [clearFieldError]
  );

  const handleSubmit = useCallback(() => {
    clearValidationResult();
    setErrorMessage(null);

    if (!formData.key) {
      setErrorMessage('Key is required');
      return;
    }

    if (isEdit && id) {
      // Update uses key-value pairs
      updateKeyValueStoreMutate({
        id,
        data: [
          { key: 'key', value: formData.key },
          { key: 'value', value: formData.value },
          { key: 'typeName', value: formData.typeName },
          { key: 'tags', value: JSON.stringify(formData.tags) },
          { key: 'expiresAt', value: formData.expiresAt?.toISOString() || '' },
          { key: 'isEncrypted', value: formData.isEncrypted.toString() },
        ],
      });
    } else {
      // Create uses full entity object
      createKeyValueStoreMutate({
        data: {
          key: formData.key,
          value: formData.value,
          typeName: formData.typeName,
          tags: formData.tags,
          expiresAt: formData.expiresAt?.toISOString() || null,
          isEncrypted: formData.isEncrypted,
        } as any,
      });
    }
  }, [
    formData,
    isEdit,
    id,
    createKeyValueStoreMutate,
    updateKeyValueStoreMutate,
    clearValidationResult,
  ]);

  const handleCancel = useCallback(() => {
    router.push(returnUrl);
  }, [router, returnUrl]);

  if (isLoadingKeyValueStore) {
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
          {isEdit ? 'Edit key-value store' : 'Create a new key-value store'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Settings
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Key-Value Store
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            {isEdit ? 'Edit' : 'Create'}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ md: 4, xs: 12 }}>
          <Card sx={{ p: 3 }}>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isEncrypted}
                    onChange={handleCheckboxChange('isEncrypted')}
                    icon={<Iconify icon="solar:eye-closed-bold" width={24} />}
                    checkedIcon={<Iconify icon="solar:shield-keyhole-bold-duotone" width={24} />}
                  />
                }
                label="Encrypt Value"
              />
              <Typography
                variant="caption"
                sx={{ display: 'block', mt: 1, color: 'text.secondary' }}
              >
                Enable encryption to protect sensitive data using .NET Data Protection API
              </Typography>
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
                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    label="Key"
                    value={formData.key}
                    required
                    onChange={handleInputChange('key')}
                    error={hasError('key')}
                    helperText={
                      getFieldErrorMessage('key') ||
                      'Unique key for the stored value. Automatically normalized to lowercase.'
                    }
                    disabled={isEdit}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    fullWidth
                    label="Value"
                    value={formData.value}
                    onChange={handleInputChange('value')}
                    multiline
                    rows={4}
                    error={hasError('value')}
                    helperText={
                      getFieldErrorMessage('value') ||
                      'The value to store (serialized as JSON string)'
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Type Name"
                    value={formData.typeName}
                    onChange={handleInputChange('typeName')}
                    error={hasError('typeName')}
                    helperText={
                      getFieldErrorMessage('typeName') || 'Type name for runtime type checking'
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Expires At"
                    type="datetime-local"
                    value={
                      formData.expiresAt
                        ? new Date(
                            formData.expiresAt.getTime() -
                              formData.expiresAt.getTimezoneOffset() * 60000
                          )
                            .toISOString()
                            .slice(0, 16)
                        : ''
                    }
                    onChange={handleDateChange}
                    error={hasError('expiresAt')}
                    helperText={
                      getFieldErrorMessage('expiresAt') ||
                      'Optional expiration time (UTC). Entry will be auto-deleted after this time.'
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={formData.tags}
                    onChange={handleTagsChange}
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((option: string, index: number) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                          key={option}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags"
                        placeholder="Type and press Enter to add tags"
                        error={hasError('tags')}
                        helperText={
                          getFieldErrorMessage('tags') ||
                          'Tags for categorizing and grouping key-value pairs'
                        }
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Card>

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
                disabled={isSubmitting || !formData.key}
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
                  'Create key-value store'
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

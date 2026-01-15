import type { ChangeEvent } from 'react';

import { useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useValidationResult } from 'src/hooks/use-validation-result';

import { isValidationSuccess } from 'src/utils/validation-result';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useCreateUnitConversion,
  useUpdateUnitConversion,
  useGetUnitConversionById,
} from 'src/api/hooks/generated/use-unit-conversion';

import { UnitSelector } from 'src/components/selectors/unit-selector';

// ----------------------------------------------------------------------

interface UnitConversionFormData {
  fromUnitId: string;
  toUnitId: string;
  conversionFactor: string;
  offset: string;
  formulaDescription: string;
}

interface UnitConversionCreateEditViewProps {
  isEdit?: boolean;
}

export function UnitConversionCreateEditView({
  isEdit = false,
}: UnitConversionCreateEditViewProps) {
  const navigate = useNavigate();
  const { id } = useParams();

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

  // Fetch conversion data if editing
  const { data: conversionData, isLoading: isLoadingConversion } = useGetUnitConversionById(
    id || '',
    {
      enabled: isEdit && !!id,
    }
  );

  // Initialize form data using useMemo - React Compiler friendly
  const initialFormData = useMemo<UnitConversionFormData>(() => {
    if (isEdit && conversionData) {
      return {
        fromUnitId: conversionData.fromUnitId?.toString() || '',
        toUnitId: conversionData.toUnitId?.toString() || '',
        conversionFactor: conversionData.conversionFactor?.toString() || '',
        offset: conversionData.offset?.toString() || '0',
        formulaDescription: conversionData.formulaDescription || '',
      };
    }
    return {
      fromUnitId: '',
      toUnitId: '',
      conversionFactor: '',
      offset: '0',
      formulaDescription: '',
    };
  }, [isEdit, conversionData]);

  const [formData, setFormData] = useState<UnitConversionFormData>(initialFormData);

  const { mutate: createConversion, isPending: isCreating } = useCreateUnitConversion({
    onSuccess: (result) => {
      setValidationResult(result);
      if (isValidationSuccess(result)) {
        navigate('/settings/unit-conversions');
      } else {
        if (result.message) {
          setErrorMessage(result.message);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to create unit conversion');
    },
  });

  const { mutate: updateConversion, isPending: isUpdating } = useUpdateUnitConversion({
    onSuccess: (result) => {
      setValidationResult(result);
      if (isValidationSuccess(result)) {
        navigate('/settings/unit-conversions');
      } else {
        if (result.message) {
          setErrorMessage(result.message);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to update unit conversion');
    },
  });

  const handleChange = useCallback(
    (field: keyof UnitConversionFormData) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: event.target.value,
        }));
        clearFieldError(field);
      },
    [clearFieldError]
  );

  const handleUnitChange = useCallback(
    (field: 'fromUnitId' | 'toUnitId') => (unitId: string | null) => {
      setFormData((prev) => ({
        ...prev,
        [field]: unitId || '',
      }));
      clearFieldError(field);
    },
    [clearFieldError]
  );

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleSave = useCallback(() => {
    // Clear previous errors
    clearValidationResult();
    setErrorMessage(null);

    if (isEdit && id) {
      // Update existing conversion
      updateConversion({
        id,
        data: [
          { key: 'fromUnitId', value: formData.fromUnitId },
          { key: 'toUnitId', value: formData.toUnitId },
          { key: 'conversionFactor', value: formData.conversionFactor },
          { key: 'offset', value: formData.offset },
          { key: 'formulaDescription', value: formData.formulaDescription },
        ],
      });
    } else {
      // Create new conversion
      createConversion({
        data: {
          fromUnitId: formData.fromUnitId,
          toUnitId: formData.toUnitId,
          conversionFactor: parseFloat(formData.conversionFactor) || 0,
          offset: parseFloat(formData.offset) || 0,
          formulaDescription: formData.formulaDescription,
        } as any, // Cast to any to bypass strict type checking for required fields,
      });
    }
  }, [formData, isEdit, id, createConversion, updateConversion, clearValidationResult]);

  const handleCancel = useCallback(() => {
    navigate('/settings/unit-conversions');
  }, [navigate]);

  if (isLoadingConversion) {
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
          {isEdit ? 'Edit Unit Conversion' : 'Create a new unit conversion'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Conversion Details
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <UnitSelector
                    value={formData.fromUnitId}
                    onChange={handleUnitChange('fromUnitId')}
                    label="From Unit"
                    required
                    error={hasError('fromUnitId')}
                    helperText={getFieldErrorMessage('fromUnitId') || undefined}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <UnitSelector
                    value={formData.toUnitId}
                    onChange={handleUnitChange('toUnitId')}
                    label="To Unit"
                    required
                    error={hasError('toUnitId')}
                    helperText={getFieldErrorMessage('toUnitId') || undefined}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Conversion Factor"
                    value={formData.conversionFactor}
                    onChange={handleChange('conversionFactor')}
                    helperText={
                      getFieldErrorMessage('conversionFactor') ||
                      'Multiply the from-unit by this factor'
                    }
                    required
                    error={hasError('conversionFactor')}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Offset"
                    value={formData.offset}
                    onChange={handleChange('offset')}
                    helperText={
                      getFieldErrorMessage('offset') || 'Add this offset after multiplication'
                    }
                    error={hasError('offset')}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Formula Description"
                    value={formData.formulaDescription}
                    onChange={handleChange('formulaDescription')}
                    helperText={
                      getFieldErrorMessage('formulaDescription') || "e.g., 'F = C * 1.8 + 32'"
                    }
                    error={hasError('formulaDescription')}
                  />
                </Grid>
              </Grid>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={
                  isCreating ||
                  isUpdating ||
                  !formData.fromUnitId ||
                  !formData.toUnitId ||
                  !formData.conversionFactor
                }
              >
                {isCreating || isUpdating ? 'Saving...' : 'Save'}
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

import type { ChangeEvent } from 'react';

import { useState, useEffect, useCallback } from 'react';
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

export function UnitConversionCreateEditView({ isEdit = false }: UnitConversionCreateEditViewProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState<UnitConversionFormData>({
    fromUnitId: '',
    toUnitId: '',
    conversionFactor: '',
    offset: '0',
    formulaDescription: '',
  });
  const [isLoadingConversion, setIsLoadingConversion] = useState(isEdit);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Fetch conversion data if editing
  const { data: conversionData } = useGetUnitConversionById(id || '', {
    enabled: isEdit && !!id,
  });

  useEffect(() => {
    if (isEdit && conversionData) {
      setFormData({
        fromUnitId: conversionData.fromUnitId?.toString() || '',
        toUnitId: conversionData.toUnitId?.toString() || '',
        conversionFactor: conversionData.conversionFactor?.toString() || '',
        offset: conversionData.offset?.toString() || '0',
        formulaDescription: conversionData.formulaDescription || '',
      });
      setIsLoadingConversion(false);
    }
  }, [isEdit, conversionData]);

  const { mutate: createConversion, isPending: isCreating } = useCreateUnitConversion({
    onSuccess: (result) => {
      if (result.isValid) {
        navigate('/settings/unit-conversions');
      } else {
        setErrorMessage(result.message || 'Validation failed');
        if (result.errors) {
          const errors: Record<string, string> = {};
          Object.entries(result.errors).forEach(([key, error]) => {
            errors[key] = error.message || 'Invalid value';
          });
          setFieldErrors(errors);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to create unit conversion');
      setFieldErrors({});
    },
  });

  const { mutate: updateConversion, isPending: isUpdating } = useUpdateUnitConversion({
    onSuccess: (result) => {
      if (result.isValid) {
        navigate('/settings/unit-conversions');
      } else {
        setErrorMessage(result.message || 'Validation failed');
        if (result.errors) {
          const errors: Record<string, string> = {};
          Object.entries(result.errors).forEach(([key, error]) => {
            errors[key] = error.message || 'Invalid value';
          });
          setFieldErrors(errors);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to update unit conversion');
      setFieldErrors({});
    },
  });

  const handleChange = useCallback(
    (field: keyof UnitConversionFormData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    },
    []
  );

  const handleUnitChange = useCallback((field: 'fromUnitId' | 'toUnitId') => (unitId: string | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: unitId || '',
    }));
  }, []);

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
    setFieldErrors({});
  }, []);

  const handleSave = useCallback(() => {
    // Clear previous errors
    setErrorMessage(null);
    setFieldErrors({});

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
        },
      });
    }
  }, [formData, isEdit, id, createConversion, updateConversion]);

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
                    error={!!fieldErrors.fromUnitId}
                    helperText={fieldErrors.fromUnitId}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <UnitSelector
                    value={formData.toUnitId}
                    onChange={handleUnitChange('toUnitId')}
                    label="To Unit"
                    required
                    error={!!fieldErrors.toUnitId}
                    helperText={fieldErrors.toUnitId}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Conversion Factor"
                    value={formData.conversionFactor}
                    onChange={handleChange('conversionFactor')}
                    helperText={fieldErrors.conversionFactor || "Multiply the from-unit by this factor"}
                    required
                    error={!!fieldErrors.conversionFactor}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Offset"
                    value={formData.offset}
                    onChange={handleChange('offset')}
                    helperText={fieldErrors.offset || "Add this offset after multiplication"}
                    error={!!fieldErrors.offset}
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
                    helperText={fieldErrors.formulaDescription || "e.g., 'F = C * 1.8 + 32'"}
                    error={!!fieldErrors.formulaDescription}
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
                disabled={isCreating || isUpdating || !formData.fromUnitId || !formData.toUnitId || !formData.conversionFactor}
              >
                {isCreating || isUpdating ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>

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

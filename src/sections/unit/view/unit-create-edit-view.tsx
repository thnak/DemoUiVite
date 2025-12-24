import type { ChangeEvent } from 'react';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { UnitGroupEntity } from 'src/api/types/generated';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';

import { useValidationResult } from 'src/hooks/use-validation-result';

import { isValidationSuccess } from 'src/utils/validation-result';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetUnitGroupPage } from 'src/api/hooks/generated/use-unit-group';
import { useCreateUnit, useUpdateUnit, useGetUnitById } from 'src/api/hooks/generated/use-unit';

// ----------------------------------------------------------------------

interface UnitFormData {
  name: string;
  symbol: string;
  unitGroupId: string;
  description: string;
}

interface UnitCreateEditViewProps {
  isEdit?: boolean;
}

export function UnitCreateEditView({ isEdit = false }: UnitCreateEditViewProps) {
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

  const [formData, setFormData] = useState<UnitFormData>({
    name: '',
    symbol: '',
    unitGroupId: '',
    description: '',
  });
  const [unitGroups, setUnitGroups] = useState<UnitGroupEntity[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [isLoadingUnit, setIsLoadingUnit] = useState(isEdit);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch unit groups
  const { mutate: fetchUnitGroups } = useGetUnitGroupPage({
    onSuccess: (data) => {
      setUnitGroups(data.items || []);
      setIsLoadingGroups(false);
    },
    onError: () => {
      setIsLoadingGroups(false);
    },
  });

  // Fetch unit data if editing
  const { data: unitData } = useGetUnitById(id || '', {
    enabled: isEdit && !!id,
  });

  useEffect(() => {
    // Fetch all unit groups
    fetchUnitGroups({
      data: [{ sortBy: 'name', descending: false }],
      params: {
        pageNumber: 0,
        pageSize: 100,
      },
    });
  }, [fetchUnitGroups]);

  useEffect(() => {
    if (isEdit && unitData) {
      setFormData({
        name: unitData.name || '',
        symbol: unitData.symbol || '',
        unitGroupId: unitData.unitGroupId?.toString() || '',
        description: unitData.description || '',
      });
      setIsLoadingUnit(false);
    }
  }, [isEdit, unitData]);

  const { mutate: createUnit, isPending: isCreating } = useCreateUnit({
    onSuccess: (result) => {
      setValidationResult(result);
      if (isValidationSuccess(result)) {
        navigate('/settings/units');
      } else {
        if (result.message) {
          setErrorMessage(result.message);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to create unit');
    },
  });

  const { mutate: updateUnit, isPending: isUpdating } = useUpdateUnit({
    onSuccess: (result) => {
      setValidationResult(result);
      if (isValidationSuccess(result)) {
        navigate('/settings/units');
      } else {
        if (result.message) {
          setErrorMessage(result.message);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to update unit');
    },
  });

  const handleChange = useCallback(
    (field: keyof UnitFormData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      clearFieldError(field);
    },
    [clearFieldError]
  );

  const handleSelectChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      setFormData((prev) => ({
        ...prev,
        unitGroupId: event.target.value,
      }));
      clearFieldError('unitGroupId');
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
      // Update existing unit
      updateUnit({
        id,
        data: [
          { key: 'name', value: formData.name },
          { key: 'symbol', value: formData.symbol },
          { key: 'unitGroupId', value: formData.unitGroupId },
          { key: 'description', value: formData.description },
        ],
      });
    } else {
      // Create new unit
      createUnit({
        data: {
          name: formData.name,
          symbol: formData.symbol,
          unitGroupId: formData.unitGroupId,
          description: formData.description,
        },
      });
    }
  }, [formData, isEdit, id, createUnit, updateUnit, clearValidationResult]);

  const handleCancel = useCallback(() => {
    navigate('/settings/units');
  }, [navigate]);

  if (isLoadingUnit || isLoadingGroups) {
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
          {isEdit ? 'Edit Unit' : 'Create a new unit'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Unit Details
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={formData.name}
                    onChange={handleChange('name')}
                    required
                    error={hasError('name')}
                    helperText={getFieldErrorMessage('name')}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Symbol"
                    value={formData.symbol}
                    onChange={handleChange('symbol')}
                    required
                    error={hasError('symbol')}
                    helperText={getFieldErrorMessage('symbol')}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth required error={hasError('unitGroupId')}>
                    <InputLabel>Unit Group</InputLabel>
                    <Select
                      value={formData.unitGroupId}
                      onChange={handleSelectChange}
                      label="Unit Group"
                    >
                      {unitGroups.map((group) => (
                        <MenuItem key={group.id?.toString()} value={group.id?.toString()}>
                          {group.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {hasError('unitGroupId') && (
                      <FormHelperText>{getFieldErrorMessage('unitGroupId')}</FormHelperText>
                    )}
                  </FormControl>
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
              <Button variant="outlined" onClick={handleCancel} disabled={isCreating || isUpdating}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isCreating || isUpdating || !formData.name || !formData.symbol || !formData.unitGroupId}
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

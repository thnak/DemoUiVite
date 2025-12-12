import type { ChangeEvent } from 'react';

import { useState, useCallback } from 'react';

import type { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

interface UnitConversionFormData {
  from: string;
  to: string;
  conversionFactor: string;
  offset: string;
  formulaDescription: string;
}

const UNITS = [
  { value: 'kilogram', label: 'Kilogram (kg)' },
  { value: 'gram', label: 'Gram (g)' },
  { value: 'liter', label: 'Liter (L)' },
  { value: 'milliliter', label: 'Milliliter (mL)' },
  { value: 'meter', label: 'Meter (m)' },
  { value: 'centimeter', label: 'Centimeter (cm)' },
  { value: 'celsius', label: 'Celsius (°C)' },
  { value: 'fahrenheit', label: 'Fahrenheit (°F)' },
];

interface UnitConversionCreateEditViewProps {
  isEdit?: boolean;
}

export function UnitConversionCreateEditView({ isEdit = false }: UnitConversionCreateEditViewProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<UnitConversionFormData>({
    from: '',
    to: '',
    conversionFactor: '',
    offset: '0',
    formulaDescription: '',
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

  const handleSelectChange = useCallback((field: 'from' | 'to') => (event: SelectChangeEvent<string>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  }, []);

  const handleSave = useCallback(() => {
    // TODO: Implement save
    console.log('Save unit conversion:', formData);
    router.push('/settings/unit-conversions');
  }, [formData, router]);

  const handleCancel = useCallback(() => {
    router.push('/settings/unit-conversions');
  }, [router]);

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
                  <FormControl fullWidth>
                    <InputLabel>From Unit</InputLabel>
                    <Select value={formData.from} onChange={handleSelectChange('from')} label="From Unit">
                      {UNITS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>To Unit</InputLabel>
                    <Select value={formData.to} onChange={handleSelectChange('to')} label="To Unit">
                      {UNITS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Conversion Factor"
                    value={formData.conversionFactor}
                    onChange={handleChange('conversionFactor')}
                    helperText="Multiply the from-unit by this factor"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Offset"
                    value={formData.offset}
                    onChange={handleChange('offset')}
                    helperText="Add this offset after multiplication"
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
                    helperText="e.g., 'F = C * 1.8 + 32'"
                  />
                </Grid>
              </Grid>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

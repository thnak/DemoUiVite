import type { ChangeEvent } from 'react';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

interface UnitFormData {
  name: string;
  symbol: string;
  group: string;
  baseUnit: boolean;
  description: string;
}

const UNIT_GROUPS = [
  { value: 'mass', label: 'Mass' },
  { value: 'volume', label: 'Volume' },
  { value: 'count', label: 'Count' },
  { value: 'length', label: 'Length' },
  { value: 'area', label: 'Area' },
  { value: 'time', label: 'Time' },
  { value: 'temperature', label: 'Temperature' },
];

interface UnitCreateEditViewProps {
  isEdit?: boolean;
}

export function UnitCreateEditView({ isEdit = false }: UnitCreateEditViewProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<UnitFormData>({
    name: '',
    symbol: '',
    group: '',
    baseUnit: false,
    description: '',
  });

  const handleChange = useCallback(
    (field: keyof UnitFormData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    },
    []
  );

  const handleSelectChange = useCallback((event: any) => {
    setFormData((prev) => ({
      ...prev,
      group: event.target.value,
    }));
  }, []);

  const handleSwitchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      baseUnit: event.target.checked,
    }));
  }, []);

  const handleSave = useCallback(() => {
    // TODO: Implement save
    console.log('Save unit:', formData);
    router.push('/settings/units');
  }, [formData, router]);

  const handleCancel = useCallback(() => {
    router.push('/settings/units');
  }, [router]);

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
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Symbol"
                    value={formData.symbol}
                    onChange={handleChange('symbol')}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Group</InputLabel>
                    <Select value={formData.group} onChange={handleSelectChange} label="Group">
                      {UNIT_GROUPS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControlLabel
                    control={
                      <Switch checked={formData.baseUnit} onChange={handleSwitchChange} />
                    }
                    label="Base Unit"
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

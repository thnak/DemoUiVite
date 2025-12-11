import type { ChangeEvent } from 'react';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

interface UnitGroupFormData {
  name: string;
  description: string;
}

interface UnitGroupCreateEditViewProps {
  isEdit?: boolean;
}

export function UnitGroupCreateEditView({ isEdit = false }: UnitGroupCreateEditViewProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<UnitGroupFormData>({
    name: '',
    description: '',
  });

  const handleChange = useCallback(
    (field: keyof UnitGroupFormData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    },
    []
  );

  const handleSave = useCallback(() => {
    // TODO: Implement save
    console.log('Save unit group:', formData);
    router.push('/settings/unit-groups');
  }, [formData, router]);

  const handleCancel = useCallback(() => {
    router.push('/settings/unit-groups');
  }, [router]);

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

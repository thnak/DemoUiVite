import type { ChangeEvent } from 'react';
import type { UnitGroupEntity } from 'src/api/types/generated';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

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

  const [formData, setFormData] = useState<UnitGroupFormData>({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (isEdit && currentUnitGroup) {
      setFormData({
        name: currentUnitGroup.name || '',
        description: currentUnitGroup.description || '',
      });
    }
  }, [isEdit, currentUnitGroup]);

  const { mutate: createUnitGroup, isPending: isCreating } = useCreateUnitGroup({
    onSuccess: () => {
      router.push('/settings/unit-groups');
    },
    onError: (error) => {
      console.error('Failed to create unit group:', error);
    },
  });

  const { mutate: updateUnitGroup, isPending: isUpdating } = useUpdateUnitGroup({
    onSuccess: () => {
      router.push('/settings/unit-groups');
    },
    onError: (error) => {
      console.error('Failed to update unit group:', error);
    },
  });

  const handleChange = useCallback(
    (field: keyof UnitGroupFormData) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: event.target.value,
        }));
      },
    []
  );

  const handleSave = useCallback(() => {
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
        },
      });
    }
  }, [isEdit, currentUnitGroup, formData, createUnitGroup, updateUnitGroup]);

  const handleCancel = useCallback(() => {
    router.push('/settings/unit-groups');
  }, [router]);

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
    </DashboardContent>
  );
}

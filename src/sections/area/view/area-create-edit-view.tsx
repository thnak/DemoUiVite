import { useState, useCallback, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

interface AreaFormData {
  name: string;
  description: string;
}

interface AreaCreateEditViewProps {
  isEdit?: boolean;
  currentArea?: {
    id: string;
    name: string;
    description: string;
  };
}

export function AreaCreateEditView({ isEdit = false, currentArea }: AreaCreateEditViewProps) {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<AreaFormData>({
    name: currentArea?.name || '',
    description: currentArea?.description || '',
  });

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof AreaFormData) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: event.target.value,
        }));
      },
    []
  );

  const handleSubmit = useCallback(() => {
    if (!formData.name) {
      setErrorMessage('Area name is required');
      return;
    }

    console.log(`${isEdit ? 'Updating' : 'Creating'} area with data:`, formData);

    // Navigate back to list after save
    router.push('/area');
  }, [formData, isEdit, router]);

  const handleCancel = useCallback(() => {
    router.push('/area');
  }, [router]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {isEdit ? 'Edit area' : 'Create a new area'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Area
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
            label="Area name"
            value={formData.name}
            onChange={handleInputChange('name')}
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={handleInputChange('description')}
            multiline
            rows={4}
          />
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button variant="outlined" color="inherit" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="inherit"
            onClick={handleSubmit}
            sx={{
              bgcolor: 'grey.900',
              color: 'common.white',
              '&:hover': {
                bgcolor: 'grey.800',
              },
            }}
          >
            {isEdit ? 'Save changes' : 'Create area'}
          </Button>
        </Box>
      </Card>

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

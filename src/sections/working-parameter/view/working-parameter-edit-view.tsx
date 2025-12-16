import { useState, useEffect, useCallback, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';


interface WorkingFormData {
  machine: string;
  product: string;
  idealCycleTime: string;
  downtimeThreshold: string | null;
  speedLossThreshold: string | null;
  quantityPerCycle: string | null;
}
interface WorkingParameterCreateEditViewProps {
  isEdit?: boolean;
  currentWorkingParameter?: {
    id: string;
    machine: string;
    product: string;
    idealCycleTime: string | null ;
    downtimeThreshold: string | null;
    speedLossThreshold: string | null;
    quantityPerCycle: string | null;
  };
}
export function WorkingParameterCreateEditView({
isEdit = false,
currentWorkingParameter,
}: WorkingParameterCreateEditViewProps){
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<WorkingFormData>({
    machine: currentWorkingParameter?.machine || '',
    product: currentWorkingParameter?.product || '',
    idealCycleTime: currentWorkingParameter?.idealCycleTime?.toString()|| '',
    downtimeThreshold: currentWorkingParameter?.downtimeThreshold?.toString() || '',
    speedLossThreshold: currentWorkingParameter?.speedLossThreshold?.toString() || '',
    quantityPerCycle: currentWorkingParameter?.quantityPerCycle || '',
  });
  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);
  const handleInputChange = useCallback(
    (field: keyof WorkingFormData) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: event.target.value,
        }));
      },
    []
  );
  const handleSelectChange = useCallback(
    (field: keyof WorkingFormData) => (event: { target: { value: string } }) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    },
    []
  );
  const handleCancel = useCallback(() => {
    router.push('/working-parameter');
  }, [router]);
  const handleSubmit = useCallback(() => {
    if (!formData.machine) {
      setErrorMessage('machine  is required');
      return;
    }
    if (!formData.product) {
      setErrorMessage('product is required');
      return;
    }
    if (!formData.quantityPerCycle) {
      setErrorMessage('quantityPerCycle is required');
      return;
    }
    if (!formData.downtimeThreshold) {
      setErrorMessage('downtimeThreshold is required');
      return;
    }
    if (!formData.idealCycleTime) {
      setErrorMessage('idealCycleTime is required');
      return;
    }
    if (!formData.speedLossThreshold) {
      setErrorMessage('speedLossThreshold is required');
      return;
    }


    // Navigate back to list after save
    router.push('/working-parameter');
  }, [formData, isEdit, router]);
  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {isEdit ? 'Edit working parameter' : 'Create a new working parameter'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Working parameter
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

        {/* Right Section - Product Info Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Product name"
                  value={formData.product}
                  onChange={handleInputChange('product')}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Machine name"
                  value={formData.machine}
                  onChange={handleInputChange('machine')}
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Ideal Cycle Time"
                  value={formData.idealCycleTime}
                  onChange={handleInputChange('idealCycleTime')}
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Downtime Threshold"
                  value={formData.downtimeThreshold}
                  onChange={handleInputChange('downtimeThreshold')}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Quantity Per Cycle"
                  value={formData.quantityPerCycle}
                  onChange={handleInputChange('quantityPerCycle')}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>

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
                {isEdit ? 'Save changes' : 'Create product'}
              </Button>
            </Box>
          </Card>
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

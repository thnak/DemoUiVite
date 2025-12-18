import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { createWorkingParameter, updateWorkingParameter } from '../../../api';
import { DurationTimePicker } from '../../../components/duration-time-picker';
import { MachineSelector, ProductSelector } from '../../../components/selectors';


interface WorkingFormData {
  machine: string | null;
  product: string | null;
  idealCycleTime: string;
  downtimeThreshold: string | undefined;
  speedLossThreshold: string | undefined;
  quantityPerCycle: string | undefined;
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
    quantityPerCycle: currentWorkingParameter?.quantityPerCycle || '1',
  });
  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);
  const handleInputChange = useCallback(
    (field: keyof WorkingFormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
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
  const toNumberOrUndefined = (v: string | null | undefined) => {
    const s = String(v ?? '').trim();
    if (!s) return undefined;
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
  };

  const handleSubmit = useCallback(async () => {
    if (!formData.machine) { setErrorMessage('machine is required'); return; }
    if (!formData.product) { setErrorMessage('product is required'); return; }
    if (!formData.quantityPerCycle) { setErrorMessage('quantityPerCycle is required'); return; }
    if (!formData.downtimeThreshold) { setErrorMessage('downtimeThreshold is required'); return; }
    if (!formData.idealCycleTime) { setErrorMessage('idealCycleTime is required'); return; }

    try {
      if (isEdit && currentWorkingParameter?.id) {
        await updateWorkingParameter(
          currentWorkingParameter.id,
           [
            { key: 'machine', value: formData.machine },
            { key: 'product', value: formData.product },
            { key: 'idealCycleTime', value: formData.idealCycleTime },
            { key: 'quantityPerCycle', value: toNumberOrUndefined(formData.quantityPerCycle) },
            { key: 'downtimeThreshold', value: formData.downtimeThreshold },
            { key: 'speedLossThreshold', value: formData.speedLossThreshold },
          ],
        );
      } else {
        await createWorkingParameter({
          machineId: formData.machine,
          productId: formData.product,
          idealCycleTime: formData.idealCycleTime,
          quantityPerCycle: toNumberOrUndefined(formData.quantityPerCycle),
          downtimeThreshold: formData.downtimeThreshold,
          speedLossThreshold: formData.speedLossThreshold,
        });
      }

      router.push('/working-parameter');
    } catch (e: any) {
      setErrorMessage(e?.message ?? 'Something went wrong');
    }
  }, [formData, isEdit, currentWorkingParameter?.id, createWorkingParameter, updateWorkingParameter]);

  const handleMachineChange = useCallback((machine: string | null) => {
      setFormData((prev) => ({
          ...prev,
          machine,
      }));
  }, []);
  const handleProductChange = useCallback((product: string | null) => {
      setFormData((prev) => ({
          ...prev,
          product,
      }));
  }, []);
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
                <MachineSelector value={formData.machine}
                onChange={handleMachineChange}
                label="Machine" />
              </Grid>

              <Grid size={{ xs: 12 }}>
                  <ProductSelector value={formData.product}
                                   onChange={handleProductChange}
                                   label="Product" />
              </Grid>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <DurationTimePicker
                  fullWidth
                  label="Ideal Cycle Time"
                  value={formData.idealCycleTime}
                  onChange={(duration) => handleInputChange('idealCycleTime', duration)}
                  precision="hours-minutes-seconds"
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <DurationTimePicker
                  fullWidth
                  label="Downtime Threshold"
                  value={formData.downtimeThreshold}
                  onChange={(duration) => handleInputChange('downtimeThreshold', duration)}
                  precision="hours-minutes-seconds"
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <DurationTimePicker
                  fullWidth
                  label="SpeedLoss Threshold"
                  value={formData.speedLossThreshold}
                  onChange={(duration) => handleInputChange('speedLossThreshold', duration)}
                  precision="hours-minutes-seconds"

                />
              </Stack>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Quantity Per Cycle"
                  value={formData.quantityPerCycle}
                  onChange={(e) => handleInputChange('quantityPerCycle', e.target.value)}
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

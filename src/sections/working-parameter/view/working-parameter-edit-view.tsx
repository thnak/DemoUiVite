import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { updateWorkingParameter } from '../../../api';
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
    idealCycleTime: string | null;
    downtimeThreshold: string | null;
    speedLossThreshold: string | null;
    quantityPerCycle: string | null;
  };
}
const getDefaultForm = (
  wp?: WorkingParameterCreateEditViewProps['currentWorkingParameter']
): WorkingFormData => ({
  machine: wp?.machine ?? '',
  product: wp?.product ?? '',
  idealCycleTime: wp?.idealCycleTime ?? '',
  downtimeThreshold: wp?.downtimeThreshold ?? '',
  speedLossThreshold: wp?.speedLossThreshold ?? '',
  quantityPerCycle: wp?.quantityPerCycle ?? '1',
});

export function WorkingParameterCreateEditView({
  isEdit = false,
  currentWorkingParameter,
}: WorkingParameterCreateEditViewProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<WorkingFormData>(() =>
    getDefaultForm(currentWorkingParameter)
  );
  useEffect(() => {
    if (!isEdit) return;

    setFormData(getDefaultForm(currentWorkingParameter));
    // Form initialization effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentWorkingParameter?.id]);
  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);
  const handleInputChange = useCallback((field: keyof WorkingFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

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
    if (!formData.machine) {
      setErrorMessage('machine is required');
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

    try {
      if (isEdit && currentWorkingParameter?.id) {
        await updateWorkingParameter(currentWorkingParameter.id, [
          { key: 'machineId', value: formData.machine },
          { key: 'productId', value: formData.product },
          { key: 'idealCycleTime', value: formData.idealCycleTime },
          { key: 'quantityPerCycle', value: toNumberOrUndefined(formData.quantityPerCycle) },
          { key: 'downtimeThreshold', value: formData.downtimeThreshold },
          { key: 'speedLossThreshold', value: formData.speedLossThreshold },
        ]);
      }

      router.push('/working-parameter');
    } catch (e: any) {
      setErrorMessage(e?.message ?? 'Something went wrong');
    }
  }, [
    formData.machine,
    formData.product,
    formData.quantityPerCycle,
    formData.downtimeThreshold,
    formData.idealCycleTime,
    formData.speedLossThreshold,
    isEdit,
    currentWorkingParameter?.id,
    router,
  ]);

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
                <MachineSelector
                  value={formData.machine}
                  onChange={handleMachineChange}
                  label="Machine"
                  disabled={isEdit}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <ProductSelector
                  value={formData.product}
                  onChange={handleProductChange}
                  label="Product"
                  disabled={isEdit}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <DurationTimePicker
                  fullWidth
                  label="Ideal Cycle Time"
                  value={formData.idealCycleTime}
                  onChange={(duration) => handleInputChange('idealCycleTime', duration)}
                  precision="seconds"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <DurationTimePicker
                  fullWidth
                  label="SpeedLoss Threshold"
                  value={formData.speedLossThreshold}
                  onChange={(duration) => handleInputChange('speedLossThreshold', duration)}
                  precision="seconds"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <DurationTimePicker
                  fullWidth
                  label="Downtime Threshold"
                  value={formData.downtimeThreshold}
                  onChange={(duration) => handleInputChange('downtimeThreshold', duration)}
                  precision="seconds"
                />
              </Grid>

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
              <Button variant="contained" color="inherit" onClick={handleSubmit}>
                {isEdit ? 'Save changes' : 'Create parameter'}
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

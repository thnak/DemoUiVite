import React, { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@mui/material/Snackbar';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from '../../../components/iconify';
import { Scrollbar } from '../../../components/scrollbar';
import { ProductSelector } from '../../../components/selectors';
import { DurationTimePicker } from '../../../components/duration-time-picker';
import { ConfirmDeleteDialog } from '../../../components/confirm-delete-dialog';
import {
  deleteWorkingParameter,
  getapiProductproductIdmappedmachines,
  postapiWorkingParametercreatedworkingparameters,
  postapiWorkingParameterproductIdcreateupfrommappedproducts,
} from '../../../api';

import type { ObjectId, GetCreatedWorkingParaResult, GetMappedMachineByProductIdResult } from '../../../api/types/generated';

// ----------------------------------------------------------------------

interface WorkingParameterFormData {
  idealCycleTime: string;
  downtimeThreshold: string;
  speedLossThreshold: string;
  quantityPerCycle: number;
}

export function WorkingParameterCreateView() {
  const router = useRouter();
  const [productId, setProductId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mappedMachines, setMappedMachines] = useState<GetMappedMachineByProductIdResult[]>([]);
  const [createdParameters, setCreatedParameters] = useState<GetCreatedWorkingParaResult[]>([]);
  const [selectedMachineIds, setSelectedMachineIds] = useState<string[]>([]);
  const [machineSearch, setMachineSearch] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState<WorkingParameterFormData>({
    idealCycleTime: 'PT30S',
    downtimeThreshold: 'PT1M',
    speedLossThreshold: 'PT45S',
    quantityPerCycle: 1,
  });

  // Fetch mapped machines when product is selected
  useEffect(() => {
    if (productId) {
      fetchMappedMachines();
      fetchCreatedParameters();
    } else {
      setMappedMachines([]);
      setCreatedParameters([]);
      setSelectedMachineIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchMappedMachines = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const machines = await getapiProductproductIdmappedmachines(productId as ObjectId, {
        search: machineSearch || undefined,
      });
      setMappedMachines(machines || []);
    } catch (err) {
      console.error('Error fetching mapped machines:', err);
      setErrorMessage('Failed to load mapped machines');
    } finally {
      setLoading(false);
    }
  };

  const fetchCreatedParameters = useCallback(async () => {
    if (!productId) return;
    try {
      const response = await postapiWorkingParametercreatedworkingparameters({
        pageNumber: 0,
        pageSize: 1000,
        search: null,
        productCategories: [productId as ObjectId],
      });
      setCreatedParameters(response.items || []);
    } catch (fetchErr) {
      console.error('Error fetching created parameters:', fetchErr);
    }
  }, [productId]);

  useEffect(() => {
    if (productId && machineSearch !== undefined) {
      const timer = setTimeout(() => {
        fetchMappedMachines();
      }, 300);
      return () => clearTimeout(timer);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machineSearch]);

  const handleSelectAllMachines = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedMachineIds(mappedMachines.map((m) => m.machineId?.toString() || ''));
      } else {
        setSelectedMachineIds([]);
      }
    },
    [mappedMachines]
  );

  const handleSelectMachine = useCallback((machineId: string) => {
    setSelectedMachineIds((prev) =>
      prev.includes(machineId) ? prev.filter((id) => id !== machineId) : [...prev, machineId]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!productId) {
      setErrorMessage('Please select a product');
      return;
    }

    if (selectedMachineIds.length === 0) {
      setErrorMessage('Please select at least one machine');
      return;
    }

    setLoading(true);
    try {
      await postapiWorkingParameterproductIdcreateupfrommappedproducts(productId as ObjectId, {
        machineIds: selectedMachineIds as ObjectId[],
        idealCycleTime: formData.idealCycleTime,
        downtimeThreshold: formData.downtimeThreshold,
        speedLossThreshold: formData.speedLossThreshold,
        quantityPerCycle: formData.quantityPerCycle,
      });

      setSuccessMessage('Working parameters created successfully');
      setSelectedMachineIds([]);
      // Refresh created parameters
      await fetchCreatedParameters();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to create working parameters');
    } finally {
      setLoading(false);
    }
  }, [productId, selectedMachineIds, formData, fetchCreatedParameters]);

  const handleDeleteParameter = useCallback((id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await deleteWorkingParameter(itemToDelete);
      setSuccessMessage('Working parameter deleted successfully');
      await fetchCreatedParameters();
    } catch (deleteErr) {
      console.error('Error deleting working parameter:', deleteErr);
      setErrorMessage('Failed to delete working parameter');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  }, [itemToDelete, fetchCreatedParameters]);

  const handleCancel = useCallback(() => {
    router.push('/working-parameter');
  }, [router]);

  const filteredMachines = mappedMachines;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Create Working Parameters
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Working Parameter
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            Create
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Select Product
            </Typography>
            <ProductSelector
              value={productId}
              onChange={setProductId}
              label="Product"
              required
            />
          </Card>
        </Grid>

        {productId && (
          <>
            <Grid size={{ xs: 12 }}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Working Parameter Settings
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <DurationTimePicker
                      fullWidth
                      label="Ideal Cycle Time"
                      value={formData.idealCycleTime}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, idealCycleTime: value }))
                      }
                      precision="seconds"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Quantity Per Cycle"
                      value={formData.quantityPerCycle}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          quantityPerCycle: Number(e.target.value),
                        }))
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <DurationTimePicker
                      fullWidth
                      label="Downtime Threshold"
                      value={formData.downtimeThreshold}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, downtimeThreshold: value }))
                      }
                      precision="seconds"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <DurationTimePicker
                      fullWidth
                      label="Speed Loss Threshold"
                      value={formData.speedLossThreshold}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, speedLossThreshold: value }))
                      }
                      precision="seconds"
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Card sx={{ p: 3 }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Select Machines</Typography>
                  <TextField
                    size="small"
                    placeholder="Search machines..."
                    value={machineSearch}
                    onChange={(e) => setMachineSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="eva:search-fill" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ width: 300 }}
                  />
                </Box>
                <Scrollbar>
                  <TableContainer sx={{ overflow: 'unset', maxHeight: 400 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={
                                mappedMachines.length > 0 &&
                                selectedMachineIds.length === mappedMachines.length
                              }
                              indeterminate={
                                selectedMachineIds.length > 0 &&
                                selectedMachineIds.length < mappedMachines.length
                              }
                              onChange={(e) => handleSelectAllMachines(e.target.checked)}
                            />
                          </TableCell>
                          <TableCell>Machine Name</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={2} align="center">
                              <CircularProgress size={24} />
                            </TableCell>
                          </TableRow>
                        ) : filteredMachines.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={2} align="center">
                              No mapped machines found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredMachines.map((machine) => {
                            const machineId = machine.machineId?.toString() || '';
                            return (
                              <TableRow
                                key={machineId}
                                hover
                                onClick={() => handleSelectMachine(machineId)}
                                sx={{ cursor: 'pointer' }}
                              >
                                <TableCell padding="checkbox">
                                  <Checkbox checked={selectedMachineIds.includes(machineId)} />
                                </TableCell>
                                <TableCell>{machine.machineName}</TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {selectedMachineIds.length} machine(s) selected
                  </Typography>
                  <Button
                    variant="contained"
                    disabled={loading || selectedMachineIds.length === 0}
                    onClick={handleSubmit}
                  >
                    Create Parameters
                  </Button>
                </Box>
              </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Created Working Parameters
                </Typography>
                <Scrollbar>
                  <TableContainer sx={{ overflow: 'unset' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Machine Name</TableCell>
                          <TableCell>Ideal Cycle Time</TableCell>
                          <TableCell>Quantity Per Cycle</TableCell>
                          <TableCell>Downtime Threshold</TableCell>
                          <TableCell>Speed Loss Threshold</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {createdParameters.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} align="center">
                              No working parameters created yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          createdParameters.map((param) => (
                            <TableRow key={param.workingParameterId?.toString()}>
                              <TableCell>{param.machineName}</TableCell>
                              <TableCell>{param.idealCycleTime}</TableCell>
                              <TableCell>{param.quantityPerCycle}</TableCell>
                              <TableCell>{param.downtimeThreshold}</TableCell>
                              <TableCell>{param.speedLossThreshold}</TableCell>
                              <TableCell align="right">
                                <IconButton
                                  color="error"
                                  onClick={() =>
                                    handleDeleteParameter(param.workingParameterId?.toString() || '')
                                  }
                                >
                                  <Iconify icon="solar:trash-bin-trash-bold" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
              </Card>
            </Grid>
          </>
        )}

        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" color="inherit" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </Grid>
      </Grid>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        entityName="working parameter"
        loading={isDeleting}
      />

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setErrorMessage(null)} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}

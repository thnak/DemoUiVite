import React, { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
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
import { DurationTimePicker } from '../../../components/duration-time-picker';
import { ConfirmDeleteDialog } from '../../../components/confirm-delete-dialog';
import { MachineSelector, ProductSelector } from '../../../components/selectors';
import {
  deleteWorkingParameter,
  getapiMachinemachineIdproductsmapped,
  getapiProductproductIdmappedmachines,
  getapiWorkingParameterbymachinemachineId,
  getapiWorkingParameterbyproductproductId,
  postapiWorkingParametermachineIdcreateupfrommappedmachines,
  postapiWorkingParameterproductIdcreateupfrommappedproducts,
} from '../../../api';

import type {
  ObjectId,
  GetWorkingParaByMachineIdResult,
  GetWorkingParaByProductIdResult,
  GetMappedMachineByProductIdResult,
  GetAvailableProductByMachineIdResult,
} from '../../../api/types/generated';

// ----------------------------------------------------------------------

interface WorkingParameterFormData {
  idealCycleTime: string;
  downtimeThreshold: string;
  speedLossThreshold: string;
  quantityPerCycle: number;
}

export function WorkingParameterCreateView() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);

  // Product-centric states
  const [productId, setProductId] = useState<string | null>(null);
  const [mappedMachines, setMappedMachines] = useState<GetMappedMachineByProductIdResult[]>([]);
  const [createdProductParameters, setCreatedProductParameters] = useState<
    GetWorkingParaByProductIdResult[]
  >([]);
  const [selectedMachineIds, setSelectedMachineIds] = useState<string[]>([]);
  const [machineSearch, setMachineSearch] = useState('');
  const [productParamsSearch, setProductParamsSearch] = useState('');

  // Machine-centric states
  const [machineId, setMachineId] = useState<string | null>(null);
  const [mappedProducts, setMappedProducts] = useState<GetAvailableProductByMachineIdResult[]>([]);
  const [createdMachineParameters, setCreatedMachineParameters] = useState<
    GetWorkingParaByMachineIdResult[]
  >([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [machineParamsSearch, setMachineParamsSearch] = useState('');

  // Common states
  const [loading, setLoading] = useState(false);
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

  // Fetch mapped machines when product is selected (Product Tab)
  useEffect(() => {
    if (tabValue === 0 && productId) {
      fetchMappedMachines();
      fetchCreatedProductParameters();
    } else if (tabValue === 0) {
      setMappedMachines([]);
      setCreatedProductParameters([]);
      setSelectedMachineIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, tabValue]);

  // Fetch mapped products when machine is selected (Machine Tab)
  useEffect(() => {
    if (tabValue === 1 && machineId) {
      fetchMappedProducts();
      fetchCreatedMachineParameters();
    } else if (tabValue === 1) {
      setMappedProducts([]);
      setCreatedMachineParameters([]);
      setSelectedProductIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machineId, tabValue]);

  const fetchMappedMachines = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const response = await getapiProductproductIdmappedmachines(productId as ObjectId, {
        search: machineSearch || undefined,
      });
      setMappedMachines(response?.items || []);
    } catch (err) {
      console.error('Error fetching mapped machines:', err);
      setErrorMessage('Failed to load mapped machines');
    } finally {
      setLoading(false);
    }
  };

  const fetchMappedProducts = async () => {
    if (!machineId) return;
    setLoading(true);
    try {
      const response = await getapiMachinemachineIdproductsmapped(machineId as ObjectId, {
        search: productSearch || undefined,
      });
      setMappedProducts(response.items || []);
    } catch (err) {
      console.error('Error fetching mapped products:', err);
      setErrorMessage('Failed to load mapped products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCreatedProductParameters = useCallback(async () => {
    if (!productId) return;
    try {
      const params = await getapiWorkingParameterbyproductproductId(productId as ObjectId, {
        search: productParamsSearch || undefined,
      });
      setCreatedProductParameters(params || []);
    } catch (fetchErr) {
      console.error('Error fetching created product parameters:', fetchErr);
    }
  }, [productId, productParamsSearch]);

  const fetchCreatedMachineParameters = useCallback(async () => {
    if (!machineId) return;
    try {
      const params = await getapiWorkingParameterbymachinemachineId(machineId as ObjectId, {
        search: machineParamsSearch || undefined,
      });
      setCreatedMachineParameters(params || []);
    } catch (fetchErr) {
      console.error('Error fetching created machine parameters:', fetchErr);
    }
  }, [machineId, machineParamsSearch]);

  // Debounced search for mapped machines (Product Tab)
  useEffect(() => {
    if (tabValue === 0 && productId && machineSearch !== undefined) {
      const timer = setTimeout(() => {
        fetchMappedMachines();
      }, 300);
      return () => clearTimeout(timer);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machineSearch]);

  // Debounced search for mapped products (Machine Tab)
  useEffect(() => {
    if (tabValue === 1 && machineId && productSearch !== undefined) {
      const timer = setTimeout(() => {
        fetchMappedProducts();
      }, 300);
      return () => clearTimeout(timer);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSearch]);

  // Debounced search for created product parameters
  useEffect(() => {
    if (tabValue === 0 && productId) {
      const timer = setTimeout(() => {
        fetchCreatedProductParameters();
      }, 300);
      return () => clearTimeout(timer);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productParamsSearch, productId]);

  // Debounced search for created machine parameters
  useEffect(() => {
    if (tabValue === 1 && machineId) {
      const timer = setTimeout(() => {
        fetchCreatedMachineParameters();
      }, 300);
      return () => clearTimeout(timer);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machineParamsSearch, machineId]);

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

  const handleSelectMachine = useCallback((machineIdValue: string) => {
    setSelectedMachineIds((prev) =>
      prev.includes(machineIdValue)
        ? prev.filter((id) => id !== machineIdValue)
        : [...prev, machineIdValue]
    );
  }, []);

  const handleSelectAllProducts = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedProductIds(mappedProducts.map((p) => p.productId?.toString() || ''));
      } else {
        setSelectedProductIds([]);
      }
    },
    [mappedProducts]
  );

  const handleSelectProduct = useCallback((productIdValue: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productIdValue)
        ? prev.filter((id) => id !== productIdValue)
        : [...prev, productIdValue]
    );
  }, []);

  const handleSubmitProduct = useCallback(async () => {
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
      await fetchCreatedProductParameters();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to create working parameters');
    } finally {
      setLoading(false);
    }
  }, [productId, selectedMachineIds, formData, fetchCreatedProductParameters]);

  const handleSubmitMachine = useCallback(async () => {
    if (!machineId) {
      setErrorMessage('Please select a machine');
      return;
    }

    if (selectedProductIds.length === 0) {
      setErrorMessage('Please select at least one product');
      return;
    }

    setLoading(true);
    try {
      await postapiWorkingParametermachineIdcreateupfrommappedmachines(machineId as ObjectId, {
        productIds: selectedProductIds as ObjectId[],
        idealCycleTime: formData.idealCycleTime,
        downtimeThreshold: formData.downtimeThreshold,
        speedLossThreshold: formData.speedLossThreshold,
        quantityPerCycle: formData.quantityPerCycle,
      });

      setSuccessMessage('Working parameters created successfully');
      setSelectedProductIds([]);
      // Refresh created parameters
      await fetchCreatedMachineParameters();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to create working parameters');
    } finally {
      setLoading(false);
    }
  }, [machineId, selectedProductIds, formData, fetchCreatedMachineParameters]);

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
      // Refresh appropriate parameters based on active tab
      if (tabValue === 0) {
        await fetchCreatedProductParameters();
      } else {
        await fetchCreatedMachineParameters();
      }
    } catch (deleteErr) {
      console.error('Error deleting working parameter:', deleteErr);
      setErrorMessage('Failed to delete working parameter');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  }, [itemToDelete, tabValue, fetchCreatedProductParameters, fetchCreatedMachineParameters]);

  const handleCancel = useCallback(() => {
    router.push('/working-parameter');
  }, [router]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            px: 3,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Tab
            label="By Product"
            icon={<Iconify icon="solar:list-bold-duotone" width={24} />}
            iconPosition="start"
          />
          <Tab
            label="By Machine"
            icon={<Iconify icon="solar:settings-bold-duotone" width={24} />}
            iconPosition="start"
          />
        </Tabs>
      </Card>
      {/* Product Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Select Product
              </Typography>
              <ProductSelector value={productId} onChange={setProductId} label="Product" required />
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
                  <Box
                    sx={{
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6">Select Machines</Typography>
                    <TextField
                      size="small"
                      placeholder="Search machines..."
                      value={machineSearch}
                      onChange={(e) => setMachineSearch(e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon="eva:search-fill" />
                            </InputAdornment>
                          ),
                        },
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
                              const machineIdVal = machine.machineId?.toString() || '';
                              return (
                                <TableRow
                                  key={machineIdVal}
                                  hover
                                  onClick={() => handleSelectMachine(machineIdVal)}
                                  sx={{ cursor: 'pointer' }}
                                >
                                  <TableCell padding="checkbox">
                                    <Checkbox checked={selectedMachineIds.includes(machineIdVal)} />
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
                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {selectedMachineIds.length} machine(s) selected
                    </Typography>
                    <Button
                      variant="contained"
                      disabled={loading || selectedMachineIds.length === 0}
                      onClick={handleSubmitProduct}
                    >
                      Create Parameters
                    </Button>
                  </Box>
                </Card>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Card sx={{ p: 3 }}>
                  <Box
                    sx={{
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6">Created Working Parameters</Typography>
                    <TextField
                      size="small"
                      placeholder="Search created parameters..."
                      value={productParamsSearch}
                      onChange={(e) => setProductParamsSearch(e.target.value)}
                      sx={{ width: 300 }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon="eva:search-fill" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>
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
                          {createdProductParameters.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} align="center">
                                No working parameters created yet
                              </TableCell>
                            </TableRow>
                          ) : (
                            createdProductParameters.map((param) => (
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
                                      handleDeleteParameter(
                                        param.workingParameterId?.toString() || ''
                                      )
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
        </Grid>
      )}
      {/* Machine Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Select Machine
              </Typography>
              <MachineSelector value={machineId} onChange={setMachineId} label="Machine" required />
            </Card>
          </Grid>

          {machineId && (
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
                  <Box
                    sx={{
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6">Select Products</Typography>
                    <TextField
                      size="small"
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon="eva:search-fill" />
                            </InputAdornment>
                          ),
                        },
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
                                  mappedProducts.length > 0 &&
                                  selectedProductIds.length === mappedProducts.length
                                }
                                indeterminate={
                                  selectedProductIds.length > 0 &&
                                  selectedProductIds.length < mappedProducts.length
                                }
                                onChange={(e) => handleSelectAllProducts(e.target.checked)}
                              />
                            </TableCell>
                            <TableCell>Product Name</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {loading ? (
                            <TableRow>
                              <TableCell colSpan={2} align="center">
                                <CircularProgress size={24} />
                              </TableCell>
                            </TableRow>
                          ) : mappedProducts.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={2} align="center">
                                No mapped products found
                              </TableCell>
                            </TableRow>
                          ) : (
                            mappedProducts.map((product) => {
                              const productIdValue = product.productId?.toString() || '';
                              return (
                                <TableRow
                                  key={productIdValue}
                                  hover
                                  onClick={() => handleSelectProduct(productIdValue)}
                                  sx={{ cursor: 'pointer' }}
                                >
                                  <TableCell padding="checkbox">
                                    <Checkbox
                                      checked={selectedProductIds.includes(productIdValue)}
                                    />
                                  </TableCell>
                                  <TableCell>{product.productName}</TableCell>
                                </TableRow>
                              );
                            })
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Scrollbar>
                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {selectedProductIds.length} product(s) selected
                    </Typography>
                    <Button
                      variant="contained"
                      disabled={loading || selectedProductIds.length === 0}
                      onClick={handleSubmitMachine}
                    >
                      Create Parameters
                    </Button>
                  </Box>
                </Card>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Card sx={{ p: 3 }}>
                  <Box
                    sx={{
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6">Created Working Parameters</Typography>
                    <TextField
                      size="small"
                      placeholder="Search created parameters..."
                      value={machineParamsSearch}
                      onChange={(e) => setMachineParamsSearch(e.target.value)}
                      sx={{ width: 300 }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon="eva:search-fill" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>
                  <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Ideal Cycle Time</TableCell>
                            <TableCell>Quantity Per Cycle</TableCell>
                            <TableCell>Downtime Threshold</TableCell>
                            <TableCell>Speed Loss Threshold</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {createdMachineParameters.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} align="center">
                                No working parameters created yet
                              </TableCell>
                            </TableRow>
                          ) : (
                            createdMachineParameters.map((param) => (
                              <TableRow key={param.workingParameterId?.toString()}>
                                <TableCell>{param.productName}</TableCell>
                                <TableCell>{param.idealCycleTime}</TableCell>
                                <TableCell>{param.quantityPerCycle}</TableCell>
                                <TableCell>{param.downtimeThreshold}</TableCell>
                                <TableCell>{param.speedLossThreshold}</TableCell>
                                <TableCell align="right">
                                  <IconButton
                                    color="error"
                                    onClick={() =>
                                      handleDeleteParameter(
                                        param.workingParameterId?.toString() || ''
                                      )
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
        </Grid>
      )}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" color="inherit" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
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

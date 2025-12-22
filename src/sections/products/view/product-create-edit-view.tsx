import { useState, useEffect, useCallback, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { DurationTimePicker } from 'src/components/duration-time-picker';
import { ConfirmDeleteDialog } from 'src/components/confirm-delete-dialog';

import { createProduct, updateProduct } from '../../../api';
import {
  getMachinePage,
  getapiMachinemachineIdcurrentproduct,
} from '../../../api/services/generated/machine';
import {
  deleteWorkingParameter,
  updateWorkingParameter,
  getWorkingParameterPage,
} from '../../../api/services/generated/working-parameter';

import type { MachineEntity, WorkingParameterEntity } from '../../../api/types/generated';

// ----------------------------------------------------------------------

// Constants for working parameter field keys
const WORKING_PARAM_FIELDS = {
  IDEAL_CYCLE_TIME: 'idealCycleTime',
  DOWNTIME_THRESHOLD: 'downtimeThreshold',
  SPEED_LOSS_THRESHOLD: 'speedLossThreshold',
  QUANTITY_PER_CYCLE: 'quantityPerCycle',
} as const;

// ISO 8601 duration parsing regex
const ISO_8601_DURATION_REGEX = /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;

interface ProductFormData {
  name: string;
  code: string;
  category: string;
  price: string;
  stock: string;
}

const CATEGORIES = [
  { value: 'shose', label: 'Shose' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'accessories', label: 'Accessories' },
];

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

interface ProductCreateEditViewProps {
  isEdit?: boolean;
  currentProduct?: {
    id: string;
    name: string;
    code: string;
    category: string;
    price: number;
    stock: number;
    coverUrl: string;
    publish: 'published' | 'draft';
  };
}

export function ProductCreateEditView({
  isEdit = false,
  currentProduct,
}: ProductCreateEditViewProps) {
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState<string | null>(currentProduct?.coverUrl || null);
  const [published, setPublished] = useState(currentProduct?.publish === 'published');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: currentProduct?.name || '',
    code: currentProduct?.code || '',
    category: currentProduct?.category?.toLowerCase() || '',
    price: currentProduct?.price?.toString() ?? '' ,
    stock: currentProduct?.stock?.toString() ?? '',
  });

  // Working parameters state
  const [workingParameters, setWorkingParameters] = useState<WorkingParameterEntity[]>([]);
  const [machines, setMachines] = useState<MachineEntity[]>([]);
  const [loadingParams, setLoadingParams] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentParam, setCurrentParam] = useState<WorkingParameterEntity | null>(null);
  const [paramFormData, setParamFormData] = useState<Partial<WorkingParameterEntity>>({});
  const [runningMachines, setRunningMachines] = useState<Array<{ machineId: string; machineName: string; productName: string }>>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paramToDelete, setParamToDelete] = useState<string | null>(null);
  const [deletingParam, setDeletingParam] = useState(false);

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleImageChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrorMessage('Please select a valid image file (*.jpeg, *.jpg, *.png, *.gif, *.webp)');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('File size must not exceed 3 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof ProductFormData) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: event.target.value,
        }));
      },
    []
  );

  const handleSelectChange = useCallback(
    (field: keyof ProductFormData) => (event: { target: { value: string } }) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    if (!formData.name) {
      setErrorMessage('Product name is required');
      return;
    }
    if (!formData.category) {
      setErrorMessage('Category is required');
      return;
    }
    if (!formData.price || isNaN(parseFloat(formData.price))) {
      setErrorMessage('Valid price is required');
      return;
    }
    if (!formData.stock || isNaN(parseInt(formData.stock, 10))) {
      setErrorMessage('Valid stock quantity is required');
      return;
    }
    const price = Number(formData.price);
    const stock = Number(formData.stock);

    if (!Number.isFinite(price) || price < 0) {
      setErrorMessage('Valid price is required')
      return;
    };
    if (!Number.isFinite(stock) || stock < 0) {
      setErrorMessage('Valid stock quantity is required')
      return;
    };
    try {
      if (isEdit && currentProduct?.id) {
        await updateProduct(
          currentProduct.id,
          [
            { key: 'name', value: formData.name },
            { key: 'code', value: formData.code },
            { key: 'category', value: formData.category },
            { key: 'price', value: formData.price },
            { key: 'stock', value: formData.stock },
          ],
        );
      } else {
        await createProduct(
          {
            name: formData.name,
            code: formData.code,
            price: Number(formData.price),
            stockQuantity: Number(formData.stock),
          }

        );
      }
    router.push('/products');
  } catch (e: any) {
    setErrorMessage(e?.message ?? 'Something went wrong');
  }

    // Navigate back to list after save
  }, [formData.name, formData.category, formData.price, formData.stock, formData.code, isEdit, currentProduct?.id, router]);

  const handleCancel = useCallback(() => {
    router.push('/products');
  }, [router]);

  // Load working parameters for this product
  const loadWorkingParameters = useCallback(async () => {
    if (!isEdit || !currentProduct?.id) return;

    setLoadingParams(true);
    try {
      // Load machines first
      const machinesResponse = await getMachinePage([], { pageSize: 100 });
      const allMachines = machinesResponse.items || [];
      setMachines(allMachines);

      // Load working parameters for this product
      const paramsResponse = await getWorkingParameterPage([], { pageSize: 100 });
      
      // Filter parameters for this product
      const productParams = (paramsResponse.items || []).filter(
        (param) => param.productId === currentProduct.id
      );
      
      setWorkingParameters(productParams);

      // Check which machines are currently running this product
      const runningMachinesData: Array<{ machineId: string; machineName: string; productName: string }> = [];
      
      await Promise.all(
        allMachines.map(async (machine) => {
          try {
            if (machine.id) {
              const machineCurrentProduct = await getapiMachinemachineIdcurrentproduct(machine.id);
              if (machineCurrentProduct && machineCurrentProduct.productId === currentProduct.id) {
                runningMachinesData.push({
                  machineId: machine.id,
                  machineName: machine.name || 'Unknown',
                  productName: machineCurrentProduct.productName || 'Unknown',
                });
              }
            }
          } catch (err) {
            // Ignore errors for machines that don't have a current product
            console.debug(`Machine ${machine.id} has no current product`, err);
          }
        })
      );

      setRunningMachines(runningMachinesData);
    } catch (error) {
      console.error('Failed to load working parameters:', error);
    } finally {
      setLoadingParams(false);
    }
  }, [isEdit, currentProduct?.id]);

  useEffect(() => {
    if (isEdit && currentProduct?.id) {
      loadWorkingParameters();
    }
  }, [isEdit, currentProduct?.id, loadWorkingParameters]);

  // Helper function to format duration in seconds
  const formatDurationInSeconds = (duration: string | undefined | null) => {
    if (!duration) return 'N/A';
    
    const match = duration.match(ISO_8601_DURATION_REGEX);
    if (!match) return duration;
    
    const days = match[1] ? parseInt(match[1], 10) : 0;
    const hours = match[2] ? parseInt(match[2], 10) : 0;
    const minutes = match[3] ? parseInt(match[3], 10) : 0;
    const seconds = match[4] ? parseInt(match[4], 10) : 0;
    
    const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
    
    return `${totalSeconds}s`;
  };

  // Get machine name by ID
  const getMachineName = (machineId: string | undefined) => {
    if (!machineId) return 'N/A';
    const machine = machines.find((m) => m.id === machineId);
    return machine?.name || machineId;
  };

  // Handle edit working parameter
  const handleEditParam = (param: WorkingParameterEntity) => {
    setCurrentParam(param);
    setParamFormData({
      idealCycleTime: param.idealCycleTime,
      downtimeThreshold: param.downtimeThreshold,
      speedLossThreshold: param.speedLossThreshold,
      quantityPerCycle: param.quantityPerCycle,
    });
    setEditDialogOpen(true);
  };

  // Handle save working parameter
  const handleSaveParam = async () => {
    if (!currentParam?.id) return;

    try {
      await updateWorkingParameter(currentParam.id, [
        { key: WORKING_PARAM_FIELDS.IDEAL_CYCLE_TIME, value: paramFormData.idealCycleTime },
        { key: WORKING_PARAM_FIELDS.DOWNTIME_THRESHOLD, value: paramFormData.downtimeThreshold },
        { key: WORKING_PARAM_FIELDS.SPEED_LOSS_THRESHOLD, value: paramFormData.speedLossThreshold },
        { key: WORKING_PARAM_FIELDS.QUANTITY_PER_CYCLE, value: paramFormData.quantityPerCycle },
      ]);

      // Reload working parameters
      await loadWorkingParameters();
      setEditDialogOpen(false);
      setCurrentParam(null);
      setParamFormData({});
    } catch (error: any) {
      setErrorMessage(error?.message ?? 'Failed to update working parameter');
    }
  };

  // Handle open delete dialog
  const handleOpenDeleteDialog = (paramId: string) => {
    setParamToDelete(paramId);
    setDeleteDialogOpen(true);
  };

  // Handle close delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setParamToDelete(null);
  };

  // Handle confirm delete working parameter
  const handleConfirmDelete = async () => {
    if (!paramToDelete) return;

    setDeletingParam(true);
    try {
      await deleteWorkingParameter(paramToDelete);
      await loadWorkingParameters();
      handleCloseDeleteDialog();
    } catch (error: any) {
      setErrorMessage(error?.message ?? 'Failed to delete working parameter');
    } finally {
      setDeletingParam(false);
    }
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {isEdit ? 'Edit product' : 'Create a new product'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Product
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
        {/* Left Section - Image Upload & Publish */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            <Stack alignItems="center" sx={{ mb: 3 }}>
              <Box
                sx={{
                  position: 'relative',
                  width: 200,
                  height: 200,
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  '&:hover': {
                    opacity: 0.72,
                  },
                }}
                component="label"
              >
                {imageUrl ? (
                  <Avatar
                    src={imageUrl}
                    alt="Product"
                    variant="rounded"
                    sx={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <Stack alignItems="center" spacing={0.5}>
                    <Iconify icon="mingcute:add-line" width={24} sx={{ color: 'text.secondary' }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Upload image
                    </Typography>
                  </Stack>
                )}
                <input
                  type="file"
                  hidden
                  accept=".jpeg,.jpg,.png,.gif,.webp"
                  onChange={handleImageChange}
                />
              </Box>
            </Stack>

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                color: 'text.secondary',
                mb: 3,
              }}
            >
              Allowed *.jpeg, *.jpg, *.png, *.gif, *.webp
              <br />
              max size of 3 Mb
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Publish
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', pr: 2 }}>
                  {published ? 'Product is visible on store' : 'Product is saved as draft'}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      color="success"
                    />
                  }
                  label=""
                  sx={{ m: 0 }}
                />
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Right Section - Product Info Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Product name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Code"
                  value={formData.code}
                  onChange={handleInputChange('code')}
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    label="Category"
                    onChange={handleSelectChange('category')}
                  >
                    {CATEGORIES.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Stock"
                  value={formData.stock}
                  onChange={handleInputChange('stock')}
                  slotProps={{
                    input: {
                      inputProps: { min: 0 },
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Price"
                  value={formData.price}
                  onChange={handleInputChange('price')}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      inputProps: { min: 0, step: 0.01 },
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Working Parameters Section - Only show in edit mode */}
            {isEdit && currentProduct?.id && (
              <Card sx={{ p: 3, mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6">
                    Working Parameters
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Configure parameters for different machines
                  </Typography>
                </Box>

                {loadingParams ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : workingParameters.length === 0 ? (
                  <Alert severity="info">
                    No working parameters configured for this product yet. Configure them from the Working Parameters page.
                  </Alert>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Machine</TableCell>
                          <TableCell>Ideal Cycle Time</TableCell>
                          <TableCell>Downtime Threshold</TableCell>
                          <TableCell>Speed Loss Threshold</TableCell>
                          <TableCell>Quantity Per Cycle</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {workingParameters.map((param) => (
                          <TableRow key={param.id}>
                            <TableCell>{getMachineName(param.machineId)}</TableCell>
                            <TableCell>{formatDurationInSeconds(param.idealCycleTime)}</TableCell>
                            <TableCell>{formatDurationInSeconds(param.downtimeThreshold)}</TableCell>
                            <TableCell>{formatDurationInSeconds(param.speedLossThreshold)}</TableCell>
                            <TableCell>{param.quantityPerCycle ?? 'N/A'}</TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={() => handleEditParam(param)}
                                sx={{ mr: 1 }}
                              >
                                <Iconify icon="solar:pen-bold" width={20} />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  if (param.id) {
                                    handleOpenDeleteDialog(param.id);
                                  }
                                }}
                              >
                                <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Card>
            )}

            {/* Currently Running Machines Section - Only show in edit mode */}
            {isEdit && currentProduct?.id && (
              <Card sx={{ p: 3, mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6">
                    Currently Running Machines
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Machines currently running this product
                  </Typography>
                </Box>

                {loadingParams ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : runningMachines.length === 0 ? (
                  <Alert severity="info">
                    This product is not currently running on any machine.
                  </Alert>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Machine</TableCell>
                          <TableCell>Product</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {runningMachines.map((machine) => (
                          <TableRow key={machine.machineId}>
                            <TableCell>{machine.machineName}</TableCell>
                            <TableCell>{machine.productName}</TableCell>
                            <TableCell>
                              <Chip 
                                label="Running" 
                                color="success" 
                                size="small" 
                                icon={<Iconify icon="solar:play-circle-bold" />}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Card>
            )}

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

      {/* Edit Working Parameter Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Working Parameter</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <DurationTimePicker
              fullWidth
              label="Ideal Cycle Time"
              value={paramFormData.idealCycleTime || ''}
              onChange={(value) => setParamFormData((prev) => ({ ...prev, idealCycleTime: value }))}
              precision="seconds"
            />
            
            <DurationTimePicker
              fullWidth
              label="Downtime Threshold"
              value={paramFormData.downtimeThreshold || ''}
              onChange={(value) => setParamFormData((prev) => ({ ...prev, downtimeThreshold: value }))}
              precision="seconds"
            />
            
            <DurationTimePicker
              fullWidth
              label="Speed Loss Threshold"
              value={paramFormData.speedLossThreshold || ''}
              onChange={(value) => setParamFormData((prev) => ({ ...prev, speedLossThreshold: value }))}
              precision="seconds"
            />
            
            <TextField
              fullWidth
              type="number"
              label="Quantity Per Cycle"
              value={paramFormData.quantityPerCycle ?? ''}
              onChange={(e) => setParamFormData((prev) => ({ 
                ...prev, 
                quantityPerCycle: e.target.value ? Number(e.target.value) : undefined 
              }))}
              slotProps={{
                input: {
                  inputProps: { min: 0, step: 1 },
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveParam} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        entityName="working parameter"
        loading={deletingParam}
      />
    </DashboardContent>
  );
}

import type {
  WorkingParameterEntity,
  ProductWorkingStateByMachine,
} from 'src/api/types/generated';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Stack, Collapse, Snackbar, CircularProgress } from '@mui/material';

import { apiConfig } from 'src/api/config';
import { DashboardContent } from 'src/layouts/dashboard';
import { STANDARD_ROWS_PER_PAGE_OPTIONS } from 'src/constants/table';
import {
  getapiMachinemachineIdcurrentproduct,
  postapiMachinemachineIdchangeproduct,
  getapiMachinemachineIdavailableproducts,
} from 'src/api/services/generated/machine';

import { Iconify } from 'src/components/iconify';
import { DurationTimePicker } from 'src/components/duration-time-picker';

import { useMachineSelector } from 'src/sections/oi/context';
import { MachineSelectorCard } from 'src/sections/oi/components';

// ----------------------------------------------------------------------

export function ChangeProductView() {
  const { t } = useTranslation();
  const { selectedMachine } = useMachineSelector();
  const [availableProducts, setAvailableProducts] = useState<ProductWorkingStateByMachine[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProductDto, setSelectedProductDto] = useState<ProductWorkingStateByMachine | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [editedSpecs, setEditedSpecs] = useState<WorkingParameterEntity | null>(null);
  const [plannedQuantity, setPlannedQuantity] = useState<number | undefined>(undefined);
  const [currentProduct, setCurrentProduct] = useState<ProductWorkingStateByMachine | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const loadAvailableProducts = async () => {
    if (!selectedMachine?.id) return;

    setLoading(true);
    try {
      const params = {
        page: page + 1, // API uses 1-based pagination
        pageSize: rowsPerPage,
        searchTerm: searchTerm || undefined,
      };

      const [productsResponse, currentProductData] = await Promise.all([
        getapiMachinemachineIdavailableproducts(selectedMachine.id, params),
        getapiMachinemachineIdcurrentproduct(selectedMachine.id).catch(() => null),
      ]);
      
      setAvailableProducts(productsResponse.items || []);
      setTotalItems(productsResponse.totalItems || 0);
      setCurrentProduct(currentProductData);
    } catch (error) {
      console.error('Failed to load available products:', error);
      setAvailableProducts([]);
      setTotalItems(0);
      setCurrentProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailableProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMachine, page, rowsPerPage, searchTerm]);

  const handleToggleSpecs = (productId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleSelectProduct = (productDto: ProductWorkingStateByMachine) => {
    setSelectedProductDto(productDto);
    // Map ProductWorkingStateByMachine to WorkingParameterEntity format
    const workingParams: WorkingParameterEntity = {
      idealCycleTime: productDto.idealCycleTime,
      downtimeThreshold: productDto.downtimeThreshold,
      speedLossThreshold: productDto.speedLossThreshold,
      quantityPerCycle: productDto.quantityPerCycle,
    };
    setEditedSpecs(workingParams);
    // Initialize plannedQuantity (can be empty for user to fill in)
    setPlannedQuantity(undefined);
    setConfirmDialogOpen(true);
  };

  const handleSpecChange = (field: keyof WorkingParameterEntity, value: any) => {
    setEditedSpecs((prev) => ({
      ...prev,
      [field]: value,
    } as WorkingParameterEntity));
  };

  const handleConfirmChange = async () => {
    if (!selectedMachine?.id || !selectedProductDto?.productId) return;

    const isSameProduct = currentProduct?.productId === selectedProductDto.productId;

    setSubmitting(true);
    try {
      await postapiMachinemachineIdchangeproduct(selectedMachine.id, {
        productId: selectedProductDto.productId,
        plannedQuantity,
        idealCycleTime: editedSpecs?.idealCycleTime,
        downtimeThreshold: editedSpecs?.downtimeThreshold,
        speedLossThreshold: editedSpecs?.speedLossThreshold,
        quantityPerSignal: editedSpecs?.quantityPerCycle,
      });

      // Show success message
      setSnackbar({
        open: true,
        message: isSameProduct ? t('oi.successSpecsUpdated') : t('oi.successProductChanged'),
        severity: 'success',
      });

      // Reload products to get updated data
      await loadAvailableProducts();

      setConfirmDialogOpen(false);
      setSelectedProductDto(null);
      setEditedSpecs(null);
      setPlannedQuantity(undefined);
    } catch (error) {
      console.error('Failed to change product:', error);
      setSnackbar({
        open: true,
        message: t('oi.errorProductChange'),
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelChange = () => {
    setConfirmDialogOpen(false);
    setSelectedProductDto(null);
    setEditedSpecs(null);
    setPlannedQuantity(undefined);
  };

  const formatDurationInSeconds = (duration: string | undefined | null) => {
    if (!duration) return 'N/A';
    
    // Parse ISO 8601 duration and convert to total seconds
    const match = duration.match(/P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return duration;
    
    const days = match[1] ? parseInt(match[1], 10) : 0;
    const hours = match[2] ? parseInt(match[2], 10) : 0;
    const minutes = match[3] ? parseInt(match[3], 10) : 0;
    const seconds = match[4] ? parseInt(match[4], 10) : 0;
    
    const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
    
    return `${totalSeconds}s`;
  };

  const isSameProduct = currentProduct?.productId === selectedProductDto?.productId;

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
          {t('oi.changeProduct')}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
          {t('oi.changeProductDescription')}
        </Typography>
      </Box>

      <MachineSelectorCard />

      {!selectedMachine ? (
        <Alert severity="info" sx={{ fontSize: '1.1rem', py: 3 }}>
          {t('oi.pleaseSelectMachine')}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Machine Image (if available) */}
          {selectedMachine?.id && (
            <Grid size={{ xs: 12 }}>
              <Card sx={{ p: 2 }}>
                <Box
                  component="img"
                  src={`${apiConfig.baseUrl}/api/Machine/${selectedMachine.id}/image`}
                  alt={selectedMachine.name || 'Machine'}
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'cover',
                    borderRadius: 1,
                  }}
                  onError={(e: any) => {
                    e.target.style.display = 'none';
                  }}
                />
              </Card>
            </Grid>
          )}

          {/* Current Product */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                {t('oi.currentProduct')}
              </Typography>
              {currentProduct?.productName ? (
                <Box>
                  {/* Product Image */}
                  {currentProduct.productId && (
                    <Box
                      component="img"
                      src={`${apiConfig.baseUrl}/api/Product/${currentProduct.productId}/image`}
                      alt={currentProduct.productName}
                      sx={{
                        width: '100%',
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 1,
                        mb: 2,
                      }}
                      onError={(e: any) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  
                  <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {currentProduct.productName}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: 'text.secondary', fontSize: '1.1rem', mb: 3 }}
                  >
                    {currentProduct.productName || 'N/A'}
                  </Typography>

                  {currentProduct.idealCycleTime && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                        {t('oi.specifications')}:
                      </Typography>
                      <Stack spacing={1}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {t('oi.idealCycleTime')}:
                          </Typography>
                          <Typography variant="body2">
                            {formatDurationInSeconds(currentProduct.idealCycleTime)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {t('oi.quantityPerCycle')}:
                          </Typography>
                          <Typography variant="body2">
                            {currentProduct.quantityPerCycle || 'N/A'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 200,
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    bgcolor: 'background.neutral',
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Iconify
                      icon={'eva:cube-outline' as any}
                      sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
                    />
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                      {t('oi.noProductRunning')}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Card>
          </Grid>

          {/* Available Products Table */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                {t('oi.availableProducts')}
              </Typography>

              {/* Search Box */}
              <Box sx={{ mb: 3 }}>
                <OutlinedInput
                  fullWidth
                  size="small"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(0); // Reset to first page when searching
                  }}
                  placeholder={t('common.search') || 'Search products...'}
                  startAdornment={
                    <InputAdornment position="start">
                      <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  }
                />
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress size={48} />
                </Box>
              ) : (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ width: 48 }} />
                          <TableCell>{t('oi.productName')}</TableCell>
                          <TableCell align="right">{t('common.actions')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {availableProducts.map((productDto) => {
                          const isExpanded = expandedRows.has(productDto.productId || '');
                          const isCurrent = currentProduct?.productId === productDto.productId;

                          return (
                            <>
                              <TableRow key={productDto.productId} hover>
                                <TableCell>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleToggleSpecs(productDto.productId || '')}
                                    disabled={!productDto.idealCycleTime}
                                  >
                                    <Iconify
                                      icon={
                                        isExpanded
                                          ? 'eva:arrow-ios-downward-fill'
                                          : 'eva:arrow-ios-forward-fill'
                                      }
                                    />
                                  </IconButton>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    {productDto.productName || 'N/A'}
                                    {isCurrent && (
                                      <Box
                                        component="span"
                                        sx={{
                                          ml: 1,
                                          px: 1,
                                          py: 0.5,
                                          borderRadius: 1,
                                          bgcolor: 'primary.lighter',
                                          color: 'primary.main',
                                          fontSize: '0.75rem',
                                          fontWeight: 'bold',
                                        }}
                                      >
                                        {t('oi.current')}
                                      </Box>
                                    )}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Button
                                    variant={isCurrent ? 'outlined' : 'contained'}
                                    size="small"
                                    onClick={() => handleSelectProduct(productDto)}
                                  >
                                    {isCurrent ? t('oi.updateSpecs') : t('oi.selectProduct')}
                                  </Button>
                                </TableCell>
                              </TableRow>

                              {/* Expandable Specs Row */}
                              <TableRow>
                                <TableCell colSpan={3} sx={{ py: 0, border: 0 }}>
                                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                    <Box sx={{ p: 3, bgcolor: 'background.neutral', borderRadius: 1 }}>
                                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                                        {t('oi.specifications')}
                                      </Typography>

                                      {productDto.idealCycleTime ? (
                                        <Grid container spacing={2}>
                                          <Grid size={{ xs: 12, sm: 6 }}>
                                            <Typography variant="caption" color="text.secondary">
                                              {t('oi.idealCycleTime')}:
                                            </Typography>
                                            <Typography variant="body2">
                                              {formatDurationInSeconds(productDto.idealCycleTime)}
                                            </Typography>
                                          </Grid>
                                          <Grid size={{ xs: 12, sm: 6 }}>
                                            <Typography variant="caption" color="text.secondary">
                                              {t('oi.downtimeThreshold')}:
                                            </Typography>
                                            <Typography variant="body2">
                                              {formatDurationInSeconds(productDto.downtimeThreshold)}
                                            </Typography>
                                          </Grid>
                                          <Grid size={{ xs: 12, sm: 6 }}>
                                            <Typography variant="caption" color="text.secondary">
                                              {t('oi.speedLossThreshold')}:
                                            </Typography>
                                            <Typography variant="body2">
                                              {formatDurationInSeconds(productDto.speedLossThreshold)}
                                            </Typography>
                                          </Grid>
                                          <Grid size={{ xs: 12, sm: 6 }}>
                                            <Typography variant="caption" color="text.secondary">
                                              {t('oi.quantityPerCycle')}:
                                            </Typography>
                                            <Typography variant="body2">
                                              {productDto.quantityPerCycle || 'N/A'}
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      ) : (
                                        <Typography variant="body2" color="text.secondary">
                                          {t('oi.noSpecsAvailable')}
                                        </Typography>
                                      )}
                                    </Box>
                                  </Collapse>
                                </TableCell>
                              </TableRow>
                            </>
                          );
                        })}

                        {availableProducts.length === 0 && !loading && (
                          <TableRow>
                            <TableCell colSpan={3} align="center">
                              <Box sx={{ py: 4 }}>
                                <Typography variant="body1" color="text.secondary">
                                  {searchTerm ? t('common.noResultsFound') : t('oi.noProductsFound')}
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Pagination */}
                  {totalItems > 0 && (
                    <TablePagination
                      component="div"
                      page={page}
                      count={totalItems}
                      rowsPerPage={rowsPerPage}
                      onPageChange={(event, newPage) => setPage(newPage)}
                      rowsPerPageOptions={[...STANDARD_ROWS_PER_PAGE_OPTIONS]}
                      onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
                      }}
                    />
                  )}
                </>
              )}
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Confirmation Dialog with Spec Editing */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelChange}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {isSameProduct ? t('oi.sameProductSelected') : t('oi.confirmProductChange')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            {isSameProduct ? (
              <Alert severity="info" sx={{ mb: 3 }}>
                {t('oi.sameProductMessage')}
              </Alert>
            ) : (
              <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
                {t('oi.confirmProductChangeMessage')}
              </Typography>
            )}

            {!isSameProduct && (
              <Box sx={{ bgcolor: 'background.neutral', p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  {t('oi.from')}:
                </Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {currentProduct?.productName || t('oi.noProductRunning')}
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  {t('oi.to')}:
                </Typography>
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  {selectedProductDto?.productName}
                </Typography>
              </Box>
            )}

            {/* Editable Specifications */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('oi.editSpecs')}
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label={t('oi.plannedQuantity')}
                  type="number"
                  value={plannedQuantity ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPlannedQuantity(value === '' ? undefined : parseFloat(value));
                  }}
                  fullWidth
                  inputProps={{ min: 0, step: 1 }}
                  helperText={t('oi.plannedQuantityHelperText') || 'Target quantity for this production run'}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label={t('oi.quantityPerCycle')}
                  type="number"
                  value={editedSpecs?.quantityPerCycle ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleSpecChange(
                      'quantityPerCycle',
                      value === '' ? undefined : parseFloat(value)
                    );
                  }}
                  fullWidth
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DurationTimePicker
                  label={t('oi.idealCycleTime')}
                  value={editedSpecs?.idealCycleTime || ''}
                  onChange={(value) => handleSpecChange('idealCycleTime', value)}
                  precision="seconds"
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DurationTimePicker
                  label={t('oi.downtimeThreshold')}
                  value={editedSpecs?.downtimeThreshold || ''}
                  onChange={(value) => handleSpecChange('downtimeThreshold', value)}
                  precision="seconds"
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DurationTimePicker
                  label={t('oi.speedLossThreshold')}
                  value={editedSpecs?.speedLossThreshold || ''}
                  onChange={(value) => handleSpecChange('speedLossThreshold', value)}
                  precision="seconds"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleCancelChange}
            size="large"
            variant="outlined"
            disabled={submitting}
            sx={{
              minHeight: 64,
                          minWidth: 140,
              fontSize: '1.2rem',
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleConfirmChange}
            size="large"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{
              minHeight: 64,
              minWidth: 140,
              fontSize: '1.2rem',
              fontWeight: 'bold',
            }}
          >
            {submitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('common.confirm')
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}

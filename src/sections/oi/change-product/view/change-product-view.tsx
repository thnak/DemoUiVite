import type {
  WorkingParameterEntity,
} from 'src/api/types/generated';
import type {
  AvailableProductDto,
} from 'src/api/services/machine-custom';

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
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import { Collapse, CircularProgress, Stack, Snackbar } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  changeProduct,
  getAvailableProducts,
} from 'src/api/services/machine-custom';

import { Iconify } from 'src/components/iconify';
import { DurationTimePicker } from 'src/components/duration-time-picker';

import { useMachineSelector } from 'src/sections/oi/context';
import { MachineSelectorCard } from 'src/sections/oi/components';

// ----------------------------------------------------------------------

export function ChangeProductView() {
  const { t } = useTranslation();
  const { selectedMachine } = useMachineSelector();
  const [availableProducts, setAvailableProducts] = useState<AvailableProductDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProductDto, setSelectedProductDto] = useState<AvailableProductDto | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [editedSpecs, setEditedSpecs] = useState<WorkingParameterEntity | null>(null);
  const [currentProduct, setCurrentProduct] = useState<AvailableProductDto | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const loadAvailableProducts = async () => {
    if (!selectedMachine?.id) return;

    setLoading(true);
    try {
      const products = await getAvailableProducts(selectedMachine.id);
      setAvailableProducts(products);
      
      // TODO: Get current product from machine status API
      // For now, we'll leave it as null until the machine status API is available
      // setCurrentProduct should be set from actual machine running product data
    } catch (error) {
      console.error('Failed to load available products:', error);
      setAvailableProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailableProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMachine]);

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

  const handleSelectProduct = (productDto: AvailableProductDto) => {
    setSelectedProductDto(productDto);
    setEditedSpecs(productDto.workingParameter || null);
    setConfirmDialogOpen(true);
  };

  const handleSpecChange = (field: keyof WorkingParameterEntity, value: any) => {
    setEditedSpecs((prev) => ({
      ...prev,
      [field]: value,
    } as WorkingParameterEntity));
  };

  const handleConfirmChange = async () => {
    if (!selectedMachine?.id || !selectedProductDto?.product?.id) return;

    const isSameProduct = currentProduct?.product?.id === selectedProductDto.product.id;

    setSubmitting(true);
    try {
      await changeProduct(selectedMachine.id, {
        productId: selectedProductDto.product.id,
        workingParameter: editedSpecs || undefined,
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
  };

  const formatDuration = (duration: string | undefined | null) => {
    if (!duration) return 'N/A';
    
    // Parse ISO 8601 duration (e.g., PT1H30M or PT45S)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return duration;
    
    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const seconds = match[3] ? parseInt(match[3], 10) : 0;
    
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);
    
    return parts.length > 0 ? parts.join(' ') : '0s';
  };

  const isSameProduct = currentProduct?.product?.id === selectedProductDto?.product?.id;

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
          {/* Current Product */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                {t('oi.currentProduct')}
              </Typography>
              {currentProduct?.product ? (
                <Box>
                  <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {currentProduct.product.code || currentProduct.product.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: 'text.secondary', fontSize: '1.1rem', mb: 3 }}
                  >
                    {currentProduct.product.name || 'N/A'}
                  </Typography>

                  {currentProduct.workingParameter && (
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
                            {formatDuration(currentProduct.workingParameter.idealCycleTime)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {t('oi.quantityPerCycle')}:
                          </Typography>
                          <Typography variant="body2">
                            {currentProduct.workingParameter.quantityPerCycle || 'N/A'}
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

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress size={48} />
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: 48 }} />
                        <TableCell>{t('oi.productCode')}</TableCell>
                        <TableCell>{t('oi.productName')}</TableCell>
                        <TableCell align="right">{t('common.actions')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {availableProducts.map((productDto) => {
                        const isExpanded = expandedRows.has(productDto.product?.id || '');
                        const isCurrent = currentProduct?.product?.id === productDto.product?.id;

                        return (
                          <>
                            <TableRow key={productDto.product?.id} hover>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => handleToggleSpecs(productDto.product?.id || '')}
                                  disabled={!productDto.workingParameter}
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
                                  {productDto.product?.code || 'N/A'}
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
                              <TableCell>{productDto.product?.name || 'N/A'}</TableCell>
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
                              <TableCell colSpan={4} sx={{ py: 0, border: 0 }}>
                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                  <Box sx={{ p: 3, bgcolor: 'background.neutral', borderRadius: 1 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                                      {t('oi.specifications')}
                                    </Typography>

                                    {productDto.workingParameter ? (
                                      <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                          <Typography variant="caption" color="text.secondary">
                                            {t('oi.idealCycleTime')}:
                                          </Typography>
                                          <Typography variant="body2">
                                            {formatDuration(productDto.workingParameter.idealCycleTime)}
                                          </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                          <Typography variant="caption" color="text.secondary">
                                            {t('oi.downtimeThreshold')}:
                                          </Typography>
                                          <Typography variant="body2">
                                            {formatDuration(productDto.workingParameter.downtimeThreshold)}
                                          </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                          <Typography variant="caption" color="text.secondary">
                                            {t('oi.speedLossThreshold')}:
                                          </Typography>
                                          <Typography variant="body2">
                                            {formatDuration(productDto.workingParameter.speedLossThreshold)}
                                          </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                          <Typography variant="caption" color="text.secondary">
                                            {t('oi.quantityPerCycle')}:
                                          </Typography>
                                          <Typography variant="body2">
                                            {productDto.workingParameter.quantityPerCycle || 'N/A'}
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
                          <TableCell colSpan={4} align="center">
                            <Box sx={{ py: 4 }}>
                              <Typography variant="body1" color="text.secondary">
                                {t('oi.noProductsFound')}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
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
                  {currentProduct?.product?.code || currentProduct?.product?.name || t('oi.noProductRunning')}
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  {t('oi.to')}:
                </Typography>
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  {selectedProductDto?.product?.code || selectedProductDto?.product?.name}
                </Typography>
              </Box>
            )}

            {/* Editable Specifications */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('oi.editSpecs')}
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DurationTimePicker
                  label={t('oi.idealCycleTime')}
                  value={editedSpecs?.idealCycleTime || ''}
                  onChange={(value) => handleSpecChange('idealCycleTime', value)}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DurationTimePicker
                  label={t('oi.downtimeThreshold')}
                  value={editedSpecs?.downtimeThreshold || ''}
                  onChange={(value) => handleSpecChange('downtimeThreshold', value)}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DurationTimePicker
                  label={t('oi.speedLossThreshold')}
                  value={editedSpecs?.speedLossThreshold || ''}
                  onChange={(value) => handleSpecChange('speedLossThreshold', value)}
                  fullWidth
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

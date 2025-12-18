import type { ProductEntity } from 'src/api/types/generated';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { DashboardContent } from 'src/layouts/dashboard';
import { searchProduct } from 'src/api/services/generated/product';

import { Iconify } from 'src/components/iconify';

import { useMachineSelector } from 'src/sections/oi/context';
import { MachineSelectorCard } from 'src/sections/oi/components';

// ----------------------------------------------------------------------

export function ChangeProductView() {
  const { t } = useTranslation();
  const { selectedMachine } = useMachineSelector();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductEntity | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [currentProduct] = useState<ProductEntity | null>(null); // This should come from machine's current product

  const handleOpenProductDialog = () => {
    if (!selectedMachine) {
      return;
    }
    setDialogOpen(true);
    loadProducts();
  };

  const handleCloseProductDialog = () => {
    setDialogOpen(false);
    setSearchTerm('');
  };

  const loadProducts = async (search: string = '') => {
    setLoading(true);
    try {
      const response = await searchProduct({ 
        searchText: search,
        maxResults: 50,
      });
      setProducts(response.data || []);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (product: ProductEntity) => {
    setSelectedProduct(product);
    setDialogOpen(false);
    setConfirmDialogOpen(true);
  };

  const handleConfirmChange = async () => {
    // TODO: Implement API call to change product for machine
    console.log('Changing product for machine:', selectedMachine?.id, 'to product:', selectedProduct?.id);
    
    // For now, just close the dialog
    setConfirmDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleCancelChange = () => {
    setConfirmDialogOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    if (dialogOpen) {
      loadProducts(searchTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

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
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                {t('oi.currentProduct')}
              </Typography>
              {currentProduct ? (
                <Box>
                  <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {currentProduct.code || currentProduct.name}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                    {currentProduct.name || 'N/A'}
                  </Typography>
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
                      icon={"eva:cube-outline" as any} 
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

          {/* New Product Selection */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                {t('oi.newProduct')}
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  minHeight: 200,
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleOpenProductDialog}
                  startIcon={<Iconify icon={"eva:cube-fill" as any} />}
                  sx={{
                    minHeight: 80,
                    minWidth: 280,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  {t('oi.selectProduct')}
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Product Selection Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseProductDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '70vh',
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {t('oi.selectProduct')}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder={t('oi.searchProduct')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              mb: 2,
              mt: 1,
              '& .MuiInputBase-root': {
                fontSize: '1.25rem',
                minHeight: 56,
              }
            }}
            InputProps={{
              startAdornment: <Iconify icon="eva:search-fill" sx={{ mr: 1, color: 'text.disabled' }} />,
            }}
          />
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={48} />
            </Box>
          ) : (
            <List sx={{ pt: 0 }}>
              {products.map((product) => (
                <ListItem key={product.id} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => handleSelectProduct(product)}
                    sx={{
                      borderRadius: 1,
                      border: 1,
                      borderColor: 'divider',
                      minHeight: 72,
                      '&:hover': {
                        bgcolor: 'action.hover',
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    <ListItemText
                      primary={product.code || product.name}
                      secondary={product.name || 'N/A'}
                      primaryTypographyProps={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                      }}
                      secondaryTypographyProps={{
                        fontSize: '1rem',
                      }}
                    />
                    <Iconify 
                      icon={"mdi:arrow-right" as any} 
                      sx={{ color: 'text.secondary', fontSize: 32 }} 
                    />
                  </ListItemButton>
                </ListItem>
              ))}
              {products.length === 0 && !loading && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                    {t('oi.noProductsFound')}
                  </Typography>
                </Box>
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleCloseProductDialog}
            size="large"
            sx={{
              minHeight: 56,
              minWidth: 120,
              fontSize: '1.1rem',
            }}
          >
            {t('common.cancel')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelChange}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {t('oi.confirmProductChange')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
              {t('oi.confirmProductChangeMessage')}
            </Typography>
            
            <Box sx={{ bgcolor: 'background.neutral', p: 3, borderRadius: 2, mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                {t('oi.from')}:
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {currentProduct?.code || currentProduct?.name || t('oi.noProductRunning')}
              </Typography>
              
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                {t('oi.to')}:
              </Typography>
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                {selectedProduct?.code || selectedProduct?.name}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={handleCancelChange}
            size="large"
            variant="outlined"
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
            sx={{
              minHeight: 64,
              minWidth: 140,
              fontSize: '1.2rem',
              fontWeight: 'bold',
            }}
          >
            {t('common.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}

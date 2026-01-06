import type { ChangeEvent } from 'react';
import type { MappedProduct, AvailableProduct } from 'src/components/product-mapping';

import { FixedSizeList } from 'react-window';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  postapiMachinemachineIdproductsadd,
  getapiMachinemachineIdproductsmapped,
  postapiMachinemachineIdproductsremove,
  getapiMachinemachineIdproductsunmapped,
} from 'src/api/services/generated/machine';
import { useGetMachineById } from 'src/api/hooks/generated/use-machine';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 80;

interface MachineProductMappingViewProps {
  // Optional props if needed
}

export function MachineProductMappingView(props: MachineProductMappingViewProps) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mappedProducts, setMappedProducts] = useState<MappedProduct[]>([]);
  const [availableProducts, setAvailableProducts] = useState<AvailableProduct[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isLoadingMapped, setIsLoadingMapped] = useState(false);
  const [isLoadingAvailable, setIsLoadingAvailable] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch machine details
  const { data: machine, isLoading: isLoadingMachine } = useGetMachineById(id || '', {
    enabled: !!id,
  });

  // Fetch mapped products
  const fetchMappedProducts = useCallback(async () => {
    if (!id) return;

    setIsLoadingMapped(true);
    try {
      const response = await getapiMachinemachineIdproductsmapped(id, {
        page: 0,
        pageSize: 1000, // Fetch more for virtual rendering
      });
      const products: MappedProduct[] = (response.items || []).map((item) => ({
        productId: String(item.productId),
        productName: item.productName || '',
        imageUrl: item.imageUrl,
      }));
      setMappedProducts(products);
    } catch (error) {
      console.error('Failed to fetch mapped products:', error);
      setErrorMessage('Failed to load mapped products');
    } finally {
      setIsLoadingMapped(false);
    }
  }, [id]);

  // Fetch available products
  const handleSearchAvailable = useCallback(async () => {
    if (!id) return;

    setIsLoadingAvailable(true);
    try {
      const response = await getapiMachinemachineIdproductsunmapped(id, {
        page: 0,
        pageSize: 1000, // Fetch more for virtual rendering
      });
      const products: AvailableProduct[] = (response.items || []).map((item) => ({
        productId: String(item.productId),
        productName: item.productName || '',
        imageUrl: item.imageUrl,
      }));
      setAvailableProducts(products);
    } catch (error) {
      console.error('Failed to fetch available products:', error);
      setErrorMessage('Failed to load available products');
    } finally {
      setIsLoadingAvailable(false);
    }
  }, [id]);

  // Initial load
  useEffect(() => {
    if (id) {
      fetchMappedProducts();
    }
  }, [id, fetchMappedProducts]);

  const handleSelectAll = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const filteredProducts = filteredAvailableProducts;
        setSelectedProductIds(filteredProducts.map((p) => p.productId));
      } else {
        setSelectedProductIds([]);
      }
    },
    [availableProducts, searchText]
  );

  const handleSelectOne = useCallback((productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  const handleAddSelected = useCallback(async () => {
    if (selectedProductIds.length === 0) {
      setErrorMessage('Please select at least one product');
      return;
    }

    if (!id) {
      setErrorMessage('Machine ID is required');
      return;
    }

    setIsAdding(true);
    setErrorMessage(null);

    try {
      const result = await postapiMachinemachineIdproductsadd(id, selectedProductIds);
      if (!result.isSuccess) {
        throw new Error(result.message || 'Failed to add products');
      }

      setSuccessMessage(`Successfully added ${selectedProductIds.length} product(s)`);
      setSelectedProductIds([]);
      setSearchText('');
      setAvailableProducts([]);
      await fetchMappedProducts();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to add products');
    } finally {
      setIsAdding(false);
    }
  }, [selectedProductIds, id, fetchMappedProducts]);

  const handleRemoveProduct = useCallback(
    async (productId: string) => {
      if (!id) return;

      try {
        const result = await postapiMachinemachineIdproductsremove(id, [productId]);
        if (!result.isSuccess) {
          throw new Error(result.message || 'Failed to remove product');
        }

        setSuccessMessage('Successfully removed product mapping');
        await fetchMappedProducts();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to remove product');
      }
    },
    [id, fetchMappedProducts]
  );

  const handleCloseSnackbar = useCallback(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, []);

  const handleBack = useCallback(() => {
    navigate(`/machines/${id}/edit`);
  }, [navigate, id]);

  const filteredAvailableProducts = availableProducts.filter((product) =>
    product.productName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const isAllSelected =
    filteredAvailableProducts.length > 0 &&
    filteredAvailableProducts.every((product) => selectedProductIds.includes(product.productId));

  // Render row for mapped products
  const renderMappedRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const product = mappedProducts[index];
    return (
      <Box
        key={product.productId}
        style={style}
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1,
          borderBottom: 1,
          borderColor: 'divider',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Avatar
          src={product.imageUrl || undefined}
          alt={product.productName}
          variant="rounded"
          sx={{ width: 56, height: 56, mr: 2 }}
        >
          {product.productName[0]}
        </Avatar>
        <Typography sx={{ flexGrow: 1 }}>{product.productName}</Typography>
        <IconButton size="small" color="error" onClick={() => handleRemoveProduct(product.productId)}>
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      </Box>
    );
  };

  // Render row for available products
  const renderAvailableRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const product = filteredAvailableProducts[index];
    const isSelected = selectedProductIds.includes(product.productId);

    return (
      <Box
        key={product.productId}
        style={style}
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1,
          borderBottom: 1,
          borderColor: 'divider',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
        onClick={() => handleSelectOne(product.productId)}
      >
        <Checkbox checked={isSelected} sx={{ mr: 1 }} />
        <Avatar
          src={product.imageUrl || undefined}
          alt={product.productName}
          variant="rounded"
          sx={{ width: 56, height: 56, mr: 2 }}
        >
          {product.productName[0]}
        </Avatar>
        <Typography sx={{ flexGrow: 1 }}>{product.productName}</Typography>
      </Box>
    );
  };

  if (isLoadingMachine) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      {/* Page Header */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <Iconify icon="eva:arrow-back-fill" />
          </IconButton>
          <Typography variant="h4">Product Mapping - {machine?.name || 'Machine'}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 6 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Machines
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            Product Mapping
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Mapped Products Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: 'calc(100vh - 250px)' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Mapped Products ({mappedProducts.length})
            </Typography>
            <Box
              sx={{
                height: 'calc(100% - 50px)',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              {isLoadingMapped ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : mappedProducts.length === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No mapped products yet
                  </Typography>
                </Box>
              ) : (
                <FixedSizeList
                  height={window.innerHeight - 350}
                  itemCount={mappedProducts.length}
                  itemSize={ITEM_HEIGHT}
                  width="100%"
                >
                  {renderMappedRow}
                </FixedSizeList>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Available Products Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: 'calc(100vh - 250px)' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Add Products
            </Typography>

            {/* Search */}
            <TextField
              fullWidth
              size="small"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ mb: 2 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Load button */}
            <Button
              fullWidth
              variant="outlined"
              onClick={handleSearchAvailable}
              disabled={isLoadingAvailable}
              sx={{ mb: 2 }}
              startIcon={<Iconify icon="eva:search-fill" />}
            >
              {isLoadingAvailable ? 'Loading...' : 'Load Available Products'}
            </Button>

            {/* Select All Checkbox */}
            {filteredAvailableProducts.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, px: 2 }}>
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={
                    selectedProductIds.length > 0 &&
                    selectedProductIds.length < filteredAvailableProducts.length
                  }
                  onChange={handleSelectAll}
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Select All
                </Typography>
              </Box>
            )}

            {/* Available products list */}
            <Box
              sx={{
                height: 'calc(100% - 200px)',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              {isLoadingAvailable ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : filteredAvailableProducts.length === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {availableProducts.length === 0
                      ? 'Click "Load Available Products" to search'
                      : 'No products found'}
                  </Typography>
                </Box>
              ) : (
                <FixedSizeList
                  height={window.innerHeight - 450}
                  itemCount={filteredAvailableProducts.length}
                  itemSize={ITEM_HEIGHT}
                  width="100%"
                >
                  {renderAvailableRow}
                </FixedSizeList>
              )}
            </Box>

            {/* Add button */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleAddSelected}
                disabled={selectedProductIds.length === 0 || isAdding}
              >
                {isAdding ? (
                  <CircularProgress size={24} />
                ) : (
                  `Add Selected (${selectedProductIds.length})`
                )}
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar for messages */}
      <Snackbar
        open={!!(errorMessage || successMessage)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={errorMessage ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {errorMessage || successMessage}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}

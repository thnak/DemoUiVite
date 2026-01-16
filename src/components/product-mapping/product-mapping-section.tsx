import type { ChangeEvent } from 'react';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@mui/material/Snackbar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export interface MappedProduct {
  productId: string;
  productName: string;
  imageUrl?: string | null;
}

export interface AvailableProduct {
  productId: string;
  productName: string;
  imageUrl?: string | null;
}

interface ProductMappingSectionProps {
  disabled?: boolean;
  entityId?: string | null;
  mappedProducts: MappedProduct[];
  isLoadingMapped: boolean;
  availableProducts: AvailableProduct[];
  isLoadingAvailable: boolean;
  onSearchAvailable: () => void;
  onAddProducts: (productIds: string[]) => Promise<void>;
  onRemoveProduct: (productId: string) => Promise<void>;
}

export function ProductMappingSection({
  disabled = false,
  entityId,
  mappedProducts,
  isLoadingMapped,
  availableProducts,
  isLoadingAvailable,
  onSearchAvailable,
  onAddProducts,
  onRemoveProduct,
}: ProductMappingSectionProps) {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSelectAll = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const filteredProducts = availableProducts.filter((product) =>
          product.productName?.toLowerCase().includes(searchText.toLowerCase())
        );
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

    setIsAdding(true);
    setErrorMessage(null);

    try {
      await onAddProducts(selectedProductIds);
      setSuccessMessage(`Successfully added ${selectedProductIds.length} product(s)`);
      setSelectedProductIds([]);
      setSearchText('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to add products');
    } finally {
      setIsAdding(false);
    }
  }, [selectedProductIds, onAddProducts]);

  const handleRemoveProduct = useCallback(
    async (productId: string) => {
      try {
        await onRemoveProduct(productId);
        setSuccessMessage('Successfully removed product mapping');
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to remove product');
      }
    },
    [onRemoveProduct]
  );

  const handleCloseSnackbar = useCallback(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, []);

  const filteredAvailableProducts = availableProducts.filter((product) =>
    product.productName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const isAllSelected =
    filteredAvailableProducts.length > 0 &&
    filteredAvailableProducts.every((product) => selectedProductIds.includes(product.productId));

  if (disabled || !entityId) {
    return (
      <Card sx={{ p: 3, bgcolor: 'background.neutral' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
          <Typography variant="body2" color="text.secondary">
            Product mapping will be available after creating the machine. Please save the form
            first.
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Product Mapping
      </Typography>

      <Grid container spacing={3}>
        {/* Mapped Products Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Mapped Products ({mappedProducts.length})
          </Typography>
          <TableContainer
            sx={{ maxHeight: 400, border: 1, borderColor: 'divider', borderRadius: 1 }}
          >
            {isLoadingMapped ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={32} />
              </Box>
            ) : (
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width={80}>Image</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell align="right" width={80}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mappedProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                          No mapped products yet
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    mappedProducts.map((product) => (
                      <TableRow key={product.productId} hover>
                        <TableCell>
                          <Avatar
                            src={product.imageUrl || undefined}
                            alt={product.productName}
                            variant="rounded"
                            sx={{ width: 48, height: 48 }}
                          >
                            {product.productName[0]}
                          </Avatar>
                        </TableCell>
                        <TableCell>{product.productName}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveProduct(product.productId)}
                          >
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Grid>

        {/* Available Products Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
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

          {/* Search button */}
          <Button
            fullWidth
            variant="outlined"
            onClick={onSearchAvailable}
            disabled={isLoadingAvailable}
            sx={{ mb: 2 }}
            startIcon={<Iconify icon="eva:search-fill" />}
          >
            {isLoadingAvailable ? 'Loading...' : 'Load Available Products'}
          </Button>

          {/* Available products table */}
          <TableContainer
            sx={{ maxHeight: 300, border: 1, borderColor: 'divider', borderRadius: 1 }}
          >
            {isLoadingAvailable ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={32} />
              </Box>
            ) : (
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={
                          selectedProductIds.length > 0 &&
                          selectedProductIds.length < filteredAvailableProducts.length
                        }
                        onChange={handleSelectAll}
                        disabled={filteredAvailableProducts.length === 0}
                      />
                    </TableCell>
                    <TableCell width={80}>Image</TableCell>
                    <TableCell>Product Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAvailableProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                          {availableProducts.length === 0
                            ? 'Click "Load Available Products" to search'
                            : 'No products found'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAvailableProducts.map((product) => (
                      <TableRow
                        key={product.productId}
                        hover
                        onClick={() => handleSelectOne(product.productId)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedProductIds.includes(product.productId)} />
                        </TableCell>
                        <TableCell>
                          <Avatar
                            src={product.imageUrl || undefined}
                            alt={product.productName}
                            variant="rounded"
                            sx={{ width: 48, height: 48 }}
                          >
                            {product.productName[0]}
                          </Avatar>
                        </TableCell>
                        <TableCell>{product.productName}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </TableContainer>

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
    </Card>
  );
}

import { useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';

import type { AvailableProduct } from '../../types';

import { Iconify } from 'src/components/iconify';

interface ProductChangeDialogProps {
  open: boolean;
  onClose: () => void;
  availableProducts: AvailableProduct[];
  currentProductId?: string;
  currentPlannedQuantity?: number;
  onProductSelect: (product: AvailableProduct, targetQuantity: number) => void;
  onUpdateTarget: (targetQuantity: number) => void;
}

/**
 * Product Change Dialog Component
 * Allows selecting a new product or updating target for current product
 */
export function ProductChangeDialog({
  open,
  onClose,
  availableProducts,
  currentProductId,
  currentPlannedQuantity,
  onProductSelect,
  onUpdateTarget,
}: ProductChangeDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [targetDialogOpen, setTargetDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AvailableProduct | null>(null);
  const [targetQuantity, setTargetQuantity] = useState('');

  const filteredProducts = availableProducts.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (product: AvailableProduct, isRunning: boolean) => {
    setSelectedProduct(product);
    setTargetQuantity(isRunning ? String(currentPlannedQuantity || '') : '');
    setTargetDialogOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedProduct) return;
    
    const target = parseInt(targetQuantity, 10);
    if (!target || target <= 0) return;

    const isRunning = selectedProduct.productId === currentProductId;
    if (isRunning) {
      onUpdateTarget(target);
    } else {
      onProductSelect(selectedProduct, target);
    }

    setTargetDialogOpen(false);
    setTargetQuantity('');
    setSelectedProduct(null);
  };

  return (
    <>
      {/* Main Product Selection Dialog */}
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Đổi mã hàng
            </Typography>
            <IconButton onClick={onClose}>
              <Iconify icon="eva:close-outline" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Search Box */}
          <TextField
            fullWidth
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
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

          {/* Product Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell>Mã sản phẩm</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => {
                  const isRunning = currentProductId === product.productId;
                  return (
                    <TableRow key={product.productId} hover>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1,
                              overflow: 'hidden',
                              bgcolor: 'background.neutral',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {product.imageUrl ? (
                              <img
                                key={product.productId}
                                src={product.imageUrl}
                                alt={product.productName}
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                  const target = e.currentTarget;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent && !parent.querySelector('.fallback-icon')) {
                                    const icon = document.createElement('div');
                                    icon.className = 'fallback-icon';
                                    icon.style.fontSize = '20px';
                                    icon.innerHTML = '📦';
                                    parent.appendChild(icon);
                                  }
                                }}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                            ) : (
                              <Box sx={{ fontSize: '20px' }}>📦</Box>
                            )}
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {product.productName}
                            </Typography>
                            {isRunning && (
                              <Chip label="Đang chạy" size="small" color="success" sx={{ mt: 0.5 }} />
                            )}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{product.productCode}</TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant={isRunning ? 'outlined' : 'contained'}
                          onClick={() => handleProductClick(product, isRunning)}
                        >
                          {isRunning ? 'Cập nhật' : 'Chọn'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Đóng (ESC)
          </Button>
        </DialogActions>
      </Dialog>

      {/* Target Quantity Dialog */}
      <Dialog open={targetDialogOpen} onClose={() => setTargetDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          {selectedProduct?.productId === currentProductId
            ? 'Cập nhật mục tiêu'
            : 'Nhập mục tiêu sản xuất'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Sản phẩm: {selectedProduct?.productName}
            </Typography>
            <TextField
              fullWidth
              label="Số lượng mục tiêu"
              type="number"
              value={targetQuantity}
              onChange={(e) => setTargetQuantity(e.target.value)}
              placeholder="Nhập số lượng..."
              slotProps={{
                htmlInput: {
                  min: 1,
                },
              }}
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTargetDialogOpen(false)} variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={!targetQuantity || parseInt(targetQuantity, 10) <= 0}
          >
            {selectedProduct?.productId === currentProductId ? 'Cập nhật' : 'Xác nhận'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

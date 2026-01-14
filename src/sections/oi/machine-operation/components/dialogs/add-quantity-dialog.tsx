import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
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
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

import type { QuantityAddHistory } from '../../types';

interface AddQuantityDialogProps {
  open: boolean;
  onClose: () => void;
  quantityHistory: QuantityAddHistory[];
  onAdd: (quantity: number, note: string) => void;
  onEdit: (historyId: string, quantity: number, note: string) => void;
  onDelete: (historyId: string) => void;
}

/**
 * Add Quantity Dialog Component
 * Allows adding external quantities with history tracking
 */
export function AddQuantityDialog({
  open,
  onClose,
  quantityHistory,
  onAdd,
  onEdit,
  onDelete,
}: AddQuantityDialogProps) {
  const [tabValue, setTabValue] = useState(0);
  const [quantityToAdd, setQuantityToAdd] = useState('');
  const [quantityNote, setQuantityNote] = useState('');
  const [editingQuantityId, setEditingQuantityId] = useState<string | null>(null);
  const [editQuantityValue, setEditQuantityValue] = useState('');
  const [editQuantityNote, setEditQuantityNote] = useState('');

  const handleAdd = () => {
    const qty = parseInt(quantityToAdd, 10);
    if (qty > 0) {
      onAdd(qty, quantityNote);
      setQuantityToAdd('');
      setQuantityNote('');
      setTabValue(0);
    }
  };

  const handleEditClick = (history: QuantityAddHistory) => {
    setEditingQuantityId(history.id);
    setEditQuantityValue(String(history.addedQuantity));
    setEditQuantityNote(history.note || '');
  };

  const handleSaveEdit = (historyId: string) => {
    const newQty = parseInt(editQuantityValue, 10);
    if (newQty > 0) {
      onEdit(historyId, newQty, editQuantityNote);
      setEditingQuantityId(null);
      setEditQuantityValue('');
      setEditQuantityNote('');
    }
  };

  const handleCancelEdit = () => {
    setEditingQuantityId(null);
    setEditQuantityValue('');
    setEditQuantityNote('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Thêm sản phẩm
          </Typography>
          <IconButton onClick={onClose}>
            <Iconify icon="eva:close-outline" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab label="Thêm số lượng" />
          <Tab label="Lịch sử" />
        </Tabs>

        {/* Tab 1: Add Quantity */}
        {tabValue === 0 && (
          <Stack spacing={3} height="700px">
            <TextField
              fullWidth
              label="Số lượng"
              type="number"
              value={quantityToAdd}
              onChange={(e) => setQuantityToAdd(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:plus-fill" />
                    </InputAdornment>
                  ),
                },
              }}
              helperText="Nhập số lượng sản phẩm muốn thêm vào tổng số"
            />
            <TextField
              fullWidth
              label="Ghi chú (tùy chọn)"
              multiline
              rows={3}
              value={quantityNote}
              onChange={(e) => setQuantityNote(e.target.value)}
              placeholder="Nhập ghi chú nếu cần..."
            />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={onClose}>
                Hủy
              </Button>
              <Button
                variant="contained"
                onClick={handleAdd}
                disabled={!quantityToAdd || parseInt(quantityToAdd, 10) <= 0}
              >
                Thêm
              </Button>
            </Box>
          </Stack>
        )}

        {/* Tab 2: History */}
        {tabValue === 1 && (
          <TableContainer style={{ height: '700px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Thời gian</TableCell>
                  <TableCell align="center">Số lượng</TableCell>
                  <TableCell>Người thêm</TableCell>
                  <TableCell>Ghi chú</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quantityHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Chưa có lịch sử thêm số lượng
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  quantityHistory.map((history) => (
                    <TableRow key={history.id} hover>
                      <TableCell>{new Date(history.timestamp).toLocaleString('vi-VN')}</TableCell>
                      <TableCell align="center">
                        {editingQuantityId === history.id ? (
                          <TextField
                            size="small"
                            type="number"
                            value={editQuantityValue}
                            onChange={(e) => setEditQuantityValue(e.target.value)}
                            sx={{ width: '100px' }}
                          />
                        ) : (
                          <Chip
                            label={`+${history.addedQuantity}`}
                            size="small"
                            color="success"
                          />
                        )}
                      </TableCell>
                      <TableCell>{history.addedBy}</TableCell>
                      <TableCell>
                        {editingQuantityId === history.id ? (
                          <TextField
                            size="small"
                            fullWidth
                            value={editQuantityNote}
                            onChange={(e) => setEditQuantityNote(e.target.value)}
                            placeholder="Ghi chú"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {history.note || '-'}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {editingQuantityId === history.id ? (
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleSaveEdit(history.id)}
                            >
                              <Iconify icon="solar:check-circle-bold" />
                            </IconButton>
                            <IconButton size="small" onClick={handleCancelEdit}>
                              <Iconify icon="mingcute:close-line" />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <IconButton size="small" onClick={() => handleEditClick(history)}>
                              <Iconify icon="solar:pen-bold" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => onDelete(history.id)}
                            >
                              <Iconify icon="solar:trash-bin-trash-bold" />
                            </IconButton>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
}

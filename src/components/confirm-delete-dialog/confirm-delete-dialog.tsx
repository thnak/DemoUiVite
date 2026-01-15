import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

export interface ConfirmDeleteDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog is closed */
  onClose: () => void;
  /** Callback when delete is confirmed */
  onConfirm: () => void;
  /** Name or description of the entity being deleted */
  entityName?: string;
  /** Number of items being deleted (for bulk operations) */
  itemCount?: number;
  /** Whether the delete operation is in progress */
  loading?: boolean;
}

export function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  entityName = 'item',
  itemCount = 1,
  loading = false,
}: ConfirmDeleteDialogProps) {
  const [confirmText, setConfirmText] = useState('');

  const handleClose = useCallback(() => {
    if (!loading) {
      setConfirmText('');
      onClose();
    }
  }, [loading, onClose]);

  const handleConfirm = useCallback(() => {
    if (confirmText.toLowerCase() === 'delete') {
      onConfirm();
    }
  }, [confirmText, onConfirm]);

  const isConfirmValid = confirmText.toLowerCase() === 'delete';
  const isBulkDelete = itemCount > 1;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:trash-bin-trash-bold" width={24} sx={{ color: 'error.main' }} />
          <Typography variant="h6">Confirm Delete</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            {isBulkDelete
              ? `Are you sure you want to delete ${itemCount} ${entityName}${itemCount > 1 ? 's' : ''}?`
              : `Are you sure you want to delete this ${entityName}?`}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
            Type <strong>&quot;delete&quot;</strong> to confirm:
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type delete here"
            disabled={loading}
            autoFocus
            error={confirmText.length > 0 && !isConfirmValid}
            helperText={
              confirmText.length > 0 && !isConfirmValid ? 'Please type "delete" exactly' : ''
            }
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={!isConfirmValid || loading}
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Iconify icon="solar:trash-bin-trash-bold" />
            )
          }
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

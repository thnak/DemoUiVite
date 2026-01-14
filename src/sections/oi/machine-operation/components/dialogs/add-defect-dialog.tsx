import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { Iconify } from 'src/components/iconify';

import type { DefectType, DefectSubmission } from '../../types';

interface AddDefectDialogProps {
  open: boolean;
  onClose: () => void;
  defectTypes: DefectType[];
  defectHistory: DefectSubmission[];
  onSubmit: (defects: Map<string, number>) => void;
}

/**
 * Add Defect Dialog Component
 * Allows entering defects/scrap with history tracking
 */
export function AddDefectDialog({
  open,
  onClose,
  defectTypes,
  defectHistory,
  onSubmit,
}: AddDefectDialogProps) {
  const [tabValue, setTabValue] = useState(0);
  const [defectEntries, setDefectEntries] = useState<Map<string, number>>(new Map());

  const handleQuantityChange = (defectId: string, value: string) => {
    const qty = parseInt(value, 10);
    if (!Number.isNaN(qty) && qty > 0) {
      setDefectEntries(new Map(defectEntries.set(defectId, qty)));
    } else {
      const newMap = new Map(defectEntries);
      newMap.delete(defectId);
      setDefectEntries(newMap);
    }
  };

  const handleIncrement = (defectId: string) => {
    const current = defectEntries.get(defectId) || 0;
    setDefectEntries(new Map(defectEntries.set(defectId, current + 1)));
  };

  const handleDecrement = (defectId: string) => {
    const current = defectEntries.get(defectId) || 0;
    if (current > 1) {
      setDefectEntries(new Map(defectEntries.set(defectId, current - 1)));
    } else {
      const newMap = new Map(defectEntries);
      newMap.delete(defectId);
      setDefectEntries(newMap);
    }
  };

  const handleSubmit = () => {
    if (defectEntries.size === 0) return;
    onSubmit(defectEntries);
    setDefectEntries(new Map());
    setTabValue(0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Nhập lỗi/Scrap
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
          <Tab label="Nhập lỗi" />
          <Tab label="Lịch sử" />
        </Tabs>

        {/* Tab 1: Add Defects Grid */}
        {tabValue === 0 && (
          <Box sx={{ height: 600, overflow: 'auto' }}>
            <Grid container spacing={2}>
              {defectTypes.map((defect) => {
                const quantity = defectEntries.get(defect.defectId) || 0;

                return (
                  <Grid key={defect.defectId} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card
                      sx={{
                        p: 2,
                        borderLeft: 4,
                        borderColor: defect.colorHex,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Defect image/icon */}
                      <Box
                        sx={{
                          width: '100%',
                          height: 100,
                          borderRadius: 1,
                          bgcolor: defect.colorHex,
                          opacity: 0.15,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          position: 'relative',
                        }}
                      >
                        {defect.imageUrl ? (
                          <img
                            key={defect.defectId}
                            src={defect.imageUrl}
                            alt={defect.defectName}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          />
                        ) : (
                          <Typography
                            variant="h1"
                            sx={{
                              color: defect.colorHex,
                              opacity: 0.7,
                            }}
                          >
                            ⚠️
                          </Typography>
                        )}
                      </Box>

                      {/* Defect name */}
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 'bold',
                          mb: 2,
                          color: defect.colorHex,
                        }}
                      >
                        {defect.defectName}
                      </Typography>

                      {/* Quantity controls */}
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 'auto' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleDecrement(defect.defectId)}
                          disabled={quantity === 0}
                          sx={{
                            border: 1,
                            borderColor: defect.colorHex,
                            color: defect.colorHex,
                          }}
                        >
                          <Iconify icon="eva:minus-fill" />
                        </IconButton>

                        <TextField
                          size="small"
                          value={quantity || ''}
                          onChange={(e) => handleQuantityChange(defect.defectId, e.target.value)}
                          type="number"
                          sx={{ flex: 1 }}
                          slotProps={{
                            input: {
                              sx: { textAlign: 'center' },
                            },
                          }}
                          placeholder="0"
                        />

                        <IconButton
                          size="small"
                          onClick={() => handleIncrement(defect.defectId)}
                          sx={{
                            border: 1,
                            borderColor: defect.colorHex,
                            bgcolor: defect.colorHex,
                            color: 'white',
                            '&:hover': {
                              bgcolor: defect.colorHex,
                              opacity: 0.9,
                            },
                          }}
                        >
                          <Iconify icon="eva:plus-fill" />
                        </IconButton>
                      </Box>

                      {/* Show current quantity if > 0 */}
                      {quantity > 0 && (
                        <Chip
                          label={`${quantity} lỗi`}
                          size="small"
                          sx={{
                            mt: 1,
                            bgcolor: defect.colorHex,
                            color: 'white',
                          }}
                        />
                      )}
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {/* Submit button */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="outlined" onClick={onClose}>
                Hủy
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleSubmit}
                disabled={defectEntries.size === 0}
                startIcon={<Iconify icon="eva:checkmark-fill" />}
              >
                Xác nhận ({Array.from(defectEntries.values()).reduce((sum, qty) => sum + qty, 0)}{' '}
                lỗi)
              </Button>
            </Box>
          </Box>
        )}

        {/* Tab 2: History Grid */}
        {tabValue === 1 && (
          <Box sx={{ height: 600, overflow: 'auto' }}>
            {defectHistory.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography variant="body2" color="text.secondary">
                  Chưa có lịch sử nhập lỗi
                </Typography>
              </Box>
            ) : (
              <Stack spacing={3}>
                {defectHistory.map((submission) => (
                  <Card key={submission.id} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(submission.timestamp).toLocaleString('vi-VN')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {submission.submittedBy}
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {submission.defects.map((defect) => (
                        <Grid key={defect.defectId} size={{ xs: 12, sm: 6, md: 4 }}>
                          <Box
                            sx={{
                              p: 2,
                              borderLeft: 4,
                              borderColor: defect.colorHex,
                              bgcolor: 'background.neutral',
                              borderRadius: 1,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 'bold',
                                color: defect.colorHex,
                              }}
                            >
                              {defect.defectName}
                            </Typography>
                            <Chip
                              label={`${defect.quantity}`}
                              size="small"
                              sx={{
                                bgcolor: defect.colorHex,
                                color: 'white',
                              }}
                            />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

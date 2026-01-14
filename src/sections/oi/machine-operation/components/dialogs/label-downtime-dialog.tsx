import type { CurrentMachineRunStateRecords } from 'src/api/types/generated';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { Iconify } from 'src/components/iconify';

import { calculateDuration } from '../../types';

import type { StopReason, DowntimeLabelHistory } from '../../types';

interface LabelDowntimeDialogProps {
  open: boolean;
  onClose: () => void;
  unlabeledDowntimes: CurrentMachineRunStateRecords[];
  stopReasons: StopReason[];
  downtimeHistory: DowntimeLabelHistory[];
  onLabelDowntime: (downtime: CurrentMachineRunStateRecords, reasonIds: string[], note: string) => void;
}

/**
 * Label Downtime Dialog Component
 * Allows labeling unlabeled downtime with stop reasons
 */
export function LabelDowntimeDialog({
  open,
  onClose,
  unlabeledDowntimes,
  stopReasons,
  downtimeHistory,
  onLabelDowntime,
}: LabelDowntimeDialogProps) {
  const [tabValue, setTabValue] = useState(0);
  const [showReasonGrid, setShowReasonGrid] = useState(false);
  const [downtimeToLabel, setDowntimeToLabel] = useState<CurrentMachineRunStateRecords | null>(
    null
  );
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [labelNote, setLabelNote] = useState('');

  const handleClose = () => {
    onClose();
    setTabValue(0);
    setShowReasonGrid(false);
    setDowntimeToLabel(null);
    setSelectedReasons([]);
    setLabelNote('');
  };

  const handleLabelClick = (downtime: CurrentMachineRunStateRecords) => {
    setDowntimeToLabel(downtime);
    setShowReasonGrid(true);
  };

  const handleReasonToggle = (reasonId: string) => {
    setSelectedReasons((prev) => {
      if (prev.includes(reasonId)) {
        return prev.filter((id) => id !== reasonId);
      }
      return [...prev, reasonId];
    });
  };

  const handleSubmitLabel = () => {
    if (selectedReasons.length === 0 || !downtimeToLabel) return;
    
    onLabelDowntime(downtimeToLabel, selectedReasons, labelNote);
    setSelectedReasons([]);
    setLabelNote('');
    setShowReasonGrid(false);
    setDowntimeToLabel(null);
  };

  const handleBack = () => {
    setShowReasonGrid(false);
    setDowntimeToLabel(null);
    setSelectedReasons([]);
    setLabelNote('');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: 600 },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Lý do dừng máy</Typography>
          <IconButton onClick={handleClose}>
            <Iconify icon="eva:close-outline" />
          </IconButton>
        </Box>
        <Tabs value={tabValue} onChange={(e, value) => setTabValue(value)}>
          <Tab label="Cần gán nhãn" />
          <Tab label="Lịch sử" />
        </Tabs>
      </DialogTitle>
      <DialogContent dividers sx={{ minHeight: 400 }}>
        {/* Tab 1: Unlabeled Downtimes */}
        {tabValue === 0 && (
          <Box>
            {showReasonGrid && downtimeToLabel ? (
              // Show reason selection grid
              <Box>
                <Button
                  startIcon={<Iconify icon="eva:arrow-back-fill" />}
                  onClick={handleBack}
                  sx={{ mb: 2 }}
                >
                  Quay lại
                </Button>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Thời gian:{' '}
                  {downtimeToLabel.startTime
                    ? new Date(downtimeToLabel.startTime).toLocaleString()
                    : 'N/A'}{' '}
                  -
                  {downtimeToLabel.endTime
                    ? new Date(downtimeToLabel.endTime).toLocaleString()
                    : ' Đang diễn ra'}{' '}
                  ({calculateDuration(downtimeToLabel.startTime, downtimeToLabel.endTime)} phút)
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {stopReasons.map((reason) => (
                    <Grid key={reason.reasonId} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Card
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          borderLeft: 4,
                          borderColor: reason.colorHex,
                          bgcolor: selectedReasons.includes(reason.reasonId)
                            ? `${reason.colorHex}20`
                            : 'background.paper',
                          '&:hover': {
                            bgcolor: `${reason.colorHex}10`,
                          },
                        }}
                        onClick={() => handleReasonToggle(reason.reasonId)}
                      >
                        <Box
                          sx={{
                            height: 100,
                            bgcolor: `${reason.colorHex}15`,
                            borderRadius: 1,
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                          }}
                        >
                          {reason.imageUrl ? (
                            <img
                              key={reason.reasonId}
                              src={reason.imageUrl}
                              alt={reason.reasonName}
                              style={{ maxWidth: '100%', maxHeight: '100%' }}
                            />
                          ) : (
                            '⚠️'
                          )}
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold', color: reason.colorHex }}
                          >
                            {reason.reasonName}
                          </Typography>
                          <Iconify
                            icon={
                              selectedReasons.includes(reason.reasonId)
                                ? 'eva:checkmark-square-2-fill'
                                : 'eva:square-outline'
                            }
                            sx={{ color: reason.colorHex }}
                          />
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  label="Ghi chú (tùy chọn)"
                  value={labelNote}
                  onChange={(e) => setLabelNote(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSubmitLabel}
                  disabled={selectedReasons.length === 0}
                >
                  Xác nhận ({selectedReasons.length} lý do)
                </Button>
              </Box>
            ) : (
              // Show unlabeled downtimes list
              <Stack spacing={2}>
                {unlabeledDowntimes.length === 0 ? (
                  <Alert severity="success">Không có thời gian dừng cần gán nhãn</Alert>
                ) : (
                  unlabeledDowntimes.map((downtime, index) => {
                    const isOngoing = !downtime.endTime;
                    const duration = calculateDuration(downtime.startTime, downtime.endTime);

                    return (
                      <Card key={`${downtime.startTime}-${index}`} sx={{ p: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1,
                          }}
                        >
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              {downtime.startTime
                                ? new Date(downtime.startTime).toLocaleString()
                                : 'N/A'}{' '}
                              -
                              {downtime.endTime
                                ? new Date(downtime.endTime).toLocaleString()
                                : ' Đang diễn ra'}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                              <Chip
                                icon={<Iconify icon="eva:clock-outline" />}
                                label={`${duration} phút`}
                                size="small"
                                color="default"
                              />
                              {isOngoing && (
                                <Chip label="Đang diễn ra" size="small" color="error" />
                              )}
                            </Box>
                          </Box>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleLabelClick(downtime)}
                          >
                            Gán nhãn
                          </Button>
                        </Box>
                      </Card>
                    );
                  })
                )}
              </Stack>
            )}
          </Box>
        )}

        {/* Tab 2: Labeled Downtime History */}
        {tabValue === 1 && (
          <Box>
            {downtimeHistory.length === 0 ? (
              <Alert severity="info">Chưa có lịch sử gán nhãn</Alert>
            ) : (
              <Stack spacing={2}>
                {downtimeHistory.map((history) => (
                  <Card key={history.id} sx={{ p: 2 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        {history.startTime ? new Date(history.startTime).toLocaleString() : 'N/A'}{' '}
                        -
                        {history.endTime
                          ? new Date(history.endTime).toLocaleString()
                          : ' Đang diễn ra'}{' '}
                        ({history.duration} phút)
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Gán bởi: {history.labeledBy} •{' '}
                        {new Date(history.timestamp).toLocaleString()}
                      </Typography>
                    </Box>

                    <Grid container spacing={1} sx={{ mb: history.note ? 2 : 0 }}>
                      {history.reasons.map((reason) => (
                        <Grid key={reason.reasonId} size={{ xs: 12, sm: 6, md: 4 }}>
                          <Box
                            sx={{
                              p: 1,
                              borderLeft: 4,
                              borderColor: reason.colorHex,
                              bgcolor: `${reason.colorHex}10`,
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 'bold', color: reason.colorHex }}
                            >
                              {reason.reasonName}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>

                    {history.note && (
                      <Box sx={{ p: 1.5, bgcolor: 'background.neutral', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Ghi chú:
                        </Typography>
                        <Typography variant="body2">{history.note}</Typography>
                      </Box>
                    )}
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

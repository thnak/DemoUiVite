import type { StopMachineReasonEntity, CurrentMachineRunStateRecords } from 'src/api/types/generated';

import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  CircularProgress,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { searchStopMachineReason } from 'src/api/services/generated/stop-machine-reason';
import {
  postapiMachineDowntimemachineIdlabeldowntimerecord,
  getapiMachineDowntimemachineIdcurrentrunstaterecords,
} from 'src/api/services/generated/machine-downtime';

import { Iconify } from 'src/components/iconify';

import { useMachineSelector } from 'src/sections/oi/context';
import { MachineSelectorCard } from 'src/sections/oi/components';

// ----------------------------------------------------------------------

interface TimelineBlock {
  record: CurrentMachineRunStateRecords;
  startPercent: number;
  widthPercent: number;
}

export function DowntimeInputView() {
  const { t } = useTranslation();
  const { selectedMachine } = useMachineSelector();
  const [stateRecords, setStateRecords] = useState<CurrentMachineRunStateRecords[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CurrentMachineRunStateRecords | null>(null);
  const [reasons, setReasons] = useState<StopMachineReasonEntity[]>([]);
  const [loadingReasons, setLoadingReasons] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReason, setSelectedReason] = useState<StopMachineReasonEntity | null>(null);
  const [note, setNote] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadStateRecords = async () => {
    if (!selectedMachine) return;

    setLoading(true);
    try {
      const records = await getapiMachineDowntimemachineIdcurrentrunstaterecords(
        selectedMachine.id!
      );
      setStateRecords(records || []);
      setLastFetchedAt(new Date());
    } catch (error) {
      console.error('Failed to load state records:', error);
      setStateRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const loadReasons = async (search: string = '') => {
    setLoadingReasons(true);
    try {
      const response = await searchStopMachineReason({
        searchText: search,
        maxResults: 50,
      });
      setReasons(response.data || []);
    } catch (error) {
      console.error('Failed to load reasons:', error);
      setReasons([]);
    } finally {
      setLoadingReasons(false);
    }
  };

  const handleBlockClick = (record: CurrentMachineRunStateRecords) => {
    if (!record.isUnplannedDowntime) return;

    setSelectedRecord(record);
    setDialogOpen(true);
    loadReasons();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRecord(null);
    setSelectedReason(null);
    setNote('');
    setSearchTerm('');
  };

  const handleSelectReason = (reason: StopMachineReasonEntity) => {
    setSelectedReason(reason);
  };

  const handleSubmitLabel = async () => {
    if (!selectedMachine || !selectedRecord || !selectedReason) return;

    try {
      await postapiMachineDowntimemachineIdlabeldowntimerecord(selectedMachine.id!, {
        startTime: selectedRecord.startTime,
        reasonId: selectedReason.id!,
        note: note || undefined,
      });

      setSubmitSuccess(true);
      setSubmitError(null);
      handleCloseDialog();

      // Reload state records after successful labeling
      setTimeout(() => {
        loadStateRecords();
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to label downtime:', error);
      setSubmitError(t('oi.labelDowntimeError'));
    }
  };

  const calculateTimeline = (): TimelineBlock[] => {
    if (stateRecords.length === 0) return [];

    // Find the earliest start time and latest end time (or now if ongoing)
    const now = new Date();
    const earliestStart = stateRecords.reduce((min, record) => {
      const start = new Date(record.startTime);
      return start < min ? start : min;
    }, new Date(stateRecords[0].startTime));

    const latestEnd = stateRecords.reduce((max, record) => {
      const end = record.endTime ? new Date(record.endTime) : now;
      return end > max ? end : max;
    }, new Date(stateRecords[0].endTime || now));

    const totalDuration = latestEnd.getTime() - earliestStart.getTime();

    // Calculate position and width for each block
    return stateRecords.map((record) => {
      const start = new Date(record.startTime);
      const end = record.endTime ? new Date(record.endTime) : now;
      const duration = end.getTime() - start.getTime();
      const startPercent = ((start.getTime() - earliestStart.getTime()) / totalDuration) * 100;
      const widthPercent = (duration / totalDuration) * 100;

      return {
        record,
        startPercent,
        widthPercent,
      };
    });
  };

  const getBlockColor = (record: CurrentMachineRunStateRecords) => {
    if (record.isUnplannedDowntime) {
      return '#ef5350'; // Red for unplanned downtime
    }
    return '#66bb6a'; // Green for running/other states
  };

  const formatDuration = (startTime: string, endTime?: string | null) => {
    const start = dayjs(startTime);
    const end = endTime ? dayjs(endTime) : dayjs();
    const duration = end.diff(start, 'minute');

    if (duration < 60) {
      return `${duration}m`;
    }
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    if (selectedMachine) {
      loadStateRecords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMachine]);

  useEffect(() => {
    if (dialogOpen) {
      loadReasons(searchTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const timelineBlocks = calculateTimeline();

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
          {t('oi.downtimeInput')}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
          {t('oi.downtimeInputDescription')}
        </Typography>
      </Box>

      <MachineSelectorCard />

      {!selectedMachine ? (
        <Alert severity="info" sx={{ fontSize: '1.1rem', py: 3 }}>
          {t('oi.pleaseSelectMachine')}
        </Alert>
      ) : (
        <Stack spacing={3}>
          {submitSuccess && (
            <Alert severity="success" sx={{ fontSize: '1.1rem', py: 3 }}>
              {t('oi.labelDowntimeSuccess')}
            </Alert>
          )}

          {submitError && (
            <Alert severity="error" sx={{ fontSize: '1.1rem', py: 3 }}>
              {submitError}
            </Alert>
          )}

          {/* Timeline Chart Card */}
          <Card sx={{ p: 4 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {t('oi.currentMachineStates')}
                </Typography>
                {lastFetchedAt && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('oi.lastFetchedAt')} {dayjs(lastFetchedAt).format('HH:mm:ss')}
                  </Typography>
                )}
              </Box>
              <Button
                variant="contained"
                onClick={loadStateRecords}
                startIcon={<Iconify icon="eva:refresh-fill" />}
                disabled={loading}
                sx={{
                  minHeight: 56,
                  minWidth: 150,
                  fontSize: '1.1rem',
                }}
              >
                {t('oi.refresh')}
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={48} />
              </Box>
            ) : stateRecords.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                  {t('oi.noStateRecords')}
                </Typography>
              </Box>
            ) : (
              <Box>
                {/* Timeline Chart */}
                <Box
                  sx={{
                    position: 'relative',
                    height: 80,
                    bgcolor: 'background.neutral',
                    borderRadius: 1,
                    overflow: 'hidden',
                    mb: 3,
                  }}
                >
                  {timelineBlocks.map((block, index) => (
                    <Box
                      key={index}
                      onClick={() => handleBlockClick(block.record)}
                      sx={{
                        position: 'absolute',
                        left: `${block.startPercent}%`,
                        width: `${block.widthPercent}%`,
                        height: '100%',
                        bgcolor: getBlockColor(block.record),
                        cursor: block.record.isUnplannedDowntime ? 'pointer' : 'default',
                        transition: 'all 0.2s',
                        border: 1,
                        borderColor: 'divider',
                        '&:hover': block.record.isUnplannedDowntime
                          ? {
                              opacity: 0.8,
                              transform: 'scaleY(1.1)',
                            }
                          : {},
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {block.widthPercent > 10 && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            textAlign: 'center',
                            px: 1,
                          }}
                        >
                          {formatDuration(block.record.startTime, block.record.endTime)}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>

                {/* Legend and Details */}
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{ width: 24, height: 24, bgcolor: '#ef5350', borderRadius: 0.5 }}
                      />
                      <Typography variant="body2">{t('oi.unplannedDowntime')}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{ width: 24, height: 24, bgcolor: '#66bb6a', borderRadius: 0.5 }}
                      />
                      <Typography variant="body2">{t('oi.running')}</Typography>
                    </Box>
                  </Box>

                  {/* State Records List */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {t('oi.state')} Details
                    </Typography>
                    <Stack spacing={1}>
                      {stateRecords.map((record, index) => (
                        <Card
                          key={index}
                          sx={{
                            p: 2,
                            bgcolor: record.isUnplannedDowntime
                              ? 'error.lighter'
                              : 'background.neutral',
                            cursor: record.isUnplannedDowntime ? 'pointer' : 'default',
                            '&:hover': record.isUnplannedDowntime
                              ? {
                                  bgcolor: 'error.light',
                                }
                              : {},
                          }}
                          onClick={() => record.isUnplannedDowntime && handleBlockClick(record)}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {record.stateName || 'N/A'}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {dayjs(record.startTime).format('HH:mm:ss')} -{' '}
                                {record.endTime
                                  ? dayjs(record.endTime).format('HH:mm:ss')
                                  : t('oi.ongoing')}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {formatDuration(record.startTime, record.endTime)}
                              </Typography>
                              {record.isUnplannedDowntime && (
                                <Typography
                                  variant="caption"
                                  sx={{ color: 'error.main', fontWeight: 'bold' }}
                                >
                                  {t('oi.clickToLabel')}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Card>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            )}
          </Card>
        </Stack>
      )}

      {/* Label Downtime Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '70vh',
          },
        }}
      >
        <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {t('oi.labelDowntime')}
        </DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>{t('oi.state')}:</strong> {selectedRecord.stateName || 'N/A'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>{t('oi.startTime')}:</strong>{' '}
                {dayjs(selectedRecord.startTime).format('YYYY-MM-DD HH:mm:ss')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>{t('oi.endTime')}:</strong>{' '}
                {selectedRecord.endTime
                  ? dayjs(selectedRecord.endTime).format('YYYY-MM-DD HH:mm:ss')
                  : t('oi.ongoing')}
              </Typography>
              <Typography variant="body1">
                <strong>{t('oi.duration')}:</strong>{' '}
                {formatDuration(selectedRecord.startTime, selectedRecord.endTime)}
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            placeholder={t('oi.searchReason')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiInputBase-root': {
                fontSize: '1.25rem',
                minHeight: 56,
              },
            }}
            InputProps={{
              startAdornment: (
                <Iconify icon="eva:search-fill" sx={{ mr: 1, color: 'text.disabled' }} />
              ),
            }}
          />

          {loadingReasons ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={48} />
            </Box>
          ) : (
            <List sx={{ pt: 0, mb: 2 }}>
              {reasons.map((reason) => (
                <ListItem key={reason.id} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => handleSelectReason(reason)}
                    selected={selectedReason?.id === reason.id}
                    sx={{
                      borderRadius: 1,
                      border: 1,
                      borderColor: 'divider',
                      minHeight: 72,
                      '&.Mui-selected': {
                        bgcolor: 'action.selected',
                        borderColor: 'primary.main',
                        borderWidth: 2,
                      },
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemText
                      primary={reason.code || reason.name}
                      secondary={reason.name || 'N/A'}
                      primaryTypographyProps={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                      }}
                      secondaryTypographyProps={{
                        fontSize: '1rem',
                      }}
                    />
                    {selectedReason?.id === reason.id && (
                      <Iconify
                        icon="eva:checkmark-fill"
                        sx={{ color: 'primary.main', fontSize: 32 }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
              {reasons.length === 0 && !loadingReasons && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                    {t('oi.noReasonsFound')}
                  </Typography>
                </Box>
              )}
            </List>
          )}

          <TextField
            fullWidth
            multiline
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('oi.noteOptional')}
            InputProps={{
              sx: {
                fontSize: '1.1rem',
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseDialog}
            size="large"
            sx={{
              minHeight: 56,
              minWidth: 120,
              fontSize: '1.1rem',
            }}
          >
            {t('oi.cancel')}
          </Button>
          <Button
            onClick={handleSubmitLabel}
            variant="contained"
            disabled={!selectedReason}
            size="large"
            sx={{
              minHeight: 56,
              minWidth: 120,
              fontSize: '1.1rem',
            }}
          >
            {t('oi.submit')}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}

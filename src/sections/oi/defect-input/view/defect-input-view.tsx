import type { DefectReasonEntity, DefectedFromRunningMachineDto } from 'src/api/types/generated';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import { InputAdornment, CircularProgress } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { searchDefectReason } from 'src/api/services/generated/defect-reason';
import {
  getapiMachinemachineIddefecteditems,
  postapiMachinemachineIddefecteditemsaddnew,
} from 'src/api/services/generated/machine';

import { Iconify } from 'src/components/iconify';

import { useMachineSelector } from 'src/sections/oi/context';
import { MachineSelectorCard } from 'src/sections/oi/components';

// ----------------------------------------------------------------------

export function DefectInputView() {
  const { t } = useTranslation();
  const { selectedMachine } = useMachineSelector();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [defectReasons, setDefectReasons] = useState<DefectReasonEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDefectReason, setSelectedDefectReason] = useState<DefectReasonEntity | null>(null);
  const [scrapQuantity, setScrapQuantity] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [defectedItems, setDefectedItems] = useState<DefectedFromRunningMachineDto[]>([]);
  const [loadingDefectedItems, setLoadingDefectedItems] = useState(false);

  const handleOpenDefectDialog = () => {
    if (!selectedMachine) {
      return;
    }
    setDialogOpen(true);
    loadDefectReasons();
  };

  const handleCloseDefectDialog = () => {
    setDialogOpen(false);
    setSearchTerm('');
  };

  const loadDefectReasons = async (search: string = '') => {
    setLoading(true);
    try {
      const response = await searchDefectReason({ 
        searchText: search,
        maxResults: 50,
      });
      setDefectReasons(response.data || []);
    } catch (error) {
      console.error('Failed to load defect reasons:', error);
      setDefectReasons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDefectReason = (defectReason: DefectReasonEntity) => {
    setSelectedDefectReason(defectReason);
    handleCloseDefectDialog();
  };

  const loadDefectedItems = async () => {
    if (!selectedMachine || !selectedMachine.id) return;
    
    setLoadingDefectedItems(true);
    try {
      const response = await getapiMachinemachineIddefecteditems(selectedMachine.id);
      setDefectedItems(response.defectedItems || []);
    } catch (error) {
      console.error('Failed to load defected items:', error);
      setDefectedItems([]);
    } finally {
      setLoadingDefectedItems(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMachine || !selectedMachine.id || !selectedDefectReason || !selectedDefectReason.id || !scrapQuantity) {
      return;
    }

    try {
      await postapiMachinemachineIddefecteditemsaddnew(selectedMachine.id, {
        defectReasonId: selectedDefectReason.id,
        quantity: parseFloat(scrapQuantity),
        remark: notes || null,
      });

      // Show success message
      setSubmitSuccess(true);
      
      // Reload defected items list
      await loadDefectedItems();
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setSelectedDefectReason(null);
        setScrapQuantity('');
        setNotes('');
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit defect input:', error);
    }
  };

  const handleReset = () => {
    setSelectedDefectReason(null);
    setScrapQuantity('');
    setNotes('');
    setSubmitSuccess(false);
  };

  const isFormValid = selectedMachine && selectedDefectReason && scrapQuantity && parseFloat(scrapQuantity) > 0;

  useEffect(() => {
    if (dialogOpen) {
      loadDefectReasons(searchTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    if (selectedMachine) {
      loadDefectedItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMachine]);

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
          {t('oi.addDefectInput')}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
          {t('oi.addDefectInputDescription')}
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
              {t('oi.defectInputSubmitted')}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Defect Reason Selection */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 4, height: '100%' }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                  {t('oi.defectReason')}
                </Typography>
                {selectedDefectReason ? (
                  <Box>
                    <Box 
                      sx={{ 
                        p: 3, 
                        bgcolor: 'background.neutral', 
                        borderRadius: 2,
                        border: 2,
                        borderColor: 'primary.main',
                        mb: 2,
                      }}
                    >
                      <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                        {selectedDefectReason.code || selectedDefectReason.name}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                        {selectedDefectReason.name || 'N/A'}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleOpenDefectDialog}
                      startIcon={<Iconify icon="solar:pen-bold" />}
                      fullWidth
                      sx={{
                        minHeight: 64,
                        fontSize: '1.2rem',
                      }}
                    >
                      {t('oi.changeDefectReason')}
                    </Button>
                  </Box>
                ) : (
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
                      onClick={handleOpenDefectDialog}
                      startIcon={<Iconify icon={"eva:alert-circle-fill" as any} />}
                      sx={{
                        minHeight: 80,
                        minWidth: 280,
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {t('oi.selectDefectReason')}
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>

            {/* Scrap Quantity Input */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 4, height: '100%' }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                  {t('oi.scrapQuantity')}
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={scrapQuantity}
                  onChange={(e) => setScrapQuantity(e.target.value)}
                  placeholder="0"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                          {t('oi.pieces')}
                        </Typography>
                      </InputAdornment>
                    ),
                    sx: {
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      minHeight: 80,
                    }
                  }}
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('oi.notesOptional')}
                  InputProps={{
                    sx: {
                      fontSize: '1.1rem',
                    }
                  }}
                />
              </Card>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Card sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleReset}
                  fullWidth
                  startIcon={<Iconify icon={"eva:refresh-fill" as any} />}
                  sx={{
                    minHeight: 80,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  {t('oi.reset')}
                </Button>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  fullWidth
                  startIcon={<Iconify icon="solar:check-circle-bold" />}
                  sx={{
                    minHeight: 80,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  {t('oi.submitDefect')}
                </Button>
              </Grid>
            </Grid>
          </Card>

          {/* Defected Items Table */}
          <Card sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
              {t('oi.defectedItemsList')}
            </Typography>
            {loadingDefectedItems ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={48} />
              </Box>
            ) : defectedItems.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                  {t('oi.noDefectedItems')}
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('oi.defectReason')}</TableCell>
                      <TableCell align="right">{t('oi.quantity')}</TableCell>
                      <TableCell>{t('oi.notes')}</TableCell>
                      <TableCell>{t('common.createdAt')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {defectedItems.map((item, index) => (
                      <TableRow key={`${item.defectReasonName}-${item.createdAt}-${index}`}>
                        <TableCell>{item.defectReasonName || '-'}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell>{item.extraNote || '-'}</TableCell>
                        <TableCell>
                          {item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Stack>
      )}

      {/* Defect Reason Selection Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDefectDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '70vh',
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {t('oi.selectDefectReason')}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder={t('oi.searchDefectReason')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              mb: 3,
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
            <Grid container spacing={2}>
              {defectReasons.map((defectReason) => (
                <Grid key={defectReason.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      border: 2,
                      borderColor: selectedDefectReason?.id === defectReason.id ? 'primary.main' : 'divider',
                      bgcolor: selectedDefectReason?.id === defectReason.id ? 'action.selected' : 'background.paper',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        borderColor: 'primary.main',
                      }
                    }}
                    onClick={() => handleSelectDefectReason(defectReason)}
                  >
                    <Stack spacing={1.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Chip
                          label={defectReason.code || defectReason.name}
                          sx={{
                            bgcolor: defectReason.colorHex || 'primary.main',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                          }}
                        />
                        {selectedDefectReason?.id === defectReason.id && (
                          <Iconify 
                            icon={"eva:checkmark-circle-fill" as any}
                            sx={{ color: 'primary.main', fontSize: 24 }} 
                          />
                        )}
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 'medium', fontSize: '1.1rem' }}>
                        {defectReason.name || 'N/A'}
                      </Typography>
                      {defectReason.description && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                          {defectReason.description}
                        </Typography>
                      )}
                    </Stack>
                  </Card>
                </Grid>
              ))}
              {defectReasons.length === 0 && !loading && (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                      {t('oi.noDefectReasonsFound')}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleCloseDefectDialog}
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
    </DashboardContent>
  );
}

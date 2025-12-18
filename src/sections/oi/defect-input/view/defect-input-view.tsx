import type { DefectReasonEntity } from 'src/api/types/generated';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { List, ListItem, ListItemButton, ListItemText, CircularProgress, Alert, InputAdornment } from '@mui/material';

import { useTranslation } from 'react-i18next';

import { searchDefectReason } from 'src/api/services/generated/defect-reason';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { useMachineSelector } from '../context/machine-selector-context';
import { MachineSelectorCard } from '../components/machine-selector-card';

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
        searchTerm: search,
        pageSize: 50,
      });
      setDefectReasons(response.data?.items || []);
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

  const handleSubmit = async () => {
    if (!selectedMachine || !selectedDefectReason || !scrapQuantity) {
      return;
    }

    // TODO: Implement API call to submit defect input
    console.log('Submitting defect input:', {
      machineId: selectedMachine.id,
      defectReasonId: selectedDefectReason.id,
      scrapQuantity: parseFloat(scrapQuantity),
      notes,
    });

    // Show success message
    setSubmitSuccess(true);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setSelectedDefectReason(null);
      setScrapQuantity('');
      setNotes('');
      setSubmitSuccess(false);
    }, 2000);
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
                      startIcon={<Iconify icon="solar:danger-circle-bold" />}
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
                  startIcon={<Iconify icon="solar:refresh-bold" />}
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
        </Stack>
      )}

      {/* Defect Reason Selection Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDefectDialog}
        maxWidth="md"
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
              {defectReasons.map((defectReason) => (
                <ListItem key={defectReason.id} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => handleSelectDefectReason(defectReason)}
                    selected={selectedDefectReason?.id === defectReason.id}
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
                      }
                    }}
                  >
                    <ListItemText
                      primary={defectReason.code || defectReason.name}
                      secondary={defectReason.name || 'N/A'}
                      primaryTypographyProps={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                      }}
                      secondaryTypographyProps={{
                        fontSize: '1rem',
                      }}
                    />
                    {selectedDefectReason?.id === defectReason.id && (
                      <Iconify 
                        icon="eva:checkmark-circle-2-fill" 
                        sx={{ color: 'primary.main', fontSize: 32 }} 
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
              {defectReasons.length === 0 && !loading && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                    {t('oi.noDefectReasonsFound')}
                  </Typography>
                </Box>
              )}
            </List>
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

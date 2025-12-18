import type { MachineEntity } from 'src/api/types/generated';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { List, ListItem, ListItemButton, ListItemText, CircularProgress } from '@mui/material';

import { useTranslation } from 'react-i18next';

import { searchMachine } from 'src/api/services/generated/machine';

import { Iconify } from 'src/components/iconify';

import { useMachineSelector } from '../context/machine-selector-context';

// ----------------------------------------------------------------------

export function MachineSelectorCard() {
  const { t } = useTranslation();
  const { selectedMachine, setSelectedMachine } = useMachineSelector();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [machines, setMachines] = useState<MachineEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenDialog = () => {
    setDialogOpen(true);
    loadMachines();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSearchTerm('');
  };

  const loadMachines = async (search: string = '') => {
    setLoading(true);
    try {
      const response = await searchMachine({ 
        searchTerm: search,
        pageSize: 50,
      });
      setMachines(response.data?.items || []);
    } catch (error) {
      console.error('Failed to load machines:', error);
      setMachines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMachine = (machine: MachineEntity) => {
    setSelectedMachine(machine);
    handleCloseDialog();
  };

  useEffect(() => {
    if (dialogOpen) {
      loadMachines(searchTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <>
      <Card 
        sx={{ 
          p: 4, 
          mb: 4,
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {t('oi.selectedMachine')}
            </Typography>
            {selectedMachine ? (
              <Box>
                <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 'bold' }}>
                  {selectedMachine.code || selectedMachine.name}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  {selectedMachine.name || 'N/A'}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                {t('oi.noMachineSelected')}
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={handleOpenDialog}
            startIcon={<Iconify icon="solar:widget-4-bold" />}
            sx={{
              minHeight: 64,
              minWidth: 200,
              fontSize: '1.25rem',
              fontWeight: 'bold',
            }}
          >
            {selectedMachine ? t('oi.changeMachine') : t('oi.selectMachine')}
          </Button>
        </Box>
      </Card>

      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '70vh',
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {t('oi.selectMachine')}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder={t('oi.searchMachine')}
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
              {machines.map((machine) => (
                <ListItem key={machine.id} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => handleSelectMachine(machine)}
                    selected={selectedMachine?.id === machine.id}
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
                      primary={machine.code || machine.name}
                      secondary={machine.name || 'N/A'}
                      primaryTypographyProps={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                      }}
                      secondaryTypographyProps={{
                        fontSize: '1rem',
                      }}
                    />
                    {selectedMachine?.id === machine.id && (
                      <Iconify 
                        icon="eva:checkmark-circle-2-fill" 
                        sx={{ color: 'primary.main', fontSize: 32 }} 
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
              {machines.length === 0 && !loading && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                    {t('oi.noMachinesFound')}
                  </Typography>
                </Box>
              )}
            </List>
          )}
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
            {t('common.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

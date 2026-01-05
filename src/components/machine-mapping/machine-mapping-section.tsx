import type { ChangeEvent } from 'react';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
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
import { MachineTypeSelector } from 'src/components/selectors/machine-type-selector';
import { MachineGroupSelector } from 'src/components/selectors/machine-group-selector';

// ----------------------------------------------------------------------

export interface MappedMachine {
  mappingId: string;
  machineName: string;
}

export interface AvailableMachine {
  machineId: string;
  machineName: string;
}

interface MachineMappingSectionProps {
  disabled?: boolean;
  entityId?: string | null;
  mappedMachines: MappedMachine[];
  isLoadingMapped: boolean;
  availableMachines: AvailableMachine[];
  isLoadingAvailable: boolean;
  onSearchAvailable: (machineTypeId: string | null, machineGroupId: string | null) => void;
  onAddMachines: (machineIds: string[]) => Promise<void>;
  onRemoveMapping: (mappingId: string) => Promise<void>;
}

export function MachineMappingSection({
  disabled = false,
  entityId,
  mappedMachines,
  isLoadingMapped,
  availableMachines,
  isLoadingAvailable,
  onSearchAvailable,
  onAddMachines,
  onRemoveMapping,
}: MachineMappingSectionProps) {
  const [machineTypeId, setMachineTypeId] = useState<string | null>(null);
  const [machineGroupId, setMachineGroupId] = useState<string | null>(null);
  const [selectedMachineIds, setSelectedMachineIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleMachineTypeChange = useCallback(
    (value: string | null) => {
      setMachineTypeId(value);
      onSearchAvailable(value, machineGroupId);
    },
    [machineGroupId, onSearchAvailable]
  );

  const handleMachineGroupChange = useCallback(
    (value: string | null) => {
      setMachineGroupId(value);
      onSearchAvailable(machineTypeId, value);
    },
    [machineTypeId, onSearchAvailable]
  );

  const handleSelectAll = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const filteredMachines = availableMachines.filter((machine) =>
          machine.machineName?.toLowerCase().includes(searchText.toLowerCase())
        );
        setSelectedMachineIds(filteredMachines.map((m) => m.machineId));
      } else {
        setSelectedMachineIds([]);
      }
    },
    [availableMachines, searchText]
  );

  const handleSelectOne = useCallback((machineId: string) => {
    setSelectedMachineIds((prev) =>
      prev.includes(machineId) ? prev.filter((id) => id !== machineId) : [...prev, machineId]
    );
  }, []);

  const handleAddSelected = useCallback(async () => {
    if (selectedMachineIds.length === 0) {
      setErrorMessage('Please select at least one machine');
      return;
    }

    setIsAdding(true);
    setErrorMessage(null);

    try {
      await onAddMachines(selectedMachineIds);
      setSuccessMessage(`Successfully added ${selectedMachineIds.length} machine(s)`);
      setSelectedMachineIds([]);
      // Clear filters after successful add
      setMachineTypeId(null);
      setMachineGroupId(null);
      setSearchText('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to add machines');
    } finally {
      setIsAdding(false);
    }
  }, [selectedMachineIds, onAddMachines]);

  const handleRemoveMapping = useCallback(
    async (mappingId: string) => {
      try {
        await onRemoveMapping(mappingId);
        setSuccessMessage('Successfully removed machine mapping');
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to remove mapping');
      }
    },
    [onRemoveMapping]
  );

  const handleCloseSnackbar = useCallback(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, []);

  const filteredAvailableMachines = availableMachines.filter((machine) =>
    machine.machineName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const isAllSelected =
    filteredAvailableMachines.length > 0 &&
    filteredAvailableMachines.every((machine) => selectedMachineIds.includes(machine.machineId));

  if (disabled || !entityId) {
    return (
      <Card sx={{ p: 3, bgcolor: 'background.neutral' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
          <Typography variant="body2" color="text.secondary">
            Machine mapping will be available after creating the entity. Please save the form first.
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Machine Mapping
      </Typography>

      <Grid container spacing={3}>
        {/* Mapped Machines Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Mapped Machines ({mappedMachines.length})
          </Typography>
          <TableContainer sx={{ maxHeight: 400, border: 1, borderColor: 'divider', borderRadius: 1 }}>
            {isLoadingMapped ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={32} />
              </Box>
            ) : (
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Machine Name</TableCell>
                    <TableCell align="right" width={80}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mappedMachines.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                          No mapped machines yet
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    mappedMachines.map((machine) => (
                      <TableRow key={machine.mappingId} hover>
                        <TableCell>{machine.machineName}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveMapping(machine.mappingId)}
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

        {/* Available Machines Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Add Machines
          </Typography>

          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <MachineTypeSelector
                label="Machine Type"
                value={machineTypeId}
                onChange={handleMachineTypeChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <MachineGroupSelector
                label="Machine Group"
                value={machineGroupId}
                onChange={handleMachineGroupChange}
              />
            </Grid>
          </Grid>

          {/* Search */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search machines..."
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

          {/* Available machines table */}
          <TableContainer sx={{ maxHeight: 300, border: 1, borderColor: 'divider', borderRadius: 1 }}>
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
                          selectedMachineIds.length > 0 &&
                          selectedMachineIds.length < filteredAvailableMachines.length
                        }
                        onChange={handleSelectAll}
                        disabled={filteredAvailableMachines.length === 0}
                      />
                    </TableCell>
                    <TableCell>Machine Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAvailableMachines.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                          {machineTypeId || machineGroupId
                            ? 'No available machines found'
                            : 'Select machine type or group to search'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAvailableMachines.map((machine) => (
                      <TableRow
                        key={machine.machineId}
                        hover
                        onClick={() => handleSelectOne(machine.machineId)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedMachineIds.includes(machine.machineId)} />
                        </TableCell>
                        <TableCell>{machine.machineName}</TableCell>
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
              disabled={selectedMachineIds.length === 0 || isAdding}
            >
              {isAdding ? <CircularProgress size={24} /> : `Add Selected (${selectedMachineIds.length})`}
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

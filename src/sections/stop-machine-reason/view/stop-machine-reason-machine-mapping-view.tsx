import type { ChangeEvent } from 'react';
import type { MappedMachine, AvailableMachine } from 'src/components/machine-mapping';

import { List } from 'react-window';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useGetStopMachineReasonById,
  usePostapiStopMachineReasonaddmachinestopreasonmapping,
  useGetapiStopMachineReasongetstopreasonmappingsbyreasonidreasonId,
  useDeleteapiStopMachineReasondeletestopmachinereasonmappingmappingId,
  useGetapiStopMachineReasongetavailablemachinesforstopreasonstopReasonId,
} from 'src/api/hooks/generated/use-stop-machine-reason';

import { Iconify } from 'src/components/iconify';
import { MachineTypeSelector } from 'src/components/selectors/machine-type-selector';
import { MachineGroupSelector } from 'src/components/selectors/machine-group-selector';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 72;

interface StopMachineReasonMachineMappingViewProps {
  // Optional props if needed
}

export function StopMachineReasonMachineMappingView(
  props: StopMachineReasonMachineMappingViewProps
) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [machineTypeId, setMachineTypeId] = useState<string | null>(null);
  const [machineGroupId, setMachineGroupId] = useState<string | null>(null);
  const [selectedMachineIds, setSelectedMachineIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [availableMachines, setAvailableMachines] = useState<AvailableMachine[]>([]);
  const [mappedSearchText, setMappedSearchText] = useState('');
  const [searchParams, setSearchParams] = useState<{
    machineTypeId?: string;
    machineGroupId?: string;
  } | null>(null);

  // Fetch stop machine reason data
  const { data: reasonData, isLoading: isLoadingReason } = useGetStopMachineReasonById(id || '', {
    enabled: !!id,
  });

  // Fetch mapped machines
  const {
    data: mappedMachinesData,
    isLoading: isLoadingMapped,
    refetch: refetchMappedMachines,
  } = useGetapiStopMachineReasongetstopreasonmappingsbyreasonidreasonId(
    id || '',
    { search: mappedSearchText },
    {
      enabled: !!id,
    }
  );

  // Get available machines query
  const {
    data: availableMachinesData,
    isLoading: isLoadingAvailable,
    refetch: refetchAvailableMachines,
  } = useGetapiStopMachineReasongetavailablemachinesforstopreasonstopReasonId(
    id || '',
    searchParams || undefined,
    {
      enabled: false, // We'll manually trigger this with refetch
    }
  );

  // Update available machines when data changes
  useEffect(() => {
    if (availableMachinesData) {
      setAvailableMachines(
        availableMachinesData.map((machine) => ({
          machineId: String(machine.machineId),
          machineName: machine.machineName || '',
        }))
      );
    }
  }, [availableMachinesData]);

  // Delete mapping mutation
  const { mutate: deleteMappingMutate } =
    useDeleteapiStopMachineReasondeletestopmachinereasonmappingmappingId({
      onSuccess: () => {
        refetchMappedMachines();
      },
      onError: (error) => {
        setErrorMessage(error.message || 'Failed to remove mapping');
      },
    });

  // Add mapping mutation
  const { mutate: addMappingMutate } = usePostapiStopMachineReasonaddmachinestopreasonmapping({
    onSuccess: () => {
      refetchMappedMachines();
      setAvailableMachines([]);
      setSelectedMachineIds([]);
      setMachineTypeId(null);
      setMachineGroupId(null);
      setSearchText('');
    },
    onError: (error) => {
      setErrorMessage(error.message || 'Failed to add machines');
    },
  });

  const mappedMachines: MappedMachine[] =
    mappedMachinesData?.map((machine) => ({
      mappingId: String(machine.mappingId),
      machineName: machine.machineName || '',
    })) || [];

  const handleMachineTypeChange = useCallback(
    (value: string | null) => {
      setMachineTypeId(value);
      if (id && (value || machineGroupId)) {
        setSearchParams({
          machineTypeId: value || undefined,
          machineGroupId: machineGroupId || undefined,
        });
        refetchAvailableMachines();
      } else {
        setAvailableMachines([]);
        setSearchParams(null);
      }
    },
    [id, machineGroupId, refetchAvailableMachines]
  );

  const handleMachineGroupChange = useCallback(
    (value: string | null) => {
      setMachineGroupId(value);
      if (id && (machineTypeId || value)) {
        setSearchParams({
          machineTypeId: machineTypeId || undefined,
          machineGroupId: value || undefined,
        });
        refetchAvailableMachines();
      } else {
        setAvailableMachines([]);
        setSearchParams(null);
      }
    },
    [id, machineTypeId, refetchAvailableMachines]
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
      prev.includes(machineId) ? prev.filter((mid) => mid !== machineId) : [...prev, machineId]
    );
  }, []);

  const handleAddSelected = useCallback(async () => {
    if (selectedMachineIds.length === 0) {
      setErrorMessage('Please select at least one machine');
      return;
    }

    if (!id) {
      setErrorMessage('Stop reason ID is required');
      return;
    }

    setIsAdding(true);
    setErrorMessage(null);

    try {
      addMappingMutate({
        data: {
          stopReasonId: id,
          machineIds: selectedMachineIds,
        },
      });
      setSuccessMessage(`Successfully added ${selectedMachineIds.length} machine(s)`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to add machines');
    } finally {
      setIsAdding(false);
    }
  }, [selectedMachineIds, id, addMappingMutate]);

  const handleRemoveMapping = useCallback(
    async (mappingId: string) => {
      try {
        deleteMappingMutate({ mappingId });
        setSuccessMessage('Successfully removed machine mapping');
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to remove mapping');
      }
    },
    [deleteMappingMutate]
  );

  const handleCloseSnackbar = useCallback(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, []);

  const handleBack = useCallback(() => {
    navigate(`/stop-machine-reason/edit/${id}`);
  }, [navigate, id]);

  const filteredAvailableMachines = availableMachines.filter((machine) =>
    machine.machineName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const isAllSelected =
    filteredAvailableMachines.length > 0 &&
    filteredAvailableMachines.every((machine) => selectedMachineIds.includes(machine.machineId));

  // Render row for mapped machines - component for List
  const MappedMachineRow = ({ index, style, ariaAttributes }: any) => {
    const machine = mappedMachines[index];
    return (
      <Box
        {...ariaAttributes}
        style={style}
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1,
          borderBottom: 1,
          borderColor: 'divider',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Typography sx={{ flexGrow: 1 }}>{machine.machineName}</Typography>
        <IconButton
          size="small"
          color="error"
          onClick={() => handleRemoveMapping(machine.mappingId)}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      </Box>
    );
  };

  // Render row for available machines - component for List
  const AvailableMachineRow = ({ index, style, ariaAttributes }: any) => {
    const machine = filteredAvailableMachines[index];
    const isSelected = selectedMachineIds.includes(machine.machineId);

    return (
      <Box
        {...ariaAttributes}
        style={style}
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1,
          borderBottom: 1,
          borderColor: 'divider',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
        onClick={() => handleSelectOne(machine.machineId)}
      >
        <Checkbox checked={isSelected} sx={{ mr: 1 }} />
        <Typography sx={{ flexGrow: 1 }}>{machine.machineName}</Typography>
      </Box>
    );
  };

  if (isLoadingReason) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      {/* Page Header */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <Iconify icon="eva:arrow-back-fill" />
          </IconButton>
          <Typography variant="h4">
            Machine Mapping - {reasonData?.name || 'Stop Reason'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 6 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Stop Machine Reason
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            Machine Mapping
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Mapped Machines Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: 'calc(100vh - 250px)' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Mapped Machines ({mappedMachines.length})
            </Typography>

            {/* Search for mapped machines */}
            <TextField
              fullWidth
              size="small"
              placeholder="Search mapped machines..."
              value={mappedSearchText}
              onChange={(e) => setMappedSearchText(e.target.value)}
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

            <Box
              sx={{
                height: 'calc(100% - 110px)',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              {isLoadingMapped ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : mappedMachines.length === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No mapped machines yet
                  </Typography>
                </Box>
              ) : (
                <List
                  style={{ height: window.innerHeight - 410, width: '100%' }}
                  rowCount={mappedMachines.length}
                  rowHeight={ITEM_HEIGHT}
                  rowComponent={MappedMachineRow}
                  rowProps={{}}
                />
              )}
            </Box>
          </Card>
        </Grid>

        {/* Available Machines Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: 'calc(100vh - 250px)' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
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

            {/* Select All Checkbox */}
            {filteredAvailableMachines.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, px: 2 }}>
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={
                    selectedMachineIds.length > 0 &&
                    selectedMachineIds.length < filteredAvailableMachines.length
                  }
                  onChange={handleSelectAll}
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Select All
                </Typography>
              </Box>
            )}

            {/* Available machines list */}
            <Box
              sx={{
                height: 'calc(100% - 280px)',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              {isLoadingAvailable ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : filteredAvailableMachines.length === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {machineTypeId || machineGroupId
                      ? 'No available machines found'
                      : 'Select machine type or group to search'}
                  </Typography>
                </Box>
              ) : (
                <List
                  style={{ height: window.innerHeight - 530, width: '100%' }}
                  rowCount={filteredAvailableMachines.length}
                  rowHeight={ITEM_HEIGHT}
                  rowComponent={AvailableMachineRow}
                  rowProps={{}}
                />
              )}
            </Box>

            {/* Add button */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleAddSelected}
                disabled={selectedMachineIds.length === 0 || isAdding}
              >
                {isAdding ? (
                  <CircularProgress size={24} />
                ) : (
                  `Add Selected (${selectedMachineIds.length})`
                )}
              </Button>
            </Box>
          </Card>
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
    </DashboardContent>
  );
}

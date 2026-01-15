import type { MachineOeeUpdate } from 'src/services/machineHub';
import type { GetAreaNamesResult, SearchMachineByAreaResult } from 'src/api/types/generated';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { apiConfig } from 'src/api/config';
import { MachineHubService } from 'src/services/machineHub';
import { getapiAreaminimalnames, getapiAreasearchmachines } from 'src/api/services/generated/area';

import { Iconify } from 'src/components/iconify';

import { MachineCard } from '../components';

// ----------------------------------------------------------------------

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// ----------------------------------------------------------------------

export function MachineDashboardView() {
  const [machines, setMachines] = useState<SearchMachineByAreaResult[]>([]);
  const [areas, setAreas] = useState<GetAreaNamesResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Store OEE data for each machine
  const [machineOeeData, setMachineOeeData] = useState<Map<string, MachineOeeUpdate>>(new Map());
  const [loadingMachines, setLoadingMachines] = useState<Set<string>>(new Set());

  const hubService = MachineHubService.getInstance(apiConfig.baseUrl);

  // Load areas for filter
  useEffect(() => {
    const loadAreas = async () => {
      try {
        const areaList = await getapiAreaminimalnames();
        setAreas(Array.isArray(areaList) ? areaList : []);
      } catch (error) {
        console.error('Failed to load areas:', error);
        setAreas([]);
      }
    };
    loadAreas();
  }, []);

  // Load machines based on search and filters
  const loadMachines = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getapiAreasearchmachines({
        areaIds: selectedAreas.length > 0 ? selectedAreas : undefined,
        searchText: searchTerm || undefined,
      });

      let machineData = Array.isArray(response) ? response : [];
      
      // Add mock data for visual testing if no real data (dev mode only)
      if (machineData.length === 0 && import.meta.env.DEV) {
        machineData = [
          {
            machineId: 'mock-1',
            machineName: 'CNC Machine A1',
            areaName: 'Production Line 1',
            areaHexColor: '#3b82f6',
            currentRunState: 'running' as const,
          },
          {
            machineId: 'mock-2',
            machineName: 'Injection Molding B2',
            areaName: 'Production Line 2',
            areaHexColor: '#10b981',
            currentRunState: 'speedLoss' as const,
          },
          {
            machineId: 'mock-3',
            machineName: 'Assembly Robot C3',
            areaName: 'Assembly Area',
            areaHexColor: '#f59e0b',
            currentRunState: 'running' as const,
          },
          {
            machineId: 'mock-4',
            machineName: 'Packaging Unit D4',
            areaName: 'Packaging Area',
            areaHexColor: '#8b5cf6',
            currentRunState: 'unPlannedDowntime' as const,
          },
          {
            machineId: 'mock-5',
            machineName: 'Quality Check E5',
            areaName: 'QC Department',
            areaHexColor: '#ec4899',
            currentRunState: 'running' as const,
          },
          {
            machineId: 'mock-6',
            machineName: 'Laser Cutter F6',
            areaName: 'Cutting Area',
            areaHexColor: '#06b6d4',
            currentRunState: 'speedLoss' as const,
          },
        ];
      }
      
      setMachines(machineData);
    } catch (error) {
      console.error('Failed to load machines:', error);
      setMachines([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedAreas]);

  useEffect(() => {
    loadMachines();
  }, [loadMachines]);

  // Subscribe to machine updates via SignalR
  useEffect(() => {
    if (machines.length === 0) return undefined;

    let mounted = true;

    const connectToMachines = async () => {
      try {
        // Mark all machines as loading
        setLoadingMachines(new Set(machines.map((m) => m.machineId || '')));

        // Subscribe to each machine
        for (const machine of machines) {
          if (!machine.machineId) continue;
          
          const handleUpdate = (update: MachineOeeUpdate) => {
            if (mounted) {
              setMachineOeeData((prev) => {
                const newMap = new Map(prev);
                newMap.set(update.machineId, update);
                return newMap;
              });
              setLoadingMachines((prev) => {
                const newSet = new Set(prev);
                newSet.delete(update.machineId);
                return newSet;
              });
            }
          };

          await hubService.subscribeToMachine(
            machine.machineId,
            handleUpdate,
            () => {} // No runtime block callback needed for dashboard
          );

          // Try to get initial aggregation. I have removed it because server will broadcast immediately after subscription
        }
      } catch (error) {
        console.error('Failed to connect to machines:', error);
      }
    };

    connectToMachines();

    return () => {
      mounted = false;
      // Unsubscribe from all machines
      machines.forEach((machine) => {
        if (machine.machineId) {
          hubService.unsubscribeFromMachine(machine.machineId).catch(console.error);
        }
      });
    };
  }, [machines, hubService]);

  const getAreaName = (areaId?: string) => {
    if (!areaId) return 'Unknown';
    const area = areas.find((a) => a.id === areaId);
    return area?.name || 'Unknown';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="xl">
        {/* Header with animation */}
        <motion.div initial="hidden" animate="visible" variants={headerVariants as any}>
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
                Machine Dashboard
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Real-time monitoring of all machines
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Iconify icon="solar:settings-bold-duotone" />}
              onClick={() => setSettingsOpen(true)}
              sx={{ minWidth: 140 }}
            >
              Settings
            </Button>
          </Box>
        </motion.div>

        {/* Machine Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
            <CircularProgress size={64} />
          </Box>
        ) : machines.length === 0 ? (
          <Alert severity="info" sx={{ fontSize: '1.1rem' }}>
            No machines found. Click Settings to configure which machines to display.
          </Alert>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={containerVariants as any}>
            <Grid container spacing={3}>
              {machines.map((machine) => (
                <Grid key={machine.machineId} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <motion.div variants={cardVariants as any}>
                    <MachineCard
                      machineId={machine.machineId || ''}
                      machineName={machine.machineName || 'Unknown'}
                      oeeData={machineOeeData.get(machine.machineId || '') || null}
                      isLoading={loadingMachines.has(machine.machineId || '')}
                      areaColor={machine.areaHexColor}
                    />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}
      </Container>

      {/* Settings Dialog */}
      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Dashboard Settings
            </Typography>
            <IconButton onClick={() => setSettingsOpen(false)}>
              <Iconify icon="eva:close-outline" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Search Input */}
            <TextField
              fullWidth
              placeholder="Search machines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <Iconify icon="eva:search-fill" sx={{ mr: 1, color: 'text.disabled' }} />
                  ),
                },
              }}
            />

            {/* Area Filter */}
            <FormControl fullWidth>
              <InputLabel>Filter by Area</InputLabel>
              <Select
                multiple
                value={selectedAreas}
                onChange={(e) =>
                  setSelectedAreas(
                    typeof e.target.value === 'string'
                      ? e.target.value.split(',')
                      : e.target.value
                  )
                }
                input={<OutlinedInput label="Filter by Area" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={getAreaName(value)} size="small" />
                    ))}
                  </Box>
                )}
              >
                {Array.isArray(areas) &&
                  areas.map((area) => (
                    <MenuItem key={area.id} value={area.id}>
                      {area.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <Alert severity="info">
              Select areas to filter machines, or leave empty to show all machines.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => {
              loadMachines();
              setSettingsOpen(false);
            }}
            variant="contained"
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

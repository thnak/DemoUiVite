import type { GetAreaNamesResult, SearchMachineByAreaResult } from 'src/api/types/generated';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { apiConfig } from 'src/api/config';
import { getapiAreaminimalnames, getapiAreasearchmachines } from 'src/api/services/generated/area';

import { Iconify } from 'src/components/iconify';

import { useMachineSelector } from '../../context';

// ----------------------------------------------------------------------

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// ----------------------------------------------------------------------

export function MachineSelectionView() {
  const router = useRouter();
  const { setSelectedMachine } = useMachineSelector();

  const [machines, setMachines] = useState<SearchMachineByAreaResult[]>([]);
  const [areas, setAreas] = useState<GetAreaNamesResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);

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

  const handleMachineSelect = (machine: SearchMachineByAreaResult) => {
    // Store the machine info
    const machineData = {
      id: machine.machineId,
      name: machine.machineName,
      code: machine.machineName,
      areaId: machine.machineId, // Will be updated when we have area mapping
    };
    setSelectedMachine(machineData as any);
    router.push('/oi/operation');
  };

  const getAreaName = (areaId?: string) => {
    if (!areaId) return 'Unknown';
    const area = areas.find((a) => a.id === areaId);
    return area?.name || 'Unknown';
  };

  // Carousel scroll handlers
  const handleScrollLeft = () => {
    const container = document.getElementById('machine-carousel');
    if (container) {
      const newPosition = Math.max(0, scrollPosition - 400);
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  const handleScrollRight = () => {
    const container = document.getElementById('machine-carousel');
    if (container) {
      const newPosition = scrollPosition + 400;
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
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
          <Box sx={{ mb: 5 }}>
            <Typography variant="h2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Operator Dashboard
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Hệ thống quản lý sản xuất thời gian thực
            </Typography>
          </Box>
        </motion.div>

        {/* Search and Filter Section - Horizontal Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card sx={{ p: 2, mb: 4, ml: 4, mr: 4 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              {/* Search Input */}
              <TextField
                fullWidth
                placeholder="Tìm kiếm máy..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  flex: 3,
                  '& .MuiInputBase-root': {
                    fontSize: '1.125rem',
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <Iconify icon="eva:search-fill" sx={{ mr: 1, color: 'text.disabled', width: 24, height: 24 }} />
                    ),
                  }
                }}
              />

              {/* Area Filter */}
              <FormControl sx={{ flex: 1, minWidth: { xs: '100%', md: 300 } }}>
                <InputLabel>Tất cả khu vực</InputLabel>
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
                  input={<OutlinedInput label="Tất cả khu vực" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={getAreaName(value)} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {Array.isArray(areas) && areas.map((area) => (
                    <MenuItem key={area.id} value={area.id}>
                      {area.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Card>
        </motion.div>

        {/* Machine Carousel with Scroll Buttons */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
            <CircularProgress size={64} />
          </Box>
        ) : machines.length === 0 ? (
          <Alert severity="info" sx={{ fontSize: '1.1rem' }}>
            Không tìm thấy máy nào
          </Alert>
        ) : (
          <Box sx={{ position: 'relative' }}>
            {/* Scroll Left Button */}
            {scrollPosition > 0 && (
              <IconButton
                onClick={handleScrollLeft}
                sx={{
                  position: 'absolute',
                  left: -20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  bgcolor: 'background.paper',
                  boxShadow: 3,
                  '&:hover': {
                    bgcolor: 'background.paper',
                  },
                }}
              >
                <Iconify icon="eva:arrow-back-fill" width={24} />
              </IconButton>
            )}

            {/* Machine Cards Container */}
            <motion.div initial="hidden" animate="visible" variants={containerVariants as any}>
              <Box
                id="machine-carousel"
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)',
                  },
                  gap: 3,
                  pb: 2,
                }}
              >
                {machines.map((machine) => {
                  const runStateConfig = {
                    running: { label: 'Running', color: '#22c55e', icon: 'solar:play-circle-bold' as const },
                    speedLoss: { label: 'Speed Loss', color: '#f59e0b', icon: 'mdi:speedometer' as const },
                    unPlannedDowntime: { label: 'Unplanned Downtime', color: '#ef4444', icon: 'solar:danger-triangle-bold-duotone' as const },
                    plannedDowntime: { label: 'Planned Downtime', color: '#64748b', icon: 'solar:danger-triangle-bold-duotone' as const },
                    testMode: { label: 'Test Mode', color: '#8b5cf6', icon: 'solar:test-tube-bold' as const },
                  };
                  const currentState = machine.currentRunState ? runStateConfig[machine.currentRunState] : null;
                  
                  return (
                    <motion.div key={machine.machineId} variants={cardVariants as any}>
                      <Card
                        sx={{
                          height: '100%',
                          position: 'relative',
                          overflow: 'hidden',
                          borderTop: 4,
                          borderColor: machine.areaHexColor || 'primary.main',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: 6,
                          },
                        }}
                      >
                        {/* Machine Image with Curve/Cut Effect */}
                        <Box
                          sx={{
                            height: 180,
                            bgcolor: machine.areaHexColor ? `${machine.areaHexColor}15` : 'background.neutral',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            position: 'relative',
                            clipPath: 'ellipse(100% 100% at 50% 0%)',
                          }}
                        >
                          <img
                            src={`${apiConfig.baseUrl}/api/Machine/${machine.machineId}/image`}
                            alt={machine.machineName || ''}
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent && !parent.querySelector('.fallback-icon')) {
                                const icon = document.createElement('div');
                                icon.className = 'fallback-icon';
                                icon.style.fontSize = '72px';
                                icon.innerHTML = '🏭';
                                parent.appendChild(icon);
                              }
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          
                          {/* Run State Badge */}
                          {currentState && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                bgcolor: currentState.color,
                                color: 'white',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 2,
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                boxShadow: 2,
                              }}
                            >
                              <Iconify icon={currentState.icon} width={16} />
                              {currentState.label}
                            </Box>
                          )}
                        </Box>

                        {/* Machine Info */}
                        <Box sx={{ p: 3 }}>
                          <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                            {machine.machineName}
                          </Typography>
                          
                          {/* Area Name - Small Text without Chip */}
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'block',
                              color: 'text.secondary',
                              mb: 2
                            }}
                          >
                            {machine.areaName || 'Unknown Area'}
                          </Typography>

                          {/* Access Button with Area Color */}
                          <Box
                            onClick={() => handleMachineSelect(machine)}
                            sx={{
                              mt: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 1,
                              bgcolor: machine.areaHexColor || 'primary.main',
                              color: 'white',
                              py: 1.5,
                              px: 3,
                              borderRadius: 1,
                              fontWeight: 'medium',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                opacity: 0.9,
                                transform: 'scale(1.02)',
                              },
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              TRUY CẬP
                            </Typography>
                            <Iconify icon="eva:arrow-ios-forward-fill" width={20} />
                          </Box>
                        </Box>
                      </Card>
                    </motion.div>
                  );
                })}
              </Box>
            </motion.div>

            {/* Scroll Right Button */}
            <IconButton
              onClick={handleScrollRight}
              sx={{
                position: 'absolute',
                right: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'background.paper',
                boxShadow: 3,
                '&:hover': {
                  bgcolor: 'background.paper',
                },
              }}
            >
              <Iconify icon="eva:arrow-ios-forward-fill" width={24} />
            </IconButton>
          </Box>
        )}
      </Container>
    </Box>
  );
}

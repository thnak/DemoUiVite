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
import CardActionArea from '@mui/material/CardActionArea';
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
        setAreas(areaList || []);
      } catch (error) {
        console.error('Failed to load areas:', error);
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

      setMachines(response || []);
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

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card sx={{ p: 3, mb: 4 }}>
            <Stack spacing={3}>
              {/* Search Input */}
              <TextField
                fullWidth
                placeholder="Tìm kiếm máy..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Iconify icon="eva:search-fill" sx={{ mr: 1, color: 'text.disabled', width: 24, height: 24 }} />
                  ),
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: '1.125rem',
                  },
                }}
              />

              {/* Area Filter */}
              <FormControl fullWidth>
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
                  {areas.map((area) => (
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
                {machines.map((machine, index) => (
                  <motion.div key={machine.machineId} variants={cardVariants as any}>
                    <Card
                      sx={{
                        height: '100%',
                        position: 'relative',
                        overflow: 'visible',
                        borderTop: 4,
                        borderColor: machine.areaHexColor || 'primary.main',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardActionArea onClick={() => handleMachineSelect(machine)} sx={{ height: '100%' }}>
                        {/* Sequential Number Badge */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -16,
                            right: 16,
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            bgcolor: machine.areaHexColor || 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '1.25rem',
                            boxShadow: 3,
                            zIndex: 1,
                          }}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </Box>

                        {/* Machine Icon/Image */}
                        <Box
                          sx={{
                            height: 180,
                            bgcolor: machine.areaHexColor ? `${machine.areaHexColor}15` : 'background.neutral',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
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
                        </Box>

                        {/* Machine Info */}
                        <Box sx={{ p: 3 }}>
                          <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                            {machine.machineName}
                          </Typography>
                          <Chip
                            label={machine.areaName || 'Unknown Area'}
                            size="small"
                            sx={{
                              bgcolor: machine.areaHexColor ? `${machine.areaHexColor}20` : 'background.neutral',
                              color: machine.areaHexColor || 'text.primary',
                              fontWeight: 'medium',
                            }}
                          />
                          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              TRUY CẬP
                            </Typography>
                            <Iconify icon="eva:arrow-ios-forward-fill" sx={{ ml: 0.5 }} />
                          </Box>
                        </Box>
                      </CardActionArea>
                    </Card>
                  </motion.div>
                ))}
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

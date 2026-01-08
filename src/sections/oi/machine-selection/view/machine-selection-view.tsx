import type { AreaEntity, MachineEntity } from 'src/api/types/generated';

import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import CardActionArea from '@mui/material/CardActionArea';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { apiConfig } from 'src/api/config';
import { DashboardContent } from 'src/layouts/dashboard';
import { searchArea } from 'src/api/services/generated/area';
import { postapiMachinesearchmachines } from 'src/api/services/generated/machine';

import { Iconify } from 'src/components/iconify';

import { useMachineSelector } from '../../context';

// ----------------------------------------------------------------------

export function MachineSelectionView() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setSelectedMachine } = useMachineSelector();

  const [machines, setMachines] = useState<MachineEntity[]>([]);
  const [areas, setAreas] = useState<AreaEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  // Load areas for filter
  useEffect(() => {
    const loadAreas = async () => {
      try {
        const response = await searchArea({ maxResults: 100 });
        setAreas(response.data || []);
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
      const response = await postapiMachinesearchmachines(
        [], // Empty sort array
        {
          searchTerm,
          pageNumber: 1,
          pageSize: 100,
        }
      );
      
      let filteredMachines = response.items || [];
      
      // Filter by selected areas if any
      if (selectedAreas.length > 0) {
        filteredMachines = filteredMachines.filter((machine) => 
          machine.areaId && selectedAreas.includes(machine.areaId)
        );
      }
      
      setMachines(filteredMachines);
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

  const handleMachineSelect = (machine: MachineEntity) => {
    setSelectedMachine(machine);
    // Navigate to machine operation screen
    router.push('/oi/operation');
  };

  const getAreaName = (areaId?: string) => {
    if (!areaId) return t('common.unknown');
    const area = areas.find((a) => a.id === areaId);
    return area?.name || area?.code || t('common.unknown');
  };

  return (
    <DashboardContent maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
          Operator Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
          Hệ thống quản lý sản xuất thời gian thực
        </Typography>
      </Box>

      {/* Search and Filter Section */}
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
                <Iconify icon="eva:search-fill" sx={{ mr: 1, color: 'text.disabled' }} />
              ),
            }}
          />

          {/* Area Filter */}
          <FormControl fullWidth>
            <InputLabel>Tất cả khu vực</InputLabel>
            <Select
              multiple
              value={selectedAreas}
              onChange={(e) => setSelectedAreas(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
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
                  {area.name || area.code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Card>

      {/* Machine Cards - Horizontal Scroll */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress size={64} />
        </Box>
      ) : machines.length === 0 ? (
        <Alert severity="info">Không tìm thấy máy nào</Alert>
      ) : (
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            overflowX: 'auto',
            pb: 2,
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'background.neutral',
              borderRadius: 1,
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'text.disabled',
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'text.secondary',
              },
            },
          }}
        >
          {machines.map((machine, index) => (
            <Card
              key={machine.id}
              sx={{
                minWidth: 280,
                maxWidth: 280,
                flexShrink: 0,
                position: 'relative',
                overflow: 'visible',
              }}
            >
              <CardActionArea onClick={() => handleMachineSelect(machine)}>
                {/* Machine Number Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -12,
                    right: -12,
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
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

                {/* Machine Image */}
                <Box
                  sx={{
                    height: 180,
                    bgcolor: 'background.neutral',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <img
                    src={`${apiConfig.baseUrl}/api/Machine/${machine.id}/image`}
                    alt={machine.name || machine.code || ''}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      // Fallback to icon if image fails to load
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.fallback-icon')) {
                        const icon = document.createElement('div');
                        icon.className = 'fallback-icon';
                        icon.style.fontSize = '72px';
                        icon.style.color = 'var(--palette-text-disabled)';
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
                <Box sx={{ p: 2.5 }}>
                  <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 'bold' }}>
                    {machine.code || machine.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    {machine.name || 'N/A'}
                  </Typography>
                  <Chip
                    label={getAreaName(machine.areaId)}
                    size="small"
                    sx={{ bgcolor: 'background.neutral' }}
                  />
                </Box>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}
    </DashboardContent>
  );
}

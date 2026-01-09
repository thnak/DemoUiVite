import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { useRouter } from 'src/routes/hooks';

import { isOperator } from 'src/utils/jwt';

import { Iconify } from 'src/components/iconify';

import { MODULES } from '../modules-data';
import { IndexDesign1, IndexDesign2, IndexDesign3, IndexDesign4, IndexDesign5 } from '../designs';

import type { ViewMode } from '../types';

// ----------------------------------------------------------------------

type DesignOption = 1 | 2 | 3 | 4 | 5;

const DESIGN_OPTIONS: { value: DesignOption; label: string; description: string }[] = [
  { value: 1, label: 'Classic Grid', description: 'Gradient cards with hover effects' },
  { value: 2, label: 'Bento Layout', description: 'Asymmetric modern grid' },
  { value: 3, label: 'Minimal Cards', description: 'Clean shadows and spacing' },
  { value: 4, label: 'Hero Header', description: 'Bold header with compact grid' },
  { value: 5, label: 'Dashboard Style', description: 'Sidebar navigation feel' },
];

const DESIGN_STORAGE_KEY = 'index-page-design';

export function IndexPageView() {
  const router = useRouter();
  const [selectedDesign, setSelectedDesign] = useState<DesignOption>(4); // Default to Design 4
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Redirect Operator role users to OI module
  useEffect(() => {
    if (isOperator()) {
      router.push('/oi/select-machine');
    }
  }, [router]);

  // Load saved design preference from localStorage
  useEffect(() => {
    const savedDesign = localStorage.getItem(DESIGN_STORAGE_KEY);
    if (savedDesign) {
      const designNumber = parseInt(savedDesign, 10);
      if (designNumber >= 1 && designNumber <= 5) {
        setSelectedDesign(designNumber as DesignOption);
      }
    }
  }, []);

  const handleDesignChange = (newDesign: DesignOption) => {
    setSelectedDesign(newDesign);
    localStorage.setItem(DESIGN_STORAGE_KEY, newDesign.toString());
    setAnchorEl(null);
  };

  const handleViewModeChange = (_: React.MouseEvent<HTMLElement>, newMode: ViewMode | null) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  const renderDesign = () => {
    const props = { modules: MODULES, viewMode };

    switch (selectedDesign) {
      case 1:
        return <IndexDesign1 {...props} />;
      case 2:
        return <IndexDesign2 {...props} />;
      case 3:
        return <IndexDesign3 {...props} />;
      case 4:
        return <IndexDesign4 {...props} />;
      case 5:
        return <IndexDesign5 {...props} />;
      default:
        return <IndexDesign4 {...props} />;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header section */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          spacing={3}
          sx={{ mb: 5 }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontFamily: '"DM Sans Variable", sans-serif',
                letterSpacing: '-0.03em',
              }}
            >
              Welcome Back 👋
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Select a module to get started
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            {/* View mode toggle */}
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
              sx={{
                bgcolor: 'background.paper',
                '& .MuiToggleButton-root': {
                  px: 2,
                  border: 0,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  },
                },
              }}
            >
              <ToggleButton value="grid" aria-label="grid view">
                <Iconify icon="solar:grid-bold-duotone" width={20} sx={{ mr: 0.5 }} />
                Grid
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <Iconify icon="solar:list-bold-duotone" width={20} sx={{ mr: 0.5 }} />
                List
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Settings button */}
            <IconButton
              onClick={handleSettingsClick}
              sx={{
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Iconify icon="solar:settings-bold-duotone" width={24} />
            </IconButton>
          </Stack>
        </Stack>

        {/* Settings Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleSettingsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                minWidth: 280,
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="overline" color="text.secondary">
              Design Style
            </Typography>
          </Box>
          {DESIGN_OPTIONS.map((option) => (
            <MenuItem
              key={option.value}
              selected={selectedDesign === option.value}
              onClick={() => handleDesignChange(option.value)}
              sx={{ py: 1.5 }}
            >
              <Stack spacing={0.25}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Design {option.value}: {option.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.description}
                </Typography>
              </Stack>
            </MenuItem>
          ))}
        </Menu>

        {/* Main content */}
        {renderDesign()}
      </Container>
    </Box>
  );
}

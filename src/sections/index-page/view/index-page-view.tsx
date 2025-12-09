import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { Iconify } from 'src/components/iconify';

import { MODULES } from '../modules-data';
import {
  IndexDesign1,
  IndexDesign2,
  IndexDesign3,
  IndexDesign4,
  IndexDesign5,
} from '../designs';

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

export function IndexPageView() {
  const [selectedDesign, setSelectedDesign] = useState<DesignOption>(1);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const handleDesignChange = (_: React.MouseEvent<HTMLElement>, newDesign: DesignOption | null) => {
    if (newDesign !== null) {
      setSelectedDesign(newDesign);
    }
  };

  const handleViewModeChange = (_: React.MouseEvent<HTMLElement>, newMode: ViewMode | null) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
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
        return <IndexDesign1 {...props} />;
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
              Select a design style and navigate to your modules
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
          </Stack>
        </Stack>

        {/* Design selector */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Choose a design to preview (Vote for your favorite)
          </Typography>
          <ToggleButtonGroup
            value={selectedDesign}
            exclusive
            onChange={handleDesignChange}
            sx={{
              flexWrap: 'wrap',
              gap: 1,
              '& .MuiToggleButtonGroup-grouped': {
                border: 1,
                borderColor: 'divider',
                borderRadius: '12px !important',
                '&:not(:first-of-type)': {
                  borderLeft: 1,
                  borderColor: 'divider',
                  ml: 0,
                },
                '&.Mui-selected': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.lighter',
                  color: 'primary.dark',
                },
              },
            }}
          >
            {DESIGN_OPTIONS.map((option) => (
              <ToggleButton
                key={option.value}
                value={option.value}
                sx={{
                  px: 3,
                  py: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 0.25,
                }}
              >
                <Typography variant="subtitle2" fontWeight={600}>
                  Design {option.value}: {option.label}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 400 }}>
                  {option.description}
                </Typography>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* Main content */}
        {renderDesign()}
      </Container>
    </Box>
  );
}

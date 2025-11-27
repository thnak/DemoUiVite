import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { ProjectCard } from '../project-card';
import {
  projectsData,
  getStatusTabs,
  type ProjectStatus,
  filterProjectsByStatus,
} from '../report-portal-data';

// ----------------------------------------------------------------------

type ViewMode = 'grid' | 'list';

export function ReportPortalView() {
  const [currentTab, setCurrentTab] = useState<ProjectStatus>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const statusTabs = getStatusTabs(projectsData);
  const filteredProjects = filterProjectsByStatus(projectsData, currentTab);

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: ProjectStatus) => {
    setCurrentTab(newValue);
  }, []);

  const handleViewModeChange = useCallback(
    (_event: React.MouseEvent<HTMLElement>, newMode: ViewMode | null) => {
      if (newMode !== null) {
        setViewMode(newMode);
      }
    },
    []
  );

  return (
    <DashboardContent maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">Reporting</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          All projects in current month
        </Typography>
      </Box>

      {/* Tabs and Controls */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mb: 4,
        }}
      >
        {/* Status Tabs */}
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiTab-root': {
              minHeight: 40,
              minWidth: 'auto',
              px: 2,
              py: 1,
              mr: 1,
              borderRadius: 2,
              typography: 'body2',
              fontWeight: 'medium',
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
                bgcolor: 'primary.lighter',
              },
            },
          }}
        >
          {statusTabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{tab.label}</span>
                  <Box
                    component="span"
                    sx={{
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      bgcolor: currentTab === tab.value ? 'primary.main' : 'action.selected',
                      color: currentTab === tab.value ? 'primary.contrastText' : 'text.secondary',
                      typography: 'caption',
                      fontWeight: 'bold',
                    }}
                  >
                    {tab.count}
                  </Box>
                </Box>
              }
            />
          ))}
        </Tabs>

        {/* View Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="text"
            startIcon={<Iconify icon="ic:round-filter-list" />}
            sx={{ color: 'text.secondary' }}
          >
            More
          </Button>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={viewMode}
            onChange={handleViewModeChange}
            sx={{
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: 1,
                px: 1.5,
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
            <ToggleButton value="grid">
              <Iconify icon="eva:grid-fill" width={20} />
            </ToggleButton>
            <ToggleButton value="list">
              <Iconify icon="eva:list-fill" width={20} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Project Cards Grid */}
      <Grid container spacing={3}>
        {filteredProjects.map((project) => (
          <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
      >
        <Iconify icon="eva:plus-fill" width={24} />
      </Fab>
    </DashboardContent>
  );
}

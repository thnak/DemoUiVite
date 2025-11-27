import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { RemindersCard } from '../reminders-card';
import { ProjectListCard } from '../project-list-card';
import { TimeTrackerCard } from '../time-tracker-card';
import { ProjectStatsCard } from '../project-stats-card';
import { ProjectProgressCard } from '../project-progress-card';
import { ProjectAnalyticsChart } from '../project-analytics-chart';
import { TeamCollaborationCard } from '../team-collaboration-card';
import {
  remindersData,
  teamMembersData,
  projectStatsData,
  projectTasksData,
  projectProgressData,
  weeklyAnalyticsData,
} from '../project-dashboard-data';

// ----------------------------------------------------------------------

export function ProjectDashboardView() {
  return (
    <DashboardContent maxWidth="xl">
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: { xs: 3, md: 4 },
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Plan, prioritize, and accomplish your tasks with ease.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<Iconify icon="eva:plus-fill" />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Add Project
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              borderColor: 'divider',
              color: 'text.primary',
            }}
          >
            Import Data
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards Row */}
        {projectStatsData.map((stat) => (
          <Grid key={stat.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <ProjectStatsCard data={stat} />
          </Grid>
        ))}

        {/* Project Analytics */}
        <Grid size={{ xs: 12, md: 4 }}>
          <ProjectAnalyticsChart data={weeklyAnalyticsData} />
        </Grid>

        {/* Reminders */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <RemindersCard data={remindersData} />
        </Grid>

        {/* Project List */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ProjectListCard data={projectTasksData} />
        </Grid>

        {/* Team Collaboration */}
        <Grid size={{ xs: 12, md: 5 }}>
          <TeamCollaborationCard data={teamMembersData} />
        </Grid>

        {/* Project Progress */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ProjectProgressCard data={projectProgressData} />
        </Grid>

        {/* Time Tracker */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TimeTrackerCard />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
import LinearProgress from '@mui/material/LinearProgress';

import { Iconify } from 'src/components/iconify';

import type { ProjectData } from './report-portal-data';

// ----------------------------------------------------------------------

type ProjectCardProps = CardProps & {
  project: ProjectData;
};

export function ProjectCard({ project, sx, ...other }: ProjectCardProps) {
  return (
    <Card
      sx={[
        {
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 3,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          bgcolor: project.iconBgColor,
        }}
      >
        <Iconify icon={project.icon} width={28} height={28} sx={{ color: project.iconColor }} />
      </Box>

      {/* Project Name */}
      <Typography variant="h6" noWrap>
        {project.name}
      </Typography>

      {/* Team Info */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Iconify icon="solar:users-group-rounded-bold" width={16} sx={{ color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {project.teamName}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Iconify icon="solar:clock-circle-outline" width={16} sx={{ color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {project.timeRemaining}
          </Typography>
        </Box>
      </Box>

      {/* Team Member & Progress */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 1 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
            Team Member
          </Typography>
          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 12 } }}>
            {project.teamMembers.map((member) => (
              <Avatar key={member.id} alt={member.name} src={member.avatarUrl} />
            ))}
          </AvatarGroup>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
            Progress
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: project.progress >= 75 ? 'success.main' : project.progress >= 50 ? 'warning.main' : 'error.main',
              }}
            />
            <Typography variant="body2" fontWeight="bold">
              {project.progress}%
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={project.progress}
        sx={{
          height: 6,
          borderRadius: 1,
          bgcolor: 'action.hover',
          '& .MuiLinearProgress-bar': {
            borderRadius: 1,
            bgcolor: project.progress >= 75 ? 'success.main' : project.progress >= 50 ? 'warning.main' : 'error.main',
          },
        }}
      />
    </Card>
  );
}

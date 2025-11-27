import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import type { ProjectStatsData } from './project-dashboard-data';

// ----------------------------------------------------------------------

type ProjectStatsCardProps = CardProps & {
  data: ProjectStatsData;
};

export function ProjectStatsCard({ data, sx, ...other }: ProjectStatsCardProps) {
  const isPrimary = data.variant === 'primary';

  return (
    <Card
      sx={[
        {
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          borderRadius: 3,
          ...(isPrimary
            ? {
                bgcolor: 'success.dark',
                color: 'common.white',
              }
            : {
                bgcolor: 'background.paper',
                color: 'text.primary',
              }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {data.title}
        </Typography>
        <IconButton
          size="small"
          sx={{
            color: isPrimary ? 'common.white' : 'text.secondary',
            bgcolor: isPrimary ? 'rgba(255,255,255,0.1)' : 'action.hover',
          }}
        >
          <Iconify icon="eva:arrow-ios-forward-fill" width={16} />
        </IconButton>
      </Box>

      <Typography
        variant="h2"
        sx={{
          my: 1.5,
          fontWeight: 700,
        }}
      >
        {data.value}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {data.subtitle.includes('Increased') && (
          <Iconify
            icon="eva:trending-up-fill"
            width={14}
            sx={{
              color: isPrimary ? 'common.white' : 'success.main',
            }}
          />
        )}
        <Typography
          variant="caption"
          sx={{
            color: isPrimary ? 'rgba(255,255,255,0.8)' : 'text.secondary',
          }}
        >
          {data.subtitle}
        </Typography>
      </Box>
    </Card>
  );
}

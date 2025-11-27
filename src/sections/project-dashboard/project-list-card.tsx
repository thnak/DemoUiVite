import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import type { ProjectTaskData } from './project-dashboard-data';

// ----------------------------------------------------------------------

type ProjectListCardProps = CardProps & {
  title?: string;
  data: ProjectTaskData[];
};

export function ProjectListCard({
  title = 'Project',
  data,
  sx,
  ...other
}: ProjectListCardProps) {
  return (
    <Card
      sx={[
        {
          p: 2.5,
          borderRadius: 3,
          bgcolor: 'background.paper',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Iconify icon="eva:plus-fill" />}
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 500,
            borderColor: 'divider',
            color: 'text.primary',
          }}
        >
          New
        </Button>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {data.map((task) => (
          <Box
            key={task.id}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              py: 1.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:last-child': { borderBottom: 'none' },
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: `${task.color}.lighter`,
                color: `${task.color}.main`,
              }}
            >
              <Iconify icon="solar:check-circle-bold" width={18} />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {task.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Due date: {task.dueDate}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
}

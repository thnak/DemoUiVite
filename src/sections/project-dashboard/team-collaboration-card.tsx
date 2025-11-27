import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import type { TeamMemberData } from './project-dashboard-data';

// ----------------------------------------------------------------------

type TeamCollaborationCardProps = CardProps & {
  title?: string;
  data: TeamMemberData[];
};

export function TeamCollaborationCard({
  title = 'Team Collaboration',
  data,
  sx,
  ...other
}: TeamCollaborationCardProps) {
  const getStatusColor = (status: TeamMemberData['status']) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Pending':
        return 'error';
      default:
        return 'default';
    }
  };

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
          Add Member
        </Button>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {data.map((member) => (
          <Box
            key={member.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              py: 1.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:last-child': { borderBottom: 'none' },
            }}
          >
            <Avatar src={member.avatarUrl} alt={member.name} sx={{ width: 40, height: 40 }} />

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {member.name}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                Working on{' '}
                <Typography
                  component="span"
                  variant="caption"
                  color="success.main"
                  sx={{ fontWeight: 500 }}
                >
                  {member.task}
                </Typography>
              </Typography>
            </Box>

            <Label color={getStatusColor(member.status)} variant="soft">
              {member.status}
            </Label>
          </Box>
        ))}
      </Box>
    </Card>
  );
}

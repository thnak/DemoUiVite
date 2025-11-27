import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import type { ReminderData } from './project-dashboard-data';

// ----------------------------------------------------------------------

type RemindersCardProps = CardProps & {
  title?: string;
  data: ReminderData[];
};

export function RemindersCard({
  title = 'Reminders',
  data,
  sx,
  ...other
}: RemindersCardProps) {
  const reminder = data[0];

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
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        {title}
      </Typography>

      {reminder && (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            {reminder.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Time: {reminder.time}
          </Typography>

          <Button
            variant="contained"
            color="success"
            startIcon={<Iconify icon="solar:play-circle-bold" />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              alignSelf: 'flex-start',
            }}
          >
            Start Meeting
          </Button>
        </Box>
      )}
    </Card>
  );
}

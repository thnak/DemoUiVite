import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type UploadFileCardProps = CardProps;

export function UploadFileCard({ sx, ...other }: UploadFileCardProps) {
  return (
    <Card
      sx={[
        {
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          cursor: 'pointer',
          border: (theme) => `1px dashed ${theme.vars.palette.divider}`,
          '&:hover': {
            bgcolor: 'action.hover',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          bgcolor: 'grey.100',
        }}
      >
        <Iconify
          icon="solar:cloud-upload-bold"
          width={24}
          height={24}
          sx={{ color: 'primary.main' }}
        />
      </Box>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Upload file
      </Typography>
    </Card>
  );
}

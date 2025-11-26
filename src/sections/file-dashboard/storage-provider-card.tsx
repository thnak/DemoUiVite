import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { Iconify } from 'src/components/iconify';

import type { StorageProvider } from './file-dashboard-data';

// ----------------------------------------------------------------------

type StorageProviderCardProps = CardProps & {
  provider: StorageProvider;
};

export function StorageProviderCard({ provider, sx, ...other }: StorageProviderCardProps) {
  const usagePercent = (provider.usedStorage / provider.totalStorage) * 100;

  return (
    <Card
      sx={[
        {
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Iconify icon={provider.icon} width={48} height={48} />
        <IconButton size="small">
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Box>

      <Typography variant="h6">{provider.name}</Typography>

      <Box sx={{ width: '100%' }}>
        <LinearProgress
          variant="determinate"
          value={usagePercent}
          sx={{
            height: 6,
            borderRadius: 1,
            bgcolor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 1,
              bgcolor: provider.color,
            },
          }}
        />
      </Box>

      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'right' }}>
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.primary' }}>
          {provider.usedStorage} Gb
        </Typography>
        {` / ${provider.totalStorage} Gb`}
      </Typography>
    </Card>
  );
}

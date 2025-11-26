import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type UpgradePlanCardProps = CardProps;

export function UpgradePlanCard({ sx, ...other }: UpgradePlanCardProps) {
  return (
    <Card
      sx={[
        {
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 2,
          bgcolor: '#1C252E',
          color: 'common.white',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 180,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ zIndex: 1 }}>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Upgrade your plan
        </Typography>
        <Typography variant="body2" sx={{ color: 'grey.400', mb: 2 }}>
          and get more space
        </Typography>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#FFAB00',
            color: 'common.black',
            '&:hover': {
              bgcolor: '#E09E00',
            },
          }}
        >
          Upgrade plan
        </Button>
      </Box>

      {/* Decorative illustration placeholder */}
      <Box
        sx={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          top: 16,
          width: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          {/* Simple chart illustration */}
          <rect x="10" y="60" width="15" height="30" rx="2" fill="#FFAB00" />
          <rect x="30" y="40" width="15" height="50" rx="2" fill="#7B68EE" />
          <rect x="50" y="20" width="15" height="70" rx="2" fill="#7B68EE" />
          <rect x="70" y="45" width="15" height="45" rx="2" fill="#FFAB00" />
          {/* Rising arrow */}
          <path d="M15 55 L75 15" stroke="#FFAB00" strokeWidth="3" strokeLinecap="round" />
          <path d="M65 10 L78 15 L70 25" fill="#FFAB00" />
        </svg>
      </Box>
    </Card>
  );
}

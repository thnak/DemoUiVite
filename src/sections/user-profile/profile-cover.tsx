import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type ProfileCoverProps = BoxProps & {
  name: string;
  role: string;
  avatarUrl: string;
  coverUrl: string;
};

export function ProfileCover({ name, role, avatarUrl, coverUrl, sx, ...other }: ProfileCoverProps) {
  return (
    <Box
      sx={[
        {
          position: 'relative',
          height: 280,
          backgroundImage: `url(${coverUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 2,
          overflow: 'hidden',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0, 0, 0, 0.3)',
        }}
      />

      {/* Avatar and Info */}
      <Box
        sx={{
          position: 'absolute',
          left: 24,
          bottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Avatar
          src={avatarUrl}
          alt={name}
          sx={{
            width: 128,
            height: 128,
            border: '4px solid',
            borderColor: 'background.paper',
          }}
        />
        <Box>
          <Typography variant="h4" sx={{ color: 'common.white' }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.400' }}>
            {role}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

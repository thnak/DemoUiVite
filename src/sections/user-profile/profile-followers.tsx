import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Follower = {
  id: string;
  name: string;
  avatarUrl: string;
  country: string;
  isFollowed: boolean;
};

type ProfileFollowersProps = {
  followers: Follower[];
};

export function ProfileFollowers({ followers }: ProfileFollowersProps) {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Followers
      </Typography>

      <Grid container spacing={3}>
        {followers.map((follower) => (
          <Grid key={follower.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <FollowerCard follower={follower} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// ----------------------------------------------------------------------

type FollowerCardProps = {
  follower: Follower;
};

function FollowerCard({ follower }: FollowerCardProps) {
  return (
    <Card sx={{ p: 2.5 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src={follower.avatarUrl} alt={follower.name} sx={{ width: 48, height: 48 }} />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {follower.name}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Iconify
              icon="eva:pin-fill"
              sx={{ width: 16, height: 16, color: 'primary.main', flexShrink: 0 }}
            />
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {follower.country}
            </Typography>
          </Stack>
        </Box>

        {follower.isFollowed ? (
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main' }}>
            <Iconify icon="eva:checkmark-fill" sx={{ width: 16, height: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Followed
            </Typography>
          </Stack>
        ) : (
          <Button size="small" variant="outlined" color="inherit">
            Follow
          </Button>
        )}
      </Stack>
    </Card>
  );
}

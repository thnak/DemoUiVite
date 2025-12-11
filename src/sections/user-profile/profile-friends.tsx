import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Friend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
  };
};

type ProfileFriendsProps = {
  friends: Friend[];
};

export function ProfileFriends({ friends }: ProfileFriendsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Friends</Typography>
        <TextField
          size="small"
          placeholder="Search friends..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: 220 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }
          }}
        />
      </Stack>
      <Grid container spacing={3}>
        {filteredFriends.map((friend) => (
          <Grid key={friend.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <FriendCard friend={friend} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// ----------------------------------------------------------------------

type FriendCardProps = {
  friend: Friend;
};

function FriendCard({ friend }: FriendCardProps) {
  return (
    <Card sx={{ p: 3, textAlign: 'center' }}>
      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
        }}
      >
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>

      <Avatar
        src={friend.avatarUrl}
        alt={friend.name}
        sx={{
          width: 64,
          height: 64,
          mx: 'auto',
          mb: 2,
        }}
      />

      <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
        {friend.name}
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        {friend.role}
      </Typography>

      <Stack direction="row" justifyContent="center" spacing={1}>
        <IconButton
          size="small"
          component="a"
          href={friend.socialLinks.facebook}
          target="_blank"
          sx={{ color: '#1877F2' }}
        >
          <Iconify icon="eva:facebook-fill" />
        </IconButton>
        <IconButton
          size="small"
          component="a"
          href={friend.socialLinks.instagram}
          target="_blank"
          sx={{ color: '#E4405F' }}
        >
          <Iconify icon="ant-design:instagram-filled" />
        </IconButton>
        <IconButton
          size="small"
          component="a"
          href={friend.socialLinks.linkedin}
          target="_blank"
          sx={{ color: '#0A66C2' }}
        >
          <Iconify icon="eva:linkedin-fill" />
        </IconButton>
        <IconButton size="small" component="a" href={friend.socialLinks.twitter} target="_blank">
          <Iconify icon="ri:twitter-x-fill" />
        </IconButton>
      </Stack>
    </Card>
  );
}

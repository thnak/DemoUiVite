import type { IconifyName } from 'src/components/iconify/register-icons';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { ProfileCover } from '../profile-cover';
import { ProfileGallery } from '../profile-gallery';
import { ProfileFriends } from '../profile-friends';
import { ProfileFollowers } from '../profile-followers';
import { ProfilePost, ProfileAbout, ProfilePostInput } from '../profile-home';

// ----------------------------------------------------------------------

const TABS: { value: string; label: string; icon: IconifyName }[] = [
  { value: 'profile', label: 'Profile', icon: 'solar:user-id-bold' },
  { value: 'followers', label: 'Followers', icon: 'solar:heart-bold' },
  { value: 'friends', label: 'Friends', icon: 'solar:users-group-rounded-bold' },
  { value: 'gallery', label: 'Gallery', icon: 'solar:gallery-wide-bold' },
];

// ----------------------------------------------------------------------

type ProfileData = {
  id: string;
  displayName: string;
  role: string;
  email: string;
  avatarUrl: string;
  coverUrl: string;
  followerCount: number;
  followingCount: number;
  about: string;
  location: string;
  company: string;
  school: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
  };
};

type Follower = {
  id: string;
  name: string;
  avatarUrl: string;
  country: string;
  isFollowed: boolean;
};

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

type GalleryItem = {
  id: string;
  title: string;
  coverUrl: string;
  postedAt: string;
};

type PostAuthor = {
  id: string;
  name: string;
  avatarUrl: string;
};

type PostComment = {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  content: string;
  postedAt: string;
};

type PersonLike = {
  name: string;
  avatarUrl: string;
};

type Post = {
  id: string;
  author: PostAuthor;
  content: string;
  coverUrl: string | null;
  likes: number;
  personLikes: PersonLike[];
  comments: PostComment[];
  postedAt: string;
};

type Props = {
  profile: ProfileData;
  followers: Follower[];
  friends: Friend[];
  gallery: GalleryItem[];
  posts: Post[];
};

export function UserProfileView({ profile, followers, friends, gallery, posts }: Props) {
  const [currentTab, setCurrentTab] = useState('profile');

  const handleChangeTab = useCallback((_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <DashboardContent>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Profile
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            User
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            {profile.displayName}
          </Typography>
        </Box>
      </Box>

      {/* Profile Cover Card */}
      <Card sx={{ mb: 3 }}>
        <ProfileCover
          name={profile.displayName}
          role={profile.role}
          avatarUrl={profile.avatarUrl}
          coverUrl={profile.coverUrl}
        />

        {/* Tabs */}
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.vars.palette.background.neutral}`,
            '& .MuiTabs-flexContainer': {
              justifyContent: 'flex-end',
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              icon={<Iconify icon={tab.icon} sx={{ width: 20, height: 20 }} />}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Card>

      {/* Tab Content */}
      {currentTab === 'profile' && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <ProfileAbout
              about={profile.about}
              location={profile.location}
              email={profile.email}
              company={profile.company}
              school={profile.school}
              socialLinks={profile.socialLinks}
              followerCount={profile.followerCount}
              followingCount={profile.followingCount}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <ProfilePostInput avatarUrl={profile.avatarUrl} />
            {posts.map((post) => (
              <ProfilePost key={post.id} post={post} currentUserAvatarUrl={profile.avatarUrl} />
            ))}
          </Grid>
        </Grid>
      )}

      {currentTab === 'followers' && <ProfileFollowers followers={followers} />}

      {currentTab === 'friends' && <ProfileFriends friends={friends} />}

      {currentTab === 'gallery' && <ProfileGallery gallery={gallery} />}
    </DashboardContent>
  );
}

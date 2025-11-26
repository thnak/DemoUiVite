import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
import InputAdornment from '@mui/material/InputAdornment';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type ProfileAboutProps = {
  about: string;
  location: string;
  email: string;
  company: string;
  school: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
  };
  followerCount: number;
  followingCount: number;
};

export function ProfileAbout({
  about,
  location,
  email,
  company,
  school,
  socialLinks,
  followerCount,
  followingCount,
}: ProfileAboutProps) {
  return (
    <Card sx={{ p: 3 }}>
      {/* Stats */}
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} sx={{ mb: 3 }}>
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography variant="h4">{followerCount.toLocaleString()}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Follower
          </Typography>
        </Box>
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography variant="h4">{followingCount.toLocaleString()}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Following
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* About section */}
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        About
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        {about}
      </Typography>

      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify icon="eva:pin-outline" sx={{ color: 'text.secondary' }} />
          <Typography variant="body2">
            Live at <strong>{location}</strong>
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify icon="eva:email-outline" sx={{ color: 'text.secondary' }} />
          <Typography variant="body2">{email}</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify icon="eva:briefcase-outline" sx={{ color: 'text.secondary' }} />
          <Typography variant="body2">
            CTO at <strong>{company}</strong>
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify icon="eva:book-open-outline" sx={{ color: 'text.secondary' }} />
          <Typography variant="body2">
            Studied at <strong>{school}</strong>
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Social section */}
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Social
      </Typography>
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify icon="eva:facebook-fill" sx={{ color: '#1877F2' }} />
          <Link href={socialLinks.facebook} target="_blank" variant="body2" underline="hover">
            {socialLinks.facebook}
          </Link>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify icon="ant-design:instagram-filled" sx={{ color: '#E4405F' }} />
          <Link href={socialLinks.instagram} target="_blank" variant="body2" underline="hover">
            {socialLinks.instagram}
          </Link>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify icon="eva:linkedin-fill" sx={{ color: '#0A66C2' }} />
          <Link href={socialLinks.linkedin} target="_blank" variant="body2" underline="hover">
            {socialLinks.linkedin}
          </Link>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify icon="ri:twitter-x-fill" />
          <Link href={socialLinks.twitter} target="_blank" variant="body2" underline="hover">
            {socialLinks.twitter}
          </Link>
        </Stack>
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

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

type ProfilePostProps = {
  post: {
    id: string;
    author: PostAuthor;
    content: string;
    coverUrl: string | null;
    likes: number;
    personLikes: PersonLike[];
    comments: PostComment[];
    postedAt: string;
  };
};

export function ProfilePost({ post }: ProfilePostProps) {
  return (
    <Card sx={{ p: 3, mb: 3 }}>
      {/* Author Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={post.author.avatarUrl} alt={post.author.name} />
          <Box>
            <Typography variant="subtitle2">{post.author.name}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {fDate(post.postedAt)}
            </Typography>
          </Box>
        </Stack>
        <IconButton>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      {/* Content */}
      <Typography variant="body2" sx={{ mb: 2 }}>
        {post.content}
      </Typography>

      {/* Cover Image */}
      {post.coverUrl && (
        <Box
          component="img"
          src={post.coverUrl}
          alt="Post cover"
          sx={{
            width: '100%',
            height: 400,
            objectFit: 'cover',
            borderRadius: 2,
            mb: 2,
          }}
        />
      )}

      {/* Likes Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              bgcolor: 'error.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon="eva:heart-fill" sx={{ width: 12, height: 12, color: 'common.white' }} />
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {post.likes}
          </Typography>
          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24 } }}>
            {post.personLikes.map((person, index) => (
              <Avatar key={index} src={person.avatarUrl} alt={person.name} />
            ))}
          </AvatarGroup>
          {post.personLikes.length > 3 && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              +{post.personLikes.length - 3}
            </Typography>
          )}
        </Stack>
        <Stack direction="row" spacing={1}>
          <IconButton size="small">
            <Iconify icon="eva:message-circle-outline" />
          </IconButton>
          <IconButton size="small">
            <Iconify icon="eva:share-outline" />
          </IconButton>
        </Stack>
      </Stack>

      {/* Comments */}
      <Stack spacing={2}>
        {post.comments.map((comment) => (
          <Stack key={comment.id} direction="row" spacing={2}>
            <Avatar
              src={comment.author.avatarUrl}
              alt={comment.author.name}
              sx={{ width: 32, height: 32 }}
            />
            <Box
              sx={{
                flex: 1,
                bgcolor: 'background.neutral',
                borderRadius: 1.5,
                p: 1.5,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <Typography variant="subtitle2">{comment.author.name}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {fDate(comment.postedAt)}
                </Typography>
              </Stack>
              <Typography variant="body2">{comment.content}</Typography>
            </Box>
          </Stack>
        ))}
      </Stack>

      {/* Comment Input */}
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Avatar src="/assets/images/avatar/avatar-25.webp" sx={{ width: 32, height: 32 }} />
        <TextField
          fullWidth
          size="small"
          placeholder="Write a comment..."
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small">
                  <Iconify icon="eva:smiling-face-outline" />
                </IconButton>
                <IconButton size="small">
                  <Iconify icon="eva:image-outline" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ProfilePostInputProps = {
  avatarUrl: string;
};

export function ProfilePostInput({ avatarUrl }: ProfilePostInputProps) {
  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <Stack direction="row" spacing={2}>
        <Avatar src={avatarUrl} sx={{ width: 40, height: 40 }} />
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Share what you are thinking here..."
          variant="outlined"
        />
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
        <Stack direction="row" spacing={1}>
          <IconButton>
            <Iconify icon="eva:image-fill" sx={{ color: 'success.main' }} />
          </IconButton>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
            Image/Video
          </Typography>
          <IconButton sx={{ ml: 2 }}>
            <Iconify icon="eva:video-fill" sx={{ color: 'error.main' }} />
          </IconButton>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
            Streaming
          </Typography>
        </Stack>
        <Box
          component="button"
          sx={{
            px: 3,
            py: 1,
            borderRadius: 1,
            border: 'none',
            bgcolor: 'text.primary',
            color: 'background.paper',
            fontWeight: 600,
            cursor: 'pointer',
            '&:hover': { opacity: 0.9 },
          }}
        >
          Post
        </Box>
      </Stack>
    </Card>
  );
}

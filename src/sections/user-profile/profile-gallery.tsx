import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type GalleryItem = {
  id: string;
  title: string;
  coverUrl: string;
  postedAt: string;
};

type ProfileGalleryProps = {
  gallery: GalleryItem[];
};

export function ProfileGallery({ gallery }: ProfileGalleryProps) {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gallery
      </Typography>

      <Grid container spacing={3}>
        {gallery.map((item) => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <GalleryCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// ----------------------------------------------------------------------

type GalleryCardProps = {
  item: GalleryItem;
};

function GalleryCard({ item }: GalleryCardProps) {
  return (
    <Card
      sx={{
        position: 'relative',
        height: 280,
        overflow: 'hidden',
        borderRadius: 2,
      }}
    >
      <Box
        component="img"
        src={item.coverUrl}
        alt={item.title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)',
        }}
      />

      {/* More options button */}
      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: 'common.white',
        }}
      >
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>

      {/* Title and date */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: 'common.white',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 0.5,
          }}
        >
          {item.title}
        </Typography>
        <Typography variant="caption" sx={{ color: 'grey.400' }}>
          {fDate(item.postedAt)}
        </Typography>
      </Box>
    </Card>
  );
}

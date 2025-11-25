import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export function NotFoundView() {
  return (
    <Box
      sx={{
        py: 12,
        maxWidth: 480,
        mx: 'auto',
        display: 'flex',
        minHeight: '100vh',
        textAlign: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h3" sx={{ mb: 3 }}>
        Sorry, page not found!
      </Typography>

      <Typography sx={{ color: 'text.secondary' }}>
        Sorry, we couldn&apos;t find the page you&apos;re looking for. Perhaps you&apos;ve mistyped
        the URL? Be sure to check your spelling.
      </Typography>

      <Box
        component="img"
        src="/assets/illustrations/illustration-404.svg"
        sx={{
          mx: 'auto',
          height: 260,
          my: { xs: 5, sm: 10 },
        }}
      />

      <Button href="/" size="large" variant="contained" component={RouterLink}>
        Go to Home
      </Button>
    </Box>
  );
}

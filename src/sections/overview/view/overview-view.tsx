import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function OverviewView() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3">714k</Typography>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Weekly Sales
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3">1.35m</Typography>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              New Users
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3">1.72m</Typography>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Item Orders
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3">234</Typography>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Bug Reports
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

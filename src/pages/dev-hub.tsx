/**
 * Dev Hub Page
 * 
 * Central hub for accessing development/debugging pages that don't have a place in the main navigation.
 */

import { Box, Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

interface DevPageCard {
  title: string;
  description: string;
  path: string;
  icon: string;
  color: string;
}

const DEV_PAGES: DevPageCard[] = [
  {
    title: 'Translation System Demo',
    description: 'High-performance translation system with Web Workers and IndexedDB. Shows real-time stats, sync controls, and usage examples.',
    path: '/dev/translation-demo',
    icon: 'solar:translation-bold',
    color: '#3b82f6',
  },
  // Add more dev pages here as needed
];

export default function DevHubPage() {
  const navigate = useNavigate();

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ mb: 1 }}>
          🛠️ Developer Hub
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Access development and debugging pages. These pages are for testing new features and debugging purposes.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {DEV_PAGES.map((page) => (
          <Grid key={page.path} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[8],
                },
              }}
            >
              <CardActionArea
                onClick={() => navigate(page.path)}
                sx={{ height: '100%' }}
              >
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: `${page.color}20`,
                      }}
                    >
                      <Iconify
                        icon={page.icon as any}
                        width={32}
                        sx={{ color: page.color }}
                      />
                    </Box>
                    <Typography variant="h5" sx={{ flexGrow: 1 }}>
                      {page.title}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ flexGrow: 1 }}
                  >
                    {page.description}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mt: 2,
                      color: 'primary.main',
                    }}
                  >
                    <Typography variant="button">View Demo</Typography>
                    <Iconify icon="solar:arrow-right-bold" width={20} />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}

        {/* Placeholder for future pages */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              height: '100%',
              border: '2px dashed',
              borderColor: 'divider',
              bgcolor: 'background.neutral',
            }}
          >
            <CardContent
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 240,
              }}
            >
              <Iconify
                icon="solar:add-circle-bold-duotone"
                width={48}
                sx={{ color: 'text.disabled', mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                More Coming Soon
              </Typography>
              <Typography variant="body2" color="text.disabled" sx={{ mt: 1, textAlign: 'center' }}>
                New dev pages will be added here
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 5,
          p: 3,
          bgcolor: 'background.neutral',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          💡 How to Add New Pages
        </Typography>
        <Typography variant="body2" color="text.secondary">
          To add a new dev page, simply add an entry to the <code>DEV_PAGES</code> array in{' '}
          <code>src/pages/dev-hub.tsx</code> with the title, description, path, icon, and color.
          Then add the corresponding route in <code>src/routes/sections.tsx</code>.
        </Typography>
      </Box>
    </DashboardContent>
  );
}

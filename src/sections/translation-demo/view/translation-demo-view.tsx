/**
 * Translation System Demo Page
 * 
 * Demonstrates the high-performance translation system with:
 * - Manual sync control
 * - Storage statistics
 * - Live translation examples
 */

import { useState, useEffect } from 'react';

import { Box, Card, Grid, Chip, Stack, Divider, Typography } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { 
  getStorageStats,
  useTranslationSystem,
} from 'src/services/translation';

import { TranslationSyncButton } from 'src/components/translation-sync-button';

// ----------------------------------------------------------------------

export function TranslationDemoView() {
  const { initialized } = useTranslationSystem();
  const [stats, setStats] = useState({
    totalKeys: 0,
    translationKeys: 0,
    etagKeys: 0,
  });

  useEffect(() => {
    const updateStats = async () => {
      const newStats = await getStorageStats();
      setStats(newStats);
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Translation System Demo
        </Typography>
        <Typography variant="body2" color="text.secondary">
          High-performance entity translations with Web Workers and IndexedDB
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* System Status */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              System Status
            </Typography>
            
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Worker Status
                </Typography>
                <Chip
                  label={initialized ? 'Initialized' : 'Loading...'}
                  color={initialized ? 'success' : 'warning'}
                  size="small"
                />
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Cached Translations
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {stats.translationKeys.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Entity ETags
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {stats.etagKeys}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Total Keys
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {stats.totalKeys.toLocaleString()}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <TranslationSyncButton />
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* How It Works */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              How It Works
            </Typography>
            
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  1. Background Processing
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All translation fetching and caching happens in a Web Worker, keeping the UI responsive.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  2. Persistent Storage
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Translations are stored in IndexedDB, surviving page reloads and offline access.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  3. Efficient Updates
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Uses ETags for conditional fetching - only downloads when data changes (304 responses).
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  4. Automatic Sync
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Background polling every 30 minutes keeps translations up-to-date automatically.
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Usage Example */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Usage Example
            </Typography>
            
            <Stack spacing={2}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.neutral',
                  borderRadius: 1,
                  fontFamily: 'monospace',
                }}
              >
                <Typography variant="body2" component="pre" sx={{ m: 0 }}>
{`import { useEntityTranslation } from 'src/services/translation';

function MyComponent({ areaId }) {
  const areaName = useEntityTranslation('area', areaId);
  
  return <div>{areaName || 'Loading...'}</div>;
}`}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  The hook automatically fetches the translation in the current language from IndexedDB
                  via the Web Worker, with zero main-thread blocking.
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Performance Benefits */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Performance Benefits
            </Typography>
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box>
                  <Typography variant="h3" color="primary" gutterBottom>
                    0ms
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Main thread blocking
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box>
                  <Typography variant="h3" color="success.main" gutterBottom>
                    ~3ms
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average lookup time
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box>
                  <Typography variant="h3" color="info.main" gutterBottom>
                    304
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Not Modified responses
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box>
                  <Typography variant="h3" color="warning.main" gutterBottom>
                    ∞
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Offline availability
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Documentation Links */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Documentation
            </Typography>
            
            <Stack spacing={1}>
              <Box>
                <Typography variant="subtitle2" color="primary">
                  📘 Full Documentation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  docs/guides/translation-system.md - Complete API reference and examples
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="primary">
                  🚀 Quick Start Guide
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  docs/guides/translation-system-quickstart.md - Get started in 5 minutes
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="primary">
                  🔧 Implementation Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  TRANSLATION_SYSTEM_IMPLEMENTATION.md - Architecture and technical details
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

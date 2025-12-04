import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { FolderCard } from '../folder-card';
import { RecentFileItem } from '../recent-file-item';
import { UploadFileCard } from '../upload-file-card';
import { UploadImageCard } from '../upload-image-card';
import { UpgradePlanCard } from '../upgrade-plan-card';
import { DataActivityChart } from '../data-activity-chart';
import { StorageUsageChart } from '../storage-usage-chart';
import { StorageProviderCard } from '../storage-provider-card';
import {
  foldersData,
  recentFilesData,
  dataActivityData,
  totalStorageData,
  storageProvidersData,
  storageCategoriesData,
} from '../file-dashboard-data';

// ----------------------------------------------------------------------

export function FileDashboardView() {
  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Grid container spacing={3}>
            {/* Storage Providers */}
            {storageProvidersData.map((provider) => (
              <Grid key={provider.id} size={{ xs: 12, sm: 4 }}>
                <StorageProviderCard provider={provider} />
              </Grid>
            ))}

            {/* Data Activity Chart */}
            <Grid size={{ xs: 12 }}>
              <DataActivityChart title="Data activity" data={dataActivityData} />
            </Grid>

            {/* Folders Section */}
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6">Folders</Typography>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      cursor: 'pointer',
                    }}
                  >
                    <Iconify
                      icon="eva:plus-fill"
                      width={16}
                      height={16}
                      sx={{ color: 'common.white' }}
                    />
                  </Box>
                </Box>
                <Button
                  endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
                  sx={{ color: 'text.secondary' }}
                >
                  View all
                </Button>
              </Box>
              <Grid container spacing={2}>
                {foldersData.map((folder) => (
                  <Grid key={folder.id} size={{ xs: 12, sm: 6, md: 3 }}>
                    <FolderCard folder={folder} />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Recent Files Section */}
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">Recent files</Typography>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          bgcolor: 'success.main',
                          cursor: 'pointer',
                        }}
                      >
                        <Iconify
                          icon="eva:plus-fill"
                          width={16}
                          height={16}
                          sx={{ color: 'common.white' }}
                        />
                      </Box>
                    </Box>
                  }
                  action={
                    <Button
                      endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
                      sx={{ color: 'text.secondary' }}
                    >
                      View all
                    </Button>
                  }
                />
                <Box>
                  {recentFilesData.map((file) => (
                    <RecentFileItem key={file.id} file={file} />
                  ))}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Grid container spacing={3}>
            {/* Upload File */}
            <Grid size={{ xs: 6 }}>
              <UploadFileCard />
            </Grid>

            {/* Upload Image (with crop/rotate) */}
            <Grid size={{ xs: 6 }}>
              <UploadImageCard />
            </Grid>

            {/* Storage Usage */}
            <Grid size={{ xs: 12 }}>
              <StorageUsageChart
                usedPercentage={totalStorageData.usedPercentage}
                usedStorage={totalStorageData.used}
                totalStorage={totalStorageData.total}
                categories={storageCategoriesData}
              />
            </Grid>

            {/* Upgrade Plan */}
            <Grid size={{ xs: 12 }}>
              <UpgradePlanCard />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

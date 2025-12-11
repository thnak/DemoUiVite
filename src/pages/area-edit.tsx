import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetAreaById } from 'src/api/hooks/generated/use-area';

import { AreaCreateEditView } from 'src/sections/area/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams();

  const {
    data: areaData,
    isLoading,
    error,
  } = useGetAreaById(id || '', {
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <DashboardContent>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}
        >
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (error || !areaData) {
    return (
      <DashboardContent>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}
        >
          <Typography color="error">Area not found</Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <>
      <title>{`Edit Area - ${CONFIG.appName}`}</title>

      <AreaCreateEditView
        isEdit
        currentArea={{
          id: areaData.id?.toString() || '',
          code: areaData.code || '',
          name: areaData.name || '',
          description: areaData.description || '',
        }}
      />
    </>
  );
}

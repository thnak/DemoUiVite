import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetUnitGroupById } from 'src/api/hooks/generated/use-unit-group';

import { UnitGroupCreateEditView } from 'src/sections/unit-group/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams();

  const {
    data: unitGroupData,
    isLoading,
    error,
  } = useGetUnitGroupById(id || '', {
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

  if (error || !unitGroupData) {
    return (
      <DashboardContent>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}
        >
          <Typography color="error">Unit group not found</Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <>
      <title>{`Edit Unit Group - ${CONFIG.appName}`}</title>

      <UnitGroupCreateEditView isEdit currentUnitGroup={unitGroupData} />
    </>
  );
}

import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetMachineTypeById } from 'src/api/hooks/generated/use-machine-type';

import { MachineTypeCreateEditView } from 'src/sections/machine-type/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams();

  const {
    data: machineTypeData,
    isLoading,
    error,
  } = useGetMachineTypeById(id || '', {
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

  if (error || !machineTypeData) {
    return (
      <DashboardContent>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}
        >
          <Typography color="error">Machine Type not found</Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <>
      <title>{`Edit Machine Type - ${CONFIG.appName}`}</title>

      <MachineTypeCreateEditView
        isEdit
        currentMachineType={{
          id: machineTypeData.id?.toString() || '',
          code: machineTypeData.code || '',
          name: machineTypeData.name || '',
          description: machineTypeData.description || '',
        }}
      />
    </>
  );
}

import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetMachineById } from 'src/api/hooks/generated/use-machine';

import { MachineCreateEditView } from 'src/sections/machine/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams();

  const { data: machineData, isLoading, error } = useGetMachineById(id || '', {
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (error || !machineData) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <Typography color="error">Machine not found</Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <>
      <title>{`Edit Machine - ${CONFIG.appName}`}</title>

      <MachineCreateEditView
        isEdit
        currentMachine={{
          id: machineData.id?.toString() || '',
          code: machineData.code || '',
          name: machineData.name || '',
          imageUrl: machineData.imageUrl || '',
          areaId: machineData.areaId ? String(machineData.areaId) : null,
          calendarId: machineData.calendarId ? String(machineData.calendarId) : null,
          calculationMode: machineData.calculationMode || 'pairParallel',
        }}
      />
    </>
  );
}

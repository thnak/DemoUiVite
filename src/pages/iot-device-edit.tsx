import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetIoTDeviceById } from 'src/api/hooks/generated/use-io-tdevice';

import { IoTDeviceCreateEditView } from 'src/sections/iot-device/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams();

  const { data: deviceData, isLoading, error } = useGetIoTDeviceById(id || '', {
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

  if (error || !deviceData) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <Typography color="error">IoT Device not found</Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <>
      <title>{`Edit IoT Device - ${CONFIG.appName}`}</title>

      <IoTDeviceCreateEditView
        isEdit
        currentDevice={{
          id: deviceData.id?.toString() || '',
          code: deviceData.code || '',
          name: deviceData.name || '',
          macAddress: deviceData.macAddress || '',
          mqttPassword: deviceData.mqttPassword || '',
          type: deviceData.type || '',
          machineId: deviceData.machineId?.toString() || '',
          machineName: '',
          imageUrl: deviceData.imageUrl || '',
        }}
      />
    </>
  );
}

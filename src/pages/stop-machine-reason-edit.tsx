import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/config-global';
import { useGetStopMachineReasonById } from 'src/api/hooks/generated/use-stop-machine-reason';

import { StopMachineReasonCreateEditView } from 'src/sections/stop-machine-reason/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams();
  const [stopMachineReason, setStopMachineReason] = useState<any>(null);
  const { data, isLoading, error } = useGetStopMachineReasonById(id || '', {
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      setStopMachineReason({
        id: data.id?.toString() || '',
        code: data.code || '',
        name: data.name || '',
        description: data.description || '',
        colorHex: data.colorHex || '#000000',
        groupId: data.groupId ? String(data.groupId) : null,
        requiresApproval: data.requiresApproval || false,
        requiresNote: data.requiresNote || false,
        requiresAttachment: data.requiresAttachment || false,
        requiresComment: data.requiresComment || false,
        translations: data.translations || {},
      });
    }
  }, [data]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !stopMachineReason) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Stop Machine Reason not found</div>
      </Box>
    );
  }

  return (
    <>
      <title>{`Edit Stop Machine Reason - ${CONFIG.appName}`}</title>

      <StopMachineReasonCreateEditView isEdit currentStopMachineReason={stopMachineReason} />
    </>
  );
}

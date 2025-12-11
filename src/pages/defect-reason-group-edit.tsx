import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetDefectReasonGroupById } from 'src/api/hooks/generated/use-defect-reason-group';

import { DefectReasonGroupCreateEditView } from 'src/sections/defect-reason-group/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams();

  const {
    data: defectReasonGroupData,
    isLoading,
    error,
  } = useGetDefectReasonGroupById(id || '', {
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

  if (error || !defectReasonGroupData) {
    return (
      <DashboardContent>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}
        >
          <Typography color="error">Defect reason group not found</Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <>
      <title>{`Edit Defect Reason Group - ${CONFIG.appName}`}</title>

      <DefectReasonGroupCreateEditView
        isEdit
        currentDefectReasonGroup={{
          id: defectReasonGroupData.id?.toString() || '',
          code: defectReasonGroupData.code || '',
          name: defectReasonGroupData.name || '',
          colorHex: defectReasonGroupData.colorHex || '',
          description: defectReasonGroupData.description || '',
        }}
      />
    </>
  );
}

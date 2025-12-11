import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetDefectReasonById } from 'src/api/hooks/generated/use-defect-reason';

import { DefectReasonCreateEditView } from 'src/sections/defect-reason/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams();

  const {
    data: defectReasonData,
    isLoading,
    error,
  } = useGetDefectReasonById(id || '', {
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

  if (error || !defectReasonData) {
    return (
      <DashboardContent>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}
        >
          <Typography color="error">Defect reason not found</Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <>
      <title>{`Edit Defect Reason - ${CONFIG.appName}`}</title>

      <DefectReasonCreateEditView
        isEdit
        currentDefectReason={{
          id: defectReasonData.id?.toString() || '',
          code: defectReasonData.code || '',
          name: defectReasonData.name || '',
          requireExtraNoteFromOperator: defectReasonData.requireExtraNoteFromOperator || false,
          addScrapAndIncreaseTotalQuantity:
            defectReasonData.addScrapAndIncreaseTotalQuantity || false,
          colorHex: defectReasonData.colorHex || '',
          description: defectReasonData.description || '',
        }}
      />
    </>
  );
}

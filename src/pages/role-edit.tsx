import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetRoleById } from 'src/api/hooks/generated/use-role';

import { RoleCreateEditView } from 'src/sections/role/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams();

  const {
    data: roleData,
    isLoading,
    error,
  } = useGetRoleById(id || '', {
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

  if (error || !roleData) {
    return (
      <DashboardContent>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}
        >
          <Typography color="error">Role not found</Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <>
      <title>{`Edit Role - ${CONFIG.appName}`}</title>

      <RoleCreateEditView
        isEdit
        currentRole={{
          id: roleData.id?.toString() || '',
          name: roleData.name || '',
          description: roleData.description || '',
        }}
      />
    </>
  );
}

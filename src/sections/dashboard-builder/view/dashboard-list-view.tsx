import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { deleteDashboard, getDashboardUrl, getAllDashboards } from '../storage';

import type { DashboardState } from '../types';

// ----------------------------------------------------------------------

export function DashboardListView() {
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState<DashboardState[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dashboardToDelete, setDashboardToDelete] = useState<DashboardState | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Load dashboards
  const loadDashboards = useCallback(() => {
    const loaded = getAllDashboards();
    setDashboards(loaded);
  }, []);

  useEffect(() => {
    loadDashboards();
    // Load dashboards on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle delete confirmation
  const handleDeleteClick = (dashboard: DashboardState) => {
    setDashboardToDelete(dashboard);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (dashboardToDelete) {
      try {
        deleteDashboard(dashboardToDelete.id);
        setSnackbar({
          open: true,
          message: 'Dashboard deleted successfully',
          severity: 'success',
        });
        loadDashboards();
      } catch {
        setSnackbar({
          open: true,
          message: 'Failed to delete dashboard',
          severity: 'error',
        });
      }
    }
    setDeleteDialogOpen(false);
    setDashboardToDelete(null);
  };

  // Copy URL to clipboard
  const handleCopyUrl = async (dashboard: DashboardState) => {
    const url = `${window.location.origin}${getDashboardUrl(dashboard.id)}`;
    try {
      await navigator.clipboard.writeText(url);
      setSnackbar({
        open: true,
        message: 'URL copied to clipboard',
        severity: 'success',
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to copy URL',
        severity: 'error',
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <DashboardContent maxWidth="xl">
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4">Dashboard Builder</Typography>
          <Typography variant="body2" color="text.secondary">
            Create and manage your custom dashboards
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Iconify icon="mdi:plus" />}
          onClick={() => navigate('/dashboard-builder/new')}
        >
          Create Dashboard
        </Button>
      </Stack>

      {/* Dashboard List */}
      {dashboards.length === 0 ? (
        <Card
          sx={{
            p: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
            minHeight: 300,
          }}
        >
          <Iconify icon="mdi:view-dashboard-outline" width={64} sx={{ color: 'text.secondary' }} />
          <Typography variant="h6" color="text.secondary">
            No dashboards yet
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Create your first dashboard to get started with the no-code builder
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:plus" />}
            onClick={() => navigate('/dashboard-builder/new')}
          >
            Create Your First Dashboard
          </Button>
        </Card>
      ) : (
        <Stack spacing={2}>
          {dashboards.map((dashboard) => (
            <Card
              key={dashboard.id}
              sx={{
                p: 3,
                display: 'flex',
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6" noWrap>
                  {dashboard.name}
                </Typography>
                {dashboard.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {dashboard.description}
                  </Typography>
                )}
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {dashboard.widgets.length} widget
                    {dashboard.widgets.length !== 1 ? 's' : ''}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Updated: {formatDate(dashboard.updatedAt)}
                  </Typography>
                </Stack>
              </Box>

              <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                <Tooltip title="Open dashboard">
                  <IconButton
                    onClick={() => navigate(getDashboardUrl(dashboard.id))}
                    color="primary"
                  >
                    <Iconify icon="mdi:open-in-new" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copy URL">
                  <IconButton onClick={() => handleCopyUrl(dashboard)}>
                    <Iconify icon="mdi:link" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit dashboard">
                  <IconButton onClick={() => navigate(getDashboardUrl(dashboard.id))}>
                    <Iconify icon="mdi:pencil" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete dashboard">
                  <IconButton color="error" onClick={() => handleDeleteClick(dashboard)}>
                    <Iconify icon="mdi:delete" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Dashboard</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &quot;{dashboardToDelete?.name}&quot;? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}

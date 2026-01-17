import type { MouseEvent } from 'react';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Card,
  Table,
  Stack,
  Button,
  MenuItem,
  Popover,
  MenuList,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
  TableContainer,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useSavedReports } from '../hooks';

// ----------------------------------------------------------------------

export function ReportBuilderListView() {
  const navigate = useNavigate();
  const { savedReports, deleteReport, duplicateReport } = useSavedReports();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const handleOpenMenu = useCallback((event: MouseEvent<HTMLElement>, reportId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedReportId(reportId);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
    setSelectedReportId(null);
  }, []);

  const handleEdit = useCallback(() => {
    if (selectedReportId) {
      navigate(`/report-builder/${selectedReportId}/edit`);
    }
    handleCloseMenu();
  }, [selectedReportId, navigate, handleCloseMenu]);

  const handleDuplicate = useCallback(() => {
    if (selectedReportId) {
      const duplicate = duplicateReport(selectedReportId);
      if (duplicate) {
        navigate(`/report-builder/${duplicate.id}/edit`);
      }
    }
    handleCloseMenu();
  }, [selectedReportId, duplicateReport, navigate, handleCloseMenu]);

  const handleDelete = useCallback(() => {
    if (selectedReportId) {
      deleteReport(selectedReportId);
    }
    handleCloseMenu();
  }, [selectedReportId, deleteReport, handleCloseMenu]);

  const handleCreateNew = useCallback(() => {
    navigate('/report-builder/create');
  }, [navigate]);

  return (
    <DashboardContent>
      {/* Page Header */}
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Report Builder
          </Typography>
          <Stack direction="row" spacing={1} sx={{ typography: 'body2', color: 'text.disabled' }}>
            <Typography variant="inherit">Developer Hub</Typography>
            <Typography variant="inherit">•</Typography>
            <Typography variant="inherit">Report Builder</Typography>
          </Stack>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="solar:cloud-upload-bold" />}
          >
            Import
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="solar:cloud-download-bold" />}
          >
            Export
          </Button>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleCreateNew}
          >
            New Report
          </Button>
        </Box>
      </Box>

      {/* Reports Table */}
      <Card>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Source Entity</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Updated</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {savedReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Stack spacing={2} alignItems="center">
                        <Iconify
                          icon="solar:document-add-bold-duotone"
                          width={64}
                          sx={{ color: 'text.disabled' }}
                        />
                        <Typography variant="h6" color="text.secondary">
                          No saved reports
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                          Create your first report to get started
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<Iconify icon="mingcute:add-line" />}
                          onClick={handleCreateNew}
                        >
                          Create Report
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  savedReports.map((report) => (
                    <TableRow key={report.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2">{report.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {report.description || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {report.query.sourceEntity || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(report.updatedAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={(e) => handleOpenMenu(e, report.id)}>
                          <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>

      {/* Action Menu */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList disablePadding sx={{ p: 0.5, gap: 0.5, width: 160 }}>
          <MenuItem onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDuplicate}>
            <Iconify icon="solar:copy-bold" />
            Duplicate
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </DashboardContent>
  );
}

import type { DayOfWeek, ShiftDefinition, ShiftTemplateEntity } from 'src/api/types/generated';

import React, { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Snackbar from '@mui/material/Snackbar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { STANDARD_ROWS_PER_PAGE_OPTIONS } from 'src/constants/table';
import {
  deleteShiftTemplate,
  getShiftTemplatePage,
} from 'src/api/services/generated/shift-template';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDeleteDialog } from 'src/components/confirm-delete-dialog';

import { ShiftTemplateTableToolbar } from '../shift-template-table-toolbar';

// ----------------------------------------------------------------------

// Day abbreviations for chips
const DAY_ABBREVIATIONS: Record<DayOfWeek, string> = {
  sunday: 'Sun',
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
};

// Parse ISO 8601 duration to minutes (e.g., "PT8H30M" -> 510)
function parseDurationToMinutes(duration: string | undefined): number {
  if (!duration) return 0;

  let minutes = 0;
  const hourMatch = duration.match(/(\d+)H/);
  const minuteMatch = duration.match(/(\d+)M/);

  if (hourMatch) {
    minutes += parseInt(hourMatch[1], 10) * 60;
  }
  if (minuteMatch) {
    minutes += parseInt(minuteMatch[1], 10);
  }

  return minutes;
}

// Calculate total working time from shift definitions
function calculateTotalWorkingTime(shifts: ShiftDefinition[] | null | undefined): string {
  if (!shifts || shifts.length === 0) return '0h';

  let totalMinutes = 0;

  for (const shift of shifts) {
    const startMinutes = parseDurationToMinutes(shift.startTime);
    let endMinutes = parseDurationToMinutes(shift.endTime);

    // Handle overnight shifts
    if (endMinutes <= startMinutes) {
      endMinutes += 24 * 60;
    }

    const shiftDuration = endMinutes - startMinutes;

    // Subtract break times
    let breakMinutes = 0;
    if (shift.breakDefinitions) {
      for (const breakDef of shift.breakDefinitions) {
        const breakStart = parseDurationToMinutes(breakDef.startTime);
        let breakEnd = parseDurationToMinutes(breakDef.endTime);
        if (breakEnd <= breakStart) {
          breakEnd += 24 * 60;
        }
        breakMinutes += breakEnd - breakStart;
      }
    }

    totalMinutes += shiftDuration - breakMinutes;
  }

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

// Get unique work days from shift definitions
function getWorkDays(shifts: ShiftDefinition[] | null | undefined): DayOfWeek[] {
  if (!shifts || shifts.length === 0) return [];

  const daysSet = new Set<DayOfWeek>();
  for (const shift of shifts) {
    if (shift.applicableDay) {
      daysSet.add(shift.applicableDay);
    }
  }

  // Sort days in order from Sunday to Saturday
  const dayOrder: DayOfWeek[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  return dayOrder.filter((day) => daysSet.has(day));
}

// ----------------------------------------------------------------------

export function ShiftTemplateView() {
  const router = useRouter();
  const [templates, setTemplates] = useState<ShiftTemplateEntity[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterName, setFilterName] = useState('');
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getShiftTemplatePage([], {
        pageNumber: page,
        pageSize: rowsPerPage,
      });
      setTemplates(response.items || []);
      setTotalItems(response.totalItems || 0);
    } catch (err) {
      setError('Failed to load shift templates');
      console.error('Error fetching shift templates:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchTemplates().then((_) => {});
  }, [fetchTemplates]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteShiftTemplate(id);
        setSuccessMessage('Shift template deleted successfully');
        await fetchTemplates();
        setSelected((prev) => prev.filter((i) => i !== id));
      } catch (err: any) {
        setErrorMessage(err?.message || 'Failed to delete shift template');
        console.error('Error deleting shift template:', err);
      }
    },
    [fetchTemplates]
  );

  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, templateId: string) => {
      setOpenPopover(event.currentTarget);
      setSelectedTemplateId(templateId);
    },
    []
  );

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
    setSelectedTemplateId(null);
  }, []);

  const handleEditTemplate = useCallback(() => {
    if (selectedTemplateId) {
      handleClosePopover();
      router.push(`/shift-templates/${selectedTemplateId}/edit`);
    }
  }, [selectedTemplateId, router, handleClosePopover]);

  const handleDeleteTemplate = useCallback(() => {
    if (selectedTemplateId) {
      handleClosePopover();
      setItemToDelete(selectedTemplateId);
      setDeleteDialogOpen(true);
    }
  }, [selectedTemplateId, handleClosePopover]);

  const handleConfirmDelete = useCallback(async () => {
    if (itemToDelete) {
      setIsDeleting(true);
      await handleDelete(itemToDelete);
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  }, [itemToDelete, handleDelete]);

  const handleCloseDeleteDialog = useCallback(() => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  }, [isDeleting]);

  const handleCloseSuccess = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleDeleteSelected = useCallback(async () => {
    try {
      await Promise.all(selected.map((id) => deleteShiftTemplate(id)));
      await fetchTemplates();
      setSelected([]);
    } catch (err) {
      console.error('Error deleting shift templates:', err);
    }
  }, [selected, fetchTemplates]);

  const handleSelectAll = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setSelected(templates.map((t) => t.id?.toString() || '').filter(Boolean));
      } else {
        setSelected([]);
      }
    },
    [templates]
  );

  const handleSelectOne = useCallback((id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }, []);

  const handleFilterName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
    setPage(0);
  }, []);

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  return (
    <DashboardContent>
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
            Shift Templates
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Shift Templates
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              List
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="solar:cloud-upload-bold" />}
          >
            Import
          </Button>
          <Button variant="outlined" color="inherit" startIcon={<Iconify icon="solar:cloud-download-bold" />}>
            Export
          </Button>
          <Button
            component={RouterLink}
            href="/shift-templates/create"
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add Template
          </Button>
        </Box>
      </Box>

      <Card>
        <ShiftTemplateTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterName}
          onDeleteSelected={handleDeleteSelected}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < templates.length}
                      checked={templates.length > 0 && selected.length === templates.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Work Days</TableCell>
                  <TableCell>Total Working Time</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                      <Typography variant="body1" color="error">
                        {error}
                      </Typography>
                      <Button onClick={fetchTemplates} sx={{ mt: 2 }}>
                        Retry
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : templates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                      <Typography variant="body1" color="text.secondary">
                        No shift templates found
                      </Typography>
                      <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                        Click &quot;Add Template&quot; to create your first shift template
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  templates.map((template) => {
                    const templateId = template.id?.toString() || '';
                    const workDays = getWorkDays(template.shifts);
                    const totalWorkingTime = calculateTotalWorkingTime(template.shifts);

                    return (
                      <TableRow key={templateId} hover selected={selected.includes(templateId)}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selected.includes(templateId)}
                            onChange={() => handleSelectOne(templateId)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {template.code}
                          </Typography>
                        </TableCell>
                        <TableCell>{template.name}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                            {workDays.length > 0 ? (
                              workDays.map((day) => (
                                <Chip
                                  key={day}
                                  label={DAY_ABBREVIATIONS[day]}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              ))
                            ) : (
                              <Typography variant="body2" color="text.disabled">
                                No days set
                              </Typography>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{totalWorkingTime}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={(e) => handleOpenPopover(e, templateId)}
                            aria-label="More actions"
                          >
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={page}
          count={totalItems}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[...STANDARD_ROWS_PER_PAGE_OPTIONS]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleEditTemplate}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDeleteTemplate} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        entityName="shift template"
        loading={isDeleting}
      />

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}

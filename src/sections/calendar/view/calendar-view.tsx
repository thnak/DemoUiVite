import type { CalendarDto } from 'src/api/types/generated';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
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
  deleteCalendar,
  getapiCalendarsearchcalendars,
} from 'src/api/services/generated/calendar';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDeleteDialog } from 'src/components/confirm-delete-dialog';

import { CalendarTableToolbar } from '../calendar-table-toolbar';

// ----------------------------------------------------------------------

// Format date for display
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format ISO 8601 duration for display
function formatDuration(duration: string | null | undefined): string {
  if (!duration) return '-';

  // Parse ISO 8601 duration (e.g., PT7H, PT30M, PT1H30M)
  const match = duration.match(
    /^PT?(?:(-?\d+(?:\.\d+)?)H)?(?:(-?\d+(?:\.\d+)?)M)?(?:(-?\d+(?:\.\d+)?)S)?$/
  );
  if (!match) return duration;

  const hours = match[1] ? parseFloat(match[1]) : 0;
  const minutes = match[2] ? parseFloat(match[2]) : 0;
  const seconds = match[3] ? parseFloat(match[3]) : 0;

  const parts: string[] = [];
  if (hours !== 0) parts.push(`${hours}h`);
  if (minutes !== 0) parts.push(`${minutes}m`);
  if (seconds !== 0) parts.push(`${seconds}s`);

  return parts.length > 0 ? parts.join(' ') : '0';
}

// ----------------------------------------------------------------------

export function CalendarView() {
  const router = useRouter();
  const [calendars, setCalendars] = useState<CalendarDto[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterName, setFilterName] = useState('');
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCalendars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getapiCalendarsearchcalendars({
        pageNumber: page,
        pageSize: rowsPerPage,
      });
      setCalendars(response.items || []);
      setTotalItems(response.totalItems || 0);
    } catch (err) {
      setError('Failed to load calendars');
      console.error('Error fetching calendars:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchCalendars();
  }, [fetchCalendars]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        setIsDeleting(true);
        await deleteCalendar(id);
        await fetchCalendars();
        setSelected((prev) => prev.filter((i) => i !== id));
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      } catch (err) {
        console.error('Error deleting calendar:', err);
      } finally {
        setIsDeleting(false);
      }
    },
    [fetchCalendars]
  );

  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, calendarId: string) => {
      setOpenPopover(event.currentTarget);
      setSelectedCalendarId(calendarId);
    },
    []
  );

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
    setSelectedCalendarId(null);
  }, []);

  const handleEditCalendar = useCallback(() => {
    if (selectedCalendarId) {
      handleClosePopover();
      router.push(`/calendars/${selectedCalendarId}/edit`);
    }
  }, [selectedCalendarId, router, handleClosePopover]);

  const handleViewDetails = useCallback(() => {
    if (selectedCalendarId) {
      handleClosePopover();
      router.push(`/calendars/${selectedCalendarId}/detail`);
    }
  }, [selectedCalendarId, router, handleClosePopover]);

  const handleDeleteCalendar = useCallback(() => {
    if (selectedCalendarId) {
      handleClosePopover();
      setItemToDelete(selectedCalendarId);
      setDeleteDialogOpen(true);
    }
  }, [selectedCalendarId, handleClosePopover]);

  const handleConfirmDelete = useCallback(() => {
    if (itemToDelete) {
      handleDelete(itemToDelete);
    }
  }, [itemToDelete, handleDelete]);

  const handleCloseDeleteDialog = useCallback(() => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  }, [isDeleting]);

  const handleDeleteSelected = useCallback(async () => {
    setBulkDeleteDialogOpen(true);
  }, []);

  const handleConfirmBulkDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      await Promise.all(selected.map((id) => deleteCalendar(id)));
      await fetchCalendars();
      setSelected([]);
      setBulkDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error deleting calendars:', err);
    } finally {
      setIsDeleting(false);
    }
  }, [selected, fetchCalendars]);

  const handleCloseBulkDeleteDialog = useCallback(() => {
    if (!isDeleting) {
      setBulkDeleteDialogOpen(false);
    }
  }, [isDeleting]);

  const handleSelectAll = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setSelected(calendars.map((c) => c.id?.toString() || '').filter(Boolean));
      } else {
        setSelected([]);
      }
    },
    [calendars]
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
            Calendars
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Calendars
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
            href="/calendars/create"
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add Calendar
          </Button>
        </Box>
      </Box>

      <Card>
        <CalendarTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterName}
          onDeleteSelected={handleDeleteSelected}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < calendars.length}
                      checked={calendars.length > 0 && selected.length === calendars.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Shift Template</TableCell>
                  <TableCell>Apply From</TableCell>
                  <TableCell>Apply To</TableCell>
                  <TableCell>Plan to Infinite</TableCell>
                  <TableCell>Work Start Time</TableCell>
                  <TableCell>Time Offset</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={11} align="center" sx={{ py: 10 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={11} align="center" sx={{ py: 10 }}>
                      <Typography variant="body1" color="error">
                        {error}
                      </Typography>
                      <Button onClick={fetchCalendars} sx={{ mt: 2 }}>
                        Retry
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : calendars.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} align="center" sx={{ py: 10 }}>
                      <Typography variant="body1" color="text.secondary">
                        No calendars found
                      </Typography>
                      <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                        Click &quot;Add Calendar&quot; to create your first calendar
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  calendars.map((calendar) => {
                    const calendarId = calendar.id?.toString() || '';

                    return (
                      <TableRow key={calendarId} hover selected={selected.includes(calendarId)}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selected.includes(calendarId)}
                            onChange={() => handleSelectOne(calendarId)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {calendar.code}
                          </Typography>
                        </TableCell>
                        <TableCell>{calendar.name}</TableCell>
                        <TableCell>{calendar.shiftTemplateName || '-'}</TableCell>
                        <TableCell>{formatDate(calendar.applyFrom)}</TableCell>
                        <TableCell>
                          {calendar.plan2Infinite ? (
                            <Chip label="Infinite" size="small" color="primary" />
                          ) : (
                            formatDate(calendar.applyTo)
                          )}
                        </TableCell>
                        <TableCell>
                          {calendar.plan2Infinite ? (
                            <Chip label="Yes" size="small" color="success" />
                          ) : (
                            <Chip label="No" size="small" variant="outlined" />
                          )}
                        </TableCell>
                        <TableCell>{formatDuration(calendar.workDateStartTime)}</TableCell>
                        <TableCell>{formatDuration(calendar.timeOffset)}</TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {calendar.description || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={(e) => handleOpenPopover(e, calendarId)}
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

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        entityName="calendar"
        loading={isDeleting}
      />

      <ConfirmDeleteDialog
        open={bulkDeleteDialogOpen}
        onClose={handleCloseBulkDeleteDialog}
        onConfirm={handleConfirmBulkDelete}
        entityName="calendar"
        itemCount={selected.length}
        loading={isDeleting}
      />

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
          <MenuItem onClick={handleViewDetails}>
            <Iconify icon="solar:eye-bold" />
            View Details
          </MenuItem>

          <MenuItem onClick={handleEditCalendar}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDeleteCalendar} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </DashboardContent>
  );
}

import type { CalendarDto, CalendarType } from 'src/api/types/generated';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  deleteCalendar,
  postapiCalendarsearchcalendars,
} from 'src/api/services/generated/calendar';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

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

// Get color for calendar type chip
function getCalendarTypeColor(type: CalendarType | undefined): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error' {
  switch (type) {
    case 'production':
      return 'primary';
    case 'office':
      return 'info';
    case 'maintenance':
      return 'warning';
    case 'logistics':
      return 'secondary';
    case 'general':
    default:
      return 'default';
  }
}

// ----------------------------------------------------------------------

export function CalendarView() {
  const [calendars, setCalendars] = useState<CalendarDto[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await postapiCalendarsearchcalendars([], {
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
        await deleteCalendar(id);
        await fetchCalendars();
        setSelected((prev) => prev.filter((i) => i !== id));
      } catch (err) {
        console.error('Error deleting calendar:', err);
      }
    },
    [fetchCalendars]
  );

  const handleDeleteSelected = useCallback(async () => {
    try {
      await Promise.all(selected.map((id) => deleteCalendar(id)));
      await fetchCalendars();
      setSelected([]);
    } catch (err) {
      console.error('Error deleting calendars:', err);
    }
  }, [selected, fetchCalendars]);

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

      <Card>
        {selected.length > 0 && (
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: 'primary.lighter',
            }}
          >
            <Typography>{selected.length} selected</Typography>
            <Button
              color="error"
              onClick={handleDeleteSelected}
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            >
              Delete Selected
            </Button>
          </Box>
        )}

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
                  <TableCell>Type</TableCell>
                  <TableCell>Shift Template</TableCell>
                  <TableCell>Apply From</TableCell>
                  <TableCell>Apply To</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 10 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 10 }}>
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
                    <TableCell colSpan={9} align="center" sx={{ py: 10 }}>
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
                        <TableCell>
                          <Chip
                            label={calendar.type || 'general'}
                            size="small"
                            color={getCalendarTypeColor(calendar.type)}
                          />
                        </TableCell>
                        <TableCell>{calendar.shiftTemplateName || '-'}</TableCell>
                        <TableCell>{formatDate(calendar.applyFrom)}</TableCell>
                        <TableCell>{formatDate(calendar.applyTo)}</TableCell>
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
                            component={RouterLink}
                            href={`/calendars/${calendarId}/edit`}
                          >
                            <Iconify icon="solar:pen-bold" />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(calendarId)}>
                            <Iconify icon="solar:trash-bin-trash-bold" />
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
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

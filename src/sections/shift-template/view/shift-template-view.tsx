import type { ShiftTemplate } from 'src/types/shift';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
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

import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { shiftTemplateService } from 'src/services/shiftTemplateService';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export function ShiftTemplateView() {
  const [templates, setTemplates] = useState<ShiftTemplate[]>(() => shiftTemplateService.getAll());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);

  const handleRefresh = useCallback(() => {
    setTemplates(shiftTemplateService.getAll());
    setSelected([]);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      shiftTemplateService.delete(id);
      handleRefresh();
    },
    [handleRefresh]
  );

  const handleDeleteSelected = useCallback(() => {
    shiftTemplateService.deleteMultiple(selected);
    handleRefresh();
  }, [selected, handleRefresh]);

  const handleSelectAll = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setSelected(templates.map((t) => t.id));
      } else {
        setSelected([]);
      }
    },
    [templates]
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

  const paginatedTemplates = templates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
            <Button color="error" onClick={handleDeleteSelected} startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}>
              Delete Selected
            </Button>
          </Box>
        )}

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
                  <TableCell>Week Type</TableCell>
                  <TableCell>Pattern</TableCell>
                  <TableCell>Shifts</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTemplates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                      <Typography variant="body1" color="text.secondary">
                        No shift templates found
                      </Typography>
                      <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                        Click &quot;Add Template&quot; to create your first shift template
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTemplates.map((template) => (
                    <TableRow
                      key={template.id}
                      hover
                      selected={selected.includes(template.id)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected.includes(template.id)}
                          onChange={() => handleSelectOne(template.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {template.code}
                        </Typography>
                      </TableCell>
                      <TableCell>{template.name}</TableCell>
                      <TableCell>
                        {template.weekType === '5-day' ? '5-Day' : '7-Day'}
                      </TableCell>
                      <TableCell>
                        {template.shiftPattern === '2-shifts' ? '2 Shifts' : '3 Shifts'}
                      </TableCell>
                      <TableCell>{template.definitions.length}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          component={RouterLink}
                          href={`/shift-templates/${template.id}/edit`}
                        >
                          <Iconify icon="solar:pen-bold" />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(template.id)}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={page}
          count={templates.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

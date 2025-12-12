import type { ChangeEvent } from 'react';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { UnitGroupTableRow } from '../unit-group-table-row';
import { UnitGroupTableToolbar } from '../unit-group-table-toolbar';

import type { UnitGroupProps } from '../unit-group-table-row';

// ----------------------------------------------------------------------

export function UnitGroupListView() {
  const router = useRouter();
  const [unitGroups] = useState<UnitGroupProps[]>([
    {
      id: '1',
      name: 'Mass',
      description: 'Units for measuring mass and weight',
    },
    {
      id: '2',
      name: 'Volume',
      description: 'Units for measuring volume and capacity',
    },
    {
      id: '3',
      name: 'Count',
      description: 'Units for counting items',
    },
    {
      id: '4',
      name: 'Length',
      description: 'Units for measuring length and distance',
    },
    {
      id: '5',
      name: 'Area',
      description: 'Units for measuring area',
    },
  ]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const handleFilterName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
    setPage(0);
  }, []);

  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleSelectRow = useCallback(
    (id: string) => {
      const newSelected = selected.includes(id)
        ? selected.filter((value) => value !== id)
        : [...selected, id];
      setSelected(newSelected);
    },
    [selected]
  );

  const handleDeleteRow = useCallback(async (id: string) => {
    // TODO: Implement delete
    console.log('Delete unit group:', id);
  }, []);

  const filteredUnitGroups = unitGroups.filter((group) =>
    group.name.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <DashboardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Unit Groups
        </Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => router.push('/settings/unit-groups/create')}
        >
          New Unit Group
        </Button>
      </Box>

      <Card>
        <UnitGroupTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredUnitGroups
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UnitGroupTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => handleSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={page}
          count={filteredUnitGroups.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

import type { ChangeEvent } from 'react';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type Unit = {
  id: string;
  name: string;
  symbol: string;
  group: string;
  baseUnit: boolean;
  description: string;
};

export function UnitListView() {
  const router = useRouter();
  const [units, setUnits] = useState<Unit[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    setUnits([
      {
        id: '1',
        name: 'Kilogram',
        symbol: 'kg',
        group: 'Mass',
        baseUnit: true,
        description: 'Base unit of mass',
      },
      {
        id: '2',
        name: 'Gram',
        symbol: 'g',
        group: 'Mass',
        baseUnit: false,
        description: 'Unit of mass',
      },
      {
        id: '3',
        name: 'Liter',
        symbol: 'L',
        group: 'Volume',
        baseUnit: true,
        description: 'Base unit of volume',
      },
      {
        id: '4',
        name: 'Milliliter',
        symbol: 'mL',
        group: 'Volume',
        baseUnit: false,
        description: 'Unit of volume',
      },
      {
        id: '5',
        name: 'Piece',
        symbol: 'pcs',
        group: 'Count',
        baseUnit: true,
        description: 'Unit of count',
      },
    ]);
  }, []);

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

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`/settings/units/${id}/edit`);
    },
    [router]
  );

  const handleDelete = useCallback(async (id: string) => {
    // TODO: Implement delete
    console.log('Delete unit:', id);
  }, []);

  const filteredUnits = units.filter((unit) =>
    unit.name.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <DashboardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Units
        </Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => router.push('/settings/units/create')}
        >
          New Unit
        </Button>
      </Box>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Symbol</TableCell>
                  <TableCell>Group</TableCell>
                  <TableCell>Base Unit</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredUnits
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover key={row.id}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.symbol}</TableCell>
                      <TableCell>{row.group}</TableCell>
                      <TableCell>{row.baseUnit ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell align="right">
                        <Button size="small" onClick={() => handleEdit(row.id)}>
                          Edit
                        </Button>
                        <Button size="small" color="error" onClick={() => handleDelete(row.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={page}
          count={filteredUnits.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

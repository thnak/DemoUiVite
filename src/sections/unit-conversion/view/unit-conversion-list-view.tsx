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

type UnitConversion = {
  id: string;
  from: string;
  to: string;
  conversionFactor: number;
  offset: number;
  formulaDescription: string;
};

export function UnitConversionListView() {
  const router = useRouter();
  const [conversions, setConversions] = useState<UnitConversion[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    setConversions([
      {
        id: '1',
        from: 'Kilogram',
        to: 'Gram',
        conversionFactor: 1000,
        offset: 0,
        formulaDescription: 'g = kg * 1000',
      },
      {
        id: '2',
        from: 'Liter',
        to: 'Milliliter',
        conversionFactor: 1000,
        offset: 0,
        formulaDescription: 'mL = L * 1000',
      },
      {
        id: '3',
        from: 'Celsius',
        to: 'Fahrenheit',
        conversionFactor: 1.8,
        offset: 32,
        formulaDescription: 'F = C * 1.8 + 32',
      },
      {
        id: '4',
        from: 'Meter',
        to: 'Centimeter',
        conversionFactor: 100,
        offset: 0,
        formulaDescription: 'cm = m * 100',
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
      router.push(`/settings/unit-conversions/${id}/edit`);
    },
    [router]
  );

  const handleDelete = useCallback(async (id: string) => {
    // TODO: Implement delete
    console.log('Delete conversion:', id);
  }, []);

  const filteredConversions = conversions.filter(
    (conversion) =>
      conversion.from.toLowerCase().includes(filterName.toLowerCase()) ||
      conversion.to.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <DashboardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Unit Conversions
        </Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => router.push('/settings/unit-conversions/create')}
        >
          New Unit Conversion
        </Button>
      </Box>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Conversion Factor</TableCell>
                  <TableCell>Offset</TableCell>
                  <TableCell>Formula</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredConversions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover key={row.id}>
                      <TableCell>{row.from}</TableCell>
                      <TableCell>{row.to}</TableCell>
                      <TableCell>{row.conversionFactor}</TableCell>
                      <TableCell>{row.offset}</TableCell>
                      <TableCell>{row.formulaDescription}</TableCell>
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
          count={filteredConversions.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

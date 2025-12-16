import type { ChangeEvent } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

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
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { STANDARD_ROWS_PER_PAGE_OPTIONS } from 'src/constants/table';
import {
  unitGroupKeys,
  useDeleteUnitGroup,
  useGetUnitGroupPage,
} from 'src/api/hooks/generated/use-unit-group';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDeleteDialog } from 'src/components/confirm-delete-dialog';

import { UnitGroupTableRow } from '../unit-group-table-row';
import { UnitGroupTableToolbar } from '../unit-group-table-toolbar';

import type { UnitGroupProps } from '../unit-group-table-row';

// ----------------------------------------------------------------------

export function UnitGroupListView() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [unitGroups, setUnitGroups] = useState<UnitGroupProps[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterName, setFilterName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const { mutate: fetchUnitGroups } = useGetUnitGroupPage({
    onSuccess: (data) => {
      const mappedUnitGroups: UnitGroupProps[] = (data.items || []).map((item) => ({
        id: item.id?.toString() || '',
        name: item.name || '',
        description: item.description || '',
      }));
      setUnitGroups(mappedUnitGroups);
      setTotalItems(data.totalItems || 0);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const { mutate: deleteUnitGroupMutate } = useDeleteUnitGroup({
    onSuccess: () => {
      // Refetch unit groups after deletion
      fetchUnitGroups({
        data: [{ sortBy: orderBy, descending: order === 'desc' }],
        params: {
          pageNumber: page,
          pageSize: rowsPerPage,
          searchTerm: filterName || undefined,
        },
      });
      queryClient.invalidateQueries({ queryKey: unitGroupKeys.all });
    },
  });

  useEffect(() => {
    setIsLoading(true);
    fetchUnitGroups({
      data: [{ sortBy: orderBy, descending: order === 'desc' }],
      params: {
        pageNumber: page,
        pageSize: rowsPerPage,
        searchTerm: filterName || undefined,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, orderBy, order, filterName]);

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

  const handleDeleteRow = useCallback(
    (id: string) => {
      deleteUnitGroupMutate({ id });
    },
    [deleteUnitGroupMutate]
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
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
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
                  {unitGroups.map((row) => (
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
            )}
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
    </DashboardContent>
  );
}

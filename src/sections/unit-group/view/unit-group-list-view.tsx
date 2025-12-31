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

import { usePaginationParams } from 'src/hooks';
import { DashboardContent } from 'src/layouts/dashboard';
import { STANDARD_ROWS_PER_PAGE_OPTIONS } from 'src/constants/table';
import {
  unitGroupKeys,
  useDeleteUnitGroup,
  useGetUnitGroupPage,
} from 'src/api/hooks/generated/use-unit-group';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { UnitGroupTableRow } from '../unit-group-table-row';
import { UnitGroupTableToolbar } from '../unit-group-table-toolbar';

import type { UnitGroupProps } from '../unit-group-table-row';

// ----------------------------------------------------------------------

export function UnitGroupListView() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Use URL params for pagination state
  const { params, setParams, getUrlWithParams } = usePaginationParams({
    defaultPage: 0,
    defaultRowsPerPage: 5,
    defaultOrderBy: 'name',
    defaultOrder: 'asc',
  });

  const [unitGroups, setUnitGroups] = useState<UnitGroupProps[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);

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
        data: [{ sortBy: params.orderBy, descending: params.order === 'desc' }],
        params: {
          pageNumber: params.page,
          pageSize: params.rowsPerPage,
          searchTerm: params.filterName || undefined,
        },
      });
      queryClient.invalidateQueries({ queryKey: unitGroupKeys.all });
    },
  });

  useEffect(() => {
    setIsLoading(true);
    fetchUnitGroups({
      data: [{ sortBy: params.orderBy, descending: params.order === 'desc' }],
      params: {
        pageNumber: params.page,
        pageSize: params.rowsPerPage,
        searchTerm: params.filterName || undefined,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.rowsPerPage, params.orderBy, params.order, params.filterName]);

  const handleFilterName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setParams({ filterName: event.target.value, page: 0 });
  }, [setParams]);

  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setParams({ page: newPage });
  }, [setParams]);

  const handleChangeRowsPerPage = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setParams({
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
  }, [setParams]);

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
            Unit Group List
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Settings
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              Unit Groups
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => router.push('/settings/unit-groups/create')}
          >
            Add Unit Group
          </Button>
        </Box>
      </Box>

      <Card>
        <UnitGroupTableToolbar
          numSelected={selected.length}
          filterName={params.filterName || ''}
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
                      returnUrl={getUrlWithParams('/settings/unit-groups')}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={params.page}
          count={totalItems}
          rowsPerPage={params.rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[...STANDARD_ROWS_PER_PAGE_OPTIONS]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

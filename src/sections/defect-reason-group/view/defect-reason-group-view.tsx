import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  defectReasonGroupKeys,
  useDeleteDefectReasonGroup,
  useGetDefectReasonGroupPage,
} from 'src/api/hooks/generated/use-defect-reason-group';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { emptyRows } from '../defect-reason-group-utils';
import { DefectReasonGroupTableRow } from '../defect-reason-group-table-row';
import { DefectReasonGroupTableHead } from '../defect-reason-group-table-head';
import { DefectReasonGroupTableNoData } from '../defect-reason-group-table-no-data';
import { DefectReasonGroupTableToolbar } from '../defect-reason-group-table-toolbar';
import { DefectReasonGroupTableEmptyRows } from '../defect-reason-group-table-empty-rows';

import type { DefectReasonGroupProps } from '../defect-reason-group-table-row';

// ----------------------------------------------------------------------

export function DefectReasonGroupView() {
  const table = useTable();
  const queryClient = useQueryClient();

  const [filterName, setFilterName] = useState('');
  const [defectReasonGroups, setDefectReasonGroups] = useState<DefectReasonGroupProps[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { mutate: fetchDefectReasonGroups } = useGetDefectReasonGroupPage({
    onSuccess: (data) => {
      const mappedItems: DefectReasonGroupProps[] = (data.items || []).map((item) => ({
        id: item.id?.toString() || '',
        code: item.code || '',
        name: item.name || '',
        colorHex: item.colorHex || '',
        description: item.description || '',
      }));
      setDefectReasonGroups(mappedItems);
      setTotalItems(data.totalItems || 0);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const { mutate: deleteDefectReasonGroupMutate } = useDeleteDefectReasonGroup({
    onSuccess: () => {
      // Refetch after deletion
      fetchDefectReasonGroups({
        data: [{ sortBy: table.orderBy, descending: table.order === 'desc' }],
        params: {
          pageNumber: table.page,
          pageSize: table.rowsPerPage,
          searchTerm: filterName || undefined,
        },
      });
      queryClient.invalidateQueries({ queryKey: defectReasonGroupKeys.all });
    },
  });

  useEffect(() => {
    setIsLoading(true);
    fetchDefectReasonGroups({
      data: [{ sortBy: table.orderBy, descending: table.order === 'desc' }],
      params: {
        pageNumber: table.page,
        pageSize: table.rowsPerPage,
        searchTerm: filterName || undefined,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.page, table.rowsPerPage, table.orderBy, table.order, filterName]);

  const handleDeleteRow = useCallback(
    (id: string) => {
      deleteDefectReasonGroupMutate({ id });
    },
    [deleteDefectReasonGroupMutate]
  );

  const notFound = !defectReasonGroups.length && !!filterName;

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
            List
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Defect Reason Group
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
          href="/defect-reason-group/create"
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Add group
        </Button>
      </Box>

      <Card>
        <DefectReasonGroupTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Table sx={{ minWidth: 800 }}>
                <DefectReasonGroupTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  rowCount={totalItems}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      defectReasonGroups.map((item) => item.id)
                    )
                  }
                  headLabel={[
                    { id: 'code', label: 'Code' },
                    { id: 'name', label: 'Name' },
                    { id: 'colorHex', label: 'Color' },
                    { id: 'description', label: 'Description' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {defectReasonGroups.map((row) => (
                    <DefectReasonGroupTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                    />
                  ))}

                  <DefectReasonGroupTableEmptyRows
                    height={68}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, totalItems)}
                  />

                  {notFound && <DefectReasonGroupTableNoData searchQuery={filterName} />}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={totalItems}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('code');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}

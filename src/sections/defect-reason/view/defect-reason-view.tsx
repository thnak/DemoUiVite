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
import { STANDARD_ROWS_PER_PAGE_OPTIONS } from 'src/constants/table';
import {
  defectReasonKeys,
  useDeleteDefectReason,
  useGetDefectReasonPage,
} from 'src/api/hooks/generated/use-defect-reason';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { emptyRows } from '../defect-reason-utils';
import { DefectReasonTableRow } from '../defect-reason-table-row';
import { DefectReasonTableHead } from '../defect-reason-table-head';
import { DefectReasonTableNoData } from '../defect-reason-table-no-data';
import { DefectReasonTableToolbar } from '../defect-reason-table-toolbar';
import { DefectReasonTableEmptyRows } from '../defect-reason-table-empty-rows';

import type { DefectReasonProps } from '../defect-reason-table-row';

// ----------------------------------------------------------------------

export function DefectReasonView() {
  const table = useTable();
  const queryClient = useQueryClient();

  const [filterName, setFilterName] = useState('');
  const [defectReasons, setDefectReasons] = useState<DefectReasonProps[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { mutate: fetchDefectReasons } = useGetDefectReasonPage({
    onSuccess: (data) => {
      const mappedDefectReasons: DefectReasonProps[] = (data.items || []).map((item) => ({
        id: item.id?.toString() || '',
        code: item.code || '',
        name: item.name || '',
        requireExtraNoteFromOperator: item.requireExtraNoteFromOperator || false,
        addScrapAndIncreaseTotalQuantity: item.addScrapAndIncreaseTotalQuantity || false,
        colorHex: item.colorHex || '',
        description: item.description || '',
      }));
      setDefectReasons(mappedDefectReasons);
      setTotalItems(data.totalItems || 0);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const { mutate: deleteDefectReasonMutate } = useDeleteDefectReason({
    onSuccess: () => {
      // Refetch defect reasons after deletion
      fetchDefectReasons({
        data: [{ sortBy: table.orderBy, descending: table.order === 'desc' }],
        params: {
          pageNumber: table.page,
          pageSize: table.rowsPerPage,
          searchTerm: filterName || undefined,
        },
      });
      queryClient.invalidateQueries({ queryKey: defectReasonKeys.all });
    },
  });

  useEffect(() => {
    setIsLoading(true);
    fetchDefectReasons({
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
      deleteDefectReasonMutate({ id });
    },
    [deleteDefectReasonMutate]
  );

  const notFound = !defectReasons.length && !!filterName;

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
              Defect Reason
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
          <Button variant="outlined" color="inherit" startIcon={<Iconify icon="mdi:export" />}>
            Export
          </Button>
          <Button
            component={RouterLink}
            href="/defect-reasons/create"
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add defect reason
          </Button>
        </Box>
      </Box>

      <Card>
        <DefectReasonTableToolbar
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
                <DefectReasonTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  rowCount={totalItems}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      defectReasons.map((item) => item.id)
                    )
                  }
                  headLabel={[
                    { id: 'code', label: 'Code' },
                    { id: 'name', label: 'Name' },
                    { id: 'requireExtraNoteFromOperator', label: 'Require Extra Note' },
                    { id: 'addScrapAndIncreaseTotalQuantity', label: 'Add Scrap & Increase Total' },
                    { id: 'colorHex', label: 'Color' },
                    { id: 'description', label: 'Description' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {defectReasons.map((row) => (
                    <DefectReasonTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                    />
                  ))}

                  <DefectReasonTableEmptyRows
                    height={68}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, totalItems)}
                  />

                  {notFound && <DefectReasonTableNoData searchQuery={filterName} />}
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
          rowsPerPageOptions={[...STANDARD_ROWS_PER_PAGE_OPTIONS]}
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

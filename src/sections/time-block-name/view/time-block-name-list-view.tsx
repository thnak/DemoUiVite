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
  timeBlockNameKeys,
  useDeleteTimeBlockName,
  useGetTimeBlockNamePage,
} from 'src/api/hooks/generated/use-time-block-name';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDeleteDialog } from 'src/components/confirm-delete-dialog';

import { emptyRows } from '../time-block-name-utils';
import { TimeBlockNameTableRow } from '../time-block-name-table-row';
import { TimeBlockNameTableHead } from '../time-block-name-table-head';
import { TimeBlockNameTableNoData } from '../time-block-name-table-no-data';
import { TimeBlockNameTableToolbar } from '../time-block-name-table-toolbar';
import { TimeBlockNameTableEmptyRows } from '../time-block-name-table-empty-rows';

import type { TimeBlockNameProps } from '../time-block-name-table-row';

// ----------------------------------------------------------------------

export function TimeBlockNameListView() {
  const table = useTable();
  const queryClient = useQueryClient();

  const [filterName, setFilterName] = useState('');
  const [timeBlockNames, setTimeBlockNames] = useState<TimeBlockNameProps[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { mutate: fetchTimeBlockNames } = useGetTimeBlockNamePage({
    onSuccess: (data) => {
      const mappedTimeBlockNames: TimeBlockNameProps[] = (data.items || []).map((item) => ({
        id: item.id?.toString() || '',
        code: item.code || '',
        name: item.name || '',
        description: item.description || '',
        colorHex: item.colorHex || '',
        imageUrl: item.imageUrl || '',
      }));
      setTimeBlockNames(mappedTimeBlockNames);
      setTotalItems(data.totalItems || 0);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const refetchTimeBlockNames = useCallback(() => {
    setIsLoading(true);
    fetchTimeBlockNames({
      data: [{ sortBy: table.orderBy, descending: table.order === 'desc' }],
      params: {
        pageNumber: table.page,
        pageSize: table.rowsPerPage,
        searchTerm: filterName || undefined,
      },
    });
  }, [fetchTimeBlockNames, table.orderBy, table.order, table.page, table.rowsPerPage, filterName]);

  const { mutate: deleteTimeBlockNameMutate } = useDeleteTimeBlockName({
    onSuccess: () => {
      refetchTimeBlockNames();
      queryClient.invalidateQueries({ queryKey: timeBlockNameKeys.all });
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: () => {
      setIsDeleting(false);
    },
  });

  useEffect(() => {
    refetchTimeBlockNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.page, table.rowsPerPage, table.orderBy, table.order, filterName]);

  const handleDeleteRow = useCallback(async (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (itemToDelete) {
      setIsDeleting(true);
      deleteTimeBlockNameMutate({ id: itemToDelete });
    }
  }, [deleteTimeBlockNameMutate, itemToDelete]);

  const handleCloseDeleteDialog = useCallback(() => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  }, [isDeleting]);

  const notFound = !timeBlockNames.length && !!filterName;

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
            Time Block Name List
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
              Time Block Names
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
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="solar:cloud-download-bold" />}
          >
            Export
          </Button>
          <Button
            component={RouterLink}
            href="/settings/time-block-names/create"
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add Time Block Name
          </Button>
        </Box>
      </Box>

      <Card>
        <TimeBlockNameTableToolbar
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
                <TimeBlockNameTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  rowCount={totalItems}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      timeBlockNames.map((item) => item.id)
                    )
                  }
                  headLabel={[
                    { id: '', label: 'Image' },
                    { id: 'code', label: 'Code' },
                    { id: 'name', label: 'Name' },
                    { id: 'description', label: 'Description' },
                    { id: 'colorHex', label: 'Color' },
                    { id: '', label: 'Actions', align: 'right' },
                  ]}
                />
                <TableBody>
                  {timeBlockNames.map((row) => (
                    <TimeBlockNameTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                    />
                  ))}

                  <TimeBlockNameTableEmptyRows
                    height={68}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, totalItems)}
                  />

                  {notFound && <TimeBlockNameTableNoData searchQuery={filterName} />}
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

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        entityName="time block name"
        loading={isDeleting}
      />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
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

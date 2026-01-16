import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState, useEffect, useCallback } from 'react';

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

import { usePaginationParams } from 'src/hooks';
import { DashboardContent } from 'src/layouts/dashboard';
import { STANDARD_ROWS_PER_PAGE_OPTIONS } from 'src/constants/table';
import {
  keyValueStoreKeys,
  useDeleteKeyValueStore,
  useGetKeyValueStorePage,
} from 'src/api/hooks/generated/use-key-value-store';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDeleteDialog } from 'src/components/confirm-delete-dialog';

import { emptyRows } from '../key-value-store-utils';
import { KeyValueStoreTableRow } from '../key-value-store-table-row';
import { KeyValueStoreTableHead } from '../key-value-store-table-head';
import { KeyValueStoreTableNoData } from '../key-value-store-table-no-data';
import { KeyValueStoreTableToolbar } from '../key-value-store-table-toolbar';
import { KeyValueStoreTableEmptyRows } from '../key-value-store-table-empty-rows';

import type { KeyValueStoreProps } from '../key-value-store-table-row';

// ----------------------------------------------------------------------

export function KeyValueStoreListView() {
  const queryClient = useQueryClient();

  // Use URL params for pagination state
  const { params, setParams, getUrlWithParams } = usePaginationParams({
    defaultPage: 0,
    defaultRowsPerPage: 5,
    defaultOrderBy: 'key',
    defaultOrder: 'asc',
  });

  const { mutate: fetchKeyValueStorePage, data: keyValueStoreData, isPending: isLoading } = useGetKeyValueStorePage({
    onError: (error) => {
      console.error('Failed to fetch key-value stores:', error);
    },
  });

  // Fetch data when params change using useEffect
  useEffect(() => {
    fetchKeyValueStorePage({
      data: [{ sortBy: params.orderBy, descending: params.order === 'desc' }],
      params: {
        pageNumber: params.page,
        pageSize: params.rowsPerPage,
        searchTerm: params.filterName || undefined,
      },
    });
  }, [params.page, params.rowsPerPage, params.orderBy, params.order, params.filterName, fetchKeyValueStorePage]);

  // Derive keyValueStores and totalItems from keyValueStoreData using useMemo - React Compiler friendly
  const keyValueStores = useMemo<KeyValueStoreProps[]>(() => {
    if (!keyValueStoreData) return [];
    return (keyValueStoreData.items || []).map((item) => ({
      id: item.id?.toString() || '',
      key: item.key || '',
      value: item.value || '',
      typeName: item.typeName || '',
      tags: item.tags || [],
      expiresAt: item.expiresAt || null,
      isEncrypted: item.isEncrypted || false,
    }));
  }, [keyValueStoreData]);

  const totalItems = useMemo(() => keyValueStoreData?.totalItems || 0, [keyValueStoreData]);

  const [selected, setSelected] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutate: deleteKeyValueStoreMutate } = useDeleteKeyValueStore({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keyValueStoreKeys.all });
      // Refetch current page
      fetchKeyValueStorePage({
        data: [{ sortBy: params.orderBy, descending: params.order === 'desc' }],
        params: {
          pageNumber: params.page,
          pageSize: params.rowsPerPage,
          searchTerm: params.filterName || undefined,
        },
      });
    },
  });

  const handleSort = useCallback(
    (id: string) => {
      const isAsc = params.orderBy === id && params.order === 'asc';
      setParams({
        order: isAsc ? 'desc' : 'asc',
        orderBy: id,
      });
    },
    [params.orderBy, params.order, setParams]
  );

  const handleSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const handleSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const handleChangePage = useCallback(
    (_event: unknown, newPage: number) => {
      setParams({ page: newPage });
    },
    [setParams]
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setParams({
        rowsPerPage: parseInt(event.target.value, 10),
        page: 0,
      });
    },
    [setParams]
  );

  const handleDeleteRow = useCallback(async (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (itemToDelete) {
      setIsDeleting(true);

      deleteKeyValueStoreMutate({ id: itemToDelete });

      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  }, [deleteKeyValueStoreMutate, itemToDelete]);

  const handleCloseDeleteDialog = useCallback(() => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  }, [isDeleting]);

  const notFound = !keyValueStores.length && !!params.filterName;

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
            Key-Value Store List
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
              Key-Value Store
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
            href="/settings/key-value-store/create"
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add Key-Value Store
          </Button>
        </Box>
      </Box>

      <Card>
        <KeyValueStoreTableToolbar
          numSelected={selected.length}
          filterName={params.filterName || ''}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setParams({ filterName: event.target.value, page: 0 });
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
                <KeyValueStoreTableHead
                  order={params.order}
                  orderBy={params.orderBy}
                  rowCount={totalItems}
                  numSelected={selected.length}
                  onSort={handleSort}
                  onSelectAllRows={(checked) =>
                    handleSelectAllRows(
                      checked,
                      keyValueStores.map((item) => item.id)
                    )
                  }
                  headLabel={[
                    { id: 'key', label: 'Key' },
                    { id: 'value', label: 'Value' },
                    { id: 'typeName', label: 'Type' },
                    { id: 'tags', label: 'Tags' },
                    { id: 'expiresAt', label: 'Expires At' },
                    { id: 'isEncrypted', label: 'Encrypted' },
                    { id: '', label: 'Actions', align: 'right' },
                  ]}
                />
                <TableBody>
                  {keyValueStores.map((row) => (
                    <KeyValueStoreTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => handleSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      returnUrl={getUrlWithParams('/settings/key-value-store')}
                    />
                  ))}

                  <KeyValueStoreTableEmptyRows
                    height={68}
                    emptyRows={emptyRows(params.page, params.rowsPerPage, totalItems)}
                  />

                  {notFound && <KeyValueStoreTableNoData searchQuery={params.filterName || ''} />}
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

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        entityName="key-value store"
        loading={isDeleting}
      />
    </DashboardContent>
  );
}

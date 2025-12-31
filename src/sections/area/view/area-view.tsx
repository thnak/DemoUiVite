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

import { usePaginationParams } from 'src/hooks';
import { DashboardContent } from 'src/layouts/dashboard';
import { STANDARD_ROWS_PER_PAGE_OPTIONS } from 'src/constants/table';
import { areaKeys, useDeleteArea, useGetAreaPage } from 'src/api/hooks/generated/use-area';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDeleteDialog } from 'src/components/confirm-delete-dialog';

import { emptyRows } from '../area-utils';
import { AreaTableRow } from '../area-table-row';
import { AreaTableHead } from '../area-table-head';
import { AreaTableNoData } from '../area-table-no-data';
import { AreaTableToolbar } from '../area-table-toolbar';
import { AreaTableEmptyRows } from '../area-table-empty-rows';

import type { AreaProps } from '../area-table-row';

// ----------------------------------------------------------------------

export function AreaView() {
  const queryClient = useQueryClient();

  // Use URL params for pagination state
  const { params, setParams, getUrlWithParams } = usePaginationParams({
    defaultPage: 0,
    defaultRowsPerPage: 5,
    defaultOrderBy: 'name',
    defaultOrder: 'asc',
  });

  const [areas, setAreas] = useState<AreaProps[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const { mutate: fetchAreas } = useGetAreaPage({
    onSuccess: (data) => {
      const mappedAreas: AreaProps[] = (data.items || []).map((item) => ({
        id: item.id?.toString() || '',
        name: item.name || '',
        description: item.description || '',
      }));
      setAreas(mappedAreas);
      setTotalItems(data.totalItems || 0);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const { mutate: deleteAreaMutate } = useDeleteArea({
    onSuccess: () => {
      // Refetch areas after deletion
      fetchAreas({
        data: [{ sortBy: params.orderBy, descending: params.order === 'desc' }],
        params: {
          pageNumber: params.page,
          pageSize: params.rowsPerPage,
          searchTerm: params.filterName || undefined,
        },
      });
      queryClient.invalidateQueries({ queryKey: areaKeys.all });
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: () => {
      setIsDeleting(false);
    },
  });

  useEffect(() => {
    setIsLoading(true);
    fetchAreas({
      data: [{ sortBy: params.orderBy, descending: params.order === 'desc' }],
      params: {
        pageNumber: params.page,
        pageSize: params.rowsPerPage,
        searchTerm: params.filterName || undefined,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.rowsPerPage, params.orderBy, params.order, params.filterName]);

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

  const handleDeleteRow = useCallback(
    (id: string) => {
      setItemToDelete(id);
      setDeleteDialogOpen(true);
    },
    []
  );

  const handleConfirmDelete = useCallback(() => {
    if (itemToDelete) {
      setIsDeleting(true);
      deleteAreaMutate({ id: itemToDelete });
    }
  }, [itemToDelete, deleteAreaMutate]);

  const handleCloseDeleteDialog = useCallback(() => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  }, [isDeleting]);

  const notFound = !areas.length && !!params.filterName;

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
              Area
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
            href="/area/create"
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add area
          </Button>
        </Box>
      </Box>

      <Card>
        <AreaTableToolbar
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
                <AreaTableHead
                  order={params.order}
                  orderBy={params.orderBy}
                  rowCount={totalItems}
                  numSelected={selected.length}
                  onSort={handleSort}
                  onSelectAllRows={(checked) =>
                    handleSelectAllRows(
                      checked,
                      areas.map((area) => area.id)
                    )
                  }
                  headLabel={[
                    { id: 'name', label: 'Name' },
                    { id: 'description', label: 'Description' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {areas.map((row) => (
                    <AreaTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => handleSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      returnUrl={getUrlWithParams('/area')}
                    />
                  ))}

                  <AreaTableEmptyRows
                    height={68}
                    emptyRows={emptyRows(params.page, params.rowsPerPage, totalItems)}
                  />

                  {notFound && <AreaTableNoData searchQuery={params.filterName || ''} />}
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
        entityName="area"
        loading={isDeleting}
      />
    </DashboardContent>
  );
}

import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
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
import { unitKeys, useDeleteUnit, usePostapiUnitgetunits } from 'src/api/hooks/generated/use-unit';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDeleteDialog } from 'src/components/confirm-delete-dialog';

import { emptyRows } from '../unit-utils';
import { UnitTableRow } from '../unit-table-row';
import { UnitTableHead } from '../unit-table-head';
import { UnitTableNoData } from '../unit-table-no-data';
import { UnitTableToolbar } from '../unit-table-toolbar';
import { UnitTableEmptyRows } from '../unit-table-empty-rows';

import type { UnitProps } from '../unit-table-row';

// ----------------------------------------------------------------------

export function UnitListView() {
  const queryClient = useQueryClient();

  // Use URL params for pagination state
  const { params, setParams, resetPage, getUrlWithParams } = usePaginationParams({
    defaultPage: 0,
    defaultRowsPerPage: 5,
    defaultOrderBy: 'name',
    defaultOrder: 'asc',
  });

  const [units, setUnits] = useState<UnitProps[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [groupCounts, setGroupCounts] = useState<Record<string, number>>({});

  const { mutate: fetchUnits } = usePostapiUnitgetunits({
    onSuccess: (data) => {
      const mappedUnits: UnitProps[] = (data.items || []).map((item) => ({
        id: item.id?.toString() || '',
        name: item.name || '',
        symbol: item.symbol || '',
        group: item.unitGroupName || '',
        baseUnit: false,
        description: '',
      }));
      setUnits(mappedUnits);
      setTotalItems(data.totalItems || 0);
      setGroupCounts(data.totalUnitsPerGroup || {});
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });
  const [selected, setSelected] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const refetchUnits = useCallback(() => {
    setIsLoading(true);
    fetchUnits({
      data: [{ sortBy: params.orderBy, descending: params.order === 'desc' }],
      params: {
        pageNumber: params.page,
        pageSize: params.rowsPerPage,
        searchTerm: params.filterName || undefined,
        UnitGroupName: params.currentTab !== 'all' ? params.currentTab : undefined,
      },
    });
  }, [fetchUnits, params]);

  const { mutate: deleteUnitMutate } = useDeleteUnit({
    onSuccess: () => {
      refetchUnits();
      queryClient.invalidateQueries({ queryKey: unitKeys.all });
    },
  });

  useEffect(() => {
    refetchUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.rowsPerPage, params.orderBy, params.order, params.filterName, params.currentTab]);

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: string) => {
      setParams({ currentTab: newValue, page: 0 });
    },
    [setParams]
  );

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

      deleteUnitMutate({ id: itemToDelete });

      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  }, [deleteUnitMutate, itemToDelete]);

  const handleCloseDeleteDialog = useCallback(() => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  }, [isDeleting]);

  const notFound = !units.length && !!params.filterName;

  // Get all unique group names from groupCounts
  const groupTabs = Object.keys(groupCounts).sort();

  // Set default tab from URL or 'all'
  const currentTab = params.currentTab || 'all';

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
            Unit List
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
              Units
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            component={RouterLink}
            href="/settings/units/create"
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add Unit
          </Button>
        </Box>
      </Box>

      <Card>
        {groupTabs.length > 0 && (
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              px: 3,
              bgcolor: 'background.neutral',
            }}
          >
            <Tab value="all" label={`All (${totalItems})`} iconPosition="end" />
            {groupTabs.map((group) => (
              <Tab
                key={group}
                value={group}
                label={`${group} (${groupCounts[group] || 0})`}
                iconPosition="end"
              />
            ))}
          </Tabs>
        )}

        <UnitTableToolbar
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
                <UnitTableHead
                  order={params.order}
                  orderBy={params.orderBy}
                  rowCount={totalItems}
                  numSelected={selected.length}
                  onSort={handleSort}
                  onSelectAllRows={(checked) =>
                    handleSelectAllRows(
                      checked,
                      units.map((unit) => unit.id)
                    )
                  }
                  headLabel={[
                    { id: 'name', label: 'Name' },
                    { id: 'symbol', label: 'Symbol' },
                    { id: 'unitGroupName', label: 'Group' },
                    { id: '', label: 'Actions', align: 'right' },
                  ]}
                />
                <TableBody>
                  {units.map((row) => (
                    <UnitTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => handleSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      returnUrl={getUrlWithParams('/settings/units')}
                    />
                  ))}

                  <UnitTableEmptyRows
                    height={68}
                    emptyRows={emptyRows(params.page, params.rowsPerPage, totalItems)}
                  />

                  {notFound && <UnitTableNoData searchQuery={params.filterName || ''} />}
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
        entityName="unit"
        loading={isDeleting}
      />
    </DashboardContent>
  );
}

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
  const table = useTable();
  const queryClient = useQueryClient();

  const [filterName, setFilterName] = useState('');
  const [units, setUnits] = useState<UnitProps[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('all');
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
  ]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const refetchUnits = useCallback(() => {
    setIsLoading(true);
    fetchUnits({
      data: [{ sortBy: table.orderBy, descending: table.order === 'desc' }],
      params: {
        pageNumber: table.page,
        pageSize: table.rowsPerPage,
        searchTerm: filterName || undefined,
        UnitGroupName: currentTab !== 'all' ? currentTab : undefined,
      },
    });
  }, [fetchUnits, table.orderBy, table.order, table.page, table.rowsPerPage, filterName, currentTab]);

  const { mutate: deleteUnitMutate } = useDeleteUnit({
    onSuccess: () => {
      refetchUnits();
      queryClient.invalidateQueries({ queryKey: unitKeys.all });
    },
  });

  useEffect(() => {
    refetchUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.page, table.rowsPerPage, table.orderBy, table.order, filterName, currentTab]);

  const handleDeleteRow = useCallback(
    (id: string) => {
      deleteUnitMutate({ id });
    },
    [deleteUnitMutate]
  );

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
      table.onResetPage();
    },
    [table]
  const handleDeleteRow = useCallback(async (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (itemToDelete) {
      setIsDeleting(true);
      // TODO: Implement actual delete when API is connected
      // Currently using mock data, so just simulating the delete operation
      console.log('Delete unit:', itemToDelete);
      // Simulate async delete
      await new Promise((resolve) => { setTimeout(resolve, 500); });
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  }, [itemToDelete]);

  const handleCloseDeleteDialog = useCallback(() => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  }, [isDeleting]);

  const filteredUnits = units.filter((unit) =>
    unit.name.toLowerCase().includes(filterName.toLowerCase())
  );

  const notFound = !units.length && !!filterName;

  // Get all unique group names from groupCounts
  const groupTabs = Object.keys(groupCounts).sort();

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
            <Tab
              value="all"
              label={`All (${totalItems})`}
              iconPosition="end"
            />
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
                <UnitTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  rowCount={totalItems}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      units.map((unit) => unit.id)
                    )
                  }
                  headLabel={[
                    { id: 'name', label: 'Name' },
                    { id: 'symbol', label: 'Symbol' },
                    { id: 'unitGroupName', label: 'Group' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {units.map((row) => (
                    <UnitTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                    />
                  ))}

                  <UnitTableEmptyRows
                    height={68}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, totalItems)}
                  />

                  {notFound && <UnitTableNoData searchQuery={filterName} />}
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
        entityName="unit"
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

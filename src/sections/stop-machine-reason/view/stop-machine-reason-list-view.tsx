import type { StopMachineReasonDto } from 'src/api/types/generated';

import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { STANDARD_ROWS_PER_PAGE_OPTIONS } from 'src/constants/table';
import {
  useDeleteStopMachineReason,
  useGetapiStopMachineReasongetreasonpage,
} from 'src/api/hooks/generated/use-stop-machine-reason';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDeleteDialog } from 'src/components/confirm-delete-dialog';

import { StopMachineReasonTableRow } from '../stop-machine-reason-table-row';
import { StopMachineReasonTableHead } from '../stop-machine-reason-table-head';
import { StopMachineReasonTableNoData } from '../stop-machine-reason-table-no-data';
import { StopMachineReasonTableToolbar } from '../stop-machine-reason-table-toolbar';
import { StopMachineReasonTableEmptyRows } from '../stop-machine-reason-table-empty-rows';

import type { StopMachineReasonProps } from '../stop-machine-reason-table-row';

// ----------------------------------------------------------------------

const emptyRows = (page: number, rowsPerPage: number, arrayLength: number) =>
  page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;

export function StopMachineReasonListView() {
  const router = useRouter();
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [currentGroup, setCurrentGroup] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Determine which groups to query - 'all' means empty array
  // Memoize to prevent infinite loops
  const groupsToQuery = useMemo(
    () => (currentGroup === 'all' ? undefined : [currentGroup]),
    [currentGroup]
  );

  const {
    data,
    isLoading: queryLoading,
    refetch,
  } = useGetapiStopMachineReasongetreasonpage({
    Search: filterName || undefined,
    PageNumber: table.page,
    PageSize: table.rowsPerPage,
    GroupNames: groupsToQuery,
  });

  // Derive reasons from query data using useMemo - React Compiler friendly
  const reasons = useMemo<StopMachineReasonProps[]>(() => {
    if (!data) return [];
    return (data.items || []).map((item: StopMachineReasonDto) => ({
      id: item.id?.toString() || '',
      code: item.code || '',
      name: item.name || '',
      description: item.description || '',
      groupName: item.groupName || '',
      color: item.color || '',
      impact: item.impact || 'run',
      requiresApproval: item.requiresApproval || false,
      requiresNote: item.requiresNote || false,
      requiresAttachment: item.requiresAttachment || false,
      requiresComment: item.requiresComment || false,
    }));
  }, [data]);

  const totalItems = useMemo(() => data?.totalItems || 0, [data]);
  const groupCounts = useMemo(() => data?.groupCounts || {}, [data]);

  const isLoading = queryLoading;

  const { mutate: deleteStopMachineReasonMutate } = useDeleteStopMachineReason({
    onSuccess: () => {
      setSuccessMessage('Stop machine reason deleted successfully');
      // Refetch data after deletion
      refetch();
    },
    onError: (error: any) => {
      setErrorMessage(error?.message || 'Failed to delete stop machine reason');
    },
  });

  // Calculate tabs from groupCounts
  const tabs = useMemo(() => {
    const allCount = Object.values(groupCounts).reduce((sum, count) => sum + count, 0);
    const result = [{ value: 'all', label: 'All', count: allCount }];

    Object.entries(groupCounts).forEach(([group, count]) => {
      result.push({
        value: group,
        label: group,
        count,
      });
    });

    return result;
  }, [groupCounts]);

  const handleChangeTab = useCallback(
    (_event: React.SyntheticEvent, newValue: string) => {
      setCurrentGroup(newValue);
      table.onResetPage();
    },
    [table]
  );

  const handleDeleteRow = useCallback((id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (itemToDelete) {
      setIsDeleting(true);
      deleteStopMachineReasonMutate({ id: itemToDelete });
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  }, [deleteStopMachineReasonMutate, itemToDelete]);

  const handleCloseDeleteDialog = useCallback(() => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  }, [isDeleting]);

  const handleCloseSuccess = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const notFound = !isLoading && !reasons.length;

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
            Stop Machine Reason List
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Stop Machine Reason
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
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="solar:cloud-download-bold" />}
          >
            Export
          </Button>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => router.push('/stop-machine-reason/create')}
          >
            Add reason
          </Button>
        </Box>
      </Box>

      {/* Tabs for group filtering */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={currentGroup}
          onChange={handleChangeTab}
          sx={{
            px: 2.5,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.palette.divider}`,
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Box
                  sx={{
                    px: 0.75,
                    py: 0.25,
                    minWidth: 24,
                    borderRadius: 0.75,
                    typography: 'caption',
                    fontWeight: 'fontWeightBold',
                    color: 'text.secondary',
                    bgcolor: 'background.neutral',
                  }}
                >
                  {tab.count}
                </Box>
              }
            />
          ))}
        </Tabs>
      </Card>

      <Card>
        <StopMachineReasonTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <StopMachineReasonTableHead
                    order={table.order}
                    orderBy={table.orderBy}
                    rowCount={reasons.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        reasons.map((item) => item.id)
                      )
                    }
                    headLabel={[
                      { id: 'code', label: 'Code' },
                      { id: 'name', label: 'Name' },
                      { id: 'groupName', label: 'Group' },
                      { id: 'impact', label: 'Impact' },
                      { id: 'color', label: 'Color', width: 180 },
                      { id: 'description', label: 'Description' },
                      { id: '' },
                    ]}
                  />
                  <TableBody>
                    {reasons.map((row) => (
                      <StopMachineReasonTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                      />
                    ))}

                    <StopMachineReasonTableEmptyRows
                      height={68}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, reasons.length)}
                    />

                    {notFound && <StopMachineReasonTableNoData searchQuery={filterName} />}
                  </TableBody>
                </Table>
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
          </>
        )}
      </Card>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        entityName="stop machine reason"
        loading={isDeleting}
      />

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
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

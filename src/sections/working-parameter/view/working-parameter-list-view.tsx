import React, { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { STANDARD_ROWS_PER_PAGE_OPTIONS } from 'src/constants/table';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDeleteDialog } from 'src/components/confirm-delete-dialog';

import { applyFilter, getComparator } from '../working-parameter-utils';
import { WorkingParameterTableHead } from '../working-parameter-table-head';
import { WorkingParameterTableNoData } from '../working-parameter-table-no-data';
import { WorkingParameterTableToolbar } from '../working-parameter-table-toolbar';
import {
  deleteWorkingParameter,
  postapiWorkingParametercreatedworkingparameters,
} from '../../../api';
import {
  formatSecondsHms,
  timeSpanToSeconds,
  WorkingParameterTableRow,
} from '../working-parameter-table-row';

import type { WorkingParameterProps } from '../working-parameter-table-row';
import type { ObjectId, GetCreatedWorkingParaResult } from '../../../api/types/generated';

// ----------------------------------------------------------------------

export function WorkingParameterListView() {
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [filterName, setFilterName] = useState('');
  const router = useRouter();
  const table = useTable();
  const [entities, setEntities] = useState<GetCreatedWorkingParaResult[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [machineTypes] = useState<ObjectId[]>([]);
  const [machineGroups] = useState<ObjectId[]>([]);
  const [productCategories] = useState<ObjectId[]>([]);

  // Function to map GetCreatedWorkingParaResult to WorkingParameterProps
  const templates: WorkingParameterProps[] = React.useMemo(
    () =>
      entities.map((entity) => {
        const idealSeconds = timeSpanToSeconds(entity.idealCycleTime);
        const downSeconds = timeSpanToSeconds(entity.downtimeThreshold);
        const speedLossSeconds = timeSpanToSeconds(entity.speedLossThreshold);

        return {
          id: entity.workingParameterId?.toString() || '',
          product: '',
          machine: '',
          productName: entity.productName || '',
          machineName: entity.machineName || '',
          quantityPerSignal: entity.quantityPerCycle || 0,
          idealCycleTime: formatSecondsHms(idealSeconds) || '',
          downtimeThreshold: formatSecondsHms(downSeconds) || '',
          speedLossThreshold: formatSecondsHms(speedLossSeconds) || '',
        };
      }),
    [entities]
  );

  // Fetch working parameters and map to WorkingParameterProps[]
  const fetchWorkingParameter = useCallback(async () => {
    setLoading(true);
    try {
      const response = await postapiWorkingParametercreatedworkingparameters({
        pageNumber: page,
        pageSize: rowsPerPage,
        search: filterName || null,
        machineTypes: machineTypes.length > 0 ? machineTypes : null,
        machineGroups: machineGroups.length > 0 ? machineGroups : null,
        productCategories: productCategories.length > 0 ? productCategories : null,
      });
      setEntities(response.items ?? []);
      setTotalItems(response.totalItems || 0);
    } catch (err) {
      console.error('Error fetching working parameters:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filterName, machineTypes, machineGroups, productCategories]);

  useEffect(() => {
    fetchWorkingParameter();
  }, [fetchWorkingParameter]);

  // Handle change in page
  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);
  const handleEditWorkingParameter = useCallback(
    (id: string) => {
      router.push(`/working-parameter/edit/${id}`);
    },
    [router]
  );

  // Handle change in rows per page
  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleDeleteWorkingParameter = useCallback((id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (itemToDelete) {
      setIsDeleting(true);
      try {
        await deleteWorkingParameter(itemToDelete);
        setSuccessMessage('Working parameter deleted successfully');
        fetchWorkingParameter();
      } catch (deleteErr) {
        console.error('Error deleting working parameter:', deleteErr);
        setErrorMessage('Failed to delete working parameter');
      } finally {
        setIsDeleting(false);
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      }
    }
  }, [itemToDelete, fetchWorkingParameter]);

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

  // Apply filter and sorting to the templates
  const dataFiltered: WorkingParameterProps[] = applyFilter({
    inputData: templates,
    comparator: getComparator(table.order, table.orderBy),
    filterName: '', // No client-side filtering since we're using server-side
  });

  const notFound = !loading && templates.length === 0;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
              Working Parameter
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
            onClick={() => router.push('/working-parameter/create')}
          >
            Add parameter
          </Button>
        </Box>
      </Box>

      <Card>
        <WorkingParameterTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            setPage(0); // Reset to first page when filtering
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <WorkingParameterTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((item) => item.id)
                  )
                }
                headLabel={[
                  { id: 'product', label: 'Product' },
                  { id: 'machine', label: 'Machine' },
                  { id: 'idealCycleTime', label: 'Ideal Cycle Time' },
                  { id: 'quantityPerSignal', label: 'Quantity per Output Signal' },
                  { id: 'downtimeThreshold', label: 'Downtime Threshold' },
                  { id: 'speedLossThreshold', label: 'SpeedLossThreshold' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : templates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  templates.map((row) => (
                    <WorkingParameterTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onEditRow={() => handleEditWorkingParameter(row.id)}
                      onDeleteRow={() => handleDeleteWorkingParameter(row.id)}
                    />
                  ))
                )}

                {notFound && <WorkingParameterTableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
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

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        entityName="working parameter"
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
  const [orderBy, setOrderBy] = useState('product');
  const [rowsPerPage, setRowsPerPage] = useState(10);
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

import React, { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { STANDARD_ROWS_PER_PAGE_OPTIONS } from 'src/constants/table';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDeleteDialog } from 'src/components/confirm-delete-dialog';

import { WorkingParameterTableHead } from '../working-parameter-table-head';
import { WorkingParameterTableNoData } from '../working-parameter-table-no-data';
import { WorkingParameterTableToolbar } from '../working-parameter-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../working-parameter-utils';
import { searchMachine, searchProduct, getWorkingParameterPage } from '../../../api';
import { WorkingParameterTableEmptyRows } from '../working-parameter-table-empty-rows';
import {
  formatSecondsHms,
  timeSpanToSeconds,
  WorkingParameterTableRow,
} from '../working-parameter-table-row';

import type { WorkingParameterEntity } from '../../../api/types/generated';
import type { WorkingParameterProps } from '../working-parameter-table-row';

// ----------------------------------------------------------------------

export function WorkingParameterListView() {
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterName, setFilterName] = useState('');
  const router = useRouter();
  const table = useTable();
  const [entities, setEntities] = useState<WorkingParameterEntity[]>([]);
  const [productMap, setProductMap] = useState<Record<string, string>>({});
  const [machineMap, setMachineMap] = useState<Record<string, string>>({});


  function unwrapArray<T>(res: any): T[] {
    if (Array.isArray(res)) return res;
    // các case phổ biến trong codegen
    return res?.value ?? res?.data ?? res?.items ?? res?.result ?? [];
  }
  useEffect(() => {
    (async () => {
      const [pRes, mRes] = await Promise.all([
        searchProduct({ maxResults: 5000 }),
        searchMachine({ maxResults: 5000 }),
      ]);

      const products = unwrapArray<any>(pRes);
      const machines = unwrapArray<any>(mRes);

      setProductMap(Object.fromEntries(products.map(p => [p.id?.toString?.() ?? `${p.id}`, p.productName ?? p.name ?? ''])));
      setMachineMap(Object.fromEntries(machines.map(m => [m.id?.toString?.() ?? `${m.id}`, m.machineName ?? m.name ?? ''])));
    })();
  }, []);


  // Function to map WorkingParameterEntity to WorkingParameterProps
  const templates: WorkingParameterProps[] = React.useMemo(
    () =>
      entities.map((entity) => {
        const productId = entity.productId?.toString() || '';
        const machineId = entity.machineId?.toString() || '';
        const idealSeconds = timeSpanToSeconds(entity.idealCycleTime);
        const downSeconds  = timeSpanToSeconds(entity.downtimeThreshold);
        const speedLossThreshold = timeSpanToSeconds(entity.speedLossThreshold)
        console.log('idealCycleTime raw =', entity.idealCycleTime, typeof entity.idealCycleTime);
        console.log('downtimeThreshold raw =', entity.downtimeThreshold, typeof entity.downtimeThreshold);

        return {
          id: entity.id?.toString() || '',
          product: productId,
          machine: machineId,
          productName: productMap[productId] ?? productId,
          machineName: machineMap[machineId] ?? machineId,
          quantityPerSignal: entity.quantityPerCycle || 0,
          idealCycleTime: formatSecondsHms(idealSeconds) || '',
          downtimeThreshold: formatSecondsHms(downSeconds) || '',
          speedLossThreshold: formatSecondsHms(speedLossThreshold) || '',
        };
      }),
    [entities, productMap, machineMap]
  );




  // Fetch working parameters and map to WorkingParameterProps[]
  const fetchWorkingParameter = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getWorkingParameterPage([], {
        pageNumber: page,
        pageSize: rowsPerPage,
      });
      setEntities(response.items ?? []);
      setTotalItems(response.totalItems || 0);
    } catch (err) {
      setError('Failed to load shift templates');
      console.error('Error fetching shift templates:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchWorkingParameter();
  }, [fetchWorkingParameter]);

  // Handle change in page
  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  // Handle change in rows per page
  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // Apply filter and sorting to the templates
  const dataFiltered: WorkingParameterProps[] = applyFilter({
    inputData: templates,  // Now templates are of type WorkingParameterProps[]
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1 }}>List</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>Dashboard</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>•</Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>Working Parameter</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>•</Typography>
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>List</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" color="inherit" startIcon={<Iconify icon="solar:cloud-upload-bold" />}>Import</Button>
          <Button variant="outlined" color="inherit" startIcon={<Iconify icon="mdi:export" />}>Export</Button>
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
            table.onResetPage();
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
                  table.onSelectAllRows(checked, dataFiltered.map((item) => item.id))
                }
                headLabel={[
                  { id: 'product', label: 'Product' },
                  { id: 'machine', label: 'Machine' },
                  { id: 'idealCycleTime', label: 'Ideal Cycle Time' },
                  { id: 'quantityPerSignal', label: 'Quantity per Output Signal' },
                  { id: 'downtimeThreshold', label: 'Downtime Threshold' },
                  { id: 'speedLossThreshold', label: 'SpeedLossThreshold' },
                  { id: ''}
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
                  .map((row) => (
                    <WorkingParameterTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onEditRow={() => console.log('Edit working parameter:', row.id)}
                      onDeleteRow={() => console.log('Delete working parameter:', row.id)}
                    />
                  ))}

                <WorkingParameterTableEmptyRows
                  height={72}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                {notFound && <WorkingParameterTableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={dataFiltered.length}
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

import type { StopType } from 'src/_mock';

import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { _stopMachineReasons } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { STANDARD_ROWS_PER_PAGE_OPTIONS } from 'src/constants/table';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { StopMachineReasonTableRow } from '../stop-machine-reason-table-row';
import { StopMachineReasonTableHead } from '../stop-machine-reason-table-head';
import { StopMachineReasonTableNoData } from '../stop-machine-reason-table-no-data';
import { StopMachineReasonTableToolbar } from '../stop-machine-reason-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../stop-machine-reason-utils';
import { StopMachineReasonTableEmptyRows } from '../stop-machine-reason-table-empty-rows';

import type { StopMachineReasonProps } from '../stop-machine-reason-table-row';

// ----------------------------------------------------------------------

export function StopMachineReasonListView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [filterStopGroup, setFilterStopGroup] = useState('');
  const [filterStopType, setFilterStopType] = useState<StopType | 'all'>('all');

  // Get unique stop groups from data
  const stopGroups = useMemo(() => {
    const uniqueGroups = [...new Set(_stopMachineReasons.map((item) => item.stopGroup))];
    return uniqueGroups.sort();
  }, []);

  const dataFiltered: StopMachineReasonProps[] = applyFilter({
    inputData: _stopMachineReasons,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filterStopGroup,
    filterStopType,
  });

  const notFound =
    !dataFiltered.length && (!!filterName || !!filterStopGroup || filterStopType !== 'all');

  const handleFilterStopGroup = useCallback(
    (stopGroup: string) => {
      setFilterStopGroup(stopGroup);
      table.onResetPage();
    },
    [table]
  );

  const handleFilterStopType = useCallback(
    (stopType: StopType | 'all') => {
      setFilterStopType(stopType);
      table.onResetPage();
    },
    [table]
  );

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
          <Button variant="outlined" color="inherit" startIcon={<Iconify icon="mdi:export" />}>
            Export
          </Button>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add reason
          </Button>
        </Box>
      </Box>

      <Card>
        <StopMachineReasonTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          filterStopGroup={filterStopGroup}
          filterStopType={filterStopType}
          stopGroups={stopGroups}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onFilterStopGroup={handleFilterStopGroup}
          onFilterStopType={handleFilterStopType}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <StopMachineReasonTableHead
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
                  { id: 'code', label: 'Code' },
                  { id: 'name', label: 'Name' },
                  { id: 'stopGroup', label: 'Stop Group' },
                  { id: 'stopType', label: 'Stop Type' },
                  { id: 'description', label: 'Description' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <StopMachineReasonTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <StopMachineReasonTableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                {notFound && <StopMachineReasonTableNoData searchQuery={filterName} />}
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

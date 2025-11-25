import type { MachineInputType } from 'src/_mock';

import { useMemo, useState, useCallback } from 'react';

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

import { useRouter } from 'src/routes/hooks';

import { _machines } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { MachineTableRow } from '../machine-table-row';
import { MachineTableHead } from '../machine-table-head';
import { MachineTableNoData } from '../machine-table-no-data';
import { MachineTableToolbar } from '../machine-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { MachineTableEmptyRows } from '../machine-table-empty-rows';

import type { MachineProps } from '../machine-table-row';

// ----------------------------------------------------------------------

const INPUT_TYPE_OPTIONS: { value: MachineInputType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'WeightChannels', label: 'Weight Channels' },
  { value: 'PairChannel', label: 'Pair Channel' },
];

export function MachineView() {
  const router = useRouter();
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterInputType, setFilterInputType] = useState<MachineInputType | 'all'>('all');

  // Get unique areas from machines
  const areas = useMemo(() => {
    const uniqueAreas = [...new Set(_machines.map((machine) => machine.area))];
    return uniqueAreas.sort();
  }, []);

  // Calculate input type counts
  const inputTypeCounts = useMemo(() => {
    const counts = {
      all: _machines.length,
      WeightChannels: 0,
      PairChannel: 0,
    };
    _machines.forEach((machine) => {
      counts[machine.inputType] += 1;
    });
    return counts;
  }, []);

  const dataFiltered: MachineProps[] = applyFilter({
    inputData: _machines,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filterArea,
    filterInputType,
  });

  const notFound =
    !dataFiltered.length && (!!filterName || !!filterArea || filterInputType !== 'all');

  const handleFilterInputType = useCallback(
    (_event: React.SyntheticEvent, newValue: MachineInputType | 'all') => {
      setFilterInputType(newValue);
      table.onResetPage();
    },
    [table]
  );

  const handleFilterArea = useCallback(
    (area: string) => {
      setFilterArea(area);
      table.onResetPage();
    },
    [table]
  );

  const handleEditMachine = useCallback(
    (id: string) => {
      console.log('Edit machine:', id);
      // Implement edit logic here
    },
    []
  );

  const handleDeleteMachine = useCallback((id: string) => {
    console.log('Delete machine:', id);
    // Implement delete logic here
  }, []);

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
              Machine
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              List
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => router.push('/machines/create')}
        >
          Add machine
        </Button>
      </Box>

      <Card>
        <Tabs
          value={filterInputType}
          onChange={handleFilterInputType}
          sx={{
            px: 2.5,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.vars.palette.background.neutral}`,
          }}
        >
          {INPUT_TYPE_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === filterInputType) && 'filled') || 'soft'
                  }
                  color={
                    (tab.value === 'WeightChannels' && 'info') ||
                    (tab.value === 'PairChannel' && 'warning') ||
                    'default'
                  }
                >
                  {inputTypeCounts[tab.value]}
                </Label>
              }
            />
          ))}
        </Tabs>

        <MachineTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          filterArea={filterArea}
          filterInputType={filterInputType}
          areas={areas}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onFilterArea={handleFilterArea}
          onFilterInputType={(inputType) => {
            setFilterInputType(inputType);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <MachineTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((machine) => machine.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Machine' },
                  { id: 'area', label: 'Area' },
                  { id: 'inputType', label: 'Input Type' },
                  { id: 'numberOfInputChannels', label: 'Channels', align: 'center' },
                  { id: 'workCalendar', label: 'Work Calendar' },
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
                    <MachineTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onEditRow={() => handleEditMachine(row.id)}
                      onDeleteRow={() => handleDeleteMachine(row.id)}
                    />
                  ))}

                <MachineTableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                {notFound && <MachineTableNoData searchQuery={filterName} />}
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
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
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

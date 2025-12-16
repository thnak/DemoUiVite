import type { MachineInputType } from 'src/_mock';
import type {
  MachineEntity,
  CalendarEntity,
  OutputCalculationMode,
  MachineDto,
} from 'src/api/types/generated';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useMemo, useState, useEffect, useCallback } from 'react';

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

import { DashboardContent } from 'src/layouts/dashboard';
import { STANDARD_ROWS_PER_PAGE_OPTIONS } from 'src/constants/table';
import { deleteMachine, postapiMachinesearchmachines } from 'src/api/services/generated/machine';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { getComparator } from '../utils';
import { useRouter } from '../../../routes/hooks';
import { MachineTableRow } from '../machine-table-row';
import { MachineTableHead } from '../machine-table-head';
import { MachineTableNoData } from '../machine-table-no-data';
import { MachineTableToolbar } from '../machine-table-toolbar';
import { MachineTableEmptyRows } from '../machine-table-empty-rows';

import type { MachineProps } from '../machine-table-row';

// ----------------------------------------------------------------------

const INPUT_TYPE_OPTIONS: { value: MachineInputType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'WeightChannels', label: 'Weight Channels' },
  { value: 'PairChannel', label: 'Pair Channel' },
];

// Easing constants
const EASE_OUT = [0.4, 0, 0.2, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;

// Animation variants for table content
const tableContentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: EASE_OUT,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: EASE_IN,
    },
  },
};

export function MachineView() {
  const table = useTable();
  const router = useRouter();

  const [machines, setMachines] = useState<MachineDto[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterName, setFilterName] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterInputType, setFilterInputType] = useState<MachineInputType | 'all'>('all');

  // Map MachineEntity (API) -> MachineProps (UI)
  const machineProps: MachineProps[] = useMemo(
    () =>
      machines.map((x) => ({
        id: x.id?.toString() ?? '',
        code: x.code ?? '',
        name: x.name ?? '',
        imageUrl: x.imageUrl ?? '',
        area: x.areaName ?? '',
        inputType: 'WeightChannels' as MachineInputType, // TODO: map từ calculationMode
        numberOfInputChannels: x.numberOfChannels ?? 0,
        workCalendar: x.calendarName ?? '',
      })),
    [machines]
  );

  const fetchMachines = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Gọi API với POST request
      const response = await postapiMachinesearchmachines([], {
        pageNumber: page,
        pageSize: rowsPerPage,
        searchTerm: filterName || undefined,
        Mode:
          filterInputType !== 'all'
            ? (filterInputType as unknown as OutputCalculationMode)
            : undefined,
      });

      setMachines(response.items || []);
      setTotalItems(response.totalItems || 0);
    } catch (err) {
      setError('Failed to load machines');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filterName, filterInputType]);

  useEffect(() => {
    fetchMachines();
  }, [fetchMachines]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteMachine(id);
        await fetchMachines();
        setSelected((prev) => prev.filter((i) => i !== id));
      } catch (err) {
        console.error('Error deleting machine:', err);
      }
    },
    [fetchMachines]
  );

  const handleDeleteSelected = useCallback(async () => {
    try {
      await Promise.all(selected.map((id) => deleteMachine(id)));
      await fetchMachines();
      setSelected([]);
    } catch (err) {
      console.error('Error deleting machines:', err);
    }
  }, [selected, fetchMachines]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelected(machineProps.map((m) => m.id).filter(Boolean));
      } else {
        setSelected([]);
      }
    },
    [machineProps]
  );

  const handleSelectOne = useCallback((id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }, []);

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // Get unique areas
  const areas = useMemo(() => {
    const uniqueAreas = [...new Set(machineProps.map((m) => m.area).filter(Boolean))];
    return uniqueAreas.sort();
  }, [machineProps]);

  // Calculate input type counts
  const inputTypeCounts = useMemo(() => {
    const counts: Record<'all' | MachineInputType, number> = {
      all: machineProps.length,
      WeightChannels: 0,
      PairChannel: 0,
    };

    machineProps.forEach((machine) => {
      if (machine.inputType === 'WeightChannels' || machine.inputType === 'PairChannel') {
        counts[machine.inputType] += 1;
      }
    });

    return counts;
  }, [machineProps]);

  // Apply client-side filters (sorting only, search is done server-side)
  const dataFiltered: MachineProps[] = useMemo(() => {
    // Only apply sorting and area filter client-side
    let filtered = machineProps;

    // Filter by area if selected
    if (filterArea) {
      filtered = filtered.filter((m) => m.area === filterArea);
    }

    // Apply sorting
    const comparator = getComparator(table.order, table.orderBy);
    filtered = filtered.slice().sort(comparator);

    return filtered;
  }, [machineProps, filterArea, table.order, table.orderBy]);

  const notFound = !dataFiltered.length && !!filterName;

  const handleFilterInputType = useCallback(
    (_event: React.SyntheticEvent, newValue: MachineInputType | 'all') => {
      setFilterInputType(newValue);
      setPage(0);
    },
    []
  );

  const handleFilterArea = useCallback((area: string) => {
    setFilterArea(area);
    setPage(0);
  }, []);

  const handleEditMachine = useCallback((id: string) => {
    // Navigate to edit page
    router.push(`/machines/${id}/edit`);
  }, [router]);

  const handleDeleteMachine = useCallback(
    (id: string) => {
      if (window.confirm('Are you sure you want to delete this machine?')) {
        handleDelete(id);
      }
    },
    [handleDelete]
  );

  const emptyRowsCount = Math.max(0, rowsPerPage - dataFiltered.length);

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
            href="/machines/create"
          >
            Add machine
          </Button>
        </Box>
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
                  {inputTypeCounts[tab.value] || 0}
                </Label>
              }
            />
          ))}
        </Tabs>

        <MachineTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          filterArea={filterArea}
          filterInputType={filterInputType}
          areas={areas}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            setPage(0);
          }}
          onFilterArea={handleFilterArea}
          onFilterInputType={(inputType) => {
            setFilterInputType(inputType);
            setPage(0);
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={filterInputType}
            variants={tableContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <MachineTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={selected.length}
                onSort={table.onSort}
                onSelectAllRows={handleSelectAll}
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
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 20 }}>
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 20, color: 'red' }}>
                      {error}
                    </td>
                  </tr>
                ) : dataFiltered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 20 }}>
                      {notFound ? (
                        <MachineTableNoData searchQuery={filterName} />
                      ) : (
                        'No data available'
                      )}
                    </td>
                  </tr>
                ) : (
                  <>
                    {dataFiltered.map((row) => (
                      <MachineTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => handleSelectOne(row.id)}
                        onEditRow={() => handleEditMachine(row.id)}
                        onDeleteRow={() => handleDeleteMachine(row.id)}
                      />
                    ))}

                    <MachineTableEmptyRows height={68} emptyRows={emptyRowsCount} />
                  </>
                )}
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
          </motion.div>
        </AnimatePresence>
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

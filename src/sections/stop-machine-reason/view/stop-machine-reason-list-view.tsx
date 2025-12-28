import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { STANDARD_ROWS_PER_PAGE_OPTIONS } from 'src/constants/table';
import {
  deleteStopMachineReason,
  postapiStopMachineReasongetreasonpage,
} from 'src/api/services/generated/stop-machine-reason';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { StopMachineReasonTableRow } from '../stop-machine-reason-table-row';
import { StopMachineReasonTableHead } from '../stop-machine-reason-table-head';
import { StopMachineReasonTableNoData } from '../stop-machine-reason-table-no-data';
import { StopMachineReasonTableToolbar } from '../stop-machine-reason-table-toolbar';
import { StopMachineReasonTableEmptyRows } from '../stop-machine-reason-table-empty-rows';

import type { StopMachineReasonProps } from '../stop-machine-reason-table-row';

// ----------------------------------------------------------------------

export function StopMachineReasonListView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [stopMachineReasons, setStopMachineReasons] = useState<StopMachineReasonProps[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const [groupCounts, setGroupCounts] = useState<Record<string, number>>({});
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);

  const fetchStopMachineReasons = useCallback(
    async (groupIds: string[] = []) => {
      setIsLoading(true);
      try {
        const response = await postapiStopMachineReasongetreasonpage(
          groupIds, // ObjectId[] is just string[]
          {
            Search: filterName || undefined,
            PageNumber: table.page,
            PageSize: table.rowsPerPage,
          }
        );

        const mappedReasons: StopMachineReasonProps[] = (response.items || []).map((item) => ({
          id: item.id?.toString() || '',
          code: '',
          name: item.name || '',
          stopGroup: item.groupName || '',
          stopType: 'planned',
          description: item.description || '',
        }));

        setStopMachineReasons(mappedReasons);
        setTotalItems(response.totalItems || 0);
        setGroupCounts(response.groupCounts || {});
      } catch (error) {
        console.error('Failed to fetch stop machine reasons:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [filterName, table.page, table.rowsPerPage]
  );

  useEffect(() => {
    fetchStopMachineReasons(selectedGroupIds);
  }, [fetchStopMachineReasons, selectedGroupIds]);

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: string) => {
      setSelectedTab(newValue);
      if (newValue === 'all') {
        setSelectedGroupIds([]);
      } else {
        setSelectedGroupIds([newValue]);
      }
      table.onResetPage();
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        await deleteStopMachineReason(id);
        // Refetch after deletion
        fetchStopMachineReasons(selectedGroupIds);
      } catch (error) {
        console.error('Failed to delete stop machine reason:', error);
      }
    },
    [fetchStopMachineReasons, selectedGroupIds]
  );

  const notFound = !stopMachineReasons.length && !!filterName;

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
          <Button variant="outlined" color="inherit" startIcon={<Iconify icon="mdi:export" />}>
            Export
          </Button>
          <Button
            component={RouterLink}
            href="/stop-machine-reason/create"
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add reason
          </Button>
        </Box>
      </Box>

      <Card>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          sx={{
            px: 2,
            pt: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Tab label={`All (${totalItems})`} value="all" />
          {Object.entries(groupCounts).map(([groupId, count]) => (
            <Tab key={groupId} label={`Group ${groupId} (${count})`} value={groupId} />
          ))}
        </Tabs>

        <StopMachineReasonTableToolbar
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
                <StopMachineReasonTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  rowCount={totalItems}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      stopMachineReasons.map((item) => item.id)
                    )
                  }
                  headLabel={[
                    { id: 'name', label: 'Name' },
                    { id: 'groupName', label: 'Group' },
                    { id: 'description', label: 'Description' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {stopMachineReasons.map((row) => (
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
                    emptyRows={0}
                  />

                  {notFound && <StopMachineReasonTableNoData searchQuery={filterName} />}
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

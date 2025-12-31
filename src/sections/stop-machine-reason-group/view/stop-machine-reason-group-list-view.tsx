import type { StopMachineImpact, StopMachineReasonGroupDto } from 'src/api/types/generated';

import { useMemo, useState, useEffect, useCallback } from 'react';

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

import { DashboardContent } from 'src/layouts/dashboard';
import { STANDARD_ROWS_PER_PAGE_OPTIONS } from 'src/constants/table';
import { useGetapiStopMachineReasonGroupgetreasongrouppage } from 'src/api/hooks/generated/use-stop-machine-reason-group';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { StopMachineReasonGroupTableRow } from '../stop-machine-reason-group-table-row';
import { StopMachineReasonGroupTableHead } from '../stop-machine-reason-group-table-head';
import { StopMachineReasonGroupTableNoData } from '../stop-machine-reason-group-table-no-data';
import { StopMachineReasonGroupTableToolbar } from '../stop-machine-reason-group-table-toolbar';
import { StopMachineReasonGroupTableEmptyRows } from '../stop-machine-reason-group-table-empty-rows';

import type { StopMachineReasonGroupProps } from '../stop-machine-reason-group-table-row';

// ----------------------------------------------------------------------

const emptyRows = (page: number, rowsPerPage: number, arrayLength: number) => page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;

const IMPACT_LABELS: Record<StopMachineImpact, string> = {
  run: 'Run',
  unPlanedStop: 'Unplanned Stop',
  planedStop: 'Planned Stop',
  notScheduled: 'Not Scheduled',
};

export function StopMachineReasonGroupListView() {
  const router = useRouter();
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [currentImpact, setCurrentImpact] = useState<StopMachineImpact | 'all'>('all');
  const [groups, setGroups] = useState<StopMachineReasonGroupProps[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalByImpact, setTotalByImpact] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Determine which impacts to query - 'all' means undefined
  // Memoize to prevent unnecessary re-fetches
  const impactsToQuery = useMemo(
    () => (currentImpact === 'all' ? undefined : [currentImpact]),
    [currentImpact]
  );

  const { data, isFetching } = useGetapiStopMachineReasonGroupgetreasongrouppage(
    {
      Search: filterName || undefined,
      PageNumber: table.page,
      PageSize: table.rowsPerPage,
      Impacts: impactsToQuery,
    },
    {
      enabled: true,
    }
  );

  useEffect(() => {
    if (data) {
      const mappedGroups: StopMachineReasonGroupProps[] = (data.items || []).map(
        (item: StopMachineReasonGroupDto) => ({
          id: item.id?.toString() || '',
          code: item.code || '',
          name: item.name || '',
          description: item.description || '',
          color: item.color || '',
          impact: item.impact || 'run',
        })
      );
      setGroups(mappedGroups);
      setTotalItems(data.totalItems || 0);

      // Store total by impact for tabs
      if (data.totalByImpact) {
        setTotalByImpact(data.totalByImpact);
      }

      setIsLoading(false);
    }
  }, [data]);

  // Calculate tabs from totalByImpact
  const tabs = useMemo(() => {
    const allCount = Object.values(totalByImpact).reduce((sum, count) => sum + count, 0);
    const result: Array<{ value: StopMachineImpact | 'all'; label: string; count: number }> = [
      { value: 'all', label: 'All', count: allCount },
    ];

    (['run', 'unPlanedStop', 'planedStop', 'notScheduled'] as StopMachineImpact[]).forEach(
      (impact) => {
        const count = totalByImpact[impact] || 0;
        result.push({
          value: impact,
          label: IMPACT_LABELS[impact],
          count,
        });
      }
    );

    return result;
  }, [totalByImpact]);

  const handleChangeTab = useCallback(
    (_event: React.SyntheticEvent, newValue: StopMachineImpact | 'all') => {
      setCurrentImpact(newValue);
      table.onResetPage();
    },
    [table]
  );

  const notFound = !isFetching && !groups.length;

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
            Stop Machine Reason Group List
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Stop Machine Reason Group
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
            onClick={() => router.push('/stop-machine-reason-group/create')}
          >
            Add group
          </Button>
        </Box>
      </Box>

      {/* Tabs for impact filtering */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={currentImpact}
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
        <StopMachineReasonGroupTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        {isFetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <StopMachineReasonGroupTableHead
                    order={table.order}
                    orderBy={table.orderBy}
                    rowCount={groups.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        groups.map((item) => item.id)
                      )
                    }
                    headLabel={[
                      { id: 'code', label: 'Code' },
                      { id: 'name', label: 'Name' },
                      { id: 'impact', label: 'Impact' },
                      { id: 'description', label: 'Description' },
                      { id: '' },
                    ]}
                  />
                  <TableBody>
                    {groups.map((row) => (
                      <StopMachineReasonGroupTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                      />
                    ))}

                    <StopMachineReasonGroupTableEmptyRows
                      height={68}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, groups.length)}
                    />

                    {notFound && <StopMachineReasonGroupTableNoData searchQuery={filterName} />}
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

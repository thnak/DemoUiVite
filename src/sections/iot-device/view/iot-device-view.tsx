import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
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
import { usePostapiIotDevicesearchdevice } from 'src/api/hooks/generated/use-iot-device';
import { ioTDeviceKeys, useDeleteIoTDevice } from 'src/api/hooks/generated/use-io-tdevice';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { emptyRows } from '../iot-device-utils';
import { IoTDeviceTableRow } from '../iot-device-table-row';
import { IoTDeviceTableHead } from '../iot-device-table-head';
import { IoTDeviceTableNoData } from '../iot-device-table-no-data';
import { IoTDeviceTableToolbar } from '../iot-device-table-toolbar';
import { IoTDeviceTableEmptyRows } from '../iot-device-table-empty-rows';

import type { IoTDeviceProps } from '../iot-device-table-row';

// ----------------------------------------------------------------------

export function IoTDeviceView() {
  const table = useTable();
  const queryClient = useQueryClient();

  const [filterName, setFilterName] = useState('');
  const [devices, setDevices] = useState<IoTDeviceProps[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { mutate: fetchDevices } = usePostapiIotDevicesearchdevice({
    onSuccess: (data) => {
      const mappedDevices: IoTDeviceProps[] = (data.items || []).map((item) => ({
        id: item.id?.toString() || '',
        code: item.code || '',
        name: item.name || '',
        macAddress: item.macAddress || '',
        machineName: item.machineName || '',
        type: item.type || '',
        mqttPassword: item.mqttPassword || '',
        imageUrl: item.imageUrl || '',
      }));
      setDevices(mappedDevices);
      setTotalItems(data.totalItems || 0);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const { mutate: deleteDeviceMutate } = useDeleteIoTDevice({
    onSuccess: () => {
      // Refetch devices after deletion
      fetchDevices({
        data: [{ sortBy: table.orderBy, descending: table.order === 'desc' }],
        params: {
          pageNumber: table.page,
          pageSize: table.rowsPerPage,
          searchTerm: filterName || undefined,
        },
      });
      queryClient.invalidateQueries({ queryKey: ioTDeviceKeys.all });
    },
  });

  useEffect(() => {
    setIsLoading(true);
    fetchDevices({
      data: [{ sortBy: table.orderBy, descending: table.order === 'desc' }],
      params: {
        pageNumber: table.page,
        pageSize: table.rowsPerPage,
        searchTerm: filterName || undefined,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.page, table.rowsPerPage, table.orderBy, table.order, filterName]);

  const handleDeleteRow = useCallback(
    (id: string) => {
      deleteDeviceMutate({ id });
    },
    [deleteDeviceMutate]
  );

  const notFound = !devices.length && !!filterName;

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
            IoT Devices
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              IoT Device
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
          <Button variant="outlined" color="inherit" startIcon={<Iconify icon="solar:cloud-download-bold" />}>
            Export
          </Button>
          <Button
            component={RouterLink}
            href="/iot-devices/create"
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add device
          </Button>
        </Box>
      </Box>

      <Card>
        <IoTDeviceTableToolbar
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
                <IoTDeviceTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  rowCount={totalItems}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      devices.map((device) => device.id)
                    )
                  }
                  headLabel={[
                    { id: 'name', label: 'Device' },
                    { id: 'macAddress', label: 'MAC Address' },
                    { id: 'machineName', label: 'Machine' },
                    { id: 'type', label: 'Type' },
                    { id: 'mqttPassword', label: 'MQTT Password' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {devices.map((row) => (
                    <IoTDeviceTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                    />
                  ))}

                  <IoTDeviceTableEmptyRows
                    height={68}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, totalItems)}
                  />

                  {notFound && <IoTDeviceTableNoData searchQuery={filterName} />}
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
  const [orderBy, setOrderBy] = useState('name');
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

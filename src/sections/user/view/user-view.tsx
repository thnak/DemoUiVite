import { motion, AnimatePresence } from 'framer-motion';
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

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { STANDARD_ROWS_PER_PAGE_OPTIONS } from 'src/constants/table';
import { useGetapiUsergetuserpages } from 'src/api/hooks/generated/use-user';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { emptyRows } from '../utils';
import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';

import type { UserProps } from '../user-table-row';

// ----------------------------------------------------------------------

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

export function UserView() {
  const router = useRouter();
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [users, setUsers] = useState<UserProps[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [roleCounts, setRoleCounts] = useState<Record<string, number>>({});

  const { mutate: fetchUsers } = useGetapiUsergetuserpages({
    onSuccess: (data) => {
      const mappedUsers: UserProps[] = (data.items || []).map((item) => ({
        id: item.username || '',
        username: item.username || '',
        displayName: item.displayName || '',
        email: item.email || '',
        phoneNumber: item.phoneNumber || '',
        avatarUrl: item.avatarUrl || '',
        roleNames: item.roleNames || [],
      }));
      setUsers(mappedUsers);
      setTotalItems(data.totalItems || 0);
      setRoleCounts(data.roleCounts || {});
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  useEffect(() => {
    setIsLoading(true);
    const roles = filterRole === 'all' ? undefined : [filterRole];
    fetchUsers({
      data: [{ sortBy: table.orderBy, descending: table.order === 'desc' }],
      params: {
        pageNumber: table.page,
        pageSize: table.rowsPerPage,
        searchTerm: filterName || undefined,
        Roles: roles,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.page, table.rowsPerPage, table.orderBy, table.order, filterName, filterRole]);

  const handleFilterRole = useCallback(
    (_event: React.SyntheticEvent, newValue: string) => {
      setFilterRole(newValue);
      table.onResetPage();
    },
    [table]
  );

  const notFound = !isLoading && !users.length && (!!filterName || filterRole !== 'all');

  // Get all unique roles from roleCounts
  const roleOptions = [
    { value: 'all', label: 'All', count: roleCounts.All || totalItems },
    ...Object.entries(roleCounts)
      .filter(([key]) => key !== 'All')
      .map(([key, value]) => ({ value: key, label: key, count: value })),
  ];

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
            Users
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              User Management
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              Users
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
            onClick={() => router.push('/users/create')}
          >
            New user
          </Button>
        </Box>
      </Box>

      <Card>
        <Tabs
          value={filterRole}
          onChange={handleFilterRole}
          sx={{
            px: 2.5,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.vars.palette.background.neutral}`,
          }}
        >
          {roleOptions.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === filterRole) && 'filled') || 'soft'
                  }
                  color="default"
                >
                  {tab.count}
                </Label>
              }
            />
          ))}
        </Tabs>

        <UserTableToolbar
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
          <AnimatePresence mode="wait">
            <motion.div
              key={filterRole}
              variants={tableContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Scrollbar>
                <TableContainer sx={{ overflow: 'unset' }}>
                  <Table sx={{ minWidth: 800 }}>
                    <UserTableHead
                      order={table.order}
                      orderBy={table.orderBy}
                      rowCount={users.length}
                      numSelected={table.selected.length}
                      onSort={table.onSort}
                      onSelectAllRows={(checked) =>
                        table.onSelectAllRows(
                          checked,
                          users.map((user) => user.id)
                        )
                      }
                      headLabel={[
                        { id: 'username', label: 'Username' },
                        { id: 'displayName', label: 'Display Name' },
                        { id: 'email', label: 'Email' },
                        { id: 'phoneNumber', label: 'Phone Number' },
                        { id: 'roles', label: 'Roles' },
                        { id: '' },
                      ]}
                    />
                    <TableBody>
                      {users
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row) => (
                          <UserTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                          />
                        ))}

                      <TableEmptyRows
                        height={68}
                        emptyRows={emptyRows(table.page, table.rowsPerPage, users.length)}
                      />

                      {notFound && <TableNoData searchQuery={filterName} />}
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
                rowsPerPageOptions={STANDARD_ROWS_PER_PAGE_OPTIONS}
                onRowsPerPageChange={table.onChangeRowsPerPage}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('username');
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

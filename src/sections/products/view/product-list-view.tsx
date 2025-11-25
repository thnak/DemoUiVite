import type { StockStatus, ProductStatus } from 'src/_mock';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useRouter } from 'src/routes/hooks';

import { _products } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { ProductTableRow } from '../product-table-row';
import { ProductTableHead } from '../product-table-head';
import { ProductTableNoData } from '../product-table-no-data';
import { ProductTableToolbar } from '../product-table-toolbar';
import { ProductTableEmptyRows } from '../product-table-empty-rows';
import { emptyRows, applyFilter, getComparator } from '../product-utils';

import type { ProductProps } from '../product-table-row';

// ----------------------------------------------------------------------

export function ProductListView() {
  const router = useRouter();
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [filterStock, setFilterStock] = useState<StockStatus | 'all'>('all');
  const [filterPublish, setFilterPublish] = useState<ProductStatus | 'all'>('all');

  const dataFiltered: ProductProps[] = applyFilter({
    inputData: _products as ProductProps[],
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filterStock,
    filterPublish,
  });

  const notFound =
    !dataFiltered.length && (!!filterName || filterStock !== 'all' || filterPublish !== 'all');

  const handleFilterStock = useCallback(
    (value: StockStatus | 'all') => {
      setFilterStock(value);
      table.onResetPage();
    },
    [table]
  );

  const handleFilterPublish = useCallback(
    (value: ProductStatus | 'all') => {
      setFilterPublish(value);
      table.onResetPage();
    },
    [table]
  );

  const handleEditProduct = useCallback(
    (id: string) => {
      router.push(`/products/${id}/edit`);
    },
    [router]
  );

  const handleDeleteProduct = useCallback((id: string) => {
    console.log('Delete product:', id);
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
              Product
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
          onClick={() => router.push('/products/create')}
        >
          Add product
        </Button>
      </Box>

      <Card>
        <ProductTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          filterStock={filterStock}
          filterPublish={filterPublish}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onFilterStock={handleFilterStock}
          onFilterPublish={handleFilterPublish}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ProductTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((product) => product.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Product' },
                  { id: 'createdAt', label: 'Created at' },
                  { id: 'stock', label: 'Stock' },
                  { id: 'price', label: 'Price' },
                  { id: 'publish', label: 'Publish' },
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
                    <ProductTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onEditRow={() => handleEditProduct(row.id)}
                      onDeleteRow={() => handleDeleteProduct(row.id)}
                    />
                  ))}

                <ProductTableEmptyRows
                  height={72}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                {notFound && <ProductTableNoData searchQuery={filterName} />}
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

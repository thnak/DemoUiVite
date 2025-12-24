import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { STANDARD_ROWS_PER_PAGE_OPTIONS } from 'src/constants/table';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useGetProductCategoryPage,
  useDeleteProductCategory,
} from 'src/api/hooks/generated/use-product-category';

import type { ProductCategoryEntity } from 'src/api/types/generated';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { ProductCategoryTableRow } from '../product-category-table-row';
import { ProductCategoryTableHead } from '../product-category-table-head';
import { ProductCategoryTableNoData } from '../product-category-table-no-data';
import { ProductCategoryTableToolbar } from '../product-category-table-toolbar';
import { ProductCategoryTableEmptyRows } from '../product-category-table-empty-rows';
import { emptyRows, applyFilter, getComparator } from '../product-category-utils';

import type { ProductCategoryProps } from '../product-category-table-row';

// ----------------------------------------------------------------------

export function ProductCategoryListView() {
  const router = useRouter();
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [productCategories, setProductCategories] = useState<ProductCategoryProps[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const { mutate: fetchProductCategories, isPending: isLoading } = useGetProductCategoryPage({
    onSuccess: (result) => {
      if (result.items) {
        const formattedData: ProductCategoryProps[] = result.items.map((item: ProductCategoryEntity) => ({
          id: item.id?.toString() || '',
          code: item.code || '',
          name: item.name || '',
          description: item.description || '',
        }));
        setProductCategories(formattedData);
        setTotalCount(result.totalCount || 0);
      }
    },
  });

  const { mutate: deleteProductCategory } = useDeleteProductCategory({
    onSuccess: () => {
      // Refetch data after deletion
      fetchProductCategories({
        data: [],
        params: {
          pageNumber: table.page,
          pageSize: table.rowsPerPage,
          searchTerm: filterName,
        },
      });
    },
  });

  useEffect(() => {
    fetchProductCategories({
      data: [],
      params: {
        pageNumber: table.page,
        pageSize: table.rowsPerPage,
        searchTerm: filterName,
      },
    });
  }, [table.page, table.rowsPerPage, filterName]);

  const dataFiltered: ProductCategoryProps[] = applyFilter({
    inputData: productCategories,
    comparator: getComparator(table.order, table.orderBy),
    filterName: '',
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleEditProductCategory = useCallback(
    (id: string) => {
      router.push(`/product-categories/${id}/edit`);
    },
    [router]
  );

  const handleDeleteProductCategory = useCallback(
    (id: string) => {
      if (window.confirm('Are you sure you want to delete this product category?')) {
        deleteProductCategory({ id });
      }
    },
    [deleteProductCategory]
  );

  const handleImport = useCallback(() => {
    console.log('Import product categories');
    // TODO: Implement import logic
  }, []);

  const handleExport = useCallback(() => {
    console.log('Export product categories');
    // TODO: Implement export logic
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
              Product Category
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
            onClick={handleImport}
          >
            Import
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="mdi:export" />}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => router.push('/product-categories/create')}
          >
            Add product category
          </Button>
        </Box>
      </Box>

      <Card>
        <ProductCategoryTableToolbar
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
              <ProductCategoryTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((productCategory) => productCategory.id)
                  )
                }
                headLabel={[
                  { id: 'code', label: 'Code' },
                  { id: 'name', label: 'Name' },
                  { id: 'description', label: 'Description' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          py: 10,
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {dataFiltered.map((row) => (
                      <ProductCategoryTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onEditRow={() => handleEditProductCategory(row.id)}
                        onDeleteRow={() => handleDeleteProductCategory(row.id)}
                      />
                    ))}

                    <ProductCategoryTableEmptyRows
                      height={68}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                    />

                    {notFound && <ProductCategoryTableNoData searchQuery={filterName} />}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={totalCount}
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

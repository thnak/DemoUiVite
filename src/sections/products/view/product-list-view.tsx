import type { ProductInfo } from 'src/api/types/generated';
import type { StockStatus, ProductStatus } from 'src/_mock';

import React, { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { STANDARD_ROWS_PER_PAGE_OPTIONS } from 'src/constants/table';
import { deleteProduct, postapiProductgetproductpage } from 'src/api/services/generated/product';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDeleteDialog } from 'src/components/confirm-delete-dialog';

import { ProductTableRow } from '../product-table-row';
import { ProductTableHead } from '../product-table-head';
import { ProductTableNoData } from '../product-table-no-data';
import { ProductTableToolbar } from '../product-table-toolbar';
import { ProductTableEmptyRows } from '../product-table-empty-rows';
import { emptyRows, applyFilter, getComparator } from '../product-utils';

import type { ProductProps } from '../product-table-row';

// ----------------------------------------------------------------------

export function ProductListView() {
  const [templates, setTemplates] = useState<ProductInfo[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterName, setFilterName] = useState('');
  const router = useRouter();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('name');
  const [filterStock, setFilterStock] = useState<StockStatus | 'all'>('all');
  const [filterPublish, setFilterPublish] = useState<ProductStatus | 'all'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sửa lỗi: Thêm dependencies cho filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await postapiProductgetproductpage([], {
        pageNumber: page,
        pageSize: rowsPerPage,
        searchTerm: filterName || undefined,
      });
      setTemplates(response.items || []);
      setTotalItems(response.totalItems || 0);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filterName]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Chuyển đổi API data sang format hiển thị
  const apiProducts: ProductProps[] = templates.map((p) => ({
    id: p.id ?? '',
    code: p.code ?? '',
    name: p.name ?? '',
    coverUrl: p.imageUrl ?? '',
    createdAt: p.createdAt ?? new Date().toISOString(),
    publish: 'published', // ProductInfo doesn't have draft status
    category: p.categoryName ?? 'N/A',
    stockStatus: 'in_stock',
    stock: p.stockQuantity ?? 0,
    price: p.price ?? 0,
  }));

  // Lọc dữ liệu ở client-side
  const dataFiltered: ProductProps[] = applyFilter({
    inputData: apiProducts,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStock,
    filterPublish,
  });

  const notFound =
    !dataFiltered.length && (!!filterName || filterStock !== 'all' || filterPublish !== 'all');

  const handleFilterStock = (value: StockStatus | 'all') => {
    setFilterStock(value);
    setPage(0);
  };

  const handleFilterPublish = (value: ProductStatus | 'all') => {
    setFilterPublish(value);
    setPage(0);
  };

  const handleEditProduct = useCallback(
    (id: string) => {
      router.push(`/products/${id}/edit`);
    },
    [router]
  );

  const handleDeleteProduct = useCallback(
    async (id: string) => {
      setItemToDelete(id);
      setDeleteDialogOpen(true);
    },
    []
  );

  const handleConfirmDelete = useCallback(async () => {
    if (itemToDelete) {
      try {
        setIsDeleting(true);
        await deleteProduct(itemToDelete);
        await fetchProducts();
        setSelected((prev) => prev.filter((i) => i !== itemToDelete));
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Không thể xóa sản phẩm');
      } finally {
        setIsDeleting(false);
      }
    }
  }, [itemToDelete, fetchProducts]);

  const handleCloseDeleteDialog = useCallback(() => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  }, [isDeleting]);

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
    setPage(0);
  };

  const handleSelectRow = (id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter((value) => value !== id)
      : [...selected, id];
    setSelected(newSelected);
  };

  const handleSelectAllRows = (checked: boolean) => {
    if (checked) {
      const newSelecteds = dataFiltered.map((product) => product.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSort = (id: string) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

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
            Danh sách
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Sản phẩm
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              Danh sách
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
            onClick={() => router.push('/products/create')}
          >
            Thêm sản phẩm
          </Button>
        </Box>
      </Box>

      <Card>
        <ProductTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          filterStock={filterStock}
          filterPublish={filterPublish}
          onFilterName={handleFilterName}
          onFilterStock={handleFilterStock}
          onFilterPublish={handleFilterPublish}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ProductTableHead
                order={order}
                orderBy={orderBy}
                rowCount={dataFiltered.length}
                numSelected={selected.length}
                onSort={handleSort}
                onSelectAllRows={handleSelectAllRows}
                headLabel={[
                  { id: 'name', label: 'Sản phẩm' },
                  { id: 'createdAt', label: 'Ngày tạo' },
                  { id: 'stockStatus', label: 'Tình trạng' },
                  { id: 'stock', label: 'Tồn kho'},
                  { id: 'price', label: 'Giá' },
                  { id: 'publish', label: 'Trạng thái' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography>Đang tải sản phẩm...</Typography>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography color="error">{error}</Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={fetchProducts}
                        sx={{ mt: 1 }}
                      >
                        Thử lại
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : dataFiltered.length > 0 ? (
                  dataFiltered.map((row) => (
                    <ProductTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => handleSelectRow(row.id)}
                      onEditRow={() => handleEditProduct(row.id)}
                      onDeleteRow={() => handleDeleteProduct(row.id)}
                    />
                  ))
                ) : notFound ? (
                  <ProductTableNoData searchQuery={filterName} />
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography>Chưa có sản phẩm nào</Typography>
                    </TableCell>
                  </TableRow>
                )}

                {!loading && !error && dataFiltered.length > 0 && (
                  <ProductTableEmptyRows
                    height={72}
                    emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
                  />
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
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPageOptions={[...STANDARD_ROWS_PER_PAGE_OPTIONS]}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Card>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        entityName="product"
        loading={isDeleting}
      />
    </DashboardContent>
  );
}

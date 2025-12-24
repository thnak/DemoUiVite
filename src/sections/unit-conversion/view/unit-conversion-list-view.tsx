import type { ChangeEvent } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { STANDARD_ROWS_PER_PAGE_OPTIONS } from 'src/constants/table';
import { usePostapiUnitgetunitconversions } from 'src/api/hooks/generated/use-unit';
import {
  unitConversionKeys,
  useDeleteUnitConversion,
} from 'src/api/hooks/generated/use-unit-conversion';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDeleteDialog } from 'src/components/confirm-delete-dialog';

import { UnitConversionTableRow } from '../unit-conversion-table-row';
import { UnitConversionTableToolbar } from '../unit-conversion-table-toolbar';

import type { UnitConversionProps } from '../unit-conversion-table-row';

// ----------------------------------------------------------------------

export function UnitConversionListView() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [conversions, setConversions] = useState<UnitConversionProps[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutate: fetchConversions } = usePostapiUnitgetunitconversions({
    onSuccess: (data) => {
      const mappedConversions: UnitConversionProps[] = (data.items || []).map((item) => ({
        id: item.fromUnitId?.toString() || '',
        from: item.fromUnitName || '',
        to: item.toUnitName || '',
        conversionFactor: item.conversionFactor || 0,
        offset: item.offset || 0,
        formulaDescription: item.formula || '',
      }));
      setConversions(mappedConversions);
      setTotalItems(data.totalItems || 0);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const { mutate: deleteConversionMutate } = useDeleteUnitConversion({
    onSuccess: () => {
      refetchConversions();
      queryClient.invalidateQueries({ queryKey: unitConversionKeys.all });
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: () => {
      setIsDeleting(false);
    },
  });

  const refetchConversions = useCallback(() => {
    setIsLoading(true);
    fetchConversions({
      data: [{ sortBy: 'fromUnitName', descending: false }],
      params: {
        pageNumber: page,
        pageSize: rowsPerPage,
        searchTerm: filterName || undefined,
      },
    });
  }, [fetchConversions, page, rowsPerPage, filterName]);

  useEffect(() => {
    refetchConversions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filterName]);

  const handleFilterName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
    setPage(0);
  }, []);

  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleSelectRow = useCallback(
    (id: string) => {
      const newSelected = selected.includes(id)
        ? selected.filter((value) => value !== id)
        : [...selected, id];
      setSelected(newSelected);
    },
    [selected]
  );

  const handleDeleteRow = useCallback((id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (itemToDelete) {
      setIsDeleting(true);
      deleteConversionMutate({ id: itemToDelete });
    }
  }, [itemToDelete, deleteConversionMutate]);

  const handleCloseDeleteDialog = useCallback(() => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  }, [isDeleting]);

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
            Unit Conversion List
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Settings
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              Unit Conversions
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => router.push('/settings/unit-conversions/create')}
          >
            Add Unit Conversion
          </Button>
        </Box>
      </Box>

      <Card>
        <UnitConversionTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" />
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell>Conversion Factor</TableCell>
                    <TableCell>Offset</TableCell>
                    <TableCell>Formula</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {conversions.map((row) => (
                    <UnitConversionTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => handleSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
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
      </Card>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        entityName="unit conversion"
        loading={isDeleting}
      />
    </DashboardContent>
  );
}

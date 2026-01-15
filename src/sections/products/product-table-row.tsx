import type { StockStatus, ProductStatus } from 'src/_mock';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { fDateTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type ProductProps = {
  id: string;
  code: string;
  name: string;
  coverUrl: string;
  category: string;
  stockStatus: StockStatus;
  stock: number;
  publish: ProductStatus;
  createdAt: string;
  price: number;
};

type ProductTableRowProps = {
  row: ProductProps;
  selected: boolean;
  onSelectRow: () => void;
  onEditRow: () => void;
  onDeleteRow: () => void;
};

// TODO: Implement stock display when needed
// const getStockColor = (status: StockStatus): 'success' | 'warning' | 'error' => {
//   switch (status) {
//     case 'in_stock':
//       return 'success';
//     case 'low_stock':
//       return 'warning';
//     case 'out_of_stock':
//       return 'error';
//     default:
//       return 'success';
//   }
// };

// const getStockLabel = (status: StockStatus, quantity: number): string => {
//   switch (status) {
//     case 'in_stock':
//       return `${quantity} in stock`;
//     case 'low_stock':
//       return `${quantity} low stock`;
//     case 'out_of_stock':
//       return 'out of stock';
//     default:
//       return `${quantity} in stock`;
//   }
// };

// const getStockProgress = (status: StockStatus): number => {
//   switch (status) {
//     case 'in_stock':
//       return 100;
//     case 'low_stock':
//       return 30;
//     case 'out_of_stock':
//       return 10;
//     default:
//       return 100;
//   }
// };

export function ProductTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
}: ProductTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEdit = useCallback(() => {
    handleClosePopover();
    onEditRow();
  }, [onEditRow, handleClosePopover]);

  const handleDelete = useCallback(() => {
    handleClosePopover();
    onDeleteRow();
  }, [onDeleteRow, handleClosePopover]);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box
            sx={{
              gap: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar
              alt={row.name}
              src={row.coverUrl}
              variant="rounded"
              sx={{ width: 64, height: 64 }}
            />
            <Box>
              <Typography variant="subtitle2" noWrap>
                {row.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {row.category}
              </Typography>
            </Box>
          </Box>
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap>
            {fDateTime(row.createdAt, 'DD MMM YYYY')}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
            {fDateTime(row.createdAt, 'h:mm a')}
          </Typography>
        </TableCell>

        <TableCell>
          <Label>{row.stockStatus}</Label>
        </TableCell>

        <TableCell>
          <Label>{row.stock ?? 0}</Label>
        </TableCell>

        <TableCell>
          <Label>{(row.price ?? 0).toLocaleString('vi-VN')}</Label>
        </TableCell>

        <TableCell>
          <Label
            variant={row.publish === 'published' ? 'soft' : 'filled'}
            color={row.publish === 'published' ? 'info' : 'default'}
          >
            {row.publish === 'published' ? 'Published' : 'Draft'}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}

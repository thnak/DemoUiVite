import type { MachineInputType } from 'src/_mock';

import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { getapiMachinemachineIdproductstotalmapped } from 'src/api/services/generated/machine';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type MachineProps = {
  id: string;
  code: string;
  name: string;
  imageUrl: string;
  area: string;
  inputType: MachineInputType;
  numberOfInputChannels: number;
  workCalendar: string;
  mappedProductsCount?: number;
};

type MachineTableRowProps = {
  row: MachineProps;
  selected: boolean;
  onSelectRow: () => void;
  onEditRow?: () => void;
  onDeleteRow?: () => void;
};

const getInputTypeColor = (inputType: MachineInputType): 'info' | 'warning' => {
  switch (inputType) {
    case 'weightedChannels':
      return 'info';
    case 'pairParallel':
      return 'warning';
    default:
      return 'info';
  }
};

export function MachineTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
}: MachineTableRowProps) {
  const navigate = useNavigate();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(true);

  // Lazy load product count
  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        setIsLoadingCount(true);
        const count = await getapiMachinemachineIdproductstotalmapped(row.id);
        setProductCount(count);
      } catch (error) {
        console.error('Failed to fetch product count:', error);
        setProductCount(0);
      } finally {
        setIsLoadingCount(false);
      }
    };

    fetchProductCount();
  }, [row.id]);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEdit = useCallback(() => {
    handleClosePopover();
    onEditRow?.();
  }, [onEditRow, handleClosePopover]);

  const handleDelete = useCallback(() => {
    handleClosePopover();
    onDeleteRow?.();
  }, [onDeleteRow, handleClosePopover]);

  const handleViewOEE = useCallback(() => {
    handleClosePopover();
    navigate(`/machines/${row.id}/oee`);
  }, [navigate, row.id, handleClosePopover]);

  const handleViewTracking = useCallback(() => {
    handleClosePopover();
    navigate(`/machines/${row.id}/tracking`);
  }, [navigate, row.id, handleClosePopover]);

  const handleManageProductMapping = useCallback(() => {
    handleClosePopover();
    navigate(`/machines/${row.id}/product-mapping`);
  }, [navigate, row.id, handleClosePopover]);

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
              src={row.imageUrl}
              variant="rounded"
              sx={{ width: 64, height: 64 }}
            />
            <Box>
              <Typography variant="subtitle2" noWrap>
                {row.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {row.code}
              </Typography>
            </Box>
          </Box>
        </TableCell>

        <TableCell>{row.area}</TableCell>

        <TableCell>
          <Label color={getInputTypeColor(row.inputType)}>{row.inputType}</Label>
        </TableCell>

        <TableCell align="center">{row.numberOfInputChannels}</TableCell>

        <TableCell>{row.workCalendar}</TableCell>

        <TableCell align="center">
          {isLoadingCount ? (
            <Skeleton
              variant="rectangular"
              width={40}
              height={24}
              sx={{ mx: 'auto', borderRadius: 1 }}
            />
          ) : (
            <Chip
              label={productCount ?? 0}
              size="small"
              color={productCount && productCount > 0 ? 'success' : 'default'}
              sx={{ minWidth: 40 }}
            />
          )}
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
            width: 160,
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
          <MenuItem onClick={handleViewTracking} sx={{ color: 'info.main' }}>
            <Iconify icon="solar:chart-bold-duotone" />
            Realtime Tracking
          </MenuItem>

          <MenuItem onClick={handleViewOEE} sx={{ color: 'primary.main' }}>
            <Iconify icon="mdi:gauge" />
            OEE Dashboard
          </MenuItem>

          <MenuItem onClick={handleManageProductMapping} sx={{ color: 'secondary.main' }}>
            <Iconify icon="solar:settings-bold-duotone" />
            Product Mapping
          </MenuItem>

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

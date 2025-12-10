import type { IoTDeviceType } from 'src/api/types/generated';

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

import { useRouter } from 'src/routes/hooks';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type IoTDeviceProps = {
  id: string;
  code: string;
  name: string;
  macAddress: string;
  machineName: string;
  type: IoTDeviceType | string;
  mqttPassword: string;
  imageUrl: string;
};

type IoTDeviceTableRowProps = {
  row: IoTDeviceProps;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow?: () => void;
};

export function IoTDeviceTableRow({ row, selected, onSelectRow, onDeleteRow }: IoTDeviceTableRowProps) {
  const router = useRouter();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEditRow = useCallback(() => {
    router.push(`/iot-devices/${row.id}/edit`);
  }, [router, row.id]);

  const handleEditFromMenu = useCallback(() => {
    handleClosePopover();
    handleEditRow();
  }, [handleClosePopover, handleEditRow]);

  const getTypeLabel = (type: IoTDeviceType | string) => {
    const typeLabels: Record<string, { label: string; color: 'info' | 'warning' | 'success' | 'error' | 'primary' | 'secondary' | 'default' }> = {
      gateway: { label: 'Gateway', color: 'info' },
      sensorNode: { label: 'Sensor Node', color: 'success' },
      edgeDevice: { label: 'Edge Device', color: 'primary' },
      actuator: { label: 'Actuator', color: 'warning' },
      controller: { label: 'Controller', color: 'secondary' },
      other: { label: 'Other', color: 'default' },
    };
    return typeLabels[type] || { label: type || 'Unknown', color: 'default' as const };
  };

  const typeInfo = getTypeLabel(row.type);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              alt={row.name}
              src={row.imageUrl}
              variant="rounded"
              sx={{ width: 48, height: 48 }}
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

        <TableCell>
          <Typography variant="body2" noWrap>
            {row.macAddress || '-'}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap>
            {row.machineName || '-'}
          </Typography>
        </TableCell>

        <TableCell>
          <Label color={typeInfo.color}>{typeInfo.label}</Label>
        </TableCell>

        <TableCell>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              bgcolor: 'action.hover',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              display: 'inline-block',
            }}
          >
            {row.mqttPassword ? '••••••••' : '-'}
          </Typography>
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
          <MenuItem onClick={handleEditFromMenu}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClosePopover();
              onDeleteRow?.();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}

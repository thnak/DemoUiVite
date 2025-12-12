import type { IoTSensorType } from 'src/api/types/generated';

import { useState, useCallback } from 'react';

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

export type IoTSensorProps = {
  id: string;
  code: string;
  name: string;
  deviceName: string;
  pinNumber?: number;
  type: IoTSensorType | string;
  unitOfMeasurement?: string;
};

type IoTSensorTableRowProps = {
  row: IoTSensorProps;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow?: () => void;
};

export function IoTSensorTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
}: IoTSensorTableRowProps) {
  const router = useRouter();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEditRow = useCallback(() => {
    router.push(`/iot-sensors/${row.id}/edit`);
  }, [router, row.id]);

  const handleEditFromMenu = useCallback(() => {
    handleClosePopover();
    handleEditRow();
  }, [handleClosePopover, handleEditRow]);

  const getTypeLabel = (type: IoTSensorType | string) => {
    const typeLabels: Record<
      string,
      {
        label: string;
        color: 'info' | 'warning' | 'success' | 'error' | 'primary' | 'secondary' | 'default';
      }
    > = {
      temperature: { label: 'Temperature', color: 'error' },
      humidity: { label: 'Humidity', color: 'info' },
      pressure: { label: 'Pressure', color: 'warning' },
      light: { label: 'Light', color: 'secondary' },
      camera: { label: 'Camera', color: 'primary' },
      proximity: { label: 'Proximity', color: 'success' },
      accelerometer: { label: 'Accelerometer', color: 'info' },
      gyroscope: { label: 'Gyroscope', color: 'info' },
      magnetometer: { label: 'Magnetometer', color: 'primary' },
      heartRate: { label: 'Heart Rate', color: 'error' },
      gps: { label: 'GPS', color: 'success' },
      pingStatus: { label: 'Ping Status', color: 'warning' },
      counter: { label: 'Counter', color: 'secondary' },
      analog: { label: 'Analog', color: 'default' },
      press: { label: 'Press', color: 'primary' },
      unknown: { label: 'Unknown', color: 'default' },
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

        <TableCell>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }} noWrap>
            {row.code}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {row.name}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap>
            {row.deviceName || '-'}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2" noWrap>
            {row.pinNumber ?? '-'}
          </Typography>
        </TableCell>

        <TableCell>
          <Label color={typeInfo.color}>{typeInfo.label}</Label>
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap>
            {row.unitOfMeasurement || '-'}
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

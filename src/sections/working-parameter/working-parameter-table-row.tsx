import { useState, useCallback } from 'react';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type WorkingParameterProps = {
  id: string;
  product: string;
  productName: string;
  machine: string;
  machineName: string;
  quantityPerSignal: number;
  idealCycleTime: string;
  downtimeThreshold: string;
  speedLossThreshold: string;
};
export function timeSpanToSeconds(input: unknown): number {
  if (input == null) return 0;

  // ISO-8601 duration: PnDTnHnMnS / PT5S / PT5M ...
  if (typeof input === 'string') {
    const s = input.trim();

    // ISO duration
    if (/^P/i.test(s)) {
      const m = s.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/i);
      if (!m) return 0;
      const days = Number(m[1] ?? 0);
      const hours = Number(m[2] ?? 0);
      const mins = Number(m[3] ?? 0);
      const secs = Number(m[4] ?? 0);
      return Math.floor(days * 86400 + hours * 3600 + mins * 60 + secs);
    }

    // hh:mm:ss / mm:ss / ss (kèm fraction)
    let t = s.replace(',', '.');
    // strip fractional seconds: 00:00:05.123
    const firstColon = t.indexOf(':');
    const dot = t.indexOf('.');
    if (dot !== -1 && firstColon !== -1 && dot > firstColon) t = t.slice(0, dot);

    // day prefix: 1.02:03:04
    let days = 0;
    const firstDot = t.indexOf('.');
    if (firstDot !== -1 && (firstColon === -1 || firstDot < firstColon)) {
      days = Number(t.slice(0, firstDot)) || 0;
      t = t.slice(firstDot + 1);
    }

    const parts = t.split(':').map(Number);
    if (parts.some(Number.isNaN)) return 0;

    let h = 0,
      m2 = 0,
      sec = 0;
    if (parts.length === 3) [h, m2, sec] = parts as [number, number, number];
    else if (parts.length === 2) [m2, sec] = parts as [number, number];
    else [sec] = parts as [number];

    return days * 86400 + h * 3600 + m2 * 60 + sec;
  }

  return 0;
}

export function formatSecondsHms(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

type WorkingParameterTableRowProps = {
  row: WorkingParameterProps;
  selected: boolean;
  onSelectRow: () => void;
  onEditRow: () => void;
  onDeleteRow: () => void;
};

export function WorkingParameterTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
}: WorkingParameterTableRowProps) {
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

        <TableCell>{row.productName}</TableCell>

        <TableCell>{row.machineName}</TableCell>

        <TableCell>{row.idealCycleTime}</TableCell>

        <TableCell>{row.quantityPerSignal}</TableCell>

        <TableCell>{row.downtimeThreshold}</TableCell>

        <TableCell>{row.speedLossThreshold}</TableCell>

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

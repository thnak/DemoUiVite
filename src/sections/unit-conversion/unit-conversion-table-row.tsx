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

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type UnitConversionProps = {
  id: string;
  from: string;
  to: string;
  conversionFactor: number;
  offset: number;
  formulaDescription: string;
};

type UnitConversionTableRowProps = {
  row: UnitConversionProps;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow?: () => void;
};

export function UnitConversionTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
}: UnitConversionTableRowProps) {
  const router = useRouter();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEditRow = useCallback(() => {
    router.push(`/settings/unit-conversions/${row.id}/edit`);
  }, [router, row.id]);

  const handleEditFromMenu = useCallback(() => {
    handleClosePopover();
    handleEditRow();
  }, [handleClosePopover, handleEditRow]);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Typography variant="subtitle2" noWrap>
            {row.from}
          </Typography>
        </TableCell>

        <TableCell>{row.to}</TableCell>

        <TableCell>{row.conversionFactor}</TableCell>

        <TableCell>{row.offset}</TableCell>

        <TableCell>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {row.formulaDescription}
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

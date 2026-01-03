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

import { apiConfig } from 'src/api';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type TimeBlockNameProps = {
  id: string;
  code: string;
  name: string;
  description: string;
  colorHex: string;
  imageUrl?: string;
};

type TimeBlockNameTableRowProps = {
  row: TimeBlockNameProps;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow?: () => void;
};

export function TimeBlockNameTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
}: TimeBlockNameTableRowProps) {
  const router = useRouter();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEditRow = useCallback(() => {
    router.push(`/settings/time-block-names/${row.id}/edit`);
  }, [router, row.id]);

  const handleEditFromMenu = useCallback(() => {
    handleClosePopover();
    handleEditRow();
  }, [handleClosePopover, handleEditRow]);

  const imageUrl = row.imageUrl || `${apiConfig.baseUrl}/api/TimeBlockName/${row.id}/image`;

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>
          <Avatar
            alt={row.name}
            src={imageUrl}
            variant="rounded"
            sx={{ width: 48, height: 48 }}
          />
        </TableCell>

        <TableCell component="th" scope="row">
          <Typography variant="subtitle2" noWrap>
            {row.code}
          </Typography>
        </TableCell>

        <TableCell>{row.name}</TableCell>

        <TableCell>{row.description}</TableCell>

        <TableCell>
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '4px',
              bgcolor: row.colorHex || '#cccccc',
              border: '1px solid',
              borderColor: 'divider',
            }}
          />
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

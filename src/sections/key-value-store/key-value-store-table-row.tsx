import { useState, useCallback } from 'react';
import { format } from 'date-fns';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
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

export type KeyValueStoreProps = {
  id: string;
  key: string;
  value?: string | null;
  typeName?: string | null;
  tags?: string[] | null;
  isEncrypted: boolean;
  expiresAt?: string | null;
};

type KeyValueStoreTableRowProps = {
  row: KeyValueStoreProps;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow?: () => void;
  returnUrl?: string;
};

export function KeyValueStoreTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  returnUrl,
}: KeyValueStoreTableRowProps) {
  const router = useRouter();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEditRow = useCallback(() => {
    const editUrl = `/settings/key-value-store/${row.id}/edit`;
    const urlWithReturn = returnUrl
      ? `${editUrl}?returnUrl=${encodeURIComponent(returnUrl)}`
      : editUrl;
    router.push(urlWithReturn);
  }, [router, row.id, returnUrl]);

  const handleEditFromMenu = useCallback(() => {
    handleClosePopover();
    handleEditRow();
  }, [handleClosePopover, handleEditRow]);

  const truncateValue = (value: string | null | undefined, maxLength: number = 50) => {
    if (!value) return '-';
    return value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;
  };

  const formatExpiresAt = (expiresAt: string | null | undefined) => {
    if (!expiresAt) return '-';
    try {
      return format(new Date(expiresAt), 'MMM dd, yyyy HH:mm');
    } catch {
      return '-';
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {row.isEncrypted && (
              <Iconify
                icon="solar:shield-keyhole-bold-duotone"
                width={20}
                sx={{ color: 'warning.main' }}
              />
            )}
            <Typography variant="subtitle2" noWrap>
              {row.key}
            </Typography>
          </Box>
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap>
            {truncateValue(row.value)}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap>
            {row.typeName || '-'}
          </Typography>
        </TableCell>

        <TableCell>
          {row.tags && row.tags.length > 0 ? (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {row.tags.slice(0, 2).map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="soft" />
              ))}
              {row.tags.length > 2 && (
                <Chip label={`+${row.tags.length - 2}`} size="small" variant="soft" />
              )}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              -
            </Typography>
          )}
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap>
            {formatExpiresAt(row.expiresAt)}
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

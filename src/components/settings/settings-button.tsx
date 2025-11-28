import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback } from 'react';

import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import { SettingsDrawer } from './settings-drawer';

// ----------------------------------------------------------------------

export type SettingsButtonProps = IconButtonProps;

export function SettingsButton({ sx, ...other }: SettingsButtonProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        aria-label="Settings"
        sx={{
          width: 40,
          height: 40,
          ...sx,
        }}
        {...other}
      >
        <Badge color="error" variant="dot" invisible>
          <Iconify icon="solar:settings-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <SettingsDrawer open={open} onClose={handleClose} />
    </>
  );
}

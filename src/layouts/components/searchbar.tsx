import type { BoxProps } from '@mui/material/Box';

import { useState, useEffect, useCallback } from 'react';

import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { SearchDialog } from 'src/components/search-dialog';

// ----------------------------------------------------------------------

export function Searchbar({ sx, ...other }: BoxProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        handleOpen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleOpen]);

  return (
    <>
      <IconButton onClick={handleOpen} sx={sx} {...other}>
        <Iconify icon="eva:search-fill" />
      </IconButton>

      <SearchDialog open={open} onClose={handleClose} />
    </>
  );
}

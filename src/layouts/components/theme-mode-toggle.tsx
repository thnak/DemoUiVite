import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useThemeMode, type ThemeModeValue } from 'src/theme/theme-mode-context';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type ModeOption = {
  value: ThemeModeValue;
  label: string;
  icon: 'solar:sun-bold' | 'solar:moon-bold' | 'solar:laptop-bold';
};

const modeOptions: ModeOption[] = [
  { value: 'system', label: 'System', icon: 'solar:laptop-bold' },
  { value: 'light', label: 'Light', icon: 'solar:sun-bold' },
  { value: 'dark', label: 'Dark', icon: 'solar:moon-bold' },
];

export type ThemeModeToggleProps = IconButtonProps;

export function ThemeModeToggle({ sx, ...other }: ThemeModeToggleProps) {
  const { mode, setMode, resolvedMode } = useThemeMode();

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleSelectMode = useCallback(
    (newMode: ThemeModeValue) => {
      setMode(newMode);
      handleClosePopover();
    },
    [setMode, handleClosePopover]
  );

  const currentIcon = resolvedMode === 'dark' ? 'solar:moon-bold' : 'solar:sun-bold';

  return (
    <>
      <IconButton
        onClick={handleOpenPopover}
        aria-label="Toggle theme mode"
        sx={{
          width: 40,
          height: 40,
          ...sx,
        }}
        {...other}
      >
        <Iconify icon={currentIcon} width={24} />
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { width: 140 },
          },
        }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 1.5,
              borderRadius: 0.75,
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' },
              [`&.${menuItemClasses.selected}`]: {
                color: 'text.primary',
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightSemiBold',
              },
            },
          }}
        >
          {modeOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === mode}
              onClick={() => handleSelectMode(option.value)}
            >
              <Box
                component="span"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Iconify icon={option.icon} width={20} />
              </Box>
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  );
}

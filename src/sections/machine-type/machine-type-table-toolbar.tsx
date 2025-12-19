import type { Theme, SxProps } from '@mui/material/styles';

import Toolbar from '@mui/material/Toolbar';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type MachineTypeTableToolbarProps = {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sx?: SxProps<Theme>;
};

export function MachineTypeTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  sx,
}: MachineTypeTableToolbarProps) {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
        ...sx,
      }}
    >
      <OutlinedInput
        fullWidth
        value={filterName}
        onChange={onFilterName}
        size="small"
        placeholder="Search machine type..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        }
        sx={{ maxWidth: 320 }}
      />
    </Toolbar>
  );
}

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type UserTableToolbarProps = {
  numSelected: number;
  filterName: string;
  filterRole: string;
  roles: string[];
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterRole: (role: string) => void;
};

export function UserTableToolbar({
  numSelected,
  filterName,
  filterRole,
  roles,
  onFilterName,
  onFilterRole,
}: UserTableToolbarProps) {
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
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexGrow: 1 }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              displayEmpty
              value={filterRole}
              onChange={(e) => onFilterRole(e.target.value)}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                if (!selected) {
                  return <Typography sx={{ color: 'text.secondary' }}>Role</Typography>;
                }
                return selected;
              }}
            >
              <MenuItem value="">
                <em>All Roles</em>
              </MenuItem>
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <OutlinedInput
            fullWidth
            size="small"
            value={filterName}
            onChange={onFilterName}
            placeholder="Search..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ maxWidth: 320 }}
          />
        </Box>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

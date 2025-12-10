import type { StopType } from 'src/_mock';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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

type StopMachineReasonTableToolbarProps = {
  numSelected: number;
  filterName: string;
  filterStopType: StopType | 'all';
  stopGroups: string[];
  filterStopGroup: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterStopType: (stopType: StopType | 'all') => void;
  onFilterStopGroup: (stopGroup: string) => void;
};

export function StopMachineReasonTableToolbar({
  numSelected,
  filterName,
  filterStopType,
  stopGroups,
  filterStopGroup,
  onFilterName,
  onFilterStopType,
  onFilterStopGroup,
}: StopMachineReasonTableToolbarProps) {
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
              value={filterStopGroup}
              onChange={(e) => onFilterStopGroup(e.target.value)}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                if (!selected) {
                  return <Typography sx={{ color: 'text.secondary' }}>Stop Group</Typography>;
                }
                return selected;
              }}
            >
              <MenuItem value="">
                <em>All Groups</em>
              </MenuItem>
              {stopGroups.map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              displayEmpty
              value={filterStopType}
              onChange={(e) => onFilterStopType(e.target.value as StopType | 'all')}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                if (selected === 'all') {
                  return <Typography sx={{ color: 'text.secondary' }}>Stop Type</Typography>;
                }
                return selected;
              }}
            >
              <MenuItem value="all">
                <em>All Types</em>
              </MenuItem>
              <MenuItem value="Plan">Plan</MenuItem>
              <MenuItem value="UnPlan">UnPlan</MenuItem>
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            color="inherit"
            startIcon={<Iconify icon="solar:list-bold-duotone" width={18} />}
          >
            Columns
          </Button>
          <Button
            size="small"
            color="inherit"
            startIcon={<Iconify icon="ic:round-filter-list" width={18} />}
          >
            Filters
          </Button>
        </Box>
      )}
    </Toolbar>
  );
}

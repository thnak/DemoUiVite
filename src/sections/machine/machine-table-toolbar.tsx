import type { MachineInputType } from 'src/_mock';

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

type MachineTableToolbarProps = {
  numSelected: number;
  filterName: string;
  filterArea: string;
  filterInputType: MachineInputType | 'all';
  areas: string[];
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterArea: (area: string) => void;
  onFilterInputType: (inputType: MachineInputType | 'all') => void;
};

export function MachineTableToolbar({
  numSelected,
  filterName,
  filterArea,
  filterInputType,
  areas,
  onFilterName,
  onFilterArea,
  onFilterInputType,
}: MachineTableToolbarProps) {
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
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              displayEmpty
              value={filterArea}
              onChange={(e) => onFilterArea(e.target.value)}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                if (!selected) {
                  return <Typography sx={{ color: 'text.secondary' }}>Area</Typography>;
                }
                return selected;
              }}
            >
              <MenuItem value="">
                <em>All Areas</em>
              </MenuItem>
              {areas.map((area) => (
                <MenuItem key={area} value={area}>
                  {area}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              displayEmpty
              value={filterInputType}
              onChange={(e) => onFilterInputType(e.target.value as MachineInputType | 'all')}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                if (selected === 'all') {
                  return <Typography sx={{ color: 'text.secondary' }}>Input Type</Typography>;
                }
                return selected;
              }}
            >
              <MenuItem value="all">
                <em>All Types</em>
              </MenuItem>
              <MenuItem value="WeightChannels">WeightChannels</MenuItem>
              <MenuItem value="PairChannel">PairChannel</MenuItem>
            </Select>
          </FormControl>

          <OutlinedInput
            fullWidth
            size="small"
            value={filterName}
            onChange={onFilterName}
            placeholder="Search machine..."
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

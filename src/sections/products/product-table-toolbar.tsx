import type { StockStatus, ProductStatus } from 'src/_mock';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
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

type ProductTableToolbarProps = {
  numSelected: number;
  filterName: string;
  filterStock: StockStatus | 'all';
  filterPublish: ProductStatus | 'all';
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterStock: (value: StockStatus | 'all') => void;
  onFilterPublish: (value: ProductStatus | 'all') => void;
};

const STOCK_OPTIONS: { value: StockStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Stock' },
  { value: 'in_stock', label: 'In Stock' },
  { value: 'low_stock', label: 'Low Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
];

const PUBLISH_OPTIONS: { value: ProductStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];

export function ProductTableToolbar({
  numSelected,
  filterName,
  filterStock,
  filterPublish,
  onFilterName,
  onFilterStock,
  onFilterPublish,
}: ProductTableToolbarProps) {
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
              value={filterStock}
              onChange={(e) => onFilterStock(e.target.value as StockStatus | 'all')}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                const option = STOCK_OPTIONS.find((opt) => opt.value === selected);
                return (
                  <Typography sx={{ color: selected === 'all' ? 'text.secondary' : 'inherit' }}>
                    {option?.label || 'Stock'}
                  </Typography>
                );
              }}
            >
              {STOCK_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              displayEmpty
              value={filterPublish}
              onChange={(e) => onFilterPublish(e.target.value as ProductStatus | 'all')}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                const option = PUBLISH_OPTIONS.find((opt) => opt.value === selected);
                return (
                  <Typography sx={{ color: selected === 'all' ? 'text.secondary' : 'inherit' }}>
                    {option?.label || 'Publish'}
                  </Typography>
                );
              }}
            >
              {PUBLISH_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Delete">
            <IconButton>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        </Box>
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

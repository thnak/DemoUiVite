# Master Data List Pattern

This guide documents the standard UI pattern for all master data list pages in the application. All new master data pages MUST follow this pattern to ensure consistency.

## Overview

Master data list pages (Products, Machines, Defects, Devices, Sensors, Working Parameters) follow a standardized UI pattern consisting of:

1. **Header Section**: Title, breadcrumbs, and action buttons (Import, Export, Add)
2. **Table Toolbar**: Search field, filters (left), and utility buttons (right)
3. **Data Table**: Standard columns with context menu actions
4. **Pagination**: Consistent rows per page options

## Standard Pattern

### 1. Header Section

```tsx
<Box
  sx={{
    mb: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }}
>
  <Box>
    <Typography variant="h4" sx={{ mb: 1 }}>
      List
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2" sx={{ color: 'text.primary' }}>
        Dashboard
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        •
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.primary' }}>
        {Section Name}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        •
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.disabled' }}>
        List
      </Typography>
    </Box>
  </Box>
  <Box sx={{ display: 'flex', gap: 1.5 }}>
    <Button
      variant="outlined"
      color="inherit"
      startIcon={<Iconify icon="solar:cloud-upload-bold" />}
    >
      Import
    </Button>
    <Button
      variant="outlined"
      color="inherit"
      startIcon={<Iconify icon="solar:cloud-download-bold" />}
    >
      Export
    </Button>
    <Button
      variant="contained"
      color="inherit"
      startIcon={<Iconify icon="mingcute:add-line" />}
      onClick={() => router.push('/your-path/create')}
    >
      Add {Item}
    </Button>
  </Box>
</Box>
```

**Key Points:**
- **Left side**: Title and breadcrumbs
- **Right side**: Import (outlined) → Export (outlined) → Add (contained)
- Button gap: 1.5
- Icons: `solar:cloud-upload-bold`, `solar:cloud-download-bold`, `mingcute:add-line`

### 2. Table Toolbar

```tsx
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
      {/* Quick filters (optional) */}
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <Select {...filterProps}>
          {/* Filter options */}
        </Select>
      </FormControl>
      
      {/* Search field (required) */}
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
        startIcon={<Iconify icon="solar:list-bold" width={18} />}
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
```

**Key Points:**
- **Left side**: Quick filters (optional) + Search field (required)
- **Right side**: Columns button + Filters button
- Search field max width: 320px
- Toolbar height: 96px
- Icons: `solar:list-bold`, `ic:round-filter-list`

### 3. Table Row Actions

```tsx
export function YourTableRow({ row, selected, onSelectRow, onEditRow, onDeleteRow }) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        {/* ... table cells ... */}
        
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
            [\`& .\${menuItemClasses.root}\`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [\`&.\${menuItemClasses.selected}\`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
```

**Key Points:**
- **Action column**: ONLY context menu button (3-dot icon)
- **NO inline edit/delete buttons** - everything goes in the context menu
- Menu width: 140px
- Icons: `eva:more-vertical-fill`, `solar:pen-bold`, `solar:trash-bin-trash-bold`

### 4. Pagination

```tsx
import { STANDARD_ROWS_PER_PAGE_OPTIONS } from 'src/constants/table';

// ...

<TablePagination
  component="div"
  page={page}
  count={totalItems}
  rowsPerPage={rowsPerPage}
  onPageChange={handleChangePage}
  rowsPerPageOptions={[...STANDARD_ROWS_PER_PAGE_OPTIONS]}
  onRowsPerPageChange={handleChangeRowsPerPage}
/>
```

**Key Points:**
- **MUST** use `STANDARD_ROWS_PER_PAGE_OPTIONS` constant
- Standard options: `[5, 10, 25, 50]`
- Import from `src/constants/table`

## Complete Example: Product List

Here's a complete implementation example for a master data list page:

```tsx
import type { ProductEntity } from 'src/api/types/generated';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { STANDARD_ROWS_PER_PAGE_OPTIONS } from 'src/constants/table';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

export function ProductListView() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');

  return (
    <DashboardContent>
      {/* Header Section */}
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Product List
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Products
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              List
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="solar:cloud-upload-bold" />}
          >
            Import
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="solar:cloud-download-bold" />}
          >
            Export
          </Button>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => router.push('/products/create')}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      {/* Table Card */}
      <Card>
        {/* Toolbar */}
        <ProductTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={(e) => setFilterName(e.target.value)}
        />

        {/* Table */}
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              {/* Table content */}
            </Table>
          </TableContainer>
        </Scrollbar>

        {/* Pagination */}
        <TablePagination
          component="div"
          page={page}
          count={totalItems}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPageOptions={[...STANDARD_ROWS_PER_PAGE_OPTIONS]}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Card>
    </DashboardContent>
  );
}
```

## Quick Filter Variations

### With Tabs (for limited groups)

For pages with a limited number of filter groups (like Machine List), use tabs:

```tsx
<Tabs
  value={filterType}
  onChange={handleFilterType}
  sx={{
    px: 2.5,
    boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.vars.palette.background.neutral}`,
  }}
>
  {TYPE_OPTIONS.map((tab) => (
    <Tab
      key={tab.value}
      value={tab.value}
      label={tab.label}
      iconPosition="end"
      icon={
        <Label variant="filled" color="default">
          {counts[tab.value]}
        </Label>
      }
    />
  ))}
</Tabs>
```

### With Dropdowns (for many options)

For pages with many filter options, use Select components in the toolbar:

```tsx
<FormControl size="small" sx={{ minWidth: 140 }}>
  <Select
    displayEmpty
    value={filterStock}
    onChange={(e) => onFilterStock(e.target.value)}
    input={<OutlinedInput />}
    renderValue={(selected) => {
      const option = OPTIONS.find((opt) => opt.value === selected);
      return (
        <Typography sx={{ color: selected === 'all' ? 'text.secondary' : 'inherit' }}>
          {option?.label || 'Stock'}
        </Typography>
      );
    }}
  >
    {OPTIONS.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </Select>
</FormControl>
```

## Checklist for New Master Data Pages

When creating a new master data list page, ensure:

- [ ] Header has title, breadcrumbs, and three buttons (Import, Export, Add)
- [ ] Import and Export buttons use `variant="outlined"` with correct icons
- [ ] Add button uses `variant="contained"` with `mingcute:add-line` icon
- [ ] Toolbar has search field on left (max width 320px)
- [ ] Toolbar has Columns and Filters buttons on right
- [ ] Table rows use ONLY context menu for actions (no inline buttons)
- [ ] Context menu includes Edit and Delete options
- [ ] Pagination uses `STANDARD_ROWS_PER_PAGE_OPTIONS` constant
- [ ] Quick filters (if needed) are on left side of toolbar
- [ ] All spacing and styling matches the standard pattern

## Benefits of This Pattern

1. **Consistency**: All master data pages look and behave the same way
2. **Familiarity**: Users know where to find actions across all pages
3. **Scalability**: Easy to add new master data pages following the pattern
4. **Maintainability**: Changes to the pattern can be applied systematically
5. **Accessibility**: Standard layout improves keyboard navigation and screen reader support

## Related Documentation

- [Creating New Pages](./creating-new-pages.md) - General page creation guide
- [Table Constants](../../src/constants/table.ts) - Standard pagination options
- [Navigation Patterns](./navigation-patterns.md) - Menu and routing configuration

## Migration Guide

For existing pages that don't follow this pattern:

1. **Update imports**: Add `STANDARD_ROWS_PER_PAGE_OPTIONS` import
2. **Update header**: Add Import/Export buttons, adjust layout
3. **Update toolbar**: Move search to left, add Columns/Filters to right
4. **Update table row**: Remove inline action buttons, keep only context menu
5. **Update pagination**: Replace hardcoded options with constant
6. **Test**: Verify all functionality works after changes

## Examples in Codebase

Reference these pages for implementation examples:

- `/src/sections/products/view/product-list-view.tsx` - Product List (with filters)
- `/src/sections/machine/view/machine-view.tsx` - Machine List (with tabs)
- `/src/sections/defect-reason/view/defect-reason-view.tsx` - Simple list
- `/src/sections/iot-device/view/iot-device-view.tsx` - Device list
- `/src/sections/working-parameter/view/working-parameter-list-view.tsx` - Parameter list

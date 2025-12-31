# Pagination State Persistence Guide

This guide explains how to implement URL-based pagination state persistence in list/table views to ensure users return to their original page when navigating back from edit pages.

## Problem Statement

When users navigate from a paginated list view (e.g., page 10) to edit an item, they should return to the same page (page 10) after saving or canceling, not page 1.

## Solution

Use URL search parameters to store pagination state (page, rowsPerPage, filters, sorting) so it persists across navigation.

## Implementation Steps

### 1. Update List View Component

**Import the hook:**
```typescript
import { usePaginationParams } from 'src/hooks';
```

**Replace local state with URL params:**
```typescript
// OLD: Local state
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(5);
const [filterName, setFilterName] = useState('');
const [orderBy, setOrderBy] = useState('name');
const [order, setOrder] = useState<'asc' | 'desc'>('asc');

// NEW: URL-based state
const { params, setParams, getUrlWithParams } = usePaginationParams({
  defaultPage: 0,
  defaultRowsPerPage: 5,
  defaultOrderBy: 'name',
  defaultOrder: 'asc',
});
```

**Update data fetching:**
```typescript
// Use params.page, params.rowsPerPage, params.orderBy, params.order, params.filterName
useEffect(() => {
  setIsLoading(true);
  fetchData({
    data: [{ sortBy: params.orderBy, descending: params.order === 'desc' }],
    params: {
      pageNumber: params.page,
      pageSize: params.rowsPerPage,
      searchTerm: params.filterName || undefined,
    },
  });
}, [params.page, params.rowsPerPage, params.orderBy, params.order, params.filterName]);
```

**Update event handlers:**
```typescript
// Sort handler
const handleSort = useCallback(
  (id: string) => {
    const isAsc = params.orderBy === id && params.order === 'asc';
    setParams({
      order: isAsc ? 'desc' : 'asc',
      orderBy: id,
    });
  },
  [params.orderBy, params.order, setParams]
);

// Page change handler
const handleChangePage = useCallback(
  (_event: unknown, newPage: number) => {
    setParams({ page: newPage });
  },
  [setParams]
);

// Rows per page handler
const handleChangeRowsPerPage = useCallback(
  (event: React.ChangeEvent<HTMLInputElement>) => {
    setParams({
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
  },
  [setParams]
);

// Filter handler
const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
  setParams({ filterName: event.target.value, page: 0 });
};
```

**Update table component props:**
```typescript
<TableHead
  order={params.order}
  orderBy={params.orderBy}
  onSort={handleSort}
  // ...
/>

<TablePagination
  page={params.page}
  count={totalItems}
  rowsPerPage={params.rowsPerPage}
  onPageChange={handleChangePage}
  onRowsPerPageChange={handleChangeRowsPerPage}
/>
```

**Pass returnUrl to table rows:**
```typescript
{items.map((row) => (
  <EntityTableRow
    key={row.id}
    row={row}
    onDeleteRow={() => handleDeleteRow(row.id)}
    returnUrl={getUrlWithParams('/entity-list-path')}
  />
))}
```

### 2. Update Table Row Component

**Add returnUrl prop:**
```typescript
type EntityTableRowProps = {
  row: EntityProps;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow?: () => void;
  returnUrl?: string; // Add this
};

export function EntityTableRow({ 
  row, 
  selected, 
  onSelectRow, 
  onDeleteRow,
  returnUrl // Add this
}: EntityTableRowProps) {
```

**Update edit navigation:**
```typescript
const handleEditRow = useCallback(() => {
  const editUrl = `/entity/${row.id}/edit`;
  const urlWithReturn = returnUrl 
    ? `${editUrl}?returnUrl=${encodeURIComponent(returnUrl)}` 
    : editUrl;
  router.push(urlWithReturn);
}, [router, row.id, returnUrl]);
```

### 3. Update Create/Edit View Component

**Import useSearchParams:**
```typescript
import { useSearchParams } from 'react-router-dom';
```

**Get returnUrl from query params:**
```typescript
export function EntityCreateEditView({ isEdit = false }: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/default-list-path';
```

**Navigate to returnUrl on success/cancel:**
```typescript
const { mutate: createEntity, isPending: isCreating } = useCreateEntity({
  onSuccess: (result) => {
    setValidationResult(result);
    if (isValidationSuccess(result)) {
      navigate(returnUrl); // Use returnUrl instead of hardcoded path
    }
  },
});

const handleCancel = useCallback(() => {
  navigate(returnUrl);
}, [navigate, returnUrl]);
```

## Pages Already Implemented

- ✅ Unit (list, create, edit)
- ✅ Area (list, create, edit)

## Pages Pending Implementation

The following pages need this pattern applied:
- [ ] Unit Group
- [ ] Unit Conversion
- [ ] Product Category
- [ ] Product
- [ ] Machine Type
- [ ] Machine
- [ ] IoT Device
- [ ] IoT Sensor
- [ ] Shift Template
- [ ] Calendar
- [ ] Stop Machine Reason
- [ ] Stop Machine Reason Group
- [ ] Defect Reason
- [ ] Defect Reason Group
- [ ] Time Block Name
- [ ] Working Parameter
- [ ] Role

## Benefits

1. **Better UX**: Users don't lose their place when editing items
2. **Browser Back Button**: Works correctly with browser navigation
3. **Bookmarkable**: Users can bookmark specific pages with filters
4. **Shareable**: URLs can be shared with others to show specific views
5. **State Persistence**: Survives page refreshes

## Testing Checklist

When implementing this pattern, test:
- [ ] Navigate to page 5, edit an item, save → returns to page 5
- [ ] Navigate to page 5, edit an item, cancel → returns to page 5
- [ ] Apply filters, edit an item, save → filters are preserved
- [ ] Change sort order, edit an item, save → sort order is preserved
- [ ] Switch tabs (if applicable), edit an item, save → tab is preserved
- [ ] Browser back button works correctly
- [ ] Direct URL access works (e.g., `/units?page=5&rowsPerPage=10`)
- [ ] URL without params works (defaults to page 0)

## Common Pitfalls

1. **Import Order**: Ensure `react-router-dom` imports come before `react` imports (linter rule)
2. **Encoding**: Always use `encodeURIComponent()` when adding returnUrl to query params
3. **Default Values**: Provide sensible defaults in `usePaginationParams()`
4. **Tab State**: For tabbed views, use `params.currentTab` and handle 'all' as default
5. **Dependency Arrays**: Include all params in useEffect dependency array

## Example Implementation

See complete examples in:
- `src/sections/unit/view/unit-list-view.tsx`
- `src/sections/unit/unit-table-row.tsx`
- `src/sections/unit/view/unit-create-edit-view.tsx`
- `src/sections/area/view/area-view.tsx`
- `src/sections/area/area-table-row.tsx`
- `src/sections/area/view/area-create-edit-view.tsx`

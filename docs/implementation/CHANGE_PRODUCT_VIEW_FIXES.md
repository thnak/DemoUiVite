# Change Product View - API Type Fixes and Feature Enhancements

## Overview
Fixed the `change-product-view.tsx` component to correctly use the paginated API response type and added search/pagination functionality as requested.

## Problem Statement
The original implementation had several issues:
1. **Incorrect API Response Type**: Expected `AvailableProductDto[]` but API returns `ProductWorkingStateByMachineBasePaginationResponse`
2. **Missing Search**: No way to filter products
3. **Missing Pagination**: All products loaded at once without pagination support

## Solution

### 1. API Service Layer Updates (`machine-custom.ts`)

#### Before:
```typescript
export async function getAvailableProducts(machineId: ObjectId): Promise<AvailableProductDto[]> {
  const response = await axiosInstance.get<AvailableProductDto[]>(`/api/Machine/${machineId}/available-products`);
  return response.data;
}
```

#### After:
```typescript
export type GetAvailableProductsParams = {
  searchTerm?: string;
  page?: number;
  pageSize?: number;
};

export async function getAvailableProducts(
  machineId: ObjectId,
  params?: GetAvailableProductsParams
): Promise<ProductWorkingStateByMachineBasePaginationResponse> {
  const response = await axiosInstance.get<ProductWorkingStateByMachineBasePaginationResponse>(
    `/api/Machine/${machineId}/available-products`,
    { params }
  );
  return response.data;
}
```

**Key Changes:**
- Updated return type to match actual API response
- Added optional parameters for search and pagination
- Marked old `AvailableProductDto` as deprecated

### 2. Component Updates (`change-product-view.tsx`)

#### Type Changes:
```typescript
// Before
const [availableProducts, setAvailableProducts] = useState<AvailableProductDto[]>([]);
const [selectedProductDto, setSelectedProductDto] = useState<AvailableProductDto | null>(null);

// After
const [availableProducts, setAvailableProducts] = useState<ProductWorkingStateByMachine[]>([]);
const [selectedProductDto, setSelectedProductDto] = useState<ProductWorkingStateByMachine | null>(null);
const [searchTerm, setSearchTerm] = useState('');
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);
const [totalItems, setTotalItems] = useState(0);
```

#### Data Loading:
```typescript
const loadAvailableProducts = async () => {
  if (!selectedMachine?.id) return;

  setLoading(true);
  try {
    const params: GetAvailableProductsParams = {
      page: page + 1, // API uses 1-based pagination
      pageSize: rowsPerPage,
    };
    
    if (searchTerm) {
      params.searchTerm = searchTerm;
    }

    const response = await getAvailableProducts(selectedMachine.id, params);
    setAvailableProducts(response.items || []);
    setTotalItems(response.totalItems || 0);
  } catch (error) {
    console.error('Failed to load available products:', error);
    setAvailableProducts([]);
    setTotalItems(0);
  } finally {
    setLoading(false);
  }
};
```

#### Search Box UI:
```tsx
<Box sx={{ mb: 3 }}>
  <OutlinedInput
    fullWidth
    size="small"
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setPage(0); // Reset to first page when searching
    }}
    placeholder={t('common.search') || 'Search products...'}
    startAdornment={
      <InputAdornment position="start">
        <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
      </InputAdornment>
    }
  />
</Box>
```

#### Pagination UI:
```tsx
{totalItems > 0 && (
  <TablePagination
    component="div"
    page={page}
    count={totalItems}
    rowsPerPage={rowsPerPage}
    onPageChange={(event, newPage) => setPage(newPage)}
    rowsPerPageOptions={[...STANDARD_ROWS_PER_PAGE_OPTIONS]}
    onRowsPerPageChange={(event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    }}
  />
)}
```

#### Product Field Mapping:
Changed from nested structure to flat structure based on actual API response:

| Old Field | New Field |
|-----------|-----------|
| `productDto.product?.id` | `productDto.productId` |
| `productDto.product?.name` | `productDto.productName` |
| `productDto.product?.code` | *(removed - not in API)* |
| `productDto.workingParameter.idealCycleTime` | `productDto.idealCycleTime` |
| `productDto.workingParameter.quantityPerCycle` | `productDto.quantityPerSignal` |

## API Response Structure

### ProductWorkingStateByMachineBasePaginationResponse
```typescript
{
  items: ProductWorkingStateByMachine[] | null;
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  sortableFields: string[] | null;
}
```

### ProductWorkingStateByMachine
```typescript
{
  productId: string;
  productName: string;
  quantityPerSignal: number;
  idealCycleTime: string;        // ISO 8601 duration
  downtimeThreshold: string;     // ISO 8601 duration
  speedLossThreshold: string;    // ISO 8601 duration
}
```

## Features Implemented

### ✅ Search Functionality
- Search box with icon above product table
- Filters products by name
- Resets to page 1 when search term changes
- Shows "No results found" message for empty search results

### ✅ Pagination
- Standard TablePagination component
- Options: 5, 10, 25, 50 items per page (from `STANDARD_ROWS_PER_PAGE_OPTIONS`)
- Default: 10 items per page
- Shows total count and page navigation
- Only visible when there are products to display

### ✅ Table Improvements
- Removed "Product Code" column (not in API response)
- Simplified to 3 columns: Expand button | Product Name | Actions
- Maintains expandable specifications view
- Current product indicator preserved
- Proper loading states

## Testing Results

### Linter Check
```bash
npm run lint
```
✅ **Result**: Only warnings for unused variables in other files. No errors in changed files.

### Type Safety
- All TypeScript types properly aligned with API specification
- No `any` types used
- Proper null/undefined handling

## Migration Notes

### Breaking Changes
1. **API Response Type**: Changed from array to paginated response
   - Old: `AvailableProductDto[]`
   - New: `ProductWorkingStateByMachineBasePaginationResponse`

2. **Product Properties**: Flattened structure
   - Old: `productDto.product.name`
   - New: `productDto.productName`

### Backward Compatibility
- `AvailableProductDto` type marked as `@deprecated` but still available
- No changes required to other components

## Future Enhancements

1. **Debounce Search**: Add debouncing to search input to reduce API calls
2. **Sort Functionality**: Add column sorting capabilities
3. **Current Product API**: Integrate machine status API to show actual current product
4. **Cache Strategy**: Implement query caching for better performance
5. **Export Feature**: Add ability to export product list

## Related Files Modified

1. `src/api/services/machine-custom.ts` - API service layer
2. `src/sections/oi/change-product/view/change-product-view.tsx` - Main component

## Documentation References

- API Specification: `docs/api/response.json`
- Standards: `docs/copilot-instructions.md`
- Similar Implementation: `src/sections/area/view/area-view.tsx`

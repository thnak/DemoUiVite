# Selector Query Key Fix

## Problem

Generated selector components were using TanStack Query hooks with static query keys that didn't include query parameters. This caused the following issues:

1. When a user typed in a selector search field, the debounced search text would change
2. The hook would be called with new parameters (e.g., `searchText: "abc"`)
3. But the query key remained the same (e.g., `['area', 'searchArea']`)
4. TanStack Query would return cached results instead of fetching new data
5. Users would see stale or incorrect search results

## Solution

The fix modifies the API code generator to include query parameters in the query keys:

### Before (Broken)

```typescript
// Query key definition
export const areaKeys = {
  searchArea: ['area', 'searchArea'] as const,  // Static key
};

// Hook usage
export function useSearchArea(
  params?: { searchText?: string; maxResults?: number },
  options?: ...
) {
  return useQuery({
    queryKey: areaKeys.searchArea,  // Same key for all searches
    queryFn: () => searchArea(params),
    ...options,
  });
}
```

**Problem**: All searches use the same query key, so TanStack Query returns cached data.

### After (Fixed)

```typescript
// Query key definition
export const areaKeys = {
  searchArea: (params?: { searchText?: string; maxResults?: number }) => 
    ['area', 'searchArea', params] as const,  // Dynamic key based on params
};

// Hook usage
export function useSearchArea(
  params?: { searchText?: string; maxResults?: number },
  options?: ...
) {
  return useQuery({
    queryKey: areaKeys.searchArea(params),  // Different key for different params
    queryFn: () => searchArea(params),
    ...options,
  });
}
```

**Solution**: Query keys now include the params object, so TanStack Query recognizes different searches and fetches fresh data.

## How It Works

When a user types in a selector:

1. User types "A" → `searchText: "A"` → Query key: `['area', 'searchArea', { searchText: "A", maxResults: 10 }]`
2. User types "AB" → `searchText: "AB"` → Query key: `['area', 'searchArea', { searchText: "AB", maxResults: 10 }]`
3. User types "ABC" → `searchText: "ABC"` → Query key: `['area', 'searchArea', { searchText: "ABC", maxResults: 10 }]`

Each query key is different, so TanStack Query performs a new API call each time.

## Code Changes

The fix was implemented in `/scripts/generate-api.ts`:

1. **Query key definitions** (lines 519-558): Now accept query params as function arguments
2. **Query key usage** (lines 587-598): Now pass query params to the key function

All generated hooks with query parameters now benefit from this fix, including:
- Search hooks (e.g., `useSearchArea`, `useSearchProduct`)
- Hooks with filters (e.g., `useGetMachinePage` with search terms)
- Any other hooks that use query parameters

## Files Modified

- `/scripts/generate-api.ts` - Core generator logic
- `/scripts/generate-entity-selectors.ts` - Fixed import ordering
- All generated API hooks (auto-regenerated)
- All generated selector components (auto-regenerated)

## Testing

To verify the fix works:

1. Open any create/edit form that uses a selector (e.g., Machine Create)
2. Open browser DevTools → Network tab
3. Type in a selector search field
4. Observe that API requests are made with each search text change
5. Verify results update correctly

## Related Issues

This fix ensures that:
- Selectors always show current search results
- No stale data is returned from cache
- TanStack Query cache invalidation works correctly
- Search functionality behaves as expected

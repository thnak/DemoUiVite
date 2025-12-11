# Machine Type Management

This document describes the machine type management feature implementation.

## Overview

The machine type management system provides a complete CRUD interface for managing machine types. Machine types can be assigned to machines to categorize them by function and characteristics.

## Features

### 1. Machine Type List Page
- **Route**: `/machine-types`
- **File**: `src/pages/machine-type-list.tsx`
- View all machine types in a paginated table
- Search by name, code, or description
- Quick actions: Edit, Delete
- Add new machine type button

### 2. Create Machine Type Page
- **Route**: `/machine-types/create`
- **File**: `src/pages/machine-type-create.tsx`
- Form fields:
  - Code (optional)
  - Name (required)
  - Description (optional)

### 3. Edit Machine Type Page
- **Route**: `/machine-types/:id/edit`
- **File**: `src/pages/machine-type-edit.tsx`
- Pre-filled form with existing data
- Same fields as create page

### 4. Machine Type Selector
- **File**: `src/components/selectors/machine-type-selector.tsx`
- Used in machine create/edit forms
- Searchable dropdown with debouncing (500ms)
- Loads up to 10 results per search

## API Integration

The implementation uses the generated API hooks from the MachineType endpoints:

```typescript
// Generated hooks from use-machine-type.ts
useGetMachineTypeById()      // Fetch single machine type
useGetMachineTypePage()      // Fetch paginated list with search
useCreateMachineType()       // Create new machine type
useUpdateMachineType()       // Update existing machine type
useDeleteMachineType()       // Delete machine type
```

### API Endpoints Used

From `MACHINE_TYPE_ENDPOINTS`:
- `GET /api/machinetype/{id}` - Get by ID
- `POST /api/machinetype/get-page` - Paginated list with search
- `POST /api/machinetype/create` - Create new
- `POST /api/machinetype/update/{id}` - Update existing
- `DELETE /api/machinetype/delete/{id}` - Delete

## Machine Integration

The machine create/edit form now includes a machine type field:

```typescript
interface MachineFormData {
  code: string;
  name: string;
  imageUrl: string;
  areaId: string | null;
  calendarId: string | null;
  machineTypeId: string | null;  // New field
  calculationMode: OutputCalculationMode;
}
```

### Machine Form Updates
1. Added `MachineTypeSelector` component
2. Added `machineTypeId` to form data
3. Updated create/update API calls to include `machineTypeId`
4. Updated machine edit page to load existing `machineTypeId`

## Component Structure

```
src/sections/machine-type/
├── view/
│   ├── machine-type-view.tsx              # List view
│   ├── machine-type-create-edit-view.tsx  # Form view
│   └── index.ts
├── machine-type-table-row.tsx             # Table row component
├── machine-type-table-head.tsx            # Table header
├── machine-type-table-toolbar.tsx         # Search toolbar
├── machine-type-table-no-data.tsx         # Empty state
├── machine-type-table-empty-rows.tsx      # Row padding
└── machine-type-utils.ts                  # Helper functions
```

## Usage Examples

### Creating a Machine Type

1. Navigate to `/machine-types`
2. Click "Add machine type" button
3. Fill in the form:
   - Code: `TYPE-001` (optional)
   - Name: `CNC Machine` (required)
   - Description: `Computer Numerical Control machines`
4. Click "Create machine type"

### Assigning Machine Type to Machine

1. Navigate to `/machines/create` or `/machines/:id/edit`
2. Scroll to the left sidebar
3. Select a machine type from the "Machine Type" dropdown
4. Save the machine

### Searching Machine Types

1. Navigate to `/machine-types`
2. Type in the search box
3. Results automatically filter after 500ms

## Pagination

- Default: 50 items per page
- Options: 5, 10, 25, 50, 100 items per page
- Server-side pagination using the API

## Validation

- Machine type name is required
- Code and description are optional
- Error messages display at the top-right corner

## UI/UX Features

- Consistent design with other entity pages (Area, Calendar, etc.)
- Breadcrumb navigation
- Loading states with circular progress indicators
- Empty states for "no data" scenarios
- Confirmation dialogs for delete actions (browser native)
- Toast notifications for errors

## Technical Implementation

### Theme Compliance
- Uses semantic theme tokens (e.g., `background.paper`, `text.primary`)
- Supports light and dark modes automatically
- No hardcoded colors

### Performance
- Debounced search (500ms)
- Pagination to limit data transfer
- Optimized re-renders with `useCallback` and `useMemo`

### Type Safety
- Full TypeScript typing
- Uses generated types from OpenAPI schema
- Proper type checking for API responses

## Testing Considerations

When testing this feature:

1. **Create**: Verify machine types can be created with all field combinations
2. **Read**: Verify list displays correctly with pagination and search
3. **Update**: Verify edits save correctly
4. **Delete**: Verify deletion works and removes from list
5. **Search**: Test search with various inputs
6. **Integration**: Verify machine type appears in machine form selector
7. **Validation**: Test required field validation
8. **Error Handling**: Test with API errors

## Future Enhancements

Possible improvements:
- Bulk delete functionality
- Import/Export machine types
- Machine type categories
- Icon/image support for machine types
- Usage statistics (how many machines use each type)
- Soft delete instead of hard delete

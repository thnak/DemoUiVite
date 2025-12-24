# Role Management Pages Implementation

## Overview
This document describes the implementation of role management pages for the DemoUiVite application.

## Requirement
Create role management pages at `/roles` with:
- List view displaying name and description
- Create and edit pages
- API endpoint: `/api/role/get-page`

## Implementation Details

### Directory Structure
```
src/
├── sections/role/
│   ├── role-utils.ts                    # Utility functions for table operations
│   ├── role-table-head.tsx              # Table header with sorting
│   ├── role-table-row.tsx               # Table row with actions menu
│   ├── role-table-toolbar.tsx           # Search and filter toolbar
│   ├── role-table-no-data.tsx           # Empty state component
│   ├── role-table-empty-rows.tsx        # Empty rows spacer
│   └── view/
│       ├── index.ts                     # Export views
│       ├── role-list-view.tsx           # Main list page component
│       └── role-create-edit-view.tsx    # Create/edit form component
└── pages/
    ├── role-list.tsx                    # List page route
    ├── role-create.tsx                  # Create page route
    └── role-edit.tsx                    # Edit page route
```

### Routes
The following routes have been added to `src/routes/sections.tsx`:

- `/roles` - List all roles
- `/roles/create` - Create new role
- `/roles/:id/edit` - Edit existing role

### Components

#### 1. Role List View (`role-list-view.tsx`)
**Features:**
- Displays roles in a paginated table
- Shows Name and Description columns
- Search functionality in toolbar
- Import/Export buttons (UI only)
- "Add role" button to navigate to create page
- Checkbox selection
- Delete confirmation dialog
- Loading state with spinner

**API Integration:**
- Uses `useGetRolePage` hook for fetching paginated data
- Uses `useDeleteRole` hook for deletion
- Automatic refetch after delete
- Query invalidation for cache management

#### 2. Role Create/Edit View (`role-create-edit-view.tsx`)
**Features:**
- Form with Name and Description fields
- Validation using `useValidationResult` hook
- Loading state during submission
- Error handling with Snackbar
- Cancel button to return to list
- Save button with loading spinner

**API Integration:**
- Uses `useCreateRole` hook for creating new roles
- Uses `useUpdateRole` hook for editing existing roles
- Field-level validation error display

#### 3. Role Table Row (`role-table-row.tsx`)
**Features:**
- Displays role name and description
- Checkbox for selection
- Actions menu (popover) with:
  - Edit option - navigates to edit page
  - Delete option - triggers delete confirmation

#### 4. Role Table Toolbar (`role-table-toolbar.tsx`)
**Features:**
- Search input with icon
- Selection counter when items selected
- Columns and Filters buttons (UI only)
- Delete button when items selected

### Data Model
```typescript
export type RoleProps = {
  id: string;
  name: string;
  description: string;
};
```

### API Endpoints Used
All API calls use the generated hooks from `src/api/hooks/generated/use-role.ts`:

- `GET /api/role/{id}` - Get role by ID
- `POST /api/role/get-page` - Get paginated list of roles
- `POST /api/role/create` - Create new role
- `POST /api/role/update/{id}` - Update existing role
- `DELETE /api/role/delete/{id}` - Delete role

### Pattern Consistency
The implementation follows the same pattern as the Area management pages:
- Same component structure
- Same naming conventions
- Same layout and styling
- Same user interaction patterns
- Same validation approach

## Usage

### Viewing Roles
1. Navigate to `/roles`
2. View list of all roles with name and description
3. Use search bar to filter roles
4. Click on pagination controls to navigate pages

### Creating a Role
1. Click "Add role" button on the list page
2. Fill in Name and Description fields
3. Click "Create role" to submit
4. Redirected to list page on success

### Editing a Role
1. Click the three-dot menu icon on a role row
2. Select "Edit" from the menu
3. Update Name and/or Description fields
4. Click "Save changes" to submit
5. Redirected to list page on success

### Deleting a Role
1. Click the three-dot menu icon on a role row
2. Select "Delete" from the menu
3. Confirm deletion in the dialog
4. Role is removed and list is refreshed

## Testing
The implementation has been verified with:
- ✅ TypeScript compilation (no errors)
- ✅ ESLint validation (no warnings)
- ✅ Build process (successful)
- ✅ Route configuration (properly registered)
- ✅ API integration (correct hooks used)

## Notes
- All components use Material-UI for consistent styling
- Theme system integration for dark mode support
- Responsive design with Grid layout
- Error handling with user-friendly messages
- Loading states for all async operations

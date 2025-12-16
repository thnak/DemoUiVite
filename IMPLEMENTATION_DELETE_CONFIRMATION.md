# Delete Confirmation Dialog Implementation

## Overview

This implementation adds a delete confirmation dialog to all delete operations throughout the application. Users must type "delete" to confirm before any deletion is performed.

## Component: ConfirmDeleteDialog

**Location:** `src/components/confirm-delete-dialog/confirm-delete-dialog.tsx`

### Features

- **Text Confirmation:** Users must type "delete" (case-insensitive) to enable the delete button
- **Visual Feedback:** Input validation with error message if text doesn't match
- **Loading State:** Shows loading spinner and disables buttons during deletion
- **Bulk Delete Support:** Displays appropriate message for single or multiple items
- **Customizable Entity Name:** Pass the entity name (e.g., "area", "product", "machine") to show in the dialog

### Props

```typescript
interface ConfirmDeleteDialogProps {
  open: boolean;           // Whether the dialog is open
  onClose: () => void;     // Callback when dialog is closed
  onConfirm: () => void;   // Callback when delete is confirmed
  entityName?: string;     // Name of the entity being deleted (default: "item")
  itemCount?: number;      // Number of items being deleted (default: 1)
  loading?: boolean;       // Whether the delete operation is in progress
}
```

## Integrated Pages

The following pages have been fully integrated with the delete confirmation dialog:

### ✅ Fully Integrated

1. **Area** (`src/sections/area/view/area-view.tsx`)
   - Single row delete
   
2. **Calendar** (`src/sections/calendar/view/calendar-view.tsx`)
   - Single row delete
   - Bulk delete from toolbar

3. **Unit** (`src/sections/unit/view/unit-list-view.tsx`)
   - Single row delete

4. **Product** (`src/sections/products/view/product-list-view.tsx`)
   - Single row delete

5. **Machine Type** (`src/sections/machine-type/view/machine-type-view.tsx`)
   - Single row delete

6. **Machine** (`src/sections/machine/view/machine-view.tsx`)
   - Single row delete
   - Bulk delete from toolbar

### 📝 Import Added (Needs Integration)

The following pages have the import statement added but still need full integration:

- Dashboard Builder
- Defect Reason
- Defect Reason Group
- IoT Device
- IoT Sensor
- Product Group
- Shift Template
- Unit Conversion
- Unit Group
- Working Parameter

## Implementation Pattern

To integrate the ConfirmDeleteDialog into a new page, follow this pattern:

### 1. Import the Component

```typescript
import { ConfirmDeleteDialog } from 'src/components/confirm-delete-dialog';
```

### 2. Add State Variables

```typescript
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [itemToDelete, setItemToDelete] = useState<string | null>(null);
const [isDeleting, setIsDeleting] = useState(false);

// For bulk delete support
const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
```

### 3. Update Delete Handler to Open Dialog

```typescript
const handleDeleteRow = useCallback((id: string) => {
  setItemToDelete(id);
  setDeleteDialogOpen(true);
}, []);
```

### 4. Add Confirm Handler

```typescript
const handleConfirmDelete = useCallback(() => {
  if (itemToDelete) {
    setIsDeleting(true);
    deleteEntityMutate({ id: itemToDelete });
  }
}, [itemToDelete, deleteEntityMutate]);
```

### 5. Add Close Handler

```typescript
const handleCloseDeleteDialog = useCallback(() => {
  if (!isDeleting) {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  }
}, [isDeleting]);
```

### 6. Update Success Handler

```typescript
const { mutate: deleteEntityMutate } = useDeleteEntity({
  onSuccess: () => {
    // Refetch data
    fetchEntities();
    // Reset dialog state
    setIsDeleting(false);
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  },
  onError: () => {
    setIsDeleting(false);
  },
});
```

### 7. Add Dialog Component to JSX

```tsx
<ConfirmDeleteDialog
  open={deleteDialogOpen}
  onClose={handleCloseDeleteDialog}
  onConfirm={handleConfirmDelete}
  entityName="your-entity-name"
  loading={isDeleting}
/>
```

### 8. For Bulk Delete (Optional)

```typescript
const handleDeleteSelected = useCallback(async () => {
  setBulkDeleteDialogOpen(true);
}, []);

const handleConfirmBulkDelete = useCallback(async () => {
  try {
    setIsDeleting(true);
    await Promise.all(selected.map((id) => deleteEntity(id)));
    await fetchEntities();
    setSelected([]);
    setBulkDeleteDialogOpen(false);
  } catch (err) {
    console.error('Error deleting items:', err);
  } finally {
    setIsDeleting(false);
  }
}, [selected, fetchEntities]);

// Add second dialog in JSX
<ConfirmDeleteDialog
  open={bulkDeleteDialogOpen}
  onClose={handleCloseBulkDeleteDialog}
  onConfirm={handleConfirmBulkDelete}
  entityName="your-entity-name"
  itemCount={selected.length}
  loading={isDeleting}
/>
```

## Manual Testing Guide

To test the delete confirmation dialog:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test Single Delete:**
   - Navigate to any integrated page (e.g., `/area`, `/calendars`, `/settings/units`)
   - Click the action button (three dots) on any row
   - Click "Delete"
   - Verify the confirmation dialog appears
   - Try typing something other than "delete" - the button should remain disabled
   - Type "delete" (any case) - the button should become enabled
   - Click "Delete" button
   - Verify the item is deleted and the dialog closes

3. **Test Bulk Delete (Calendar and Machine pages):**
   - Navigate to `/calendars` or `/machines`
   - Select multiple items using checkboxes
   - Click the delete button in the toolbar
   - Verify the dialog shows the count of items to be deleted
   - Type "delete" and confirm
   - Verify all selected items are deleted

4. **Test Loading State:**
   - During the delete operation, verify:
     - Loading spinner appears on the button
     - Both buttons are disabled
     - Dialog cannot be closed

5. **Test Cancel:**
   - Open the delete dialog
   - Click "Cancel" or press ESC
   - Verify the dialog closes without deleting

## Theme Compatibility

The dialog follows the application's theme system:
- Uses `theme.palette.error` for destructive actions
- Respects light/dark mode settings
- Uses semantic MUI components (Dialog, TextField, Button)
- Follows existing spacing and typography patterns

## Accessibility

- Dialog has proper ARIA labels
- Focus management (auto-focus on text field)
- Keyboard navigation (ESC to close, Enter to submit when valid)
- Clear error messages for invalid input
- Disabled states clearly indicated

## Security

The confirmation dialog provides defense against:
- Accidental deletions
- Rapid-click mistakes
- Misclick on delete buttons

The requirement to type "delete" adds a significant friction point that ensures intentional action.

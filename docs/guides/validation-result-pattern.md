# ValidationResult Pattern Update Guide

This guide documents the changes needed to update create/edit views to use the new ValidationResult pattern.

## Overview

The API now returns `ValidationResult` objects for create/update/delete operations that include:
- `isValid` (boolean) - Whether validation was successful
- `message` (string) - Overall error message
- `errors` (Record<string, ValidationError>) - Field-level errors

## Files Updated

### Utilities
- `src/utils/validation-result.ts` - Utility functions for working with ValidationResult
- `src/hooks/use-validation-result.ts` - React hook for managing ValidationResult in forms

### Views Updated
- ✅ `src/sections/machine/view/machine-create-edit-view.tsx`
- ✅ `src/sections/machine/view/machine-view.tsx` (delete operations)
- ✅ `src/sections/area/view/area-create-edit-view.tsx`

### Views Remaining
- `src/sections/calendar/view/calendar-create-edit-view.tsx`
- `src/sections/shift-template/view/shift-template-create-edit-view.tsx`
- `src/sections/iot-device/view/iot-device-create-edit-view.tsx`
- `src/sections/iot-sensor/view/iot-sensor-create-edit-view.tsx`
- `src/sections/defect-reason/view/defect-reason-create-edit-view.tsx`
- `src/sections/defect-reason-group/view/defect-reason-group-create-edit-view.tsx`
- `src/sections/machine-type/view/machine-type-create-edit-view.tsx`

## Update Pattern

### 1. Add Imports

```tsx
import { useValidationResult } from 'src/hooks/use-validation-result';
import { isValidationSuccess } from 'src/utils/validation-result';
```

### 2. Add useValidationResult Hook

```tsx
const {
  setValidationResult,
  clearValidationResult,
  getFieldErrorMessage,
  hasError,
  clearFieldError,
  overallMessage,
} = useValidationResult();
```

### 3. Update Mutation Callbacks

Replace:
```tsx
onSuccess: (result) => {
  if (result.isSuccess) {
    router.push('/path');
  } else {
    setErrorMessage(result.message || 'Failed...');
  }
}
```

With:
```tsx
onSuccess: (result) => {
  setValidationResult(result);
  if (isValidationSuccess(result)) {
    router.push('/path');
  } else {
    if (result.message) {
      setErrorMessage(result.message);
    }
  }
}
```

### 4. Update Input Handlers

Add `clearFieldError` to change handlers:

```tsx
const handleInputChange = useCallback(
  (field: keyof FormData) => (event: ChangeEvent<...>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    clearFieldError(field); // Add this line
  },
  [clearFieldError] // Add dependency
);
```

### 5. Update Submit Handler

Add validation clearing at the start:

```tsx
const handleSubmit = useCallback(() => {
  clearValidationResult(); // Add this
  setErrorMessage(null); // Add this
  
  // ... rest of submit logic
}, [..., clearValidationResult]); // Add dependency
```

### 6. Update TextField Components

Add error and helperText props:

```tsx
<TextField
  fullWidth
  label="Field name"
  value={formData.field}
  onChange={handleInputChange('field')}
  error={hasError('field')} // Add this
  helperText={getFieldErrorMessage('field')} // Add this
/>
```

### 7. Update Snackbar

Show both errorMessage and overallMessage:

```tsx
<Snackbar
  open={!!(errorMessage || overallMessage)} // Update condition
  autoHideDuration={6000}
  onClose={handleCloseError}
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
>
  <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
    {errorMessage || overallMessage} // Update message
  </Alert>
</Snackbar>
```

## Delete Operations

For delete operations in list views:

```tsx
import { isValidationSuccess } from 'src/utils/validation-result';

const handleDelete = async (id: string) => {
  try {
    const result = await deleteEntity(id);
    
    if (isValidationSuccess(result)) {
      // Success - refresh list
      await fetchEntities();
    } else {
      // Show error from validation result
      const errorMsg = result.message || 'Failed to delete';
      setError(errorMsg);
    }
  } catch (err) {
    console.error('Error:', err);
    setError('Failed to delete');
  }
};
```

## Benefits

1. **Field-level errors**: Users see errors next to the specific fields that have issues
2. **Better UX**: No need to scroll to find which field has an error
3. **Consistent pattern**: All CRUD operations follow the same error handling pattern
4. **Type-safe**: TypeScript ensures correct usage of ValidationResult types
5. **Reusable**: Hook and utilities can be used across all forms

## Testing

After updating a view:
1. Test successful create/update/delete operations
2. Test validation errors (empty required fields, invalid data)
3. Test network errors
4. Verify field errors display correctly
5. Verify overall message displays in snackbar
6. Verify errors clear when user edits fields

# ShiftTemplateAutocomplete Component

An asynchronous autocomplete component for selecting `ShiftTemplateEntity` instances, leveraging the `searchShiftTemplate` API function.

## Overview

This component provides a user-friendly interface for searching and selecting shift templates. It implements the MUI async autocomplete pattern with:

- Debounced API calls to minimize unnecessary requests
- Loading indicators during API calls
- Error handling with user feedback
- Reset options on close or when input is cleared

## Installation

The component is located at `src/components/shift-template-autocomplete`.

## Usage

```tsx
import { useState } from 'react';
import { ShiftTemplateAutocomplete } from 'src/components/shift-template-autocomplete';
import type { ShiftTemplateEntity } from 'src/api/types';

function MyComponent() {
  const [selectedTemplate, setSelectedTemplate] = useState<ShiftTemplateEntity | null>(null);

  return (
    <ShiftTemplateAutocomplete
      value={selectedTemplate}
      onChange={setSelectedTemplate}
      label="Select Shift Template"
      placeholder="Type to search..."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `ShiftTemplateEntity \| null` | **Required** | The currently selected value |
| `onChange` | `(value: ShiftTemplateEntity \| null) => void` | **Required** | Callback fired when the value changes |
| `label` | `string` | `'Shift Template'` | Text field label |
| `placeholder` | `string` | `'Search shift templates...'` | Text field placeholder |
| `disabled` | `boolean` | `false` | Whether the input is disabled |
| `required` | `boolean` | `false` | Whether the field is required |
| `error` | `boolean` | `false` | Error state |
| `helperText` | `string` | `undefined` | Helper text to display below the field |
| `debounceMs` | `number` | `300` | Debounce delay in milliseconds |

## Features

### Async Loading

The component fetches shift templates from the API as the user types. The search is debounced (default 300ms) to prevent excessive API calls.

### Loading Indicator

A circular progress indicator is displayed while the API request is in progress.

### Error Handling

If an API request fails, an error message is displayed below the input field. The error is cleared when the user closes the dropdown or starts typing again.

### Option Display

Each option displays:
- **Code** (in bold): The shift template code
- **Name**: The shift template name (if available)

Example: **ST001** - Morning Shift

### Selection Comparison

Options are compared by their `id` field to determine equality.

## API Integration

The component uses the `searchShiftTemplate` function from `src/api/services`, which accepts:

- `searchText`: The search query string
- `maxResults`: (optional) Maximum number of results to return

## Examples

### Basic Usage

```tsx
<ShiftTemplateAutocomplete
  value={value}
  onChange={setValue}
/>
```

### With Custom Label and Placeholder

```tsx
<ShiftTemplateAutocomplete
  value={value}
  onChange={setValue}
  label="Work Schedule"
  placeholder="Search work schedules..."
/>
```

### Required Field with Error State

```tsx
<ShiftTemplateAutocomplete
  value={value}
  onChange={setValue}
  required
  error={!value}
  helperText={!value ? 'Please select a shift template' : undefined}
/>
```

### Custom Debounce Delay

```tsx
<ShiftTemplateAutocomplete
  value={value}
  onChange={setValue}
  debounceMs={500}
/>
```

## Related

- [MUI Autocomplete Documentation](https://mui.com/material-ui/react-autocomplete/)
- [Asynchronous Requests](https://mui.com/material-ui/react-autocomplete/#asynchronous-requests)
- [Search API Reference](../api/endpoints.md)

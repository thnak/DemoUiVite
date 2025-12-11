# Entity Autocomplete Selectors

This guide explains how to use the auto-generated entity autocomplete selector components.

## Overview

Entity autocomplete selectors are reusable React components that provide search functionality for entities with search endpoints in the API. These components automatically query the API as users type and display matching results in a dropdown.

## Available Selectors

The following entity selectors are auto-generated from the API specification:

- `AreaSelector`
- `CalendarSelector`
- `DefectReasonSelector`
- `DefectReasonGroupSelector`
- `DepartmentSelector`
- `InformationBaseSelector`
- `InformationDecoratorBaseSelector`
- `IoTDeviceSelector`
- `IoTDeviceGroupSelector`
- `IoTDeviceModelSelector`
- `IoTSensorSelector`
- `MachineSelector`
- `MachineGroupSelector`
- `ManufacturerSelector`
- `OperationSelector`
- `ProductSelector`
- `ProductCategorySelector`
- `ScriptDefinitionSelector`
- `ScriptVariantSelector`
- `ShiftTemplateSelector`
- `StationSelector`
- `StationGroupSelector`
- `StopMachineReasonSelector`
- `StopMachineReasonGroupSelector`
- `WebhookSelector`

## Generation

Selectors are automatically generated based on entities that have `/api/*/search` endpoints in the OpenAPI specification.

To regenerate selectors:

```bash
npm run generate:selectors
```

This command:
1. Reads the OpenAPI spec from `docs/api/response.json`
2. Identifies all entities with search endpoints
3. Generates a selector component for each entity
4. Creates an index file for easy imports

## Usage

### Basic Usage

```tsx
import { ProductSelector } from 'src/components/selectors';

function MyForm() {
  const [productId, setProductId] = useState<string | null>(null);

  return (
    <ProductSelector
      value={productId}
      onChange={setProductId}
      label="Select Product"
    />
  );
}
```

### With Form Validation

```tsx
import { ProductSelector } from 'src/components/selectors';

function MyForm() {
  const [productId, setProductId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!productId) {
      setError('Product is required');
      return;
    }
    // Submit form
  };

  return (
    <ProductSelector
      value={productId}
      onChange={(id) => {
        setProductId(id);
        setError(null);
      }}
      label="Product"
      required
      error={!!error}
      helperText={error}
    />
  );
}
```

### Multiple Selectors

```tsx
import { ProductSelector, MachineSelector, StationSelector } from 'src/components/selectors';

function ProductionForm() {
  const [productId, setProductId] = useState<string | null>(null);
  const [machineId, setMachineId] = useState<string | null>(null);
  const [stationId, setStationId] = useState<string | null>(null);

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <ProductSelector
          value={productId}
          onChange={setProductId}
          label="Product"
          required
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <MachineSelector
          value={machineId}
          onChange={setMachineId}
          label="Machine"
          required
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <StationSelector
          value={stationId}
          onChange={setStationId}
          label="Station"
        />
      </Grid>
    </Grid>
  );
}
```

## Props

All selector components accept the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| null` | `undefined` | The selected entity ID |
| `onChange` | `(id: string \| null) => void` | `undefined` | Callback fired when selection changes |
| `disabled` | `boolean` | `false` | If true, the selector is disabled |
| `label` | `string` | Entity name | Label for the input field |
| `error` | `boolean` | `false` | If true, shows error state |
| `helperText` | `string` | `undefined` | Helper text shown below the input |
| `required` | `boolean` | `false` | If true, shows required indicator |

## Features

- **Autocomplete Search**: Type to search entities in real-time
- **Debounced API Calls**: Optimized to avoid excessive API requests
- **Loading Indicator**: Shows loading spinner while fetching results
- **Type Safety**: Full TypeScript support with generated types
- **Consistent UI**: Uses MUI Autocomplete for consistent look and feel
- **Error Handling**: Built-in error and validation support

## How It Works

Each selector component:

1. Uses React Query hooks to fetch search results
2. Triggers search when user types (minimum 1 character)
3. Limits results to 10 items by default
4. Displays entity `name` or `code` in the dropdown
5. Returns the entity `id` when selected

## Architecture

```
┌──────────────────────────────────────┐
│   Entity Selector Component          │
│                                      │
│   ┌────────────────────────────┐    │
│   │  MUI Autocomplete          │    │
│   │  - User Input              │    │
│   │  - Loading State           │    │
│   │  - Dropdown Options        │    │
│   └────────────────────────────┘    │
│              ↓                       │
│   ┌────────────────────────────┐    │
│   │  React Query Hook          │    │
│   │  - useSearchEntity()       │    │
│   │  - Caching                 │    │
│   │  - Error Handling          │    │
│   └────────────────────────────┘    │
│              ↓                       │
│   ┌────────────────────────────┐    │
│   │  API Service               │    │
│   │  - /api/entity/search      │    │
│   └────────────────────────────┘    │
└──────────────────────────────────────┘
```

## Customization

If you need to customize a selector:

1. **DON'T** modify the generated files directly
2. **DO** create a wrapper component that extends the generated selector

Example:

```tsx
// src/components/custom-product-selector.tsx
import { ProductSelector, ProductSelectorProps } from 'src/components/selectors';

interface CustomProductSelectorProps extends ProductSelectorProps {
  onlyActive?: boolean;
}

export function CustomProductSelector({ 
  onlyActive, 
  ...props 
}: CustomProductSelectorProps) {
  // Add custom logic here
  return <ProductSelector {...props} />;
}
```

## Regeneration

Selectors are automatically regenerated when:

- You run `npm run generate:selectors`
- You run `npm run dev` (triggers API generation first)
- You run `npm run build` (triggers API generation first)

**Note**: The API generation must run before selector generation, as selectors depend on generated API hooks and types.

## Best Practices

1. **Use Consistent Naming**: Import selectors with their full name (e.g., `ProductSelector`)
2. **Handle Null Values**: Always handle null values in onChange callbacks
3. **Provide Labels**: Set meaningful labels for better UX
4. **Add Validation**: Use error and helperText props for form validation
5. **Consider Accessibility**: Use required prop for required fields

## Troubleshooting

### Selector not showing results

- Check that the API endpoint exists: `GET /api/{entity}/search`
- Verify the API is returning data in the correct format
- Check console for API errors

### TypeScript errors

- Run `npm run generate:api` to regenerate types
- Then run `npm run generate:selectors` to regenerate selectors

### Selector not appearing in imports

- Check that `src/components/selectors/index.ts` exports the selector
- Restart your TypeScript server
- Clear node_modules and reinstall if needed

## Related Documentation

- [API Usage Guide](./api-usage.md)
- [Component Guidelines](./components.md)
- [Theme System](../README.md#theme-system-guidelines)

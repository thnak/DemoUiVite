# API Services Documentation

This guide explains how to use the auto-generated API services, hooks, and types in the DemoUiVite project.

## Overview

The API layer is automatically generated from the OpenAPI specification located at `docs/api/response.json`. This provides type-safe API calls and React Query hooks for data fetching and mutations.

## Generation

To regenerate the API code after updating the OpenAPI specification:

```bash
npm run generate:api
```

This will generate:

- **Types**: `src/api/types/generated.ts` - TypeScript interfaces for all API entities
- **Services**: `src/api/services/generated/` - API functions for each endpoint
- **Hooks**: `src/api/hooks/generated/` - React Query hooks for each endpoint

## Project Structure

```
src/api/
├── axios-instance.ts     # Axios configuration
├── config.ts             # API base URL configuration
├── query-client.ts       # React Query client
├── index.ts              # Main exports
├── types/
│   ├── auth.ts           # Manual auth types
│   ├── generated.ts      # Auto-generated types
│   └── index.ts          # Type exports
├── services/
│   ├── auth.ts           # Manual auth service
│   ├── generated/        # Auto-generated services
│   └── index.ts          # Service exports
└── hooks/
    ├── use-auth.ts       # Manual auth hooks
    ├── generated/        # Auto-generated hooks
    └── index.ts          # Hook exports
```

## Usage Examples

### Importing Types

```tsx
import type { ProductEntity, BrandEntity, UserEntity } from 'src/api/types';
```

### Using Services Directly

For simple API calls without React Query:

```tsx
import { getBrandById, createBrand } from 'src/api/services';

// Get a brand by ID
const brand = await getBrandById('123');

// Create a new brand
const result = await createBrand({
  name: 'New Brand',
  description: 'A new brand',
});
```

### Using React Query Hooks

The recommended way to fetch and mutate data in React components:

#### Query Hooks (GET requests)

```tsx
import { useGetBrandById, useGenerateNewBrandCode } from 'src/api/hooks';

function BrandDetails({ brandId }: { brandId: string }) {
  const { data: brand, isLoading, error } = useGetBrandById(brandId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{brand?.name}</h1>
      <p>{brand?.description}</p>
    </div>
  );
}
```

#### Mutation Hooks (POST, PUT, DELETE requests)

```tsx
import { useCreateBrand, useUpdateBrand, useDeleteBrand } from 'src/api/hooks';

function BrandForm() {
  const createBrand = useCreateBrand({
    onSuccess: (result) => {
      if (result.isSuccess) {
        console.log('Brand created:', result.value);
      } else {
        console.error('Error:', result.message);
      }
    },
  });

  const handleSubmit = (data: BrandEntity) => {
    createBrand.mutate({ data });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({ name: 'New Brand' });
    }}>
      <button type="submit" disabled={createBrand.isPending}>
        {createBrand.isPending ? 'Creating...' : 'Create Brand'}
      </button>
    </form>
  );
}
```

### Pagination Example

```tsx
import { useGetProductPage } from 'src/api/hooks';

function ProductList() {
  const { data, isLoading } = useGetProductPage({
    onSuccess: (response) => {
      console.log('Total items:', response.totalItems);
      console.log('Products:', response.items);
    },
  });

  // Call the mutation with sorting and pagination params
  const handleLoadProducts = () => {
    mutate({
      data: [{ field: 'name', direction: 'asc' }],
      params: { pageNumber: 0, pageSize: 10, searchTerm: '' },
    });
  };

  return (
    <div>
      <button onClick={handleLoadProducts}>Load Products</button>
      {data?.items?.map((product) => (
        <div key={product.id?.toString()}>
          {product.name}
        </div>
      ))}
    </div>
  );
}
```

### Authentication Example

The auth module is manually written and provides additional functionality:

```tsx
import { useGenerateToken, useRefreshToken, useRevokeAllTokens } from 'src/api/hooks';

function LoginForm() {
  const { mutate: login, isPending } = useGenerateToken({
    onSuccess: (data) => {
      if (data.isSuccess && data.value) {
        localStorage.setItem('accessToken', data.value.accessToken || '');
        localStorage.setItem('refreshToken', data.value.refreshToken || '');
        // Redirect to dashboard
      }
    },
  });

  const handleLogin = (userName: string, password: string) => {
    login({ userName, password });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin('user@example.com', 'password');
    }}>
      <button type="submit" disabled={isPending}>
        {isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

## Query Keys

Each generated hook module exports query keys for cache invalidation:

```tsx
import { brandKeys, productKeys } from 'src/api/hooks';
import { useQueryClient } from '@tanstack/react-query';

function InvalidateCache() {
  const queryClient = useQueryClient();

  // Invalidate all brand queries
  queryClient.invalidateQueries({ queryKey: brandKeys.all });

  // Invalidate specific brand query
  queryClient.invalidateQueries({ queryKey: brandKeys.getBrandById('123') });
}
```

## API Configuration

### Base URL Priority

The API base URL is determined using the following priority (highest to lowest):

1. **localStorage** - `API_BASE_URL` key (persists across browser sessions)
2. **window config** - `window.__APP_CONFIG__.apiBaseUrl` (runtime injection)
3. **Vite environment** - `VITE_API_BASE_URL` (set at build time)
4. **Origin fallback** - `window.location.origin`

### Debug in Chrome DevTools

The easiest way to configure the API URL when debugging in Chrome:

1. Open Chrome DevTools (F12)
2. Go to the Console tab
3. Set the API URL:

```javascript
localStorage.setItem('API_BASE_URL', 'http://localhost:5000');
```

4. Reload the page

To remove the override:

```javascript
localStorage.removeItem('API_BASE_URL');
```

### Setting Base URL Programmatically

You can also set the base URL in your code:

```tsx
import { setApiBaseUrl, setApiBaseUrlPersistent, clearApiBaseUrl } from 'src/api';

// Temporary change (lost on page reload)
setApiBaseUrl('http://localhost:5000');

// Persistent change (saved to localStorage)
setApiBaseUrlPersistent('http://localhost:5000');

// Clear persistent setting (reverts to default priority)
clearApiBaseUrl();
```

### Runtime Configuration via Window Config

For deployment scenarios where you need to inject configuration at runtime:

```html
<!-- In index.html before your app script -->
<script>
  window.__APP_CONFIG__ = {
    apiBaseUrl: 'https://api.example.com'
  };
</script>
```

Or create a `public/config.js` file that sets `window.__APP_CONFIG__`.

### Environment Variables

You can still use environment variables by creating a `.env.local` file:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Note: Environment variables are baked in at build time and cannot be changed without rebuilding.

## Error Handling

The API uses a standard result wrapper pattern:

```tsx
import type { BrandEntityResult } from 'src/api/types';

const result: BrandEntityResult = await createBrand({ name: 'New Brand' });

if (result.isSuccess) {
  console.log('Success:', result.value);
} else {
  console.error('Error:', result.message);
  console.error('Error type:', result.errorType);
}
```

Error types include:

- `none` - No error
- `validation` - Validation error
- `notFound` - Resource not found
- `unauthorized` - Authentication required
- `forbidden` - Permission denied
- `conflict` - Resource conflict
- `internal` - Server error
- `external` - External service error
- `timeout` - Request timeout
- `cancelled` - Request cancelled

## Best Practices

1. **Use hooks for React components** - They handle loading states, caching, and error handling
2. **Use services for non-React code** - Scripts, utilities, or server-side code
3. **Import types separately** - Use `import type` for type-only imports
4. **Regenerate after spec changes** - Run `npm run generate:api` when the OpenAPI spec is updated
5. **Don't edit generated files** - They will be overwritten on regeneration

## Available Endpoints

The following tags have auto-generated services and hooks:

- **AdaptiveRuleConfig** - Rule configuration management
- **AdminGlobalSetting** - Global admin settings
- **ApiGateway** - API gateway configuration
- **Brand** - Brand management
- **Category** - Category management
- **Customer** - Customer management
- **Product** - Product management
- **User** - User management
- **Warehouse** - Warehouse management

Each endpoint typically includes:

- `get{Entity}ById(id)` - Get single entity
- `get{Entity}Page(data, params)` - Get paginated list
- `create{Entity}(data)` - Create new entity
- `update{Entity}(id, data, params)` - Update entity
- `delete{Entity}(id)` - Delete entity
- `generateNew{Entity}Code()` - Generate unique code

## Related Documentation

- [Quickstart Guide](./quickstart.md) - Getting started with the project
- [i18n Documentation](./i18n.md) - Multi-language support

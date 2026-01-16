# High-Performance Dynamic Translation System

## Overview

This system offloads translation storage and processing to a **Web Worker** and **IndexedDB**. It follows a "Pull-on-Demand" architecture where the UI only passes an entityId, and the system resolves the correct string based on the current i18next language.

### Key Features

* **Zero Main-Thread Blocking:** All heavy JSON processing happens in a background worker
* **Efficient Bandwidth:** Uses ETags (304 Not Modified) to check for updates
* **Persistence:** Translations survive page refreshes via IndexedDB
* **Modular:** Each entity (orders, products, etc.) is handled by a dedicated service
* **Automatic Polling:** Background sync every 30 minutes (configurable)

## Architecture

### Data Flow

1. **Initialization:** Worker starts on app mount and checks IndexedDB for existing translations
2. **Background Sync:** Worker polls `/api/*/translations` endpoints every 30 minutes using ETags
3. **Translation Lookup:** UI requests translation by entity type, entity ID, and language
4. **Cache-First:** Worker checks IndexedDB first (O(1) lookup), falls back to API if needed
5. **Updates:** When server returns 200 OK (new data), worker updates IndexedDB and notifies UI

### Storage Schema (IndexedDB)

Translations are stored with composite keys in the format: `entity:id:lang`

**Examples:**
- `area:507f1f77bcf86cd799439011:en` → "Production Floor"
- `product:507f191e810c19729de860ea:vi` → "Sản phẩm A"

**Metadata:**
- ETags stored per entity type for conditional fetching
- Last sync timestamp tracked per entity

## Installation

The system is automatically initialized when the app starts. No manual setup required.

### Dependencies

```json
{
  "idb-keyval": "^6.2.1",
  "comlink": "^4.4.1"
}
```

These are already installed in the project.

## Usage

### 1. Using Entity Translation Services

Each entity type has a dedicated service for easy access:

```typescript
import { AreaTranslationService, ProductTranslationService } from 'src/services/translation';

// Get area name in current language
const areaName = await AreaTranslationService.get('507f1f77bcf86cd799439011');

// Get product name in specific language
const productName = await ProductTranslationService.get('507f191e810c19729de860ea', 'vi');
```

### 2. Using React Hooks

The recommended way to access translations in React components:

```typescript
import { useEntityTranslation } from 'src/services/translation';

function MyComponent({ areaId }: { areaId: string }) {
  const areaName = useEntityTranslation('area', areaId);
  
  return (
    <div>
      {areaName ? areaName : 'Loading...'}
    </div>
  );
}
```

### 3. Manual Sync

Trigger a manual sync of all translations:

```typescript
import { TranslationManager } from 'src/services/translation';

// Sync all entities
TranslationManager.syncAll();

// Sync specific entity
import { AreaTranslationService } from 'src/services/translation';
AreaTranslationService.sync();
```

### 4. Sync Button Component

Add a sync button with progress indicator to any page:

```typescript
import { TranslationSyncButton } from 'src/components/translation-sync-button';

function MyPage() {
  return (
    <Box>
      <TranslationSyncButton />
      {/* Your page content */}
    </Box>
  );
}
```

### 5. Listening to Updates

React to translation updates in real-time:

```typescript
import { useTranslationUpdates } from 'src/services/translation';

function MyComponent() {
  useTranslationUpdates((entity) => {
    console.log(`${entity} translations updated!`);
    // Refresh your data or UI
  });
  
  return <div>...</div>;
}
```

## API Reference

### TranslationManager

Central manager for the translation system.

```typescript
// Initialize (automatically called on app mount)
await TranslationManager.initialize({
  pollingInterval: 30 * 60 * 1000, // 30 minutes
  autoSync: true,
  baseUrl: 'https://api.example.com'
});

// Sync all translations
TranslationManager.syncAll();

// Update configuration
TranslationManager.setConfig({
  pollingInterval: 60 * 60 * 1000, // Change to 1 hour
  autoSync: false, // Disable auto sync
});

// Listen to events
const unsubscribe = TranslationManager.onSyncProgress((progress) => {
  console.log(`${progress.entity}: ${progress.progress}%`);
});

// Cleanup
TranslationManager.terminate();
```

### Entity Services

All available entity translation services:

- `AreaTranslationService`
- `CalendarTranslationService`
- `DefectReasonTranslationService`
- `DefectReasonGroupTranslationService`
- `DepartmentTranslationService`
- `InformationDecoratorBaseTranslationService`
- `MachineTypeTranslationService`
- `MachineTranslationService`
- `ProductCategoryTranslationService`
- `ProductTranslationService`
- `ShiftTranslationService`
- `ShiftTemplateTranslationService`
- `StopMachineReasonTranslationService`
- `StopMachineReasonGroupTranslationService`
- `TimeBlockNameTranslationService`
- `UnitTranslationService`
- `UnitConversionTranslationService`
- `UnitGroupTranslationService`
- `WorkOrderTranslationService`

### React Hooks

#### useEntityTranslation

Get translation for a specific entity.

```typescript
const translation = useEntityTranslation(
  entity: EntityType,    // e.g., 'area', 'product'
  entityId: string | undefined
): string | null;
```

#### useTranslationSync

Access sync functionality and progress.

```typescript
const { syncing, progress, syncAll } = useTranslationSync();

// syncing: boolean - Whether sync is in progress
// progress: SyncProgress[] - Progress for each entity
// syncAll: () => void - Trigger manual sync
```

#### useTranslationUpdates

Listen to translation data updates.

```typescript
useTranslationUpdates((entity: string) => {
  console.log(`${entity} updated`);
});
```

#### useTranslationSystem

Check system initialization status.

```typescript
const { initialized } = useTranslationSystem();
```

## Configuration

### Polling Interval

Change how often the worker checks for updates:

```typescript
TranslationManager.setConfig({
  pollingInterval: 60 * 60 * 1000, // 1 hour
});
```

### Disable Auto Sync

Turn off automatic background polling:

```typescript
TranslationManager.setConfig({
  autoSync: false,
});
```

### Custom Base URL

Override the API base URL (defaults to apiConfig.baseUrl):

```typescript
TranslationManager.setConfig({
  baseUrl: 'https://custom-api.example.com',
});
```

## Performance

### Memory Efficiency

- **React State:** Doesn't hold thousands of translation strings
- **IndexedDB:** Stores all translations off the main thread
- **Worker:** Processes large JSON payloads without freezing the UI

### Network Efficiency

- **ETags:** 304 Not Modified responses are nearly 0 bytes
- **Conditional Fetching:** Only downloads when data changes
- **Background Polling:** Invisible to the user experience

### Lookup Speed

- **O(1) Complexity:** Direct IndexedDB key lookup
- **No Blocking:** All operations happen in Web Worker
- **Fast Reads:** ~1ms average lookup time

## Debugging

### Enable Worker Logging

Worker logs are prefixed with `[Worker]`:

```javascript
// In browser console
// Worker logs will show:
[Worker] Initializing translation worker
[Worker] Fetched 150 translations for area
[Worker] Entity product not modified (304)
```

### Check Storage Stats

View how many translations are cached:

```typescript
import { getStorageStats } from 'src/services/translation';

const stats = await getStorageStats();
console.log(stats);
// {
//   totalKeys: 1523,
//   translationKeys: 1500,
//   etagKeys: 23
// }
```

### Clear All Translations

Reset the cache (useful for debugging):

```typescript
import { clearAllTranslations } from 'src/services/translation';

await clearAllTranslations();
```

## Troubleshooting

### Translations Not Loading

1. Check if worker initialized: `TranslationManager.isInitialized()`
2. Check browser console for `[Worker]` logs
3. Verify API endpoints return correct format (EntityTranslationDto[])
4. Check IndexedDB in DevTools → Application → IndexedDB

### 304 Not Modified Issues

If translations aren't updating even after changes:

1. Server must return proper ETag headers
2. Check if ETag changes when data changes
3. Manually trigger sync: `TranslationManager.syncAll()`

### Worker Not Starting

Check browser compatibility:
- Web Workers supported in all modern browsers
- IndexedDB supported in all modern browsers
- Vite handles worker bundling automatically

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11.1+
- ✅ Edge 79+

All modern browsers support Web Workers and IndexedDB.

## Examples

### Display Area Name in Table

```typescript
import { useEntityTranslation } from 'src/services/translation';

function AreaTableRow({ areaId }: { areaId: string }) {
  const areaName = useEntityTranslation('area', areaId);
  
  return (
    <TableRow>
      <TableCell>{areaName || areaId}</TableCell>
    </TableRow>
  );
}
```

### Product Selector with Translations

```typescript
import { useEntityTranslation } from 'src/services/translation';

function ProductSelect({ products }: { products: Product[] }) {
  return (
    <Select>
      {products.map((product) => (
        <ProductOption key={product.id} product={product} />
      ))}
    </Select>
  );
}

function ProductOption({ product }: { product: Product }) {
  const productName = useEntityTranslation('product', product.id);
  
  return (
    <MenuItem value={product.id}>
      {productName || product.code}
    </MenuItem>
  );
}
```

### Settings Page with Sync Control

```typescript
import { TranslationSyncButton } from 'src/components/translation-sync-button';
import { getStorageStats } from 'src/services/translation';
import { useState, useEffect } from 'react';

function SettingsPage() {
  const [stats, setStats] = useState({ translationKeys: 0 });
  
  useEffect(() => {
    getStorageStats().then(setStats);
  }, []);
  
  return (
    <Box>
      <Typography variant="h4">Translation Settings</Typography>
      
      <Card sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6">Cached Translations</Typography>
        <Typography variant="body2" color="text.secondary">
          {stats.translationKeys} translations cached
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <TranslationSyncButton />
        </Box>
      </Card>
    </Box>
  );
}
```

## Next Steps

1. **Implement in Lists:** Use `useEntityTranslation` in table rows and cards
2. **Add to Forms:** Display translated names in selects and autocompletes
3. **Monitor Performance:** Check Network tab for 304 responses
4. **Optimize Polling:** Adjust interval based on your update frequency
5. **Custom Sync Triggers:** Add sync buttons to relevant pages

## Related Documentation

- [API Service Generator](./api-usage.md)
- [i18next Configuration](../locales/i18n.ts)
- [Entity Translation Endpoints](../../docs/api/response.json)

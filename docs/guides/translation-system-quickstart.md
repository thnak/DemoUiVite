# Translation System - Quick Start

## What is it?

A high-performance translation system that:
- Stores entity translations in IndexedDB (persistent across reloads)
- Processes translations in a Web Worker (no UI blocking)
- Uses ETags for efficient updates (304 Not Modified)
- Auto-syncs every 30 minutes in the background

## Basic Usage

### 1. In React Components (Recommended)

```typescript
import { useEntityTranslation } from 'src/services/translation';

function MyComponent({ areaId }: { areaId: string }) {
  // Automatically gets translation in current language
  const areaName = useEntityTranslation('area', areaId);
  
  return <div>{areaName || 'Loading...'}</div>;
}
```

### 2. Direct Service Access

```typescript
import { ProductTranslationService } from 'src/services/translation';

// In an async function
const productName = await ProductTranslationService.get(productId);
console.log(productName); // "Product Name" or null
```

### 3. Add Sync Button

```typescript
import { TranslationSyncButton } from 'src/components/translation-sync-button';

function SettingsPage() {
  return (
    <Box>
      <TranslationSyncButton />
    </Box>
  );
}
```

## Available Entity Services

- `AreaTranslationService` - Area names
- `ProductTranslationService` - Product names
- `MachineTranslationService` - Machine names
- `CalendarTranslationService` - Calendar names
- `DefectReasonTranslationService` - Defect reason descriptions
- ...and 15+ more!

## How It Works

1. **First Load:** Worker fetches all translations from API
2. **Storage:** Saves to IndexedDB with keys like `product:123:en`
3. **Lookup:** When you call `useEntityTranslation('product', '123')`, it checks IndexedDB
4. **Updates:** Background worker checks for updates every 30 minutes using ETags
5. **Efficiency:** If data hasn't changed, server returns 304 (no data transfer)

## Configuration

```typescript
import { TranslationManager } from 'src/services/translation';

// Change polling interval to 1 hour
TranslationManager.setConfig({
  pollingInterval: 60 * 60 * 1000,
});

// Disable auto-sync
TranslationManager.setConfig({
  autoSync: false,
});

// Manual sync anytime
TranslationManager.syncAll();
```

## Examples

### Table Row with Translation

```typescript
function AreaRow({ area }: { area: Area }) {
  const areaName = useEntityTranslation('area', area.id);
  
  return (
    <TableRow>
      <TableCell>{areaName || area.code}</TableCell>
      <TableCell>{area.description}</TableCell>
    </TableRow>
  );
}
```

### Select with Translated Options

```typescript
function ProductSelect({ products }: { products: Product[] }) {
  return (
    <Select>
      {products.map((product) => (
        <ProductMenuItem key={product.id} product={product} />
      ))}
    </Select>
  );
}

function ProductMenuItem({ product }: { product: Product }) {
  const name = useEntityTranslation('product', product.id);
  return <MenuItem value={product.id}>{name || product.code}</MenuItem>;
}
```

### Listen to Updates

```typescript
import { useTranslationUpdates } from 'src/services/translation';

function MyComponent() {
  useTranslationUpdates((entity) => {
    console.log(`${entity} translations updated!`);
    // Optionally refetch data
  });
  
  return <div>...</div>;
}
```

## Debugging

### Check Status

```typescript
import { TranslationManager } from 'src/services/translation';

// Is it initialized?
console.log(TranslationManager.isInitialized());
```

### View Cache Stats

```typescript
import { getStorageStats } from 'src/services/translation';

const stats = await getStorageStats();
console.log(`${stats.translationKeys} translations cached`);
```

### Clear Cache

```typescript
import { clearAllTranslations } from 'src/services/translation';

await clearAllTranslations();
// Then manually sync
TranslationManager.syncAll();
```

## When to Use

✅ **Use this for:**
- Entity names in tables and lists
- Dropdown/select options
- Card titles and labels
- Any entity-specific translations

❌ **Don't use this for:**
- UI labels (use regular i18next)
- Static text (use regular i18next)
- Form field labels (use regular i18next)

## Performance Benefits

- **No main thread blocking:** All processing in Web Worker
- **Fast lookups:** IndexedDB O(1) access by key
- **Minimal network:** ETags prevent unnecessary downloads
- **Persistent:** Survives page refresh
- **Background updates:** Syncs automatically without user noticing

## Troubleshooting

**Problem:** Translations not showing
- Check browser console for `[Worker]` logs
- Verify `TranslationManager.isInitialized()` returns `true`
- Check IndexedDB in DevTools → Application → IndexedDB

**Problem:** Not updating after data changes
- Server must send ETag headers
- ETag must change when data changes
- Try manual sync: `TranslationManager.syncAll()`

**Problem:** Worker not starting
- Check browser console for errors
- Verify Web Workers are supported (all modern browsers)
- Check Vite worker bundling (should work automatically)

## Full Documentation

For complete API reference and advanced usage, see:
- [Translation System Documentation](./translation-system.md)

## Questions?

Check browser console for `[Worker]` prefix logs to see what's happening behind the scenes!

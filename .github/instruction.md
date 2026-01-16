# Translation System Instructions

## Overview

This document provides instructions for using the High-Performance Dynamic Translation System implemented in this project. The system offloads translation storage and processing to Web Workers and IndexedDB for optimal performance.

## Supported Languages

The translation system supports the following languages for future work:

- **vi-VN** - Vietnamese (Vietnam)
- **en-US** - English (United States)
- **ja-JP** - Japanese (Japan)
- **ko-KR** - Korean (South Korea)

### Adding New Languages

To add support for a new language:

1. Add the language code to your i18next configuration
2. The translation system will automatically fetch translations for all supported entity types
3. Translations are stored with the key pattern: `entity:id:lang` (e.g., `product:123:vi-VN`)

## Translation System Features

### 1. High-Performance Architecture

**Key Features:**
- **Zero Main-Thread Blocking**: All translation processing happens in a Web Worker
- **Persistent Storage**: Uses IndexedDB to cache translations (survives page refresh)
- **Efficient Updates**: ETag-based conditional fetching (304 Not Modified responses)
- **Automatic Sync**: Background polling every 30 minutes (configurable)
- **O(1) Lookup Speed**: Direct IndexedDB key access (~3ms average)

### 2. Use Cases

#### Use Case 1: Display Translated Entity Names in Tables

**Scenario**: Show product names in the user's current language in a data table.

**Solution**:
```typescript
import { useEntityTranslation } from 'src/services/translation';

function ProductTableRow({ product }: { product: Product }) {
  const productName = useEntityTranslation('product', product.id);
  
  return (
    <TableRow>
      <TableCell>{productName || product.code}</TableCell>
      <TableCell>{product.category}</TableCell>
    </TableRow>
  );
}
```

**How it works**:
1. Hook detects current language from i18next
2. Queries IndexedDB for `product:${id}:${lang}` key via Web Worker
3. Returns cached translation or fetches from API
4. Component re-renders when translation is available

#### Use Case 2: Multi-Language Dropdown Options

**Scenario**: Display area names in a dropdown/select component.

**Solution**:
```typescript
import { useEntityTranslation } from 'src/services/translation';

function AreaSelect({ areas, value, onChange }: Props) {
  return (
    <Select value={value} onChange={onChange}>
      {areas.map((area) => (
        <AreaOption key={area.id} area={area} />
      ))}
    </Select>
  );
}

function AreaOption({ area }: { area: Area }) {
  const areaName = useEntityTranslation('area', area.id);
  
  return (
    <MenuItem value={area.id}>
      {areaName || area.code}
    </MenuItem>
  );
}
```

#### Use Case 3: Manual Sync for Admin Users

**Scenario**: Provide admin users with a button to manually refresh translations.

**Solution**:
```typescript
import { TranslationSyncButton } from 'src/components/translation-sync-button';

function AdminSettingsPage() {
  return (
    <Box>
      <Typography variant="h5">Translation Management</Typography>
      <TranslationSyncButton />
    </Box>
  );
}
```

**Features**:
- Shows sync progress per entity
- Displays success/error states
- Reports number of translations synced

#### Use Case 4: Listen to Translation Updates

**Scenario**: Refresh UI when translations are updated in the background.

**Solution**:
```typescript
import { useTranslationUpdates } from 'src/services/translation';

function ProductList() {
  const [products, setProducts] = useState([]);
  const { refetch } = useGetProducts();
  
  useTranslationUpdates((entity) => {
    if (entity === 'product') {
      console.log('Product translations updated!');
      // Optionally trigger UI refresh
      refetch();
    }
  });
  
  return <ProductGrid products={products} />;
}
```

### 3. How to Use - Developer Guide

#### Step 1: Basic Translation Lookup

**Using React Hook** (Recommended):
```typescript
import { useEntityTranslation } from 'src/services/translation';

function MyComponent({ entityId }: { entityId: string }) {
  // Automatically uses current i18next language
  const translation = useEntityTranslation('area', entityId);
  
  return <div>{translation || 'Loading...'}</div>;
}
```

**Using Service Directly**:
```typescript
import { AreaTranslationService } from 'src/services/translation';

async function getAreaName(areaId: string) {
  const name = await AreaTranslationService.get(areaId);
  return name || 'Unknown Area';
}

// With specific language
async function getAreaNameInVietnamese(areaId: string) {
  const name = await AreaTranslationService.get(areaId, 'vi-VN');
  return name;
}
```

#### Step 2: Available Entity Services

The following entity translation services are available:

```typescript
import {
  AreaTranslationService,
  CalendarTranslationService,
  DefectReasonTranslationService,
  DefectReasonGroupTranslationService,
  DepartmentTranslationService,
  InformationDecoratorBaseTranslationService,
  MachineTypeTranslationService,
  MachineTranslationService,
  ProductCategoryTranslationService,
  ProductTranslationService,
  ShiftTranslationService,
  ShiftTemplateTranslationService,
  StopMachineReasonTranslationService,
  StopMachineReasonGroupTranslationService,
  TimeBlockNameTranslationService,
  UnitTranslationService,
  UnitConversionTranslationService,
  UnitGroupTranslationService,
  WorkOrderTranslationService,
} from 'src/services/translation';
```

#### Step 3: Configuration

**Change Polling Interval**:
```typescript
import { TranslationManager } from 'src/services/translation';

// Set to 1 hour
TranslationManager.setConfig({
  pollingInterval: 60 * 60 * 1000,
});
```

**Disable Auto-Sync**:
```typescript
TranslationManager.setConfig({
  autoSync: false,
});
```

**Manual Sync All**:
```typescript
TranslationManager.syncAll();
```

**Sync Specific Entity**:
```typescript
import { AreaTranslationService } from 'src/services/translation';

AreaTranslationService.sync();
```

#### Step 4: Monitor System Status

**Check Initialization**:
```typescript
import { useTranslationSystem } from 'src/services/translation';

function MyComponent() {
  const { initialized } = useTranslationSystem();
  
  if (!initialized) {
    return <CircularProgress />;
  }
  
  return <div>Translations ready!</div>;
}
```

**Get Storage Statistics**:
```typescript
import { getStorageStats } from 'src/services/translation';

const stats = await getStorageStats();
console.log(`${stats.translationKeys} translations cached`);
console.log(`${stats.etagKeys} ETags stored`);
```

**Clear All Translations** (for debugging):
```typescript
import { clearAllTranslations } from 'src/services/translation';

await clearAllTranslations();
TranslationManager.syncAll(); // Re-fetch
```

### 4. API Requirements

The translation system expects API endpoints in this format:

```
GET /api/{entity}/translations
```

**Response Format**:
```typescript
// EntityTranslationDto[]
[
  {
    id: "507f1f77bcf86cd799439011",
    key: "vi-VN",  // Language code
    content: "Tên sản phẩm"  // Translated text
  },
  {
    id: "507f1f77bcf86cd799439011",
    key: "en-US",
    content: "Product Name"
  }
]
```

**Supported Entities**:
- area
- calendar
- defectReason
- defectReasonGroup
- department
- informationDecoratorBase
- machineType
- machine
- productCategory
- product
- shift
- shiftTemplate
- stopMachineReason
- stopMachineReasonGroup
- timeBlockName
- unit
- unitConversion
- unitGroup
- workOrder

### 5. Performance Characteristics

- **Memory**: Minimal React state, all translations in IndexedDB
- **Speed**: ~3ms lookup time (IndexedDB + Worker roundtrip)
- **Network**: 304 Not Modified responses for unchanged data
- **Storage**: ~500KB for 1000 translations
- **Offline**: Full availability with cached translations

### 6. Troubleshooting

**Problem**: Translations not loading
- Check: `TranslationManager.isInitialized()`
- Check: Browser console for `[Worker]` logs
- Check: IndexedDB in DevTools → Application → IndexedDB

**Problem**: Stale translations
- Check: ETag headers in Network tab
- Solution: `TranslationManager.syncAll()`

**Problem**: Worker not starting
- Check: Browser console for errors
- Check: Web Worker support (all modern browsers)

### 7. Testing & Development

**Dev Hub**: Access `/dev` route to view the Translation System Demo

**Demo Page**: `/dev/translation-demo` shows:
- Real-time storage statistics
- Sync progress tracking
- System status indicators
- Usage examples

## Future Work

### Planned Enhancements

1. **Language-Specific Features**:
   - Right-to-left (RTL) support for future languages
   - Number and date formatting per locale
   - Currency formatting

2. **Performance Optimizations**:
   - Incremental sync (only changed translations)
   - Compression in IndexedDB
   - Priority queue for visible entities

3. **Developer Tools**:
   - Translation coverage reports
   - Missing translation detection
   - Cache hit rate analytics

4. **Additional Language Support**:
   - Expand beyond vi-VN, en-US, ja-JP, ko-KR
   - Add language auto-detection
   - Fallback language chains

## Best Practices

1. **Always use hooks in components**: Prefer `useEntityTranslation` over direct service calls
2. **Provide fallbacks**: Always show entity code if translation is unavailable
3. **Avoid over-syncing**: Let automatic polling handle updates unless user-triggered
4. **Monitor performance**: Check storage stats periodically to ensure healthy operation
5. **Test offline**: Verify translations work when offline

## References

- **Full Documentation**: `docs/guides/translation-system.md`
- **Quick Start**: `docs/guides/translation-system-quickstart.md`
- **Implementation**: `TRANSLATION_SYSTEM_IMPLEMENTATION.md`
- **Demo**: Visit `/dev/translation-demo` in the application

## Support

For issues or questions about the translation system:
1. Check the troubleshooting section above
2. Review browser console logs (prefixed with `[Worker]`)
3. Verify API responses match expected format
4. Check IndexedDB storage in browser DevTools

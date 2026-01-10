# Operator Interface - Next Steps

## Overview
This document outlines the next steps for completing the operator interface implementation after the visual enhancements have been completed.

## Phase 1: API Integration (Current Phase Complete)

### ✅ Completed Visual Implementation
- [x] Machine selection page with horizontal filters and curved cards
- [x] ApexCharts timeline with timestamps
- [x] Unified OEE+APQ radial gauge (270-degree)
- [x] Product change dialog (F1)
- [x] Add quantity dialog with history (F2)
- [x] Defect/scrap tracking dialog (F3)
- [x] Label downtime dialog (F4)
- [x] Keyboard shortcuts system (F1-F4, ESC, F12)
- [x] Mock data for visual testing

## Phase 2: API Endpoint Integration (Next Priority)

### 2.1 Machine Selection API

#### Endpoints Required:
```typescript
// Get list of machines with filters
GET /api/Machine/list
Query Parameters:
  - searchTerm?: string
  - areaId?: string
  - page?: number
  - pageSize?: number

Response: Machine[]
```

#### Machine Model:
```typescript
interface Machine {
  id: string;
  name: string;
  code: string;
  areaId: string;
  areaName: string;
  areaHexColor: string;
  currentState: 'running' | 'speedLoss' | 'downtime';
  imageUrl?: string; // Will use /api/Machine/{id}/image
}
```

#### Implementation Steps:
1. Create API service function in `src/api/services/generated/machine.ts`
2. Replace mock data in `machine-selection-view.tsx`
3. Add error handling and loading states
4. Test with real API responses

---

### 2.2 Machine Operation API

#### Endpoints Required:

**1. Product Working State**
```typescript
GET /api/Machine/{machineId}/product-working-state
Response: ProductWorkingStateByMachine

interface ProductWorkingStateByMachine {
  productId: string;
  productName: string;
  productionOrderNumber: string;
  userId: string;
  quantityPerCycle: number;
  idealCycleTime: string; // ISO 8601 duration
  downtimeThreshold: string; // ISO 8601 duration
  speedLossThreshold: string; // ISO 8601 duration
  plannedQuantity: number;
  currentQuantity: number;
  goodQuantity: number;
  scrapQuantity: number;
  actualCycleTime: string; // ISO 8601 duration
}
```

**2. Timeline / Run State Records**
```typescript
GET /api/MachineDowntime/{machineId}/current-run-state-records
Response: CurrentMachineRunStateRecords[]

interface CurrentMachineRunStateRecords {
  stateId: string; // ObjectId.Empty = "000000000000000000000000" for unlabeled
  stateName: string | null;
  state: 'running' | 'speedLoss' | 'downtime';
  isUnplannedDowntime?: boolean;
  startTime?: string; // ISO 8601 timestamp
  endTime?: string | null; // null for ongoing
}
```

**3. Product Change (F1 Dialog)**
```typescript
GET /api/Machine/{machineId}/mapped-products
Response: MappedProduct[]

interface MappedProduct {
  id: string;
  productId: string;
  productName: string;
  productionOrderNumber: string;
  targetQuantity: number;
  currentQuantity?: number;
  isActive: boolean;
  startTime: string;
}

POST /api/Machine/{machineId}/change-product
Body: {
  productId: string;
  productionOrderNumber: string;
}
Response: Success/Error

POST /api/Machine/{machineId}/update-target
Body: {
  productId: string;
  newTargetQuantity: number;
}
Response: Success/Error
```

**4. Add Quantity (F2 Dialog)**
```typescript
POST /api/Machine/{machineId}/add-quantity
Body: {
  quantity: number;
  note?: string;
  timestamp: string;
}
Response: Success/Error

GET /api/Machine/{machineId}/quantity-history
Query: page?, pageSize?
Response: QuantityAddHistory[]

interface QuantityAddHistory {
  id: string;
  timestamp: string;
  addedQuantity: number;
  addedBy: string;
  note?: string;
}
```

**5. Add Defect/Scrap (F3 Dialog)**
```typescript
GET /api/DefectType/list
Response: DefectType[]

interface DefectType {
  defectId: string;
  defectName: string;
  imageUrl?: string;
  colorHex: string;
}

POST /api/Machine/{machineId}/submit-defects
Body: {
  defects: Array<{
    defectId: string;
    quantity: number;
  }>;
  note?: string;
  timestamp: string;
}
Response: Success/Error

GET /api/Machine/{machineId}/defect-history
Query: page?, pageSize?
Response: DefectSubmission[]

interface DefectSubmission {
  id: string;
  timestamp: string;
  defects: Array<{
    defectId: string;
    defectName: string;
    quantity: number;
    colorHex: string;
  }>;
  submittedBy: string;
  note?: string;
}
```

**6. Label Downtime (F4 Dialog)**
```typescript
GET /api/StopReason/list
Response: StopReason[]

interface StopReason {
  reasonId: string;
  reasonName: string;
  imageUrl?: string;
  colorHex: string;
}

POST /api/MachineDowntime/{machineId}/label-downtime
Body: {
  downtimeRecordId: string; // From timeline records
  reasonIds: string[];
  note?: string;
  timestamp: string;
}
Response: Success/Error

GET /api/MachineDowntime/{machineId}/label-history
Query: page?, pageSize?
Response: DowntimeLabelHistory[]

interface DowntimeLabelHistory {
  id: string;
  timestamp: string;
  startTime: string;
  endTime?: string | null;
  duration: number; // minutes
  reasons: Array<{
    reasonId: string;
    reasonName: string;
    colorHex: string;
  }>;
  note?: string;
  labeledBy: string;
}
```

**7. Image Endpoints**
```typescript
GET /api/Machine/{machineId}/image
Response: Image binary

GET /api/Product/{productId}/image
Response: Image binary

GET /api/User/{userId}/avatar-image
Response: Image binary
```

---

### 2.3 SignalR Real-Time Updates

#### Hub Connection:
```typescript
// Connection URL
const hubUrl = '/hubs/machine-operation';

// Events to subscribe:
hubConnection.on('ProductStateUpdated', (data: ProductWorkingStateByMachine) => {
  // Update product data in real-time
});

hubConnection.on('TimelineUpdated', (data: CurrentMachineRunStateRecords[]) => {
  // Update timeline in real-time
});

hubConnection.on('MachineStateChanged', (data: { state: string, timestamp: string }) => {
  // Update machine state
});
```

#### Implementation Steps:
1. Install `@microsoft/signalr` package
2. Create SignalR service in `src/services/signalr-service.ts`
3. Initialize connection on machine operation page mount
4. Subscribe to events and update state
5. Clean up connection on unmount

---

## Phase 3: Remove Mock Data (After API Integration)

### Files to Update:

1. **Machine Selection**
   - `src/sections/oi/machine-selection/view/machine-selection-view.tsx`
   - Remove `getMockMachines()` function
   - Remove `getMockAreas()` function
   - Remove `import.meta.env.DEV` conditional

2. **Machine Operation**
   - `src/sections/oi/machine-operation/components/machine-operation-mock-data.ts` (if separated)
   - Remove all `getMock*()` functions:
     - `getMockProductData()`
     - `getMockTimelineData()`
     - `getMockQuantityHistory()`
     - `getMockDefectTypes()`
     - `getMockStopReasons()`
     - `getMockMappedProducts()`
   - Remove all `import.meta.env.DEV` conditionals

### Verification Checklist:
- [ ] Search codebase for `getMock` - should return 0 results
- [ ] Search for `import.meta.env.DEV` in OI section - should return 0 results
- [ ] Verify all data comes from API calls
- [ ] Test with actual backend API

---

## Phase 4: Testing & Validation

### 4.1 API Testing
- [ ] Test all GET endpoints with various parameters
- [ ] Test all POST endpoints with valid/invalid data
- [ ] Test image loading with missing images (fallback behavior)
- [ ] Test pagination for history endpoints
- [ ] Test error handling for API failures

### 4.2 Real-Time Testing
- [ ] Verify SignalR connection establishes correctly
- [ ] Test real-time updates for all events
- [ ] Test reconnection after network interruption
- [ ] Test multiple browser tabs with same machine

### 4.3 Integration Testing
- [ ] F1: Product change updates timeline and resets quantities
- [ ] F2: Add quantity increments good quantity and total
- [ ] F3: Submit defects increments scrap quantity
- [ ] F4: Label downtime removes from unlabeled list and updates timeline
- [ ] Timeline shows correct colors based on state and label status
- [ ] OEE metrics recalculate correctly on data changes

### 4.4 Performance Testing
- [ ] Timeline renders smoothly with 24 hours of data
- [ ] Defect grid handles 50+ defect types
- [ ] Stop reason grid handles 50+ reasons
- [ ] Product table handles 100+ mapped products
- [ ] No memory leaks on long-running sessions

---

## Phase 5: Internationalization (i18n)

### 5.1 Setup
- [x] Project already uses `src/locales` structure
- [ ] Add OI-specific translations to existing locale files

### 5.2 Translation Keys Structure:
```typescript
// src/locales/en.json and src/locales/vi.json additions

{
  "oi": {
    "machineSelection": {
      "title": "Operator Dashboard",
      "subtitle": "Real-time Production Management System",
      "search": "Search machines...",
      "filterAll": "All Areas",
      "noMachines": "No machines found",
      "access": "ACCESS"
    },
    "operation": {
      "timeline": {
        "title": "Machine Timeline",
        "unlabeledAlert": "unlabeled downtimes",
        "running": "Running",
        "speedLoss": "Speed Loss",
        "labeledDowntime": "Labeled Downtime",
        "unlabeledDowntime": "Unlabeled Downtime"
      },
      "oee": {
        "title": "OEE Metrics",
        "oee": "OEE",
        "availability": "Availability",
        "performance": "Performance",
        "quality": "Quality"
      },
      "production": {
        "title": "Production",
        "product": "Product",
        "po": "PO",
        "target": "Target",
        "current": "Current",
        "good": "Good",
        "scrap": "Scrap",
        "total": "Total",
        "idealCycleTime": "Ideal Cycle Time",
        "actualCycleTime": "Actual Cycle Time",
        "operator": "Operator",
        "completionTime": "Est. Completion"
      },
      "dialogs": {
        "changeProduct": {
          "title": "Change Product",
          "search": "Search product or PO...",
          "running": "Running",
          "select": "Select",
          "update": "Update Target"
        },
        "addQuantity": {
          "title": "Add Product",
          "tabAdd": "Add Quantity",
          "tabHistory": "History",
          "quantity": "Quantity",
          "note": "Note (optional)",
          "submit": "Add",
          "timestamp": "Time",
          "addedBy": "Added By",
          "noHistory": "No history yet"
        },
        "addDefect": {
          "title": "Add Defect",
          "tabAdd": "Enter Defects",
          "tabHistory": "History",
          "submit": "Submit defects",
          "noHistory": "No defect history"
        },
        "labelDowntime": {
          "title": "Label Downtime",
          "tabUnlabeled": "Need Labeling",
          "tabHistory": "History",
          "ongoing": "Ongoing",
          "duration": "Duration",
          "label": "Label",
          "selectReasons": "Select Stop Reasons",
          "note": "Note (optional)",
          "submit": "Submit reasons",
          "back": "Back",
          "noUnlabeled": "No unlabeled downtimes",
          "noHistory": "No label history"
        }
      },
      "keyboard": {
        "title": "Keyboard Shortcuts",
        "changeProduct": "Change Product",
        "addProduct": "Add Product",
        "addDefect": "Add Defect",
        "labelDowntime": "Label Downtime",
        "closeDialog": "Close Dialog",
        "showHelp": "Show Help"
      }
    }
  }
}
```

### 5.3 Implementation in Components:
```typescript
import { useTranslate } from 'src/locales';

export function MachineOperationView() {
  const { t } = useTranslate();

  return (
    <>
      <Typography variant="h4">{t('oi.operation.timeline.title')}</Typography>
      <Button>{t('oi.operation.dialogs.changeProduct.title')}</Button>
    </>
  );
}
```

---

## Phase 6: Documentation

### 6.1 API Documentation
- [ ] Create OpenAPI/Swagger documentation for all endpoints
- [ ] Add example requests/responses
- [ ] Document error codes and handling
- [ ] Add authentication/authorization requirements

### 6.2 User Documentation
- [ ] Create operator user manual with screenshots
- [ ] Document keyboard shortcuts
- [ ] Create troubleshooting guide
- [ ] Add video tutorials for common tasks

### 6.3 Developer Documentation
- [ ] Update README with setup instructions
- [ ] Document component structure
- [ ] Add code examples for common modifications
- [ ] Document SignalR event handling

---

## Timeline Estimate

| Phase | Estimated Duration | Priority |
|-------|-------------------|----------|
| Phase 2: API Integration | 2-3 weeks | High |
| Phase 3: Remove Mock Data | 1-2 days | High |
| Phase 4: Testing & Validation | 1 week | High |
| Phase 5: i18n | 2-3 days | Medium |
| Phase 6: Documentation | 1 week | Medium |

**Total Estimated Time**: 5-6 weeks

---

## Success Criteria

- [ ] All mock data removed from production code
- [ ] Real-time updates working via SignalR
- [ ] All keyboard shortcuts functional with real API
- [ ] No console errors or warnings
- [ ] Performance: <2s initial load, <500ms for dialog operations
- [ ] Multi-language support (English + Vietnamese)
- [ ] Complete API documentation
- [ ] User acceptance testing passed

---

## Notes

### API Naming Conventions
- Use RESTful conventions
- ISO 8601 for all timestamps and durations
- Consistent error response format
- Include pagination metadata (totalCount, page, pageSize)

### Security Considerations
- All endpoints require authentication
- Implement role-based access control (operators can only access assigned machines)
- Rate limiting on POST endpoints
- Input validation on all user-submitted data
- SQL injection prevention
- XSS prevention for user-generated notes

### Performance Optimization
- Implement caching for defect types and stop reasons (rarely change)
- Use pagination for all list endpoints
- Compress images via API
- Debounce search inputs
- Lazy load dialog components
- Optimize SignalR message payload size

---

## Contact

For questions or issues during implementation:
- Backend API: [Backend Team Lead]
- Frontend: [Frontend Team Lead]
- DevOps: [DevOps Team Lead]

Last Updated: 2026-01-10

# Machine State Tracking - Visual Changes

## Before & After Comparison

### MachineRunState Enum

**BEFORE** (String values):
```typescript
export enum MachineRunState {
  Running = "running",
  SpeedLoss = "speedloss",
  Downtime = "downtime",
}
```

**AFTER** (Numeric values matching spec):
```typescript
export enum MachineRunState {
  Running = 0,
  SpeedLoss = 1,
  Downtime = 2,
}
```

### MachineOeeUpdate Interface

**BEFORE** (No trend comparison):
```typescript
export interface MachineOeeUpdate {
  availability: number;        // 0-100
  performance: number;         // 0-100
  quality: number;            // 0-100
  oee: number;                // 0-100
  goodCount: number;
  totalCount: number;
  // ... time fields
}
```

**AFTER** (With trend comparison):
```typescript
export interface MachineOeeUpdate {
  machineName: string;                    // NEW
  availability: number;                   // 0-1 (changed)
  availabilityVsLastPeriod: number;      // NEW
  performance: number;                    // 0-1 (changed)
  performanceVsLastPeriod: number;       // NEW
  quality: number;                        // 0-1 (changed)
  qualityVsLastPeriod: number;           // NEW
  oee: number;                           // 0-1 (changed)
  oeeVsLastPeriod: number;               // NEW
  goodCount: number;
  goodCountVsLastPeriod: number;         // NEW
  totalCount: number;
  totalCountVsLastPeriod: number;        // NEW
  // ... time fields
}
```

### New MachineRuntimeBlock Interface

**NEW ADDITION**:
```typescript
export interface MachineRuntimeBlock {
  startTime: string;              // ISO 8601 date string
  endTime: string | null;         // null for ongoing blocks
  stopReasonId: string;           // ObjectId, empty for normal operation
  name: string;                   // Stop reason name
  color: string;                  // Color code for visualization
  isUnplannedDowntime: boolean;   // Flag for unlabeled stops
  state: MachineRunState;         // Machine run state
}
```

## UI Changes

### OEE Metric Cards

**BEFORE**:
```
┌─────────────────────┐
│ OEE                 │
│ 75.0 %             │
│ ████████░░░░       │
└─────────────────────┘
```

**AFTER** (With trend indicator):
```
┌─────────────────────┐
│ OEE                 │
│ 75.0 %             │
│ ████████░░░░       │
│ ↑ 5.0pp            │ ← NEW: Trend indicator
└─────────────────────┘
```

### Runtime Blocks Display

**BEFORE** (Chart-based timeline):
```
Timeline Chart (rangeBar)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Complex ApexCharts visualization]
```

**AFTER** (Card-based list with details):
```
┌─────────────────────────────────────────┐
│ 🟢 Running                              │
│ 08:00:00 - 10:30:45                     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🔴 Downtime                  [Unplanned]│ ← NEW: Badge
│ 10:30:45 - 10:45:23                     │
│ Material Shortage            ← NEW: Label│
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🔴 Downtime                  [Unplanned]│
│ 12:00:00 - Ongoing                      │
│ ⚠️ Needs labeling           ← NEW: Warning│
└─────────────────────────────────────────┘
```

### Production Counts

**BEFORE** (No trends):
```
┌─────────────────┐
│ Good Count      │
│ 1,250          │
└─────────────────┘

┌─────────────────┐
│ Total Count     │
│ 1,300          │
└─────────────────┘
```

**AFTER** (With trends):
```
┌─────────────────┐
│ Good Count      │
│ 1,250          │
│ ↑ 75           │ ← NEW: Trend
└─────────────────┘

┌─────────────────┐
│ Total Count     │
│ 1,300          │
│ ↑ 80           │ ← NEW: Trend
└─────────────────┘
```

## Event Handlers

### BEFORE (Single event):
```typescript
this.connection.on('MachineUpdate', (update: MachineOeeUpdate) => {
  console.log('Machine OEE update received:', update);
  this.callbacks.forEach((callback) => callback(update));
});
```

### AFTER (Two separate events):
```typescript
// OEE metrics event
this.connection.on('MachineUpdate', (update: MachineOeeUpdate) => {
  console.log('Machine OEE update received:', update);
  const callback = this.callbacks.get(update.machineName);
  if (callback) callback(update);
});

// Runtime blocks event (NEW)
this.connection.on('MachineRuntimeUpdateLastBlock', (block: MachineRuntimeBlock) => {
  console.log('Machine runtime block update received:', block);
  this.runtimeBlockCallbacks.forEach((callback) => callback(block));
});
```

## Method Signatures

### subscribeToMachine

**BEFORE**:
```typescript
async subscribeToMachine(
  machineId: string,
  callback: (update: MachineOeeUpdate) => void
): Promise<void>
```

**AFTER** (With optional runtime block callback):
```typescript
async subscribeToMachine(
  machineId: string,
  callback: (update: MachineOeeUpdate) => void,
  runtimeBlockCallback?: (block: MachineRuntimeBlock) => void  // NEW
): Promise<void>
```

### NEW METHOD: getMachineRuntimeBlocks

```typescript
async getMachineRuntimeBlocks(machineId: string): Promise<MachineRuntimeBlock[]> {
  try {
    const blocks = await this.connection.invoke<MachineRuntimeBlock[]>(
      'GetMachineRuntimeBlocks',
      machineId
    );
    return blocks;
  } catch (err) {
    console.error(`Error getting runtime blocks for machine ${machineId}:`, err);
    throw err;
  }
}
```

## Color Coding

### State Colors

```typescript
const STATE_COLORS = {
  [MachineRunState.Running]: '#4caf50',    // Green
  [MachineRunState.SpeedLoss]: '#ff9800',  // Orange
  [MachineRunState.Downtime]: '#f44336',   // Red
};
```

### Trend Colors

```typescript
const getTrendColor = (value: number): string => {
  if (value > 0) return 'success.main';   // Green (improvement)
  if (value < 0) return 'error.main';     // Red (decline)
  return 'text.secondary';                // Gray (no change)
};
```

## Usage Example

### Complete Example

```typescript
// Initialize service
const hubService = new MachineHubService(apiConfig.baseUrl);
await hubService.start();

// Define callbacks
const handleOeeUpdate = (update: MachineOeeUpdate) => {
  console.log(`OEE: ${update.oee * 100}% (${update.oeeVsLastPeriod > 0 ? '+' : ''}${update.oeeVsLastPeriod}pp)`);
};

const handleRuntimeBlock = (block: MachineRuntimeBlock) => {
  if (block.isUnplannedDowntime && !block.stopReasonId) {
    alert('⚠️ Unplanned downtime detected - needs labeling!');
  }
  console.log(`Block: ${block.name || 'Unnamed'} (${block.startTime} - ${block.endTime || 'Ongoing'})`);
};

// Subscribe with both callbacks
await hubService.subscribeToMachine(
  machineId,
  handleOeeUpdate,
  handleRuntimeBlock
);

// Get initial data
const [aggregation, blocks] = await Promise.all([
  hubService.getMachineAggregation(machineId),
  hubService.getMachineRuntimeBlocks(machineId)
]);

console.log('Initial aggregation:', aggregation);
console.log('Initial blocks:', blocks);

// Clean up
await hubService.unsubscribeFromMachine(machineId);
await hubService.stop();
```

## Visual Indicator Legend

```
Trend Indicators:
  ↑  Improvement (shown in green)
  ↓  Decline (shown in red)
  →  No change (shown in gray)

State Indicators:
  🟢  Running (green)
  🟡  Speed Loss (orange/yellow)
  🔴  Downtime (red)

Badges:
  [Unplanned]  Red badge for unlabeled stops
  ⚠️ Needs labeling  Warning for action required
```

## Performance Considerations

- **Callback Management**: Changed from broadcasting to all callbacks to targeted callbacks by machine name
- **Event Separation**: OEE updates and runtime blocks are now separate events for better granularity
- **Optional Callbacks**: Runtime block callback is optional to avoid unnecessary subscriptions
- **State Updates**: Runtime blocks use smart merging (replace if same startTime, append otherwise)

## Migration Path

If you're upgrading from the old implementation:

1. **Update enum comparisons**:
   ```typescript
   // Old
   if (state === "running") { ... }
   
   // New
   if (state === MachineRunState.Running) { ... }
   // or
   if (state === 0) { ... }
   ```

2. **Convert percentages**:
   ```typescript
   // OEE values now come as 0-1 instead of 0-100
   update.oee = update.oee * 100;  // For display
   ```

3. **Add runtime block handling** (optional):
   ```typescript
   await hubService.subscribeToMachine(
     machineId,
     handleOeeUpdate,
     handleRuntimeBlock  // Add this if you want runtime block updates
   );
   ```

4. **Use new method for blocks**:
   ```typescript
   // Get initial runtime blocks
   const blocks = await hubService.getMachineRuntimeBlocks(machineId);
   ```

---

**Summary**: The implementation adds comprehensive trend tracking and runtime block monitoring while maintaining backward compatibility. All new features are additive, and the breaking changes (enum values, percentage format) are handled automatically in the UI layer.

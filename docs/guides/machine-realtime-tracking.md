# Machine Real-Time Tracking Guide

This guide explains how to use the updated MachineHub service for real-time machine OEE tracking with runtime blocks and stop reason monitoring.

## Overview

The MachineHub service provides real-time streaming of:
- **OEE Metrics**: Overall Equipment Effectiveness with trend comparison
- **Runtime Blocks**: Detailed tracking of machine states with stop reasons
- **Production Counts**: Good count and total count with trends
- **Time Metrics**: Run time, downtime, and speed loss tracking

## Key Features

### 1. Trend Comparison
All OEE metrics include comparison with the last period:
- `oeeVsLastPeriod`: Overall Equipment Effectiveness change
- `availabilityVsLastPeriod`: Availability change
- `performanceVsLastPeriod`: Performance change
- `qualityVsLastPeriod`: Quality change
- `goodCountVsLastPeriod`: Good count change
- `totalCountVsLastPeriod`: Total count change

Trends are displayed with visual indicators:
- **↑** (Green): Improvement
- **↓** (Red): Decline
- **→** (Gray): No change

### 2. Runtime Blocks with Stop Tracking
Runtime blocks provide detailed information about machine stops:
- **Start/End Time**: When the block started and ended (null for ongoing)
- **Stop Reason**: Label and ID of the stop reason
- **Unplanned Downtime**: Flag indicating if stop needs labeling
- **Color Coding**: Visual identification of different stop reasons
- **State**: Machine run state (Running, Speed Loss, Downtime)

### 3. Machine Run States
The system tracks three machine states:
```typescript
enum MachineRunState {
  Running = 0,     // Machine operating normally
  SpeedLoss = 1,   // Machine running below ideal speed
  Downtime = 2     // Machine stopped
}
```

## Usage

### Basic Setup

```typescript
import { MachineHubService } from 'src/services/machineHub';
import { apiConfig } from 'src/api/config';

const hubService = new MachineHubService(apiConfig.baseUrl);
```

### Connect to Hub

```typescript
await hubService.start();
```

### Subscribe to Machine Updates

```typescript
const handleOeeUpdate = (update: MachineOeeUpdate) => {
  console.log('OEE Update:', update.oee);
  console.log('Trend:', update.oeeVsLastPeriod);
};

const handleRuntimeBlock = (block: MachineRuntimeBlock) => {
  if (block.isUnplannedDowntime && !block.stopReasonId) {
    console.warn('Unlabeled downtime detected!');
  }
};

await hubService.subscribeToMachine(
  machineId,
  handleOeeUpdate,
  handleRuntimeBlock  // Optional
);
```

### Get Initial Data

```typescript
// Get machine aggregation
const aggregation = await hubService.getMachineAggregation(machineId);

// Get runtime blocks
const blocks = await hubService.getMachineRuntimeBlocks(machineId);
```

### Unsubscribe

```typescript
await hubService.unsubscribeFromMachine(machineId);
await hubService.stop();
```

## UI Implementation

The `MachineTrackingView` component demonstrates the complete implementation:

### OEE Metrics Display
- Large metric cards showing current values
- Linear progress bars for visual representation
- Trend indicators with color coding
- Percentage point differences

### Runtime Blocks Display
- Card-based list of runtime blocks
- Color-coded state indicators
- Stop reason labels
- Unplanned downtime badges
- Timestamps for start and end

### Example UI Code

```typescript
{machineState.oeeVsLastPeriod !== 0 && (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
    <Typography
      variant="caption"
      sx={{ color: getTrendColor(machineState.oeeVsLastPeriod) }}
    >
      {getTrendIndicator(machineState.oeeVsLastPeriod)}{' '}
      {Math.abs(machineState.oeeVsLastPeriod).toFixed(1)}pp
    </Typography>
  </Box>
)}
```

## Data Formats

### ISO 8601 Duration
Time durations are in ISO 8601 format:
- `PT8H`: 8 hours
- `PT30M`: 30 minutes
- `PT45S`: 45 seconds
- `PT2H30M`: 2 hours 30 minutes

### Percentage Values
OEE metrics come as decimal values (0-1) and are converted to percentages (0-100) for display:
```typescript
update.oee = update.oee * 100;  // Convert 0.75 to 75%
```

## Best Practices

1. **Always handle disconnections**: Use automatic reconnection
2. **Clean up subscriptions**: Unsubscribe when component unmounts
3. **Display trends prominently**: Help users identify improvements/issues
4. **Highlight unplanned downtime**: Make it easy to spot unlabeled stops
5. **Use color coding**: Visual cues improve user experience

## Testing

To test the machine tracking view:

1. Navigate to `/machines/:id/tracking`
2. Verify connection status shows "CONNECTED"
3. Check that metrics display with trend indicators
4. Verify runtime blocks appear with proper color coding
5. Confirm unplanned downtime badges show correctly

## Troubleshooting

### Connection Issues
- Check that the API base URL is correct
- Verify SignalR hub endpoint is accessible at `/hubs/machine`
- Check browser console for connection errors

### Missing Trends
- Trends only appear when comparison value is non-zero
- Initial load may not have previous period data

### Runtime Blocks Not Updating
- Verify runtime block callback is provided in `subscribeToMachine()`
- Check that MachineRuntimeUpdateLastBlock event is registered

## Related Files

- Service: `src/services/machineHub.ts`
- View: `src/sections/machine/view/machine-tracking-view.tsx`
- Types: Check MachineHub service for full type definitions

## API Specification

See the complete API specification in the issue description for:
- All available methods
- Event payloads
- Error handling
- Rate limiting details

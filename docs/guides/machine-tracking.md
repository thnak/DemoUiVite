# Machine Real-time Tracking Feature

## Overview

This feature implements a real-time machine tracking page that displays OEE (Overall Equipment Effectiveness) metrics and run state information using SignalR for live updates.

## Implementation Summary

### Files Created

1. **`src/services/machineHub.ts`**
   - SignalR hub service for machine OEE streaming
   - Interfaces for `MachineOeeUpdate`, `MachineAggregation`, `MachineRunState`
   - Connection management with automatic reconnection
   - Subscribe/unsubscribe methods for machine monitoring

2. **`src/sections/machine/view/machine-tracking-view.tsx`**
   - Real-time tracking UI component
   - Displays OEE metrics (Availability, Performance, Quality, Overall OEE)
   - Production counts (Good Count, Total Count, Current Product)
   - Time metrics (Run Time, Downtime, Speed Loss)
   - Run state history timeline
   - Connection status indicators

3. **`src/pages/machine-tracking.tsx`**
   - Page wrapper for the tracking view

### Files Modified

1. **`src/routes/sections.tsx`**
   - Added route: `/machines/:id/tracking`
   - Added lazy import for `MachineTrackingPage`

2. **`src/sections/machine/machine-table-row.tsx`**
   - Added "Realtime Tracking" menu item to machine actions
   - Navigation to tracking page from machine list

3. **`src/sections/machine/view/index.ts`**
   - Exported `MachineTrackingView`

## Features

### Real-time Updates
- **SignalR Connection**: Establishes WebSocket connection to `/hubs/machine`
- **Automatic Reconnection**: Built-in reconnection logic for resilient connections
- **Subscriber Count**: Shows number of active viewers
- **Live Updates**: Receives OEE updates every second from the backend

### OEE Metrics Display

#### 1. Overall OEE
- Large display with color-coded indicator:
  - **Green** (≥85%): World-class performance
  - **Orange** (60-84%): Typical industry performance
  - **Red** (<60%): Needs improvement
- Progress bar visualization

#### 2. Component Metrics
- **Availability**: Percentage of scheduled time machine was running
- **Performance**: Speed efficiency compared to ideal cycle time
- **Quality**: Percentage of good products produced
- Each with percentage display and progress bars

#### 3. Production Information
- **Good Count**: Number of quality products produced
- **Total Count**: Total products produced
- **Current Product**: Currently running product name

#### 4. Time Metrics
- **Run Time**: Total operating time (formatted as hours/minutes)
- **Downtime**: Total stopped time
- **Speed Loss Time**: Time running below ideal speed
- ISO 8601 duration parsing (e.g., "PT8H30M" → "8h 30m")

#### 5. Run State History
- Timeline of machine states:
  - **Running** (Green): Normal operation
  - **Speed Loss** (Yellow): Below ideal speed
  - **Downtime** (Red): Machine stopped
- Time ranges for each state period

### Machine Information Card
- Machine name and code
- Machine avatar/image
- Area assignment
- Work calendar
- Calculation mode

## Usage

### Accessing the Tracking Page

1. **From Machine List**:
   - Navigate to `/machines`
   - Click the action menu (three dots) on any machine row
   - Select "Realtime Tracking"

2. **Direct URL**:
   - Navigate to `/machines/{machineId}/tracking`
   - Replace `{machineId}` with the actual machine ID

### Backend Requirements

The backend must implement the following SignalR hub at `/hubs/machine`:

#### Hub Methods (Client → Server)

1. **`SubscribeToMachine(machineId: string)`**
   - Subscribe to receive real-time OEE updates for a specific machine

2. **`UnsubscribeFromMachine(machineId: string)`**
   - Unsubscribe from machine OEE updates

3. **`GetMachineAggregation(machineId: string): MachineAggregation`**
   - Get current cached OEE metrics (one-time fetch)

4. **`GetSubscriberCount(machineId: string): number`**
   - Get the number of active subscribers for a machine

#### Events (Server → Client)

1. **`MachineUpdate`**
   - Sent when machine OEE metrics change
   - Payload: `MachineOeeUpdate` object

### Data Types

```typescript
interface MachineOeeUpdate {
  availability: number;        // 0-100
  performance: number;         // 0-100
  quality: number;            // 0-100
  oee: number;                // 0-100
  goodCount: number;
  totalCount: number;
  plannedProductionTime: string; // ISO 8601 duration
  runTime: string;            // ISO 8601 duration
  downtime: string;           // ISO 8601 duration
  speedLossTime: string;      // ISO 8601 duration
  currentProductName: string;
  runStateHistory: MachineRunStateTimeBlock[];
}

interface MachineRunStateTimeBlock {
  startTime: string;  // ISO 8601 date
  endTime: string;    // ISO 8601 date
  state: MachineRunState; // 0=Running, 1=SpeedLoss, 2=Downtime
}

interface MachineAggregation {
  availability: number;
  performance: number;
  quality: number;
  oee: number;
  goodCount: number;
  totalCount: number;
  totalRunTime: string;
  totalDowntime: string;
  totalSpeedLossTime: string;
  lastUpdated: string;
}
```

## API Configuration

The feature uses the API base URL from `src/api/config.ts`:

1. **Priority Order**:
   - localStorage: `API_BASE_URL`
   - `window.__APP_CONFIG__.apiBaseUrl`
   - Environment variable: `VITE_API_BASE_URL`
   - `window.location.origin` (default)

2. **Development Setup**:
   ```javascript
   // In Chrome DevTools Console:
   localStorage.setItem('API_BASE_URL', 'http://localhost:5000');
   // Then reload the page
   ```

## Architecture

### Component Hierarchy
```
MachineTrackingView
├── Machine Info Card (left column)
│   ├── Avatar/Image
│   ├── Machine Details
│   └── Configuration Info
└── Real-time Status Cards (right column)
    ├── Connection Status
    ├── OEE Metrics
    ├── Production Info
    ├── Time Metrics
    └── Run State History (if available)
```

### State Management
- React hooks for local state
- SignalR hub service for WebSocket management
- Automatic cleanup on component unmount

### Error Handling
- Connection error display with Snackbar
- Graceful degradation if connection fails
- Loading states during connection/data fetch

## Styling

- **Theme Integration**: Uses MUI theme tokens for colors
- **Responsive Layout**: Grid-based layout adapts to screen size
- **Dark Mode Support**: All colors use theme palette tokens
- **Progress Bars**: Linear progress indicators for metrics
- **Color Coding**: 
  - Success (green) for good metrics
  - Warning (orange) for medium metrics
  - Error (red) for poor metrics

## Performance Considerations

1. **Automatic Reconnection**: SignalR handles disconnections automatically
2. **Cleanup**: Proper cleanup on component unmount
3. **Memoization**: State updates are optimized
4. **Throttling**: Backend should throttle updates (e.g., max 1 update/second)

## Testing

### Manual Testing Steps

1. **Connection Test**:
   - Open machine tracking page
   - Verify "CONNECTED" status appears
   - Check console for connection logs

2. **Data Display Test**:
   - Verify OEE metrics are displayed
   - Check that percentages are between 0-100
   - Confirm production counts are shown

3. **Real-time Updates Test**:
   - Monitor for live updates (last update time should change)
   - Verify metrics update when backend sends new data

4. **Error Handling Test**:
   - Stop backend server
   - Verify error message appears
   - Restart backend and verify reconnection

5. **Multiple Viewers Test**:
   - Open tracking page in multiple tabs/browsers
   - Verify subscriber count increases
   - Close tabs and verify count decreases

## Future Enhancements

- [ ] Historical data charts (trend lines for OEE)
- [ ] Alert notifications for low OEE
- [ ] Export functionality for reports
- [ ] Comparison view for multiple machines
- [ ] Custom time range selection
- [ ] Performance analytics dashboard

## Related Documentation

- Backend API Documentation: `docs/api/response.json`
- SignalR Hub Documentation: See issue description for full details
- MUI Components: https://mui.com/
- SignalR Client: https://docs.microsoft.com/en-us/aspnet/core/signalr/

## Troubleshooting

### Connection Issues
- **Problem**: "Failed to connect to machine hub"
- **Solution**: Verify API base URL is correct, check backend is running

### No Data Displayed
- **Problem**: Connected but no metrics shown
- **Solution**: Check if machine ID exists, verify backend is publishing updates

### Type Errors
- **Problem**: TypeScript errors about missing properties
- **Solution**: Run `npm run generate:api` to regenerate API types

### Icon Errors
- **Problem**: Icon not found errors
- **Solution**: Use only registered icons from `icon-sets.ts`

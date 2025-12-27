# Day Detail Dialog - Timeline View Documentation

## Overview

The Day Detail Dialog shows all time blocks for a selected day in a visual timeline view with resize handles ready for API integration.

## Accessing the Dialog

Click on any day cell in the Calendar View that has scheduled time blocks. Days with no blocks will not open the dialog.

## Dialog Structure

```
┌──────────────────────────────────────────────────────────────┐
│ Thursday, December 26, 2025                    8 time blocks │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  00:00  ┌────────────────────────────────────────────────┐  │
│  01:00  │                                                │  │
│  02:00  │                                                │  │
│  03:00  │                                                │  │
│  04:00  │                                                │  │
│  05:00  │                                                │  │
│  06:00  │                                                │  │
│  07:00  │                                                │  │
│  08:00  ├────────────────────────────────────────────────┤  │
│         │ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │  │
│         │ ┃ Day Shift                                  ┃ │  │
│  09:00  │ ┃ 08:00 - 12:00                              ┃ │  │
│         │ ┃ Duration: 4.00h                      💼    ┃ │  │
│  10:00  │ ┃                                            ┃ │  │
│         │ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │  │
│  11:00  │                                                │  │
│  12:00  ├────────────────────────────────────────────────┤  │
│         │ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │  │
│         │ ┃ Lunch Break                                ┃ │  │
│  13:00  │ ┃ 12:00 - 13:00                              ┃ │  │
│         │ ┃ Duration: 1.00h                      ⏰    ┃ │  │
│         │ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │  │
│  14:00  ├────────────────────────────────────────────────┤  │
│         │ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │  │
│  15:00  │ ┃ Afternoon Shift                            ┃ │  │
│         │ ┃ 13:00 - 17:00                              ┃ │  │
│  16:00  │ ┃ Duration: 4.00h                      💼    ┃ │  │
│         │ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │  │
│  17:00  ├────────────────────────────────────────────────┤  │
│  18:00  │                                                │  │
│  19:00  │                                                │  │
│  20:00  │                                                │  │
│  21:00  │                                                │  │
│  22:00  │                                                │  │
│  23:00  │                                                │  │
│  24:00  └────────────────────────────────────────────────┘  │
│                                                              │
│  Legend: [━] Shift  [━] Break  [━] Overtime  [━] Stop       │
│                                                              │
│  ⓘ Resize functionality will be available when API complete │
│     Resize handles are visible on hover at top/bottom       │
│                                                              │
│                                              [Close]         │
└──────────────────────────────────────────────────────────────┘
```

## Features

### 1. Timeline View
- **24-hour scale** (00:00 to 24:00) with hour markers on the left
- **Proportional positioning** - blocks positioned based on actual start/end times
- **Visual accuracy** - block height represents actual duration
- **Scrollable** - timeline scrolls if many blocks overlap

### 2. Time Blocks
Each block displays:
- **Block name** (e.g., "Day Shift", "Lunch Break")
- **Time range** in 24-hour format (e.g., "08:00 - 12:00")
- **Duration** in hours (e.g., "Duration: 4.00h")
- **Type icons** (💼 shift, ⏰ break, 🔄 overtime, ⛔ stop)

### 3. Color Coding
Blocks use the same color scheme as the calendar view:
- **Blue border** (`primary.main`) - Shift Time
- **Orange border** (`warning.main`) - Break Time
- **Light Blue border** (`info.main`) - Overtime
- **Red border** (`error.main`) - Planned Stop

Each block has:
- **4px left border** in the accent color
- **Background color** using the lighter shade
- **Hover effect** with shadow elevation

### 4. Resize Handles (Ready for API)
Each block has two resize handles:
- **Top handle** - 8px height at the top of the block
- **Bottom handle** - 8px height at the bottom of the block

Handle behavior:
- **Transparent** by default
- **Shows accent color** on hover (30% opacity)
- **Cursor changes** to `ns-resize` (north-south resize)
- **Tooltip** explains pending API implementation

### 5. Interaction
- **Click day cell** - Opens dialog for that day
- **Hover block** - Shows shadow elevation
- **Hover resize handle** - Shows colored bar
- **Close button** - Closes dialog

## Technical Implementation

### Block Positioning Algorithm

```typescript
const getBlockPosition = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  // Calculate minutes from day start (00:00)
  const startMinutes = start.getHours() * 60 + start.getMinutes();
  const endMinutes = end.getHours() * 60 + end.getMinutes();
  
  // Calculate percentage of 24-hour day
  const totalMinutes = 24 * 60;
  const topPercent = (startMinutes / totalMinutes) * 100;
  const heightPercent = ((endMinutes - startMinutes) / totalMinutes) * 100;
  
  return { topPercent, heightPercent };
};
```

### Block Rendering

```tsx
<Card
  sx={{
    position: 'absolute',
    top: `${topPercent}%`,
    height: `${heightPercent}%`,
    left: 0,
    right: 0,
    bgcolor: 'primary.lighter',
    borderLeft: 4,
    borderColor: 'primary.main',
    '&:hover': { boxShadow: 2 }
  }}
>
  {/* Block content */}
  
  {/* Top resize handle */}
  <Box
    sx={{
      position: 'absolute',
      top: -2,
      height: 8,
      cursor: 'ns-resize',
      '&:hover': { bgcolor: 'primary.main', opacity: 0.3 }
    }}
  />
  
  {/* Bottom resize handle */}
  <Box
    sx={{
      position: 'absolute',
      bottom: -2,
      height: 8,
      cursor: 'ns-resize',
      '&:hover': { bgcolor: 'primary.main', opacity: 0.3 }
    }}
  />
</Card>
```

### State Management

```typescript
// Dialog state
const [selectedDate, setSelectedDate] = useState<Date | null>(null);
const [dayDetailOpen, setDayDetailOpen] = useState(false);

// Reserved for resize functionality when API is ready
const [resizingBlock, setResizingBlock] = useState<{
  index: number;
  edge: 'start' | 'end';
  originalStart: Date;
  originalEnd: Date;
} | null>(null);

// Open dialog
const handleDayClick = (date: Date, stats: TimeBlock[]) => {
  if (stats.length > 0) {
    setSelectedDate(date);
    setDayDetailOpen(true);
  }
};
```

## API Integration (Pending)

### Expected Payload Format

When the API is complete, the resize functionality will send:

```typescript
{
  blockId1: string,
  start: string,    // ISO 8601 date-time
  end: string,      // ISO 8601 date-time
  blockId2: string,
  start: string,
  end: string,
  // ... additional blocks
}
```

### Resize Implementation Plan

1. **Mouse down on handle** - Store block index, edge (top/bottom), original times
2. **Mouse move** - Calculate new time based on mouse position
3. **Mouse up** - Send API request with updated times
4. **On success** - Update local state and refresh timeline
5. **On error** - Revert to original times, show error message

### Validation Rules

- **Minimum duration** - 15 minutes (configurable)
- **No overlap** - Blocks cannot overlap with each other
- **Within bounds** - Blocks must stay within 00:00 to 24:00
- **Snap to grid** - Optional snapping to 5/15/30 minute intervals

## User Experience

### Visual Feedback

1. **Hover on day cell** - Cursor changes to pointer if blocks exist
2. **Click day cell** - Dialog opens smoothly
3. **Hover on block** - Shadow elevation increases
4. **Hover on resize handle** - Handle becomes visible with color
5. **Alert message** - Informs user about pending API

### Accessibility

- **Dialog** - Proper ARIA labels and keyboard navigation
- **Close button** - Accessible via keyboard
- **Tooltips** - Explain resize handles
- **Color contrast** - All colors meet WCAG standards

## Responsive Design

- **Desktop** - Full width timeline (maxWidth: "md")
- **Tablet** - Dialog adapts to smaller width
- **Mobile** - Timeline remains usable with scroll

## Performance Considerations

- **Memoized calculations** - Block positions calculated once
- **Efficient sorting** - Blocks sorted by start time only once
- **No unnecessary re-renders** - Dialog only renders when open
- **CSS transforms** - Smooth hover effects

## Future Enhancements

1. **Drag to reposition** - Move entire block to different time
2. **Duplicate block** - Copy block to another time slot
3. **Delete block** - Remove block from timeline
4. **Add new block** - Click empty space to create new block
5. **Conflict detection** - Visual warning for overlapping blocks
6. **Zoom timeline** - Zoom in/out for better precision
7. **Time slot templates** - Quick apply common patterns

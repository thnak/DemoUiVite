# Machine Real-time Tracking - UI/UX Design

## Navigation Flow

```
Machine List Page (/machines)
    ├── Machine Table Row
    │   └── Actions Menu (...)
    │       ├── Realtime Tracking ← NEW
    │       ├── OEE Dashboard
    │       ├── Edit
    │       └── Delete
    │
    └── Click "Realtime Tracking" → /machines/{id}/tracking
```

## Page Layout

### Desktop Layout (Grid-based)

```
┌─────────────────────────────────────────────────────────────────┐
│ Realtime Machine Tracking                          [< Back]     │
│ Dashboard • Machines • Tracking                                 │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┬────────────────────────────────────────────┐
│  Machine Info    │         Realtime Status                    │
│  (4/12 width)    │         (8/12 width)                       │
│                  │                                            │
│  ┌────────────┐  │  ┌──────────────────────────────────────┐ │
│  │   Image    │  │  │ Connection Status: CONNECTED 🟢      │ │
│  │  [Avatar]  │  │  │ 3 viewers watching this machine      │ │
│  └────────────┘  │  └──────────────────────────────────────┘ │
│                  │                                            │
│  Machine Name    │  ┌──────────────────────────────────────┐ │
│  Code: M001      │  │         OEE Metrics                  │ │
│                  │  │                                        │ │
│  ━━━━━━━━━━━━━━  │  │  OEE          Availability           │ │
│                  │  │  85.5%        92.3%                   │ │
│  Area: Line A    │  │  [█████▓░]    [████████░]            │ │
│                  │  │                                        │ │
│  Calendar:       │  │  Performance  Quality                │ │
│  Standard        │  │  95.1%        97.5%                   │ │
│                  │  │  [████████░]  [█████████]            │ │
│  Calculation:    │  └──────────────────────────────────────┘ │
│  WeightChannels  │                                            │
└──────────────────┤  ┌──────────────────────────────────────┐ │
                   │  │         Production                   │ │
                   │  │                                        │ │
                   │  │  Good Count    Total Count  Product  │ │
                   │  │  1,250         1,283        Widget A │ │
                   │  └──────────────────────────────────────┘ │
                   │                                            │
                   │  ┌──────────────────────────────────────┐ │
                   │  │         Time Metrics                 │ │
                   │  │                                        │ │
                   │  │  🟢 Run Time    🔴 Downtime          │ │
                   │  │     7h 30m         30m               │ │
                   │  │                                        │ │
                   │  │  ⚠️  Speed Loss                       │ │
                   │  │     15m                               │ │
                   │  │                                        │ │
                   │  │  Last updated: 2:45:32 PM            │ │
                   │  └──────────────────────────────────────┘ │
                   │                                            │
                   │  ┌──────────────────────────────────────┐ │
                   │  │     Run State History                │ │
                   │  │                                        │ │
                   │  │  🟢 Running                           │ │
                   │  │     8:00:00 AM - 10:30:00 AM         │ │
                   │  │                                        │ │
                   │  │  🔴 Downtime                          │ │
                   │  │     10:30:00 AM - 10:45:00 AM        │ │
                   │  │                                        │ │
                   │  │  🟢 Running                           │ │
                   │  │     10:45:00 AM - 2:00:00 PM         │ │
                   │  │                                        │ │
                   │  │  🟡 Speed Loss                        │ │
                   │  │     2:00:00 PM - 2:30:00 PM          │ │
                   │  └──────────────────────────────────────┘ │
                   └────────────────────────────────────────────┘
```

### Mobile Layout (Stacked)

```
┌─────────────────────────────────────┐
│ [< Back] Realtime Machine Tracking  │
│ Dashboard • Machines • Tracking     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         Machine Info                │
│                                     │
│  ┌────────────┐                     │
│  │  [Avatar]  │  Machine Name       │
│  └────────────┘  Code: M001         │
│                                     │
│  Area: Line A                       │
│  Calendar: Standard                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Connection: CONNECTED 🟢           │
│  3 viewers watching                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         OEE Metrics                 │
│                                     │
│  OEE: 85.5%     [█████▓░░░]        │
│  Availability:  92.3%               │
│  Performance:   95.1%               │
│  Quality:       97.5%               │
└─────────────────────────────────────┘

(Continue stacking all cards vertically...)
```

## Color Scheme

### OEE Status Colors
- **World-class (≥85%)**: Green (#4caf50)
- **Typical (60-84%)**: Orange (#ff9800)
- **Poor (<60%)**: Red (#f44336)

### Run State Colors
- **Running**: Green (#008000)
- **Speed Loss**: Yellow (#FFFF00)
- **Downtime**: Red (#FF0000)

### Connection Status Colors
- **Connected**: Green (success)
- **Connecting**: Blue (info)
- **Disconnected**: Orange (warning)
- **Error**: Red (error)

## Interactive Elements

### Actions Menu in Machine List
```
┌─────────────────────────┐
│ 📊 Realtime Tracking    │  ← New item (blue/info color)
│ 📈 OEE Dashboard        │
│ ✏️  Edit                │
│ 🗑️  Delete              │
└─────────────────────────┘
```

### Back Button
- Located at top-left of page header
- Icon: Left arrow
- Text: "Back"
- Action: Navigate to `/machines`

## Real-time Indicators

### Connection Status Badge
```
┌──────────────────────────┐
│ Connection Status        │
│ ✓ CONNECTED   [badge]   │
│ 👥 3 viewers watching    │
└──────────────────────────┘
```

### Progress Bars
- OEE: Large (8px height) with color coding
- Other metrics: Medium (6px height) with default color
- Animated smooth transitions on value changes

### Last Update Time
- Format: "2:45:32 PM"
- Updates in real-time
- Located at bottom of Time Metrics card

## Responsive Breakpoints

### Desktop (md and up)
- Two-column layout (4/8 grid split)
- All cards visible at once
- Wider progress bars

### Tablet (sm to md)
- Two-column layout maintained
- Slightly compressed spacing
- Reduced font sizes

### Mobile (xs)
- Single column layout
- Cards stack vertically
- Full-width progress bars
- Compact metric display

## Loading States

### Initial Load
```
┌─────────────────────────────────┐
│     ⟳ Loading machine data...   │
└─────────────────────────────────┘
```

### Connecting to Hub
```
┌─────────────────────────────────┐
│ Connection Status                │
│ ⟳ CONNECTING   [spinner]        │
└─────────────────────────────────┘
```

### Waiting for Data
```
┌─────────────────────────────────┐
│     ⟳ Waiting for machine       │
│        data...                   │
└─────────────────────────────────┘
```

## Error States

### Connection Error
```
┌─────────────────────────────────┐
│  ⚠️  Error                       │
│  Failed to connect to machine   │
│  hub. Please try again.         │
│                      [Dismiss]  │
└─────────────────────────────────┘
```
- Displayed as Snackbar at top-right
- Auto-dismisses after 6 seconds
- Manual dismiss option

### Machine Not Found
```
┌─────────────────────────────────┐
│  ⚠️  Machine not found           │
│                                  │
│  [Back to Machines]             │
└─────────────────────────────────┘
```

## Animation & Transitions

### Page Entry
- Fade in: 300ms ease-out
- Slight slide up: 10px

### Card Transitions
- When switching tabs: 200ms ease-in-out
- Smooth fade between content

### Progress Bar Updates
- Animated value changes: 500ms ease-out
- Color transitions: 300ms

### Connection Status Changes
- Badge color fade: 300ms
- Icon rotation on connecting: 1s linear infinite

## Typography

### Headings
- Page Title: `variant="h4"` (bold)
- Card Titles: `variant="h6"` (semibold)
- Metric Labels: `variant="caption"` (uppercase, gray)

### Values
- Large OEE: `variant="h3"`
- Other Metrics: `variant="h4"` or `variant="h5"`
- Body Text: `variant="body2"`
- Timestamps: `variant="caption"`

## Icons Used

- Back Arrow: `eva:arrow-ios-forward-fill` (rotated 180°)
- Viewers: `solar:users-group-rounded-bold`
- Success: `eva:checkmark-fill`
- Warning: `solar:danger-triangle-bold-duotone`
- Spinner: `CircularProgress` component
- Run Time: `solar:play-circle-bold`
- Downtime: `solar:restart-bold`
- Speed Loss: `solar:danger-triangle-bold-duotone`

## Accessibility

- **Semantic HTML**: Proper heading hierarchy
- **ARIA Labels**: Connection status, progress bars
- **Keyboard Navigation**: All interactive elements accessible
- **Color Contrast**: WCAG AA compliant
- **Screen Reader**: Status updates announced
- **Focus Indicators**: Visible focus states

## Performance

- **Lazy Loading**: Page component loaded on demand
- **Memo Optimization**: Callbacks memoized
- **Cleanup**: SignalR connection properly closed
- **Throttling**: Updates processed efficiently
- **Bundle Size**: SignalR client adds ~80KB gzipped

## Browser Support

- Chrome: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Edge: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android 90+

## WebSocket Requirements

- WebSocket protocol support required
- Fallback to long polling (automatic via SignalR)
- HTTPS required for wss:// connections in production

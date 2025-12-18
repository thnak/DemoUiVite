# Machine Real-time Tracking - Visual Mockup

## Page Preview

This document provides a visual description of the Machine Real-time Tracking page UI.

### Page Header
```
┌───────────────────────────────────────────────────────────────────────┐
│                                                                        │
│  [← Back]  Realtime Machine Tracking                                  │
│                                                                        │
│  Dashboard  •  Machines  •  Tracking                                  │
│                                                                        │
└───────────────────────────────────────────────────────────────────────┘
```

### Main Content Area

#### Left Column - Machine Information Card
```
┌────────────────────────────────────────────┐
│                                            │
│  ┌──────────┐                              │
│  │          │                              │
│  │  [IMG]   │   Machine ABC-123            │
│  │          │   Code: M-ABC-123            │
│  └──────────┘                              │
│                                            │
│  ───────────────────────────────────────   │
│                                            │
│  Area                                      │
│  Production Line A                         │
│                                            │
│  Work Calendar                             │
│  Standard 24/7                             │
│                                            │
│  Calculation Mode                          │
│  WeightChannels                            │
│                                            │
└────────────────────────────────────────────┘
```

#### Right Column - Real-time Status Cards

##### Connection Status Card
```
┌────────────────────────────────────────────────────────────────┐
│  Connection Status                      ✓ CONNECTED [green]   │
│                                                                 │
│  👥 3 viewers watching this machine                            │
└────────────────────────────────────────────────────────────────┘
```

##### OEE Metrics Card
```
┌────────────────────────────────────────────────────────────────┐
│  OEE Metrics                                                    │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────┐│
│  │    OEE      │  │ Availability│  │ Performance │  │Quality││
│  │             │  │             │  │             │  │       ││
│  │   85.5%     │  │   92.3%     │  │   95.1%     │  │ 97.5% ││
│  │   [huge]    │  │             │  │             │  │       ││
│  │             │  │             │  │             │  │       ││
│  │ ████████░░  │  │ ████████░   │  │ █████████   │  │██████ ││
│  │  [green]    │  │             │  │             │  │       ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────┘│
└────────────────────────────────────────────────────────────────┘
```

##### Production Card
```
┌────────────────────────────────────────────────────────────────┐
│  Production                                                     │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐ │
│  │  Good Count     │  │  Total Count    │  │ Current Product││
│  │  1,250          │  │  1,283          │  │ Widget A       ││
│  │  [green large]  │  │  [large]        │  │                ││
│  └─────────────────┘  └─────────────────┘  └────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

##### Time Metrics Card
```
┌────────────────────────────────────────────────────────────────┐
│  Time Metrics                                                   │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐ │
│  │ 🟢 Run Time     │  │ 🔴 Downtime     │  │ ⚠️ Speed Loss  ││
│  │    7h 30m       │  │    30m          │  │    15m         ││
│  │  [large green]  │  │  [large red]    │  │ [large orange] ││
│  └─────────────────┘  └─────────────────┘  └────────────────┘ │
│                                                                 │
│  ────────────────────────────────────────────────────────────  │
│  Last updated: 2:45:32 PM                                      │
└────────────────────────────────────────────────────────────────┘
```

##### Run State History Card
```
┌────────────────────────────────────────────────────────────────┐
│  Run State History                                              │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 🟢 [Running]                                              │  │
│  │ 8:00:00 AM - 10:30:00 AM                                 │  │
│  │ [light background]                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 🔴 [Downtime]                                             │  │
│  │ 10:30:00 AM - 10:45:00 AM                                │  │
│  │ [light background]                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 🟢 [Running]                                              │  │
│  │ 10:45:00 AM - 2:00:00 PM                                 │  │
│  │ [light background]                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 🟡 [Speed Loss]                                           │  │
│  │ 2:00:00 PM - 2:30:00 PM                                  │  │
│  │ [light background]                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

## How to Access

### From Machine List Page

1. Navigate to `/machines`
2. Find the machine you want to track
3. Click the three-dot menu (⋮) on the right side of the machine row
4. Select "Realtime Tracking" from the dropdown menu

### Menu Options:
```
┌──────────────────────────┐
│ 📊 Realtime Tracking    │  ← Click here (info blue color)
│ 📈 OEE Dashboard        │
│ ✏️  Edit                │
│ 🗑️  Delete              │
└──────────────────────────┘
```

## Color Indicators

### OEE Status
- **Green (85%+)**: World-class performance
  - Large OEE percentage shown in green
  - Progress bar filled with green
  
- **Orange (60-84%)**: Typical industry performance
  - Large OEE percentage shown in orange
  - Progress bar filled with orange
  
- **Red (<60%)**: Low performance, needs improvement
  - Large OEE percentage shown in red
  - Progress bar filled with red

### Run States
- **🟢 Green Circle**: Running normally
- **🔴 Red Circle**: Machine down
- **🟡 Yellow Circle**: Running with speed loss

### Connection Status
- **✓ CONNECTED (Green)**: Active connection
- **⟳ CONNECTING (Blue)**: Establishing connection
- **⚠️ ERROR (Red)**: Connection failed

## Responsive Behavior

### Desktop (≥960px)
- Two-column layout
- Machine info on left (4 columns)
- Status cards on right (8 columns)
- All metrics visible at once

### Tablet (600-959px)
- Two-column layout maintained
- Slightly reduced spacing
- Smaller font sizes

### Mobile (<600px)
- Single column layout
- Machine info card first
- Status cards stacked below
- Full-width components

## Live Updates

The following elements update in real-time:

1. **Connection Status Badge** - Changes color based on connection state
2. **All OEE Metrics** - Update every second (or as configured)
3. **Production Counts** - Increment as products are produced
4. **Time Metrics** - Update continuously
5. **Run State History** - New states append to the list
6. **Last Updated Time** - Shows timestamp of most recent update

## Example Data Flow

```
Backend SignalR Hub
        ↓
   (every 1 second)
        ↓
MachineHub Service
        ↓
React Component State
        ↓
UI Updates (smooth transitions)
```

## User Experience Features

1. **Automatic Reconnection**: If connection drops, automatically attempts to reconnect
2. **Loading States**: Shows spinners while loading data
3. **Error Messages**: Displays user-friendly error notifications
4. **Subscriber Count**: See how many people are watching the same machine
5. **Smooth Animations**: Progress bars animate smoothly on value changes
6. **Back Navigation**: Easy return to machine list with back button

## Typography Scale

- **Page Title**: Large (h4) - "Realtime Machine Tracking"
- **Card Titles**: Medium (h6) - "OEE Metrics", "Production", etc.
- **Large Numbers**: Very large (h3) - OEE percentage
- **Medium Numbers**: Large (h4/h5) - Other metrics
- **Labels**: Small (caption) - "Good Count", "Area", etc.
- **Body Text**: Regular (body2) - Machine details
- **Timestamps**: Tiny (caption) - Last updated time

## Spacing Guidelines

- **Card Padding**: 24px all around
- **Grid Gaps**: 24px between cards
- **Stack Spacing**: 24px between stacked elements
- **Section Spacing**: 40px between major sections
- **Page Margins**: 40px top, 24px sides

## Theme Integration

All colors use MUI theme tokens:
- `success.main` for good metrics
- `warning.main` for medium metrics
- `error.main` for poor metrics
- `info.main` for informational elements
- `text.primary`, `text.secondary` for text
- `background.paper` for card backgrounds
- `background.neutral` for subtle backgrounds

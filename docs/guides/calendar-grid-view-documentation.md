# Calendar Grid View - Visual Documentation

## Calendar View Overview

The new Calendar View displays scheduled time periods in a traditional month calendar layout using pure MUI components with no external CSS or libraries.

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│ December 2025                                                       │
├─────────────────────────────────────────────────────────────────────┤
│  Sun      Mon      Tue      Wed      Thu      Fri      Sat         │
├────────┬────────┬────────┬────────┬────────┬────────┬────────────┤
│   30   │   1    │   2    │   3    │   4    │   5    │    6       │
│        │ 💼8.0h │ 💼8.0h │ 💼8.0h │ 💼8.0h │ 💼8.0h │            │
│        │ ⏰1.0h │ ⏰1.0h │ ⏰1.0h │ ⏰1.0h │ ⏰1.0h │            │
├────────┼────────┼────────┼────────┼────────┼────────┼────────────┤
│   7    │   8    │   9    │  10    │  11    │  12    │   13       │
│        │ 💼8.0h │ 💼8.0h │ 💼8.0h │ 💼8.0h │ 💼8.0h │            │
│        │ ⏰1.0h │ ⏰1.0h │ ⏰1.0h │ ⏰1.0h │ ⏰1.0h │            │
├────────┼────────┼────────┼────────┼────────┼────────┼────────────┤
│  14    │  15    │  16    │  17    │  18    │  19    │   20       │
│        │ 💼8.0h │ 💼8.0h │ 💼8.0h │ 💼8.0h │ 💼8.0h │            │
│        │ ⏰1.0h │ ⏰1.0h │ ⏰1.0h │ ⏰1.0h │ ⏰1.0h │            │
│        │ 🔄 OT  │        │        │        │        │            │
├────────┼────────┼────────┼────────┼────────┼────────┼────────────┤
│  21    │  22    │  23    │  24    │  25    │  26    │   27       │
│        │ 💼8.0h │ 💼8.0h │ 💼8.0h │ ⛔Stop │ 💼8.0h │            │
│        │ ⏰1.0h │ ⏰1.0h │ ⏰1.0h │        │ ⏰1.0h │            │
├────────┼────────┼────────┼────────┼────────┼────────┼────────────┤
│  28    │  29    │  30    │  31    │   1    │   2    │    3       │
│        │ 💼8.0h │ 💼8.0h │ 💼8.0h │        │        │            │
│        │ ⏰1.0h │ ⏰1.0h │ ⏰1.0h │        │        │            │
└────────┴────────┴────────┴────────┴────────┴────────┴────────────┘

Legend:
[Blue] Shift Time  [Orange] Break Time  [Light Blue] Overtime  [Red] Planned Stop
```

## Features

### 1. Calendar Grid Layout
- 7 columns (Sunday to Saturday)
- Weeks displayed in rows
- Previous/next month days shown with reduced opacity
- Each day is a MUI Card component

### 2. Day Cell Content
Each day cell displays:
- **Day number** (bold if today, highlighted with blue border)
- **Shift hours badge** (blue background with briefcase icon)
- **Break hours badge** (orange background with clock icon)
- **Overtime indicator** (light blue background with restart icon, shows "OT")
- **Planned stop indicator** (red background with trash icon, shows "Stop")

### 3. Visual Indicators

#### Badge Format
```tsx
<Box sx={{ bgcolor: 'primary.lighter', px: 0.5, py: 0.25, borderRadius: 0.5 }}>
  <Iconify icon="eva:briefcase-outline" width={14} />
  <Typography variant="caption">8.0h</Typography>
</Box>
```

#### Color Scheme
- **Shift Time**: `primary.lighter` (Blue)
- **Break Time**: `warning.lighter` (Orange)
- **Overtime**: `info.lighter` (Light Blue)
- **Planned Stop**: `error.lighter` (Red)

### 4. Interactive Elements
- **Hover Effect**: Days with scheduled time show hover background
- **Today Highlight**: Current day has blue border (2px) and bold text
- **Other Month Days**: 50% opacity for days outside selected month
- **Responsive**: Grid adapts to screen size using MUI Grid

### 5. Legend
Bottom of calendar shows color-coded legend:
```
[■] Shift Time    [■] Break Time    [■] Overtime    [■] Planned Stop
```

## MUI Components Used

All components are pure MUI, no external dependencies:
- `Card` - Day cells and container
- `Grid` - Calendar grid layout
- `Box` - Badges and layout containers
- `Typography` - Text and labels
- `Iconify` - Icons (using existing icon set)

## Responsive Behavior

- **Desktop**: Full calendar grid with all features
- **Tablet**: Calendar adapts to smaller width
- **Mobile**: Calendar grid scales proportionally

## Code Structure

```typescript
// Calendar generation
const calendarGrid = generateCalendarGrid(selectedYear, selectedMonth);

// Day cell rendering
const renderCalendarDay = (date: Date) => {
  const dayStats = statisticsByDateKey.get(dateKey) || [];
  // Calculate totals and render badges
};

// Grid rendering
<Grid container spacing={1}>
  {calendarGrid.map((week) => (
    <Grid container spacing={1}>
      {week.map((date) => (
        <Grid size={{ xs: 12 / 7 }}>
          {renderCalendarDay(date)}
        </Grid>
      ))}
    </Grid>
  ))}
</Grid>
```

## Data Flow

1. **Fetch statistics** for selected month
2. **Group by date** using YYYY-MM-DD key
3. **Generate calendar grid** with proper week boundaries
4. **Calculate daily totals** for each period type
5. **Render badges** based on available data
6. **Apply styling** using MUI theme colors

## Advantages

- ✅ **No external dependencies** - Pure MUI components
- ✅ **Theme integration** - Uses MUI theme colors automatically
- ✅ **Dark mode support** - Works with theme mode switching
- ✅ **Responsive design** - Adapts to all screen sizes
- ✅ **Minimal CSS** - All styling via MUI sx prop
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Accessible** - Proper semantic HTML structure

## Performance

- Memoized calendar grid generation
- Memoized statistics grouping
- Efficient date calculations
- No unnecessary re-renders

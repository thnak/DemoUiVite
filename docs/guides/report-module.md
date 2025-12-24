# Report Module Guide

## Overview

The Report module provides a comprehensive view of factory-wide OEE (Overall Equipment Effectiveness) metrics and a 2D visualization of the factory layout. It serves as a centralized dashboard for monitoring production performance across all areas and machines.

## Features

### 1. Bento Grid Dashboard

The main report page displays key performance indicators in a modern Bento Grid layout:

- **Overall Factory OEE**: Large card showing aggregate factory performance
- **Availability Metric**: Equipment uptime percentage
- **Performance Metric**: Speed efficiency measurement
- **Quality Metric**: Good parts ratio
- **Area-Level Metrics**: Individual performance cards for each production area

Each metric card includes:
- Current value with color-coded status
- Trend indicator (vs. last period)
- Click-through navigation to detailed reports
- Responsive layout for all screen sizes

### 2. 2D Canvas Factory Layout

Interactive canvas visualization featuring:

- **Area Visualization**: Production areas displayed as labeled sections
- **Machine Placement**: Machines positioned within their respective areas
- **Status Color Coding**:
  - 🟢 Green: Running
  - 🔴 Red: Stopped
  - 🟠 Orange: Maintenance
  - ⚫ Grey: Idle
- **Interactive Controls**:
  - Pan: Click and drag
  - Zoom: Mouse wheel or control buttons
  - Hover effects for better visibility

### 3. Quick Actions

Navigate quickly to related pages:
- Downtime Report
- Detailed OEE Report
- Machine Management
- Area Management

## Accessing the Report Module

### From Home Page
1. Navigate to the home page (`/`)
2. Click on the "Report" module card

### Direct URL
Navigate directly to `/report`

## Using the 2D Canvas

### Opening the Canvas
Click the **"View Factory Layout (2D)"** button at the top of the report page.

### Navigation Controls
- **Pan**: Click and drag anywhere on the canvas
- **Zoom In**: Click the "+" button or scroll up with mouse wheel
- **Zoom Out**: Click the "-" button or scroll down with mouse wheel
- **Reset**: Click the reset button to return to default view
- **Close**: Click the X button to close the dialog

### Reading Machine Status
Each machine displays:
- Machine name
- Current status (Running, Stopped, Maintenance, Idle)
- OEE percentage

### Interacting with Elements
- **Hover**: Move mouse over machines to see enhanced border
- **Click**: Click on machines or areas (navigation hooks ready for future implementation)

## Understanding OEE Metrics

### Overall Equipment Effectiveness (OEE)
OEE is calculated as: **Availability × Performance × Quality**

- **Availability**: Actual operating time ÷ Planned production time
- **Performance**: Actual output ÷ Standard output
- **Quality**: Good units ÷ Total units produced

### Performance Thresholds
The system uses color coding based on OEE values:
- 🟢 **≥ 85%**: Excellent (Green)
- 🟡 **70-84%**: Good (Orange/Yellow)
- 🔴 **< 70%**: Needs Improvement (Red)

## Responsive Design

The Report module is fully responsive:

### Desktop (≥ 1200px)
- Full Bento Grid with 2 columns
- Large metric cards
- All features visible

### Tablet (768px - 1199px)
- Stacked grid layout
- Medium-sized cards
- Scrollable content

### Mobile (< 768px)
- Single column layout
- Compact cards
- Touch-optimized controls

## Integration with Other Modules

### Navigation Links
- **Downtime Report**: View detailed downtime analysis
- **OEE Summary Report**: Access comprehensive OEE reports with filters
- **Machine Management**: Manage machine configurations
- **Area Management**: Configure production areas

### Click-Through Functionality
- **Metric Cards**: Click any metric card to drill down (structure ready for implementation)
- **Area Cards**: Click area cards to view area-specific reports
- **Machine Elements**: Click machines in canvas to navigate to machine details (hooks ready)

## Data Structure

### Mock Data (Current)
The module currently uses mock data for demonstration. The structure is ready for API integration.

### Factory OEE Data
```typescript
{
  overall: {
    oee: number,
    availability: number,
    performance: number,
    quality: number
  },
  areas: Array<{
    id: string,
    name: string,
    oee: number,
    availability: number,
    performance: number,
    quality: number
  }>,
  trends: {
    oee: { value: number, isPositive: boolean },
    availability: { value: number, isPositive: boolean },
    performance: { value: number, isPositive: boolean },
    quality: { value: number, isPositive: boolean }
  }
}
```

### Canvas Data
```typescript
{
  areas: Array<{
    id: string,
    name: string,
    position: { x: number, y: number },
    width: number,
    height: number,
    machines: Array<{
      id: string,
      name: string,
      position: { x: number, y: number },
      status: 'running' | 'stopped' | 'maintenance' | 'idle',
      oee: number
    }>
  }>
}
```

## Future Enhancements

### Planned Features
1. **Real-time Data**: Connect to API endpoints for live OEE updates
2. **SignalR Integration**: Real-time machine status updates
3. **Time Range Filters**: Filter metrics by date range
4. **Export Functionality**: Export reports as PDF or Excel
5. **Advanced Visualizations**: Add charts, heatmaps, and trend graphs
6. **Drill-Down Navigation**: Click machines/areas to view detailed pages
7. **Custom Layouts**: Allow users to customize canvas layout
8. **Historical Playback**: Review historical data with timeline controls

## Troubleshooting

### Canvas Not Displaying
- Ensure react-konva is installed: `npm install react-konva konva`
- Check browser console for errors
- Verify browser supports HTML5 Canvas

### Performance Issues
- Large number of machines may affect performance
- Consider pagination or virtualization for 100+ machines
- Use canvas optimization techniques for complex layouts

### Theme Issues
- Verify theme tokens are used instead of hardcoded colors
- Test in both light and dark modes
- Check theme context is properly wrapped

## Technical Details

### Dependencies
- **react-konva**: React wrapper for Konva canvas library
- **konva**: HTML5 Canvas JavaScript framework
- **framer-motion**: Animation library
- **@mui/material**: UI components

### File Structure
```
src/
├── pages/
│   └── report.tsx                    # Page component
├── sections/
│   └── report/
│       ├── components/
│       │   ├── oee-metric-card.tsx   # Metric card component
│       │   ├── factory-canvas-2d.tsx # Canvas component
│       │   └── index.ts
│       ├── view/
│       │   ├── report-view.tsx       # Main view component
│       │   └── index.ts
│       └── index.ts
└── routes/
    └── sections.tsx                  # Route registration
```

### Theme Usage
All components use theme tokens for colors:
- `theme.palette.background.*` for backgrounds
- `theme.palette.text.*` for text
- `theme.palette[color].main` for accent colors
- Proper light/dark mode support

## Best Practices

1. **Always use theme tokens** for colors
2. **Test responsive layouts** on multiple screen sizes
3. **Verify animations** are performant
4. **Ensure accessibility** with proper ARIA labels
5. **Optimize canvas rendering** for large datasets

## Related Documentation

- [Creating New Pages](./creating-new-pages.md)
- [Theme System Guidelines](../.github/copilot-instructions.md)
- [API Usage Guide](./api-usage.md)
- [Navigation Patterns](./navigation-patterns.md)

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review the implementation in `src/sections/report/`
3. Consult the project documentation

---

**Last Updated**: December 2024  
**Module Version**: 1.0.0

# Report Builder Canvas

A canvas-first report builder UI for creating multi-block reports with MUI components.

## Features

- **Entity Selection**: Choose from available entities with metadata support
- **Field Palette**: Search and add fields from the selected entity
- **Canvas Blocks**: 
  - Table blocks with configurable page size
  - Chart blocks with x/y axis configuration
- **Properties Panel**: Edit block properties (title, page size, chart type)
- **Onboarding Wizard**: 3-step guided experience for new users
- **Preview**: Execute queries and preview results
- **Local Persistence**: Save report definitions to localStorage

## How to Use

1. Navigate to `/report-builder` in the application
2. Select an entity from the dropdown or use the "Quick Start" wizard
3. Add fields from the left palette to your blocks
4. Configure blocks using the right properties panel
5. Click "Run Preview" to execute and see results
6. Click "Save" to persist your report definition to localStorage

## API Endpoints

- `GET /api/reports/metadata` - Fetch all entity metadata
- `GET /api/reports/metadata/{entityName}` - Fetch specific entity metadata
- `POST /api/reports/query/preview` - Execute preview query (limited results)
- `POST /api/reports/query/data` - Execute full query (for production use)

## Components

### src/components/report-builder/
- **Palette.tsx** - Left sidebar for browsing and adding fields
- **Canvas.tsx** - Center area for managing blocks
- **PropertiesPanel.tsx** - Right sidebar for editing block properties
- **OnboardingWizard.tsx** - 3-step wizard for new users
- **blocks/TableBlock.tsx** - Table block component
- **blocks/ChartBlock.tsx** - Chart block component (placeholder)

### src/sections/report-builder/view/
- **report-builder-canvas-view.tsx** - Main page component

### src/api/
- **report-builder-api.ts** - API client for report builder endpoints

### src/types/
- **report-builder.ts** - TypeScript type definitions

## Future Enhancements

- [ ] Filter editor UI (global and per-block)
- [ ] Drag-and-drop for fields and block reordering
- [ ] Wire ChartBlock with react-chartjs-2
- [ ] Server-side persistence for saved reports
- [ ] Join configuration UI for multi-entity reports
- [ ] Per-field type-aware editors (date pickers, numeric inputs)
- [ ] Export options (CSV, Excel, PDF)

## Development

The report builder uses:
- MUI v7 components
- TypeScript for type safety
- Existing axios instance for API calls
- UUID for block IDs
- localStorage for temporary persistence

## Testing Manually

1. Start the dev server: `npm run dev`
2. Navigate to: `http://localhost:5173/report-builder`
3. Select an entity (e.g., "MachineEntity")
4. Add fields from the palette
5. Create table and chart blocks
6. Run preview to test query execution
7. Check localStorage for saved definitions

## Storage Keys

Saved reports are stored in localStorage with keys following the pattern:
```
report:canvas:{entityName}:{timestamp}
```

Example: `report:canvas:MachineEntity:2024-12-16T02:30:00.000Z`

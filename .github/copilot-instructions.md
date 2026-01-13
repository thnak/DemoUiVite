# Copilot Instructions for Documentation

This document provides guidelines for creating and organizing documentation in this repository.

You have access to these tools. use it to search a new one icon when needed. solar doutone is priority. icon must add to src/components/iconify/icon-sets.ts ad then resuse it.
- iconify/get_all_icon_sets
- iconify/get_icon_set
- iconify/search_icons
- iconify/get_icon

## Documentation Structure

All documentation should be placed in the `docs/` folder with the following structure:

```
docs/
├── guides/         # How-to guides, tutorials, and quickstart documents
├── api/            # API documentation, OpenAPI specs, and endpoint references
└── README.md       # (if needed) Overview of documentation
```

## Folder Guidelines

### `docs/guides/`
Place the following types of documents here:
- **Quickstart guides** - Getting started instructions
- **How-to guides** - Step-by-step tutorials
- **Feature documentation** - Explaining specific features (e.g., i18n, theming)
- **Best practices** - Coding standards and patterns
- **Troubleshooting** - Common issues and solutions

Examples:
- `quickstart.md` - Getting started guide
- `i18n.md` - Internationalization documentation
- `theming.md` - Theme customization guide
- `components.md` - Component usage guide

### `docs/api/`
Place the following types of documents here:
- **OpenAPI/Swagger specs** - API definitions (JSON or YAML)
- **API reference** - Endpoint documentation
- **Schema definitions** - Data model documentation
- **Integration guides** - How to integrate with external APIs

Examples:
- `response.json` - OpenAPI specification
- `endpoints.md` - API endpoint reference
- `authentication.md` - API authentication guide

## Naming Conventions

1. Use **lowercase** with **hyphens** for file names: `my-guide.md`
2. Use descriptive names that indicate the content
3. Include file extension: `.md` for Markdown, `.json` for JSON

## Document Template

When creating a new guide, use this template:

```markdown
# [Document Title]

Brief description of what this document covers.

## Overview

High-level explanation of the topic.

## Prerequisites

- List any requirements
- Dependencies needed
- Prior knowledge assumed

## [Main Content Sections]

Detailed content with examples.

## Examples

Code examples and use cases.

## Troubleshooting

Common issues and solutions.

## Related Documentation

- [Link to related docs](./related-doc.md)
```

## Quick Reference

| Document Type | Location | Example Filename |
|--------------|----------|------------------|
| Getting started | `docs/guides/` | `quickstart.md` |
| Feature guide | `docs/guides/` | `feature-name.md` |
| Tutorial | `docs/guides/` | `how-to-xyz.md` |
| API spec | `docs/api/` | `openapi.json` |
| API reference | `docs/api/` | `endpoints.md` |

## Theme System Guidelines

This project uses a centralized theme system with `ThemeProvider` that supports light and dark modes. **All styling must use theme tokens** to ensure proper visual appearance in both modes.

### Mandatory Rules

1. **Never use hardcoded color values** - Always use theme palette tokens
2. **Never use static grey values** like `grey.800`, `#1C252E`, or similar - These break dark mode
3. **Always use semantic theme tokens** that adapt to the current color scheme

### ❌ Bad Examples (Do NOT do this)

```tsx
// WRONG: Hardcoded grey value - too dark in dark mode
<Box sx={{ bgcolor: 'grey.800' }} />

// WRONG: Hardcoded hex color
<Box sx={{ bgcolor: '#1C252E' }} />

// WRONG: Static color that doesn't adapt to theme
<Typography sx={{ color: '#454F5B' }} />
```

### ✅ Good Examples (Do this instead)

```tsx
// CORRECT: Use semantic background tokens
<Box sx={{ bgcolor: 'background.paper' }} />
<Box sx={{ bgcolor: 'background.default' }} />
<Box sx={{ bgcolor: 'background.neutral' }} />

// CORRECT: Use text palette tokens
<Typography sx={{ color: 'text.primary' }} />
<Typography sx={{ color: 'text.secondary' }} />

// CORRECT: Use action tokens for interactive states
<Box sx={{ bgcolor: 'action.hover' }} />
<Box sx={{ bgcolor: 'action.selected' }} />

// CORRECT: Use theme callback for complex styling
<Box sx={(theme) => ({ 
  bgcolor: theme.palette.background.paper,
  borderColor: theme.palette.divider 
})} />
```

### Available Theme Tokens

| Token | Purpose | Use Case |
|-------|---------|----------|
| `background.paper` | Surface backgrounds | Cards, modals, dropdowns |
| `background.default` | Page backgrounds | Main content area |
| `background.neutral` | Subtle backgrounds | Section dividers, highlights |
| `text.primary` | Main text | Headings, body text |
| `text.secondary` | Secondary text | Captions, labels |
| `text.disabled` | Disabled text | Inactive elements |
| `divider` | Border/divider color | Separators, borders |
| `action.hover` | Hover states | Interactive element hover |
| `action.selected` | Selected states | Selected items |

### Using Theme Mode

Access the current theme mode using the `useThemeMode` hook:

```tsx
import { useThemeMode } from 'src/theme';

function MyComponent() {
  const { mode, resolvedMode, setMode } = useThemeMode();
  
  // resolvedMode is always 'light' or 'dark'
  // mode can be 'light', 'dark', or 'system'
  
  return (
    <Button onClick={() => setMode('dark')}>
      Switch to Dark Mode
    </Button>
  );
}
```

### Color Palette Usage

For semantic colors, use the palette tokens:

```tsx
// Primary, secondary, info, success, warning, error colors
<Button color="primary" />
<Alert severity="success" />

// With sx prop
<Box sx={{ 
  color: 'primary.main',
  bgcolor: 'primary.lighter',
  borderColor: 'primary.dark'
}} />
```

## NOTE: this project using api service generator make sure called npm run generate:api before run build/dev

## API Service Guidelines - **MANDATORY**

**CRITICAL**: This project uses an API service generator. ALL API interactions MUST use generated services.

### ❌ Prohibited Practices
- **NEVER create custom endpoint files** like `src/api/services/machine-custom.ts`
- **NEVER write manual API calls** outside of generated services
- **NEVER create helper functions** that wrap or bypass generated services

### ✅ Required Practices
1. **Use Generated Services Only**: Import functions from `src/api/services/generated/`
2. **Missing Endpoints**: If an endpoint is not in the generated code:
   - **DO NOT** create a custom service file
   - **Request** that the API specification (`docs/api/response.json`) be updated
   - **Re-run** `npm run generate:api` after the spec is updated
3. **Image URLs**: Construct image URLs directly using `apiConfig.baseUrl`
   - Example: `${apiConfig.baseUrl}/api/Machine/${machineId}/image`
   - Do NOT create wrapper functions for image URLs

### Example: Correct Usage

```typescript
// ✅ CORRECT: Import from generated services
import {
  getapiMachinemachineIdavailableproducts,
  postapiMachinemachineIdchangeproduct,
  getapiMachinemachineIdcurrentproduct,
} from 'src/api/services/generated/machine';
import { apiConfig } from 'src/api/config';

// ✅ CORRECT: Use generated function
const products = await getapiMachinemachineIdavailableproducts(machineId, { 
  page: 1, 
  pageSize: 10 
});

// ✅ CORRECT: Construct image URL directly
const imageUrl = `${apiConfig.baseUrl}/api/Machine/${machineId}/image`;

// ❌ WRONG: Custom service file
import { getAvailableProducts } from 'src/api/services/machine-custom';

// ❌ WRONG: Manual axios call
const response = await axiosInstance.get(`/api/Machine/${id}/products`);
```

### Why This Matters
- **Consistency**: All API calls follow the same pattern
- **Type Safety**: Generated services provide accurate TypeScript types
- **Maintenance**: API changes are reflected automatically when regenerating
- **Documentation**: Generated code is self-documenting from the OpenAPI spec

## API Time Duration Standards

All time duration values in API calls **MUST** use the ISO 8601 duration format. This is a mandatory standard with no exceptions.

### ISO 8601 Duration Format

The format follows the pattern: `PnYnMnDTnHnMnS`

| Component | Description | Example |
|-----------|-------------|---------|
| `P` | Duration designator (required prefix) | `P` |
| `nY` | Number of years | `P1Y` (1 year) |
| `nM` | Number of months | `P2M` (2 months) |
| `nD` | Number of days | `P10D` (10 days) |
| `T` | Time designator (required before time components) | `PT` |
| `nH` | Number of hours | `PT2H` (2 hours) |
| `nM` | Number of minutes | `PT30M` (30 minutes) |
| `nS` | Number of seconds | `PT45S` (45 seconds) |

### Duration Display Format - **SECONDS ONLY**

**MANDATORY**: All working parameter durations (idealCycleTime, downtimeThreshold, speedLossThreshold, quantityPerCycle) **MUST** be displayed and edited in **seconds format only**.

#### Display Rules:
- **Convert ISO 8601 to seconds** for display: `PT2H30M` → `9000s` (2*3600 + 30*60)
- **Always show in seconds**: `PT45S` → `45s`
- **Use DurationTimePicker with `precision="seconds"`** for all working parameter inputs

#### Example Implementation:
```typescript
// Correct: Display in seconds
const formatDurationInSeconds = (duration: string) => {
  const totalSeconds = parseDurationToSeconds(duration);
  return `${totalSeconds}s`;
};

// Correct: Edit in seconds
<DurationTimePicker
  label="Ideal Cycle Time"
  value={idealCycleTime}
  onChange={(value) => handleChange(value)}
  precision="seconds"  // MANDATORY for working parameters
/>
```

#### Fields Requiring Seconds Format:
- `idealCycleTime` - Display and edit in seconds only
- `downtimeThreshold` - Display and edit in seconds only  
- `speedLossThreshold` - Display and edit in seconds only
- Any machine/product working parameter durations

### ✅ Correct Examples

```typescript
// API request with duration
const request = {
  timeout: "PT30S",        // 30 seconds
  cacheDuration: "PT1H",   // 1 hour
  retentionPeriod: "P30D", // 30 days
  sessionExpiry: "PT15M",  // 15 minutes
  tokenLifetime: "P1DT12H" // 1 day and 12 hours
};
```

### ❌ Incorrect Examples (Do NOT use)

```typescript
// WRONG: Using milliseconds
const request = { timeout: 30000 };

// WRONG: Using seconds as plain numbers
const request = { timeout: 30 };

// WRONG: Using string formats that are not ISO 8601
const request = { timeout: "30s", duration: "1 hour" };
```

### Why ISO 8601?

1. **Unambiguous** - No confusion between units (seconds vs milliseconds)
2. **Human-readable** - Easy to understand at a glance
3. **Standard** - Internationally recognized format
4. **Consistent** - Same format across all API endpoints

## Time Duration Input Standard

All time duration input fields **MUST** use the `DurationTimePicker` component which handles ISO 8601 duration format with 24-hour time display.

### Using DurationTimePicker

The `DurationTimePicker` component provides:
- **24-hour time format** input (e.g., 08:30, 14:45)
- **Automatic conversion** to/from ISO 8601 duration (e.g., PT8H30M)
- **User-friendly display** showing both readable format and ISO 8601
- **Consistent behavior** across all time duration inputs

### ✅ Correct Usage

```tsx
import { DurationTimePicker } from 'src/components/duration-time-picker';

// Basic usage
<DurationTimePicker
  label="Start Time"
  value={formData.startTime} // ISO 8601 format: "PT8H30M"
  onChange={(duration) => handleChange('startTime', duration)}
  fullWidth
/>

// Without helper text
<DurationTimePicker
  label="Time Offset"
  value="PT7H"
  onChange={handleTimeChange}
  showHelperText={false}
/>
```

### ❌ Incorrect Usage

```tsx
// WRONG: Using plain TextField for duration input
<TextField
  label="Start Time"
  value={formData.startTime}
  onChange={(e) => handleChange('startTime', e.target.value)}
  placeholder="PT8H30M"
/>

// WRONG: Not converting to ISO 8601 format
<TextField
  type="time"
  value="08:30" // Should be converted to "PT8H30M"
  onChange={handleChange}
/>
```

### When to Use DurationTimePicker

Use `DurationTimePicker` for:
- **Time offsets** (e.g., timezone offsets, work day start time)
- **Duration inputs** that need to be stored in ISO 8601 format
- **Any field** that accepts ISO 8601 duration in the API

**DO NOT** use for:
- Date/time pickers (use MUI DatePicker/DateTimePicker)
- Plain time of day without duration context (though it can be used)

### Component Features

| Feature | Description |
|---------|-------------|
| **Value** | Accepts and returns ISO 8601 duration string |
| **Display** | Shows 24-hour time format (HH:mm) |
| **Helper Text** | Automatically shows human-readable format and ISO 8601 |
| **Conversion** | Handles bidirectional conversion automatically |

## Important Notes

- This is a **client-side only** UI project - no server-side documentation needed
- Documentation should be beginner-friendly when possible
- Include code examples for technical documentation
- Keep documentation up to date when making code changes
- **Always follow the theme system guidelines** to ensure dark mode compatibility

## Page Layout Standards

### Create/Edit Page Layout Pattern

All create and edit pages **MUST** follow the Grid-based layout pattern for consistency. This is the standard layout structure used across the application.

#### Layout Structure

Use a **Grid container** with two main sections:
- **Left Column (4/12 width)**: Image/Media upload and related settings
- **Right Column (8/12 width)**: Form fields organized in cards

#### Example Pattern (Product Create/Edit)

```tsx
<DashboardContent>
  {/* Page Header with Breadcrumbs */}
  <Box sx={{ mb: 5 }}>
    <Typography variant="h4" sx={{ mb: 1 }}>
      {isEdit ? 'Edit product' : 'Create a new product'}
    </Typography>
    {/* Breadcrumb navigation */}
  </Box>

  <Grid container spacing={3}>
    {/* Left Section - 4/12 width */}
    <Grid size={{ xs: 12, md: 4 }}>
      <Card sx={{ p: 3 }}>
        {/* Image upload */}
        {/* Additional settings */}
      </Card>
    </Grid>

    {/* Right Section - 8/12 width */}
    <Grid size={{ xs: 12, md: 8 }}>
      <Stack spacing={3}>
        {/* Main form card */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Section Title
          </Typography>
          <Grid container spacing={3}>
            {/* Form fields */}
          </Grid>
        </Card>

        {/* Additional cards for related data */}
        
        {/* Action buttons at the bottom */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined">Cancel</Button>
          <Button variant="contained">Save</Button>
        </Box>
      </Stack>
    </Grid>
  </Grid>
</DashboardContent>
```

#### Key Guidelines

1. **Grid Layout**: Always use `Grid` container with `spacing={3}`
2. **Left Column**: Use `Grid size={{ xs: 12, md: 4 }}` for image/settings section
3. **Right Column**: Use `Grid size={{ xs: 12, md: 8 }}` with `Stack spacing={3}` for multiple cards
4. **Card Padding**: Use `sx={{ p: 3 }}` for consistent padding
5. **Section Headings**: Use `Typography variant="h6"` for card section titles
6. **Responsive**: Grid automatically stacks on mobile (`xs: 12`)
7. **Action Buttons**: Place at bottom-right with flexbox alignment

#### ❌ Do NOT Use

```tsx
// WRONG: Stacked layout without Grid
<Stack spacing={3}>
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</Stack>
```

#### ✅ Always Use

```tsx
// CORRECT: Grid-based layout
<Grid container spacing={3}>
  <Grid size={{ xs: 12, md: 4 }}>
    <Card sx={{ p: 3 }}>...</Card>
  </Grid>
  <Grid size={{ xs: 12, md: 8 }}>
    <Stack spacing={3}>
      <Card sx={{ p: 3 }}>...</Card>
      <Card sx={{ p: 3 }}>...</Card>
    </Stack>
  </Grid>
</Grid>
```

## Entity List Page Standards

All entity list pages that manage database entities (e.g., Units, Areas, Products, Calendars) **MUST** follow these patterns for consistency.

### Required Components

Every entity list page must include:

1. **Page Header with Action Buttons**
   - Title and breadcrumbs on the left
   - **Import, Export, and Add buttons on the right** in this order
   - Import and Export buttons use `variant="outlined"`
   - Add button uses `variant="contained"`
   - Button gap: `1.5`
   - Icons: `solar:cloud-upload-bold` (Import), `solar:cloud-download-bold` (Export), `mingcute:add-line` (Add)

2. **Table Row Component** (`{entity}-table-row.tsx`)
   - Checkbox for selection
   - All entity fields
   - **Single action button** with popover menu containing Edit and Delete options
   - Use `Popover` with `MenuList` for the action menu

3. **Table Toolbar Component** (`{entity}-table-toolbar.tsx`)
   - **Search input** with icon (always visible when no items selected)
   - Selection counter (visible when items are selected)
   - **Columns and Filters buttons** (visible when no items selected)
   - Delete button (visible when items are selected)
   - **DO NOT** place Import/Export buttons here - they belong in the page header

4. **List View Component** (`{entity}-list-view.tsx`)
   - Page header with title, breadcrumbs and action buttons (Import, Export, Add)
   - Breadcrumb navigation: Dashboard • Settings • {Entity Name}
   - Title format: "{Entity} List" (e.g., "Unit List", "Unit Group List")
   - Table toolbar with search and filters
   - Table with proper `TableHead` and `TableBody`
   - Checkbox column
   - Actions column with popover menu
   - Table pagination

### ❌ Don't Do This

```tsx
// WRONG: No breadcrumbs, incorrect button color, wrong button text
<Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
  <Typography variant="h4" sx={{ flexGrow: 1 }}>
    Unit Groups
  </Typography>
  <Button
    variant="contained"
    startIcon={<Iconify icon="mingcute:add-line" />}
    onClick={() => router.push('/settings/unit-groups/create')}
  >
    New Unit Group
  </Button>
</Box>
// WRONG: Import/Export buttons as icon buttons in toolbar
<Toolbar>
  <OutlinedInput placeholder="Search..." />
  <Box sx={{ display: 'flex', gap: 1 }}>
    <IconButton><Iconify icon="solar:cloud-upload-bold" /></IconButton>
    <IconButton><Iconify icon="solar:share-bold" /></IconButton>
  </Box>
</Toolbar>

// WRONG: Separate Edit and Delete buttons in Actions column
<TableCell align="right">
  <Button size="small" onClick={() => handleEdit(row.id)}>
    Edit
  </Button>
  <Button size="small" color="error" onClick={() => handleDelete(row.id)}>
    Delete
  </Button>
</TableCell>

// WRONG: No search/filter toolbar
<Card>
  <Table>...</Table>
</Card>

// WRONG: Missing Import/Export buttons in header
<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
  <Typography variant="h4">Users</Typography>
  <Button variant="contained">New user</Button>
</Box>
```

### ✅ Do This Instead

```tsx
// CORRECT: Page header with breadcrumbs and properly styled button
// CORRECT: Import/Export buttons in page header
<Box
  sx={{
    mb: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }}
>
  <Box>
    <Typography variant="h4" sx={{ mb: 1 }}>
      List
    </Typography>
    {/* Breadcrumbs */}
  </Box>
  <Box sx={{ display: 'flex', gap: 1.5 }}>
    <Button
      variant="outlined"
      color="inherit"
      startIcon={<Iconify icon="solar:cloud-upload-bold" />}
    >
      Import
    </Button>
    <Button variant="outlined" color="inherit" startIcon={<Iconify icon="solar:cloud-download-bold" />}>
      Export
    </Button>
    <Button
      variant="contained"
      color="inherit"
      startIcon={<Iconify icon="mingcute:add-line" />}
      onClick={() => router.push('/entity/create')}
    >
      New Entity
    </Button>
  </Box>
</Box>

// CORRECT: Single button with popover menu for actions
<TableCell align="right">
  <IconButton onClick={handleOpenPopover}>
    <Iconify icon="eva:more-vertical-fill" />
  </IconButton>
</TableCell>

<Popover
  open={!!openPopover}
  anchorEl={openPopover}
  onClose={handleClosePopover}
  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
>
  <MenuList disablePadding sx={{ p: 0.5, gap: 0.5, width: 140 }}>
    <MenuItem onClick={handleEditFromMenu}>
      <Iconify icon="solar:pen-bold" />
      Edit
    </MenuItem>
    <MenuItem onClick={handleDeleteFromMenu} sx={{ color: 'error.main' }}>
      <Iconify icon="solar:trash-bin-trash-bold" />
      Delete
    </MenuItem>
  </MenuList>
</Popover>

// CORRECT: Always include search/filter toolbar
<Card>
  <EntityTableToolbar
    numSelected={selected.length}
    filterName={filterName}
    onFilterName={handleFilterName}
  />
  <TableContainer>
    <Table>...</Table>
  </TableContainer>
</Card>
```

### File Structure

For an entity named "Unit":
```
src/sections/unit/
├── unit-table-row.tsx           # Row component with popover actions
├── unit-table-toolbar.tsx       # Toolbar with search and filters
├── view/
│   ├── unit-list-view.tsx       # Main list page
│   ├── unit-create-edit-view.tsx
│   └── index.ts
```

### Reference Implementation

See the following files as reference examples:
- `src/sections/unit/view/unit-list-view.tsx` - Complete example with breadcrumbs and proper styling
- `src/sections/unit/unit-table-row.tsx` - Table row with action popover menu
- `src/sections/unit/unit-table-toolbar.tsx` - Toolbar with search and filters
- `src/sections/area/area-table-row.tsx`
- `src/sections/area/area-table-toolbar.tsx`
- `src/sections/area/view/area-view.tsx`

These patterns apply to ALL entity management pages including:
- Units, Unit Groups, Unit Conversions
- Areas, Products, Machines
- Calendars, Shift Templates
- Users, Roles, Permissions
- And any other entity list pages

## Guided Tour Implementation Standard

**MANDATORY REQUIREMENT**: All create/edit pages (except dashboard pages) **MUST** include Shepherd.js guided tours to help users understand the form fields and workflow.

### When to Add Guided Tours

- ✅ **REQUIRED** for:
  - All entity create pages (e.g., `/entity-create`)
  - All entity edit pages (e.g., `/entity-edit/:id`)
  - Complex form pages with multiple fields
  - Configuration and settings pages

- ❌ **NOT REQUIRED** for:
  - Dashboard pages
  - List/table view pages
  - Simple dialog forms with 1-2 fields
  - Read-only detail pages

### Implementation Requirements

1. **Tour Button**: Add a "Help" button in the page header using `TourButton` component
2. **Tour Steps**: Create comprehensive tour steps covering all form sections
3. **Data Attributes**: Add `data-tour` attributes to all form elements
4. **Blur Overlay**: Use blur backdrop (NOT black overlay) so users can see other fields

### Standard Implementation Pattern

```tsx
import { useTour, TourButton } from 'src/components/tour';
import { myEntityTourSteps } from '../tour-steps';

export function MyEntityCreateEditView({ isEdit = false }: Props) {
  // Initialize tour
  const { startTour } = useTour({
    steps: myEntityTourSteps(isEdit),
    onComplete: () => console.log('Tour completed'),
    onCancel: () => console.log('Tour cancelled'),
  });

  return (
    <DashboardContent>
      {/* Page Header with Tour Button */}
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {isEdit ? 'Edit Entity' : 'Create Entity'}
          </Typography>
          {/* Breadcrumbs */}
        </Box>
        <TourButton onStartTour={startTour} />
      </Box>

      {/* Form with data-tour attributes */}
      <Card>
        <CardContent>
          <TextField
            label="Code"
            data-tour="entity-code"
            // ... other props
          />
          <TextField
            label="Name"
            data-tour="entity-name"
            // ... other props
          />
        </CardContent>
      </Card>
    </DashboardContent>
  );
}
```

### Tour Steps File Structure

Create a `tour-steps.ts` file in the section directory:

```typescript
// src/sections/my-entity/tour-steps.ts
import type { TourStep } from 'src/hooks/use-tour';

export const myEntityTourSteps = (isEdit: boolean): TourStep[] => [
  {
    id: 'welcome',
    title: isEdit ? 'Edit Entity Tour' : 'Create Entity Tour',
    text: 'Welcome! This tour will guide you through...',
    buttons: [
      { text: 'Skip', secondary: true },
      { text: 'Start Tour' },
    ],
  },
  {
    id: 'code',
    title: 'Entity Code',
    text: 'Enter a unique code to identify this entity.',
    attachTo: {
      element: '[data-tour="entity-code"]',
      on: 'bottom',
    },
  },
  // ... more steps for each form section
  {
    id: 'actions',
    title: 'Save Your Changes',
    text: 'Click Save to create/update the entity.',
    attachTo: {
      element: '[data-tour="entity-actions"]',
      on: 'top',
    },
    buttons: [
      { text: 'Back', secondary: true },
      { text: 'Finish' },
    ],
  },
];
```

### Tour Step Guidelines

1. **Welcome Step**: Always start with a welcome step explaining the purpose
2. **Field Steps**: Cover all major form fields and sections
3. **Action Step**: End with save/cancel actions explanation
4. **Clear Descriptions**: Provide helpful, concise descriptions (2-3 sentences max)
5. **Logical Order**: Follow the natural form fill flow
6. **Element Targeting**: Use unique `data-tour` attributes for reliable targeting

### Data Attribute Naming Convention

Use descriptive, hierarchical naming:
- `data-tour="entity-code"` - Basic field
- `data-tour="entity-dates"` - Group of related fields
- `data-tour="entity-actions"` - Action buttons section

### Reference Implementation

See complete examples:
- `src/sections/calendar/view/calendar-create-edit-view.tsx` - Calendar tour with 9 steps
- `src/sections/calendar/tour-steps.ts` - Calendar tour definitions
- `src/sections/shift-template/view/shift-template-create-edit-view.tsx` - Shift template tour with 11 steps
- `src/sections/shift-template/tour-steps.ts` - Shift template tour definitions
- `docs/guides/guided-tours.md` - Complete implementation guide
- `docs/guides/guided-tours-reference.md` - Quick reference

### Testing Checklist

Before completing a create/edit page implementation:
- [ ] Tour button appears in page header
- [ ] All form sections have `data-tour` attributes
- [ ] Tour steps are in logical order
- [ ] Tour uses blur overlay (NOT black background)
- [ ] Navigation buttons work (Skip, Back, Next, Finish)
- [ ] Tour completes successfully
- [ ] Tested in both light and dark modes
- [ ] Responsive on mobile/tablet

## Animation Standards

This project uses framer-motion for smooth, professional animations throughout the application. **All animations must follow these standards** for consistency and performance.

### Page Transition Animations

**Implementation:** All route-based page transitions use the `PageTransition` and `AnimatedOutlet` components.

**Standards:**
- **Duration:** 300ms enter, 200ms exit
- **Motion:** Fade (opacity 0 → 1 → 0) + 8px vertical slide
- **Easing:** `[0.4, 0, 0.2, 1]` for enter, `[0.4, 0, 1, 1]` for exit
- **Properties:** Only GPU-accelerated (opacity, transform)

**Documentation:** See `docs/guides/page-transitions.md`

### Module Grid/List Animations (Index Page)

**Implementation:** Module cards on the home page use staggered animations for a polished appearance.

**Standards:**
```tsx
// Container (Grid or Stack)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,  // 80ms between cards
      delayChildren: 0.1,     // Start after hero
    },
  },
};

// Individual cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Hero/Header sections
const heroVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};
```

**Usage:**
```tsx
import { motion } from 'framer-motion';

// Hero section
<motion.div
  variants={heroVariants}
  initial="hidden"
  animate="visible"
>
  <Box sx={{ /* styles */ }}>
    {/* content */}
  </Box>
</motion.div>

// Grid container
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  <Grid container>
    {items.map((item) => (
      <Grid key={item.id}>
        <motion.div variants={cardVariants}>
          {/* card content */}
        </motion.div>
      </Grid>
    ))}
  </Grid>
</motion.div>
```

### Animation Best Practices

**✅ Do:**
- Use GPU-accelerated properties only (opacity, transform)
- Keep animations under 500ms total
- Use consistent easing curves across the app
- Add `initial="hidden"` to prevent flash on mount
- Use `staggerChildren` for list/grid animations
- Test animations on slower devices

**❌ Don't:**
- Animate layout properties (width, height, margin, padding)
- Use overly long durations (> 500ms feels sluggish)
- Nest multiple AnimatePresence components unnecessarily
- Forget to test with `prefers-reduced-motion` for accessibility
- Add animations to every single element (keep it tasteful)

### Animation Performance

**GPU Acceleration:**
All animations use GPU-accelerated CSS properties:
- ✅ `opacity` - GPU accelerated
- ✅ `transform: translateY()` - GPU accelerated
- ✅ `transform: scale()` - GPU accelerated
- ❌ Avoid: `height`, `width`, `top`, `left` - CPU bound

**Bundle Impact:**
- Framer Motion is shared across the app (already in dependencies)
- Page transitions: ~2.1 KB minified
- Module animations: Negligible (reuses existing imports)

### When to Add Animations

**Required:**
- Page route transitions (handled automatically via AnimatedOutlet)
- Module/feature grids on landing/index pages
- Modal/dialog entrances and exits

**Optional (but recommended):**
- Table row hover effects (CSS transitions)
- Button hover/press states (CSS transitions)
- Loading states (use CircularProgress or skeleton)
- Data transitions (charts updating, counters changing)

**Not recommended:**
- Every single component (creates visual noise)
- Form inputs during typing (distracting)
- Rapid state changes (loading → content → loading)

### Reference Examples

**Page Transitions:**
- `src/components/page-transition/page-transition.tsx`
- `src/routes/components/animated-outlet.tsx`

**Module Grid Animations:**
- `src/sections/index-page/designs/index-design-4.tsx`

**Documentation:**
- `docs/guides/page-transitions.md` - Complete animation guide

## Color Selector Standard - MuiColorInput

**MANDATORY**: All entities with color fields (hexColor, colorHex) **MUST** use the `MuiColorInput` component for color selection.

### Package Information

- **Package**: `mui-color-input` (v4.0.0+)
- **Import**: `import { MuiColorInput } from 'mui-color-input';`
- **Documentation**: https://viclafouch.github.io/mui-color-input/

### Required Implementation

**In Create/Edit Views:**

```typescript
import { MuiColorInput } from 'mui-color-input';

// Form state
const [formData, setFormData] = useState({
  // ... other fields
  hexColor: currentEntity?.hexColor || '#1976d2', // Default MUI blue
});

// Color change handler
const handleColorChange = useCallback(
  (newColor: string) => {
    setFormData((prev) => ({
      ...prev,
      hexColor: newColor,
    }));
    clearFieldError('hexColor');
  },
  [clearFieldError]
);

// In form JSX
<Box>
  <Typography variant="subtitle2" sx={{ mb: 1 }}>
    Color
  </Typography>
  <MuiColorInput
    fullWidth
    format="hex"
    value={formData.hexColor}
    onChange={handleColorChange}
    error={hasError('hexColor')}
    helperText={getFieldErrorMessage('hexColor') || 'Choose a color to represent this entity'}
  />
  <Box
    sx={{
      mt: 2,
      p: 2,
      bgcolor: formData.hexColor,
      borderRadius: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 60,
    }}
  >
    <Typography
      variant="body2"
      sx={{
        color: 'white',
        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        fontWeight: 'medium',
      }}
    >
      Preview: {formData.name || 'Entity Name'}
    </Typography>
  </Box>
</Box>
```

**In List Views (Table Rows):**

```typescript
// Add to table row type
export type EntityProps = {
  id: string;
  name: string;
  hexColor?: string; // or colorHex depending on API
  // ... other fields
};

// In TableRow component
<TableCell>
  {row.hexColor && (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: 0.5,
          bgcolor: row.hexColor,
          border: '1px solid',
          borderColor: 'divider',
        }}
      />
      <Typography variant="body2" noWrap>
        {row.hexColor}
      </Typography>
    </Box>
  )}
</TableCell>
```

**In Table Head:**

```typescript
// Add color column to headLabel array
const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'color', label: 'Color', width: 180 },
  { id: 'description', label: 'Description' },
  { id: '', label: '' },
];
```

### Entities Requiring Color Selector

The following entities **MUST** have color selectors and color columns:

1. **Area** (`hexColor`) - For area-based visual theming
2. **Defect Reason** (`colorHex`) - For defect categorization
3. **Defect Reason Group** (`colorHex`) - For group identification
4. **Stop Machine Reason** (`colorHex`) - For stop reason visualization
5. **Stop Machine Reason Group** (`colorHex`) - For group categorization
6. **Time Block Name** (`colorHex`) - For timeline visualization

### Standard Pattern

✅ **DO:**
- Use `MuiColorInput` with `format="hex"`
- Provide default color `#1976d2` (MUI primary blue)
- Show live preview box below color picker
- Display color swatch + hex value in list views
- Add color column to table (width: 180)

❌ **DON'T:**
- Use custom color pickers or `<input type="color">`
- Skip the preview box in create/edit forms
- Omit color column from list views
- Use different default colors across entities

### Example Reference

See implementation in:
- `src/sections/area/view/area-create-edit-view.tsx` - Color picker with preview
- `src/sections/defect-reason/defect-reason-table-row.tsx` - Color column display

## Your tools
-- Use the mui-mcp server to answer any MUI questions --
- 1. call the "useMuiDocs" tool to fetch the docs of the package relevant in the question
- 2. call the "fetchDocs" tool to fetch any additional docs if needed using ONLY the URLs present in the returned content.
- 3. repeat steps 1-2 until you have fetched all relevant docs for the given question
- 4. use the fetched content to answer the question

## React Compiler Standards - **MANDATORY**

This project uses **React Compiler** (babel-plugin-react-compiler@1.0.0) for automatic optimization. All code must be React Compiler compatible.

### Configuration

**vite.config.ts:**
```typescript
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { target: '19' }]],
      },
    }),
  ],
});
```

### React Compiler Rules

#### ❌ Prohibited Patterns

1. **setState in useEffect** - Causes cascading renders
```typescript
// WRONG: setState directly in useEffect
useEffect(() => {
  if (data) {
    setItems(data.items);
  }
}, [data]);
```

2. **setState in useMemo** - Causes infinite loops
```typescript
// WRONG: setState inside useMemo
const value = useMemo(() => {
  if (condition) {
    setState(newValue); // ERROR!
  }
  return computedValue;
}, [condition]);
```

3. **`this` keyword** - Not supported by React Compiler
```typescript
// WRONG: Using `this` in callbacks
action(this: any) { 
  this.next(); // ERROR!
}
```

4. **Partial dependencies in useCallback** - Compiler infers full objects
```typescript
// WRONG: Using object?.id instead of full object
const handleSubmit = useCallback(() => {
  if (currentItem?.id) { /* ... */ }
}, [formData, currentItem?.id]); // ERROR: Use currentItem, not currentItem?.id
```

#### ✅ Correct Patterns

1. **Derive state with useMemo** - For transforming query data
```typescript
// CORRECT: Derive state from props/queries
const items = useMemo(() => {
  if (!data) return [];
  return data.items.map(item => ({
    id: item.id,
    name: item.name,
  }));
}, [data]);
```

2. **Initialize state with useMemo** - For form initialization
```typescript
// CORRECT: Compute initial state
const initialFormData = useMemo(() => {
  if (isEdit && currentData) {
    return {
      name: currentData.name || '',
      code: currentData.code || '',
    };
  }
  return { name: '', code: '' };
}, [isEdit, currentData]);

const [formData, setFormData] = useState(initialFormData);
```

3. **Full object dependencies** - In useCallback
```typescript
// CORRECT: Use full object reference
const handleSubmit = useCallback(() => {
  if (currentItem?.id) { /* ... */ }
}, [formData, currentItem]); // Full object, not currentItem?.id
```

4. **Closure instead of `this`** - For callbacks
```typescript
// CORRECT: Use closure to access instance
action() {
  const instance = instanceRef.current;
  if (instance) instance.next();
}
```

5. **Query loading state** - Use isLoading from query
```typescript
// CORRECT: Use query's loading state directly
const { data, isLoading } = useGetData(id, { enabled: !!id });

// WRONG: Manually tracking loading
const [isLoading, setIsLoading] = useState(true);
useEffect(() => {
  if (data) setIsLoading(false); // ERROR!
}, [data]);
```

### Common Refactoring Patterns

#### Pattern 1: Transform Query Data

**Before:**
```typescript
const [items, setItems] = useState([]);
const { data } = useGetItems();

useEffect(() => {
  if (data) {
    setItems(data.items.map(/* transform */));
  }
}, [data]);
```

**After:**
```typescript
const { data } = useGetItems();

const items = useMemo(() => {
  if (!data) return [];
  return data.items.map(/* transform */);
}, [data]);
```

#### Pattern 2: Form Initialization

**Before:**
```typescript
const [formData, setFormData] = useState({ name: '' });
useEffect(() => {
  if (isEdit && currentData) {
    setFormData({ name: currentData.name });
  }
}, [isEdit, currentData]);
```

**After:**
```typescript
const initialFormData = useMemo(() => {
  if (isEdit && currentData) {
    return { name: currentData.name };
  }
  return { name: '' };
}, [isEdit, currentData]);

const [formData, setFormData] = useState(initialFormData);
```

#### Pattern 3: Loading States

**Before:**
```typescript
const [isLoading, setIsLoading] = useState(true);
const { data } = useGetData();

useEffect(() => {
  if (data) setIsLoading(false);
}, [data]);
```

**After:**
```typescript
const { data, isLoading } = useGetData();
// Use isLoading directly from query
```

### Exceptions

Some patterns may trigger warnings but are legitimate:

1. **External system synchronization** (rare) - Generated codes from API
2. **LocalStorage sync on mount** - One-time initialization

For these cases, document why the pattern is necessary with a comment.

### Testing React Compiler Compatibility

Run ESLint to check compatibility:
```bash
npm run lint
```

React Compiler errors are prefixed with `react-hooks/`:
- `react-hooks/set-state-in-effect`
- `react-hooks/preserve-manual-memoization`
- `react-hooks/unsupported-syntax`
- `react-hooks/set-state-in-render`

### Benefits

- **Automatic memoization** - No manual `useMemo`/`useCallback` needed for compatible components
- **Better performance** - Reduces unnecessary re-renders
- **Future-proof** - Ready for React 19+ optimizations
- **Type-safe** - Works seamlessly with TypeScript

### Documentation

See `REACT_COMPILER_IMPLEMENTATION.md` for complete implementation details.


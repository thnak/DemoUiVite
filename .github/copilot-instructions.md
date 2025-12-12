# Copilot Instructions for Documentation

This document provides guidelines for creating and organizing documentation in this repository.

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

1. **Table Row Component** (`{entity}-table-row.tsx`)
   - Checkbox for selection
   - All entity fields
   - **Single action button** with popover menu containing Edit and Delete options
   - Use `Popover` with `MenuList` for the action menu

2. **Table Toolbar Component** (`{entity}-table-toolbar.tsx`)
   - **Search input** with icon (always visible when no items selected)
   - Selection counter (visible when items are selected)
   - **Columns and Filters buttons** (visible when no items selected)
   - Delete button (visible when items are selected)

3. **List View Component** (`{entity}-list-view.tsx`)
   - Page header with title and "New {Entity}" button
   - Table toolbar
   - Table with proper `TableHead` and `TableBody`
   - Checkbox column
   - Table pagination

### ❌ Don't Do This

```tsx
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
```

### ✅ Do This Instead

```tsx
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
- `src/sections/area/area-table-row.tsx`
- `src/sections/area/area-table-toolbar.tsx`
- `src/sections/area/view/area-view.tsx`

These patterns apply to ALL entity management pages including:
- Units, Unit Groups, Unit Conversions
- Areas, Products, Machines
- Calendars, Shift Templates
- Users, Roles, Permissions
- And any other entity list pages

## Your tools
-- Use the mui-mcp server to answer any MUI questions --
- 1. call the "useMuiDocs" tool to fetch the docs of the package relevant in the question
- 2. call the "fetchDocs" tool to fetch any additional docs if needed using ONLY the URLs present in the returned content.
- 3. repeat steps 1-2 until you have fetched all relevant docs for the given question
- 4. use the fetched content to answer the question

# Creating New Pages

This guide provides a complete checklist and instructions for adding new pages to the application.

> **📋 For Master Data List Pages**: If you're creating a master data list page (Products, Machines, Defects, etc.), please refer to the [Master Data List Pattern](./master-data-list-pattern.md) guide for detailed implementation standards.

## Quick Checklist

When creating a new page, follow these steps in order:

- [ ] Create the page component in `src/pages/`
- [ ] Create the view component in `src/sections/` (if needed)
- [ ] Register the route in `src/routes/sections.tsx`
- [ ] Add navigation menu item in `src/layouts/nav-config-dashboard.tsx`
- [ ] Add translation keys in `src/locales/langs/*.json`
- [ ] Test the page in development mode
- [ ] Build and verify production bundle

## Step-by-Step Guide

### Step 1: Create the Page Component

Create a new file in `src/pages/` with a descriptive name using kebab-case (e.g., `my-feature.tsx`).

**Basic page template:**

```tsx
import { CONFIG } from 'src/config-global';

import { MyFeatureView } from 'src/sections/my-feature/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`My Feature - ${CONFIG.appName}`}</title>

      <MyFeatureView />
    </>
  );
}
```

**Key points:**
- Default export a function named `Page`
- Set the document title using the `<title>` tag
- Import and render the view component from `src/sections/`
- Use `CONFIG.appName` for consistent branding

### Step 2: Create the View Component

Create a corresponding view in `src/sections/my-feature/view/`:

```tsx
// src/sections/my-feature/view/my-feature-view.tsx
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export function MyFeatureView() {
  const [data, setData] = useState([]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          My Feature
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Typography>Your feature content goes here</Typography>
        </CardContent>
      </Card>
    </DashboardContent>
  );
}
```

**Key points:**
- Wrap content with `<DashboardContent>` for consistent layout
- Use MUI components for UI elements
- Follow the existing pattern in other sections for consistency

**Export the view:**

```tsx
// src/sections/my-feature/view/index.ts
export { MyFeatureView } from './my-feature-view';
```

### Step 3: Register the Route

Add your page to the routing configuration in `src/routes/sections.tsx`:

```tsx
// 1. Import the page (lazy loaded)
export const MyFeaturePage = lazy(() => import('src/pages/my-feature'));

// 2. Add the route in the children array of DashboardLayout
export const routesSection: RouteObject[] = [
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      // ... existing routes
      { path: 'my-feature', element: <MyFeaturePage /> },
      // For pages with dynamic parameters:
      { path: 'my-feature/:id/edit', element: <MyFeatureEditPage /> },
    ],
  },
  // ... other route groups
];
```

**Route patterns:**
- List page: `{ path: 'my-feature', element: <MyFeaturePage /> }`
- Create page: `{ path: 'my-feature/create', element: <MyFeatureCreatePage /> }`
- Edit page: `{ path: 'my-feature/:id/edit', element: <MyFeatureEditPage /> }`
- Detail page: `{ path: 'my-feature/:id', element: <MyFeatureDetailPage /> }`

### Step 4: Add Navigation Menu Item

Update `src/layouts/nav-config-dashboard.tsx` to add your page to the navigation:

```tsx
export function useNavData(): NavData {
  const { t } = useTranslation();

  return [
    // ... existing groups
    {
      subheader: t('nav.management'),
      items: [
        // ... existing items
        {
          title: t('nav.myFeature'),
          path: '/my-feature',
          icon: icon('ic-analytics'), // Choose appropriate icon
        },
      ],
    },
  ];
}
```

**Icon options:**
- Icons are located in `public/assets/icons/navbar/`
- Available icons: `ic-analytics`, `ic-user`, `ic-cart`, `ic-blog`, `ic-lock`, `ic-disabled`
- You can add custom SVG icons to the navbar folder
- Use the Iconify library for additional icons (see [external-resource.md](./external-resource.md))

**Adding badges/labels:**

```tsx
{
  title: t('nav.myFeature'),
  path: '/my-feature',
  icon: icon('ic-analytics'),
  info: (
    <Label color="error" variant="inverted">
      NEW
    </Label>
  ),
}
```

### Step 5: Add Translation Keys

Add translation keys for your menu item in all language files:

**English (`src/locales/langs/en.json`):**
```json
{
  "nav": {
    "myFeature": "My Feature"
  }
}
```

**Vietnamese (`src/locales/langs/vi.json`):**
```json
{
  "nav": {
    "myFeature": "Tính năng của tôi"
  }
}
```

### Step 6: Test Your Page

Start the development server:

```bash
npm run dev
```

Navigate to your new page:
- Open browser at `http://localhost:3039/my-feature`
- Check the navigation menu for your new item
- Verify the page renders correctly
- Test language switching

### Step 7: Build and Verify

Build the production bundle:

```bash
npm run build
```

Verify no errors occur during the build process.

## Advanced Patterns

### Creating Page Variants

**List/Create/Edit Pattern:**

```tsx
// src/pages/my-feature.tsx (list page)
export default function Page() {
  return (
    <>
      <title>{`My Features - ${CONFIG.appName}`}</title>
      <MyFeatureListView />
    </>
  );
}

// src/pages/my-feature-create.tsx (create page)
export default function Page() {
  return (
    <>
      <title>{`Create My Feature - ${CONFIG.appName}`}</title>
      <MyFeatureCreateEditView />
    </>
  );
}

// src/pages/my-feature-edit.tsx (edit page)
export default function Page() {
  return (
    <>
      <title>{`Edit My Feature - ${CONFIG.appName}`}</title>
      <MyFeatureCreateEditView />
    </>
  );
}
```

### Adding Breadcrumbs

Use the navigation context in your view:

```tsx
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

export function MyFeatureView() {
  const navigate = useNavigate();

  return (
    <DashboardContent>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
          Home
        </Link>
        <Typography>My Feature</Typography>
      </Breadcrumbs>
      {/* ... rest of content */}
    </DashboardContent>
  );
}
```

### Using Route Parameters

Access route parameters with `useParams`:

```tsx
import { useParams } from 'react-router-dom';

export function MyFeatureEditView() {
  const { id } = useParams();

  // Use id to fetch data
  const { data } = useMyFeatureQuery(id);

  return <DashboardContent>{/* ... */}</DashboardContent>;
}
```

## Common Pitfalls

### ❌ Don't

```tsx
// Don't: Hardcode the app name
<title>My Feature - Demo App</title>

// Don't: Use inline styles
<div style={{ padding: '20px' }}>Content</div>

// Don't: Skip translation keys
<Typography>My Feature</Typography> // Hard-coded text
```

### ✅ Do

```tsx
// Do: Use CONFIG for app name
<title>{`My Feature - ${CONFIG.appName}`}</title>

// Do: Use MUI sx prop for styling
<Box sx={{ p: 2.5 }}>Content</Box>

// Do: Use translation keys
<Typography>{t('myFeature.title')}</Typography>
```

## File Naming Conventions

- **Pages:** kebab-case, e.g., `my-feature.tsx`, `user-profile.tsx`
- **Components:** kebab-case for files, PascalCase for exports
- **Directories:** kebab-case, e.g., `my-feature/`, `user-profile/`

## Related Documentation

- [Master Data List Pattern](./master-data-list-pattern.md) - **Standard UI pattern for list pages**
- [Navigation Menu Patterns](./navigation-patterns.md) - Advanced navigation configuration
- [App Bar Patterns](./appbar-patterns.md) - Custom app bar configurations
- [i18n Guide](./i18n.md) - Internationalization details
- [External Resources](./external-resource.md) - Using external components and icons

## Example: Complete Feature

Here's a complete example of adding a "Tasks" feature:

**1. Create page (`src/pages/tasks.tsx`):**
```tsx
import { CONFIG } from 'src/config-global';
import { TasksView } from 'src/sections/tasks/view';

export default function Page() {
  return (
    <>
      <title>{`Tasks - ${CONFIG.appName}`}</title>
      <TasksView />
    </>
  );
}
```

**2. Create view (`src/sections/tasks/view/tasks-view.tsx`):**
```tsx
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DashboardContent } from 'src/layouts/dashboard';

export function TasksView() {
  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">Tasks</Typography>
      </Box>
      {/* Task content */}
    </DashboardContent>
  );
}
```

**3. Register route (`src/routes/sections.tsx`):**
```tsx
export const TasksPage = lazy(() => import('src/pages/tasks'));

// In children array:
{ path: 'tasks', element: <TasksPage /> }
```

**4. Add to navigation (`src/layouts/nav-config-dashboard.tsx`):**
```tsx
{
  title: t('nav.tasks'),
  path: '/tasks',
  icon: icon('ic-analytics'),
}
```

**5. Add translations:**
```json
// en.json
{ "nav": { "tasks": "Tasks" } }

// vi.json
{ "nav": { "tasks": "Nhiệm vụ" } }
```

Done! Your new page is now accessible at `/tasks` with navigation menu integration.

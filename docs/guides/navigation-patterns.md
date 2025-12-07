# Navigation Menu Patterns

This guide explains different navigation menu patterns and when to use or hide the navigation menu for specific pages.

## Overview

The application supports flexible navigation patterns:
- **Full navigation** - Standard pages with sidebar navigation (default)
- **No navigation** - Pages without sidebar (e.g., authentication pages)
- **Conditional navigation** - Navigation visibility based on user state or context

## Navigation Layouts

### 1. Dashboard Layout (With Navigation)

Most application pages use the `DashboardLayout` which includes:
- Vertical sidebar navigation (desktop)
- Mobile hamburger menu
- Header with search, theme toggle, language selector, etc.

**When to use:**
- Main application pages
- Administrative interfaces
- User management pages
- Data entry and list views

**Example:**

```tsx
// src/routes/sections.tsx
{
  element: (
    <DashboardLayout>
      <Suspense fallback={renderFallback()}>
        <Outlet />
      </Suspense>
    </DashboardLayout>
  ),
  children: [
    { path: 'dashboard', element: <DashboardPage /> },
    { path: 'users', element: <UsersPage /> },
    // ... other pages with navigation
  ],
}
```

### 2. Auth Layout (No Navigation)

Authentication pages use `AuthLayout` which provides:
- Logo and branding
- Centered content area
- No sidebar navigation
- Minimal header

**When to use:**
- Sign in / Sign up pages
- Password reset pages
- Email verification pages
- Onboarding flows

**Example:**

```tsx
// src/routes/sections.tsx
{
  path: 'sign-in',
  element: (
    <AuthLayout>
      <SignInPage />
    </AuthLayout>
  ),
}
```

### 3. Minimal Layout (No Navigation, No Header)

For completely standalone pages with no chrome.

**When to use:**
- Error pages (404, 500)
- Splash screens
- Print-optimized pages
- Embedded/iframe content

**Example:**

```tsx
// src/routes/sections.tsx
{
  path: '404',
  element: <Page404 />, // No layout wrapper
}
```

## Customizing Navigation Visibility

### Hiding Navigation for Specific Routes

To hide navigation for a page while keeping the header:

```tsx
import { DashboardLayout } from 'src/layouts/dashboard';

// Option 1: Create a separate route group without DashboardLayout
{
  path: 'my-standalone-page',
  element: <MyStandalonePage />,
}

// Option 2: Use DashboardLayout with custom props (if supported)
{
  element: (
    <DashboardLayout slotProps={{ /* custom config */ }}>
      <Outlet />
    </DashboardLayout>
  ),
  children: [
    { path: 'my-page', element: <MyPage /> },
  ],
}
```

### Conditional Navigation Items

Show/hide navigation items based on user permissions or features:

```tsx
// src/layouts/nav-config-dashboard.tsx
import { useTranslation } from 'react-i18next';

export function useNavData(): NavData {
  const { t } = useTranslation();
  // Add your auth/permission hook here
  // const { user, permissions } = useAuth();

  const items: NavItem[] = [
    {
      title: t('nav.dashboard'),
      path: '/',
      icon: icon('ic-analytics'),
    },
  ];

  // Conditionally add admin-only items
  // if (user?.role === 'admin') {
  //   items.push({
  //     title: t('nav.users'),
  //     path: '/users',
  //     icon: icon('ic-user'),
  //   });
  // }

  return [
    {
      subheader: t('nav.overview'),
      items,
    },
  ];
}
```

### Dynamic Navigation Based on Features

```tsx
export function useNavData(): NavData {
  const { t } = useTranslation();
  // const { features } = useFeatureFlags();

  return [
    {
      subheader: t('nav.management'),
      items: [
        // Always visible
        {
          title: t('nav.dashboard'),
          path: '/',
          icon: icon('ic-analytics'),
        },
        // Conditionally visible based on feature flag
        // ...(features.includes('advanced-analytics') ? [{
        //   title: t('nav.advancedAnalytics'),
        //   path: '/advanced-analytics',
        //   icon: icon('ic-analytics'),
        // }] : []),
      ],
    },
  ];
}
```

## Navigation Menu Configuration

### Menu Structure

The navigation menu is configured in `src/layouts/nav-config-dashboard.tsx`:

```tsx
export type NavItem = {
  title: string;      // Display name
  path: string;       // Route path
  icon: React.ReactNode;  // Icon component
  info?: React.ReactNode; // Optional badge/label
};

export type NavGroup = {
  subheader: string;  // Group title
  items: NavItem[];   // Menu items in this group
};

export type NavData = NavGroup[];
```

### Adding Navigation Groups

```tsx
export function useNavData(): NavData {
  const { t } = useTranslation();

  return [
    {
      subheader: t('nav.overview'),
      items: [
        { title: t('nav.dashboard'), path: '/', icon: icon('ic-analytics') },
      ],
    },
    {
      subheader: t('nav.management'),
      items: [
        { title: t('nav.users'), path: '/users', icon: icon('ic-user') },
        { title: t('nav.products'), path: '/products', icon: icon('ic-cart') },
      ],
    },
    // Add more groups...
  ];
}
```

### Adding Badges and Labels

```tsx
import { Label } from 'src/components/label';

{
  title: t('nav.products'),
  path: '/products',
  icon: icon('ic-cart'),
  info: (
    <Label color="error" variant="inverted">
      NEW
    </Label>
  ),
}

// Other badge examples:
info: <Label color="info">BETA</Label>
info: <Label color="success">+3</Label>
info: <Label color="warning">!</Label>
```

## Custom Navigation Patterns

### Nested Navigation

For hierarchical menu structures:

```tsx
// Note: Current implementation uses flat structure
// For nested navigation, you would need to extend the NavItem type
// and update the Nav component to support children

type NavItemWithChildren = NavItem & {
  children?: NavItem[];
};
```

### External Links

Add external links to the navigation:

```tsx
{
  title: 'Documentation',
  path: 'https://example.com/docs',
  icon: icon('ic-blog'),
  // Note: You may need to update the Nav component to handle external URLs
  // by checking if path starts with 'http' and using <a> instead of <Link>
}
```

### Icons from Different Sources

```tsx
// Using SVG icons from public folder
const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} />
);

// Using Iconify icons
import { Icon } from '@iconify/react';

const iconifyIcon = (name: string) => <Icon icon={name} width={24} />;

{
  title: 'Dashboard',
  path: '/',
  icon: iconifyIcon('mdi:dashboard'),
}
```

## Mobile Navigation

The navigation automatically adapts for mobile:

- **Desktop** (`>= lg` breakpoint): Permanent sidebar
- **Mobile** (`< lg` breakpoint): Hamburger menu with drawer

Configuration in `src/layouts/dashboard/layout.tsx`:

```tsx
export function DashboardLayout({
  layoutQuery = 'lg', // Breakpoint for mobile/desktop switch
  // ...
}: DashboardLayoutProps) {
  // ...

  return (
    <>
      {/* Desktop navigation */}
      <NavDesktop data={navData} layoutQuery={layoutQuery} />

      {/* Mobile navigation */}
      <NavMobile data={navData} open={open} onClose={onClose} />
    </>
  );
}
```

## Navigation Component Customization

### Customizing the Navigation UI

The navigation components are in `src/layouts/dashboard/nav.tsx`:

```tsx
// Customize navigation width
const NAV_WIDTH = 280; // Default width in pixels

// Customize navigation colors (in theme)
// See src/theme/ for theme customization
```

### Workspace Selector

Add workspace/organization selector to navigation:

```tsx
// src/layouts/nav-config-workspace.tsx
export const _workspaces = [
  { id: '1', name: 'Workspace 1', logo: '/path/to/logo1.svg' },
  { id: '2', name: 'Workspace 2', logo: '/path/to/logo2.svg' },
];

// Then in layout:
<NavDesktop data={navData} workspaces={_workspaces} />
```

## Best Practices

### ✅ Do

- Group related navigation items under meaningful subheaders
- Use consistent icon styles throughout the navigation
- Add translation keys for all navigation labels
- Keep the navigation hierarchy shallow (max 2 levels)
- Use badges sparingly for important notifications only
- Test navigation on both mobile and desktop

### ❌ Don't

- Don't create too many navigation groups (max 4-5)
- Don't use overly long navigation item names
- Don't hardcode navigation text (always use i18n)
- Don't add navigation items for pages users can't access
- Don't nest navigation more than 2 levels deep

## Examples

### Example 1: Admin-Only Navigation

```tsx
export function useNavData(): NavData {
  const { t } = useTranslation();
  // Uncomment when you have auth:
  // const { user } = useAuth();
  // const isAdmin = user?.role === 'admin';

  const baseItems = [
    {
      title: t('nav.dashboard'),
      path: '/',
      icon: icon('ic-analytics'),
    },
    {
      title: t('nav.products'),
      path: '/products',
      icon: icon('ic-cart'),
    },
  ];

  // const adminItems = isAdmin ? [
  //   {
  //     title: t('nav.users'),
  //     path: '/users',
  //     icon: icon('ic-user'),
  //   },
  // ] : [];

  return [
    {
      subheader: t('nav.management'),
      items: [
        ...baseItems,
        // ...adminItems,
      ],
    },
  ];
}
```

### Example 2: Feature-Flagged Navigation

```tsx
export function useNavData(): NavData {
  const { t } = useTranslation();
  // const { features } = useFeatureFlags();

  return [
    {
      subheader: t('nav.overview'),
      items: [
        {
          title: t('nav.dashboard'),
          path: '/',
          icon: icon('ic-analytics'),
        },
        // Uncomment when implementing feature flags:
        // ...(features.includes('beta-dashboard') ? [{
        //   title: t('nav.betaDashboard'),
        //   path: '/beta-dashboard',
        //   icon: icon('ic-analytics'),
        //   info: <Label color="warning">BETA</Label>,
        // }] : []),
      ],
    },
  ];
}
```

### Example 3: Standalone Page (No Navigation)

```tsx
// src/pages/print-invoice.tsx
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Page() {
  return (
    <Box sx={{ p: 4 }}>
      <title>Invoice</title>
      <Typography variant="h4">Invoice #12345</Typography>
      {/* Print-optimized content */}
    </Box>
  );
}

// src/routes/sections.tsx
{
  path: 'invoice/:id/print',
  element: <PrintInvoicePage />, // No layout wrapper
}
```

## Related Documentation

- [Creating New Pages](./creating-new-pages.md) - Complete guide to adding pages
- [App Bar Patterns](./appbar-patterns.md) - Header customization patterns
- [i18n Guide](./i18n.md) - Translation keys for navigation
- [External Resources](./external-resource.md) - Icon libraries and resources

## Troubleshooting

### Navigation Item Not Visible

1. Check that the path matches the route in `src/routes/sections.tsx`
2. Verify translation keys exist in all language files
3. Ensure the icon file exists in `public/assets/icons/navbar/`
4. Check for conditional rendering logic that might hide the item

### Mobile Menu Not Working

1. Verify `layoutQuery` prop is set correctly in `DashboardLayout`
2. Check that `MenuButton` component is rendered in the header
3. Ensure `NavMobile` component receives correct `open` and `onClose` props

### Navigation Styling Issues

1. Review theme customization in `src/theme/`
2. Check CSS variables in `src/layouts/dashboard/css-vars.ts`
3. Verify responsive breakpoints in MUI theme configuration

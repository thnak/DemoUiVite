# App Bar Patterns

This guide explains different app bar (header) patterns and how to customize or hide the app bar for specific pages.

## Overview

The app bar is the header section that typically contains:
- Logo or menu button
- Search functionality
- Theme mode toggle
- Language selector
- Notifications
- User account menu

Different pages may require different app bar configurations or no app bar at all.

## App Bar Layouts

### 1. Full App Bar (Dashboard Layout)

The standard app bar includes all interactive elements.

**Features:**
- Left: Menu button (mobile) / Logo (desktop)
- Center: (optional content area)
- Right: Search, theme toggle, language, notifications, account

**When to use:**
- Main application pages
- Pages with full functionality
- Authenticated user interfaces

**Implementation:**

```tsx
// src/layouts/dashboard/layout.tsx
const renderHeader = () => {
  const headerSlots = {
    leftArea: (
      <>
        <MenuButton onClick={onOpen} sx={{ /* ... */ }} />
        <NavMobile data={navData} open={open} onClose={onClose} />
      </>
    ),
    rightArea: (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.75 } }}>
        <Searchbar />
        <ThemeModeToggle />
        <LanguagePopover data={_langs} />
        <NotificationsPopover data={_notifications} />
        <AccountPopover data={_account} />
      </Box>
    ),
  };

  return <HeaderSection slots={headerSlots} />;
};
```

### 2. Minimal App Bar (Auth Layout)

A simplified header for authentication pages.

**Features:**
- Left: Logo
- Right: Help link

**When to use:**
- Login/signup pages
- Password reset pages
- Public-facing pages

**Implementation:**

```tsx
// src/layouts/auth/layout.tsx
const renderHeader = () => {
  const headerSlots = {
    leftArea: <Logo />,
    rightArea: (
      <Link href="#" component={RouterLink} sx={{ typography: 'subtitle2' }}>
        Need help?
      </Link>
    ),
  };

  return (
    <HeaderSection
      disableElevation
      slots={headerSlots}
      sx={{ bgcolor: 'transparent' }}
    />
  );
};
```

### 3. No App Bar

Some pages don't need a header at all.

**When to use:**
- Error pages (404, 500)
- Print views
- Embedded content
- Full-screen experiences

**Implementation:**

```tsx
// No layout wrapper in route configuration
{
  path: '404',
  element: <Page404 />, // Renders directly without layout
}
```

## Customizing the App Bar

### Adding Custom Elements to Left Area

```tsx
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

const renderHeader = () => {
  const headerSlots = {
    leftArea: (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <MenuButton onClick={onOpen} />
        <Breadcrumbs>
          <Link href="/">Home</Link>
          <Typography>Current Page</Typography>
        </Breadcrumbs>
      </Box>
    ),
    rightArea: (/* ... standard right area ... */),
  };

  return <HeaderSection slots={headerSlots} />;
};
```

### Adding Custom Elements to Right Area

```tsx
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';

const renderHeader = () => {
  const headerSlots = {
    leftArea: (/* ... standard left area ... */),
    rightArea: (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Custom button */}
        <Button
          variant="contained"
          startIcon={<Icon icon="mdi:plus" />}
        >
          Add New
        </Button>

        {/* Standard elements */}
        <Searchbar />
        <ThemeModeToggle />
        <LanguagePopover data={_langs} />
        <AccountPopover data={_account} />
      </Box>
    ),
  };

  return <HeaderSection slots={headerSlots} />;
};
```

### Adding Top Alert/Banner

```tsx
const renderHeader = () => {
  const headerSlots = {
    topArea: (
      <Alert severity="info" sx={{ borderRadius: 0 }}>
        🎉 New feature available! Check out the dashboard builder.
      </Alert>
    ),
    leftArea: (/* ... */),
    rightArea: (/* ... */),
  };

  return <HeaderSection slots={headerSlots} />;
};
```

### Customizing Header Appearance

```tsx
const renderHeader = () => {
  return (
    <HeaderSection
      slots={headerSlots}
      slotProps={{
        container: {
          maxWidth: false, // Full width
        },
      }}
      sx={{
        bgcolor: 'primary.main', // Custom background
        color: 'primary.contrastText',
        boxShadow: 3, // Custom elevation
      }}
      disableElevation={false} // Enable shadow
    />
  );
};
```

## Hiding App Bar Elements

### Hiding Specific Elements

```tsx
const renderHeader = () => {
  const headerSlots = {
    leftArea: <MenuButton onClick={onOpen} />,
    rightArea: (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Search - hidden */}
        {/* <Searchbar /> */}
        
        <ThemeModeToggle />
        <LanguagePopover data={_langs} />
        
        {/* Notifications - hidden */}
        {/* <NotificationsPopover data={_notifications} /> */}
        
        <AccountPopover data={_account} />
      </Box>
    ),
  };

  return <HeaderSection slots={headerSlots} />;
};
```

### Conditional Element Rendering

```tsx
const renderHeader = () => {
  // const { user } = useAuth();
  // const showAdminTools = user?.role === 'admin';

  const headerSlots = {
    leftArea: <MenuButton onClick={onOpen} />,
    rightArea: (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Searchbar />
        
        {/* Conditional admin tools */}
        {/* {showAdminTools && (
          <Button variant="outlined" size="small">
            Admin Panel
          </Button>
        )} */}
        
        <ThemeModeToggle />
        <AccountPopover data={_account} />
      </Box>
    ),
  };

  return <HeaderSection slots={headerSlots} />;
};
```

## Page-Specific App Bar Customization

### Method 1: Custom Layout Component

Create a custom layout for pages that need different headers:

```tsx
// src/layouts/custom/layout.tsx
export function CustomLayout({ children }: { children: React.ReactNode }) {
  const renderHeader = () => {
    const headerSlots = {
      leftArea: <Typography variant="h6">Custom Page</Typography>,
      rightArea: (
        <Button variant="contained">
          Custom Action
        </Button>
      ),
    };

    return <HeaderSection slots={headerSlots} />;
  };

  return (
    <LayoutSection headerSection={renderHeader()}>
      <MainSection>{children}</MainSection>
    </LayoutSection>
  );
}

// Use in routes
{
  element: (
    <CustomLayout>
      <Outlet />
    </CustomLayout>
  ),
  children: [
    { path: 'custom-page', element: <CustomPage /> },
  ],
}
```

### Method 2: Using Layout Props

Pass custom configuration to the layout:

```tsx
// src/routes/sections.tsx
{
  element: (
    <DashboardLayout
      slotProps={{
        header: {
          sx: { bgcolor: 'background.neutral' },
          disableElevation: true,
        },
      }}
    >
      <Outlet />
    </DashboardLayout>
  ),
  children: [
    { path: 'special-page', element: <SpecialPage /> },
  ],
}
```

### Method 3: Programmatic Header Control

Control header from within a page component:

```tsx
// Note: This would require extending the layout to support context-based config
import { useLayoutConfig } from 'src/layouts/hooks';

export function MyPageView() {
  // Future enhancement: Use context to customize header
  // useLayoutConfig({
  //   header: {
  //     title: 'Custom Title',
  //     showSearch: false,
  //   },
  // });

  return (
    <DashboardContent>
      {/* Page content */}
    </DashboardContent>
  );
}
```

## App Bar Component Reference

### HeaderSection Component

Located in `src/layouts/core/header-section.tsx`

**Props:**

```tsx
type HeaderSectionProps = {
  layoutQuery?: Breakpoint;  // Responsive breakpoint ('sm' | 'md' | 'lg' | 'xl')
  disableElevation?: boolean; // Disable shadow
  sx?: SxProps;              // Custom styles
  slots?: {
    topArea?: React.ReactNode;   // Banner/alert area
    leftArea?: React.ReactNode;  // Left side content
    rightArea?: React.ReactNode; // Right side content
  };
  slotProps?: {
    container?: ContainerProps; // Container customization
  };
};
```

**Usage:**

```tsx
<HeaderSection
  layoutQuery="lg"
  disableElevation={false}
  slots={{
    topArea: <Alert severity="info">Banner message</Alert>,
    leftArea: <Logo />,
    rightArea: <Box>{/* Actions */}</Box>,
  }}
  slotProps={{
    container: { maxWidth: 'xl' },
  }}
  sx={{ bgcolor: 'background.paper' }}
/>
```

### Available Header Components

Import from `src/layouts/components/`:

```tsx
import { Searchbar } from 'src/layouts/components/searchbar';
import { MenuButton } from 'src/layouts/components/menu-button';
import { ThemeModeToggle } from 'src/layouts/components/theme-mode-toggle';
import { LanguagePopover } from 'src/layouts/components/language-popover';
import { NotificationsPopover } from 'src/layouts/components/notifications-popover';
import { AccountPopover } from 'src/layouts/components/account-popover';
```

## Responsive App Bar

### Mobile vs Desktop Behavior

```tsx
const renderHeader = () => {
  const theme = useTheme();

  const headerSlots = {
    leftArea: (
      <>
        {/* Mobile: Show menu button */}
        <MenuButton
          onClick={onOpen}
          sx={{ [theme.breakpoints.up('lg')]: { display: 'none' } }}
        />
        
        {/* Desktop: Show logo */}
        <Logo sx={{ [theme.breakpoints.down('lg')]: { display: 'none' } }} />
      </>
    ),
    rightArea: (
      <Box sx={{ display: 'flex', gap: 1 }}>
        {/* Hide search on mobile */}
        <Searchbar sx={{ [theme.breakpoints.down('sm')]: { display: 'none' } }} />
        
        <ThemeModeToggle />
        <AccountPopover data={_account} />
      </Box>
    ),
  };

  return <HeaderSection slots={headerSlots} />;
};
```

## App Bar Height Configuration

Customize header height via CSS variables:

```tsx
// In layout component
<LayoutSection
  cssVars={{
    '--layout-header-mobile-height': '64px',
    '--layout-header-desktop-height': '80px',
  }}
>
  {/* Layout content */}
</LayoutSection>
```

## Best Practices

### ✅ Do

- Keep the app bar uncluttered with essential actions only
- Maintain consistent app bar height across pages
- Use responsive design for mobile/tablet views
- Group related actions together
- Use icons with tooltips for compact display
- Test app bar on different screen sizes

### ❌ Don't

- Don't overcrowd the app bar with too many elements
- Don't use different app bar colors on different pages (unless intentional)
- Don't hide essential navigation elements on mobile
- Don't use overly large logos or images
- Don't implement custom scrolling behavior without testing

## Common Patterns

### Pattern 1: Page Actions in Header

```tsx
export function MyPageView() {
  const handleSave = () => { /* ... */ };
  const handleCancel = () => { /* ... */ };

  return (
    <>
      {/* Note: To add page-specific actions, you would extend the layout
          or create a custom app bar component within your page */}
      <DashboardContent>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4">Page Title</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
        {/* Page content */}
      </DashboardContent>
    </>
  );
}
```

### Pattern 2: Contextual Help Button

```tsx
const renderHeader = () => {
  const headerSlots = {
    rightArea: (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton color="inherit">
          <Icon icon="mdi:help-circle-outline" width={24} />
        </IconButton>
        <AccountPopover data={_account} />
      </Box>
    ),
  };

  return <HeaderSection slots={headerSlots} />;
};
```

### Pattern 3: Status Indicator

```tsx
const renderHeader = () => {
  // const { isOnline } = useNetworkStatus();

  const headerSlots = {
    topArea: (
      // Show status banner when offline
      // !isOnline && (
      //   <Alert severity="warning" sx={{ borderRadius: 0 }}>
      //     You are currently offline. Changes will be synced when connection is restored.
      //   </Alert>
      // )
      <></>
    ),
    leftArea: <MenuButton onClick={onOpen} />,
    rightArea: (/* ... */),
  };

  return <HeaderSection slots={headerSlots} />;
};
```

## Examples

### Example 1: Simple Header (Logo + Account Only)

```tsx
const renderHeader = () => {
  const headerSlots = {
    leftArea: <Logo />,
    rightArea: <AccountPopover data={_account} />,
  };

  return (
    <HeaderSection
      disableElevation
      slots={headerSlots}
    />
  );
};
```

### Example 2: Header with Page Title

```tsx
const renderHeader = () => {
  const headerSlots = {
    leftArea: (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <MenuButton onClick={onOpen} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Dashboard Analytics
        </Typography>
      </Box>
    ),
    rightArea: (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <ThemeModeToggle />
        <AccountPopover data={_account} />
      </Box>
    ),
  };

  return <HeaderSection slots={headerSlots} />;
};
```

### Example 3: Full-Featured Header

```tsx
const renderHeader = () => {
  const headerSlots = {
    topArea: (
      <Alert severity="info" sx={{ borderRadius: 0 }}>
        📢 System maintenance scheduled for tonight at 10 PM
      </Alert>
    ),
    leftArea: (
      <>
        <MenuButton onClick={onOpen} />
        <NavMobile data={navData} open={open} onClose={onClose} />
      </>
    ),
    rightArea: (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Searchbar />
        <IconButton>
          <Icon icon="mdi:bell-outline" width={24} />
        </IconButton>
        <ThemeModeToggle />
        <LanguagePopover data={_langs} />
        <AccountPopover data={_account} />
      </Box>
    ),
  };

  return (
    <HeaderSection
      layoutQuery="lg"
      slots={headerSlots}
      slotProps={{
        container: { maxWidth: false },
      }}
    />
  );
};
```

## Related Documentation

- [Creating New Pages](./creating-new-pages.md) - Guide to adding new pages
- [Navigation Patterns](./navigation-patterns.md) - Navigation menu configuration
- [External Resources](./external-resource.md) - Icon libraries and components

## Troubleshooting

### App Bar Not Showing

1. Verify the layout wrapper is correctly applied in routes
2. Check that `renderHeader()` is called in the layout component
3. Ensure CSS variables for header height are defined

### App Bar Elements Overlapping

1. Review responsive breakpoints and hide elements on smaller screens
2. Use `gap` spacing in flex containers
3. Check z-index values if elements overlap incorrectly

### App Bar Styling Issues

1. Check theme customization in `src/theme/`
2. Verify CSS variables in layout configuration
3. Review MUI theme palette for color consistency
4. Ensure `sx` prop styles don't conflict with theme

# Using External Components and Resources

This guide explains how to integrate external UI components, patterns, and resources (like those from uiverse.io) into your project.

## Overview

While the project primarily uses MUI (Material-UI), you may want to integrate:
- Custom components from uiverse.io
- Components from other UI libraries
- Third-party React components
- Custom CSS/animations
- External icon libraries

## Integrating Components from uiverse.io

[uiverse.io](https://uiverse.io/) provides a collection of open-source UI elements created with HTML and CSS. Here's how to integrate them:

### Step 1: Find a Component

1. Browse [uiverse.io](https://uiverse.io/)
2. Find a component you want to use
3. Click to view the code
4. Copy the HTML and CSS

### Step 2: Convert to React Component

Create a new component file in `src/components/`:

```tsx
// src/components/uiverse/animated-button.tsx
import Box from '@mui/material/Box';

export function AnimatedButton({ children, onClick }: { 
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        // Convert CSS to MUI sx syntax
        position: 'relative',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: 600,
        color: 'white',
        backgroundColor: 'primary.main',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: 'primary.dark',
          transform: 'scale(1.05)',
        },
        '&:active': {
          transform: 'scale(0.95)',
        },
        // Add animation keyframes if needed
        '@keyframes ripple': {
          '0%': { transform: 'scale(0)', opacity: 1 },
          '100%': { transform: 'scale(2)', opacity: 0 },
        },
      }}
    >
      {children}
    </Box>
  );
}
```

### Step 3: Adapt Styles to Theme

Make the component work with the app's theme system:

```tsx
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

export function ThemedAnimatedButton({ children, onClick }: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const theme = useTheme();

  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        position: 'relative',
        padding: '12px 24px',
        fontSize: theme.typography.button.fontSize,
        fontWeight: theme.typography.button.fontWeight,
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        border: 'none',
        borderRadius: theme.shape.borderRadius,
        cursor: 'pointer',
        overflow: 'hidden',
        transition: theme.transitions.create(['all'], {
          duration: theme.transitions.duration.standard,
        }),
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
          transform: 'scale(1.05)',
        },
        '&:active': {
          transform: 'scale(0.95)',
        },
      }}
    >
      {children}
    </Box>
  );
}
```

### Step 4: Export and Use

```tsx
// src/components/uiverse/index.ts
export { AnimatedButton } from './animated-button';
export { ThemedAnimatedButton } from './animated-button';

// Use in your page
import { ThemedAnimatedButton } from 'src/components/uiverse';

export function MyPage() {
  return (
    <DashboardContent>
      <ThemedAnimatedButton onClick={() => console.log('Clicked!')}>
        Click Me
      </ThemedAnimatedButton>
    </DashboardContent>
  );
}
```

## Converting CSS to MUI sx Syntax

### Basic Conversions

```css
/* CSS */
.button {
  padding: 10px 20px;
  margin-top: 16px;
  background-color: #1976d2;
  border-radius: 4px;
}
```

```tsx
// MUI sx
sx={{
  p: '10px 20px',  // or use spacing: p: '10px 20px'
  mt: 2,           // 16px (theme.spacing(2))
  bgcolor: 'primary.main',  // Use theme color
  borderRadius: 1, // 4px (theme.shape.borderRadius)
}}
```

### Pseudo-classes and States

```css
/* CSS */
.button:hover {
  background-color: #1565c0;
}

.button:active {
  transform: scale(0.95);
}
```

```tsx
// MUI sx
sx={{
  '&:hover': {
    bgcolor: 'primary.dark',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
}}
```

### Animations and Keyframes

```css
/* CSS */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.element {
  animation: fadeIn 0.3s ease-in;
}
```

```tsx
// MUI sx
sx={{
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  animation: 'fadeIn 0.3s ease-in',
}}
```

### Responsive Styles

```css
/* CSS */
@media (max-width: 768px) {
  .element {
    padding: 8px;
  }
}
```

```tsx
// MUI sx
sx={{
  p: { xs: 1, md: 2 }, // 8px on mobile, 16px on desktop
}}
```

## Using External Icon Libraries

### Iconify (Already Included)

The project includes [@iconify/react](https://icon-sets.iconify.design/). Use it for any icon:

```tsx
import { Icon } from '@iconify/react';

export function MyComponent() {
  return (
    <Box>
      {/* Material Design Icons */}
      <Icon icon="mdi:home" width={24} />
      
      {/* Font Awesome */}
      <Icon icon="fa:user" width={24} />
      
      {/* Line MD (animated icons) */}
      <Icon icon="line-md:loading-loop" width={24} />
      
      {/* Icon Park Two Tone */}
      <Icon icon="icon-park-twotone:success" width={24} />
    </Box>
  );
}
```

**Useful Iconify resources:**
- [Icon Park Two Tone](https://icon-sets.iconify.design/icon-park-twotone/) - Modern two-tone icons
- [Line MD](https://icon-sets.iconify.design/line-md/) - Animated line icons
- [MDI](https://icon-sets.iconify.design/mdi/) - Material Design Icons
- [Search all icons](https://icon-sets.iconify.design/)

### Adding Navigation Icons

Add icons to the navigation menu:

```tsx
// Option 1: Using existing SVG icons
const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

// Option 2: Using Iconify
import { Icon } from '@iconify/react';

const iconifyIcon = (name: string) => (
  <Icon icon={name} width={24} height={24} />
);

// In nav config:
{
  title: 'Dashboard',
  path: '/',
  icon: iconifyIcon('mdi:view-dashboard'),
}
```

### Creating Custom SVG Icons

1. Create an SVG file in `public/assets/icons/navbar/my-icon.svg`
2. Use it in navigation:

```tsx
const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

{
  title: 'My Feature',
  path: '/my-feature',
  icon: icon('my-icon'),
}
```

## Integrating Third-Party React Components

### Step 1: Install the Package

```bash
npm install package-name
```

### Step 2: Check for Security Vulnerabilities

Before adding any new dependency, **ALWAYS** run security checks:

```bash
npm audit
```

Review the package on:
- [npm](https://www.npmjs.com/) - Check downloads, last update, license
- [Snyk](https://snyk.io/) - Security vulnerabilities database
- [GitHub](https://github.com/) - Read the source code, check issues

### Step 3: Create a Wrapper Component

Wrap the third-party component to match your app's patterns:

```tsx
// src/components/external/third-party-wrapper.tsx
import { useTheme } from '@mui/material/styles';
import ThirdPartyComponent from 'third-party-package';

export function ThirdPartyWrapper({ data }: { data: any[] }) {
  const theme = useTheme();

  return (
    <ThirdPartyComponent
      data={data}
      // Map theme colors to component props
      primaryColor={theme.palette.primary.main}
      backgroundColor={theme.palette.background.paper}
      // Add any necessary props
    />
  );
}
```

### Step 4: Export and Use

```tsx
// src/components/external/index.ts
export { ThirdPartyWrapper } from './third-party-wrapper';

// Use in your page
import { ThirdPartyWrapper } from 'src/components/external';

export function MyPage() {
  return (
    <DashboardContent>
      <ThirdPartyWrapper data={myData} />
    </DashboardContent>
  );
}
```

## Working with Custom CSS

### Method 1: Using sx Prop (Recommended)

```tsx
<Box
  sx={{
    // Inline styles using theme
    p: 3,
    bgcolor: 'background.paper',
    borderRadius: 2,
  }}
>
  Content
</Box>
```

### Method 2: Styled Components

```tsx
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export function MyComponent() {
  return <StyledBox>Content</StyledBox>;
}
```

### Method 3: Global CSS (Not Recommended)

Only use for truly global styles that don't belong to any component:

```css
/* src/global.css */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
```

```tsx
// Use className
<Box className="custom-scrollbar">
  Content with custom scrollbar
</Box>
```

## Best Practices

### ✅ Do

1. **Always adapt external components to your theme**
   - Use theme colors, spacing, and typography
   - Ensure dark mode compatibility
   - Follow existing design patterns

2. **Check security and licensing**
   - Run security audits before installing packages
   - Verify license compatibility
   - Review package maintenance status

3. **Create wrapper components**
   - Wrap third-party components for consistency
   - Add TypeScript types
   - Handle edge cases and errors

4. **Document component usage**
   - Add comments explaining component purpose
   - Document props and examples
   - Note any limitations or gotchas

5. **Test thoroughly**
   - Test in both light and dark modes
   - Test responsive behavior
   - Test with real data

### ❌ Don't

1. **Don't bypass the theme system**
   - Avoid hardcoded colors
   - Don't use arbitrary spacing values
   - Don't ignore responsive design

2. **Don't install packages without review**
   - Check package size and dependencies
   - Verify it's actively maintained
   - Look for known security issues

3. **Don't mix styling approaches**
   - Stick to MUI's sx prop or styled components
   - Avoid mixing CSS modules with inline styles
   - Keep styles consistent across the app

4. **Don't ignore accessibility**
   - Ensure components are keyboard-navigable
   - Add proper ARIA labels
   - Test with screen readers

## Component Organization

### Recommended Structure

```
src/components/
├── external/              # Third-party component wrappers
│   ├── index.ts
│   └── component-wrapper.tsx
├── uiverse/              # Components from uiverse.io
│   ├── index.ts
│   ├── animated-button.tsx
│   └── loading-spinner.tsx
├── custom/               # Fully custom components
│   ├── index.ts
│   └── custom-component.tsx
└── [feature]/            # Feature-specific components
    ├── index.ts
    └── feature-component.tsx
```

## Examples

### Example 1: Animated Card from uiverse.io

```tsx
// src/components/uiverse/animated-card.tsx
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function AnimatedCard({ 
  title, 
  description, 
  onClick 
}: {
  title: string;
  description: string;
  onClick?: () => void;
}) {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: theme.transitions.create(['transform', 'box-shadow'], {
          duration: theme.transitions.duration.standard,
        }),
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered ? theme.shadows[8] : theme.shadows[2],
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          bgcolor: 'primary.main',
          transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.standard,
          }),
        },
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
}
```

### Example 2: Custom Loading Spinner

```tsx
// src/components/uiverse/loading-spinner.tsx
import Box from '@mui/material/Box';

export function LoadingSpinner({ size = 40 }: { size?: number }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: '4px solid',
        borderColor: 'action.disabled',
        borderTopColor: 'primary.main',
        animation: 'spin 1s linear infinite',
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }}
    />
  );
}
```

### Example 3: Integrating a Chart Library

```tsx
// src/components/external/custom-chart.tsx
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

export function CustomChart({ data }: { data: any[] }) {
  const theme = useTheme();

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: { show: false },
    },
    theme: {
      mode: theme.palette.mode, // Sync with app theme
    },
    colors: [theme.palette.primary.main],
    // ... more options
  };

  return (
    <Box sx={{ p: 3 }}>
      <ReactApexChart
        type="line"
        series={data}
        options={chartOptions}
        height={350}
      />
    </Box>
  );
}
```

## Troubleshooting

### Component Doesn't Match Theme

1. Wrap the component to pass theme values as props
2. Use theme colors instead of hardcoded values
3. Check if the component supports theming
4. Consider creating a styled wrapper

### Dark Mode Issues

1. Ensure all colors use theme palette tokens
2. Test component in both light and dark modes
3. Avoid using absolute colors (use `theme.palette.*`)
4. Check for CSS that overrides theme colors

### TypeScript Errors

1. Install type definitions: `npm install --save-dev @types/package-name`
2. Create custom type definitions if not available
3. Use type assertions carefully when needed

### Styling Conflicts

1. Use MUI's sx prop for higher specificity
2. Check for global CSS that might interfere
3. Use `!important` sparingly and only when necessary
4. Review CSS cascade and specificity

## Related Documentation

- [Creating New Pages](./creating-new-pages.md) - Page creation guide
- [Navigation Patterns](./navigation-patterns.md) - Navigation configuration
- [App Bar Patterns](./appbar-patterns.md) - Header customization
- [External Resource Links](./external-resource.md) - Icon pack links

## Additional Resources

- [MUI Documentation](https://mui.com/) - Component API reference
- [uiverse.io](https://uiverse.io/) - Open-source UI elements
- [Iconify](https://icon-sets.iconify.design/) - Icon search
- [CSS to MUI sx Converter](https://transform.tools/css-to-mui) - Online tool for conversion

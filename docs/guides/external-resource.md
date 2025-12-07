# External Resources

This document provides links to external resources for icons, components, and design inspiration.

## Icon Libraries

The project uses [@iconify/react](https://iconify.design/) which provides access to over 200,000 icons from various icon sets.

### Recommended Icon Sets

**Icon Park Two Tone** - Modern, colorful two-tone icons
- Browse: https://icon-sets.iconify.design/icon-park-twotone/
- Usage: `<Icon icon="icon-park-twotone:success" width={24} />`
- Great for: Status indicators, feature highlights, decorative elements

**Line MD** - Animated line icons
- Browse: https://icon-sets.iconify.design/line-md/
- Usage: `<Icon icon="line-md:loading-loop" width={24} />`
- Great for: Loading states, transitions, interactive elements

**Material Design Icons (MDI)** - Comprehensive icon library
- Browse: https://icon-sets.iconify.design/mdi/
- Usage: `<Icon icon="mdi:home" width={24} />`
- Great for: General UI icons, navigation, actions

**Font Awesome** - Popular icon library
- Browse: https://icon-sets.iconify.design/fa/
- Usage: `<Icon icon="fa:user" width={24} />`
- Great for: Social media, brands, general icons

**Heroicons** - Beautiful hand-crafted SVG icons
- Browse: https://icon-sets.iconify.design/heroicons/
- Usage: `<Icon icon="heroicons:home" width={24} />`
- Great for: Clean, modern UI

**Tabler Icons** - Pixel-perfect icons
- Browse: https://icon-sets.iconify.design/tabler/
- Usage: `<Icon icon="tabler:home" width={24} />`
- Great for: Consistent, minimalist design

### Search and Browse Icons

- **Iconify Icon Sets**: https://icon-sets.iconify.design/
  - Search across all icon sets
  - Preview icons in different sizes
  - Copy ready-to-use code

- **Icônes**: https://icones.js.org/
  - Alternative icon browser
  - Download SVG files
  - Compare icon sets

### Using Iconify Icons in the Project

```tsx
import { Icon } from '@iconify/react';

export function MyComponent() {
  return (
    <Box>
      {/* Basic usage */}
      <Icon icon="mdi:home" width={24} />
      
      {/* With custom color */}
      <Icon icon="mdi:heart" width={24} color="red" />
      
      {/* Responsive size */}
      <Icon icon="mdi:settings" width={24} height={24} />
      
      {/* In MUI components */}
      <IconButton>
        <Icon icon="mdi:menu" width={24} />
      </IconButton>
    </Box>
  );
}
```

## Component Libraries

### UI Component Sources

**uiverse.io** - Open-source UI elements
- Website: https://uiverse.io/
- Content: Buttons, cards, inputs, loaders, toggles
- Format: HTML + CSS
- License: Free to use
- Usage: See [Component Integration Guide](./component-integration.md)

**Tailwind UI Components** (Inspiration)
- Website: https://tailwindui.com/components
- Content: Application UI, marketing components
- Note: Requires adaptation to MUI/React

**MUI Templates** - Official MUI templates
- Website: https://mui.com/material-ui/getting-started/templates/
- Content: Dashboard, sign-in, checkout, etc.
- Format: Ready-to-use React components
- License: MIT

**React Spectrum** (Adobe)
- Website: https://react-spectrum.adobe.com/
- Content: Accessible UI components
- Note: Different design system, use for inspiration

### Animation Libraries

**Framer Motion** - Production-ready animation library
- Website: https://www.framer.com/motion/
- Usage: `npm install framer-motion`
- Great for: Page transitions, component animations

**React Spring** - Spring-physics based animations
- Website: https://www.react-spring.dev/
- Usage: `npm install react-spring`
- Great for: Smooth, natural animations

**Auto Animate** - Zero-config animations
- Website: https://auto-animate.formkit.com/
- Usage: `npm install @formkit/auto-animate`
- Great for: List animations, state changes

## Design Resources

### Color Palettes

**Coolors** - Color palette generator
- Website: https://coolors.co/
- Use: Generate harmonious color schemes

**Adobe Color** - Color wheel and themes
- Website: https://color.adobe.com/
- Use: Create color palettes from images

**Material Design Colors**
- Website: https://materialui.co/colors
- Use: MUI-compatible color palettes

### Typography

**Google Fonts** - Free font library
- Website: https://fonts.google.com/
- Current fonts in project:
  - DM Sans Variable (primary)
  - Barlow (secondary)

**Font Pairing** - Font combination tool
- Website: https://www.fontpair.co/
- Use: Find complementary font pairs

### Illustrations and Graphics

**unDraw** - Open-source illustrations
- Website: https://undraw.co/
- Format: SVG, customizable colors
- License: Free to use

**Lucide Icons** - Beautiful icon pack
- Website: https://lucide.dev/
- Alternative to Iconify for custom SVG icons

**Heroicons** - Hand-crafted SVG icons
- Website: https://heroicons.com/
- Format: SVG, React components
- License: MIT

## Learning Resources

### MUI Documentation

**Official MUI Docs**
- Website: https://mui.com/material-ui/
- Covers: All components, customization, theming

**MUI X Components** (Advanced)
- Website: https://mui.com/x/introduction/
- Covers: Data Grid, Date Pickers, Charts

### React Documentation

**Official React Docs**
- Website: https://react.dev/
- Covers: Hooks, components, best practices

**React Router**
- Website: https://reactrouter.com/
- Covers: Routing, navigation, data loading

### TypeScript

**TypeScript Handbook**
- Website: https://www.typescriptlang.org/docs/handbook/
- Covers: Types, interfaces, generics

**React + TypeScript Cheatsheet**
- Website: https://react-typescript-cheatsheet.netlify.app/
- Covers: React-specific TypeScript patterns

## Development Tools

### Online Code Editors

**CodeSandbox** - Online React editor
- Website: https://codesandbox.io/
- Use: Quick prototyping, sharing examples

**StackBlitz** - Online IDE
- Website: https://stackblitz.com/
- Use: Full development environment in browser

### Design Tools

**Figma** - Interface design tool
- Website: https://www.figma.com/
- Use: Design mockups, collaborate with designers

**Excalidraw** - Virtual whiteboard
- Website: https://excalidraw.com/
- Use: Quick diagrams, wireframes

### Conversion Tools

**CSS to MUI sx Converter**
- Website: https://transform.tools/css-to-mui
- Use: Convert CSS to MUI sx syntax

**SVG to JSX Converter**
- Website: https://svg2jsx.com/
- Use: Convert SVG to React components

## Package Directories

### npm Registry

**npm**
- Website: https://www.npmjs.com/
- Use: Search packages, check downloads, versions

**Bundlephobia** - Package size checker
- Website: https://bundlephobia.com/
- Use: Check bundle size impact before installing

**npm trends** - Package comparison
- Website: https://npmtrends.com/
- Use: Compare package popularity, trends

### Security

**Snyk** - Security vulnerability database
- Website: https://snyk.io/
- Use: Check for known vulnerabilities

**Socket** - Package security analysis
- Website: https://socket.dev/
- Use: Analyze package security before installing

## Community Resources

### GitHub Repositories

**Awesome React** - Curated React resources
- Repository: https://github.com/enaqx/awesome-react
- Content: Libraries, tools, tutorials

**Awesome MUI** - MUI resources
- Repository: https://github.com/nadunindunil/awesome-material-ui
- Content: Components, themes, examples

### Inspiration

**Dribbble** - Design inspiration
- Website: https://dribbble.com/
- Use: UI/UX design inspiration

**Behance** - Creative work showcase
- Website: https://www.behance.net/
- Use: Design inspiration, portfolios

**Awwwards** - Website awards
- Website: https://www.awwwards.com/
- Use: Web design inspiration

## Related Documentation

- [Creating New Pages](./creating-new-pages.md) - Guide to adding new pages
- [Component Integration](./component-integration.md) - How to integrate external components
- [Navigation Patterns](./navigation-patterns.md) - Navigation menu configuration
- [App Bar Patterns](./appbar-patterns.md) - Header customization

## Contributing Resources

If you find useful resources, consider adding them to this document:

1. Verify the resource is actively maintained
2. Check licensing and usage terms
3. Add a clear description and use case
4. Include the website URL
5. Submit a pull request with your addition
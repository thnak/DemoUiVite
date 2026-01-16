# Documentation

Welcome to the DemoUiVite documentation! This directory contains comprehensive guides for developing and extending the application.

## 📚 Documentation Structure

```
docs/
├── guides/           # Development guides and tutorials
│   ├── quickstart.md                  # Getting started guide
│   ├── creating-new-pages.md          # Complete page creation guide
│   ├── navigation-patterns.md         # Navigation menu configuration
│   ├── page-transitions.md            # Smooth page transition animations
│   ├── appbar-patterns.md             # App bar customization
│   ├── component-integration.md       # External component integration
│   ├── i18n.md                        # Internationalization guide
│   ├── api-usage.md                   # API service usage
│   ├── shift-templates.md             # Shift template feature
│   └── external-resource.md           # External resources and links
├── implementation/   # Implementation summaries and technical details
│   ├── README.md                      # Implementation documentation index
│   └── [Feature implementation docs] # Detailed feature implementation records
└── api/              # API documentation
    └── response.json                  # OpenAPI specification
```

## 🚀 Getting Started

New to the project? Start here:

1. **[Quickstart Guide](./guides/quickstart.md)** - Get the project running and understand the basics
2. **[Creating New Pages](./guides/creating-new-pages.md)** - Learn how to add new pages step-by-step
3. **[i18n Guide](./guides/i18n.md)** - Understand multi-language support

## 📖 Development Guides

### Page Development

- **[Creating New Pages](./guides/creating-new-pages.md)**
  - Complete checklist for adding new pages
  - Route registration
  - Navigation integration
  - Translation setup
  - Examples and templates

- **[Page Transitions](./guides/page-transitions.md)**
  - Smooth fade and slide animations
  - Framer Motion integration
  - Performance optimization
  - Troubleshooting guide

### Layout Customization

- **[Navigation Patterns](./guides/navigation-patterns.md)**
  - Dashboard layout with full navigation
  - Auth layout without navigation
  - Minimal layout for error pages
  - Conditional navigation items
  - Mobile vs desktop navigation

- **[App Bar Patterns](./guides/appbar-patterns.md)**
  - Full app bar configuration
  - Minimal app bar for auth pages
  - Custom header elements
  - Hiding/showing app bar elements
  - Responsive header design

### Component Development

- **[Component Integration](./guides/component-integration.md)**
  - Using components from uiverse.io
  - Converting CSS to MUI sx syntax
  - Integrating third-party React components
  - Working with external icon libraries
  - Best practices and examples

### Internationalization

- **[i18n Guide](./guides/i18n.md)**
  - Multi-language support
  - Adding new languages
  - Translation keys structure
  - Language detection
  - Best practices

### API Integration

- **[API Usage Guide](./guides/api-usage.md)**
  - Auto-generated API services
  - React Query integration
  - Making API calls
  - Error handling
  - Type safety

## 🎨 Design Resources

- **[External Resources](./guides/external-resource.md)**
  - Icon libraries (Iconify, Material Icons, etc.)
  - Component libraries (uiverse.io, MUI templates)
  - Design tools and inspiration
  - Learning resources

## 📋 Feature-Specific Guides

- **[Shift Templates](./guides/shift-templates.md)** - Working with shift template features

## 📝 Implementation Records

Looking for detailed implementation documentation? Check out:

- **[Implementation Documentation](./implementation/README.md)** - Technical implementation summaries
  - Feature implementation details
  - Refactoring summaries
  - Migration guides
  - Verification checklists

## 🔧 Technical Reference

### Theme System

The project uses a centralized theme system with light/dark mode support:

- **Always use theme tokens** for colors (never hardcoded values)
- Use `theme.palette.background.*` for backgrounds
- Use `theme.palette.text.*` for text colors
- Test all UI changes in both light and dark modes

See the [Copilot Instructions](./../.github/copilot-instructions.md) for detailed theme guidelines.

### File Naming Conventions

- **Pages**: kebab-case (e.g., `user-profile.tsx`)
- **Components**: kebab-case files, PascalCase exports
- **Directories**: kebab-case (e.g., `user-profile/`)

### Project Structure

```
src/
├── components/      # Reusable UI components
├── layouts/         # Page layout components
│   ├── dashboard/   # Dashboard layout (with nav + header)
│   ├── auth/        # Auth layout (minimal header)
│   └── core/        # Core layout components
├── pages/           # Page components
├── routes/          # Route definitions
├── sections/        # Page sections/features
├── theme/           # MUI theme configuration
├── locales/         # i18n translation files
└── services/        # API services (auto-generated)
```

## 🎯 Common Tasks

### Adding a New Page

1. Create page component in `src/pages/`
2. Create view component in `src/sections/`
3. Register route in `src/routes/sections.tsx`
4. Add navigation item in `src/layouts/nav-config-dashboard.tsx`
5. Add translation keys in `src/locales/langs/*.json`

See [Creating New Pages](./guides/creating-new-pages.md) for detailed instructions.

### Adding a New Icon

```tsx
import { Icon } from '@iconify/react';

<Icon icon="mdi:home" width={24} />
```

Browse icons at: https://icon-sets.iconify.design/

### Adding a New Language

1. Create translation file in `src/locales/langs/`
2. Add flag icon to `public/assets/icons/flags/`
3. Register in `src/locales/i18n.ts`

See [i18n Guide](./guides/i18n.md) for detailed instructions.

## ⚡ Quick Reference

### Import Paths

```tsx
// Components
import { Button } from '@mui/material';
import { Logo } from 'src/components/logo';
import { DashboardContent } from 'src/layouts/dashboard';

// Utilities
import { CONFIG } from 'src/config-global';
import { useTranslation } from 'react-i18next';

// Routing
import { useNavigate, useParams } from 'react-router-dom';
```

### Common MUI Components

```tsx
// Layout
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

// Typography
import Typography from '@mui/material/Typography';

// Inputs
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

// Display
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
```

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run start

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run fm:fix

# Fix all (lint + format)
npm run fix:all

# Generate API services
npm run generate:api

# Type checking (watch mode)
npm run tsc:watch
```

## 📝 Documentation Guidelines

When adding documentation:

1. **Place in correct folder**
   - `docs/guides/` - How-to guides, tutorials, patterns
   - `docs/implementation/` - Implementation summaries, technical details
   - `docs/api/` - API specifications, endpoint documentation

2. **Use clear titles and structure**
   - Use H1 for document title
   - Use H2 for main sections
   - Use H3 for subsections

3. **Include examples**
   - Show code examples
   - Provide step-by-step instructions
   - Add visual aids when helpful

4. **Keep it updated**
   - Update docs when code changes
   - Remove outdated information
   - Add new features as they're developed

## 🤝 Contributing

When contributing to the project:

1. Read relevant documentation first
2. Follow existing patterns and conventions
3. Update documentation for new features
4. Test changes thoroughly
5. Run linters and formatters

## 📚 External Resources

- [React Documentation](https://react.dev/)
- [MUI Documentation](https://mui.com/material-ui/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [React Router Documentation](https://reactrouter.com/)

## 🔗 Related Files

- [Main README](../README.md) - Project overview and quick start
- [Copilot Instructions](../.github/copilot-instructions.md) - AI coding guidelines
- [Package.json](../package.json) - Project dependencies and scripts

## 📞 Need Help?

- Check the relevant guide in `docs/guides/`
- Review existing code for examples
- Read the official documentation for libraries used
- Ask questions in issues or discussions

---

**Last Updated**: December 2024

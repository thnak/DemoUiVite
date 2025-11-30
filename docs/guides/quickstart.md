# Quickstart Guide

This guide helps developers new to React get started with the DemoUiVite project.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 20 or higher** - [Download here](https://nodejs.org/)
- A code editor (VS Code recommended)
- Basic knowledge of HTML, CSS, and JavaScript

## Getting Started

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/thnak/DemoUiVite.git
cd DemoUiVite

# Install dependencies
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Open your browser at `http://localhost:3039`. The page will automatically reload when you make changes.

## Understanding the Project Structure

### Key Folders

| Folder | Purpose |
|--------|---------|
| `src/pages/` | Each file represents a page/route in the app |
| `src/components/` | Reusable UI pieces (buttons, cards, etc.) |
| `src/layouts/` | Page layouts (header, sidebar, footer) |
| `src/theme/` | Visual styling configuration |
| `src/locales/` | Translation files for multiple languages |

### Key Files

- `src/main.tsx` - Application entry point
- `src/app.tsx` - Main app component with routing
- `src/routes/sections.tsx` - Route definitions

## React Basics for This Project

### Components

React apps are built with **components** - reusable pieces of UI. Here's a simple example:

```tsx
// A basic component
function WelcomeMessage() {
  return <h1>Hello, World!</h1>;
}
```

### Props

Components can receive data through **props**:

```tsx
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

// Usage
<Greeting name="Developer" />
```

### State

Components can have internal **state** that changes over time:

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

## Making Your First Change

### 1. Find a Page

Open `src/pages/dashboard.tsx` - this is the main dashboard page.

### 2. Make a Change

Try changing some text or adding a new element.

### 3. See It Live

Save the file - your browser will automatically refresh with your changes!

## Using MUI Components

This project uses [MUI (Material UI)](https://mui.com/) for UI components. Here are some common examples:

### Button

```tsx
import Button from '@mui/material/Button';

<Button variant="contained" color="primary">
  Click Me
</Button>
```

### Typography

```tsx
import Typography from '@mui/material/Typography';

<Typography variant="h4">
  This is a heading
</Typography>
```

### Card

```tsx
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

<Card>
  <CardContent>
    <Typography>Card content goes here</Typography>
  </CardContent>
</Card>
```

> **Tip:** Refer to the [MUI documentation](https://mui.com/material-ui/getting-started/) for the full list of components.

## Adding Translations

This project supports multiple languages. See the [i18n documentation](./i18n.md) for details.

### Quick Example

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('dashboard.welcome')}</h1>;
}
```

## Common Tasks

### Add a New Page

1. Create a new file in `src/pages/`, e.g., `my-page.tsx`:

```tsx
export default function MyPage() {
  return (
    <div>
      <h1>My New Page</h1>
    </div>
  );
}
```

2. Add a route in `src/routes/sections.tsx`

### Add a New Component

Create a new file in `src/components/`:

```tsx
// src/components/my-component/my-component.tsx
export function MyComponent() {
  return <div>My reusable component</div>;
}
```

## Troubleshooting

### Port Already in Use

If port 3039 is busy, Vite will suggest an alternative port. Or stop the other process using that port.

### Dependencies Not Found

Run `npm install` again to ensure all dependencies are installed.

### TypeScript Errors

Check the terminal for specific error messages. Common fixes:
- Import missing modules
- Add proper type annotations
- Check for typos in variable names

## Next Steps

- Explore the demo dashboard at `/demo/dashboard`
- Read the [Development Guide](./development.md) for debugging and IDE setup
- Read the [i18n documentation](./i18n.md) to understand translations
- Check out [MUI docs](https://mui.com/) for component references
- Review existing pages in `src/pages/` for examples

## Need Help?

- [React Documentation](https://react.dev/)
- [MUI Documentation](https://mui.com/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

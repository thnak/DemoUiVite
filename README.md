# DemoUiVite

A production-ready **client-side only** UI application built with React and Vite. This repository focuses purely on the frontend layer with no server-side rendering.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The development server runs at `http://localhost:3039`.

> **New to React?** Check out our [Quickstart Guide](./docs/guides/quickstart.md) for a beginner-friendly introduction.

## 📦 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | React 19, Vite 6 |
| **UI Library** | MUI (Material UI) 7 |
| **Styling** | Emotion (CSS-in-JS) |
| **Routing** | React Router DOM 7 |
| **Charts** | ApexCharts |
| **Internationalization** | i18next, react-i18next |
| **Language** | TypeScript 5 |
| **Code Quality** | ESLint, Prettier |

## 📁 Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── layouts/        # Page layout components
│   ├── pages/          # Page components
│   ├── routes/         # Route definitions
│   ├── sections/       # Page sections/features
│   ├── theme/          # MUI theme configuration
│   ├── locales/        # i18n translation files
│   ├── utils/          # Utility functions
│   └── _mock/          # Mock data for demos
├── docs/               # Documentation
│   ├── guides/         # How-to guides and tutorials
│   └── api/            # API documentation
├── public/             # Static assets
└── .github/            # GitHub configurations
```

## 📚 Documentation

All documentation is located in the [`docs/`](./docs/) folder:

- **[Quickstart Guide](./docs/guides/quickstart.md)** - Get started with the project
- **[Development Guide](./docs/guides/development.md)** - Debugging, environment variables, and IDE setup (VS Code & WebStorm)
- **[Internationalization (i18n)](./docs/guides/i18n.md)** - Multi-language support documentation
- **[API Services](./docs/guides/api-usage.md)** - Auto-generated API services and React Query hooks

## 🎨 Demo

An E-commerce Dashboard demo is available at `/demo/dashboard`:

1. Run `npm run dev` to start the development server
2. Navigate to `http://localhost:3039/demo/dashboard`
3. Or use the sidebar navigation → "Demo Dashboard" under "Overview"

**Demo features:**
- Metric cards with sparklines
- Circular and area/line charts
- Sales overview with progress bars
- Best salesman table
- Latest products list

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run fm:check` | Check Prettier formatting |
| `npm run fm:fix` | Fix Prettier formatting |
| `npm run fix:all` | Fix all linting and formatting |
| `npm run generate:api` | Generate API services from OpenAPI spec |

## 📋 Requirements

- Node.js >= 20
- npm (comes with Node.js)

## 📄 License

MIT
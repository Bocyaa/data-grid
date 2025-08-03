# DataGrid Frontend

A modern React application for viewing, editing, and managing CSV datasets with an interactive data grid interface.

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Query** - Server state management
- **React Router 7** - Client-side routing
- **AG Grid Community** - Data grid component
- **Material-UI** - UI components and icons
- **Tailwind CSS** - Utility-first styling
- **React Hot Toast** - Notifications

## Features

- **Dataset Management**: Upload, view, and delete CSV datasets
- **Interactive Data Grid**: Sort, filter, and paginate through data
- **Row Operations**: View, edit, and delete individual rows
- **Multi-tab Navigation**: Open multiple datasets simultaneously
- **Search & Filter**: Real-time data searching across columns
- **Responsive Design**: Optimized for desktop and mobile

## Project Structure

```
src/
├── api/                 # API layer
│   ├── config.ts       # API base URL configuration
│   ├── datasets.ts     # Dataset API endpoints
│   └── index.ts        # API exports
├── components/         # Reusable components
│   ├── LeftSideBar.tsx # Navigation sidebar
│   ├── TopNavBar.tsx   # Tab navigation
│   └── ui/             # UI components
├── config/            # Application configuration
│   ├── dataGridConfig.ts # Grid settings
│   └── toast.ts        # Toast notifications config
├── contexts/          # React contexts
│   ├── ActiveDatasetContext.tsx
│   ├── NavBarTabsContext.tsx
│   ├── hooks/         # Context hooks
│   └── providers/     # Context providers
├── hooks/             # Custom hooks
│   ├── useDatasets.ts # Dataset operations
│   └── dataGrid/      # Data grid hooks
├── layout/            # Layout components
│   ├── AppLayout.tsx  # Main app layout
│   └── DataGridLayout.tsx
├── pages/             # Page components
│   ├── Home.tsx       # Dataset list page
│   ├── DataGrid.tsx   # Data grid view
│   └── RowDetail.tsx  # Individual row editor
├── types/             # TypeScript definitions
│   ├── api.ts         # API response types
│   ├── dataGrid.ts    # Grid configuration types
│   └── index.ts       # Type exports
└── utils/             # Utility functions
    └── dataGridUtils.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Environment Variables

Create a `.env` file in the client directory:

```env
VITE_API_BASE_URL=http://localhost:5174/api
```

## API Integration

The frontend communicates with a REST API backend. Key endpoints:

- `GET /api/datasets` - Fetch all datasets
- `GET /api/datasets/:id` - Fetch dataset with pagination
- `POST /api/datasets/upload` - Upload CSV file
- `DELETE /api/datasets/:id` - Delete dataset
- `GET /api/datasets/:id/rows/:rowId` - Fetch single row
- `PUT /api/datasets/:id/rows/:rowId` - Update row
- `DELETE /api/datasets/:id/rows/:rowId` - Delete row

## Key Components

### Data Grid (`DataGrid.tsx`)

- Displays dataset rows in AG Grid
- Handles pagination, search, and filtering
- Supports row selection and bulk operations
- Integrates with data grid hooks for state management

### Dataset Management

- **Home Page**: Lists all available datasets with upload functionality
- **Left Sidebar**: Quick navigation between datasets
- **Top Navigation**: Tab-based interface for multiple open datasets

### Row Detail (`RowDetail.tsx`)

- Detailed view and editing interface for individual rows
- Field-by-field editing with validation
- Save/cancel operations with optimistic updates

## State Management

### TanStack Query

- Handles server state and caching
- Automatic refetching and background updates
- Optimistic updates for mutations

### React Context

- `ActiveDatasetContext`: Tracks currently active dataset
- `NavBarTabsContext`: Manages open dataset tabs

### Custom Hooks

- `useDatasets`: Dataset CRUD operations
- `useDataGridPagination`: Pagination state
- `useDataGridSearch`: Search functionality
- `useDataGridSelection`: Row selection
- `useDataGridActions`: Grid actions (delete, edit)

## Configuration

### Data Grid Settings (`dataGridConfig.ts`)

```typescript
export const DATA_GRID_CONFIG = {
  DEFAULT_PAGE_SIZE: 50,
  PAGE_SIZE_OPTIONS: [10, 20, 30, 40, 50],
  SEARCH_DEBOUNCE_DELAY: 300,
  GRID_HEADER_HEIGHT: 45,
  GRID_ROW_HEIGHT: 40,
};
```

### Path Aliases

Configured in `vite.config.ts` for clean imports:

- `@/` → `src/`
- `@/components` → `src/components`
- `@/hooks` → `src/hooks`
- etc.

## Styling

### Tailwind CSS

- Utility-first approach for rapid styling
- Custom configuration with MUI integration
- Preflight disabled to avoid conflicts

### Material-UI

- Component library for consistent design
- Custom theme integration
- Icon library for UI elements

## Development Guidelines

### Code Organization

- Components are organized by feature and reusability
- Custom hooks encapsulate business logic
- Types are centralized in the `types/` directory

### Performance

- React Query handles caching and background updates
- Pagination reduces large dataset load times
- Debounced search prevents excessive API calls

### Error Handling

- Comprehensive error boundaries
- Toast notifications for user feedback
- Loading states for better UX

## Build & Deployment

```bash
# Production build
npm run build

# Files output to dist/
# Serve static files from dist/ directory
```

The application builds to static files and can be deployed to any static hosting service (Vercel, Netlify, etc.).

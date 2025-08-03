# DataGrid 📊

A modern full-stack web application for visualizing, editing, and managing CSV datasets with an interactive data grid interface.

[![Live Demo](https://img.shields.io/badge/🚀-Live%20Demo-blue?style=for-the-badge)](https://your-demo-link.com)

![DataGrid Preview](https://via.placeholder.com/800x400/0094f6/ffffff?text=DataGrid+Application+Preview)

## Features

### 🗂️ Dataset Management

- **CSV Upload**: Drag & drop or click to upload CSV files
- **Multi-Dataset Support**: Work with multiple datasets simultaneously
- **Dataset Overview**: Quick preview and statistics for each dataset
- **Bulk Operations**: Delete entire datasets with confirmation

### 📋 Interactive Data Grid

- **Advanced Grid Interface**: Powered by AG Grid with sorting, filtering, and resizing
- **Real-time Search**: Search across any column with instant results
- **Pagination**: Efficient handling of large datasets
- **Row Selection**: Single and multi-row selection for bulk operations
- **Responsive Design**: Optimized for desktop and mobile devices

### ✏️ Data Editing

- **Inline Editing**: Edit individual cells directly in the grid
- **Row Detail View**: Detailed editing interface for complete row data
- **Field Validation**: Ensure data integrity with type checking
- **Auto-save**: Changes are automatically persisted to the database

### 🎛️ User Experience

- **Tab Navigation**: Open multiple datasets in separate tabs
- **Sidebar Navigation**: Quick access to all available datasets
- **Toast Notifications**: Real-time feedback for all operations
- **Loading States**: Smooth loading indicators and error handling
- **Keyboard Shortcuts**: Efficient navigation and operations

## 🛠️ Tech Stack

### Frontend

- **React 19** with TypeScript
- **TanStack Query** for server state management
- **AG Grid Community** for data visualization
- **Material-UI** for components and design system
- **Tailwind CSS** for utility-first styling
- **Vite** for fast development and building

### Backend

- **Node.js** with Express.js
- **Prisma ORM** with MySQL database
- **Zod** for robust data validation
- **Multer** for file upload handling
- **Papa Parse** for CSV processing

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Bocyaa/data-grid.git
cd data-grid

# Install server dependencies
cd server
npm install

# Set up environment variables
cp .env.example .env
# Configure your DATABASE_URL and other settings

# Run database migrations
npx prisma migrate dev

# Start the server (runs on port 5174)
npm run dev

# In a new terminal, install client dependencies
cd ../client
npm install

# Start the client (runs on port 5173)
npm run dev
```

Visit `http://localhost:5173` to access the application.

## 📁 Project Structure

```
data-grid/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── contexts/       # React context providers
│   │   └── api/            # API integration layer
│   └── README.md           # Frontend documentation
├── server/                 # Express.js backend API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Express middleware
│   │   ├── validators/     # Data validation schemas
│   │   └── utils/          # Utility functions
│   └── README.md           # Backend documentation
└── README.md               # This file
```

## 📖 Documentation

- **[Frontend Documentation](./client/README.md)** - Detailed React app architecture, components, and development setup
- **[Backend Documentation](./server/README.md)** - API endpoints, database schema, and server configuration

## 🎯 Use Cases

### Data Analysis

- Upload sales reports, survey data, or research datasets
- Quickly explore data with built-in search and filtering
- Identify patterns and trends through sortable columns

### Content Management

- Manage product catalogs, customer lists, or inventory data
- Make quick edits to individual records
- Bulk operations for efficient data maintenance

### Collaboration

- Share datasets with team members through persistent URLs
- Multi-tab interface for comparing different datasets
- Real-time data updates across sessions

## 🌐 API Overview

The backend provides a RESTful API for all data operations:

- `GET /api/datasets` - List all datasets with pagination
- `POST /api/dataset` - Upload new CSV dataset
- `GET /api/dataset/:id` - Retrieve dataset rows
- `PUT /api/dataset/:id/:rowId` - Update specific row
- `DELETE /api/dataset/:id` - Remove entire dataset

Full API documentation available in the [server README](./server/README.md).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [AG Grid](https://ag-grid.com/) for the powerful data grid component
- [Prisma](https://prisma.io/) for the excellent ORM and database toolkit
- [TanStack Query](https://tanstack.com/query) for seamless server state management
- [Material-UI](https://mui.com/) for the comprehensive component library

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/Bocyaa">BobHab</a></p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>

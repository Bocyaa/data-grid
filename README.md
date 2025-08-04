# DataGrid 📊

A modern full-stack web application for visualizing, editing, and managing CSV datasets with an interactive data grid interface.

[![Live Demo](https://img.shields.io/badge/🚀-Live%20Demo-blue?style=for-the-badge)](https://data-grid-six.vercel.app/)
---
(try it only on Desktop and Tablet)
(mobile version is not ready yet)

## 📖 Documentation

- **[Frontend Documentation](./client/README.md)** - Detailed React app architecture, components, and development setup
- **[Backend Documentation](./server/README.md)** - API endpoints, database schema, and server configuration

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

### ✏️ Data Editing

- **Row Detail View**: Detailed editing interface for complete row data
- **Field Validation**: Ensure data integrity with type checking
- **Save on Confirm**: Changes are persisted to the database on 'Save' click

### 🎛️ User Experience

- **Tab Navigation**: Open multiple datasets in separate tabs
- **Sidebar Navigation**: Quick access to all available datasets
- **Toast Notifications**: Real-time feedback for all operations
- **Loading States**: Smooth loading indicators and error handling

## 🛠️ Tech Stack

### Frontend

- **React 19** with TypeScript
- **TanStack Query** for server state management and Caching
- **AG Grid** for data visualization
- **Material-UI** for components, design system and accessibility
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
│   │   ├── middleware/     # Express & Error handling middlewares
│   │   ├── validators/     # Data validation schemas
│   │   └── utils/          # Utility functions
│   └── README.md           # Backend documentation
└── README.md               # This file
```

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
- `DELETE /api/dataset/:id` - Delete entire dataset
- `DELETE /api/dataset/:datasetId/:rowId` - Delete single row

Full API documentation available in the [server README](./server/README.md).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [AG Grid](https://ag-grid.com/) for the data grid component
- [Prisma](https://prisma.io/) for the ORM and database toolkit
- [TanStack Query](https://tanstack.com/query) for server state management and frontend caching
- [Material-UI](https://mui.com/) for the component library

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/Bocyaa">BobHab</a></p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>

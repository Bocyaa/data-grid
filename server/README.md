# DataGrid Backend

A Node.js REST API server for managing CSV datasets with full CRUD operations, built with Express.js, Prisma ORM, and MySQL.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js 5** - Web framework
- **TypeScript** - Type safety
- **Prisma ORM** - Database toolkit
- **MySQL** - Database
- **Zod** - Schema validation
- **Multer** - File upload handling
- **Papa Parse** - CSV parsing
- **CORS** - Cross-origin resource sharing

## Features

- **Dataset Management**: Upload, list, and delete CSV datasets
- **Row Operations**: Create, read, update, and delete individual rows
- **Data Validation**: Comprehensive request validation with Zod
- **File Processing**: CSV parsing and data type inference
- **Search & Pagination**: Query datasets with filtering and pagination
- **Error Handling**: Centralized error management
- **Type Safety**: Full TypeScript implementation

## Project Structure

```
src/
├── config/
│   └── env.ts              # Environment configuration
├── controllers/
│   └── datasetControllers.ts # Request handlers
├── lib/
│   └── prisma.ts           # Prisma client instance
├── middleware/
│   ├── errorHandler.ts     # Global error handling
│   └── validate.ts         # Request validation middleware
├── routes/
│   └── datasetRoutes.ts    # API route definitions
├── utils/
│   ├── csvParser.ts        # CSV processing utilities
│   └── isJsonObject.ts     # Type checking utilities
├── validators/
│   └── datasetValidators.ts # Zod schemas
└── index.ts                # Application entry point
```

## Database Schema

```prisma
model Dataset {
  id        Int     @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  rows      Row[]
}

model Row {
  id         Int     @id @default(autoincrement())
  datasetId  Int
  data       Json    # Flexible JSON storage for CSV data
  dataset    Dataset @relation(fields: [datasetId], references: [id], onDelete: Cascade)
}
```

## API Endpoints

### Datasets

| Method   | Endpoint                  | Description                       |
| -------- | ------------------------- | --------------------------------- |
| `GET`    | `/api/datasets`           | List all datasets with pagination |
| `POST`   | `/api/dataset`            | Upload new CSV dataset            |
| `GET`    | `/api/dataset/:datasetId` | Get dataset rows with pagination  |
| `DELETE` | `/api/dataset/:datasetId` | Delete entire dataset             |

### Rows

| Method   | Endpoint                         | Description         |
| -------- | -------------------------------- | ------------------- |
| `GET`    | `/api/dataset/:datasetId/:rowId` | Get specific row    |
| `PUT`    | `/api/dataset/:datasetId/:rowId` | Update row data     |
| `DELETE` | `/api/dataset/:datasetId/:rowId` | Delete specific row |

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=5174
CORS_ORIGIN=http://localhost:5173

# Database
DATABASE_URL="mysql://username:password@localhost:3306/datagrid"
```

## Request/Response Format

### Standard API Response

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors?: any; // Only present for validation errors
}
```

### Dataset Upload

```bash
curl -X POST http://localhost:5174/api/dataset \
  -F "file=@data.csv"
```

Response:

```json
{
  "success": true,
  "data": {
    "datasetId": 1,
    "rowCount": 150
  },
  "message": "Dataset uploaded"
}
```

### Dataset Listing

```bash
curl "http://localhost:5174/api/datasets?page=1&limit=10&sort=createdAt&order=desc"
```

Response:

```json
{
  "success": true,
  "data": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "data": [
      {
        "id": 1,
        "name": "sales-data",
        "createdAt": "2025-08-03T10:00:00Z",
        "rowCount": 150,
        "preview": [...]
      }
    ]
  },
  "message": "Datasets found"
}
```

## Validation

### Query Parameters

- **Pagination**: `page` (min: 1), `limit` (min: 1, max: 100)
- **Sorting**: `sort` (field name), `order` (asc/desc)
- **Search**: `searchField`, `searchQuery`

### Path Parameters

- **Dataset ID**: Positive integer
- **Row ID**: Non-negative integer

### Request Bodies

All request bodies are validated using Zod schemas with detailed error messages.

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "data": null,
  "message": "Error description",
  "errors": {} // Detailed validation errors (if applicable)
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Data Processing

### CSV Upload Pipeline

1. **File Validation**: Check file type and size
2. **CSV Parsing**: Parse CSV with header detection and type inference
3. **Data Storage**: Store parsed data as JSON in database
4. **Transaction Safety**: Use database transactions for data integrity

### Data Types

- **Numbers**: Automatically parsed from CSV
- **Strings**: Default type for text data
- **Mixed Types**: Stored as JSON for flexibility

## Scripts

## Development Features

### Path Mapping

Configured in `tsconfig.json` for clean imports:

```typescript
import { prisma } from 'lib/prisma';
import { validateQuery } from 'middleware/validate';
```

### Hot Reloading

Development server uses `ts-node-dev` for automatic restarts on file changes.

### Type Safety

- Full TypeScript coverage
- Prisma-generated types
- Zod schema validation
- Express middleware typing

## Database Operations

### Prisma Commands

```bash
# Create and apply migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Generate client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

### Performance Considerations

- **Pagination**: Limit database queries with offset/limit
- **Indexing**: Primary keys and foreign keys are automatically indexed
- **Transactions**: Bulk operations use database transactions
- **JSON Storage**: Flexible but requires careful querying

## Production Deployment

### Build Process

```bash
npm run build
# Outputs to dist/ directory
```

### Environment Setup

- Set `NODE_ENV=production`
- Configure production database URL
- Set appropriate CORS origins

### Security Considerations

- Input validation on all endpoints
- CORS configuration for allowed origins
- File upload restrictions
- SQL injection prevention via Prisma
- Error message sanitization

## Monitoring & Logging

- Request validation errors with detailed feedback
- Database operation logging via Prisma
- File upload process tracking

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// Dataset Types
export interface Dataset {
  id: number;
  name: string;
  createdAt: string;
  rowCount: number;
  preview: Record<string, unknown>[];
}

export interface DatasetRow {
  id: number;
  data: Record<string, unknown>;
}

export interface DatasetDetail {
  rows: DatasetRow[];
  columns: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Query Parameters
export interface DatasetsQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  searchField?: string;
  searchQuery?: string;
}

export interface DatasetQueryParams {
  page?: number;
  limit?: number;
  searchField?: string;
  searchQuery?: string;
}

// API Response Types
export type DatasetsResponse = ApiResponse<{
  page: number;
  limit: number;
  total: number;
  data: Dataset[];
}>;

export type DatasetDetailResponse = ApiResponse<DatasetDetail>;

export type DatasetRowResponse = ApiResponse<{
  id: number;
  data: Record<string, unknown>;
}>;

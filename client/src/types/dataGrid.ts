import type { GridApi } from 'ag-grid-community';

export interface PaginationState {
  currentPage: number;
  pageInputValue: string;
  pageSize: number;
}

export interface PaginationHandlers {
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  handlePageInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePageInputSubmit: () => void;
  handlePageInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handlePageSizeChange: (newPageSize: number) => void;
  setCurrentPage: (page: number) => void;
  setPageInputValue: (value: string) => void;
  setPageSize: (size: number) => void;
}

export interface SearchState {
  searchQuery: string;
  debouncedSearchQuery: string;
}

export interface SearchHandlers {
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearSearch: () => void;
  setSearchQuery: (query: string) => void;
  setDebouncedSearchQuery: (query: string) => void;
}

export interface SelectionState {
  selectedRows: number[];
  gridApi: GridApi | null;
}

export interface SelectionHandlers {
  onSelectionChanged: () => void;
  setSelectedRows: (rows: number[]) => void;
  setGridApi: (api: GridApi | null) => void;
}

export interface DataGridActions {
  handleDeleteRow: (rowId: number) => void;
  handleConfirmDelete: () => void;
  handleCancelDelete: () => void;
  handleViewRow: (rowId: number) => void;
}

export interface DataGridConfig {
  DEFAULT_PAGE_SIZE: number;
  PAGE_SIZE_OPTIONS: number[];
  SEARCH_DEBOUNCE_DELAY: number;
  GRID_HEADER_HEIGHT: number;
  GRID_ROW_HEIGHT: number;
}

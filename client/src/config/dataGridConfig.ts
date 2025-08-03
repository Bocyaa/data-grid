import type { DataGridConfig } from '@/types/dataGrid';

export const DATA_GRID_CONFIG: DataGridConfig = {
  DEFAULT_PAGE_SIZE: 50,
  PAGE_SIZE_OPTIONS: [10, 20, 30, 40, 50],
  SEARCH_DEBOUNCE_DELAY: 300,
  GRID_HEADER_HEIGHT: 45,
  GRID_ROW_HEIGHT: 40,
};

export const DEFAULT_COL_DEF = {
  sortable: true,
  filter: true,
  resizable: true,
  minWidth: 80,
  autoHeaderHeight: true,
};

export const GRID_OPTIONS = {
  suppressMenuHide: false,
  rowSelection: 'multiple' as const,
  enableCellTextSelection: true,
  animateRows: true,
};

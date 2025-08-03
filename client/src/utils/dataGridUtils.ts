import type { ICellRendererParams } from 'ag-grid-community';
import type { ReactElement } from 'react';

export interface DatasetRow {
  id: number;
  data: Record<string, any>;
}

export interface DatasetColumn {
  field: string;
  headerName: string;
  sortable?: boolean;
  filter?: boolean;
  resizable?: boolean;
  autoHeaderHeight?: boolean;
  pinned?: 'left' | 'right';
  suppressSizeToFit?: boolean;
  cellRenderer?: any;
}

/**
 * Transform dataset rows for AG Grid consumption
 */
export const transformRowsForGrid = (rows: DatasetRow[]) => {
  if (!rows) return [];

  return rows.map((row) => ({
    ...row.data,
    _rowId: row.id, // Preserve the row ID for navigation
  }));
};

/**
 * Generate column definitions for AG Grid
 */
export const generateColumnDefs = (
  columns: string[],
  ActionsCellRenderer: (params: ICellRendererParams) => ReactElement
): DatasetColumn[] => {
  if (!columns) return [];

  // Actions column - always first and pinned
  const actionsColumn: DatasetColumn = {
    field: 'actions',
    headerName: 'Actions',
    cellRenderer: ActionsCellRenderer,
    sortable: false,
    filter: false,
    resizable: false,
    pinned: 'left',
    suppressSizeToFit: true,
  };

  // Data columns
  const dataColumns: DatasetColumn[] = columns.map((column) => ({
    field: column,
    headerName: column,
    sortable: true,
    filter: true,
    resizable: true,
    autoHeaderHeight: true,
  }));

  return [actionsColumn, ...dataColumns];
};

/**
 * Validate page number input
 */
export const validatePageNumber = (
  input: string,
  currentPage: number,
  totalPages: number
): number | null => {
  const pageNumber = parseInt(input, 10);

  if (
    !isNaN(pageNumber) &&
    pageNumber >= 1 &&
    pageNumber <= totalPages &&
    pageNumber !== currentPage
  ) {
    return pageNumber;
  }

  return null;
};

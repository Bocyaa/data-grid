import { useState, useCallback, useEffect } from 'react';
import type { GridApi } from 'ag-grid-community';
import type { SelectionState, SelectionHandlers } from '@/types/dataGrid';

interface UseSelectionReturn extends SelectionState, SelectionHandlers {}

export const useDataGridSelection = (): UseSelectionReturn => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  // Handle selection change
  const onSelectionChanged = useCallback(() => {
    if (gridApi) {
      const selectedNodes = gridApi.getSelectedNodes();
      const selectedRowIds = selectedNodes.map((node) => node.data._rowId);
      setSelectedRows(selectedRowIds);
    }
  }, [gridApi]);

  // Handle clicks outside the grid to deselect rows
  const handleGridOutsideClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Element;

      // Check if click is outside the AG Grid container
      // BUT exclude clicks on DeleteRowsBtn and ConfirmDialog
      if (
        !target.closest('.ag-root-wrapper') &&
        !target.closest('[data-delete-rows-btn]') &&
        !target.closest('[data-confirm-dialog]') &&
        gridApi
      ) {
        gridApi.deselectAll();
      }
    },
    [gridApi]
  );

  useEffect(() => {
    document.addEventListener('click', handleGridOutsideClick);
    return () => {
      document.removeEventListener('click', handleGridOutsideClick);
    };
  }, [handleGridOutsideClick]);

  return {
    // State
    selectedRows,
    gridApi,
    // Handlers
    onSelectionChanged,
    setSelectedRows,
    setGridApi,
  };
};

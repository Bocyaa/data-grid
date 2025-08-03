import { useCallback, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Box } from '@mui/material';
import type {
  GridReadyEvent,
  RowDoubleClickedEvent,
  ICellRendererParams,
} from 'ag-grid-community';

import ConfirmDialog from '@/components/ui/ConfirmDialog';
import DataGridHeader from '@/components/ui/DataGrid/DataGridHeader';
import DataGridTable from '@/components/ui/DataGrid/DataGridTable';
import DataGridFooter from '@/components/ui/DataGrid/DataGridFooter';
import DataGridError from '@/components/ui/DataGrid/DataGridError';
import ActionsCellRenderer from '@/components/ui/DataGrid/ActionsCellRenderer';

import type { ConfirmDialogState } from '@/types';
import { useDataset } from '@/hooks/useDatasets';
import { useDataGridPagination } from '@/hooks/dataGrid/useDataGridPagination';
import { useDataGridSearch } from '@/hooks/dataGrid/useDataGridSearch';
import { useDataGridSelection } from '@/hooks/dataGrid/useDataGridSelection';
import { useDataGridActions } from '@/hooks/dataGrid/useDataGridActions';
import {
  transformRowsForGrid,
  generateColumnDefs,
} from '@/utils/dataGridUtils';

function DataGrid() {
  const { datasetId } = useParams<{ datasetId: string }>();
  const navigate = useNavigate();

  // State for confirm dialog
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    rowId: null,
    isMultiple: false,
  });

  // Initialize pagination hook with default values first
  const pagination = useDataGridPagination({
    onPageChange: () => {
      // Page changes are handled through state updates
    },
  });

  const search = useDataGridSearch({
    onPageReset: () => {
      pagination.setCurrentPage(1);
      pagination.setPageInputValue('1');
    },
  });

  const selection = useDataGridSelection();

  // Fetch dataset data
  const {
    data: datasetResponse,
    isLoading,
    error,
    refetch,
  } = useDataset(Number(datasetId), {
    page: pagination.currentPage,
    limit: pagination.pageSize,
    searchQuery: search.debouncedSearchQuery || undefined,
  });

  const dataset = datasetResponse?.data;

  // Actions hook
  const actions = useDataGridActions({
    datasetId,
    selectedRows: selection.selectedRows,
    confirmDialog,
    setConfirmDialog,
    setSelectedRows: selection.setSelectedRows,
  });

  // Update pagination data when dataset changes
  const paginationData = useMemo(
    () => ({
      totalPages: dataset?.pagination.totalPages || 1,
      hasPrevPage: dataset?.pagination.hasPrevPage || false,
      hasNextPage: dataset?.pagination.hasNextPage || false,
    }),
    [dataset?.pagination]
  );

  // Create action cell renderer with proper handlers
  const ActionsCellRendererComponent = useCallback(
    (params: ICellRendererParams) => (
      <ActionsCellRenderer
        params={params}
        onView={actions.handleViewRow}
        onDelete={actions.handleDeleteRow}
      />
    ),
    [actions.handleViewRow, actions.handleDeleteRow]
  );

  // Generate column definitions
  const columnDefs = useMemo(() => {
    if (!dataset?.columns) return [];
    return generateColumnDefs(dataset.columns, ActionsCellRendererComponent);
  }, [dataset?.columns, ActionsCellRendererComponent]);

  // Transform row data
  const rowData = useMemo(() => {
    if (!dataset?.rows) return [];
    return transformRowsForGrid(dataset.rows);
  }, [dataset?.rows]);

  // Handle grid ready
  const onGridReady = useCallback(
    (params: GridReadyEvent) => {
      selection.setGridApi(params.api);
      // Auto-size all columns to fit header content
      params.api.autoSizeAllColumns();
    },
    [selection.setGridApi]
  );

  // Handle row double click to navigate to row details
  const onRowDoubleClicked = useCallback(
    (event: RowDoubleClickedEvent) => {
      const rowId = event.data?._rowId;
      if (rowId && datasetId) {
        navigate(`/${datasetId}/${rowId}`);
      }
    },
    [datasetId, navigate]
  );

  // Handle window resize
  const handleResize = useCallback(() => {
    if (selection.gridApi) {
      // Auto-size all columns to fit content including headers
      selection.gridApi.autoSizeAllColumns();
    }
  }, [selection.gridApi]);

  if (error) {
    return <DataGridError error={error} onRetry={refetch} />;
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
      }}
    >
      {/* Header with search and actions */}
      <DataGridHeader
        selectedRows={selection.selectedRows}
        searchQuery={search.searchQuery}
        onSearchChange={search.handleSearchChange}
        onClearSearch={search.handleClearSearch}
        setConfirmDialog={setConfirmDialog}
      />

      {/* AG Grid Container */}
      <Box sx={{ flex: 1, p: 2 }}>
        <Box sx={{ height: 'calc(100vh - 13rem)' }}>
          <DataGridTable
            rowData={rowData}
            columnDefs={columnDefs}
            isLoading={isLoading}
            onGridReady={onGridReady}
            onRowDoubleClicked={onRowDoubleClicked}
            onSelectionChanged={selection.onSelectionChanged}
            onResize={handleResize}
          />
        </Box>
      </Box>

      {/* Footer with pagination */}
      <DataGridFooter
        pagination={paginationData}
        pageInputValue={pagination.pageInputValue}
        pageSize={pagination.pageSize}
        onPreviousPage={() => {
          if (paginationData.hasPrevPage) {
            const newPage = pagination.currentPage - 1;
            pagination.setCurrentPage(newPage);
            pagination.setPageInputValue(newPage.toString());
          }
        }}
        onNextPage={() => {
          if (paginationData.hasNextPage) {
            const newPage = pagination.currentPage + 1;
            pagination.setCurrentPage(newPage);
            pagination.setPageInputValue(newPage.toString());
          }
        }}
        onPageInputChange={pagination.handlePageInputChange}
        onPageInputSubmit={() => {
          const pageNumber = parseInt(pagination.pageInputValue, 10);
          if (
            !isNaN(pageNumber) &&
            pageNumber >= 1 &&
            pageNumber <= paginationData.totalPages &&
            pageNumber !== pagination.currentPage
          ) {
            pagination.setCurrentPage(pageNumber);
          } else {
            pagination.setPageInputValue(pagination.currentPage.toString());
          }
        }}
        onPageInputKeyDown={(e) => {
          if (e.key === 'Enter') {
            const pageNumber = parseInt(pagination.pageInputValue, 10);
            if (
              !isNaN(pageNumber) &&
              pageNumber >= 1 &&
              pageNumber <= paginationData.totalPages &&
              pageNumber !== pagination.currentPage
            ) {
              pagination.setCurrentPage(pageNumber);
            } else {
              pagination.setPageInputValue(pagination.currentPage.toString());
            }
            e.currentTarget.blur();
          }
        }}
        onPageSizeChange={pagination.handlePageSizeChange}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={
          confirmDialog.isMultiple
            ? 'Confirm to delete the selected rows'
            : 'Confirm to delete the selected row'
        }
        message={
          confirmDialog.isMultiple
            ? `Are you sure you want to delete the selected ${selection.selectedRows.length} rows? This action cannot be undone.`
            : 'Are you sure you want to delete this row? This action cannot be undone.'
        }
        onConfirm={actions.handleConfirmDelete}
        onCancel={actions.handleCancelDelete}
      />
    </Box>
  );
}

export default DataGrid;

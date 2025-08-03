import { useCallback, useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ScaleLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';

import { AgGridReact } from 'ag-grid-react';
import type {
  GridApi,
  GridReadyEvent,
  RowDoubleClickedEvent,
  ICellRendererParams,
} from 'ag-grid-community';

import { useDataset, useDeleteDatasetRow } from '../hooks/useDatasets';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import type { ConfirmDialogState } from '../types';
import DeleteRowsBtn from '../components/ui/DataGrid/DeleteRowsBtn';

function DataGrid() {
  const { datasetId } = useParams<{ datasetId: string }>();
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState('1');
  const [pageSize, setPageSize] = useState(50);
  const [showPageSizeDropdown, setShowPageSizeDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    rowId: null,
    isMultiple: false,
  });

  const navigate = useNavigate();

  const {
    data: datasetResponse,
    isLoading,
    error,
    refetch,
  } = useDataset(Number(datasetId), {
    page: currentPage,
    limit: pageSize,
    searchQuery: debouncedSearchQuery || undefined,
  });

  const deleteRowMutation = useDeleteDatasetRow();

  const dataset = datasetResponse?.data;

  // Action handlers
  const handleDeleteRow = useCallback((rowId: number) => {
    setConfirmDialog({ isOpen: true, rowId, isMultiple: false });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (confirmDialog.isMultiple && selectedRows.length > 0 && datasetId) {
      // Handle bulk delete
      Promise.all(
        selectedRows.map((rowId) =>
          deleteRowMutation.mutateAsync({
            datasetId: Number(datasetId),
            rowId,
          })
        )
      )
        .then(() => {
          toast.success(`${selectedRows.length} rows deleted successfully`);
          setSelectedRows([]);
          setConfirmDialog({ isOpen: false, rowId: null, isMultiple: false });
        })
        .catch((error) => {
          toast.error(`Failed to delete rows: ${error.message}`);
          setConfirmDialog({ isOpen: false, rowId: null, isMultiple: false });
        });
    } else if (confirmDialog.rowId && datasetId) {
      // Handle single delete
      deleteRowMutation.mutate(
        { datasetId: Number(datasetId), rowId: confirmDialog.rowId },
        {
          onSuccess: () => {
            toast.success('Row deleted successfully');
            setConfirmDialog({ isOpen: false, rowId: null, isMultiple: false });
          },
          onError: (error) => {
            toast.error(`Failed to delete row: ${error.message}`);
            setConfirmDialog({ isOpen: false, rowId: null, isMultiple: false });
          },
        }
      );
    }
  }, [confirmDialog, selectedRows, datasetId, deleteRowMutation]);

  const handleCancelDelete = useCallback(() => {
    setConfirmDialog({ isOpen: false, rowId: null, isMultiple: false });
  }, []);

  const handleViewRow = useCallback(
    (rowId: number) => {
      if (datasetId) {
        navigate(`/${datasetId}/${rowId}`);
      }
    },
    [datasetId, navigate]
  );

  // Action cell renderer
  const ActionsCellRenderer = useCallback(
    (params: ICellRendererParams) => {
      const rowId = params.data._rowId;
      return (
        <div className='flex gap-2 h-full items-center pt-1.5'>
          <button
            onClick={() => handleViewRow(rowId)}
            className='px-3 py-1 text-xs border border-[#e5e5e5] text-blue-500 rounded hover:bg-blue-600/10 transition-colors cursor-pointer font-medium'
          >
            View
          </button>
          <button
            onClick={() => handleDeleteRow(rowId)}
            className='px-3 py-1 text-xs border border-[#e5e5e5] text-red-500 rounded hover:bg-red-600/10 transition-colors cursor-pointer font-medium'
          >
            Delete
          </button>
        </div>
      );
    },
    [handleViewRow, handleDeleteRow]
  );

  // Generate column definitions from dataset columns
  const columnDefs = useMemo(() => {
    if (!dataset?.columns) return [];

    // Actions column - always first and pinned
    const actionsColumn = {
      field: 'actions',
      headerName: 'Actions',
      cellRenderer: ActionsCellRenderer,
      sortable: false,
      filter: false,
      resizable: false,
      pinned: 'left' as const,
      // width: 160,
      suppressSizeToFit: true,
    };

    // Data columns
    const dataColumns = dataset.columns.map((column) => ({
      field: column,
      headerName: column,
      sortable: true,
      filter: true,
      resizable: true,
      autoHeaderHeight: true,
    }));

    return [actionsColumn, ...dataColumns];
  }, [dataset?.columns, ActionsCellRenderer]);

  // Transform rows for AG Grid - flatten the data objects and preserve row ID
  const rowData = useMemo(() => {
    if (!dataset?.rows) return [];

    return dataset.rows.map((row) => ({
      ...row.data,
      _rowId: row.id, // Preserve the row ID for navigation
    }));
  }, [dataset?.rows]);

  // Handle grid ready
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    // Auto-size all columns to fit header content
    params.api.autoSizeAllColumns();
  }, []);

  // Handle selection change
  const onSelectionChanged = useCallback(() => {
    if (gridApi) {
      const selectedNodes = gridApi.getSelectedNodes();
      const selectedRowIds = selectedNodes.map((node) => node.data._rowId);
      setSelectedRows(selectedRowIds);
    }
  }, [gridApi]);

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

  // Handle pagination
  const handlePreviousPage = useCallback(() => {
    if (dataset?.pagination.hasPrevPage) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setPageInputValue(newPage.toString());
    }
  }, [dataset?.pagination.hasPrevPage, currentPage]);

  const handleNextPage = useCallback(() => {
    if (dataset?.pagination.hasNextPage) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setPageInputValue(newPage.toString());
    }
  }, [dataset?.pagination.hasNextPage, currentPage]);

  // Handle page input change
  const handlePageInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Only allow numbers
      if (/^\d*$/.test(value)) {
        setPageInputValue(value);
      }
    },
    []
  );

  // Handle page input submit (Enter key or blur)
  const handlePageInputSubmit = useCallback(() => {
    const pageNumber = parseInt(pageInputValue, 10);
    const totalPages = dataset?.pagination.totalPages || 1;

    if (
      !isNaN(pageNumber) &&
      pageNumber >= 1 &&
      pageNumber <= totalPages &&
      pageNumber !== currentPage
    ) {
      // Valid page number within range and different from current
      setCurrentPage(pageNumber);
    } else {
      // Invalid input, reset to current page
      setPageInputValue(currentPage.toString());
    }
  }, [pageInputValue, dataset?.pagination.totalPages, currentPage]);

  // Handle Enter key press
  const handlePageInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handlePageInputSubmit();
        e.currentTarget.blur(); // Remove focus after submit
      }
    },
    [handlePageInputSubmit]
  );

  // Handle page size change
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    setPageInputValue('1');
    setShowPageSizeDropdown(false);
  }, []);

  // Handle page size dropdown toggle
  const handlePageSizeDropdownToggle = useCallback(() => {
    setShowPageSizeDropdown((prev) => !prev);
  }, []);

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as Element;
    if (!target.closest('[data-page-size-dropdown]')) {
      setShowPageSizeDropdown(false);
    }
  }, []);

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
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('click', handleGridOutsideClick);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('click', handleGridOutsideClick);
    };
  }, [handleClickOutside, handleGridOutsideClick]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      // Reset to first page when search changes
      if (searchQuery !== debouncedSearchQuery) {
        setCurrentPage(1);
        setPageInputValue('1');
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearchQuery]);

  // Handle search input change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setCurrentPage(1);
    setPageInputValue('1');
  }, []);

  // Update input value when current page changes
  useEffect(() => {
    setPageInputValue(currentPage.toString());
  }, [currentPage]);

  // Handle window resize
  const handleResize = useCallback(() => {
    if (gridApi) {
      // Auto-size all columns to fit content including headers
      gridApi.autoSizeAllColumns();
    }
  }, [gridApi]);

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-full'>
        <div className='text-lg text-red-600 mb-4'>
          Error loading dataset: {error.message}
        </div>
        <button
          onClick={() => refetch()}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col bg-white'>
      {/* Header with pagination info */}
      <div className='bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0'>
        <div className='flex items-center justify-between'>
          {/* Action Button */}
          <DeleteRowsBtn
            selectedRows={selectedRows}
            setConfirmDialog={setConfirmDialog}
          />

          {/* Search Bar */}
          <div className='relative max-w-sm'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
              <svg
                className='w-4 h-4 text-gray-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </div>
            <input
              type='text'
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder='Search in all columns...'
              className='block w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#0094f6] bg-white transition-colors'
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer'
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AG Grid Container with fixed height */}
      <div className='flex-1 p-4'>
        <div className='' style={{ height: 'calc(100vh - 13rem)' }}>
          {!isLoading ? (
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              onGridReady={onGridReady}
              onRowDoubleClicked={onRowDoubleClicked}
              onSelectionChanged={onSelectionChanged}
              suppressMenuHide={false}
              rowSelection='multiple'
              enableCellTextSelection={true}
              animateRows={true}
              headerHeight={45}
              rowHeight={40}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true,
                minWidth: 80,
                autoHeaderHeight: true,
              }}
              getRowId={(params) => params.data._rowId?.toString()}
              onFirstDataRendered={handleResize}
              onGridSizeChanged={handleResize}
            />
          ) : (
            <div className='flex w-full h-full justify-center items-center'>
              <ScaleLoader
                speedMultiplier={0.7}
                color='#5f5e5b'
                height={40}
                width={3}
                barCount={6}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer with additional info */}
      <div className='bg-[#f9f8f7] border-t border-gray-200 px-6 py-2 flex-shrink-0'>
        <div className='flex items-center py-1 px-2 rounded-md gap-3'>
          <button
            onClick={handlePreviousPage}
            disabled={!dataset?.pagination.hasPrevPage}
            className='flex p-1 aspect-square border border-[#d4d4d4] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 shadow-xs cursor-pointer'
          >
            <WestIcon className='!w-5 !h-5 text-[#707070]' />
          </button>

          <div className='flex text-sm items-center'>
            <span className='font-medium text-[#525252] cursor-default'>
              Page
            </span>

            <input
              type='text'
              value={pageInputValue}
              onChange={handlePageInputChange}
              onBlur={handlePageInputSubmit}
              onKeyDown={handlePageInputKeyDown}
              className='border mx-2 text-center w-10 rounded-md border-[#c7c7c7] bg-[#f6f6f6] h-7 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />

            <span className='font-medium text-[#525252] cursor-default'>
              of {dataset?.pagination.totalPages}
            </span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={!dataset?.pagination.hasNextPage}
            className='flex p-1 aspect-square border border-[#d4d4d4] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 shadow-xs cursor-pointer'
          >
            <EastIcon className='!w-5 !h-5 text-[#707070]' />
          </button>

          <div className='relative' data-page-size-dropdown>
            <button
              onClick={handlePageSizeDropdownToggle}
              className='flex h-7.5 items-center px-2 border rounded-md border-[#d4d4d4] shadow-xs hover:bg-gray-50 transition-colors cursor-pointer'
            >
              <span className='text-sm text-[#171717]'>{pageSize} rows</span>
              <svg
                className={`ml-1 w-3 h-3 transition-transform ${
                  showPageSizeDropdown ? 'rotate-180' : ''
                }`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </button>

            {/* Dropdown */}
            {showPageSizeDropdown && (
              <div className='absolute bottom-full mb-1 left-0 bg-white border border-[#d4d4d4] rounded-md shadow-lg z-10 min-w-[80px]'>
                {[10, 20, 30, 40, 50].map((size) => (
                  <button
                    key={size}
                    onClick={() => handlePageSizeChange(size)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                      size === pageSize
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-[#171717]'
                    } ${size === 10 ? 'rounded-t-md' : ''} ${
                      size === 50 ? 'rounded-b-md' : ''
                    }`}
                  >
                    {size} rows
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
            ? `Are you sure you want to delete the selected ${selectedRows.length} rows? This action cannot be undone.`
            : 'Are you sure you want to delete this row? This action cannot be undone.'
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default DataGrid;

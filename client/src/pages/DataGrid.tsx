import { useCallback, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ScaleLoader } from 'react-spinners';
import { AgGridReact } from 'ag-grid-react';
import type {
  GridApi,
  GridReadyEvent,
  RowDoubleClickedEvent,
} from 'ag-grid-community';

// Import AG Grid CSS
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { useDataset } from '../hooks/useDatasets';

function DataGrid() {
  const { datasetId } = useParams<{ datasetId: string }>();
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  const navigate = useNavigate();

  // Fetch dataset data using React Query with caching
  const {
    data: datasetResponse,
    isLoading,
    error,
    refetch,
  } = useDataset(Number(datasetId), { page: currentPage, limit: pageSize });

  const dataset = datasetResponse?.data;

  // Generate column definitions from dataset columns
  const columnDefs = useMemo(() => {
    if (!dataset?.columns) return [];

    return dataset.columns.map((column) => ({
      field: column,
      headerName: column,
      sortable: true,
      filter: true,
      resizable: true,
      width: 150,
    }));
  }, [dataset?.columns]);

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
    params.api.sizeColumnsToFit();
  }, []);

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
      setCurrentPage((prev) => prev - 1);
    }
  }, [dataset?.pagination.hasPrevPage]);

  const handleNextPage = useCallback(() => {
    if (dataset?.pagination.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [dataset?.pagination.hasNextPage]);

  // Handle window resize
  const handleResize = useCallback(() => {
    if (gridApi) {
      gridApi.sizeColumnsToFit();
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
          {/* Search Bar */}
          <div></div>

          {/* Pagination Controls */}
          <div className='flex items-center space-x-2'>
            <button
              onClick={handlePreviousPage}
              disabled={!dataset?.pagination.hasPrevPage}
              className='px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
            >
              Previous
            </button>

            <span className='text-sm text-gray-600'>
              Page {dataset?.pagination.page} of{' '}
              {dataset?.pagination.totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={!dataset?.pagination.hasNextPage}
              className='px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* AG Grid Container with fixed height */}
      <div className='flex-1 p-4'>
        <div
          className='ag-theme-quartz w-full border border-gray-200 rounded-lg shadow-sm'
          style={{ height: 'calc(100vh - 200px)' }}
        >
          {!isLoading ? (
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              onGridReady={onGridReady}
              onRowDoubleClicked={onRowDoubleClicked}
              suppressMenuHide={false}
              rowSelection='single'
              enableCellTextSelection={true}
              animateRows={true}
              headerHeight={40}
              rowHeight={35}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true,
                minWidth: 120,
                flex: 1,
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

      {/* Footer with additional pagination */}
      <div className='bg-white border-t border-gray-200 px-6 py-5 flex-shrink-0'>
        {dataset ? (
          <div className='flex items-center justify-between text-sm text-gray-600'>
            <div></div>
            <p className='text-sm text-gray-500'>
              Showing{' '}
              <span className='font-semibold'>{dataset.rows.length}</span> of{' '}
              <span className='font-semibold'>{dataset.pagination.total}</span>{' '}
              rows
            </p>
          </div>
        ) : (
          <span>Loading ...</span>
        )}
      </div>
    </div>
  );
}

export default DataGrid;

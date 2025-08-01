import { useParams, useNavigate } from 'react-router';
import { useDatasetRow } from '../hooks/useDatasets';

function RowDetail() {
  const { datasetId, rowId } = useParams<{
    datasetId: string;
    rowId: string;
  }>();
  const navigate = useNavigate();

  const {
    data: rowResponse,
    isLoading,
    error,
    refetch,
  } = useDatasetRow(Number(datasetId), Number(rowId));

  const rowData = rowResponse?.data;

  // Loading state
  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <div className='text-lg'>Loading row details...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-full'>
        <div className='text-lg text-red-600 mb-4'>
          Error loading row: {error.message}
        </div>
        <button
          onClick={() => refetch()}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2'
        >
          Retry
        </button>
        <button
          onClick={() => navigate(`/${datasetId}`)}
          className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
        >
          Back to Dataset
        </button>
      </div>
    );
  }

  // No data state
  if (!rowData) {
    return (
      <div className='flex flex-col items-center justify-center h-full'>
        <div className='text-lg mb-4'>Row not found.</div>
        <button
          onClick={() => navigate(`/${datasetId}`)}
          className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
        >
          Back to Dataset
        </button>
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col'>
      {/* Header */}
      <div className='bg-white border-b border-gray-200 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-xl font-semibold text-gray-900'>Row Details</h1>
            <p className='text-sm text-gray-500'>
              Dataset {datasetId} - Row {rowId}
            </p>
          </div>
          <button
            onClick={() => navigate(`/${datasetId}`)}
            className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
          >
            Back to Dataset
          </button>
        </div>
      </div>

      {/* Row data display */}
      <div className='flex-1 p-6 overflow-auto'>
        <div className='bg-white rounded-lg shadow border'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <h2 className='text-lg font-medium text-gray-900'>Row Data</h2>
          </div>
          <div className='p-6'>
            <div className='grid gap-4'>
              {Object.entries(rowData.data).map(([key, value]) => (
                <div
                  key={key}
                  className='grid grid-cols-1 md:grid-cols-3 gap-2'
                >
                  <div className='font-medium text-gray-700 bg-gray-50 p-2 rounded'>
                    {key}
                  </div>
                  <div className='md:col-span-2 p-2 border rounded'>
                    {value !== null && value !== undefined ? (
                      typeof value === 'object' ? (
                        JSON.stringify(value, null, 2)
                      ) : (
                        String(value)
                      )
                    ) : (
                      <span className='text-gray-400 italic'>null</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RowDetail;

import { useDatasets } from '../hooks/useDatasets';
import { Link } from 'react-router';
import type { Dataset } from '../types/api';

function DatasetList() {
  const { data: datasetsResponse, isLoading, error } = useDatasets();
  const datasets = datasetsResponse?.data?.data || [];

  if (isLoading) {
    return (
      <div className='h-full w-full flex justify-center items-center'>
        <div className='text-lg'>Loading datasets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='h-full w-full flex justify-center items-center'>
        <div className='text-lg text-red-600'>
          Error loading datasets: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className='h-full w-full p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>
          Available Datasets
        </h1>

        {datasets.length === 0 ? (
          <div className='text-center py-12'>
            <div className='text-lg text-gray-500'>No datasets available</div>
          </div>
        ) : (
          <div className='grid gap-4'>
            {datasets.map((dataset: Dataset) => (
              <Link
                key={dataset.id}
                to={`/dataset/${dataset.id}`}
                className='block p-6 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors'
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                      {dataset.name}
                    </h2>
                    <p className='text-gray-500 text-sm'>
                      {dataset.rowCount} rows • Created{' '}
                      {new Date(dataset.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className='text-blue-600 text-sm font-medium'>
                    View Dataset →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DatasetList;

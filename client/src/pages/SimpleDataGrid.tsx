import { useParams } from 'react-router';
import { useDataset } from '../hooks/useDatasets';

function SimpleDataGrid() {
  const { datasetId } = useParams<{ datasetId: string }>();
  const { data, isLoading, error } = useDataset(Number(datasetId), {
    page: 1,
    limit: 10,
  });

  console.log('SimpleDataGrid:', { datasetId, data, isLoading, error });

  if (isLoading) {
    return <div className='p-8'>Loading...</div>;
  }

  if (error) {
    return <div className='p-8 text-red-500'>Error: {error.message}</div>;
  }

  if (!data?.data) {
    return <div className='p-8'>No data found</div>;
  }

  const dataset = data.data;

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>Dataset {datasetId}</h1>
      <p className='mb-4'>
        Rows: {dataset.rows.length} | Columns: {dataset.columns.length}
      </p>

      {/* Simple HTML Table */}
      <div className='overflow-x-auto'>
        <table className='min-w-full border border-gray-300'>
          <thead className='bg-gray-100'>
            <tr>
              {dataset.columns.map((column) => (
                <th
                  key={column}
                  className='border border-gray-300 px-4 py-2 text-left'
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataset.rows.slice(0, 5).map((row) => (
              <tr key={row.id} className='hover:bg-gray-50'>
                {dataset.columns.map((column) => (
                  <td key={column} className='border border-gray-300 px-4 py-2'>
                    {row.data[column]?.toString() || ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SimpleDataGrid;

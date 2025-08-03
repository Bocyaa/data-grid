import SectionTitle from '../components/ui/HomePage/SectionTitle';
import DatasetCard from '../components/ui/HomePage/DatasetCard';
import DropDownCard from '../components/ui/HomePage/DropDownCard';

import type { Dataset } from '../types/api';
import { useDatasets } from '../hooks/useDatasets';

function Home() {
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
    <div className='h-full w-full p-8 overflow-y-auto'>
      <div className='w-full h-full flex flex-col'>
        <SectionTitle title='Datasets' />

        {datasets.length !== 0 ? (
          <div className='flex-1 overflow-y-auto'>
            <div className='flex flex-wrap gap-4 content-start'>
              {datasets.map((dataset: Dataset) => (
                <DatasetCard key={dataset.id} dataset={dataset} />
              ))}
              <DropDownCard />
            </div>
          </div>
        ) : (
          <div className='flex-1 flex items-start justify-start'>
            <DropDownCard />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

import { useNavigate } from 'react-router';

import { useDatasets } from '@/hooks/useDatasets';
import { useActiveDataset } from '@/contexts/hooks/useActiveDataset';
import { useNavBarTabs } from '@/contexts/hooks/useNavBarTabs';

import LogoTitle from '@/components/ui/LeftSideBar/LogoTitle';
import Signature from '@/components/ui/LeftSideBar/Signature';
import TablesListContainer from '@/components/ui/LeftSideBar/TablesListContainer';
import TablesListItem from '@/components/ui/LeftSideBar/TablesListItem';
import UploadButton from '@/components/ui/LeftSideBar/UploadButton';

function LeftSideBar() {
  const { data: datasetsResponse } = useDatasets();
  const datasets = datasetsResponse?.data?.data || [];
  const { isDatasetActive } = useActiveDataset();
  const { addTab } = useNavBarTabs();
  const navigate = useNavigate();

  const handleDatasetClick = (dataset: { id: number; name: string }) => {
    // Add to navbar tabs
    addTab(dataset);
    // Navigate to dataset
    navigate(`${dataset.id}`);
  };

  return (
    <div className='flex flex-col justify-between border-r border-[#eeeeec] bg-[#f9f8f7] w-60 shrink-0'>
      <div>
        <LogoTitle />

        <TablesListContainer>
          {datasets.map((dataset) => (
            <TablesListItem
              key={dataset.id}
              isActive={isDatasetActive(dataset.id)}
              onClick={() => handleDatasetClick(dataset)}
            >
              {dataset.name}
            </TablesListItem>
          ))}
          <UploadButton />
        </TablesListContainer>
      </div>

      <Signature />
    </div>
  );
}

export default LeftSideBar;

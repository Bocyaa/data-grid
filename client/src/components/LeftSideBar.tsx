import LogoTitle from './ui/LeftSideBar/LogoTitle';
import Signature from './ui/LeftSideBar/Signature';
import TablesListContainer from './ui/LeftSideBar/TablesListContainer';
import TablesListItem from './ui/LeftSideBar/TablesListItem';
import UploadButton from './ui/LeftSideBar/UploadButton';
import { useDatasets } from '../hooks/useDatasets';
import { useActiveDataset } from '../hooks/useActiveDataset';
import { useNavigate } from 'react-router';

function LeftSideBar() {
  const { data: datasetsResponse } = useDatasets();
  const datasets = datasetsResponse?.data?.data || [];
  const { isDatasetActive } = useActiveDataset();
  const navigate = useNavigate();

  return (
    <div className='flex flex-col justify-between border-r border-[#eeeeec] bg-[#f9f8f7] w-60 shrink-0'>
      <div>
        <LogoTitle />

        <TablesListContainer>
          {datasets.map((dataset) => (
            <TablesListItem
              key={dataset.id}
              isActive={isDatasetActive(dataset.id)}
              onClick={() => navigate(`${dataset.id}`)}
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

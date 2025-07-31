import LogoTitle from './ui/LeftSideBar/LogoTitle';
import Signature from './ui/LeftSideBar/Signature';
import TablesListContainer from './ui/LeftSideBar/TablesListContainer';
import TablesListItem from './ui/LeftSideBar/TablesListItem';
import UploadButton from './ui/LeftSideBar/UploadButton';

function LeftSideBar() {
  return (
    <div className='flex flex-col justify-between border-r border-[#eeeeec] bg-[#f9f8f7] w-60 shrink-0'>
      <div>
        <LogoTitle />

        <TablesListContainer>
          <TablesListItem onClick={() => {}}>Dataset 1</TablesListItem>
          <TablesListItem onClick={() => {}}>Dataset 2</TablesListItem>
          <TablesListItem onClick={() => {}}>Dataset 3</TablesListItem>
          <UploadButton />
        </TablesListContainer>
      </div>

      <Signature />
    </div>
  );
}

export default LeftSideBar;

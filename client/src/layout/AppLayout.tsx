import { Outlet } from 'react-router';
import LeftSideBar from '../components/LeftSideBar';
import TopNavBar from '../components/TopNavBar';

function AppLayout() {
  return (
    <div className='flex h-full w-full'>
      <LeftSideBar />

      <div className='flex flex-col h-full w-full'>
        <TopNavBar />

        <main className='flex-1 overflow-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;

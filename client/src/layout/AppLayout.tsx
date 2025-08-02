import { Outlet } from 'react-router';
import LeftSideBar from '../components/LeftSideBar';
import TopNavBar from '../components/TopNavBar';
import { ActiveDatasetProvider } from '../contexts/ActiveDatasetContext';
import { NavBarTabsProvider } from '../contexts/NavBarTabsContext';

function AppLayout() {
  return (
    <ActiveDatasetProvider>
      <NavBarTabsProvider>
        <div className='flex h-full w-full'>
          <LeftSideBar />

          <div className='flex flex-col h-full w-full'>
            <TopNavBar />

            <main className='flex-1 overflow-auto'>
              <Outlet />
            </main>
          </div>
        </div>
      </NavBarTabsProvider>
    </ActiveDatasetProvider>
  );
}

export default AppLayout;

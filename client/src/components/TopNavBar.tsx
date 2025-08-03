import { useNavigate } from 'react-router';

import { useActiveDataset } from '@/contexts/hooks/useActiveDataset';
import { useNavBarTabs } from '@/contexts/hooks/useNavBarTabs';

import NavBarItem from './ui/TopNavBar/NavBarItem';
import PlusBtn from './ui/TopNavBar/PlusBtn';

function TopNavBar() {
  const { isDatasetActive, activeDatasetId, isHomeActive } = useActiveDataset();
  const { tabs, datasetTabs, removeTab, canCloseHome } = useNavBarTabs();
  const navigate = useNavigate();

  const handleCloseTab = (tabId: number | 'home') => {
    if (tabId === 'home') {
      // When closing home tab, just hide it and navigate to the first dataset tab
      removeTab('home'); // This will hide the home tab
      if (datasetTabs.length > 0) {
        // Navigate to the first dataset tab
        navigate(`/${datasetTabs[0].id}`);
      }
    } else {
      removeTab(tabId);

      // If we're closing the currently active tab, navigate away
      if (activeDatasetId && String(tabId) === activeDatasetId) {
        // Navigate to home if no tabs remain
        navigate('/');
      }
    }
  };

  const handleTabClick = (tabId: number | 'home') => {
    if (tabId === 'home') {
      navigate('/');
    } else {
      navigate(`/${tabId}`);
    }
  };

  return (
    <div className='flex bg-[#f9f8f7] w-full h-12'>
      <div
        className='flex h-12 overflow-x-auto no-scrollbar'
        style={{ maxWidth: 'calc(100% - 7rem)' }}
      >
        {tabs.map((tab) => (
          <NavBarItem
            key={tab.id}
            title={tab.name}
            isActive={isDatasetActive(tab.id)}
            onClick={() => handleTabClick(tab.id)}
            onClose={
              tab.isHome
                ? canCloseHome
                  ? () => handleCloseTab(tab.id)
                  : undefined
                : () => handleCloseTab(tab.id)
            }
          />
        ))}
      </div>

      <div className='flex items-center border-b border-[#eeeeec] pl-2 min-w-10'>
        {!isHomeActive && <PlusBtn />}
      </div>
    </div>
  );
}

export default TopNavBar;

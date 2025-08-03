import { useContext } from 'react';
import { NavBarTabsContext } from '../NavBarTabsContext';

export function useNavBarTabs() {
  const context = useContext(NavBarTabsContext);
  if (context === undefined) {
    throw new Error('useNavBarTabs must be used within a NavBarTabsProvider');
  }
  return context;
}

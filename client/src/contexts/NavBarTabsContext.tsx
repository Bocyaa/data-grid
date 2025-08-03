import { createContext } from 'react';

type NavBarTab = {
  id: number | 'home';
  name: string;
  isHome?: boolean;
};

type NavBarTabsContextType = {
  tabs: NavBarTab[];
  datasetTabs: NavBarTab[]; // Only dataset tabs (excluding home)
  addTab: (dataset: { id: number; name: string }) => void;
  removeTab: (tabId: number | 'home') => void;
  clearAllTabs: () => void;
  showHomeTab: () => void;
  canCloseHome: boolean;
  isHomeTabVisible: boolean;
};

const NavBarTabsContext = createContext<NavBarTabsContextType | undefined>(
  undefined
);

export { NavBarTabsContext };
export type { NavBarTabsContextType, NavBarTab };

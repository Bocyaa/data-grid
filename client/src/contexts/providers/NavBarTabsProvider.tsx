import { useEffect, useState, type ReactNode } from 'react';
import {
  type NavBarTab,
  type NavBarTabsContextType,
  NavBarTabsContext,
} from '../NavBarTabsContext';

interface NavBarTabsProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'navBarTabs';
const HOME_TAB: NavBarTab = { id: 'home', name: 'Home', isHome: true };

function NavBarTabsProvider({ children }: NavBarTabsProviderProps) {
  const [datasetTabs, setDatasetTabs] = useState<NavBarTab[]>([]);
  const [isHomeTabVisible, setIsHomeTabVisible] = useState(true);

  // Load tabs from localStorage on mount (only dataset tabs)
  useEffect(() => {
    try {
      const savedTabs = localStorage.getItem(STORAGE_KEY);
      if (savedTabs) {
        const parsedTabs = JSON.parse(savedTabs);
        // Filter out any home tabs from saved data and ensure they're dataset tabs
        const validDatasetTabs = parsedTabs.filter(
          (tab: NavBarTab) => tab.id !== 'home' && typeof tab.id === 'number'
        );
        setDatasetTabs(validDatasetTabs);
        // Show home tab if no dataset tabs
        setIsHomeTabVisible(validDatasetTabs.length === 0);
      }
    } catch (error) {
      console.error('Failed to load navbar tabs from localStorage:', error);
    }
  }, []);

  // Save dataset tabs to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(datasetTabs));
    } catch (error) {
      console.error('Failed to save navbar tabs to localStorage:', error);
    }
  }, [datasetTabs]);

  // Show home tab when no dataset tabs exist
  useEffect(() => {
    if (datasetTabs.length === 0) {
      setIsHomeTabVisible(true);
    }
  }, [datasetTabs]);

  // Combine home tab with dataset tabs based on visibility
  const tabs = isHomeTabVisible ? [HOME_TAB, ...datasetTabs] : datasetTabs;
  const canCloseHome = datasetTabs.length > 0;

  const addTab = (dataset: { id: number; name: string }) => {
    setDatasetTabs((currentTabs) => {
      // Check if tab already exists
      const existingTab = currentTabs.find((tab) => tab.id === dataset.id);
      if (existingTab) {
        return currentTabs; // Don't add duplicate
      }

      // Add new dataset tab
      return [...currentTabs, { id: dataset.id, name: dataset.name }];
    });
  };

  const removeTab = (tabId: number | 'home') => {
    if (tabId === 'home') {
      // Hide home tab if there are other tabs
      if (canCloseHome) {
        setIsHomeTabVisible(false);
      }
    } else {
      setDatasetTabs((currentTabs) =>
        currentTabs.filter((tab) => tab.id !== tabId)
      );
    }
  };

  const clearAllTabs = () => {
    setDatasetTabs([]);
    setIsHomeTabVisible(true);
  };

  const showHomeTab = () => {
    setIsHomeTabVisible(true);
  };

  const value: NavBarTabsContextType = {
    tabs,
    datasetTabs,
    addTab,
    removeTab,
    clearAllTabs,
    showHomeTab,
    canCloseHome,
    isHomeTabVisible,
  };

  return (
    <NavBarTabsContext.Provider value={value}>
      {children}
    </NavBarTabsContext.Provider>
  );
}

export { NavBarTabsProvider };

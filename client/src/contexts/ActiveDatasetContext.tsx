import { createContext } from 'react';
import type { ReactNode } from 'react';
import { useParams } from 'react-router';

interface ActiveDatasetContextType {
  activeDatasetId: string | null;
  isDatasetActive: (datasetId: number | string) => boolean;
  isHomeActive: boolean;
}

export const ActiveDatasetContext = createContext<
  ActiveDatasetContextType | undefined
>(undefined);

interface ActiveDatasetProviderProps {
  children: ReactNode;
}

export function ActiveDatasetProvider({
  children,
}: ActiveDatasetProviderProps) {
  const { datasetId } = useParams<{ datasetId: string }>();

  const activeDatasetId = datasetId || null;
  const isHomeActive = !datasetId; // Home is active when there's no datasetId

  const isDatasetActive = (datasetId: number | string): boolean => {
    if (datasetId === 'home') return isHomeActive;
    if (!activeDatasetId) return false;
    return String(datasetId) === activeDatasetId;
  };

  const value: ActiveDatasetContextType = {
    activeDatasetId,
    isDatasetActive,
    isHomeActive,
  };

  return (
    <ActiveDatasetContext.Provider value={value}>
      {children}
    </ActiveDatasetContext.Provider>
  );
}

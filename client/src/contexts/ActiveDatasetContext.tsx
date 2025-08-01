import { createContext } from 'react';
import type { ReactNode } from 'react';
import { useParams } from 'react-router';

interface ActiveDatasetContextType {
  activeDatasetId: string | null;
  isDatasetActive: (datasetId: number | string) => boolean;
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

  const isDatasetActive = (datasetId: number | string): boolean => {
    if (!activeDatasetId) return false;
    return String(datasetId) === activeDatasetId;
  };

  const value: ActiveDatasetContextType = {
    activeDatasetId,
    isDatasetActive,
  };

  return (
    <ActiveDatasetContext.Provider value={value}>
      {children}
    </ActiveDatasetContext.Provider>
  );
}

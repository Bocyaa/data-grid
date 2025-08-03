import { createContext } from 'react';

interface ActiveDatasetContextType {
  activeDatasetId: string | null;
  isDatasetActive: (datasetId: number | string) => boolean;
  isHomeActive: boolean;
}

const ActiveDatasetContext = createContext<
  ActiveDatasetContextType | undefined
>(undefined);

export { ActiveDatasetContext };
export type { ActiveDatasetContextType };

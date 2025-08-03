import { useContext } from 'react';
import { ActiveDatasetContext } from '@/contexts/ActiveDatasetContext';

export function useActiveDataset() {
  const context = useContext(ActiveDatasetContext);
  if (context === undefined) {
    throw new Error(
      'useActiveDataset must be used within an ActiveDatasetProvider'
    );
  }
  return context;
}

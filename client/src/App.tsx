import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import AppLayout from './layout/AppLayout';
import DataGrid from './pages/DataGrid';
import DatasetList from './pages/DatasetList';
import DataGridLayout from './layout/DataGridLayout';
import RowDetail from './pages/RowDetail';

// Register AG Grid Community modules
ModuleRegistry.registerModules([AllCommunityModule]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false, // Don't refetch on window regain focus
      refetchOnMount: 'always', // Always refetch when component mounts
      refetchOnReconnect: true, // Refetch when reconnecting
      retry: 3, // Prevent infinite loading (limit 3)
      retryDelay: (i) => Math.min(1000 * 2 ** i, 30_000),
      networkMode: 'online', // Run when online only
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DatasetList />} />
            <Route path=':datasetId' element={<DataGridLayout />}>
              <Route index element={<DataGrid />} />
              <Route path=':rowId' element={<RowDetail />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

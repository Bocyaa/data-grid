import { BrowserRouter, Route, Routes } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';

import { Toaster } from 'react-hot-toast';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

import { queryClient } from '@/lib/queryClient';
import { toastConfig } from '@/config/toast';

import AppLayout from '@/layout/AppLayout';
import Home from '@/pages/Home';
import DataGridLayout from '@/layout/DataGridLayout';
import DataGrid from '@/pages/DataGrid';
import RowDetail from '@/pages/RowDetail';

// Register AG Grid Community modules
ModuleRegistry.registerModules([AllCommunityModule]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path=':datasetId' element={<DataGridLayout />}>
              <Route index element={<DataGrid />} />
              <Route path=':rowId' element={<RowDetail />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position='top-center' toastOptions={toastConfig} />
    </QueryClientProvider>
  );
}

export default App;

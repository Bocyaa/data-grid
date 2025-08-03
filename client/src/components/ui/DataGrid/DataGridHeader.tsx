import { Box } from '@mui/material';
import DeleteRowsBtn from '@/components/ui/DataGrid/DeleteRowsBtn';
import DataGridSearchBar from '@/components/ui/DataGrid/DataGridSearchBar';
import type { ConfirmDialogState } from '@/types';

interface DataGridHeaderProps {
  selectedRows: number[];
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  setConfirmDialog: (state: ConfirmDialogState) => void;
}

function DataGridHeader({
  selectedRows,
  searchQuery,
  onSearchChange,
  onClearSearch,
  setConfirmDialog,
}: DataGridHeaderProps) {
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e5e7',
        px: 3,
        py: 2,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Action Button */}
        <DeleteRowsBtn
          selectedRows={selectedRows}
          setConfirmDialog={setConfirmDialog}
        />

        {/* Search Bar */}
        <DataGridSearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onClear={onClearSearch}
        />
      </Box>
    </Box>
  );
}

export default DataGridHeader;

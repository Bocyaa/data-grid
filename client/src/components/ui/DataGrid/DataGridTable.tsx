import { Box, CircularProgress } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import type {
  GridReadyEvent,
  RowDoubleClickedEvent,
  ColDef,
} from 'ag-grid-community';
import {
  DEFAULT_COL_DEF,
  GRID_OPTIONS,
  DATA_GRID_CONFIG,
} from '../../../config/dataGridConfig';

interface DataGridTableProps {
  rowData: any[];
  columnDefs: ColDef[];
  isLoading: boolean;
  onGridReady: (params: GridReadyEvent) => void;
  onRowDoubleClicked: (event: RowDoubleClickedEvent) => void;
  onSelectionChanged: () => void;
  onResize: () => void;
}

function DataGridTable({
  rowData,
  columnDefs,
  isLoading,
  onGridReady,
  onRowDoubleClicked,
  onSelectionChanged,
  onResize,
}: DataGridTableProps) {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress size={48} className='!text-[#5f5e5b]' />
      </Box>
    );
  }

  return (
    <AgGridReact
      rowData={rowData}
      columnDefs={columnDefs}
      onGridReady={onGridReady}
      onRowDoubleClicked={onRowDoubleClicked}
      onSelectionChanged={onSelectionChanged}
      suppressMenuHide={GRID_OPTIONS.suppressMenuHide}
      rowSelection={GRID_OPTIONS.rowSelection}
      enableCellTextSelection={GRID_OPTIONS.enableCellTextSelection}
      animateRows={GRID_OPTIONS.animateRows}
      headerHeight={DATA_GRID_CONFIG.GRID_HEADER_HEIGHT}
      rowHeight={DATA_GRID_CONFIG.GRID_ROW_HEIGHT}
      defaultColDef={DEFAULT_COL_DEF}
      getRowId={(params) => params.data._rowId?.toString()}
      onFirstDataRendered={onResize}
      onGridSizeChanged={onResize}
    />
  );
}

export default DataGridTable;

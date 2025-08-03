import {
  Box,
  IconButton,
  Tooltip,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import { DATA_GRID_CONFIG } from '@/config/dataGridConfig';

interface PaginationData {
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

interface DataGridFooterProps {
  pagination: PaginationData;
  pageInputValue: string;
  pageSize: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPageInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPageInputSubmit: () => void;
  onPageInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

function DataGridFooter({
  pagination,
  pageInputValue,
  pageSize,
  onPreviousPage,
  onNextPage,
  onPageInputChange,
  onPageInputSubmit,
  onPageInputKeyDown,
  onPageSizeChange,
}: DataGridFooterProps) {
  return (
    <Box
      sx={{
        backgroundColor: '#f9f8f7',
        borderTop: '1px solid #e5e5e7',
        px: 3,
        py: 1,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: 0.5,
          px: 1,
          borderRadius: '6px',
          gap: 1.5,
        }}
      >
        <Tooltip title='Previous page'>
          <IconButton
            onClick={onPreviousPage}
            disabled={!pagination.hasPrevPage}
            className='!border !border-[#d4d4d4] !rounded disabled:!opacity-50 disabled:!cursor-not-allowed hover:!bg-gray-50 !shadow-xs'
            size='small'
          >
            <WestIcon className='!w-5 !h-5 text-[#707070]' />
          </IconButton>
        </Tooltip>

        <Box sx={{ display: 'flex', fontSize: '14px', alignItems: 'center' }}>
          <Typography
            component='span'
            sx={{
              fontWeight: 500,
              color: '#525252',
              cursor: 'default',
            }}
          >
            Page
          </Typography>

          <TextField
            size='small'
            value={pageInputValue}
            onChange={onPageInputChange}
            onBlur={onPageInputSubmit}
            onKeyDown={onPageInputKeyDown}
            sx={{
              mx: 1,
              width: '40px',
              '& .MuiOutlinedInput-root': {
                height: '28px',
                backgroundColor: '#f6f6f6',
                '& input': {
                  textAlign: 'center',
                  padding: '4px 8px',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#c7c7c7',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0094f6',
                },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#c7c7c7',
              },
            }}
          />

          <Typography
            component='span'
            sx={{
              fontWeight: 500,
              color: '#525252',
              cursor: 'default',
            }}
          >
            of {pagination.totalPages}
          </Typography>
        </Box>

        <Tooltip title='Next page'>
          <IconButton
            onClick={onNextPage}
            disabled={!pagination.hasNextPage}
            className='!border !border-[#d4d4d4] !rounded disabled:!opacity-50 disabled:!cursor-not-allowed hover:!bg-gray-50 !shadow-xs'
            size='small'
          >
            <EastIcon className='!w-5 !h-5 text-[#707070]' />
          </IconButton>
        </Tooltip>

        <FormControl size='small'>
          <Select
            value={pageSize}
            onChange={(e) => onPageSizeChange(e.target.value as number)}
            displayEmpty
            sx={{
              height: '30px',
              minWidth: '80px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d4d4d4',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d4d4d4',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0094f6',
              },
              '& .MuiSelect-select': {
                padding: '4px 8px',
                fontSize: '14px',
                color: '#171717',
              },
            }}
          >
            {DATA_GRID_CONFIG.PAGE_SIZE_OPTIONS.map((size) => (
              <MenuItem key={size} value={size}>
                {size} rows
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}

export default DataGridFooter;

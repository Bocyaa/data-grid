import { TextField, InputAdornment, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface DataGridSearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder?: string;
  maxWidth?: string;
}

function DataGridSearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search in all columns...',
  maxWidth = '384px',
}: DataGridSearchBarProps) {
  return (
    <Box sx={{ maxWidth }}>
      <TextField
        size='small'
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        variant='outlined'
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon className='!w-4 !h-4 text-gray-500' />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position='end'>
              <IconButton
                onClick={onClear}
                size='small'
                className='!text-gray-400 hover:!text-gray-600'
              >
                <ClearIcon className='!w-4 !h-4' />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'white',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#0094f6',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#0094f6',
            },
          },
        }}
      />
    </Box>
  );
}

export default DataGridSearchBar;

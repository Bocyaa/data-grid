import { Box, Typography, Button } from '@mui/material';

interface DataGridErrorProps {
  error: Error;
  onRetry: () => void;
}

function DataGridError({ error, onRetry }: DataGridErrorProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 2,
      }}
    >
      <Typography
        variant='h6'
        sx={{
          fontSize: '18px',
          color: '#dc2626',
          textAlign: 'center',
        }}
      >
        Error loading dataset: {error.message}
      </Typography>
      <Button
        variant='contained'
        onClick={onRetry}
        sx={{
          backgroundColor: '#0094f6',
          '&:hover': {
            backgroundColor: '#0073cc',
          },
        }}
      >
        Retry
      </Button>
    </Box>
  );
}

export default DataGridError;

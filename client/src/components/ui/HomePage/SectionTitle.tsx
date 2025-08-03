import { Box, Typography } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';

interface SectionProps {
  title: string;
}

function SectionTitle({ title }: SectionProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 1,
        pl: 2,
        gap: 1,
        cursor: 'default',
      }}
    >
      <StorageIcon sx={{ width: '16px', height: '16px', color: '#73726e' }} />
      <Typography
        variant='h6'
        sx={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#73726e',
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

export default SectionTitle;

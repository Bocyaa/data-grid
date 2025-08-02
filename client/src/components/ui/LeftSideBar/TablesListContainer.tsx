import type { ReactNode } from 'react';
import { Typography } from '@mui/material';

interface ComponentProps {
  children: ReactNode;
}

function TablesListContainer({ children }: ComponentProps) {
  return (
    <div className='flex flex-col pt-10 px-3'>
      <Typography
        variant='overline'
        className='!text-sm !font-semibold !text-[#91918e] !pb-2 !px-2 !block'
      >
        Datasets
      </Typography>
      <div className='flex flex-col gap-1 pb-2'>{children}</div>
    </div>
  );
}

export default TablesListContainer;

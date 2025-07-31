import type { ReactNode } from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

interface ComponentProps {
  children: ReactNode;
  onClick: () => void;
}

function TablesListItem({ children, onClick }: ComponentProps) {
  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={onClick}
        className='!px-2 !py-1 !rounded-md hover:!bg-[#f1f0ef] !transition-colors !duration-200 !ease-in-out'
      >
        <ListItemIcon className='!min-w-0 !mr-2'>
          <DescriptionOutlinedIcon className='!w-5 !h-5 !text-[#91918e]' />
        </ListItemIcon>
        <ListItemText
          primary={children}
          slotProps={{
            primary: {
              className: '!font-medium !text-[#5f5e5b] !text-base',
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default TablesListItem;

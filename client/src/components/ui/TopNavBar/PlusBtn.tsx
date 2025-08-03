import { useNavigate } from 'react-router';
import { IconButton, Tooltip } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useNavBarTabs } from '@/contexts/hooks/useNavBarTabs';

function PlusBtn() {
  const navigate = useNavigate();
  const { isHomeTabVisible, showHomeTab } = useNavBarTabs();

  const handleClick = () => {
    if (!isHomeTabVisible) {
      showHomeTab();
    }
    navigate('/');
  };

  return (
    <Tooltip title='Go to Home'>
      <IconButton
        onClick={handleClick}
        className='!rounded-md hover:!bg-[#f1f0ef] !transition-colors'
        size='small'
      >
        <AddOutlinedIcon className='!w-6 !h-6 !text-[#91918e]' />
      </IconButton>
    </Tooltip>
  );
}

export default PlusBtn;

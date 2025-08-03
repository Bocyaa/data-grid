import { useNavigate } from 'react-router';
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
    <button
      onClick={handleClick}
      className='cursor-pointer hover:bg-[#f1f0ef] rounded-md transition-colors'
    >
      <AddOutlinedIcon className='!w-6 !h-6 !text-[#91918e]' />
    </button>
  );
}

export default PlusBtn;

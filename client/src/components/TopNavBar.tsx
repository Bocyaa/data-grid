import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import NavBarItem from './ui/TopNavBar/NavBarItem';

function TopNavBar() {
  return (
    <div className='border-[#eeeeec] bg-[#f9f8f7] w-full h-10 flex shrink-0'>
      <NavBarItem title='Dataset 1' />

      <div className='relative flex w-48 border-r pl-4 overflow-hidden items-center justify-between z-10 border-[#eeeeec] group cursor-default bg-white shrink-0'>
        <span className='flex items-center whitespace-nowrap '>Dataset 2</span>

        <button className='absolute flex justify-center items-center right-0 inset-y-0 z-10 pr-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'>
          <CloseOutlinedIcon className='!w-5 !h-5 !text-[#91918e] hover:bg-[#f1f0ef] rounded-sm transition-colors' />
        </button>

        {/* Hides Text Overflow */}
        <div className='absolute z-0 right-3 w-4 h-full inset-y-0 bg-gradient-to-l from-[#ffffff] to-[#ffffff]/60'></div>
        <div className='absolute z-0 right-0 w-3 group-hover:w-8 h-full bg-[#ffffff] group-hover:bg-[#ffffff]'></div>
      </div>

      <NavBarItem title='Dataset 3' />

      <div className='border-b border-[#eeeeec] w-full flex items-center pl-2'>
        <button className='cursor-pointer hover:bg-[#f1f0ef] rounded-md transition-colors'>
          <AddOutlinedIcon className='!w-6 !h-6 !text-[#91918e]' />
        </button>
      </div>
    </div>
  );
}

export default TopNavBar;

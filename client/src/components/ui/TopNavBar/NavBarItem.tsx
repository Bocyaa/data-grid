import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

interface ItemProps {
  title: string;
  onClick: () => void;
  onClose?: () => void;
  isActive?: boolean;
}

function NavBarItem({ title, onClick, onClose, isActive = false }: ItemProps) {
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the main onClick
    onClose?.();
  };

  return (
    <button
      onClick={onClick}
      className={`relative flex min-w-28 max-w-48 border-r border-b pl-4 pr-8 overflow-hidden items-center z-10 border-[#eeeeec] group hover:bg-[#f1f0ef] cursor-pointer shrink-0 ${
        isActive ? 'bg-white border-b-white' : ''
      }`}
    >
      <span
        className={`flex items-center whitespace-nowrap ${
          isActive ? 'text-[#3b3b3b] font-medium' : ''
        }`}
      >
        {title}
      </span>

      {onClose && (
        <button
          onClick={handleCloseClick}
          className='absolute flex justify-center items-center right-0 inset-y-0 z-10 pr-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'
        >
          <CloseOutlinedIcon className='!w-5 !h-5 !text-[#91918e] hover:bg-[#e8e7e7] rounded-sm transition-colors' />
        </button>
      )}

      {/* Hides Text Overflow */}
      <div
        className={`absolute z-0 right-3 w-4 h-full inset-y-0 bg-gradient-to-l ${
          isActive
            ? 'from-[#ffffff] to-[#ffffff]/60'
            : 'from-[#f9f8f7] to-[#f9f8f7]/60'
        }`}
      ></div>
      <div
        className={`absolute z-0 right-0 w-3 group-hover:w-8 h-full ${
          isActive
            ? 'bg-[#ffffff] group-hover:bg-[#f1f0ef]'
            : 'bg-[#f9f8f7] group-hover:bg-[#f1f0ef]'
        }`}
      ></div>
    </button>
  );
}

export default NavBarItem;

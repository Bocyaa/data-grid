interface SaveBtnProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

function SaveBtn({
  onClick,
  disabled = false,
  isLoading = false,
}: SaveBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      data-save-btn
      className='flex px-3 py-1 items-center disabled:opacity-50 disabled:cursor-not-allowed bg-[#2383e2] hover:bg-[#0277d4] transition-all rounded-lg shadow-xs cursor-pointer gap-2'
    >
      {isLoading && (
        <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
      )}
      <span className='font-medium text-white'>
        {isLoading ? 'Saving...' : 'Save'}
      </span>
    </button>
  );
}

export default SaveBtn;

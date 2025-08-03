interface CancelBtnProps {
  onClick: () => void;
  disabled?: boolean;
}

function CancelBtn({ onClick, disabled = false }: CancelBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-cancel-btn
      className='flex px-3 py-1 items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#ededed] transition-all border rounded-lg border-[#d4d4d4] shadow-xs cursor-pointer'
    >
      <span className='font-medium'>Cancel</span>
    </button>
  );
}

export default CancelBtn;

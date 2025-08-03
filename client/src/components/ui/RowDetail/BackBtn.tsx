import WestIcon from '@mui/icons-material/West';

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      data-delete-rows-btn
      className='flex px-3 py-1 items-center disabled:opacity-0 hover:bg-[#ededed] transition-all border rounded-lg border-[#d4d4d4] shadow-xs cursor-pointer gap-2'
    >
      <WestIcon
        style={{ height: '1.1rem', width: '1.1rem', color: '#707070' }}
      />
      <span>Back to Dataset</span>
    </button>
  );
}

export default BackBtn;

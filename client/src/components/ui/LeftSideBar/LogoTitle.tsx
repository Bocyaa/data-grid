import StorageIcon from '@mui/icons-material/Storage';

function LogoTitle() {
  return (
    <div className='flex items-end py-3 px-4 gap-3'>
      <h1 className='text-4xl font-bold text-[#5f5e5b] leading-8'>DataGrid</h1>
      <StorageIcon className='!w-9 !h-9 text-[#5f5e5b] !translate-y-0.5' />
    </div>
  );
}

export default LogoTitle;

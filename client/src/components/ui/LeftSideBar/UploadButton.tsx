import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Button } from '@mui/material';

function UploadButton() {
  return (
    <Button
      className='!rounded-md !justify-start !items-center hover:!bg-[#f1f0ef] !transition-colors !duration-200 !ease-in-out !cursor-pointer !font-medium !text-[#91918e] !normal-case hover:!text-[#5f5e5b]'
      disableRipple
      disableElevation
    >
      <AddOutlinedIcon className='!w-5 !h-5 !text-[#91918e]' />
      <span className='px-2'>Upload CSV</span>
    </Button>
  );
}

export default UploadButton;

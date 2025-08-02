import StorageIcon from '@mui/icons-material/Storage';

interface SectionProps {
  title: string;
}

function SectionTitle({ title }: SectionProps) {
  return (
    <div className='flex items-center mb-2 pl-4 gap-2 cursor-default'>
      <StorageIcon className='!w-4 !h-4 text-[#73726e]' />
      <h1 className='text-lg font-semibold text-[#73726e]'>{title}</h1>
    </div>
  );
}

export default SectionTitle;

import { useNavigate } from 'react-router';

function LogoTitle() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      className='flex items-center py-2 px-4 gap-3 group cursor-pointer border-b border-[#eeeeec] w-full h-12'
    >
      <h1 className='text-3xl font-bold text-[#5f5e5b] group-hover:text-[#32302c]'>
        DataGrid
      </h1>
    </button>
  );
}

export default LogoTitle;

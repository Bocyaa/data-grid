import { useCallback } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import type { ConfirmDialogState } from '../../../types';

interface ButtonProps {
  selectedRows: number[];
  setConfirmDialog: (dialog: ConfirmDialogState) => void;
}

function DeleteRowsBtn({ selectedRows, setConfirmDialog }: ButtonProps) {
  const handleBulkDelete = useCallback(() => {
    if (selectedRows.length > 0) {
      setConfirmDialog({ isOpen: true, rowId: null, isMultiple: true });
    }
  }, [selectedRows, setConfirmDialog]);

  return (
    <button
      onClick={handleBulkDelete}
      disabled={selectedRows.length === 0}
      data-delete-rows-btn
      className='flex px-3 py-1 items-center disabled:opacity-0 hover:bg-[#ededed] transition-all border rounded-lg border-[#d4d4d4] shadow-xs cursor-pointer gap-2'
    >
      <DeleteOutlineOutlinedIcon
        style={{ height: '1.1rem', width: '1.1rem', color: '#707070' }}
      />
      <span className='text-[0.9rem] translate-y-[0.05rem]'>
        Delete{' '}
        {`${selectedRows.length} ${selectedRows.length > 1 ? 'rows' : 'row'}`}
      </span>
    </button>
  );
}

export default DeleteRowsBtn;

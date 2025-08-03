import type { ICellRendererParams } from 'ag-grid-community';

interface ActionsCellRendererProps {
  params: ICellRendererParams;
  onView: (rowId: number) => void;
  onDelete: (rowId: number) => void;
}

function ActionsCellRenderer({
  params,
  onView,
  onDelete,
}: ActionsCellRendererProps) {
  const rowId = params.data._rowId;

  return (
    <div className='flex gap-2 h-full items-center pt-1.5'>
      <button
        onClick={() => onView(rowId)}
        className='px-3 py-1 text-xs border border-[#e5e5e5] text-blue-500 rounded hover:bg-blue-600/10 transition-colors cursor-pointer font-medium'
      >
        View
      </button>
      <button
        onClick={() => onDelete(rowId)}
        className='px-3 py-1 text-xs border border-[#e5e5e5] text-red-500 rounded hover:bg-red-600/10 transition-colors cursor-pointer font-medium'
      >
        Delete
      </button>
    </div>
  );
}

export default ActionsCellRenderer;

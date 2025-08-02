import { useState } from 'react';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import toast from 'react-hot-toast';
import type { Dataset } from '../../../types';
import { useDeleteDataset, useNavBarTabs } from '../../../hooks';
import { useNavigate } from 'react-router';
import ConfirmDialog from '../ConfirmDialog';

interface CardProps {
  dataset: Dataset;
}

function DatasetCard({ dataset }: CardProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { addTab, removeTab } = useNavBarTabs();
  const deleteMutation = useDeleteDataset();
  const navigate = useNavigate();

  const handleDatasetClick = (dataset: Dataset, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the Link from navigating

    // Add to navbar tabs
    addTab({ id: dataset.id, name: dataset.name });

    // Navigate to dataset
    navigate(`${dataset.id}`);
  };

  const handleDeleteDataset = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the Link from navigating
    e.stopPropagation(); // Prevent event bubbling

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmDialog(false);

    try {
      await deleteMutation.mutateAsync(dataset.id);

      // Remove from navbar tabs if it exists
      removeTab(dataset.id);

      // Show success message
      toast.success(`Dataset has been deleted.`);
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete dataset. Please try again.');
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
  };

  return (
    <div
      key={dataset.id}
      onClick={(e) => handleDatasetClick(dataset, e)}
      className='relative flex flex-col py-6 border border-[#eeeeec] hover:border-[#d6d6d4] rounded-3xl aspect-square w-50 transition-colors overflow-hidden cursor-pointer'
    >
      <div className='z-10 pb-2 pt-7 px-4'>
        <DescriptionOutlinedIcon className={`!w-12 !h-12 !text-[#91918e]`} />
      </div>
      <div className='flex flex-col justify-between h-full'>
        <h2 className='leading-5 font-medium text-gray-900 px-6'>
          {dataset.name}
        </h2>

        <span className='text-gray-500 text-xs px-6'>
          {dataset.rowCount} rows
        </span>
      </div>

      <button
        className='group absolute z-10 top-4 right-5'
        onClick={handleDeleteDataset}
      >
        <DeleteOutlineOutlinedIcon className='!w-6 !h-6 text-[#a6a299] hover:text-red-700 cursor-pointer' />

        <div className='absolute -right-2 top-8 px-2 py-1 rounded-lg flex items-center bg-[#0f0f0f] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'>
          <span className='text-xs whitespace-nowrap text-[#ffffff] font-medium'>
            Delete Dataset
          </span>
        </div>
      </button>

      <div className='absolute bg-[#f8f8f7] top-0 inset-x-0 h-20'></div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title='Delete Dataset'
        message={`Are you sure you want to delete "${dataset.name}"? This action cannot be undone and will permanently delete ${dataset.rowCount} rows of data.`}
        confirmText='Delete'
        cancelText='Cancel'
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default DatasetCard;

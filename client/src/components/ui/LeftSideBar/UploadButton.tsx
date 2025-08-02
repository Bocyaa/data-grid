import { useRef, useState } from 'react';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { useUploadDataset } from '../../../hooks/useDatasets';
import { useNavBarTabs } from '../../../hooks/useNavBarTabs';

function UploadButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const uploadMutation = useUploadDataset();
  const { addTab } = useNavBarTabs();
  const navigate = useNavigate();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Please select a valid CSV file.');
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadMutation.mutateAsync(file);

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Extract dataset name from filename (remove extension)
      const datasetName = file.name.replace(/\.[^/.]+$/, '');

      // Add to navbar tabs
      addTab({ id: result.data.datasetId, name: datasetName });

      // Show success message
      toast.success(`Dataset uploaded successfully!`);

      // Navigate to the newly created dataset
      navigate(`/${result.data.datasetId}`);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(
        "Failed to upload file. Please make sure it's a valid CSV file and try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type='file'
        accept='.csv'
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button
        onClick={handleClick}
        disabled={isUploading}
        className='!rounded-md !justify-start !items-center hover:!bg-[#f1f0ef] !transition-colors !duration-200 !ease-in-out !cursor-pointer !font-medium !text-[#91918e] !normal-case hover:!text-[#5f5e5b] disabled:!opacity-50 disabled:!cursor-not-allowed'
        disableRipple
        disableElevation
      >
        {isUploading ? (
          <CircularProgress size={20} className='!text-[#91918e]' />
        ) : (
          <AddOutlinedIcon className='!w-5 !h-5 !text-[#91918e]' />
        )}
        <span className='px-2'>
          {isUploading ? 'Uploading...' : 'Upload CSV'}
        </span>
      </Button>
    </>
  );
}

export default UploadButton;

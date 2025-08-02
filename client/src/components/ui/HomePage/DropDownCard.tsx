import { useState, useRef, useCallback } from 'react';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CircularProgress from '@mui/material/CircularProgress';
import toast from 'react-hot-toast';
import { useUploadDataset } from '../../../hooks/useDatasets';

interface CardProps {
  message?: string;
}

function DropDownCard({ message = 'Drop CSV here to upload' }: CardProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadDataset();

  const validateFile = (file: File): boolean => {
    // Check file type
    if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Please select a CSV file.');
      return false;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB.');
      return false;
    }

    return true;
  };

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!validateFile(file)) return;

      try {
        await uploadMutation.mutateAsync(file);
        toast.success(`Dataset uploaded successfully!`);
      } catch (error) {
        console.error('Upload failed:', error);
        toast.error('Failed to upload dataset. Please try again.');
      }
    },
    [uploadMutation]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set to false if we're leaving the main container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Ensure we maintain the drag over state
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Reset state immediately on drop
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileUpload(files[0]);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    },
    [handleFileUpload]
  );

  const isLoading = uploadMutation.isPending;
  const Icon = isLoading
    ? CircularProgress
    : isDragOver
    ? CloudUploadIcon
    : AddBoxOutlinedIcon;

  return (
    <div
      onClick={isLoading ? undefined : handleFileSelect}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative flex flex-col py-6 border rounded-3xl aspect-square w-50 overflow-hidden transition-all duration-200 ${
        isLoading
          ? 'border-[#eeeeec] cursor-not-allowed'
          : isDragOver
          ? 'border-blue-400 bg-blue-50 border-dashed cursor-pointer'
          : 'border-[#eeeeec] hover:border-[#d6d6d5] hover:shadow-sm cursor-pointer'
      }`}
    >
      <input
        ref={fileInputRef}
        type='file'
        accept='.csv,text/csv'
        onChange={handleFileInputChange}
        className='hidden'
        disabled={isLoading}
      />

      <div className='z-10 pb-2 pt-7 px-4'>
        {isLoading ? (
          <CircularProgress size={48} className='!text-[#c7c6c4]' />
        ) : (
          <Icon
            className={`!w-12 !h-12 ${
              isDragOver ? '!text-blue-500' : '!text-[#c7c6c4]'
            }`}
          />
        )}
      </div>

      <div className='flex flex-col justify-between h-full gap-3'>
        <h2
          className={`leading-5 font-medium px-6 cursor-default ${
            isLoading
              ? 'text-[#ababa9]'
              : isDragOver
              ? 'text-blue-600'
              : 'text-[#ababa9]'
          }`}
        >
          {isLoading
            ? 'Uploading CSV...'
            : isDragOver
            ? 'Release to upload CSV'
            : message}
        </h2>

        <div className='pl-6'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isLoading) handleFileSelect();
            }}
            disabled={isLoading}
            className={`border rounded-lg px-2 flex py-1 transition-colors ${
              isLoading
                ? 'border-[#e5e5e5] bg-[#f5f5f5] cursor-not-allowed opacity-50'
                : 'border-[#e5e5e5] bg-[#f9f8f7] cursor-pointer hover:border-[#d6d6d5] hover:shadow-sm'
            }`}
          >
            <span
              className={`text-xs font-medium ${
                isLoading ? 'text-[#9f9e9b]' : 'text-[#5f5e5b]'
              }`}
            >
              {isLoading ? 'Uploading...' : 'Select from device'}
            </span>
          </button>
        </div>
      </div>

      <div
        className={`absolute top-0 inset-x-0 h-20 transition-colors ${
          isDragOver ? 'bg-blue-100' : 'bg-[#fbfbfa]'
        }`}
      ></div>
    </div>
  );
}

export default DropDownCard;

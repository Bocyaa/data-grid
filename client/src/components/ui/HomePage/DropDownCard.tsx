import { useState, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { useUploadDataset } from '@/hooks/useDatasets';

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

  return (
    <Card
      onClick={isLoading ? undefined : handleFileSelect}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        aspectRatio: '1',
        width: '200px',
        borderRadius: '24px',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        border: isDragOver ? '2px dashed #60a5fa' : '1px solid #eeeeec',
        backgroundColor: isDragOver ? '#dbeafe' : 'white',
        '&:hover': !isLoading
          ? {
              borderColor: isDragOver ? '#60a5fa' : '#d6d6d5',
              boxShadow: isDragOver
                ? '0 0 0 1px #60a5fa'
                : '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            }
          : {},
      }}
    >
      <input
        ref={fileInputRef}
        type='file'
        accept='.csv,text/csv'
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        disabled={isLoading}
      />

      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '80px',
          backgroundColor: isDragOver ? '#dbeafe' : '#fbfbfa',
          transition: 'background-color 0.2s ease',
        }}
      />

      <CardContent
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 16px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: '8px',
            paddingTop: '28px',
          }}
        >
          {isLoading ? (
            <CircularProgress size={48} sx={{ color: '#c7c6c4' }} />
          ) : (
            <Box
              component={isDragOver ? CloudUploadIcon : AddBoxOutlinedIcon}
              sx={{
                width: '48px',
                height: '48px',
                color: isDragOver ? '#3b82f6' : '#c7c6c4',
              }}
            />
          )}
        </Box>

        {/* Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            gap: '12px',
          }}
        >
          <Typography
            variant='h6'
            sx={{
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '20px',
              textAlign: 'center',
              cursor: 'default',
              color: isLoading ? '#ababa9' : isDragOver ? '#2563eb' : '#ababa9',
            }}
          >
            {isLoading
              ? 'Uploading CSV...'
              : isDragOver
              ? 'Release to upload'
              : message}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default DropDownCard;

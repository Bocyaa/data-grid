import { useState } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

import {
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
} from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import type { Dataset } from '@/types';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

import { useDeleteDataset } from '@/hooks/useDatasets';
import { useNavBarTabs } from '@/contexts/hooks/useNavBarTabs';

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
    <Card
      sx={{
        position: 'relative',
        aspectRatio: '1',
        width: '200px',
        borderRadius: '24px',
        border: '1px solid #eeeeec',
        transition: 'all 0.2s ease',
        overflow: 'hidden',
        '&:hover': {
          borderColor: '#d6d6d4',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        },
      }}
    >
      <CardActionArea
        onClick={(e) => handleDatasetClick(dataset, e)}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: 0,
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '80px',
            backgroundColor: '#f8f8f7',
          }}
        />

        <CardContent
          sx={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '28px',
            paddingBottom: '24px',
            paddingLeft: '16px',
            paddingRight: '16px',
            '&:last-child': {
              paddingBottom: '24px',
            },
          }}
        >
          {/* Icon */}
          <Box sx={{ paddingBottom: '8px', paddingTop: '28px' }}>
            <DescriptionOutlinedIcon
              sx={{
                width: '48px',
                height: '48px',
                color: '#91918e',
              }}
            />
          </Box>

          {/* Content */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              paddingLeft: '8px',
              paddingRight: '8px',
            }}
          >
            <Typography
              variant='h6'
              sx={{
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: '20px',
                color: '#111827',
                marginBottom: 'auto',
              }}
            >
              {dataset.name}
            </Typography>

            <Typography
              variant='caption'
              sx={{
                fontSize: '12px',
                color: '#6b7280',
              }}
            >
              {dataset.rowCount} rows
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>

      {/* Delete Button */}
      <Tooltip title='Delete Dataset' placement='top'>
        <IconButton
          onClick={handleDeleteDataset}
          size='small'
          sx={{
            position: 'absolute',
            top: 16,
            right: 20,
            zIndex: 10,
            '& .MuiSvgIcon-root': {
              color: '#a6a299',
              transition: 'color 0.2s ease',
              '&:hover': {
                color: '#dc2626',
              },
            },
          }}
        >
          <DeleteOutlineOutlinedIcon sx={{ width: '24px', height: '24px' }} />
        </IconButton>
      </Tooltip>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title='Delete Dataset'
        message={`Are you sure you want to delete "${dataset.name}"? This action cannot be undone and will permanently delete ${dataset.rowCount} rows of data.`}
        confirmText='Delete'
        cancelText='Cancel'
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Card>
  );
}

export default DatasetCard;

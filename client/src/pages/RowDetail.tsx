import { useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Divider,
  Button,
  CircularProgress,
} from '@mui/material';
import { useDatasetRow, useUpdateDatasetRow } from '@/hooks/useDatasets';
import BackBtn from '@/components/ui/RowDetail/BackBtn';
import SaveBtn from '@/components/ui/RowDetail/SaveBtn';
import CancelBtn from '@/components/ui/RowDetail/CancelBtn';
import EditableField from '@/components/ui/RowDetail/EditableField';
import EditBtn from '@/components/ui/RowDetail/EditBtn';

function RowDetail() {
  const { datasetId, rowId } = useParams<{
    datasetId: string;
    rowId: string;
  }>();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Record<string, any>>({});
  const [originalData, setOriginalData] = useState<Record<string, any>>({});

  const {
    data: rowResponse,
    isLoading,
    error,
    refetch,
  } = useDatasetRow(Number(datasetId), Number(rowId));

  const updateRowMutation = useUpdateDatasetRow();

  const rowData = rowResponse?.data;

  // Set original data when row data is loaded
  useEffect(() => {
    if (rowData?.data) {
      setOriginalData(rowData.data);
      setEditedData(rowData.data);
    }
  }, [rowData]);

  const handleFieldChange = (key: string, value: any) => {
    setEditedData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    if (!datasetId || !rowId) return;

    updateRowMutation.mutate(
      {
        datasetId: Number(datasetId),
        rowId: Number(rowId),
        data: editedData,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setOriginalData(editedData);
        },
        onError: (error) => {
          console.error('Failed to save changes:', error);
          // You could add toast notification here
        },
      }
    );
  };

  const handleCancel = () => {
    setEditedData(originalData);
    setIsEditing(false);
  };

  const hasChanges =
    JSON.stringify(editedData) !== JSON.stringify(originalData);
  const isButtonsDisabled = updateRowMutation.isPending;

  // Loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 2,
        }}
      >
        <CircularProgress size={48} sx={{ color: '#0094f6' }} />
        <Typography variant='h6' sx={{ fontSize: '18px', color: '#6b7280' }}>
          Loading row details...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 2,
        }}
      >
        <Typography
          variant='h6'
          sx={{
            fontSize: '18px',
            color: '#dc2626',
            textAlign: 'center',
          }}
        >
          Error loading row: {error.message}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant='contained'
            onClick={() => refetch()}
            sx={{
              backgroundColor: '#0094f6',
              '&:hover': {
                backgroundColor: '#0073cc',
              },
            }}
          >
            Retry
          </Button>
          <Button
            variant='contained'
            onClick={() => navigate(`/${datasetId}`)}
            sx={{
              backgroundColor: '#6b7280',
              '&:hover': {
                backgroundColor: '#4b5563',
              },
            }}
          >
            Back to Dataset
          </Button>
        </Box>
      </Box>
    );
  }

  // No data state
  if (!rowData) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <Typography variant='h6' sx={{ fontSize: '18px', mb: 2 }}>
          Row not found.
        </Typography>
        <Button
          variant='contained'
          onClick={() => navigate(`/${datasetId}`)}
          sx={{
            backgroundColor: '#6b7280',
            '&:hover': {
              backgroundColor: '#4b5563',
            },
          }}
        >
          Back to Dataset
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'white',
          padding: '16px 24px',
          borderRadius: 0,
          borderBottom: '1px solid #e5e5e5',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <BackBtn onClick={() => navigate(`/${datasetId}`)} />

          <Box sx={{ display: 'flex', gap: 1 }}>
            {!isEditing ? (
              <EditBtn onClick={() => setIsEditing(true)} />
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <CancelBtn
                  onClick={handleCancel}
                  disabled={isButtonsDisabled}
                />
                <SaveBtn
                  onClick={handleSave}
                  disabled={isButtonsDisabled || !hasChanges}
                  isLoading={updateRowMutation.isPending}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Row data display */}
      <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
        <Paper
          elevation={1}
          sx={{
            borderRadius: '8px',
            border: '1px solid #e5e5e5',
          }}
        >
          <Box sx={{ px: 3, py: 2 }}>
            <Typography
              variant='h6'
              sx={{
                fontSize: '18px',
                fontWeight: 500,
                color: '#111827',
              }}
            >
              Row Data
            </Typography>
          </Box>

          <Divider sx={{ borderColor: '#e5e5e5' }} />

          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'grid', gap: 2 }}>
              {Object.entries(isEditing ? editedData : rowData.data).map(
                ([key, value]) => (
                  <Box
                    key={key}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 2fr',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        fontWeight: 500,
                        color: '#32302c',
                        backgroundColor: '#f9f8f7',
                        padding: '8px',
                        borderRadius: '8px',
                      }}
                    >
                      {key}
                    </Box>
                    <EditableField
                      value={value}
                      fieldKey={key}
                      onChange={handleFieldChange}
                      isEditing={isEditing}
                    />
                  </Box>
                )
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default RowDetail;

import { useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useDatasetRow, useUpdateDatasetRow } from '../hooks/useDatasets';
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
      <div className='flex items-center justify-center h-full'>
        <div className='text-lg'>Loading row details...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-full'>
        <div className='text-lg text-red-600 mb-4'>
          Error loading row: {error.message}
        </div>
        <button
          onClick={() => refetch()}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2'
        >
          Retry
        </button>
        <button
          onClick={() => navigate(`/${datasetId}`)}
          className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
        >
          Back to Dataset
        </button>
      </div>
    );
  }

  // No data state
  if (!rowData) {
    return (
      <div className='flex flex-col items-center justify-center h-full'>
        <div className='text-lg mb-4'>Row not found.</div>
        <button
          onClick={() => navigate(`/${datasetId}`)}
          className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
        >
          Back to Dataset
        </button>
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col'>
      {/* Header */}
      <div className='bg-white px-6 pt-4'>
        <div className='flex items-center justify-between'>
          <BackBtn onClick={() => navigate(`/${datasetId}`)} />

          <div className='flex gap-2'>
            {!isEditing ? (
              <EditBtn onClick={() => setIsEditing(true)} />
            ) : (
              <>
                <CancelBtn
                  onClick={handleCancel}
                  disabled={isButtonsDisabled}
                />
                <SaveBtn
                  onClick={handleSave}
                  disabled={isButtonsDisabled || !hasChanges}
                  isLoading={updateRowMutation.isPending}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Row data display */}
      <div className='flex-1 p-6 overflow-auto'>
        <div className='bg-white rounded-lg shadow border border-[#e5e5e5]'>
          <div className='px-6 py-4 border-b border-[#e5e5e5]'>
            <h2 className='text-lg font-medium text-gray-900'>Row Data</h2>
          </div>

          <div className='p-6'>
            <div className='grid gap-4'>
              {Object.entries(isEditing ? editedData : rowData.data).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className='grid grid-cols-1 md:grid-cols-3 gap-2'
                  >
                    <div className='font-medium text-[#32302c] bg-[#f9f8f7] p-2 rounded-lg'>
                      {key}
                    </div>
                    <EditableField
                      value={value}
                      fieldKey={key}
                      onChange={handleFieldChange}
                      isEditing={isEditing}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RowDetail;

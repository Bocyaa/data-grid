import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import type { DataGridActions } from '@/types/dataGrid';
import type { ConfirmDialogState } from '@/types';
import { useDeleteDatasetRow } from '@/hooks/useDatasets';

interface UseActionsProps {
  datasetId?: string;
  selectedRows: number[];
  confirmDialog: ConfirmDialogState;
  setConfirmDialog: (state: ConfirmDialogState) => void;
  setSelectedRows: (rows: number[]) => void;
}

export const useDataGridActions = ({
  datasetId,
  selectedRows,
  confirmDialog,
  setConfirmDialog,
  setSelectedRows,
}: UseActionsProps): DataGridActions => {
  const navigate = useNavigate();
  const deleteRowMutation = useDeleteDatasetRow();

  // Handle delete row
  const handleDeleteRow = useCallback(
    (rowId: number) => {
      setConfirmDialog({ isOpen: true, rowId, isMultiple: false });
    },
    [setConfirmDialog]
  );

  // Handle confirm delete
  const handleConfirmDelete = useCallback(() => {
    if (confirmDialog.isMultiple && selectedRows.length > 0 && datasetId) {
      // Handle bulk delete
      Promise.all(
        selectedRows.map((rowId) =>
          deleteRowMutation.mutateAsync({
            datasetId: Number(datasetId),
            rowId,
          })
        )
      )
        .then(() => {
          toast.success(`${selectedRows.length} rows deleted successfully`);
          setSelectedRows([]);
          setConfirmDialog({ isOpen: false, rowId: null, isMultiple: false });
        })
        .catch((error) => {
          toast.error(`Failed to delete rows: ${error.message}`);
          setConfirmDialog({ isOpen: false, rowId: null, isMultiple: false });
        });
    } else if (confirmDialog.rowId && datasetId) {
      // Handle single delete
      deleteRowMutation.mutate(
        { datasetId: Number(datasetId), rowId: confirmDialog.rowId },
        {
          onSuccess: () => {
            toast.success('Row deleted successfully');
            setConfirmDialog({ isOpen: false, rowId: null, isMultiple: false });
          },
          onError: (error) => {
            toast.error(`Failed to delete row: ${error.message}`);
            setConfirmDialog({ isOpen: false, rowId: null, isMultiple: false });
          },
        }
      );
    }
  }, [
    confirmDialog,
    selectedRows,
    datasetId,
    deleteRowMutation,
    setSelectedRows,
    setConfirmDialog,
  ]);

  // Handle cancel delete
  const handleCancelDelete = useCallback(() => {
    setConfirmDialog({ isOpen: false, rowId: null, isMultiple: false });
  }, [setConfirmDialog]);

  // Handle view row
  const handleViewRow = useCallback(
    (rowId: number) => {
      if (datasetId) {
        navigate(`/${datasetId}/${rowId}`);
      }
    },
    [datasetId, navigate]
  );

  return {
    handleDeleteRow,
    handleConfirmDelete,
    handleCancelDelete,
    handleViewRow,
  };
};

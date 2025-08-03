import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  fetchDatasets,
  fetchDatasetById,
  fetchDatasetRow,
  uploadDataset,
  deleteDataset,
  deleteDatasetRow,
  updateDatasetRow,
} from '../api/datasets';
import type { DatasetsQueryParams, DatasetQueryParams } from '../types/api';

// Hook to fetch all datasets
export function useDatasets(params: DatasetsQueryParams = {}) {
  return useQuery({
    queryKey: ['datasets', params],
    queryFn: () => fetchDatasets(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch specific dataset by ID with pagination
export function useDataset(datasetId: number, params: DatasetQueryParams = {}) {
  return useQuery({
    queryKey: ['dataset', datasetId, params],
    queryFn: () => fetchDatasetById(datasetId, params),
    enabled: !!datasetId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch specific row from dataset
export function useDatasetRow(datasetId: number, rowId: number) {
  return useQuery({
    queryKey: ['dataset-row', datasetId, rowId],
    queryFn: () => fetchDatasetRow(datasetId, rowId),
    enabled: !!datasetId && !!rowId,
    staleTime: 10 * 60 * 1000, // 10 minutes (rows don't change often)
  });
}

// Hook for infinite scrolling/pagination of dataset rows
export function useInfiniteDataset(datasetId: number, limit = 50) {
  return useInfiniteQuery({
    queryKey: ['infinite-dataset', datasetId, limit],
    queryFn: ({ pageParam }) =>
      fetchDatasetById(datasetId, { page: pageParam as number, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage.data;
      return pagination.hasNextPage ? pagination.page + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      const { pagination } = firstPage.data;
      return pagination.hasPrevPage ? pagination.page - 1 : undefined;
    },
    enabled: !!datasetId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to upload a new dataset
export function useUploadDataset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadDataset,
    onSuccess: () => {
      // Invalidate all datasets queries to refetch with the new data
      queryClient.invalidateQueries({
        queryKey: ['datasets'],
        exact: false, // This will match all queries that start with ['datasets']
      });
    },
  });
}

// Hook to delete a dataset
export function useDeleteDataset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDataset,
    onSuccess: () => {
      // Invalidate all datasets queries (with any params)
      queryClient.invalidateQueries({
        queryKey: ['datasets'],
        exact: false, // This will match all queries that start with ['datasets']
      });
    },
  });
}

// Hook to delete a row from a dataset
export function useDeleteDatasetRow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ datasetId, rowId }: { datasetId: number; rowId: number }) =>
      deleteDatasetRow(datasetId, rowId),
    onSuccess: (_, { datasetId }) => {
      // Invalidate dataset queries to refetch with updated data
      queryClient.invalidateQueries({
        queryKey: ['dataset', datasetId],
        exact: false,
      });
    },
  });
}

// Hook to update a row in a dataset
export function useUpdateDatasetRow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      datasetId,
      rowId,
      data,
    }: {
      datasetId: number;
      rowId: number;
      data: Record<string, any>;
    }) => updateDatasetRow(datasetId, rowId, data),
    onSuccess: (_, { datasetId, rowId }) => {
      // Invalidate both the specific row and dataset queries
      queryClient.invalidateQueries({
        queryKey: ['dataset-row', datasetId, rowId],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ['dataset', datasetId],
        exact: false,
      });
    },
  });
}

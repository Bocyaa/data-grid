# React Query Caching Implementation

## Overview

This implementation leverages React Query's powerful caching capabilities to provide efficient data management for the DataGrid application.

## Caching Configuration

### Global QueryClient Settings (`App.tsx`)

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - data considered fresh for 5 min
      gcTime: 1000 * 60 * 60 * 24, // 24 hours - cache retention time
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnMount: 'always', // Always refetch when component mounts
      refetchOnReconnect: true, // Refetch when network reconnects
      retry: 3, // Retry failed requests up to 3 times
      retryDelay: (i) => Math.min(1000 * 2 ** i, 30_000), // Exponential backoff
      networkMode: 'online', // Only run queries when online
    },
  },
});
```

## Hook Implementations

### 1. useDatasets Hook

```typescript
export function useDatasets(params: DatasetsQueryParams = {}) {
  return useQuery({
    queryKey: ['datasets', params],
    queryFn: () => fetchDatasets(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

- **Cache Key**: `['datasets', params]` - Unique cache entry per parameter combination
- **Stale Time**: 5 minutes - Data remains fresh without refetching
- **Use Case**: Fetching all available datasets with pagination/filtering

### 2. useDataset Hook

```typescript
export function useDataset(datasetId: number, params: DatasetQueryParams = {}) {
  return useQuery({
    queryKey: ['dataset', datasetId, params],
    queryFn: () => fetchDatasetById(datasetId, params),
    enabled: !!datasetId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

- **Cache Key**: `['dataset', datasetId, params]` - Unique per dataset and page
- **Enabled**: Only runs when datasetId is provided
- **Use Case**: Primary hook for DataGrid component pagination

### 3. useDatasetRow Hook

```typescript
export function useDatasetRow(datasetId: number, rowId: number) {
  return useQuery({
    queryKey: ['dataset-row', datasetId, rowId],
    queryFn: () => fetchDatasetRow(datasetId, rowId),
    enabled: !!datasetId && !!rowId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
```

- **Cache Key**: `['dataset-row', datasetId, rowId]` - Unique per row
- **Stale Time**: 10 minutes - Rows change less frequently
- **Use Case**: Row detail page display

### 4. useInfiniteDataset Hook

```typescript
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
    // ... pagination logic
  });
}
```

- **Cache Key**: `['infinite-dataset', datasetId, limit]` - For infinite scrolling
- **Use Case**: Future implementation of infinite scrolling (alternative to pagination)

## Caching Benefits

### 1. **Automatic Background Updates**

- React Query automatically refetches stale data in the background
- Users see cached data immediately while fresh data loads

### 2. **Intelligent Cache Invalidation**

- Different query keys prevent cache collisions
- Page changes create new cache entries automatically

### 3. **Memory Management**

- 24-hour garbage collection prevents memory leaks
- Unused cache entries are cleaned up automatically

### 4. **Network Optimization**

- 5-minute stale time reduces unnecessary API calls
- Exponential backoff prevents API spam on failures

### 5. **Offline Resilience**

- Cached data available when offline
- Automatic retry when connection restored

## Cache Key Strategy

```
'datasets' + params          → All datasets list
'dataset' + id + params      → Specific dataset with pagination
'dataset-row' + id + rowId   → Individual row details
'infinite-dataset' + id      → Infinite scroll cache
```

## DevTools Integration

- React Query DevTools included for cache inspection
- Toggle with `Cmd/Ctrl + Shift + D` in development
- Monitor cache status, queries, and mutations

## Performance Improvements

1. **Instant Navigation**: Cached data loads immediately
2. **Reduced API Calls**: 5-minute stale time prevents redundant requests
3. **Background Updates**: Fresh data loads without blocking UI
4. **Smart Prefetching**: Could be extended to prefetch adjacent pages
5. **Memory Efficient**: Automatic cleanup prevents memory bloat

This caching strategy ensures optimal performance while maintaining data freshness and providing excellent user experience.

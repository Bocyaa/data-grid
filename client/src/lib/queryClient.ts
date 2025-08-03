import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false, // Don't refetch on window regain focus
      refetchOnMount: 'always', // Always refetch when component mounts
      refetchOnReconnect: true, // Refetch when reconnecting
      retry: 3, // Prevent infinite loading (limit 3)
      retryDelay: (i) => Math.min(1000 * 2 ** i, 30_000),
      networkMode: 'online', // Run when online only
    },
  },
});

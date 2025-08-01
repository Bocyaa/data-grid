import { z } from 'zod';

export const getDatasetQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  searchField: z.string().optional(),
  searchQuery: z.string().optional(),
});

export const datasetIdSchema = z.object({
  datasetId: z.coerce.number().int().positive(),
});

export const rowIdSchema = z.object({
  datasetId: z.coerce.number().int().positive(),
  rowId: z.coerce.number().int().nonnegative(),
});

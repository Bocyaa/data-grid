"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rowIdSchema = exports.datasetIdSchema = exports.getDatasetQuerySchema = void 0;
const zod_1 = require("zod");
exports.getDatasetQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    sort: zod_1.z.string().optional(),
    order: zod_1.z.enum(['asc', 'desc']).optional(),
    searchField: zod_1.z.string().optional(),
    searchQuery: zod_1.z.string().optional(),
});
exports.datasetIdSchema = zod_1.z.object({
    datasetId: zod_1.z.coerce.number().int().positive(),
});
exports.rowIdSchema = zod_1.z.object({
    datasetId: zod_1.z.coerce.number().int().positive(),
    rowId: zod_1.z.coerce.number().int().nonnegative(),
});

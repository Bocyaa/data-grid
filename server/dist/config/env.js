"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().min(1).max(65535).default(5174),
    CORS_ORIGIN: zod_1.z.string().url().or(zod_1.z.literal('*')).default('*'),
    DATABASE_URL: zod_1.z.string(),
    NODE_ENV: zod_1.z
        .enum(['development', 'production', 'test'])
        .default('development'),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('Invalid environment variables:', zod_1.z.treeifyError(parsed.error));
    process.exit(1);
}
exports.env = parsed.data;

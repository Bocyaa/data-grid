"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
function errorHandler(err, _req, res, _next) {
    console.log('[ERROR]', err);
    // Zod validation error
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            data: null,
            message: 'Validation error',
            errors: zod_1.z.treeifyError(err),
        });
    }
    // Known custom error
    if (err.status && err.message) {
        return res.status(err.status).json({
            success: false,
            data: null,
            message: err.message,
        });
    }
    // Fallback generic error
    res.status(500).json({
        success: false,
        data: null,
        message: 'Internal server error',
    });
}

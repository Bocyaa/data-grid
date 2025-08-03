"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = exports.validateParams = exports.validateQuery = void 0;
const zod_1 = require("zod");
const validateQuery = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json({
            errors: zod_1.z.treeifyError(result.error),
            message: 'Invalid query parameters',
        });
    }
    req.validatedQuery = result.data;
    next();
};
exports.validateQuery = validateQuery;
const validateParams = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
        return res.status(400).json({
            errors: zod_1.z.treeifyError(result.error),
            message: 'Invalid route parameters',
        });
    }
    req.validatedParams = result.data;
    next();
};
exports.validateParams = validateParams;
const validateBody = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            errors: zod_1.z.treeifyError(result.error),
            message: 'Invalid request body',
        });
    }
    req.validatedBody = result.data;
    next();
};
exports.validateBody = validateBody;

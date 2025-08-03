"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("config/env");
const datasetRoutes_1 = __importDefault(require("routes/datasetRoutes"));
const errorHandler_1 = require("middleware/errorHandler");
const app = (0, express_1.default)();
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: env_1.env.NODE_ENV,
    });
});
// CORS configuration
app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGIN === '*' ? '*' : env_1.env.CORS_ORIGIN,
    credentials: env_1.env.CORS_ORIGIN !== '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
}));
app.use(express_1.default.json());
// Register routes
app.use('/api', datasetRoutes_1.default);
// Error handler
app.use(errorHandler_1.errorHandler);
app.listen(env_1.env.PORT, () => {
    console.log(`🚀 Server running on port ${env_1.env.PORT}`);
    console.log(`📍 Environment: ${env_1.env.NODE_ENV}`);
    console.log(`🌐 CORS Origin: ${env_1.env.CORS_ORIGIN}`);
});

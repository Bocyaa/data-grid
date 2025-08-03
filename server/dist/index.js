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
// CORS configuration
app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
}));
app.use(express_1.default.json());
// Register routes
app.use('/api', datasetRoutes_1.default);
// Error handler
app.use(errorHandler_1.errorHandler);
app.listen(env_1.env.PORT, () => {
    console.log(`Server running on http://localhost:${env_1.env.PORT}`);
});

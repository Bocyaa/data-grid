import express from 'express';
import cors from 'cors';
import { env } from 'config/env';
import datasetRoutes from 'routes/datasetRoutes';
import { errorHandler } from 'middleware/errorHandler';

const app = express();

// CORS configuration
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  })
);

app.use(express.json());

// Register routes
app.use('/api', datasetRoutes);

// Error handler
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});

import express from 'express';
import { env } from 'config/env';
import datasetRoutes from 'routes/datasetRoutes';
import { errorHandler } from 'middleware/errorHandler';

const app = express();
app.use(express.json());

// Register routes
app.use('/api', datasetRoutes);

// Error handler
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});

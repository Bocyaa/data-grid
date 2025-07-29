import express from 'express';
import { env } from './config/env';
import { PrismaClient } from './generated/prisma';

export const prisma = new PrismaClient();

const app = express();

app.get('/', (_req, res) => {
  res.send('Hello from Server!');
});

app.get('/api/dataset/:id', async (req, res) => {
  const { id } = req.params;
  const dataset = await prisma.dataset.findUnique({
    where: { id: Number(id) },
  });

  if (!dataset) return res.status(404).json({ error: 'Not found' });

  // Type guard to ensure rows is an array
  const rows = Array.isArray(dataset.rows) ? dataset.rows : [];

  res.json({
    rows: rows, // send raw rows
    columns: rows.length > 0 ? Object.keys(rows[0] || {}) : [],
  });
});

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});

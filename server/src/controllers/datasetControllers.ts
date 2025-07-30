import { Request, Response } from 'express';
import { parseCsv } from 'utils/csvParser';
import { prisma } from 'lib/prisma';
import isJsonObject from 'utils/isJsonObject';

export async function getAllDatasets(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const sort = (req.query.sort as string) || 'createdAt';
  const order =
    (req.query.order as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';

  const searchField = req.query.searchField as string;
  const searchQuery = req.query.searchQuery as string;

  const skip = (page - 1) * limit;

  const total = await prisma.dataset.count();

  // Get datasets along with their related rows
  const datasets = await prisma.dataset.findMany({
    orderBy: { [sort]: order },
    skip,
    take: limit,
    include: {
      rows: true,
    },
  });

  // Format and filter each dataset
  const enriched = datasets.map((dataset) => {
    const rawRows = dataset.rows.map((r) => r.data);

    const filteredRows =
      searchField && searchQuery
        ? rawRows.filter(
            (row) =>
              typeof row === 'object' &&
              row !== null &&
              searchField in row &&
              (row as Record<string, unknown>)[searchField]
                ?.toString()
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          )
        : rawRows;

    return {
      id: dataset.id,
      name: dataset.name,
      createdAt: dataset.createdAt,
      rowCount: filteredRows.length,
      preview: filteredRows.slice(0, 5),
    };
  });

  res.json({
    page,
    limit,
    total,
    data: enriched,
  });
}

export async function getSingleDataset(req: Request, res: Response) {
  const datasetId = parseInt(req.params.id);

  if (isNaN(datasetId)) {
    return res.status(400).json({ error: 'Invalid dataset ID' });
  }

  const dataset = await prisma.dataset.findUnique({
    where: { id: datasetId },
    include: { rows: true },
  });

  if (!dataset) {
    return res.status(404).json({ error: 'Dataset not found' });
  }

  const rows = dataset.rows.map((r) => r.data);
  let columns: string[] = [];

  if (rows.length > 0 && isJsonObject(rows[0])) {
    columns = Object.keys(rows[0]);
  }

  res.json({ rows, columns });
}

export async function getRow(req: Request, res: Response) {
  const datasetId = parseInt(req.params.datasetId);
  const rowId = parseInt(req.params.rowId);

  if (isNaN(datasetId) || isNaN(rowId)) {
    return res.status(400).json({ error: 'Invalid params' });
  }

  const row = await prisma.row.findFirst({
    where: {
      id: rowId,
      datasetId,
    },
  });

  if (!row) return res.status(404).json({ error: 'Row not found' });

  res.json({ id: row.id, data: row.data });
}

export async function createDataset(req: Request, res: Response) {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'CSV file is required' });
  }

  try {
    const rows = parseCsv(file.buffer);
    const datasetName = file.originalname.replace(/\.[^/.]+$/, '');

    const dataset = await prisma.dataset.create({
      data: { name: datasetName },
    });

    await prisma.$transaction(
      rows.map((row) =>
        prisma.row.create({
          data: {
            datasetId: dataset.id,
            data: row,
          },
        })
      )
    );

    res.status(201).json({
      message: 'Dataset created',
      datasetId: dataset.id,
      rowCount: rows.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to import CSV', detail: error });
  }
}

export async function deleteDataset(req: Request, res: Response) {
  const datasetId = parseInt(req.params.datasetId);

  if (isNaN(datasetId)) {
    return res.status(400).json({ error: 'Invalid dataset ID.' });
  }

  try {
    await prisma.dataset.delete({
      where: { id: datasetId },
    });

    res.json({ message: `Dataset ${datasetId} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete dataset.', detail: error });
  }
}

export async function deleteRow(req: Request, res: Response) {
  const datasetId = parseInt(req.params.datasetId);
  const rowId = parseInt(req.params.rowId);

  if (isNaN(datasetId) || isNaN(rowId)) {
    return res.status(400).json({ error: 'Invalid ID format.' });
  }

  try {
    const row = await prisma.row.findFirst({
      where: { id: rowId, datasetId },
    });

    if (!row) {
      return res.status(404).json({ error: 'Row not found.' });
    }

    await prisma.row.delete({
      where: { id: rowId },
    });

    res.json({ message: `Row ${rowId} deleted from dataset ${datasetId}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete row.', detail: error });
  }
}

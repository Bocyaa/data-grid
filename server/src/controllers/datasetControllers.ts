import { Request, Response } from 'express';
import { parseCsv } from 'utils/csvParser';
import { prisma } from 'lib/prisma';
import isJsonObject from 'utils/isJsonObject';

export async function getAllDatasets(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const sort = (req.query.sort as string) || 'createdAt';
  const order =
    (req.query.order as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';

  const searchField = req.query.searchField as string;
  const searchQuery = req.query.searchQuery as string;

  const skip = (page - 1) * limit;

  const total = await prisma.dataset.count();

  // Handle empty database case
  if (total === 0) {
    return res.json({
      success: true,
      data: {
        page,
        limit,
        total: 0,
        data: [],
      },
      message: 'No datasets found. Upload a CSV file to get started.',
    });
  }

  const datasets = await prisma.dataset.findMany({
    orderBy: { [sort]: order },
    skip,
    take: limit,
    include: {
      rows: true,
    },
  });

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
    success: true,
    data: {
      page,
      limit,
      total,
      data: enriched,
    },
    message:
      enriched.length > 0
        ? 'Datasets found'
        : 'No datasets match your criteria',
  });
}

export async function getDatasetById(req: Request, res: Response) {
  const datasetId = parseInt(req.params.id);
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;

  if (isNaN(datasetId)) {
    throw { status: 400, message: 'Invalid dataset ID' };
  }

  const skip = (page - 1) * limit;

  // First, check if dataset exists and get basic info
  const dataset = await prisma.dataset.findUnique({
    where: { id: datasetId },
  });

  if (!dataset) {
    throw { status: 400, message: 'Dataset not found' };
  }

  // Get total count of rows for this dataset
  const totalRows = await prisma.row.count({
    where: { datasetId },
  });

  // Get paginated rows
  const rows = await prisma.row.findMany({
    where: { datasetId },
    skip,
    take: limit,
    orderBy: { id: 'asc' },
  });

  const rowData = rows.map((r) => r.data);
  let columns: string[] = [];

  // Get columns from the first row if available
  if (rowData.length > 0 && isJsonObject(rowData[0])) {
    columns = Object.keys(rowData[0]);
  } else if (totalRows > 0) {
    // If current page has no rows but dataset has rows, get columns from first row in dataset
    const firstRow = await prisma.row.findFirst({
      where: { datasetId },
      orderBy: { id: 'asc' },
    });
    if (firstRow && isJsonObject(firstRow.data)) {
      columns = Object.keys(firstRow.data);
    }
  }

  res.json({
    success: true,
    data: {
      rows: rowData,
      columns,
      pagination: {
        page,
        limit,
        total: totalRows,
        totalPages: Math.ceil(totalRows / limit),
        hasNextPage: page * limit < totalRows,
        hasPrevPage: page > 1,
      },
    },
    message: 'Dataset found',
  });
}

export async function getDatasetRowById(req: Request, res: Response) {
  const datasetId = parseInt(req.params.datasetId);
  const rowId = parseInt(req.params.rowId);

  if (isNaN(datasetId) || isNaN(rowId)) {
    throw { status: 400, message: 'Invalid params' };
  }

  const row = await prisma.row.findFirst({
    where: {
      id: rowId,
      datasetId,
    },
  });

  if (!row) throw { status: 400, message: 'Row not found' };

  res.json({
    success: true,
    data: {
      id: row.id,
      data: row.data,
    },
    message: 'Row found',
  });
}

export async function deleteDatasetById(req: Request, res: Response) {
  const datasetId = parseInt(req.params.datasetId);

  if (isNaN(datasetId)) {
    throw { status: 400, message: 'Invalid dataset ID' };
  }

  try {
    await prisma.dataset.delete({
      where: { id: datasetId },
    });

    res.json({
      success: true,
      data: null,
      message: `Dataset ${datasetId} deleted`,
    });
  } catch (error) {
    console.log(error);
    throw { status: 500, message: 'Failed to delete dataset' };
  }
}

export async function deleteRowById(req: Request, res: Response) {
  const datasetId = parseInt(req.params.datasetId);
  const rowId = parseInt(req.params.rowId);

  if (isNaN(datasetId) || isNaN(rowId)) {
    throw { status: 400, message: 'Invalid ID format' };
  }

  try {
    const row = await prisma.row.findFirst({
      where: { id: rowId, datasetId },
    });

    if (!row) {
      throw { status: 404, message: 'Row not found' };
    }

    await prisma.row.delete({
      where: { id: rowId },
    });

    res.status(201).json({
      success: true,
      data: {
        rowId: rowId,
        datasetId: datasetId,
      },
      message: `Row ${rowId} deleted from dataset ${datasetId}.`,
    });
  } catch (error) {
    throw { status: 500, message: 'Failed to delete row' };
  }
}

export async function uploadDataset(req: Request, res: Response) {
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
      success: true,
      data: {
        datasetId: dataset.id,
        rowCount: rows.length,
      },
      message: 'Dataset uploaded',
    });
  } catch (error) {
    console.log(error);
    throw { status: 500, message: 'Failed to upload CSV' };
  }
}

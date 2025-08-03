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
  const datasetId = parseInt(req.params.datasetId);
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const searchQuery = req.query.searchQuery as string;

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

  // Get all rows for this dataset (we need to filter them in memory for search)
  const allRows = await prisma.row.findMany({
    where: { datasetId },
    orderBy: { id: 'asc' },
  });

  let filteredRows = allRows;

  // Apply search filter if searchQuery is provided
  if (searchQuery && searchQuery.trim()) {
    filteredRows = allRows.filter((row) => {
      if (isJsonObject(row.data)) {
        const rowData = row.data as Record<string, unknown>;
        // Search in all columns
        return Object.values(rowData).some((value) =>
          value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return false;
    });
  }

  // Apply pagination to filtered results
  const totalFiltered = filteredRows.length;
  const paginatedRows = filteredRows.slice(skip, skip + limit);

  const rowData = paginatedRows.map((r) => ({ id: r.id, data: r.data }));
  let columns: string[] = [];

  // Get columns from the first row if available
  if (allRows.length > 0 && isJsonObject(allRows[0].data)) {
    columns = Object.keys(allRows[0].data);
  }

  res.json({
    success: true,
    data: {
      rows: rowData,
      columns,
      pagination: {
        page,
        limit,
        total: totalFiltered,
        totalPages: Math.ceil(totalFiltered / limit),
        hasNextPage: page * limit < totalFiltered,
        hasPrevPage: page > 1,
      },
    },
    message: searchQuery
      ? `Found ${totalFiltered} matching rows`
      : 'Dataset found',
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

export async function updateRowById(req: Request, res: Response) {
  const datasetId = parseInt(req.params.datasetId);
  const rowId = parseInt(req.params.rowId);
  const { data } = req.body;

  if (isNaN(datasetId) || isNaN(rowId)) {
    throw { status: 400, message: 'Invalid ID format' };
  }

  if (!data || typeof data !== 'object') {
    throw { status: 400, message: 'Invalid data format. Expected object.' };
  }

  try {
    const existingRow = await prisma.row.findFirst({
      where: { id: rowId, datasetId },
    });

    if (!existingRow) {
      throw { status: 404, message: 'Row not found' };
    }

    const updatedRow = await prisma.row.update({
      where: { id: rowId },
      data: { data },
    });

    res.status(200).json({
      success: true,
      data: {
        id: updatedRow.id,
        datasetId: updatedRow.datasetId,
        data: updatedRow.data,
      },
      message: `Row ${rowId} updated successfully.`,
    });
  } catch (error) {
    console.log(error);
    throw { status: 500, message: 'Failed to update row' };
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

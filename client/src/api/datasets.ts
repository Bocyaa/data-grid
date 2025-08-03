import { API_BASE_URL } from './config';
import type {
  DatasetsResponse,
  DatasetDetailResponse,
  DatasetRowResponse,
  DatasetsQueryParams,
  DatasetQueryParams,
} from '../types/api';

// Fetch all datasets
export async function fetchDatasets(
  params: DatasetsQueryParams = {}
): Promise<DatasetsResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  const url = `${API_BASE_URL}/datasets${
    searchParams.toString() ? `?${searchParams.toString()}` : ''
  }`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch datasets: ${response.statusText}`);
  }

  return response.json();
}

// Fetch specific dataset by ID with pagination
export async function fetchDatasetById(
  datasetId: number,
  params: DatasetQueryParams = {}
): Promise<DatasetDetailResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  const url = `${API_BASE_URL}/dataset/${datasetId}${
    searchParams.toString() ? `?${searchParams.toString()}` : ''
  }`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch dataset ${datasetId}: ${response.statusText}`
    );
  }

  return response.json();
}

// Fetch specific row from dataset
export async function fetchDatasetRow(
  datasetId: number,
  rowId: number
): Promise<DatasetRowResponse> {
  const url = `${API_BASE_URL}/dataset/${datasetId}/${rowId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch row ${rowId} from dataset ${datasetId}: ${response.statusText}`
    );
  }

  return response.json();
}

// Upload CSV dataset
export async function uploadDataset(file: File): Promise<{
  success: boolean;
  data: { datasetId: number; rowCount: number };
  message: string;
}> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/dataset`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload dataset: ${response.statusText}`);
  }

  return response.json();
}

// Delete dataset
export async function deleteDataset(
  datasetId: number
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/dataset/${datasetId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete dataset: ${response.statusText}`);
  }

  return response.json();
}

// Delete specific row from dataset
export async function deleteDatasetRow(
  datasetId: number,
  rowId: number
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(
    `${API_BASE_URL}/dataset/${datasetId}/${rowId}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete row: ${response.statusText}`);
  }

  return response.json();
}

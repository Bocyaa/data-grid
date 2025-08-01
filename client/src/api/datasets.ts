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

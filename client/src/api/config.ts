const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === 'production'
    ? 'https://data-grid.railway.internal/api'
    : 'http://localhost:5174/api');

export { API_BASE_URL };

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === 'production'
    ? 'https://data-grid-production.up.railway.app/api'
    : 'http://localhost:5174/api');

export { API_BASE_URL };

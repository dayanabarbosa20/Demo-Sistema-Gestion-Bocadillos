import axios from 'axios';

const apiOrigin = 'https://sistemagestionbocadillos.onrender.com';

const api = axios.create({
  baseURL: `${apiOrigin}/api`,
});

export const apiRoot = axios.create({
  baseURL: apiOrigin,
});

export function getApiErrorMessage(error, fallback) {
  const responseData = error.response?.data;
  const serverMessage = typeof responseData === 'string'
    ? responseData
    : responseData?.message;

  if (serverMessage) return serverMessage;
  if (error.response) return `${fallback} (HTTP ${error.response.status}).`;
  if (error.request) return `${fallback} El navegador no recibió respuesta del servidor; revisa la conexión o CORS.`;
  return `${fallback} ${error.message}`;
}

export default api;
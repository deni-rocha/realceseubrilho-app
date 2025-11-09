import axios from 'axios';

// API pública sem autenticação
const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default publicApi;

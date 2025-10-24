import axios from 'axios';
import handleApiError from '../utils/handleApiError';
import revalidateToken from '../utils/revalidateToken';
import type { ApiError } from '../types/ApiError';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const authHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

api.interceptors.request.use((config) => {
  config.headers = { ...config.headers, ...authHeader() };
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;

    if (!originalRequest) {
      const handled = handleApiError(error);
      return Promise.reject(handled);
    }

    const status = error?.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await revalidateToken();

        if (newAccessToken) {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };
          return await api(originalRequest);
        }
      } catch (refreshError) {
        const handled = handleApiError(refreshError as ApiError);
        return Promise.reject(handled);
      }
    }

    const handled = handleApiError(error);
    return Promise.reject(handled);
  },
);

export default api;

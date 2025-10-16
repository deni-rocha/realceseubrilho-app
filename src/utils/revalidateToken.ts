import api from '../api';
import { useAuthStore } from '../store/authStore';
import type { ApiError } from './handleApiError';

const revalidateToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await api.post('/auth/refresh-token', {
      refreshToken,
    });

    const data = response.data as { accessToken: string };
    localStorage.setItem('accessToken', data.accessToken);
    useAuthStore.setState({ accessToken: data.accessToken });

    return data.accessToken;
  } catch (error) {
    const status = (error as ApiError).status;

    if (status === 401) useAuthStore.getState().logout();
  }
};

export default revalidateToken;

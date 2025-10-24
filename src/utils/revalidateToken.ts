import { useAuthStore } from '../store/authStore';
import type { RefreshTokenResponse } from '../types/RefreshTokenResponse';
import handleApiError from './handleApiError';
import api from '../api';
import type { ApiError } from '../types/ApiError';

let refreshingPromise: Promise<string> | null = null;

async function updateAuthStore(accessToken: string | null): Promise<void> {
  try {
    useAuthStore.setState((state) => ({
      ...state,
      accessToken,
    }));
  } catch (error) {
    console.error('Failed to update auth store', error);
  }
}

async function clearAuthData(): Promise<void> {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  await updateAuthStore(null);
}

async function saveTokens(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);

  await updateAuthStore(accessToken);
}

async function refreshTokenRequest(refreshToken: string): Promise<string> {
  try {
    const response = await api.post<RefreshTokenResponse>(
      '/auth/refresh-token',
      {
        refreshToken,
      },
    );
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    if (!accessToken) {
      throw new Error('No access token received');
    }

    await saveTokens(accessToken, newRefreshToken);
    return accessToken;
  } catch (error) {
    try {
      const message = handleApiError(error as ApiError);
      console.error('Error during token refresh:', message);
    } catch (e) {
      console.error('Failed to handle API error:', e);
    }

    await clearAuthData();
    throw new Error('Failed to refresh token');
  }
}

const revalidateToken = async (): Promise<string> => {
  try {
    if (refreshingPromise) {
      return await refreshingPromise;
    }

    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) {
      throw new Error('No refresh token available');
    }

    refreshingPromise = refreshTokenRequest(storedRefreshToken);

    try {
      const result = await refreshingPromise;
      return result;
    } finally {
      refreshingPromise = null;
    }
  } catch (error) {
    refreshingPromise = null;
    throw error;
  }
};

export default revalidateToken;

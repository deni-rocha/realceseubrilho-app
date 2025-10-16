import { create } from 'zustand';
import { login } from '../api/auth';
import type { UserAuth } from '../types/UserAuth';
import handleApiError from '../utils/handleApiError';

interface AuthState {
  user: UserAuth | null;
  accessToken: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, _get) => ({
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') as string)
    : null,
  accessToken: localStorage.getItem('accessToken')
    ? localStorage.getItem('accessToken')
    : null,
  status: 'idle',
  error: null,

  login: async (credentials) => {
    set({ status: 'loading', error: null });

    try {
      const response = await login(credentials.email, credentials.password);

      if (response.status === 201) {
        set({
          user: response.data.user,
          accessToken: response.data.accessToken,
          status: 'succeeded',
        });
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
    } catch (error) {
      const message = await handleApiError(error);
      set({ status: 'failed', error: message });
    }
  },

  logout: () => {
    set({ user: null, accessToken: null, status: 'idle', error: null });
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
}));

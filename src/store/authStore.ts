import { create } from 'zustand';
import { login } from '../api/auth';
import type { User } from '../types/User';
import handleApiError from '../utils/handleApiError';

interface AuthState {
  user: User | null;
  access_token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, _get) => ({
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') as string)
    : null,
  access_token: localStorage.getItem('access_token')
    ? localStorage.getItem('access_token')
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
          access_token: response.data.access_token,
          status: 'succeeded',
        });
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('access_token', response.data.access_token);
      }
    } catch (error) {
      set({ status: 'failed', error: handleApiError(error) });
    }
  },

  logout: () => {
    set({ user: null, access_token: null, status: 'idle', error: null });
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
  },
}));

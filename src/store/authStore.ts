import { create } from 'zustand';
import { login } from '../api/auth';
import type { User } from '../types/User';

interface AuthState {
  user: User | null;
  access_token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, _get) => ({
  user: null,
  access_token: null,
  status: 'idle',
  error: null,

  login: async (credentials) => {
    set({ status: 'loading', error: null });

    try {
      const response = await login(credentials.email, credentials.password);

      console.log(response);

      if (response.status === 201) {
        set({
          user: response.data.user,
          access_token: response.data.access_token,
          status: 'succeeded',
        });
      } else {
        throw new Error('Credenciais inválidas.');
      }
    } catch (error) {
      set({ status: 'failed', error: (error as Error).message });
    }
  },

  logout: () => {
    set({ user: null, access_token: null, status: 'idle', error: null });
  },
}));

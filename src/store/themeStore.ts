import { create } from 'zustand';

interface ThemeState {
  theme: string;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: localStorage.getItem('theme') || 'light',
  toggleTheme: () => {
    set({ theme: get().theme === 'light' ? 'dark' : 'light' });
  },
}));

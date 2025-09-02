import { create } from 'zustand';

interface ThemeState {
  theme: string;
  toggleTheme: () => void;
}

export const themeStore = create<ThemeState>((set, get) => ({
  theme: localStorage.getItem('theme') || 'dark',
  toggleTheme: () => {
    set({ theme: get().theme === 'light' ? 'dark' : 'light' });
  },
}));

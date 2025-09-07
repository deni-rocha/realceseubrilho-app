import { useEffect } from 'react';
import { LuSun, LuSunMoon } from 'react-icons/lu';
import { useThemeStore } from '../store/themeStore';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const htmlElement = document.documentElement;

    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }

    // Salva a preferência do usuário
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-secondary cursor-pointer text-xl md:text-2xl"
    >
      {theme === 'light' ? <LuSunMoon /> : <LuSun className="text-white" />}
    </button>
  );
};

export default ThemeSwitcher;

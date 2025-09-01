import { useState, useEffect } from 'react';
import { LuSun, LuSunMoon } from 'react-icons/lu';

const ThemeSwitcher = () => {
  // Use o estado para rastrear o tema atual (ou pegue do localStorage)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // Use useEffect para aplicar a classe ao elemento <html>
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

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

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

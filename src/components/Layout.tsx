import { ToastContainer } from 'react-toastify';
import ThemeSwitcher from './ThemeSwitcher';
import { useThemeStore } from '../store/themeStore';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const { theme } = useThemeStore();

  return (
    <div className="app">
      <div className="hidden md:block absolute top-4 right-4 z-20">
        <ThemeSwitcher />
      </div>
      <ToastContainer theme={theme} />

      {/* Renderiza o componente filho correspondente à rota atual */}
      <Outlet />
    </div>
  );
};

export default Layout;

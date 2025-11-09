import { ToastContainer } from 'react-toastify';
import { useThemeStore } from '../store/themeStore';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const { theme } = useThemeStore();

  return (
    <div className="app">
      <ToastContainer theme={theme} />

      {/* Renderiza o componente filho correspondente à rota atual */}
      <Outlet />
    </div>
  );
};

export default Layout;

import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';
import UserList from '../../components/admin/UserList';
import Dashboard from '../../components/admin/Dashboard';
import FormUser from '../../components/FormUser';
import { IoMdLogOut } from 'react-icons/io';
import AdmSettings from '../../components/admin/AdmSettings';
import FormProduct from '../../components/admin/FormProduct';
import ProductList from '../../components/admin/ProductList';
import CategoryList from '../../components/admin/CategoryList';
import FormCategory from '../../components/admin/FormCategory';

type ActiveMenuItem =
  | 'dashboard'
  | 'users'
  | 'user-list'
  | 'user-add'
  | 'products'
  | 'product-list'
  | 'product-add'
  | 'categories'
  | 'category-list'
  | 'category-add'
  | 'settings'
  | 'logout'
  | null;

const AdminPainel: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] =
    useState(false);
  const [activeMenuItem, setActiveMenuItem] =
    useState<ActiveMenuItem>('dashboard');
  const [showDashboard, setShowDashboard] = useState(true);
  const [showUserList, setShowUserList] = useState(false);
  const [showUserAdd, setShowUserAdd] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showProductList, setShowProductList] = useState(false);
  const [showProductAdd, setShowProductAdd] = useState(false);
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [showCategoryAdd, setShowCategoryAdd] = useState(false);

  const { logout } = useAuthStore();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUsersDropdown = () => {
    setIsUsersDropdownOpen(!isUsersDropdownOpen);
    setActiveMenuItem('users');
  };

  const toggleProductsDropdown = () => {
    setIsProductsDropdownOpen(!isProductsDropdownOpen);
    setActiveMenuItem('products');
  };

  const toggleCategoriesDropdown = () => {
    setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen);
  };

  const resetAllViews = () => {
    setShowDashboard(false);
    setShowUserList(false);
    setShowUserAdd(false);
    setShowSettings(false);
    setShowLogout(false);
    setShowProductList(false);
    setShowProductAdd(false);
    setShowCategoryList(false);
    setShowCategoryAdd(false);
  };

  const getMenuItemClasses = (menuItem: ActiveMenuItem) => {
    const baseClasses =
      'cursor-pointer block p-2 rounded-md transition-colors duration-200';
    const activeClasses = 'bg-green-600 text-white dark:bg-gray-600';
    const hoverClasses = 'hover:bg-green-700 dark:hover:bg-gray-700';

    return `${baseClasses} ${activeMenuItem === menuItem ? activeClasses : ''} ${hoverClasses}`;
  };

  const getDropdownButtonClasses = (menuItem: ActiveMenuItem) => {
    const baseClasses =
      'flex items-center justify-between w-full p-2 rounded-md transition-colors duration-200 focus:outline-none';
    const activeClasses = 'bg-green-600 dark:bg-gray-600';
    const hoverClasses = 'hover:bg-green-700 dark:hover:bg-gray-700';

    return `${baseClasses} ${activeMenuItem === menuItem ? activeClasses : ''} ${hoverClasses}`;
  };

  const toggleOptionsMenu = (
    v: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    let id = v.currentTarget.id as ActiveMenuItem;
    toggleMenu();
    resetAllViews();
    setActiveMenuItem(id);

    switch (id) {
      case 'dashboard':
        setShowDashboard(true);
        break;
      case 'user-list':
        setShowUserList(true);
        break;
      case 'user-add':
        setShowUserAdd(true);
        break;
      case 'product-list':
        setShowProductList(true);
        break;
      case 'product-add':
        setShowProductAdd(true);
        break;
      case 'category-list':
        setShowCategoryList(true);
        break;
      case 'category-add':
        setShowCategoryAdd(true);
        break;
      case 'settings':
        setShowSettings(true);
        break;
      case 'logout':
        setShowLogout(true);
        break;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-primary-dark">
      {/* --- Cabeçalho Mobile --- */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm z-10 dark:bg-accent-dark dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          Painel Administrativo
        </h1>
        <button
          onClick={toggleMenu}
          className="text-gray-600 focus:outline-none focus:text-gray-800 dark:text-white dark:focus:text-gray-200"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <FaTimes className="h-6 w-6" />
          ) : (
            <FaBars className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* --- Menu Lateral (Sidebar) --- */}
      <div
        className={`bg-black w-full h-full opacity-25 z-40 md:hidden ${isMenuOpen ? 'fixed' : 'hidden'}`}
        onClick={toggleMenu}
      ></div>
      <aside
        className={`
          transform transition-transform duration-300 ease-in-out
          bg-green-800 text-white p-4
          fixed inset-y-0 left-0 z-50
          w-3/4
          md:w-64
          md:translate-x-0
          md:sticky md:top-0 md:h-screen
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          dark:bg-accent-dark dark:text-white
        `}
      >
        <nav className="h-full">
          <ul className="flex flex-col space-y-2 h-full">
            <li>
              <a
                id="dashboard"
                onClick={toggleOptionsMenu}
                className={getMenuItemClasses('dashboard')}
              >
                Dashboard
              </a>
            </li>

            {/* Seção de Usuários */}
            <li className="relative">
              <button
                onClick={toggleUsersDropdown}
                className={getDropdownButtonClasses('users')}
              >
                <span>Usuários</span>
                <span
                  className={`transform transition-transform duration-200 ${
                    isUsersDropdownOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  ▼
                </span>
              </button>
              {isUsersDropdownOpen && (
                <ul className="pl-4 mt-2 space-y-1">
                  <li>
                    <a
                      id="user-list"
                      onClick={toggleOptionsMenu}
                      className={getMenuItemClasses('user-list')}
                    >
                      Lista de Usuários
                    </a>
                  </li>
                  <li>
                    <a
                      id="user-add"
                      onClick={toggleOptionsMenu}
                      className={getMenuItemClasses('user-add')}
                    >
                      Adicionar Novo
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* Seção de Produtos */}
            <li className="relative">
              <button
                onClick={toggleProductsDropdown}
                className={getDropdownButtonClasses('products')}
              >
                <span>Produtos</span>
                <span
                  className={`transform transition-transform duration-200 ${
                    isProductsDropdownOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  ▼
                </span>
              </button>
              {isProductsDropdownOpen && (
                <ul className="pl-4 mt-2 space-y-1">
                  <li>
                    <a
                      id="product-list"
                      onClick={toggleOptionsMenu}
                      className={getMenuItemClasses('product-list')}
                    >
                      Lista de Produtos
                    </a>
                  </li>
                  <li>
                    <a
                      id="product-add"
                      onClick={toggleOptionsMenu}
                      className={getMenuItemClasses('product-add')}
                    >
                      Adicionar Produto
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* Seção de Categorias */}
            <li className="relative">
              <button
                onClick={toggleCategoriesDropdown}
                className={getDropdownButtonClasses('categories')}
              >
                <span>Categorias</span>
                <span
                  className={`transform transition-transform ${
                    isCategoriesDropdownOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  ▼
                </span>
              </button>
              {isCategoriesDropdownOpen && (
                <ul className="pl-4 mt-2 space-y-1">
                  <li>
                    <a
                      id="category-list"
                      onClick={toggleOptionsMenu}
                      className={getMenuItemClasses('category-list')}
                    >
                      Lista de Categorias
                    </a>
                  </li>
                  <li>
                    <a
                      id="category-add"
                      onClick={toggleOptionsMenu}
                      className={getMenuItemClasses('category-add')}
                    >
                      Adicionar Categoria
                    </a>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <a
                id="settings"
                onClick={toggleOptionsMenu}
                className={getMenuItemClasses('settings')}
              >
                Configurações
              </a>
            </li>
            <li className="mt-auto">
              <a
                onClick={logout}
                className="cursor-pointer text-2xl block p-2 rounded-md hover:bg-green-700 dark:hover:bg-gray-700"
              >
                <IoMdLogOut />
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* --- Conteúdo Principal --- */}
      <main className="flex-1 pt-4 sm:p-8 md:ml-0 overflow-y-auto bg-gray-100 dark:bg-primary-dark">
        {showDashboard && <Dashboard />}
        {showUserList && <UserList />}
        {showUserAdd && <FormUser />}
        {showProductList && <ProductList />}
        {showProductAdd && <FormProduct />}
        {showCategoryList && <CategoryList />}
        {showCategoryAdd && <FormCategory />}
        {showSettings && <AdmSettings />}
        {showLogout && <div className="dark:text-white">Saindo...</div>}
      </main>
    </div>
  );
};

export default AdminPainel;

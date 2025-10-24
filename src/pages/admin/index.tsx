import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';
import UserList from '../../components/UserList';
import Dashboard from '../../components/admin/Dashboard';
import FormUser from '../../components/FormUser';
import { IoMdLogOut } from 'react-icons/io';
import AdmSettings from '../../components/admin/AdmSettings';

const AdminPainel: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [showUserList, setShowUserList] = useState(false);
  const [showUserAdd, setShowUserAdd] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const { logout } = useAuthStore();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUsersDropdown = () => {
    setIsUsersDropdownOpen(!isUsersDropdownOpen);
  };

  const toggleOptionsMenu = (
    v: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    let id = v.currentTarget.id;

    toggleMenu();

    switch (id) {
      case 'dashboard':
        setShowDashboard(true);
        setShowUserList(false);
        setShowUserAdd(false);
        setShowSettings(false);
        setShowLogout(false);
        break;
      case 'user-list':
        setShowDashboard(false);
        setShowUserList(true);
        setShowUserAdd(false);
        setShowSettings(false);
        setShowLogout(false);
        break;
      case 'user-add':
        setShowDashboard(false);
        setShowUserList(false);
        setShowUserAdd(true);
        setShowSettings(false);
        setShowLogout(false);
        break;
      case 'settings':
        setShowDashboard(false);
        setShowUserList(false);
        setShowUserAdd(false);
        setShowSettings(true);
        setShowLogout(false);
        break;
      case 'logout':
        setShowDashboard(false);
        setShowUserList(false);
        setShowUserAdd(false);
        setShowSettings(false);
        setShowLogout(true);
        break;
      default:
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
                className="cursor-pointer block p-2 rounded-md hover:bg-green-700 dark:hover:bg-gray-700"
              >
                Dashboard
              </a>
            </li>
            <li className="relative">
              <button
                onClick={toggleUsersDropdown}
                className="flex items-center justify-between w-full p-2 rounded-md hover:bg-green-700 focus:outline-none dark:hover:bg-gray-700"
              >
                <span>Usuários</span>
                <span
                  className={`transform transition-transform ${isUsersDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
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
                      className="cursor-pointer block p-2 rounded-md text-sm hover:bg-green-700 dark:hover:bg-gray-700"
                    >
                      Lista de Usuários
                    </a>
                  </li>
                  <li>
                    <a
                      id="user-add"
                      onClick={toggleOptionsMenu}
                      className="cursor-pointer block p-2 rounded-md text-sm hover:bg-green-700 dark:hover:bg-gray-700"
                    >
                      Adicionar Novo
                    </a>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <a
                id="settings"
                onClick={toggleOptionsMenu}
                className="cursor-pointer block p-2 rounded-md hover:bg-green-700 dark:hover:bg-gray-700"
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
      <main className="flex-1 pt-4 sm:p-8 md:ml-0  overflow-y-auto  bg-gray-100 dark:bg-primary-dark">
        {showUserList && <UserList />}
        {showDashboard && <Dashboard />}
        {showUserAdd && <FormUser />}
        {showSettings && <AdmSettings />}
        {showLogout && <div className="dark:text-white">Saindo...</div>}
      </main>
    </div>
  );
};

export default AdminPainel;

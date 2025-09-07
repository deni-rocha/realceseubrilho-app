import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';

const Dashboard: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);

  const { logout } = useAuthStore();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUsersDropdown = () => {
    setIsUsersDropdownOpen(!isUsersDropdownOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-primary-dark">
      {/* --- Cabeçalho Mobile --- */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm z-10">
        <h1 className="text-xl font-bold text-gray-800">
          Painel Administrativo
        </h1>
        <button
          onClick={toggleMenu}
          className="text-gray-600 focus:outline-none focus:text-gray-800 md:dark:text-white"
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
      <aside
        className={`
          transform transition-transform duration-300 ease-in-out
          bg-gray-800 text-white w-64 p-4
          fixed inset-y-0 left-0 z-50
          md:relative md:translate-x-0
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          dark:bg-accent-dark dark:text-white
        `}
      >
        <nav>
          <ul className="flex flex-col space-y-2">
            <li>
              <a
                href="#dashboard"
                className="block p-2 rounded-md hover:bg-gray-700"
              >
                Dashboard
              </a>
            </li>
            <li className="relative">
              <button
                onClick={toggleUsersDropdown}
                className="flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-700 focus:outline-none"
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
                      href="#users/list"
                      className="block p-2 rounded-md text-sm hover:bg-gray-700"
                    >
                      Lista de Usuários
                    </a>
                  </li>
                  <li>
                    <a
                      href="#users/add"
                      className="block p-2 rounded-md text-sm hover:bg-gray-700"
                    >
                      Adicionar Novo
                    </a>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <a
                href="#settings"
                className="block p-2 rounded-md hover:bg-gray-700"
              >
                Configurações
              </a>
            </li>
            <li>
              <a
                onClick={logout}
                className="cursor-pointer block p-2 rounded-md hover:bg-gray-700"
              >
                Sair
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* --- Conteúdo Principal --- */}
      <main className="flex-1 p-8 md:ml-0 overflow-y-auto">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6 dark:text-white">
          Visão Geral
        </h2>
        <p className="text-gray-700 mb-8 dark:text-white">
          Bem-vindo ao painel administrativo. Aqui você pode gerenciar todas as
          configurações da sua aplicação.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">
              Total de Vendas
            </h3>
            <p className="mt-2 text-2xl font-bold text-gray-600">
              R$ 15.000,00
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">
              Usuários Ativos
            </h3>
            <p className="mt-2 text-2xl font-bold text-gray-600">1200</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

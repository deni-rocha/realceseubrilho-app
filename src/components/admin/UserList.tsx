// src/components/UserList.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import fetchUsers from '../../api/fetchUsers';
import UserCard from './UserCard';
import UserCardDetails from './UserCardDetails';
import { IoChevronBack } from 'react-icons/io5';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { LuRefreshCw } from 'react-icons/lu';
import { IoMdClose } from 'react-icons/io';

const UserList: React.FC = () => {
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const [userCardDetails, setUserCardDetails] = React.useState<{
    active: boolean;
    userId: string | null;
  }>({ active: false, userId: null });

  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'name' | 'email'>('name');

  // Função para filtrar usuários
  const filteredUsers = React.useMemo(() => {
    if (!users || !searchTerm) return users;

    return users.filter((user) => {
      const searchValue = searchTerm.toLowerCase();
      switch (filterBy) {
        case 'name':
          return user.name.toLowerCase().includes(searchValue);
        case 'email':
          return user.email.toLowerCase().includes(searchValue);
        default:
          return true;
      }
    });
  }, [users, searchTerm, filterBy]);

  if (isLoading) {
    return (
      <div className="p-6 text-gray-700 dark:text-gray-300 flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center">
          <FaSpinner className="w-8 h-8 text-green-600 animate-spin mb-2" />
          <span>Carregando usuários...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Ocorreu um erro ao carregar os dados.</div>;
  }

  return (
    <div className="p-6 rounded-lg shadow-md bg-gray-100 dark:bg-accent-dark">
      {userCardDetails.active ? (
        <div className="w-full mb-4 flex items-center justify-between border-b border-gray-300 dark:border-gray-700">
          <button
            className="mb-4 px-4 py-2 cursor-pointer bg-green-600 text-white rounded hover:bg-green-800"
            onClick={() => setUserCardDetails({ active: false, userId: null })}
          >
            <IoChevronBack />
          </button>
          <h1 className="text-lg font-bold mb-4 dark:text-white">
            Detalhes do Usuário
          </h1>
          <span></span>
        </div>
      ) : (
        <>
          <h1 className="text-lg font-bold mb-4 dark:text-white lg:text-2xl hidden md:block">
            Lista de Usuários
          </h1>

          <div className="flex flex-col gap-4 mb-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => refetch()}
                className="flex items-center gap-2 px-4 py-2 h-10 cursor-pointer bg-green-600 text-white rounded hover:bg-green-800 lg:px-4 lg:py-2"
              >
                <span className="font-bold">Atualizar</span>
                <LuRefreshCw />
              </button>

              <button
                onClick={() => setShowSearch(!showSearch)}
                className="ml-4 px-4 py-2 h-10 cursor-pointer bg-green-600 text-white rounded hover:bg-green-800"
              >
                {showSearch ? <IoMdClose /> : <FaSearch />}
              </button>
            </div>

            {showSearch && (
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterBy}
                    onChange={(e) =>
                      setFilterBy(e.target.value as 'name' | 'email')
                    }
                    className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="name">Nome</option>
                    <option value="email">Email</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      <div>
        {userCardDetails.active && userCardDetails.userId && (
          <div className="mb-4 flex justify-center">
            <UserCardDetails
              user={users?.find((user) => user.id === userCardDetails.userId)!}
              setUserCardDetails={setUserCardDetails}
            />
          </div>
        )}
      </div>
      {!userCardDetails.active && (
        <>
          {filteredUsers?.length === 0 ? (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              Nenhum usuário encontrado.
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4 2xl:gap-4">
              {filteredUsers?.map((user) => (
                <li key={user.id}>
                  <UserCard
                    user={user}
                    userCardDetails={userCardDetails}
                    setUserCardDetails={setUserCardDetails}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default UserList;

// src/components/UserList.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import fetchUsers from '../api/fetchUsers';
import UserCard from './UserCard';
import UserCardDetails from './UserCardDetails';
import { IoChevronBack } from 'react-icons/io5';
import { FaSearch } from 'react-icons/fa';
import { LuRefreshCw } from 'react-icons/lu';

const UserList: React.FC = () => {
  // O useQuery aceita uma "chave" única (users) e uma função assíncrona
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users'], // A chave 'users' identifica e armazena o cache
    queryFn: fetchUsers,
  });

  const [userCardDetails, setUserCardDetails] = React.useState<{
    active: boolean;
    userId: string | null;
  }>({ active: false, userId: null });

  // Estados de carregamento e erro

  if (isLoading) {
    return <div>Carregando usuários...</div>;
  }

  if (error) {
    return <div>Ocorreu um erro ao carregar os dados.</div>;
  }

  // Se a requisição foi bem-sucedida, data não é undefined

  return (
    <div className="p-6 rounded-lg shadow-md bg-gray-100 dark:bg-accent-dark">
      {userCardDetails.active ? (
        <div className="w-full mb-4 flex justify-between border-b border-gray-300 dark:border-gray-700">
          <button
            className="mb-4 px-4 py-2 cursor-pointer bg-green-600 text-white rounded hover:bg-green-800"
            onClick={() => setUserCardDetails({ active: false, userId: null })}
          >
            <IoChevronBack />
          </button>
          <h1 className="text-2xl font-bold mb-4 dark:text-white">
            Detalhes do Usuário
          </h1>
          <span></span>
        </div>
      ) : (
        <>
          <h1 className="text-lg font-bold mb-4 dark:text-white lg:text-2xl">
            Lista de Usuários
          </h1>

          <div className="flex items-center justify-between">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 mb-4 px-4 py-2 h-10 cursor-pointer bg-green-600 text-white rounded hover:bg-green-800 lg:mb-4 lg:px-4 lg:py-2"
            >
              <span className="font-bold"> Atualizar</span>
              <LuRefreshCw />
            </button>

            <button className="mb-4 ml-4 px-4 py-2 h-10 cursor-pointer bg-green-600 text-white rounded hover:bg-green-800">
              <FaSearch />
            </button>
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
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4 2xl:gap-4">
          {users?.map((user) => (
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
    </div>
  );
};

export default UserList;

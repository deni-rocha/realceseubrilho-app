// src/components/UserList.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import fetchUsers from '../api/fetchUsers';
import UserCard from './UserCard';

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

  if (isLoading) {
    return <div>Carregando usuários...</div>;
  }

  if (error) {
    return <div>Ocorreu um erro ao carregar os dados.</div>;
  }

  // Se a requisição foi bem-sucedida, data não é undefined

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 dark:text-white">
        Lista de Usuários
      </h1>
      <button
        onClick={() => refetch()}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Atualizar Lista
      </button>
      <ul>
        {users?.map((user) => (
          <li key={user.id} className="p-2">
            <UserCard user={user} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;

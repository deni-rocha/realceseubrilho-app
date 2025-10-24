import { useState, type Dispatch } from 'react';
import type { UserDetails } from '../types/UserDetails';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { FaSpinner } from 'react-icons/fa';
import api from '../api';
import { toast } from 'react-toastify';
import type { ApiError } from '../types/ApiError';
import handleApiError from '../utils/handleApiError';
import { useQueryClient } from '@tanstack/react-query';

interface UserCardProps {
  user: UserDetails;
  setUserCardDetails: Dispatch<
    React.SetStateAction<{
      userId: string | null;
      active: boolean;
    }>
  >;
}

const UserCardDetails = ({ user, setUserCardDetails }: UserCardProps) => {
  const [selectedRole, setSelectedRole] = useState(user.role.name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleClose = () => {
    setUserCardDetails({ active: false, userId: null });
  };

  const deleteUser = async () => {
    try {
      if (user.id === 'f4c81fea-be74-4235-b7dc-2361a3fec9b6')
        return toast.error('Não é possível deletar esse usuário');

      await api.delete(`users/${user.id}`);

      queryClient.invalidateQueries({ queryKey: ['users'] });

      toast.success('Usuário deletado com sucesso!');
      handleClose();
    } catch (error) {
      toast.error(handleApiError(error as ApiError));
    }
  };

  const handleSave = async () => {
    // Lógica para salvar as mudanças do usuário, como a role
    setIsSubmitting(true);

    try {
      api.post(`/users/${user.id}`, {
        role: selectedRole,
      });

      toast.success('Usuário atualizado com sucesso!');
    } catch (error) {}

    console.log('Dados salvos:', {
      userId: user.id,
      newRole: selectedRole,
    });
    setTimeout(() => {
      setIsSubmitting(false);
      handleClose();
    }, 2000);
  };

  return (
    <div className="relative p-6 bg-white dark:bg-accent-dark rounded-lg shadow-md w-[500px] h-auto border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <h2 className=" text-lg md:text-2xl font-semibold text-gray-900 dark:text-white">
          {user.name}
        </h2>
        <button
          onClick={deleteUser}
          className="cursor-pointer text-gray-500 dark:text-gray-300 hover:text-green-600 transition-colors duration-200"
          aria-label="Deletar usuário"
        >
          <RiDeleteBin5Line className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <div className="flex flex-col space-y-2">
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <div className="flex items-center">
            <p className="font-medium">Nível de Acesso:</p>
            <select
              className="ml-2 pl-2 pr-4 py-1 w-[200px] font-semibold border rounded-full dark:bg-accent-dark dark:border-gray-600"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value={'CUSTOMER'}>Cliente</option>
              <option value={'ADMIN'}>Administrador</option>
            </select>
          </div>
          <p>
            <span className="font-medium">Status:</span>{' '}
            {user.verified ? (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                Verificado
              </span>
            ) : (
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                Não Verificado
              </span>
            )}
          </p>
        </div>

        <div className="flex justify-end space-x-2 mt-4 text-sm md:text-md">
          <button
            onClick={handleSave}
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center px-4 md:px-8 py-3 text-white font-semibold bg-gradient-to-r bg-green-600 hover:bg-green-800 rounded-lg shadow-lg focus:outline-none focus:ring-4 transform transition-transform duration-200 hover:scale-105 cursor-pointer disabled:cursor-not-allowed "
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-3" />
                Carregando...
              </>
            ) : (
              <>Salvar</>
            )}
          </button>
          <button
            onClick={handleClose}
            className="cursor-pointer px-4 font-bold py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCardDetails;

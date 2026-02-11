import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/index';
import type { UserDetails } from '../../types/UserDetails';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-toastify';
import { FaEnvelope, FaUser } from 'react-icons/fa';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Sidebar from '../../components/home/Sidebar';

// Define validation schema for customer profile (without password)
const profileSchema = z.object({
  name: z.string().min(6, 'O nome deve conter ao menos 6 caracteres.'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const CustomerPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { user: currentUser } = useAuthStore();
  const [profile, setProfile] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize form with react-hook-form and Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
    },
  });

  // Garantir que o usuário está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (currentUser?.id) {
      fetchProfile();
    } else {
      // Se não temos o id ainda, redirecionamos para home para que o login possa preencher
      navigate('/home');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, currentUser?.id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get<UserDetails>(`/users/${currentUser?.id}`);
      setProfile(response.data);
      // Preencher o form com dados atuais
      setValue('name', response.data.name);
    } catch (e) {
      toast.error('Falha ao carregar dados do usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate: SubmitHandler<ProfileFormData> = async (data) => {
    if (!profile) return;

    // Only include fields that have changed
    const payload: any = {};
    if (data.name && data.name !== profile.name) payload.name = data.name;

    if (Object.keys(payload).length === 0) {
      toast.info('Nenhuma modificação feita.');
      return;
    }

    try {
      setLoading(true);
      await api.patch(`/users/${profile.id}`, payload);
      toast.success('Perfil atualizado com sucesso');
      await fetchProfile();
      // Reset form after successful update
      reset({
        name: profile.name,
      });
    } catch (err) {
      const message =
        (err as any)?.response?.data?.message ?? 'Erro ao atualizar';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Mock cart items count for now (in a real app, this would come from context/store)
  const cartItemsCount = 0;

  // Mock logout function
  const handleLogout = () => {
    // In a real app, this would dispatch logout action
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-inherit dark:bg-primary-dark overflow-hidden">
      {/* Sidebar - Desktop */}
      <Sidebar
        isAuthenticated={isAuthenticated}
        cartItemsCount={cartItemsCount}
        onLogout={handleLogout}
        isCartVisible={false}
      />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${isAuthenticated ? 'lg:ml-64' : ''}`}
      >
        {/* Back Button - Mobile only */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:text-white lg:hidden"
          aria-label="Voltar à página anterior"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar
        </button>

        {/* Full-width container with centered content */}
        <div className="flex justify-center min-h-screen mt-20 pt-6 pb-16 lg:pt-0">
          <div className="w-full max-w-4xl px-4">
            <div className="bg-white dark:bg-accent-dark rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="px-8 py-6 bg-gradient-to-r from-[#e0e5ce] to-[#f0f2e8]">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Meu Perfil
                </h2>
              </div>

              <div className="p-8">
                <div className="space-y-6">
                  {/* Campo Nome */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-white">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      placeholder="Nome Completo"
                      className={`w-full pl-12 pr-4 py-4 border rounded-full focus:ring-2 focus:outline-none dark:text-white ${
                        errors.name
                          ? 'border-red-500 focus:ring-red-300'
                          : 'border-gray-400 focus:ring-green-400 dark:border-black dark:focus:ring-yellow-500'
                      }`}
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1 absolute -bottom-5">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Campo Email - Somente para exibição */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-white">
                      <FaEnvelope />
                    </span>
                    <p className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 rounded-full text-gray-900 dark:text-white">
                      {profile?.email || 'Carregando...'}
                    </p>
                  </div>

                  {/* Data de Criação do Usuário */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-6 8a2 2 0 11-4 0 2 2 0 014 0zM12 4v16m8-8a2 2 0 11-4 0 2 2 0 014 0zM6 12a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </span>
                    <p className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 rounded-full text-gray-900 dark:text-white">
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString(
                            'pt-BR',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            },
                          )
                        : 'Carregando...'}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    type="submit"
                    onClick={handleSubmit(handleUpdate)}
                    disabled={isSubmitting || loading}
                    className="flex items-center justify-center px-8 py-4 text-lg text-white font-semibold bg-gradient-to-r from-[#415444] to-[#415444]/90 rounded-full shadow-lg hover:from-[#415444]/90 hover:to-[#415444]/80 focus:outline-none focus:ring-4 focus:ring-[#415444]/50 transform transition-transform duration-200 hover:scale-105 cursor-pointer disabled:from-[#415444]/70 disabled:to-[#415444]/60 disabled:cursor-not-allowed dark:from-[#415444]/80 dark:to-[#415444]/70 dark:hover:from-[#415444]/70 dark:hover:to-[#415444]/60 dark:focus:ring-[#415444]/30 dark:disabled:from-[#415444]/50 dark:disabled:to-[#415444]/40"
                  >
                    {loading || isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 4.955 4.045 9 9 9v-4.5z"
                          ></path>
                        </svg>
                        Atualizando...
                      </>
                    ) : (
                      'Atualizar'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerPage;

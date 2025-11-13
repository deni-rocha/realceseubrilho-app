import React, { useState } from 'react';
import {
  FaArrowRight,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaSpinner,
  FaUser,
} from 'react-icons/fa';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import type { User } from '../../types/User';
import api from '../../api';
import type { ApiError } from '../../types/ApiError';

// 1. Definição do Esquema de Validação com Zod
const formSchema = z
  .object({
    name: z.string().min(6, 'O nome deve conter ao menos 6 caracteres.'),
    email: z.string().email('Email inválido.').min(1, 'O email é obrigatório.'),
    password: z
      .string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres.')
      .max(100, 'A senha não pode ter mais de 100 caracteres.'),
    confirmPassword: z.string().min(1, 'A confirmação de senha é obrigatória.'),
    role: z.enum(['CUSTOMER', 'ADMIN']),
    verified: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof formSchema>;

const FormUser: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // 2. Gerenciamento do Formulário com useForm e zodResolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      verified: false,
      role: 'CUSTOMER',
    },
  });

  // 3. Função de Submissão do Formulário
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const userToRegister = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      await api.post<User>('/auth/register', userToRegister);

      toast.success('Usuário cadastrado com sucesso!');
    } catch (err) {
      if ((err as ApiError).status === 409) {
        toast.error('Email já cadastrado. Tente outro email.');
        return;
      }
      toast.error('Erro ao cadastrar usuário. Tente novamente.');
    }
  };

  return (
    <div className="relative flex text-sm items-center justify-center min-h-screen bg-white dark:bg-primary-dark overflow-hidden">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors z-20"
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Voltar
      </button>
      <div className="relative z-10 w-full max-w-md p-8 bg-white dark:bg-accent-dark rounded-lg shadow-lg">
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6 mb-8">
            {/* Campo Nome */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-white">
                <FaUser />
              </span>
              <input
                type="text"
                placeholder="Nome Completo"
                className={`w-full pl-12 pr-4 py-3 border rounded-full focus:ring-2 focus:outline-none dark:text-white ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-300'
                    : 'border-gray-400 focus:ring-green-400 dark:border-black'
                }`}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 absolute -bottom-5">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Campo Email */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-white">
                <FaEnvelope />
              </span>
              <input
                type="email"
                placeholder="E-mail"
                className={`w-full pl-12 pr-4 py-3 border rounded-full focus:ring-2 focus:outline-none dark:text-white ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-300'
                    : 'border-gray-400 focus:ring-green-400 dark:border-black'
                }`}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 absolute -bottom-5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Campo Senha */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-white">
                <FaLock />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                className={`w-full pl-12 pr-12 py-3 border rounded-full focus:ring-2 focus:outline-none dark:text-white ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-300'
                    : 'border-gray-400 focus:ring-green-400 dark:border-black'
                }`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 absolute -bottom-5">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Campo Confirmar Senha */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-white">
                <FaLock />
              </span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirmar Senha"
                className={`w-full pl-12 pr-12 py-3 border rounded-full focus:ring-2 focus:outline-none dark:text-white ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:ring-red-300'
                    : 'border-gray-400 focus:ring-green-400 dark:border-black'
                }`}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 absolute -bottom-5">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center mb-12">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center px-8 py-3 md:text-lg text-white font-semibold bg-gradient-to-r from-green-800 to-green-600 rounded-full shadow-lg hover:from-green-700 hover:to-green-500 focus:outline-none focus:ring-4 focus:ring-green-400 transform transition-transform duration-200 hover:scale-105 cursor-pointer disabled:from-green-500 disabled:to-green-400 disabled:cursor-not-allowed dark:from-yellow-500 dark:to-yellow-600 dark:hover:from-yellow-600 dark:hover:to-yellow-700 dark:focus:ring-yellow-300 dark:disabled:from-yellow-400 dark:disabled:to-yellow-500"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-3" />
                  Carregando...
                </>
              ) : (
                <>
                  Cadastrar
                  <FaArrowRight className="ml-3" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600 dark:text-gray-200">
            Já tem uma conta?
          </span>
          <Link
            to="/login"
            className="ml-1 text-green-600 font-semibold hover:underline dark:text-yellow-600"
          >
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FormUser;

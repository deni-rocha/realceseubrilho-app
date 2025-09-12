import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FaEnvelope,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../../api';

// 1. Esquema de validação com Zod
const formSchema = z.object({
  email: z.string().email('Email inválido.').min(1, 'O email é obrigatório.'),
});

type FormData = z.infer<typeof formSchema>;

// 2. Estados da requisição
type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

const RequestEmailVerification: React.FC = () => {
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [message, setMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setStatus('loading');
    setMessage('');

    try {
      const response = await api.post('/auth/request-email-verification', {
        email: data.email,
      });

      if (response.status === 201) {
        setStatus('success');
        setMessage(
          'Um novo link de verificação foi enviado para o seu e-mail.',
        );
      } else {
        setStatus('error');
        setMessage('Ocorreu um erro ao processar sua solicitação.');
      }
    } catch (err) {
      setStatus('error');
      if (err) {
        setMessage(
          (err as Error).message || 'Erro do servidor. Verifique o email.',
        );
      } else {
        setMessage('Ocorreu um erro de rede. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Reenviar Verificação
        </h1>
        <p className="text-gray-600 mb-6">
          Informe seu e-mail para receber um novo link de verificação.
        </p>

        {/* Mensagens de feedback */}
        {status === 'loading' && (
          <div className="flex flex-col items-center mb-4 text-blue-500">
            <FaSpinner className="animate-spin text-4xl mb-2" />
            <p>Enviando...</p>
          </div>
        )}
        {status === 'success' && (
          <div className="flex flex-col items-center mb-4 text-green-600">
            <FaCheckCircle className="text-4xl mb-2" />
            <p className="font-semibold">{message}</p>
          </div>
        )}
        {status === 'error' && (
          <div className="flex flex-col items-center mb-4 text-red-600">
            <FaTimesCircle className="text-4xl mb-2" />
            <p className="font-semibold">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <FaEnvelope />
            </span>
            <input
              type="email"
              placeholder="Seu E-mail"
              className={`w-full pl-12 pr-4 py-3 border rounded-full focus:ring-2 focus:outline-none ${
                errors.email
                  ? 'border-red-500 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-blue-300'
              }`}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full cursor-pointer flex items-center justify-center px-4 py-3 text-white font-semibold rounded-full shadow-lg transition-colors duration-200
            bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300
            disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Enviando...' : 'Reenviar Link'}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          <Link to="/login" className="text-blue-500 hover:underline">
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequestEmailVerification;

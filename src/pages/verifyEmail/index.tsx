import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import api from '../../api';

// Definimos os possíveis estados da verificação
type VerificationStatus = 'idle' | 'loading' | 'success' | 'error';

const VerifyEmail: React.FC = () => {
  // Pega o token da URL usando o hook useSearchParams
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Se não houver token na URL, definimos um erro
    if (!token) {
      setStatus('error');
      setMessage('Token de verificação não encontrado.');
      return;
    }

    // Função assíncrona para validar o token
    const verifyToken = async () => {
      setStatus('loading');
      try {
        const response = await api.post('/auth/verify-email', { token });

        if (response.status === 200) {
          setStatus('success');
          setMessage('Seu e-mail foi verificado com sucesso!');
        } else {
          // Trata outros status de sucesso que não sejam 200, se necessário
          setStatus('error');
          setMessage('Ocorreu um erro inesperado durante a verificação.');
        }
      } catch (err) {
        setStatus('error');
        // Acessa a mensagem de erro do servidor

        console.log(err);

        if (err) {
          setMessage((err as Error).message || 'Token inválido ou expirado.');
        } else {
          setMessage('Ocorreu um erro de rede. Tente novamente mais tarde.');
        }
      }
    };

    verifyToken();
  }, [token]); // O efeito roda novamente se o token na URL mudar

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center w-full max-w-md">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">Verificando...</h1>
            <p className="mt-2 text-gray-600">Por favor, aguarde.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center text-green-600">
            <FaCheckCircle className="text-6xl mb-4" />
            <h1 className="text-2xl font-bold">Verificação Completa!</h1>
            <p className="mt-2 text-gray-600">{message}</p>
            <a href="/login" className="mt-4 text-blue-500 hover:underline">
              Ir para a página de login
            </a>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center text-red-600">
            <FaTimesCircle className="text-6xl mb-4" />
            <h1 className="text-2xl font-bold">Falha na Verificação</h1>
            <p className="mt-2 text-gray-600">{message}</p>
            <p className="mt-4 text-sm text-gray-500">
              Se o problema persistir, entre em contato com o suporte.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

import { useState, useEffect } from 'react';
import { FaUser, FaLock, FaArrowRight, FaSpinner } from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-toastify';
import { Link, Navigate } from 'react-router-dom';

const Login = () => {
  const [data, setData] = useState({ email: '', password: '' });
  const { login, status, error, user } = useAuthStore();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login({ email: data.email, password: data.password });
  }

  useEffect(() => {
    if (status === 'succeeded') {
      toast.success('Login realizado com sucesso.');
    } else if (status === 'failed') {
      toast.error(`Erro no login: ${error}`);
    }
  }, [status, error]);

  if (user) {
    return user.role === 'ADMIN' ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/customer" replace />
    );
  }

  return (
    <div className="relative text-sm flex items-center justify-center min-h-screen bg-white dark:bg-primary-dark overflow-hidden">
      <div className="relative z-10 p-4 bg-white dark:bg-accent-dark rounded-lg shadow-lg max-w-sm sm:p-8 sm:w-full">
        <div className="text-center mb-12">
          <img
            src="/logo-512x512.png"
            alt="Logo"
            className="mx-auto mb-4 w-30 h-30 md:w-50 md:h-50 object-contain lg:"
          />
          <p className="text-gray-600 dark:text-white">
            Acesse sua conta para continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 mb-8">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-white">
                <FaUser />
              </span>
              <input
                type="text"
                placeholder="E-mail"
                className="w-full pl-12 pr-4 py-3 border border-gray-400 rounded-full focus:ring-2 focus:ring-green-400 focus:outline-none dark:text-white dark:border-black dark:focus:ring-yellow-300"
                name="email"
                value={data.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-white">
                <FaLock />
              </span>
              <input
                type="password"
                placeholder="Senha"
                className="w-full pl-12 pr-4 py-3 border border-gray-400 rounded-full focus:ring-2 focus:ring-green-400 focus:outline-none dark:text-white dark:border-black dark:focus:ring-yellow-300"
                name="password"
                value={data.password}
                onChange={handleChange}
              />
            </div>
            <a
              href="#"
              className="block text-right text-gray-500 hover:underline dark:text-gray-300"
            >
              Esqueceu sua senha?
            </a>
          </div>

          <div className="flex justify-center mb-12">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={status === 'loading'}
              className="flex items-center justify-center px-8 py-3 text-sm sm:text-lg text-white font-semibold bg-gradient-to-r from-green-800 to-green-600 rounded-full shadow-lg hover:from-green-700 hover:to-green-500 focus:outline-none focus:ring-4 focus:ring-green-400 transform transition-transform duration-200 hover:scale-105 cursor-pointer disabled:from-green-500 disabled:to-green-400 disabled:cursor-not-allowed dark:from-yellow-500 dark:to-yellow-600 dark:hover:from-yellow-600 dark:hover:to-yellow-700 dark:focus:ring-yellow-300 dark:disabled:from-yellow-400 dark:disabled:to-yellow-500"
            >
              {status === 'loading' ? (
                <>
                  <FaSpinner className="animate-spin mr-3" />
                  Carregando...
                </>
              ) : (
                <>
                  Entrar
                  <FaArrowRight className="ml-3" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <span className="text-gray-600 dark:text-gray-200">
            Ainda não tem uma conta?
          </span>
          <Link
            to="/register-user"
            className="ml-1 text-green-600 font-semibold hover:underline dark:text-yellow-600"
          >
            Criar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

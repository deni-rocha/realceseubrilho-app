import { useState } from 'react';
import { FaUser, FaLock, FaArrowRight } from 'react-icons/fa'; // Ícones de usuário, cadeado e seta
import { useAuthStore } from '../store/authStore';

const LoginScreen = () => {
  const [data, setData] = useState({ email: '', password: '' });
  const { login, status } = useAuthStore();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login({ email: data.email, password: data.password });
  }

  if (status === 'succeeded') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-primary-dark">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Login bem-sucedido!
        </h1>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-primary-dark">
        <h1 className="text-2xl font-bold text-red-600">
          Falha no login. Tente novamente.
        </h1>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-50 dark:bg-primary-dark overflow-hidden">
      <div className="relative z-10 w-full max-w-sm p-8 bg-white dark:bg-accent-dark rounded-lg shadow-lg">
        <div className="text-center mb-12">
          <img
            src="/logo-512x512.png"
            alt="Logo"
            className="mx-auto mb-4 w-50 h-50 object-contain"
          />
          <p className="text-gray-600 dark:text-white">
            Faça login na sua conta
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
                className="w-full pl-12 pr-4 py-3 border border-yellow-500 rounded-full focus:ring-2 focus:ring-yellow-300 focus:outline-none dark:text-white"
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
                className="w-full pl-12 pr-4 py-3 border border-yellow-500 rounded-full focus:ring-2 focus:ring-yellow-300 focus:outline-none dark:text-white"
                name="password"
                value={data.password}
                onChange={handleChange}
              />
            </div>
            <a
              href="#"
              className="block text-right text-sm text-gray-500 hover:underline dark:text-gray-300"
            >
              Esqueceu sua senha?
            </a>
          </div>

          <div className="flex justify-center mb-12">
            {status === 'loading' ? (
              <div className="mb-4 text-yellow-600">Carregando...</div>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center justify-center px-8 py-3 text-lg text-white font-semibold bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full shadow-lg hover:from-white-600 hover:to-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-300 transform transition-transform duration-200 hover:scale-105 cursor-pointer"
              >
                Entrar
                <FaArrowRight className="ml-3" />
              </button>
            )}
          </div>
        </form>

        <div className="text-center text-sm bg-primary">
          <span className="text-gray-600 dark:text-gray-200">
            Não tem uma conta?
          </span>
          <a
            href="#"
            className="ml-1 text-yellow-600 font-semibold hover:underline"
          >
            Criar
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

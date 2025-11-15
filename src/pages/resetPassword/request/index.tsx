import { useState } from 'react';
import { FaEnvelope, FaArrowRight, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../../api/auth';

const RequestResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await forgotPassword({ email });
      setIsSubmitted(true);
      toast.success('Se o e-mail existe, você receberá um e-mail para resetar sua senha.');
    } catch (error) {
      toast.error('Ocorreu um erro. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="relative text-sm flex items-center justify-center min-h-screen bg-white dark:bg-primary-dark overflow-hidden">
        <div className="relative z-10 p-4 bg-white dark:bg-accent-dark rounded-lg shadow-lg max-w-sm sm:p-8 sm:w-full">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <FaEnvelope className="text-green-600 dark:text-green-400 text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Verifique seu e-mail
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Enviamos instruções para redefinir sua senha para <strong>{email}</strong>.
              Verifique sua caixa de entrada e siga as instruções.
            </p>
          </div>
          
          <div className="mt-8">
            <Link 
              to="/login"
              className="block text-center w-full py-3 px-4 bg-gradient-to-r from-green-800 to-green-600 text-white font-semibold rounded-full hover:from-green-700 hover:to-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:from-yellow-500 dark:to-yellow-600 dark:hover:from-yellow-600 dark:hover:to-yellow-700 dark:focus:ring-yellow-500 transition-colors"
            >
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative text-sm flex items-center justify-center min-h-screen bg-white dark:bg-primary-dark overflow-hidden">
      <div className="relative z-10 p-4 bg-white dark:bg-accent-dark rounded-lg shadow-lg max-w-sm sm:p-8 sm:w-full">
        <div className="text-center mb-8">
          <img
            src="/logo-512x512.png"
            alt="Logo"
            className="mx-auto mb-4 w-20 h-20 object-contain"
          />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Redefinir senha
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Insira seu e-mail para receber instruções de redefinição de senha
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 mb-8">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-white">
                <FaEnvelope />
              </span>
              <input
                type="email"
                placeholder="Seu e-mail"
                className="w-full pl-12 pr-4 py-3 border border-gray-400 rounded-full focus:ring-2 focus:ring-green-400 focus:outline-none dark:text-white dark:border-black dark:focus:ring-yellow-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center w-full px-6 py-3 text-sm sm:text-lg text-white font-semibold bg-gradient-to-r from-green-800 to-green-600 rounded-full shadow-lg hover:from-green-700 hover:to-green-500 focus:outline-none focus:ring-4 focus:ring-green-400 transform transition-transform duration-200 hover:scale-105 cursor-pointer disabled:from-green-500 disabled:to-green-400 disabled:cursor-not-allowed dark:from-yellow-500 dark:to-yellow-600 dark:hover:from-yellow-600 dark:hover:to-yellow-700 dark:focus:ring-yellow-300 dark:disabled:from-yellow-400 dark:disabled:to-yellow-500"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-3" />
                  Enviando...
                </>
              ) : (
                <>
                  Enviar instruções
                  <FaArrowRight className="ml-3" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link
            to="/login"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white font-medium"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequestResetPassword;
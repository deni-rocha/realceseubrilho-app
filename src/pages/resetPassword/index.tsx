import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaLock, FaArrowRight, FaSpinner, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { resetPassword } from '../../api/auth';

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!token) {
      toast.error('Token de redefinição inválido ou ausente.');
      navigate('/login');
    }
  }, [token, navigate]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { newPassword: '', confirmPassword: '' };

    if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'A senha deve ter pelo menos 6 caracteres';
      isValid = false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await resetPassword({
        token: token!,
        newPassword: formData.newPassword
      });
      
      setIsSuccess(true);
      toast.success('Senha redefinida com sucesso!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao redefinir senha. Tente novamente.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="relative text-sm flex items-center justify-center min-h-screen bg-white dark:bg-primary-dark overflow-hidden">
        <div className="relative z-10 p-4 bg-white dark:bg-accent-dark rounded-lg shadow-lg max-w-sm sm:p-8 sm:w-full">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <FaCheck className="text-green-600 dark:text-green-400 text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Senha redefinida!
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Sua senha foi alterada com sucesso. Você já pode fazer login com sua nova senha.
            </p>
          </div>
          
          <div className="mt-8">
            <button
              onClick={() => navigate('/login')}
              className="block text-center w-full py-3 px-4 bg-gradient-to-r from-green-800 to-green-600 text-white font-semibold rounded-full hover:from-green-700 hover:to-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:from-yellow-500 dark:to-yellow-600 dark:hover:from-yellow-600 dark:hover:to-yellow-700 dark:focus:ring-yellow-500 transition-colors"
            >
              Fazer login
            </button>
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
            Digite sua nova senha abaixo
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 mb-8">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-white">
                <FaLock />
              </span>
              <input
                type="password"
                placeholder="Nova senha"
                className={`w-full pl-12 pr-4 py-3 border rounded-full focus:ring-2 focus:outline-none ${
                  errors.newPassword 
                    ? 'border-red-500 focus:ring-red-400' 
                    : 'border-gray-400 focus:ring-green-400 dark:border-black dark:focus:ring-yellow-300'
                }`}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
              />
              {errors.newPassword && (
                <p className="mt-1 text-red-500 text-xs">{errors.newPassword}</p>
              )}
            </div>
            
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-white">
                <FaLock />
              </span>
              <input
                type="password"
                placeholder="Confirmar nova senha"
                className={`w-full pl-12 pr-4 py-3 border rounded-full focus:ring-2 focus:outline-none ${
                  errors.confirmPassword 
                    ? 'border-red-500 focus:ring-red-400' 
                    : 'border-gray-400 focus:ring-green-400 dark:border-black dark:focus:ring-yellow-300'
                }`}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-red-500 text-xs">{errors.confirmPassword}</p>
              )}
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
                  Redefinindo...
                </>
              ) : (
                <>
                  Redefinir senha
                  <FaArrowRight className="ml-3" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
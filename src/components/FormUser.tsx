import React, { useState, type FormEvent } from 'react';
import type { User } from '../types/User';
import type { EnumRole } from '../types/UserAuth';
import {
  FaArrowRight,
  FaEnvelope,
  FaLock,
  FaUser,
  FaUserShield,
} from 'react-icons/fa';

interface FormUserData extends Omit<User, 'id'> {
  password: string;
  confirmPassword: string;
  role: EnumRole;
}

const FormUser: React.FC = () => {
  const [formData, setFormData] = useState<FormUserData>({
    password: '',
    confirmPassword: '',
    verified: false,
    name: '',
    email: '',
    role: 'CUSTOMER', // Valor padrão
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.name || !formData.email) {
      setFormError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setFormError(null);
    console.log('Dados do formulário:', formData);

    // Aqui você enviaria os dados para a sua API
    // Exemplo: api.post('/register', formData);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-50 dark:bg-primary-dark overflow-hidden">
      <div className="relative z-10 w-full max-w-sm p-8 bg-white dark:bg-accent-dark rounded-lg shadow-lg">
        <div className="text-center mb-12">
          {/* Use sua logo ou um ícone aqui */}
          <img
            src="/logo-512x512.png"
            alt="Logo"
            className="mx-auto mb-4 w-50 h-50 object-contain"
          />
          <p className="text-gray-600 dark:text-white">
            Preencha seus dados para criar sua conta
          </p>
        </div>

        {/* Exemplo de exibição de erro (substitua com sua lógica) */}
        {/* {formError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{formError}</span>
          </div>
        )} */}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 mb-8">
            {/* Campo Nome */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-white">
                <FaUser />
              </span>
              <input
                type="text"
                placeholder="Nome Completo"
                className="w-full pl-12 pr-4 py-3 border border-yellow-500 rounded-full focus:ring-2 focus:ring-yellow-300 focus:outline-none dark:text-white"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            {/* Campo Email */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-white">
                <FaEnvelope />
              </span>
              <input
                type="email"
                placeholder="E-mail"
                className="w-full pl-12 pr-4 py-3 border border-yellow-500 rounded-full focus:ring-2 focus:ring-yellow-300 focus:outline-none dark:text-white"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            {/* Campo Senha */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-white">
                <FaLock />
              </span>
              <input
                type="password"
                placeholder="Senha"
                className="w-full pl-12 pr-4 py-3 border border-yellow-500 rounded-full focus:ring-2 focus:ring-yellow-300 focus:outline-none dark:text-white"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            {/* Campo Confirmar Senha */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-white">
                <FaLock />
              </span>
              <input
                type="password"
                placeholder="Confirmar Senha"
                className="w-full pl-12 pr-4 py-3 border border-yellow-500 rounded-full focus:ring-2 focus:ring-yellow-300 focus:outline-none dark:text-white"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>

            {/* Campo Nível de Acesso (Role) */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-white">
                <FaUserShield />
              </span>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 border border-yellow-500 rounded-full focus:ring-2 focus:ring-yellow-300 focus:outline-none dark:text-white dark:bg-accent-dark"
              >
                <option value={'CUSTOMER'}>Cliente</option>
                <option value={'ADMIN'}>Administrador</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center mb-12">
            {/* Lógica de carregamento (substitua conforme sua implementação) */}
            {/* {status === 'loading' ? (
              <div className="mb-4 text-yellow-600">Carregando...</div>
            ) : ( */}
            <button
              type="submit"
              className="flex items-center justify-center px-8 py-3 text-lg text-white font-semibold bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full shadow-lg hover:from-white-600 hover:to-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-300 transform transition-transform duration-200 hover:scale-105 cursor-pointer"
            >
              Cadastrar
              <FaArrowRight className="ml-3" />
            </button>
            {/* )} */}
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600 dark:text-gray-200">
            Já tem uma conta?
          </span>
          <a
            href="#"
            className="ml-1 text-yellow-600 font-semibold hover:underline"
          >
            Entrar
          </a>
        </div>
      </div>
    </div>
  );
};

export default FormUser;

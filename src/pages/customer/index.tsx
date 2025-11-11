import React, { useState } from 'react';
import {
  FaUser,
  FaEnvelope,
  FaEdit,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaShoppingBag,
  FaHeart,
  FaMapMarkerAlt,
  FaPhone,
  FaArrowLeft,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/catalog/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-toastify';

const CustomerProfile: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Aqui você pode fazer a chamada à API para atualizar os dados
    toast.success('Perfil atualizado com sucesso!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-primary-dark">
      {/* Sidebar */}
      <Sidebar
        isAuthenticated={isAuthenticated}
        cartItemsCount={0}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
            >
              <FaArrowLeft />
              <span className="font-medium">Voltar</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Meu Perfil
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Gerencie suas informações pessoais e preferências
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar - Informações Rápidas */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-accent-dark rounded-lg shadow-md p-6">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 dark:from-yellow-400 dark:to-yellow-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {user?.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                  {user?.verified ? (
                    <div className="flex items-center gap-2 mt-3 text-green-600 dark:text-green-400">
                      <FaCheckCircle />
                      <span className="text-sm font-medium">Verificado</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-3 text-yellow-600 dark:text-yellow-400">
                      <FaTimes />
                      <span className="text-sm font-medium">
                        Não verificado
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FaShoppingBag className="text-green-600 dark:text-yellow-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Pedidos
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        0
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FaHeart className="text-red-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Favoritos
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        0
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Formulário de Perfil */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-accent-dark rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Informações Pessoais
                  </h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-yellow-600 dark:hover:bg-yellow-700 rounded-lg transition-colors"
                    >
                      <FaEdit />
                      Editar
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                      >
                        <FaSave />
                        Salvar
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <FaTimes />
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaUser className="inline mr-2" />
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-yellow-500 focus:outline-none dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaEnvelope className="inline mr-2" />
                      E-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-yellow-500 focus:outline-none dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Telefone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaPhone className="inline mr-2" />
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-yellow-500 focus:outline-none dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Endereço */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaMapMarkerAlt className="inline mr-2" />
                      Endereço
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Rua, número, complemento"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-yellow-500 focus:outline-none dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Cidade, Estado, CEP */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cidade
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-yellow-500 focus:outline-none dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Estado
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="UF"
                        maxLength={2}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-yellow-500 focus:outline-none dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CEP
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="00000-000"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-yellow-500 focus:outline-none dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção de Pedidos Recentes */}
              <div className="bg-white dark:bg-accent-dark rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Pedidos Recentes
                </h3>
                <div className="text-center py-8">
                  <FaShoppingBag className="mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Você ainda não fez nenhum pedido
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;

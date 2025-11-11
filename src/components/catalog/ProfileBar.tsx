import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaEnvelope,
  FaHeadset,
} from 'react-icons/fa';

interface ProfileBarProps {
  isAuthenticated: boolean;
  userName?: string;
  userEmail?: string;
  onLogout: () => void;
}

const ProfileBar: React.FC<ProfileBarProps> = ({
  isAuthenticated,
  userName = 'Visitante',
  userEmail,
  onLogout,
}) => {
  return (
    <div className="lg:hidden bg-white border-b border-gray-200">
      {/* Profile Header */}
      <div className="px-6 py-6 bg-gradient-to-r from-[#e0e5ce] to-[#f0f2e8]">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0">
            <FaUser className="h-9 w-9 text-[#415444]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 truncate">
              {userName}
            </h3>
            {isAuthenticated && userEmail ? (
              <p className="text-sm text-gray-600 truncate mt-0.5">
                {userEmail}
              </p>
            ) : (
              <p className="text-sm text-gray-600 mt-0.5">
                Navegando como visitante
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="px-4 py-6">
        {isAuthenticated ? (
          <div className="space-y-1">
            <Link
              to="/customer"
              className="flex items-center gap-4 px-4 py-3.5 text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-[#e0e5ce] rounded-lg flex items-center justify-center flex-shrink-0">
                <FaUser className="h-4 w-4 text-[#415444]" />
              </div>
              <span className="font-medium text-base">Meu Perfil</span>
            </Link>
            <Link
              to="#"
              className="flex items-center gap-4 px-4 py-3.5 text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-[#e0e5ce] rounded-lg flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="h-4 w-4 text-[#415444]" />
              </div>
              <span className="font-medium text-base">Mensagens</span>
            </Link>
            <Link
              to="#"
              className="flex items-center gap-4 px-4 py-3.5 text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-[#e0e5ce] rounded-lg flex items-center justify-center flex-shrink-0">
                <FaCog className="h-4 w-4 text-[#415444]" />
              </div>
              <span className="font-medium text-base">Configurações</span>
            </Link>
            <Link
              to="/support"
              className="flex items-center gap-4 px-4 py-3.5 text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-[#e0e5ce] rounded-lg flex items-center justify-center flex-shrink-0">
                <FaHeadset className="h-4 w-4 text-[#415444]" />
              </div>
              <span className="font-medium text-base">Suporte</span>
            </Link>

            {/* Divider */}
            <div className="h-px bg-gray-200 my-4"></div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-4 py-3.5 text-red-600 hover:bg-red-50 active:bg-red-100 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaSignOutAlt className="h-4 w-4 text-red-600" />
              </div>
              <span className="font-semibold text-base">Sair da Conta</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Login Button */}
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-[#415444] text-white rounded-xl hover:bg-[#415444]/90 active:bg-[#415444]/80 transition-colors font-semibold text-base shadow-sm"
            >
              Entrar na Conta
            </Link>

            {/* Register Button */}
            <Link
              to="/register-user"
              className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-[#415444] text-[#415444] rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors font-semibold text-base"
            >
              Criar Nova Conta
            </Link>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">ou</span>
              </div>
            </div>

            {/* Support Link */}
            <Link
              to="/support"
              className="flex items-center justify-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors"
            >
              <FaHeadset className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-base">Falar com Suporte</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileBar;

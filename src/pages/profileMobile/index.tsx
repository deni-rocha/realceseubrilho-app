import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { useCart } from '../../hooks/useCart';
import ProfileBar from '../../components/home/ProfileBar';
import BottomNavigationBar from '../../components/home/BottomNavigationBar';

const ProfileMobilePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { logout, user } = useAuthStore();
  const { cartItemsCount } = useCart(); // Pegando o número de itens no carrinho
  const [activeTab, setActiveTab] = useState<
    'home' | 'search' | 'cart' | 'profile'
  >('profile');

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  const handleTabChange = (tab: 'home' | 'search' | 'cart' | 'profile') => {
    setActiveTab(tab);

    if (tab === 'home') {
      navigate('/home');
    } else if (tab === 'cart') {
      navigate('/cart');
    } else if (tab === 'search') {
      // Para a aba de busca, podemos manter na mesma página ou ir para uma página de busca
      // Por enquanto, apenas mudamos a aba sem navegar
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {' '}
      {/* Espaço na parte inferior para a BottomNavigationBar */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <ProfileBar
            isAuthenticated={isAuthenticated}
            userName={user?.name}
            userEmail={user?.email}
            onLogout={handleLogout}
          />
        </div>
      </div>
      {/* Barra de navegação inferior */}
      <BottomNavigationBar
        activeTab={activeTab}
        cartItemsCount={cartItemsCount} // Usando o valor real do carrinho
        onTabChange={handleTabChange}
        isHidden={false}
      />
    </div>
  );
};

export default ProfileMobilePage;

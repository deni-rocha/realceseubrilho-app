import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user } = useAuthStore();

  return {
    isAuthenticated: !!user,
    role: user?.role ? user.role : null,
  };
};

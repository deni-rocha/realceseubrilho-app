import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { EnumRole } from '../../types/UserAuth';

interface PrivateRouteProps {
  children: ReactNode;
  roleProp: EnumRole;
}

export const PrivateRoute = ({ children, roleProp }: PrivateRouteProps) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== roleProp) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

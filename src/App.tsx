import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AdminPainel from './pages/admin';
import CustomerPainel from './pages/customer';
import Login from './pages/login';
import Layout from './components/Layout';
import { PrivateRoute } from './components/routes/PrivateRoute';
import { useAuth } from './hooks/useAuth';
import NotFound from './pages/notFound';

function App() {
  const { isAuthenticated, role } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Rota principal com redirecionamento */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                role === 'ADMIN' ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/customer" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Rotas de login e painéis */}
          <Route path="login" element={<Login />} />
          <Route
            path="admin"
            element={
              <PrivateRoute roleProp="ADMIN">
                <AdminPainel />
              </PrivateRoute>
            }
          />
          <Route
            path="customer"
            element={
              <PrivateRoute roleProp="CUSTOMER">
                <CustomerPainel />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

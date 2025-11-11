import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AdminPainel from './pages/admin';
import Login from './pages/login';
import Layout from './components/Layout';
import { PrivateRoute } from './components/routes/PrivateRoute';
import { useAuth } from './hooks/useAuth';
import NotFound from './pages/notFound';
import RegisterUser from './pages/register';
import VerifyEmail from './pages/verifyEmail';
import RequestEmailVerification from './pages/requestEmailVerification';
import Home from './pages/home';
import SupportWidget from './components/SupportWidget.tsx';
import CustomerProfile from './pages/customer';

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
              isAuthenticated && role === 'ADMIN' ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/home" replace />
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
          <Route path="/home" element={<Home />} />
          <Route path="/customer" element={<CustomerProfile />} />
          <Route path="*" element={<NotFound />} />
          <Route path="register-user" element={<RegisterUser />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="support" element={<SupportWidget />} />
          <Route
            path="request-email-verification"
            element={<RequestEmailVerification />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

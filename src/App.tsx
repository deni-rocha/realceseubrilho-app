import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { CartProvider } from './hooks/useCart';
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
import ProfilePage from './pages/profileMobile/index.tsx';
import CustomerPage from './pages/customer';
import FinancialCharts from './components/admin/charts/FinancialCharts';
import DashboardWithCharts from './components/admin/DashboardWithCharts';
import RequestResetPassword from './pages/resetPassword/request';
import ResetPasswordForm from './pages/resetPassword';
import CartPage from './pages/cart';
import SearchPage from './pages/search';

function App() {
  const { isAuthenticated, role } = useAuth();

  return (
    <BrowserRouter>
      <CartProvider>
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
            <Route path="reset-password" element={<RequestResetPassword />} />
            <Route path="reset-password/form" element={<ResetPasswordForm />} />
            <Route
              path="admin"
              element={
                <PrivateRoute roleProp="ADMIN">
                  <AdminPainel />
                </PrivateRoute>
              }
            />

            <Route path="/admin/charts" element={<FinancialCharts />} />
            <Route
              path="/admin/dashboard-charts"
              element={<DashboardWithCharts />}
            />
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/customer" element={<CustomerPage />} />
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
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;

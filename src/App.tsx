import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './my-components/Layout';
import Catalog from './pages/CatalogPage';

import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import { CartProvider } from './context/CartContext';
import type { JSX } from 'react';
import "./App.css";
import { AuthProvider } from './context/AuthContext';
import AdminPanel from './pages/admin/AdminProductPanel';
import { RequireRole } from "@/my-components/AdminPanel/RequireRole"
import EmailConfirmationPage from './pages/auth/ConfirmEmailPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import ContactsPage from './pages/ContactsPage';
import ThankYouPage from './pages/ThankYouPage';
import NotFoundPage from './pages/NotFoundPage';
import UserOrdersPage from './pages/UserOrdersPage';
import AdminEditOrderPage from './pages/admin/AdminEditOrderPage';
import { ConversationsPage } from './pages/admin/ConversationsPage';
import ChatPage from './pages/admin/ChatPage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

function App(): JSX.Element {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Catalog />} />
              <Route path="catalog" element={<Catalog />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="product/:productId" element={<ProductPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="confirm-email" element={<EmailConfirmationPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="profile" element={
                <RequireRole allowedRoles={["AdminDesigner", "Registered"]}>
                  <ProfilePage />
                </RequireRole>
              } />
              <Route path="orders" element={
                <RequireRole allowedRoles={["AdminDesigner", "Registered"]}>
                  <UserOrdersPage />
                </RequireRole>
              } />
              <Route path="checkout" element={
                <RequireRole allowedRoles={["AdminDesigner", "Registered"]}>
                  <CheckoutPage />
                </RequireRole>
              } />
              <Route path="thank-you" element={
                <RequireRole allowedRoles={["AdminDesigner", "Registered"]}>
                  <ThankYouPage />
                </RequireRole>
              } />
              <Route path="/change-password" element={
                <RequireRole allowedRoles={["AdminDesigner", "Registered"]}>
                  <ChangePasswordPage />
                </RequireRole>
              } />
              <Route path="admin/products" element={
                <RequireRole allowedRoles={["AdminDesigner"]}>
                  <AdminPanel />
                </RequireRole>
              } />
              <Route path="admin/orders" element={
                <RequireRole allowedRoles={["AdminDesigner"]}>
                  <AdminOrdersPage />
                </RequireRole>
              } />
              <Route path="/admin/chat/:userId" element={
                <RequireRole allowedRoles={["AdminDesigner"]}>
                  <ChatPage />
                </RequireRole>
              } />
              <Route path="orders/:orderId/edit" element={
                <RequireRole allowedRoles={["AdminDesigner"]}>
                  <AdminEditOrderPage />
                </RequireRole>
              } />
              <Route path="admin/conversations" element={
                <RequireRole allowedRoles={["AdminDesigner"]}>
                  <ConversationsPage />
                </RequireRole>

              } />
              <Route path="*" element={<NotFoundPage />} />

            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

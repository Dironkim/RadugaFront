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
import AdminPanel from './pages/AdminPanel';
import { RequireRole } from "@/my-components/AdminPanel/RequireRole"
import EmailConfirmationPage from './pages/auth/ConfirmEmailPage';
import AdminOrdersPage from './pages/AdminOrdersPage'
import ContactsPage from './pages/ContactsPage';
import ThankYouPage from './pages/ThankYouPage';
import NotFoundPage from './pages/NotFoundPage';
import UserOrdersPage from './pages/UserOrdersPage';
import AdminEditOrderPage from './pages/AdminEditOrderPage';

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
              <Route path="confirm-email" element={<EmailConfirmationPage/>}/>
              <Route path="login" element={<LoginPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="profile" element={<ProfilePage/>}/>
              <Route path="orders" element={<UserOrdersPage/>}/>
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="contacts" element = {<ContactsPage/>}/>
              <Route path="thank-you" element = {<ThankYouPage/>}/>
              <Route path="orders/:orderId/edit" element={<AdminEditOrderPage />} />
              <Route
                path="admin"
                element={
                  <RequireRole allowedRoles={["AdminDesigner"]}>
                    <AdminPanel />
                  </RequireRole>
                }
              />
              <Route
                path="admin/orders"
                element={
                  <RequireRole allowedRoles={["AdminDesigner"]}>
                    <AdminOrdersPage/>
                  </RequireRole>
                }
              /> 
              <Route path="*" element={<NotFoundPage />} />
 
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

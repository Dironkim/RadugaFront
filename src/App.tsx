import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './my-components/Layout';

import Catalog from './pages/CatalogPage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';

import { CartProvider } from './context/CartContext';
import type { JSX } from 'react';
import "./App.css";
import { AuthProvider } from './context/AuthContext';

function App(): JSX.Element {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Catalog />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="curtains" element={<CategoryPage />} />
              <Route path="product/:productId" element={<ProductPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="profile" element={<ProfilePage/>}/>
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

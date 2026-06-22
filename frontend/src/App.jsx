import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// Protected Route Checker
import ProtectedRoute from './components/Common/ProtectedRoute.jsx';

// Customer Pages
import Home from './pages/Customer/Home.jsx';
import Shop from './pages/Customer/Shop.jsx';
import ProductDetails from './pages/Customer/ProductDetails.jsx';
import Cart from './pages/Customer/Cart.jsx';
import Wishlist from './pages/Customer/Wishlist.jsx';
import Checkout from './pages/Customer/Checkout.jsx';
import Profile from './pages/Customer/Profile.jsx';
import OrderHistory from './pages/Customer/OrderHistory.jsx';
import OrderDetails from './pages/Customer/OrderDetails.jsx';

// Auth Pages
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import ForgotPassword from './pages/Auth/ForgotPassword.jsx';
import ResetPassword from './pages/Auth/ResetPassword.jsx';

// Admin Pages
import Dashboard from './pages/Admin/Dashboard.jsx';
import AdminProducts from './pages/Admin/AdminProducts.jsx';
import AdminCategories from './pages/Admin/AdminCategories.jsx';
import AdminOrders from './pages/Admin/AdminOrders.jsx';
import AdminUsers from './pages/Admin/AdminUsers.jsx';
import AdminReviews from './pages/Admin/AdminReviews.jsx';

// Fallback Page
const PageNotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
    <h1 className="text-5xl font-extrabold text-indigo-600">404</h1>
    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Page Not Found</h2>
    <p className="text-xs text-slate-400 max-w-sm">The route you are trying to access does not exist or has been moved.</p>
    <a href="/" className="bg-indigo-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition inline-block">Return Home</a>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Customer Routing */}
        <Route path="/" element={<MainLayout />}>
          
          {/* Guest Auth */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />

          {/* Secure Customer Routing */}
          <Route element={<ProtectedRoute />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="order/:id" element={<OrderDetails />} />
          </Route>

          {/* 404 Routing fallback */}
          <Route path="*" element={<PageNotFound />} />
        </Route>

        {/* Secure Admin Routing */}
        <Route path="/admin" element={<ProtectedRoute adminOnly={true} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="reviews" element={<AdminReviews />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;

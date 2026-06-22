import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import Navbar from '../components/Common/Navbar.jsx';
import Footer from '../components/Common/Footer.jsx';
import api from '../services/api.js';
import { setCart } from '../redux/cartSlice.js';
import { setWishlist } from '../redux/wishlistSlice.js';

const MainLayout = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // Sync user details on authentication load
  useEffect(() => {
    const fetchUserData = async () => {
      if (userInfo) {
        try {
          const cartRes = await api.get('/cart');
          dispatch(setCart(cartRes.data));

          const wishlistRes = await api.get('/users/wishlist');
          dispatch(setWishlist(wishlistRes.data));
        } catch (error) {
          console.error('Failed to sync cart/wishlist details:', error.message);
        }
      }
    };
    fetchUserData();
  }, [userInfo, dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 transition-colors duration-200 dark:bg-slate-900">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default MainLayout;

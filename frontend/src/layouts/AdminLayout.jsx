import React, { useState } from 'react';
import { Link, NavLink, useNavigate, Outlet as RouterOutlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/authSlice.js';
import { clearCartItems } from '../redux/cartSlice.js';
import { clearWishlist } from '../redux/wishlistSlice.js';
import { toggleTheme } from '../redux/themeSlice.js';
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Users,
  Layers,
  MessageSquare,
  ArrowLeft,
  LogOut,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCartItems());
    dispatch(clearWishlist());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
    { name: 'Users', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden dark:bg-slate-950">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-sm md:hidden"
        ></div>
      )}

      {/* Sidebar Section */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out border-r border-slate-800 flex flex-col md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <Link to="/" className="flex items-center space-x-2 text-indigo-400">
            <ShoppingBag className="h-6 w-6 stroke-[2.5]" />
            <span className="font-extrabold text-xl tracking-tight text-white">NextShop <span className="text-xs bg-indigo-600 px-2 py-0.5 rounded text-indigo-200">Admin</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center w-full px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 mr-2 text-slate-500 rounded-lg hover:bg-slate-50 md:hidden dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">Admin Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 text-slate-500 hover:text-indigo-600 rounded-full transition dark:text-slate-400 dark:hover:text-white"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Profile Avatar details */}
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm uppercase">
                {userInfo?.name.charAt(0)}
              </div>
              <span className="hidden sm:inline text-sm font-semibold text-slate-700 dark:text-slate-200">{userInfo?.name}</span>
            </div>
          </div>
        </header>

        {/* Layout Body content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <RouterOutlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/authSlice.js';
import { clearCartItems } from '../../redux/cartSlice.js';
import { clearWishlist } from '../../redux/wishlistSlice.js';
import { toggleTheme } from '../../redux/themeSlice.js';
import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  User,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  UserCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { darkMode } = useSelector((state) => state.theme);

  // Compute total items count in cart
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistItemsCount = wishlistItems.length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCartItems());
    dispatch(clearWishlist());
    toast.success('Logged out successfully');
    navigate('/');
    setUserDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm transition-colors duration-200 dark:bg-slate-900 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
              <ShoppingBag className="h-6 w-6 stroke-[2.5]" />
              <span className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-white">NextShop</span>
            </Link>
            {userInfo && (
              <div className="hidden md:flex space-x-8 ml-10">
                {userInfo.role !== 'admin' ? (
                  <>
                    <Link to="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition dark:text-slate-300 dark:hover:text-white">Home</Link>
                    <Link to="/shop" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition dark:text-slate-300 dark:hover:text-white">Shop</Link>
                  </>
                ) : (
                  <Link to="/admin" className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition">Admin Panel</Link>
                )}
              </div>
            )}
          </div>

          {/* Search bar */}
          {userInfo && userInfo.role !== 'admin' && (
            <div className="hidden md:flex flex-1 max-w-md items-center justify-center px-6">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              </form>
            </div>
          )}

          {/* User Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 text-slate-500 hover:text-indigo-600 rounded-full transition dark:text-slate-400 dark:hover:text-white"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Wishlist & Cart (Only when logged in) */}
            {userInfo && userInfo.role !== 'admin' && (
              <>
                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className="p-2 text-slate-500 hover:text-indigo-600 rounded-full transition relative dark:text-slate-400 dark:hover:text-white"
                  title="Wishlist"
                >
                  <Heart className="h-5 w-5" />
                  {wishlistItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                      {wishlistItemsCount}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="p-2 text-slate-500 hover:text-indigo-600 rounded-full transition relative dark:text-slate-400 dark:hover:text-white"
                  title="Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* User Dropdown */}
            {userInfo ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-1 p-1 rounded-full border border-slate-200 hover:border-indigo-300 transition focus:outline-none dark:border-slate-700"
                >
                  <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase dark:bg-slate-800 dark:text-indigo-400">
                    {userInfo.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold px-1 max-w-[80px] truncate dark:text-slate-200">{userInfo.name}</span>
                </button>

                {userDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-20 transition-all dark:bg-slate-800 dark:border-slate-700">
                      <div className="px-4 py-2 border-b border-gray-100 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                        Signed in as <p className="font-semibold truncate dark:text-slate-200">{userInfo.email}</p>
                      </div>

                      {userInfo.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                          <LayoutDashboard className="h-4 w-4 mr-2" /> Admin Panel
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        <UserCircle className="h-4 w-4 mr-2" /> My Profile
                      </Link>

                      {userInfo.role !== 'admin' && (
                        <Link
                          to="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" /> My Orders
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 text-left dark:hover:bg-rose-950/30"
                      >
                        <LogOut className="h-4 w-4 mr-2" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold transition"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex items-center md:hidden space-x-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 text-slate-500 hover:text-indigo-600 rounded-full transition dark:text-slate-400"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-indigo-600 transition dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slider */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white dark:bg-slate-900 dark:border-slate-800 py-3 px-4 space-y-3 shadow-md">
          {/* Mobile search */}
          {userInfo && userInfo.role !== 'admin' && (
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            </form>
          )}

          <div className="flex flex-col space-y-2">
            {userInfo && userInfo.role !== 'admin' && (
              <>
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-200">Home</Link>
                <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-200">Shop</Link>
                <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-200 flex justify-between items-center">
                  <span>Wishlist</span>
                  {wishlistItemsCount > 0 && <span className="bg-rose-500 text-white rounded-full px-2 py-0.5 text-xs">{wishlistItemsCount}</span>}
                </Link>
                <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-200 flex justify-between items-center">
                  <span>Cart</span>
                  {cartItemsCount > 0 && <span className="bg-indigo-600 text-white rounded-full px-2 py-0.5 text-xs">{cartItemsCount}</span>}
                </Link>
                <hr className="border-slate-100 dark:border-slate-800" />
              </>
            )}

            {userInfo ? (
              <>
                {userInfo.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 flex items-center">
                    <LayoutDashboard className="h-4 w-4 mr-2" /> Admin Panel
                  </Link>
                )}
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 flex items-center">
                  <User className="h-4 w-4 mr-2" /> My Profile
                </Link>
                {userInfo.role !== 'admin' && (
                  <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 flex items-center">
                    <ShoppingCart className="h-4 w-4 mr-2" /> My Orders
                  </Link>
                )}
                <button onClick={handleLogout} className="w-full px-3 py-2 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left flex items-center">
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-indigo-600 text-white text-center py-2 rounded-lg text-sm font-semibold hover:bg-indigo-500 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

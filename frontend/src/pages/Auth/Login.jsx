import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFail } from '../../redux/authSlice.js';
import api from '../../services/api.js';
import { ShoppingBag, KeyRound, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { userInfo, loading, error } = useSelector((state) => state.auth);
  
  // If redirect query is present, go there after login, else go home
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    }
  }, [userInfo, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please enter all credentials');
    }

    dispatch(loginStart());
    try {
      const res = await api.post('/auth/login', { email, password });
      dispatch(loginSuccess(res.data));
      toast.success(`Welcome back, ${res.data.name}!`);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed';
      dispatch(loginFail(errMsg));
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Sign in to NextShop</h2>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Or{' '}
            <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              create a new account
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-2xs font-semibold text-slate-500 uppercase mb-1 dark:text-slate-400">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
              <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-2xs font-semibold text-slate-500 uppercase dark:text-slate-400">Password</label>
              <Link to="/forgot-password" className="text-2xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-10 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
              <KeyRound className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 text-slate-400 hover:text-indigo-600 focus:outline-none transition dark:text-slate-400 dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-xs transition flex items-center justify-center mt-6 shadow-sm"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="h-3.5 w-3.5 ml-2" />
          </button>
        </form>



      </div>
    </div>
  );
};

export default Login;

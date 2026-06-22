import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api.js';
import { KeyRound, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      return toast.error('Please enter all fields');
    }

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      await api.put(`/auth/resetpassword/${token}`, { password });
      toast.success('Password reset successfully!');
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Token is invalid or expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Reset Password</h2>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Provide a secure new password for your account.
          </p>
        </div>

        {success ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
            <p className="font-bold text-sm text-slate-700 dark:text-slate-200">Password Changed Successfully!</p>
            <p className="text-2xs text-slate-400">Redirecting to the login portal...</p>
          </div>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-2xs font-semibold text-slate-500 uppercase mb-1 dark:text-slate-400">New Password</label>
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

            <div>
              <label className="block text-2xs font-semibold text-slate-500 uppercase mb-1 dark:text-slate-400">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-10 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
                <KeyRound className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-indigo-600 focus:outline-none transition dark:text-slate-400 dark:hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-xs transition flex items-center justify-center mt-6 shadow-sm"
            >
              {loading ? 'Processing...' : 'Update Password'}
            </button>
          </form>
        )}

        <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-700/60">
          <Link to="/login" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition dark:text-slate-400 dark:hover:text-indigo-400">
            <ArrowLeft className="h-3.5 w-3.5 mr-2" /> Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;

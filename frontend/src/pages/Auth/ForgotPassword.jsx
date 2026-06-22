import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error('Please enter your email');
    }

    setLoading(true);
    setResetUrl('');
    try {
      const res = await api.post('/auth/forgotpassword', { email });
      toast.success(res.data.message);
      // Save link locally for visual ease of testing/reviewing
      if (res.data.resetUrl) {
        setResetUrl(res.data.resetUrl);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Recover Password</h2>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Enter your email address to receive a password reset token.
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-xs transition flex items-center justify-center mt-6 shadow-sm"
          >
            {loading ? 'Submitting...' : 'Send Reset Link'} <Send className="h-3.5 w-3.5 ml-2" />
          </button>
        </form>

        {/* Local Sandbox reset url visual aid */}
        {resetUrl && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 dark:bg-amber-950/20 dark:border-amber-900 dark:text-amber-300">
            <span className="font-bold">Sandbox Helper (No SMTP needed)</span>
            <p className="mt-1">Since this is running in development/review mode, you can reset your password by clicking here:</p>
            <a 
              href={resetUrl}
              target="_blank" 
              rel="noopener noreferrer" 
              className="block mt-2 font-semibold text-indigo-600 hover:underline dark:text-indigo-400 break-all"
            >
              {resetUrl}
            </a>
          </div>
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

export default ForgotPassword;

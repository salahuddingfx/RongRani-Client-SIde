import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, ShoppingCart, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';
  const message = location.state?.message;

  const isEmail = identifier.includes('@');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(identifier, password);
      if (response && response.requiresVerification) {
        navigate('/register', { state: { requiresOtp: true, email: response.email, from } });
        return;
      }
      navigate(from === '/cart' ? '/checkout' : from);
    } catch (error) {
      if (error.response?.data?.requiresVerification) {
        toast.success(error.response.data.message || 'Verification OTP sent to your email.');
        navigate('/register', {
          state: {
            requiresOtp: true,
            email: error.response.data.email || identifier,
            from
          }
        });
        return;
      }
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex flex-col items-center gap-2 mb-8">
          <div className="w-14 h-14 rounded-full border border-slate-200 dark:border-slate-700 overflow-hidden">
            <img src="/RongRani-Logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Rong<span className="text-maroon">Rani</span>
          </span>
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Welcome Back</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Sign in with your email or username</p>
          </div>

          {message && (
            <div className="bg-maroon/10 border border-maroon/20 text-maroon px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                {isEmail ? (
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                ) : (
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                )}
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-maroon focus:ring-2 focus:ring-maroon/10 transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400"
                  placeholder="you@example.com or username"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:border-maroon focus:ring-2 focus:ring-maroon/10 transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-maroon focus:ring-maroon"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-maroon hover:text-maroon-dark transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-maroon text-white hover:bg-maroon-dark rounded-xl px-6 py-3 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-maroon hover:text-maroon-dark transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const validToken = true;

  useEffect(() => {
    // Optionally, verify token validity here
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await authService.resetPassword(token, formData.newPassword);
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password');
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden flex flex-col justify-between">
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-maroon/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gold/5 rounded-full blur-3xl"></div>

        {/* Logo at top */}
        <div className="pt-8 pb-4">
          <div className="flex justify-center">
            <Link to="/" className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-maroon p-0 overflow-hidden shadow-xl group-hover:scale-110 transition-all duration-300 bg-transparent">
                <img src="/RongRani-Logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl md:text-3xl font-black text-maroon tracking-tight">
                Rong<span className="text-slate-850 dark:text-slate-200">Rani</span>
              </span>
            </Link>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md p-8 rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Token</h2>
            <p className="text-slate text-sm mb-6">
              The reset link is invalid or has expired.
            </p>
            <button
              onClick={() => navigate('/forgot-password')}
              className="w-full btn-primary py-3 rounded-lg font-medium hover:scale-105 transition-all duration-300"
            >
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden flex flex-col justify-between">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-maroon/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gold/5 rounded-full blur-3xl"></div>

      {/* Logo at top */}
      <div className="pt-8 pb-4">
        <div className="flex justify-center">
          <Link to="/" className="flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-maroon p-0 overflow-hidden shadow-xl group-hover:scale-110 transition-all duration-300 bg-transparent">
              <img src="/RongRani-Logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl md:text-3xl font-black text-maroon tracking-tight">
              Rong<span className="text-slate-850 dark:text-slate-200">Rani</span>
            </span>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md p-8 rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-maroon mb-2">Reset Password</h2>
            <p className="text-slate text-sm">
              Enter your new password below.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="input-field pl-12 pr-12"
                  placeholder="Enter new password"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate hover:text-maroon transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="input-field pl-12 pr-12"
                  placeholder="Confirm new password"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate hover:text-maroon transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-lg font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Resetting...</span>
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-semibold text-maroon hover:text-maroon-light transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
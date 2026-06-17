import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await authService.forgotPassword(email);
      setMessage('Password reset email sent. Please check your inbox.');
      toast.success('Password reset email sent!');
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to send reset email';
      setMessage(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

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
            <h2 className="text-2xl font-bold text-maroon mb-2">Forgot Password</h2>
            <p className="text-slate text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {message && (
            <div className={`px-4 py-3 rounded-xl mb-6 text-sm ${
              message.includes('sent') 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field pl-12"
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate" />
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
                  <span>Sending...</span>
                </div>
              ) : (
                'Send Reset Link'
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

export default ForgotPassword;
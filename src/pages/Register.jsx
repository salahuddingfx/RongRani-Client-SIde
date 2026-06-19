import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Check, ShoppingCart, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // OTP Verification States
  const location = useLocation();
  const [requiresOtp, setRequiresOtp] = useState(location.state?.requiresOtp || false);
  const [otpEmail, setOtpEmail] = useState(location.state?.email || '');
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const { register, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const from = location.state?.from || '/';
  const message = location.state?.message;

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateEmail = (email) => {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validations
    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      setLoading(false);
      return;
    }

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response && response.requiresVerification) {
        setRequiresOtp(true);
        setOtpEmail(response.email);
        setResendCooldown(60);
        toast.success('Registration initiated. Verification OTP sent to your email.');
        return;
      }

      toast.success('Account created successfully! Welcome to RongRani');
      navigate(from === '/cart' ? '/checkout' : from);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otpCode.length !== 6 || isNaN(otpCode)) {
      setOtpError('Please enter a valid 6-digit OTP code');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      await verifyOtp(otpEmail, otpCode);
      toast.success('Email verified successfully! Welcome to RongRani');
      navigate(from === '/cart' ? '/checkout' : from);
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    try {
      setResendCooldown(60);
      await authService.resendOtp(otpEmail);
      toast.success('A new OTP has been sent to your email.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  if (requiresOtp) {
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
              <div className="w-12 h-12 bg-maroon/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Key className="h-6 w-6 text-maroon" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Verify Your Account</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                We've sent a 6-digit code to <span className="font-medium text-slate-900 dark:text-white">{otpEmail}</span>
              </p>
            </div>

            {otpError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                {otpError}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Verification Code
                </label>
                <input
                  type="text"
                  maxLength="6"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-center font-mono text-lg tracking-[0.5em] focus:outline-none focus:border-maroon focus:ring-2 focus:ring-maroon/10 transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-300"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                className="w-full bg-maroon text-white hover:bg-maroon-dark rounded-xl px-6 py-3 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {otpLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0}
                  className={`font-semibold transition-colors ${
                    resendCooldown > 0
                      ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed'
                      : 'text-maroon hover:text-maroon-dark'
                  }`}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </button>
              </p>
              <button
                onClick={() => setRequiresOtp(false)}
                className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-maroon transition-colors"
              >
                Back to Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Create Account</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Join RongRani today</p>
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
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-maroon focus:ring-2 focus:ring-maroon/10 transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-maroon focus:ring-2 focus:ring-maroon/10 transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400"
                  placeholder="you@example.com"
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:border-maroon focus:ring-2 focus:ring-maroon/10 transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400"
                  placeholder="Min. 6 characters"
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

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:border-maroon focus:ring-2 focus:ring-maroon/10 transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400"
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                    agreeToTerms
                      ? 'bg-maroon border-maroon'
                      : 'border-slate-300 dark:border-slate-600 hover:border-maroon'
                  }`}
                  onClick={() => setAgreeToTerms(!agreeToTerms)}
                >
                  {agreeToTerms && <Check className="h-3 w-3 text-white" />}
                </div>
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                I agree to the{' '}
                <Link to="/terms" className="font-medium text-maroon hover:text-maroon-dark transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-medium text-maroon hover:text-maroon-dark transition-colors">
                  Privacy Policy
                </Link>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-maroon text-white hover:bg-maroon-dark rounded-xl px-6 py-3 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-maroon hover:text-maroon-dark transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Check, ShoppingCart, Gift, Heart, Truck, Package, Star, Key } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
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

      {/* Conditional render of OTP card or Sign up benefits and form */}
      {requiresOtp ? (
        <div className="flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md p-8 rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-maroon/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="h-8 w-8 text-maroon" />
              </div>
              <h2 className="text-2xl font-bold text-maroon mb-2">Verify Your Account</h2>
              <p className="text-slate text-sm">
                We've sent a 6-digit verification code to <span className="font-semibold text-slate-800">{otpEmail}</span>
              </p>
            </div>

            {otpError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                {otpError}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate mb-2">
                  Verification Code (OTP)
                </label>
                <input
                  type="text"
                  maxLength="6"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit code"
                  className="input-field text-center font-mono text-2xl tracking-widest py-4 bg-white/80"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                className="w-full btn-primary py-3.5 rounded-xl font-bold transition-all duration-300 disabled:opacity-50"
              >
                {otpLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Verifying Code...</span>
                  </div>
                ) : (
                  'Confirm Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate">
                Didn't receive the email?{' '}
                <button
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0}
                  className={`font-semibold transition-colors ${
                    resendCooldown > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-maroon hover:text-maroon-light'
                  }`}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </button>
              </p>
              
              <button
                onClick={() => setRequiresOtp(false)}
                className="mt-6 text-slate-500 hover:text-maroon text-xs font-bold transition-colors underline"
              >
                Back to Registration
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Customer Benefits Banner */}
          <div className="max-w-4xl mx-auto px-4 mb-6">
            <div className="bg-maroon text-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-3 text-center"><Gift className="inline-block w-5 h-5 mr-1" /> Become a Lifetime Customer</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <Heart className="w-7 h-7 mx-auto mb-1" />
                  <p className="font-semibold">Exclusive Deals</p>
                  <p className="text-cream-light text-xs">Member discounts</p>
                </div>
                <div className="text-center">
                  <Truck className="w-7 h-7 mx-auto mb-1" />
                  <p className="font-semibold">Free Shipping</p>
                  <p className="text-cream-light text-xs">Above ৳2500</p>
                </div>
                <div className="text-center">
                  <Package className="w-7 h-7 mx-auto mb-1" />
                  <p className="font-semibold">Order Tracking</p>
                  <p className="text-cream-light text-xs">Real-time updates</p>
                </div>
                <div className="text-center">
                  <Star className="w-7 h-7 mx-auto mb-1 fill-yellow-400 text-yellow-400" />
                  <p className="font-semibold">Priority Care</p>
                  <p className="text-cream-light text-xs">24/7 support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Centered Flat Luxury Form */}
          <div className="flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md p-8 rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-maroon mb-2">Create Account</h2>
                <p className="text-slate text-sm">Join RongRani and unlock lifetime benefits</p>
              </div>

              {/* Message from Cart */}
              {message && (
                <div className="bg-maroon/10 border border-maroon/30 text-maroon px-4 py-3 rounded-lg mb-6 text-sm flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5 flex-shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field pl-12"
                      placeholder="Enter your full name"
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field pl-12"
                      placeholder="Enter your email"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="6"
                      className="input-field pl-12 pr-12"
                      placeholder="Create a password"
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="input-field pl-12 pr-12"
                      placeholder="Confirm your password"
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

                {/* Terms Agreement */}
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${agreeToTerms
                        ? 'bg-maroon border-maroon'
                        : 'border-slate/40 hover:border-maroon'
                        }`}
                      onClick={() => setAgreeToTerms(!agreeToTerms)}
                    >
                      {agreeToTerms && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                  <span className="text-sm text-slate leading-relaxed">
                    I agree to the{' '}
                    <Link to="/terms" className="text-maroon hover:text-maroon-light font-medium underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-maroon hover:text-maroon-light font-medium underline">
                      Privacy Policy
                    </Link>
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 rounded-lg font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Sign In Link */}
              <div className="mt-8 text-center">
                <p className="text-slate text-sm">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-maroon hover:text-maroon-light font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Register;
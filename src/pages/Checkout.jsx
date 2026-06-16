import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useDeliveryCalculation } from '@/hooks/useDeliveryCalculation';
import {
  CreditCard, Truck, MapPin, User, ShoppingBag, Tag,
  ChevronRight, Shield, Clock, Gift, CheckCircle,
  AlertTriangle, Loader, ArrowLeft, Sparkles, Phone, Mail,
  BadgeCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useLanguage } from '@/contexts/LanguageContext';
import Seo from '@/components/Seo';

/* ─────────────────────────────────────────────────────────────
   Reusable field wrapper
───────────────────────────────────────────────────────────── */
const Field = ({ label, required, children, hint }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider">
      {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-[10px] text-slate-400 dark:text-slate-500">{hint}</p>}
  </div>
);

const inputCls =
  'w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-500 focus:outline-none focus:border-maroon dark:focus:border-pink-500 focus:ring-4 focus:ring-maroon/10 dark:focus:ring-pink-500/10 transition-all';

/* ─────────────────────────────────────────────────────────────
   Step indicator
───────────────────────────────────────────────────────────── */
const Steps = ({ active }) => {
  const steps = ['Cart', 'Details', 'Payment', 'Confirm'];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((s, i) => {
        const done = i < active;
        const current = i === active;
        return (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${done ? 'bg-green-500 text-white' : current ? 'bg-maroon text-white shadow-lg shadow-maroon/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                {done ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-[9px] font-bold mt-1 uppercase tracking-wider ${current ? 'text-maroon dark:text-pink-400' : done ? 'text-green-600' : 'text-slate-400'}`}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-10 sm:w-16 mx-1 mb-4 transition-all ${done ? 'bg-green-400' : 'bg-slate-200 dark:bg-slate-700'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Main Checkout Component
───────────────────────────────────────────────────────────── */
const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { delivery, loading: deliveryLoading, fetchDelivery } = useDeliveryCalculation();
  const { t } = useLanguage();
  const { state } = useLocation();
  const giftWrapping = state?.giftWrapping || false;
  const giftWrappingFee = 50;

  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponInfo, setCouponInfo] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [step, setStep] = useState(1); // 1=details, 2=payment, 3=review
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    union: user?.address?.union || '',
    subDistrict: user?.address?.subDistrict || '',
    district: user?.address?.district || '',
    division: user?.address?.division || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.postalCode || '',
    transactionId: '',
    senderLastDigits: '',
    paymentMethod: 'cod',
    giftMessage: '',
  });

  // Reset coupon if cart total changes
  useEffect(() => {
    if (couponInfo) { setCouponInfo(null); setDiscount(0); }
  }, [totalPrice]);

  // Fetch delivery charge
  useEffect(() => {
    if (totalPrice > 0 && formData.district && formData.city) {
      fetchDelivery(totalPrice, formData.district, formData.city);
    }
  }, [totalPrice, formData.district, formData.city, fetchDelivery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'paymentMethod' && value === 'cod') {
      toast('Please pay delivery charge in advance for order confirmation.', {
        icon: <AlertTriangle className="w-4 h-4" />,
        style: { borderRadius: '12px', background: '#FFFBEB', color: '#B45309', border: '1px solid #FCD34D' },
        duration: 4000,
      });
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (couponLoading) return;
    const code = couponCode.trim().toUpperCase();
    if (!code) { setCouponInfo(null); setDiscount(0); setCouponCode(''); return; }
    if (couponInfo) { setCouponInfo(null); setDiscount(0); setCouponCode(''); return; }
    setCouponLoading(true);
    try {
      const res = await axios.post('/api/coupons/validate', { code, subtotal: totalPrice });
      setCouponCode(code);
      setCouponInfo(res.data);
      setDiscount(res.data.discount || 0);
      toast.success(`Coupon applied! You saved ৳${(res.data.discount || 0).toFixed(0)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon code');
      setCouponInfo(null); setDiscount(0);
    } finally {
      setCouponLoading(false);
    }
  };

  const getEta = () => {
    if (!formData.district || !formData.city) return 'Enter address to see ETA';
    const d = formData.district.toLowerCase();
    const c = formData.city.toLowerCase();
    return (d.includes('cox') || c.includes('cox')) ? '1–2 days (Local)' : '2–4 days (Nationwide)';
  };

  const manualMethods = ['bkash_manual', 'nagad_manual', 'rocket', 'upay', 'cod', 'full_payment'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.union || !formData.subDistrict) {
        toast.error('Please fill in all required fields'); return;
      }
      if (manualMethods.includes(formData.paymentMethod)) {
        if (!formData.transactionId || !formData.senderLastDigits) {
          toast.error(formData.paymentMethod === 'cod' ? 'Pay delivery charge & enter TrxID' : 'Enter TrxID and sender digits'); return;
        }
        if (!/^[0-9]{4}$/.test(formData.senderLastDigits)) { toast.error('Sender last digits must be 4 numbers'); return; }
        if (formData.transactionId.trim().length < 6) { toast.error('Transaction ID is too short'); return; }
      }

      const orderData = {
        items: cartItems.map(item => ({
          product: item._id || item.id, name: item.name, price: item.price,
          quantity: item.quantity, image: item.image,
        })),
        shippingAddress: {
          name: formData.name, email: formData.email, phone: formData.phone,
          street: formData.address, union: formData.union, subDistrict: formData.subDistrict,
          district: formData.district, division: formData.division, city: formData.city,
          state: formData.city, postalCode: formData.postalCode,
          zipCode: formData.postalCode || '0000', country: 'Bangladesh',
        },
        paymentMethod: formData.paymentMethod,
        paymentDetails: manualMethods.includes(formData.paymentMethod)
          ? { transactionId: formData.transactionId, senderLastDigits: formData.senderLastDigits }
          : undefined,
        isGiftWrapped: giftWrapping,
        giftWrappingFee: giftWrapping ? giftWrappingFee : 0,
        giftMessage: formData.giftMessage,
        ...(couponInfo?.code && { couponCode: couponInfo.code }),
        ...(!isAuthenticated && { guestInfo: { name: formData.name, email: formData.email, phone: formData.phone } }),
      };

      const token = localStorage.getItem('token');
      const cfg = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.post('/api/orders', orderData, cfg);
      const newOrder = res.data;

      if (formData.email) localStorage.setItem('orderContact', JSON.stringify({ method: 'email', value: formData.email.trim() }));
      else if (formData.phone) localStorage.setItem('orderContact', JSON.stringify({ method: 'phone', value: formData.phone.trim() }));

      clearCart();

      const gatewayMethods = ['sslcommerz', 'bkash', 'nagad'];
      if (gatewayMethods.includes(formData.paymentMethod)) {
        try {
          const payRes = await axios.post('/api/payment/init', { orderId: newOrder._id || newOrder.order?._id }, cfg);
          if (payRes.data.url) { window.location.replace(payRes.data.url); return; }
        } catch { toast.error('Payment init failed. Check your orders.'); navigate('/orders'); return; }
      }

      toast.success(formData.paymentMethod === 'cod' ? 'Order placed! We will contact you soon.' : `Order placed! We'll confirm your payment shortly.`);

      setTimeout(() => {
        if (isAuthenticated) { navigate('/orders'); return; }
        const q = formData.email ? `?email=${encodeURIComponent(formData.email.trim())}` : formData.phone ? `?phone=${encodeURIComponent(formData.phone.trim())}` : '';
        navigate(`/track/${newOrder.orderId || newOrder._id}${q}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ─── empty cart ─── */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 rounded-3xl bg-maroon/10 dark:bg-maroon/20 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-maroon dark:text-pink-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Add items to your cart before checking out.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-maroon text-white font-bold rounded-2xl hover:bg-maroon-dark hover:scale-105 active:scale-95 transition-all shadow-lg shadow-maroon/20">
            <ArrowLeft className="h-4 w-4" /> {t('continue_shopping')}
          </Link>
        </div>
      </div>
    );
  }

  const shipping = delivery?.charge || 0;
  const total = Math.max(0, totalPrice + shipping + (giftWrapping ? giftWrappingFee : 0) - discount);

  /* ─── payment method label helper ─── */
  const pmLabel = {
    cod: 'Cash on Delivery',
    full_payment: 'Full Pre-payment',
    bkash_manual: 'bKash (Manual)',
    nagad_manual: 'Nagad (Manual)',
    rocket: 'Rocket',
    upay: 'Upay',
    bkash: 'bKash (Auto)',
    nagad: 'Nagad (Auto)',
    sslcommerz: 'SSLCommerz',
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-16 transition-colors">
      <Seo title="Checkout | RongRani" description="Secure checkout for your RongRani order." path="/checkout" />

      {/* ── Top Header Bar ── */}
      <div className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/cart" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-maroon dark:hover:text-pink-400 transition-colors text-sm font-bold">
            <ArrowLeft className="h-4 w-4" /> Back to Cart
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg overflow-hidden">
              <img src="/RongRani-Logo.png" alt="RongRani" className="w-full h-full object-contain" />
            </div>
            <span className="text-base font-black text-maroon dark:text-white tracking-tighter">Rong<span className="text-slate-700 dark:text-slate-200">Rani</span></span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <Shield className="h-3.5 w-3.5 text-green-500" /> Secure Checkout
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* ── Page Title ── */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            {t('checkout_title') || 'Complete Your Order'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} · ৳{totalPrice.toLocaleString()}
          </p>
        </div>

        {/* ── Step Indicator ── */}
        <Steps active={1} />

        {/* ── Guest Banner ── */}
        {!isAuthenticated && (
          <div className="max-w-2xl mx-auto mb-6 bg-gradient-to-r from-maroon to-rose-700 rounded-2xl p-4 shadow-xl text-white">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-yellow-300 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm">{t('become_member') || 'Log in for exclusive member perks!'}</p>
                <p className="text-white/75 text-xs mt-0.5">{t('or_continue_guest') || 'Or continue as guest below'}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link to="/login" state={{ from: '/checkout' }} className="bg-white text-maroon px-3 py-1.5 rounded-xl font-black text-xs hover:bg-cream-light transition-colors">
                  {t('login')}
                </Link>
                <Link to="/register" state={{ from: '/checkout' }} className="bg-yellow-400 text-slate-800 px-3 py-1.5 rounded-xl font-black text-xs hover:bg-yellow-300 transition-colors">
                  {t('register')}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── Main Two-Column Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 xl:gap-8 items-start">

          {/* ════════════════════════════════════════════
              LEFT — FORM
          ════════════════════════════════════════════ */}
          <div className="space-y-5">

            {/* ── Section: Contact ── */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="w-7 h-7 rounded-lg bg-maroon/10 dark:bg-maroon/20 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-maroon dark:text-pink-400" />
                </div>
                <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Contact Information</h2>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={t('full_name') || 'Full Name'} required>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputCls} placeholder={t('name_placeholder') || 'Your full name'} />
                </Field>
                <Field label={t('email_address') || 'Email'} required>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputCls} placeholder="you@example.com" />
                </Field>
                <Field label={t('phone_number') || 'Phone'} required hint="We'll call you to confirm your order">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">+88</span>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className={inputCls + ' pl-10'} placeholder="01XXXXXXXXX" />
                  </div>
                </Field>
                <Field label={t('gift_message') || 'Gift Message'} hint="Optional — appears on the gift card">
                  <input type="text" name="giftMessage" value={formData.giftMessage} onChange={handleChange} maxLength={200} className={inputCls} placeholder={t('gift_message_placeholder') || 'Write a message...'} />
                </Field>
              </div>
            </div>

            {/* ── Section: Shipping Address ── */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="w-7 h-7 rounded-lg bg-maroon/10 dark:bg-maroon/20 flex items-center justify-center">
                  <MapPin className="h-3.5 w-3.5 text-maroon dark:text-pink-400" />
                </div>
                <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">{t('shipping_info') || 'Delivery Address'}</h2>
              </div>
              <div className="p-5 space-y-4">
                <Field label={t('street_address') || 'Street Address'} required>
                  <textarea name="address" value={formData.address} onChange={handleChange} required rows={2} className={inputCls + ' resize-none'} placeholder={t('address_placeholder') || 'House no, road, area...'} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t('division') || 'Division'}>
                    <input type="text" name="division" value={formData.division} onChange={handleChange} className={inputCls} placeholder="Chattogram" />
                  </Field>
                  <Field label={t('district') || 'District'}>
                    <input type="text" name="district" value={formData.district} onChange={handleChange} className={inputCls} placeholder="Cox's Bazar" />
                  </Field>
                  <Field label={t('sub_district') || 'Sub-district / Upazila'} required>
                    <input type="text" name="subDistrict" value={formData.subDistrict} onChange={handleChange} required className={inputCls} placeholder="Sadar" />
                  </Field>
                  <Field label={t('union_ward') || 'Union / Ward'} required>
                    <input type="text" name="union" value={formData.union} onChange={handleChange} required className={inputCls} placeholder="Union name" />
                  </Field>
                  <Field label={t('city_label') || 'City / Town'} required>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required className={inputCls} placeholder="Dhaka" />
                  </Field>
                  <Field label={t('postal_code') || 'Postal Code'}>
                    <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className={inputCls} placeholder="1200" />
                  </Field>
                </div>

                {/* Delivery ETA badge */}
                {(formData.city || formData.district) && (
                  <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-3.5 py-2.5 mt-1">
                    <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-black text-emerald-700 dark:text-emerald-300">Estimated Delivery</p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{getEta()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Section: Payment ── */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="w-7 h-7 rounded-lg bg-maroon/10 dark:bg-maroon/20 flex items-center justify-center">
                  <CreditCard className="h-3.5 w-3.5 text-maroon dark:text-pink-400" />
                </div>
                <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">{t('payment_method') || 'Payment Method'}</h2>
              </div>
              <div className="p-5 space-y-4">

                {/* Primary options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay delivery charge in advance', badge: 'Most Popular' },
                    { value: 'full_payment', label: 'Full Pre-payment', desc: 'Pay total now, skip queue', badge: 'Recommended' },
                  ].map(({ value, label, desc, badge }) => (
                    <label key={value}
                      className={`relative flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === value
                        ? 'border-maroon bg-maroon/5 dark:bg-maroon/10'
                        : 'border-slate-200 dark:border-slate-700 hover:border-maroon/40'}`}
                    >
                      <input type="radio" name="paymentMethod" value={value} checked={formData.paymentMethod === value} onChange={handleChange} className="hidden" />
                      <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${formData.paymentMethod === value ? 'border-maroon' : 'border-slate-300 dark:border-slate-600'}`}>
                        {formData.paymentMethod === value && <div className="w-2.5 h-2.5 rounded-full bg-maroon" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-800 dark:text-white leading-tight">{label}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
                      </div>
                      {badge && (
                        <span className="absolute -top-2 right-3 bg-maroon text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {badge}
                        </span>
                      )}
                    </label>
                  ))}
                </div>

                {/* Manual mobile banking */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Manual Mobile Banking</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['bkash_manual', 'nagad_manual', 'rocket', 'upay'].map(m => (
                      <label key={m}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === m
                          ? 'border-maroon bg-maroon/5 dark:bg-maroon/10'
                          : 'border-slate-200 dark:border-slate-700 hover:border-maroon/30'}`}
                      >
                        <input type="radio" name="paymentMethod" value={m} checked={formData.paymentMethod === m} onChange={handleChange} className="hidden" />
                        <span className="text-xs font-black text-slate-700 dark:text-slate-200 capitalize">{m.replace('_manual', '')}</span>
                        {formData.paymentMethod === m && <CheckCircle className="h-3 w-3 text-maroon mt-1" />}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Gateway (coming soon) */}
                <div>
                  <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mb-2">Online Gateway (Coming Soon)</p>
                  <div className="grid grid-cols-3 gap-2 opacity-40 select-none">
                    {['bKash', 'Nagad', 'SSLCommerz'].map(m => (
                      <div key={m} className="flex items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 grayscale cursor-not-allowed">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COD warning */}
                {formData.paymentMethod === 'cod' && (
                  <div className="flex gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-4 animate-fade-in-up">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-black text-amber-800 dark:text-amber-300">{t('advance_delivery_charge_title') || 'Advance Delivery Charge Required'}</p>
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                        Pay <strong>৳{shipping || '?'}</strong> (delivery charge) in advance to confirm your order and prevent fake bookings.
                      </p>
                      <div className="mt-2.5 inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700 rounded-xl px-3 py-1.5">
                        <Phone className="h-3.5 w-3.5 text-amber-600" />
                        <span className="text-xs font-black text-amber-800 dark:text-amber-300 select-all">01851075537</span>
                        <span className="text-[10px] text-slate-400">(bKash / Nagad)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Full payment info */}
                {formData.paymentMethod === 'full_payment' && (
                  <div className="flex gap-3 bg-maroon/5 dark:bg-maroon/10 border border-maroon/20 dark:border-maroon/30 rounded-2xl p-4 animate-fade-in-up">
                    <BadgeCheck className="h-5 w-5 text-maroon dark:text-pink-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-black text-maroon dark:text-pink-400">{t('full_prepayment_title') || 'Full Pre-payment'}</p>
                      <p className="text-xs text-maroon/80 dark:text-pink-300 mt-1">
                        Pay the full amount <strong>৳{total.toFixed(0)}</strong> to confirm your order instantly.
                      </p>
                      <div className="mt-2.5 inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-maroon/20 dark:border-maroon/30 rounded-xl px-3 py-1.5">
                        <Phone className="h-3.5 w-3.5 text-maroon dark:text-pink-400" />
                        <span className="text-xs font-black text-maroon dark:text-pink-300 select-all">01851075537</span>
                        <span className="text-[10px] text-slate-400">(bKash / Nagad)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Transaction ID fields */}
                {manualMethods.includes(formData.paymentMethod) && (
                  <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3 animate-fade-in-up">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                      {formData.paymentMethod === 'cod'
                        ? `Enter TrxID for ৳${shipping || '?'} delivery charge payment`
                        : formData.paymentMethod === 'full_payment'
                          ? `Enter TrxID for ৳${total.toFixed(0)} full payment`
                          : 'Enter payment verification details'}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label={t('transaction_id') || 'Transaction ID'} required>
                        <input type="text" name="transactionId" value={formData.transactionId} onChange={handleChange} required
                          className="w-full bg-white dark:bg-slate-800 border-2 border-maroon/20 dark:border-maroon/30 rounded-xl px-3.5 py-2.5 text-sm font-black text-slate-800 dark:text-white focus:border-maroon focus:ring-4 focus:ring-maroon/10 outline-none transition-all uppercase placeholder:text-slate-300 tracking-widest"
                          placeholder="8A7B6C5D" />
                      </Field>
                      <Field label={t('sender_number_last_4') || 'Sender Last 4 Digits'} required>
                        <input type="text" name="senderLastDigits" value={formData.senderLastDigits} onChange={handleChange} required maxLength={4}
                          className="w-full bg-white dark:bg-slate-800 border-2 border-maroon/20 dark:border-maroon/30 rounded-xl px-3.5 py-2.5 text-sm font-black text-slate-800 dark:text-white focus:border-maroon focus:ring-4 focus:ring-maroon/10 outline-none transition-all placeholder:text-slate-300 tracking-widest"
                          placeholder="2383" />
                      </Field>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Mobile-only submit button ── */}
            <div className="lg:hidden">
              <button type="button" onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-maroon hover:bg-maroon-dark text-white font-black rounded-2xl shadow-xl shadow-maroon/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
              >
                {loading
                  ? <><Loader className="h-5 w-5 animate-spin" /> Placing Order...</>
                  : <>Place Order · ৳{total.toFixed(0)} <ChevronRight className="h-5 w-5" /></>}
              </button>
            </div>
          </div>

          {/* ════════════════════════════════════════════
              RIGHT — ORDER SUMMARY (STICKY)
          ════════════════════════════════════════════ */}
          <div className="space-y-4 lg:sticky lg:top-20">

            {/* Cart items card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="w-7 h-7 rounded-lg bg-maroon/10 dark:bg-maroon/20 flex items-center justify-center">
                  <ShoppingBag className="h-3.5 w-3.5 text-maroon dark:text-pink-400" />
                </div>
                <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">{t('order_summary') || 'Order Summary'}</h2>
                <span className="ml-auto bg-maroon text-white text-[9px] font-black px-2 py-0.5 rounded-full">{cartItems.length}</span>
              </div>
              <div className="p-4 space-y-3 max-h-56 overflow-y-auto custom-scrollbar">
                {cartItems.map(item => (
                  <div key={item.id || item._id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0 border border-slate-100 dark:border-slate-600">
                      <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-800 dark:text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-black text-maroon dark:text-pink-400 shrink-0">৳{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-maroon dark:text-pink-400" />
                <p className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">{t('apply_coupon') || 'Coupon Code'}</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                  placeholder="e.g. WELCOME10"
                  disabled={!!couponInfo}
                  className={inputCls + ' flex-1 uppercase text-xs'}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || (!couponCode.trim() && !couponInfo)}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow active:scale-95 disabled:opacity-50 ${couponInfo ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-maroon hover:bg-maroon-dark text-white'}`}
                >
                  {couponLoading ? <Loader className="h-4 w-4 animate-spin" /> : couponInfo ? t('remove') : t('apply')}
                </button>
              </div>
              {couponInfo && (
                <div className="mt-2.5 flex items-center gap-2 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <p className="text-xs font-bold">"{couponInfo.code}" — Saved ৳{discount.toFixed(0)}</p>
                </div>
              )}
            </div>

            {/* Price breakdown card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 space-y-2.5">
              {[
                { label: t('subtotal') || 'Subtotal', value: `৳${totalPrice.toLocaleString()}` },
                {
                  label: t('shipping_charge') || 'Shipping',
                  value: deliveryLoading
                    ? <span className="flex items-center gap-1 text-slate-400"><Loader className="h-3 w-3 animate-spin" /> Calculating</span>
                    : !formData.district && !formData.city
                      ? <span className="text-slate-400 text-[11px] italic">Enter address</span>
                      : shipping === 0 ? <span className="text-emerald-600 font-black">Free</span> : `৳${shipping}`,
                  accent: shipping === 0 && !deliveryLoading,
                },
                ...(giftWrapping ? [{ label: `🎁 ${t('gift_wrapping') || 'Gift Wrapping'}`, value: `৳${giftWrappingFee}`, accent: false }] : []),
                ...(discount > 0 ? [{ label: t('discount_label') || 'Discount', value: `-৳${discount.toFixed(0)}`, negative: true }] : []),
              ].map(({ label, value, negative }, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">{label}</span>
                  <span className={`font-bold ${negative ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>{value}</span>
                </div>
              ))}

              {delivery?.label && (
                <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">{delivery.label}</p>
              )}

              <div className="border-t border-slate-100 dark:border-slate-700 pt-3 mt-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-800 dark:text-white">{t('total') || 'Total'}</span>
                  <span className="text-xl font-black text-maroon dark:text-pink-400">৳{total.toFixed(0)}</span>
                </div>
                {formData.paymentMethod && (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                    via {pmLabel[formData.paymentMethod] || formData.paymentMethod}
                  </p>
                )}
              </div>
            </div>

            {/* Desktop submit button */}
            <form onSubmit={handleSubmit} className="hidden lg:block">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-maroon hover:bg-maroon-dark text-white font-black rounded-2xl shadow-xl shadow-maroon/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
              >
                {loading
                  ? <><Loader className="h-5 w-5 animate-spin" /> Placing Order...</>
                  : <>Place Order · ৳{total.toFixed(0)} <ChevronRight className="h-5 w-5" /></>}
              </button>
            </form>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Shield, label: 'Secure Order' },
                { icon: Truck, label: 'Fast Delivery' },
                { icon: BadgeCheck, label: 'Verified' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                  <Icon className="h-4 w-4 text-maroon dark:text-pink-400" />
                  <p className="text-[9px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-[10px] text-slate-400 dark:text-slate-500">
              By placing your order you agree to our{' '}
              <Link to="/privacy-policy" className="underline hover:text-maroon dark:hover:text-pink-400 transition-colors">Privacy Policy</Link>
              {' '}and{' '}
              <Link to="/terms" className="underline hover:text-maroon dark:hover:text-pink-400 transition-colors">Terms of Service</Link>.
            </p>
          </div>
        </div>

        {/* Mobile form submit — attached to form via JS */}
        <form onSubmit={handleSubmit} className="lg:hidden hidden" />
      </div>
    </div>
  );
};

export default Checkout;
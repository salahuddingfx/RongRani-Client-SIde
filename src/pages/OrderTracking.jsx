import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, MapPin, Calendar, DollarSign, ArrowLeft, Phone, Mail, Download, Search, Heart, CircleX, Clock, ClipboardCheck, Truck as DeliveryTruck, MessageCircle } from 'lucide-react';
import { FaFacebook } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';
import { useSocket } from '../contexts/socketContextBase';
import ReviewForm from '../components/ReviewForm';
import Breadcrumb from '../components/Breadcrumb';

const STATUS_RANK = { pending: 0, confirmed: 1, processing: 2, shipped: 3, out_for_delivery: 4, delivered: 5 };

const OrderTracking = () => {
  const { t } = useLanguage();

  const STEPS = [
    { key: 'pending', label: t('step_order_placed') || 'Order Placed', icon: Package, desc: t('step_order_placed_desc') || 'Your order has been received' },
    { key: 'confirmed', label: t('step_confirmed') || 'Confirmed', icon: ClipboardCheck, desc: t('step_confirmed_desc') || 'Order confirmed by seller' },
    { key: 'processing', label: t('step_processing') || 'Processing', icon: Package, desc: t('step_processing_desc') || 'Preparing your order' },
    { key: 'shipped', label: t('step_shipped') || 'Shipped', icon: Truck, desc: t('step_shipped_desc') || 'Handed over to courier' },
    { key: 'out_for_delivery', label: t('step_out_for_delivery') || 'Out for Delivery', icon: DeliveryTruck, desc: t('step_out_for_delivery_desc') || 'On the way to you' },
    { key: 'delivered', label: t('step_delivered') || 'Delivered', icon: CheckCircle, desc: t('step_delivered_desc') || 'Delivered successfully' },
  ];
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingInput, setTrackingInput] = useState(orderId || '');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [error, setError] = useState('');
  const { socket } = useSocket();
  const [reviewingProductId, setReviewingProductId] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });

  const getImageUrl = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.url) return value.url;
    return '';
  };

  useEffect(() => {
    if (!socket || !order) return;
    const handleUpdate = (updatedOrder) => {
      if (updatedOrder._id === order._id) setOrder(prev => ({ ...prev, ...updatedOrder }));
    };
    const handleCourier = (data) => {
      if (data._id === order._id) fetchOrder(order._id, contactEmail, contactPhone);
    };
    socket.on('order:updated', handleUpdate);
    socket.on('order:sent-to-courier', handleCourier);
    return () => { socket.off('order:updated', handleUpdate); socket.off('order:sent-to-courier', handleCourier); };
  }, [socket, order?._id, contactEmail, contactPhone]);

  useEffect(() => {
    if (!order) return;
    const orderStatus = order.orderStatus || order.status;
    if (orderStatus === 'delivered' || orderStatus === 'cancelled' || orderStatus === 'returned') return;

    const calcCountdown = () => {
      const estimatedDate = new Date(order.deliveredAt || new Date(new Date(order.createdAt).getTime() + 4 * 24 * 60 * 60 * 1000));
      const now = new Date();
      const diff = estimatedDate - now;
      const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
      const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
      setCountdown({ days, hours, minutes });
    };

    calcCountdown();
    const interval = setInterval(calcCountdown, 60000);
    return () => clearInterval(interval);
  }, [order?.createdAt, order?.deliveredAt, order?.orderStatus, order?.status]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    const phoneParam = params.get('phone');
    const savedContact = localStorage.getItem('orderContact');
    let savedEmail = '';
    let savedPhone = '';
    if (savedContact) {
      try {
        const parsed = JSON.parse(savedContact);
        if (parsed?.method === 'email') savedEmail = parsed.value || '';
        if (parsed?.method === 'phone') savedPhone = parsed.value || '';
      } catch (_) {}
    }
    if (emailParam) setContactEmail(emailParam);
    if (phoneParam) setContactPhone(phoneParam);
    if (!emailParam && savedEmail) setContactEmail(savedEmail);
    if (!phoneParam && savedPhone) setContactPhone(savedPhone);
    if (orderId) fetchOrder(orderId, emailParam || savedEmail, phoneParam || savedPhone);
    else setLoading(false);
  }, [orderId, location.search]);

  const fetchOrder = async (id, email, phone) => {
    try {
      setError('');
      const res = await axios.get(`/api/orders/track/${id}`, { params: { email: email || undefined, phone: phone || undefined } });
      setOrder(res.data);
    } catch (err) {
      setOrder(null);
      setError(err.response?.data?.message || (t('unable_to_track') || 'Unable to track this order'));
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    if (contactEmail.trim()) localStorage.setItem('orderContact', JSON.stringify({ method: 'email', value: contactEmail.trim() }));
    else if (contactPhone.trim()) localStorage.setItem('orderContact', JSON.stringify({ method: 'phone', value: contactPhone.trim() }));
    const params = new URLSearchParams();
    if (contactEmail.trim()) params.set('email', contactEmail.trim());
    if (contactPhone.trim()) params.set('phone', contactPhone.trim());
    const query = params.toString();
    navigate(`/track/${trackingInput.trim()}${query ? `?${query}` : ''}`);
  };

  const handleDownloadInvoice = async (e) => {
    e.preventDefault();
    if (!order?._id) return;
    try {
      setDownloading(true);
      const res = await axios.get(`/api/orders/${order._id}/invoice`, {
        params: { email: contactEmail || undefined, phone: contactPhone || undefined },
        responseType: 'blob', headers: { Accept: 'application/pdf' }
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${order.orderId || order._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(t('invoice_downloaded') || 'Invoice downloaded successfully', { id: 'download-success' });
    } catch (err) {
      console.error('Download failed:', err);
      toast.error(t('invoice_download_failed') || 'Failed to download invoice. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const getStepTimestamp = (stepKey, orderData) => {
    if (stepKey === 'pending') return orderData.createdAt;
    if (stepKey === 'shipped') return orderData.courierInfo?.sentAt || null;
    if (stepKey === 'delivered') return orderData.deliveredAt || null;
    return null;
  };

  const isCancelled = order?.orderStatus === 'cancelled' || order?.orderStatus === 'returned';
  const currentRank = isCancelled ? -1 : (STATUS_RANK[order?.orderStatus] ?? -1);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return { bg: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', light: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800' };
      case 'confirmed': return { bg: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', light: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' };
      case 'processing': return { bg: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400', light: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-200 dark:border-indigo-800' };
      case 'shipped': return { bg: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400', light: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800' };
      case 'out_for_delivery': return { bg: 'bg-cyan-500', text: 'text-cyan-600 dark:text-cyan-400', light: 'bg-cyan-50 dark:bg-cyan-900/20', border: 'border-cyan-200 dark:border-cyan-800' };
      case 'delivered': return { bg: 'bg-green-500', text: 'text-green-600 dark:text-green-400', light: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' };
      case 'cancelled': return { bg: 'bg-red-500', text: 'text-red-600 dark:text-red-400', light: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800' };
      case 'returned': return { bg: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400', light: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800' };
      default: return { bg: 'bg-slate-400', text: 'text-slate-500', light: 'bg-slate-50 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700' };
    }
  };

  const statusStyle = getStatusStyle(order?.orderStatus);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 flex items-center justify-center py-8 px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-8 text-center">
            <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('track_order') || 'Track Order'}</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">{t('track_order_desc') || 'Track your order using order number and contact information'}</p>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-xl mb-6 text-sm">{error}</div>
            )}
            <form onSubmit={handleTrack} className="space-y-4">
              <input type="text" value={trackingInput} onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Enter Order ID"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-maroon/40" required />
              <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Email used in order"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-maroon/40" />
              <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Phone used in order"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-maroon/40" />
              <button type="submit" className="w-full bg-maroon text-white font-semibold py-3 px-6 rounded-xl hover:bg-maroon/90 transition-colors">
                {t('track_order') || 'Track Order'}
              </button>
            </form>
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
              <Link to="/" className="text-maroon font-semibold hover:underline inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> {t('back_to_home') || 'Back to Home'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const contactInfo = order.user || order.guestInfo || {};
  const shipping = order.shippingAddress || {};
  const estimatedDelivery = order.deliveredAt || new Date(new Date(order.createdAt).getTime() + 4 * 24 * 60 * 60 * 1000).toISOString();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 py-8 px-4">
      <Breadcrumb items={[{ label: t('track_order') || 'Track Order' }]} />
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {t('order') || 'Order'} #{order.orderId || order._id}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              {t('placed_on') || 'Placed on'} {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleDownloadInvoice} disabled={downloading}
              className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50">
              {downloading ? <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> : <Download className="h-4 w-4" />}
              {downloading ? (t('downloading') || 'Downloading...') : (t('download_invoice') || 'Download Invoice')}
            </button>
            <a href="tel:+8801851075537" className="flex items-center justify-center gap-2 bg-maroon text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-maroon/90 transition-colors">
              <Phone className="h-4 w-4" /> {t('need_help') || 'Need Help?'}
            </a>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="flex gap-2 mb-6">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(`Check out my order #${order.orderId || order._id} on RongRani! 🛍️`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <FaFacebook className="h-4 w-4" />
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Check out my order #${order.orderId || order._id} on RongRani! 🛍️ ${window.location.href}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>

        {/* Progress Stepper */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 mb-6">
          {isCancelled ? (
            <div className="flex items-center gap-4 py-4">
              <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <CircleX className="h-7 w-7 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 capitalize">
                  {order.orderStatus === 'cancelled' ? (t('order_cancelled') || 'Order Cancelled') : (t('order_returned') || 'Order Returned')}
                </h3>
                {order.cancelledReason && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{order.cancelledReason}</p>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Desktop horizontal stepper */}
              <div className="hidden sm:flex items-start justify-between relative">
                {STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentRank;
                  const isCurrent = idx === currentRank;
                  const StepIcon = step.icon;
                  const ts = getStepTimestamp(step.key, order);

                  return (
                    <div key={step.key} className="flex-1 flex flex-col items-center relative">
                      {/* Connector line */}
                      {idx > 0 && (
                        <div className={`absolute top-5 right-1/2 w-full h-0.5 -z-0 transition-colors duration-300 ${idx <= currentRank ? 'bg-maroon' : 'bg-slate-200 dark:bg-slate-700'}`} />
                      )}
                      {/* Circle */}
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                        ${isCompleted ? 'bg-maroon text-white shadow-lg shadow-maroon/25' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'}
                        ${isCurrent ? 'ring-4 ring-maroon/20 scale-110 animate-pulse' : ''}`}>
                        <StepIcon className="h-5 w-5" />
                        {isCurrent && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-slate-800"></span>}
                      </div>
                      {/* Label */}
                      <p className={`mt-2.5 text-xs font-semibold text-center leading-tight ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                        {step.label}
                      </p>
                      <p className={`text-[10px] text-center mt-0.5 leading-tight hidden lg:block ${isCompleted ? 'text-slate-500 dark:text-slate-400' : 'text-slate-300 dark:text-slate-600'}`}>
                        {step.desc}
                      </p>
                      {ts && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 text-center">
                          {new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                           {isCurrent && <span className="block text-maroon font-medium">{t('in_progress') || 'In Progress'}</span>}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Mobile vertical stepper */}
              <div className="sm:hidden space-y-0">
                {STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentRank;
                  const isCurrent = idx === currentRank;
                  const StepIcon = step.icon;
                  const ts = getStepTimestamp(step.key, order);
                  const isLast = idx === STEPS.length - 1;

                  return (
                    <div key={step.key} className="flex gap-3">
                      {/* Left: icon + line */}
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 relative
                          ${isCompleted ? 'bg-maroon text-white shadow-lg shadow-maroon/25' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}
                          ${isCurrent ? 'ring-4 ring-maroon/20' : ''}`}>
                          <StepIcon className="h-4 w-4" />
                          {isCurrent && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white dark:border-slate-800"></span>}
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 flex-1 min-h-[28px] transition-colors duration-300 ${idx < currentRank ? 'bg-maroon' : 'bg-slate-200 dark:bg-slate-700'}`} />
                        )}
                      </div>
                      {/* Right: text */}
                      <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
                        <p className={`text-sm font-semibold ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                          {step.label}
                        </p>
                        <p className={`text-xs mt-0.5 ${isCompleted ? 'text-slate-500 dark:text-slate-400' : 'text-slate-300 dark:text-slate-600'}`}>
                          {step.desc}
                        </p>
                        {ts && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            {new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            {isCurrent && <span className="ml-2 text-maroon font-medium">{t('in_progress') || 'In Progress'}</span>}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status badge */}
              <div className="flex items-center justify-between mt-4 sm:mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyle.light} ${statusStyle.text} ${statusStyle.border} border`}>
                  <span className={`w-2 h-2 rounded-full ${statusStyle.bg}`}></span>
                  <span className="capitalize">{order.orderStatus}</span>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {t('last_updated') || 'Last updated'}: {new Date(order.updatedAt || order.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* What's Next */}
            {!isCancelled && currentRank < 5 && (
              <div className="bg-gradient-to-r from-maroon/5 to-maroon/10 dark:from-maroon/10 dark:to-maroon/5 rounded-2xl border border-maroon/15 dark:border-maroon/20 p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-maroon/10 dark:bg-maroon/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-maroon" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{t('whats_next') || "What's Next?"}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {currentRank === 0 && (t('whats_next_0') || "Your order is being reviewed. You'll receive a confirmation shortly.")}
                      {currentRank === 1 && (t('whats_next_1') || "Your order is confirmed and will be prepared for shipping soon.")}
                      {currentRank === 2 && (t('whats_next_2') || "Your order is being prepared. It will be handed over to the courier soon.")}
                      {currentRank === 3 && (t('whats_next_3') || "Your order is on its way! Track it on the courier website for real-time updates.")}
                      {currentRank === 4 && (t('whats_next_4') || "Your order is out for delivery today. Please keep your phone handy.")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Timeline */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-400" />
                <span>{t('order_timeline') || 'Order Timeline'}</span>
              </h2>
              <div className="space-y-0">
                {[
                  { label: t('timeline_order_placed') || 'Order Placed', time: order.createdAt, show: true },
                  { label: t('timeline_processing') || 'Processing Started', time: order.updatedAt, show: currentRank >= 2 },
                  { label: t('timeline_shipped') || 'Shipped to Courier', time: order.courierInfo?.sentAt, show: currentRank >= 3 && order.courierInfo?.sentAt },
                  { label: t('timeline_delivered') || 'Delivered', time: order.deliveredAt, show: currentRank >= 5 && order.deliveredAt },
                ].filter(e => e.show).map((event, idx, arr) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-maroon mt-1.5 flex-shrink-0"></div>
                      {idx < arr.length - 1 && <div className="w-px flex-1 bg-slate-200 dark:bg-slate-700 my-1"></div>}
                    </div>
                    <div className={`pb-4 ${idx === arr.length - 1 ? 'pb-0' : ''}`}>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{event.label}</p>
                      {event.time && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                          {new Date(event.time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Contents */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-slate-400" />
                <span>{t('package_contents') || 'Package Contents'}</span>
                <span className="text-sm font-normal text-slate-400 ml-auto">{order.items.length} items</span>
              </h2>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-700">
                      <img
                        src={getImageUrl(item.image) || getImageUrl(item.product?.images?.[0]) || 'https://via.placeholder.com/100'}
                        alt={item.name || item.product?.name || 'Product'}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product?.slug || item.product?._id || item.product}`}
                        className="font-semibold text-slate-900 dark:text-white hover:text-maroon transition-colors line-clamp-1 block text-sm">
                        {item.product?.name || item.name}
                      </Link>
                      {(item.product?.sku || item.sku) && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          SKU: <span className="font-medium text-slate-500">{item.product?.sku || item.sku}</span>
                        </p>
                      )}
                      <p className="text-slate-500 text-sm mt-0.5">
                        {t('qty_label') || 'Qty'}: <span className="font-medium text-slate-700 dark:text-slate-300">{item.quantity}</span>
                      </p>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-0.5">
                      <p className="font-bold text-maroon">৳{(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-xs text-slate-400">৳{item.price.toLocaleString()} / unit</p>
                    </div>
                    {order.orderStatus === 'delivered' && (
                      <button onClick={() => setReviewingProductId(item.product?._id || item.product)}
                        className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-sm font-semibold text-maroon border border-maroon/20 hover:bg-maroon hover:text-white px-3 py-1.5 rounded-xl transition-colors">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>{t('review') || 'Review'}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {/* Customer Details */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-slate-400" />
                {t('customer_details') || 'Customer Details'}
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{t('phone') || 'Phone'}</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{contactInfo.phone || shipping.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{t('email') || 'Email'}</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{contactInfo.email || shipping.email || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                {t('delivery_address') || 'Delivery Address'}
              </h2>
              <div className="pl-3 border-l-2 border-dashed border-slate-200 dark:border-slate-600">
                <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{shipping.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {shipping.street && <span className="block">{shipping.street}</span>}
                  {shipping.subDistrict && <span>{shipping.subDistrict}, </span>}
                  {shipping.district && <span>{shipping.district}</span>}
                  {shipping.city && <span>{shipping.city}</span>}
                  <br />
                  {shipping.country && (
                    <span className="text-xs font-medium bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg text-slate-500 mt-1 inline-block">
                      {shipping.country}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-400">{t('estimated_delivery') || 'Estimated Delivery'}</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {order.deliveredAt
                  ? new Date(order.deliveredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : new Date(estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                }
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">{t('courier_partner') || 'Courier Partner'}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg">
                  {order.courierInfo?.courierName || 'Steadfast'}
                </span>
              </div>
            </div>

            {/* Delivery Countdown Timer */}
            {!isCancelled && (order?.orderStatus || order?.status) !== 'delivered' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-maroon" />
                  <span className="text-xs font-medium text-slate-400">Time Remaining</span>
                </div>
                <div className="flex gap-3 justify-center">
                  {[
                    { value: countdown.days, label: 'Days' },
                    { value: countdown.hours, label: 'Hours' },
                    { value: countdown.minutes, label: 'Min' },
                  ].map((unit) => (
                    <div key={unit.label} className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-xl bg-maroon/10 dark:bg-maroon/20 border border-maroon/15 flex items-center justify-center">
                        <span className="text-2xl font-bold text-maroon">{unit.value}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1.5">{unit.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Courier Tracking */}
            {order.courierInfo?.trackingCode && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-slate-400" />
                  {t('courier_tracking') || 'Courier Tracking'}
                </h2>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-500">{t('tracking_number') || 'Tracking Number'}</span>
                      <span className="font-mono text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg">{order.courierInfo.trackingCode}</span>
                    </div>
                    {order.courierInfo.consignmentId && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-500">{t('consignment_id') || 'Consignment ID'}</span>
                        <span className="font-mono text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg">{order.courierInfo.consignmentId}</span>
                      </div>
                    )}
                  </div>
                  <a href={`https://steadfast.com.bd/t/${order.courierInfo.trackingCode}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full bg-maroon text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-maroon/90 transition-colors flex items-center justify-center gap-2 text-sm">
                    <Truck className="h-4 w-4" />
                    {t('track_on_courier') || 'Track on Courier Website'}
                  </a>
                </div>
              </div>
            )}

            {/* Payment Summary */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-slate-400" />
                {t('payment_summary') || 'Payment Summary'}
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">{t('method') || 'Method'}</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm uppercase flex items-center gap-1.5">
                    {order.paymentMethod === 'cod' ? (t('cash_on_delivery') || 'Cash On Delivery') : order.paymentMethod}
                    {order.paymentMethod === 'cod' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">{t('status') || 'Status'}</span>
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold uppercase ${order.paymentStatus === 'paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="pt-3 mt-1 border-t border-slate-100 dark:border-slate-700 flex justify-between items-end">
                  <span className="text-sm font-semibold text-slate-400">{t('total_amount') || 'Total Amount'}</span>
                  <span className="text-xl font-bold text-maroon">৳{order.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom links */}
        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 font-semibold hover:text-maroon transition-colors inline-flex items-center gap-1.5 text-sm">
              <ArrowLeft className="h-4 w-4" /> {t('back_to_orders') || 'Back to Orders'}
            </Link>
            <Link to="/quick-track" className="text-slate-500 dark:text-slate-400 font-semibold hover:text-maroon transition-colors inline-flex items-center gap-1.5 text-sm">
              <Search className="h-4 w-4" /> {t('search_other_orders') || 'Search Other Orders'}
            </Link>
            <Link to="/" className="text-slate-500 dark:text-slate-400 font-semibold hover:text-maroon transition-colors text-sm">
              {t('back_to_home') || 'Back to Home'}
            </Link>
          </div>
        </div>
      </div>

      {reviewingProductId && (
        <ReviewForm
          productId={reviewingProductId}
          initialGuestEmail={contactEmail || order.guestInfo?.email}
          initialOrderId={order._id}
          onClose={() => setReviewingProductId(null)}
          onCancel={() => setReviewingProductId(null)}
          onSuccess={() => setReviewingProductId(null)}
          onReviewSubmitted={() => {
            toast.success(t('thank_you_review') || 'Thank you for your review!', {
              icon: <Heart className="w-4 h-4" />,
              style: { borderRadius: '10px', background: '#FFF0F5', color: '#BE123C' }
            });
          }}
        />
      )}
    </div>
  );
};

export default OrderTracking;

import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, MapPin, Calendar, DollarSign, ArrowLeft, Phone, Mail, Download, Search, Heart } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';

import { useSocket } from '../contexts/socketContextBase';
import ReviewForm from '../components/ReviewForm';
import Breadcrumb from '../components/Breadcrumb';

const OrderTracking = () => {
  const { t } = useLanguage();
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

  const getImageUrl = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.url) return value.url;
    return '';
  };

  useEffect(() => {
    if (!socket || !order) return;

    socket.on('order:updated', (updatedOrder) => {
      if (updatedOrder._id === order._id) {
        setOrder(prev => ({ ...prev, ...updatedOrder }));
      }
    });

    socket.on('order:sent-to-courier', (data) => {
      if (data._id === order._id) {
        fetchOrder(order._id, contactEmail, contactPhone);
      }
    });

    return () => {
      socket.off('order:updated');
      socket.off('order:sent-to-courier');
    };
  }, [socket, order, contactEmail, contactPhone]);

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
      } catch (err) {
        console.warn('Failed to parse saved order contact', err);
      }
    }

    if (emailParam) setContactEmail(emailParam);
    if (phoneParam) setContactPhone(phoneParam);
    if (!emailParam && savedEmail) setContactEmail(savedEmail);
    if (!phoneParam && savedPhone) setContactPhone(savedPhone);

    if (orderId) {
      fetchOrder(orderId, emailParam || savedEmail, phoneParam || savedPhone);
    } else {
      setLoading(false);
    }
  }, [orderId, location.search]);

  const fetchOrder = async (id, email, phone) => {
    try {
      setError('');
      const response = await axios.get(`/api/orders/track/${id}`, {
        params: {
          email: email || undefined,
          phone: phone || undefined,
        },
      });
      setOrder(response.data);
    } catch (err) {
      setOrder(null);
      const message = err.response?.data?.message || 'Unable to track this order';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;

    if (contactEmail.trim()) {
      localStorage.setItem('orderContact', JSON.stringify({
        method: 'email',
        value: contactEmail.trim(),
      }));
    } else if (contactPhone.trim()) {
      localStorage.setItem('orderContact', JSON.stringify({
        method: 'phone',
        value: contactPhone.trim(),
      }));
    }

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
      const response = await axios.get(`/api/orders/${order._id}/invoice`, {
        params: {
          email: contactEmail || undefined,
          phone: contactPhone || undefined,
        },
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${order.orderId || order._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Invoice downloaded successfully', { id: 'download-success' });
    } catch (err) {
      console.error('Download failed:', err);
      toast.error('Failed to download invoice. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'processing': return 'bg-indigo-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-slate-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
      case 'confirmed': return <Package className="h-7 w-7" />;
      case 'processing': return <Package className="h-7 w-7" />;
      case 'shipped': return <Truck className="h-7 w-7" />;
      case 'delivered': return <CheckCircle className="h-7 w-7" />;
      default: return <Package className="h-7 w-7" />;
    }
  };

  const buildTrackingHistory = (orderData) => {
    const statusRank = {
      pending: 1,
      processing: 2,
      shipped: 3,
      delivered: 4,
      cancelled: 0,
      returned: 0,
    };

    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentRank = statusRank[orderData.orderStatus] || 1;

    return steps.map((status) => {
      const completed = statusRank[status] <= currentRank && currentRank > 0;
      let timestamp = null;

      if (status === 'pending') timestamp = orderData.createdAt;
      if (status === 'shipped') timestamp = orderData.courierInfo?.sentAt || null;
      if (status === 'delivered') timestamp = orderData.deliveredAt || null;

      return {
        status,
        message:
          status === 'pending' ? 'Order placed successfully' :
            status === 'processing' ? 'Preparing your order' :
              status === 'shipped' ? 'Handed over to courier' :
                'Delivered successfully',
        timestamp,
        completed,
      };
    });
  };

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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Track Order</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">Track your order using order number and contact information</p>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleTrack} className="space-y-4">
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Enter Order ID"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-maroon/40"
                required
              />
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Email used in order"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-maroon/40"
              />
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Phone used in order"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-maroon/40"
              />
              <button type="submit" className="w-full bg-maroon text-white font-semibold py-3 px-6 rounded-xl hover:bg-maroon/90 transition-colors">
                Track Order
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
              <Link to="/" className="text-maroon font-semibold hover:underline inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const contactInfo = order.user || order.guestInfo || {};
  const shipping = order.shippingAddress || {};
  const trackingHistory = buildTrackingHistory(order);
  const lastUpdated = trackingHistory.filter(h => h.timestamp).pop()?.timestamp || order.createdAt;
  const estimatedDelivery = order.deliveredAt || new Date(new Date(order.createdAt).getTime() + 4 * 24 * 60 * 60 * 1000).toISOString();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 py-8 px-4">
      <Breadcrumb items={[{ label: 'Track Order' }]} />
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Order #{order.orderId || order._id}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${getStatusColor(order.orderStatus)}`}></span>
              Status: {order.orderStatus}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownloadInvoice}
              disabled={downloading}
              className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading ? (
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {downloading ? 'Downloading...' : 'Download Invoice'}
            </button>

            <a href="tel:+8801851075537" className="flex items-center justify-center gap-2 bg-maroon text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-maroon/90 transition-colors">
              <Phone className="h-4 w-4" />
              Need Help?
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
              <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Status Timeline</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Last updated: {new Date(lastUpdated).toLocaleString()}</p>
                </div>
                <div className={`${getStatusColor(order.orderStatus)} text-white px-4 py-1.5 rounded-full font-semibold text-sm uppercase tracking-wide`}>
                  {order.orderStatus}
                </div>
              </div>

              <div className="relative pl-4 space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-700">
                {trackingHistory.map((history, index) => {
                  const isActive = history.completed;
                  const isCurrent = history.status === order.orderStatus;

                  return (
                    <div key={index} className={`relative flex items-start ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                      <div className={`
                        relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                        ${isActive ? 'bg-maroon border-maroon text-white' : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-400'}
                        ${isCurrent ? 'ring-4 ring-maroon/20' : ''}
                      `}>
                        {isActive ? (
                          <div className="scale-75">{getStatusIcon(history.status)}</div>
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-500"></div>
                        )}
                      </div>

                      <div className="ml-4 pt-1.5">
                        <h3 className={`text-sm font-bold ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                          {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                        </h3>
                        <p className={`text-sm mt-0.5 ${isActive ? 'text-slate-600 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500'}`}>
                          {history.message}
                        </p>
                        {history.timestamp && (
                          <span className="inline-block mt-1.5 text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg">
                            {new Date(history.timestamp).toLocaleString('en-US', {
                              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-slate-400" />
                <span>Package Contents</span>
                <span className="text-sm font-normal text-slate-400 ml-auto">{order.items.length} items</span>
              </h2>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(item.product?.images?.[0]) || getImageUrl(item.image) || 'https://via.placeholder.com/100'}
                        alt={item.name || item.product?.name || 'Product'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product?.slug || item.product?._id || item.product}`} className="font-semibold text-slate-900 dark:text-white hover:text-maroon transition-colors line-clamp-1 block text-sm">
                        {item.product?.name || item.name}
                      </Link>
                      {(item.product?.sku || item.sku) && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          SKU: <span className="font-medium text-slate-500">{item.product?.sku || item.sku}</span>
                        </p>
                      )}
                      <p className="text-slate-500 text-sm mt-0.5">Qty: <span className="font-medium text-slate-700 dark:text-slate-300">{item.quantity}</span></p>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-0.5">
                      <p className="font-bold text-maroon">৳{(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-xs text-slate-400">৳{item.price.toLocaleString()} / unit</p>
                    </div>

                    {order.orderStatus === 'delivered' && (
                      <button
                        onClick={() => setReviewingProductId(item.product?._id || item.product)}
                        className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-sm font-semibold text-maroon border border-maroon/20 hover:bg-maroon hover:text-white px-3 py-1.5 rounded-xl transition-colors"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Review</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-slate-400" />
                Customer Details
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Phone</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{contactInfo.phone || shipping.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Email</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{contactInfo.email || shipping.email || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                Delivery Address
              </h2>
              <div className="pl-3 border-l-2 border-dashed border-slate-200 dark:border-slate-600">
                <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{shipping.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {shipping.street && <span className="block">{shipping.street}</span>}
                  {shipping.subDistrict && <span>{shipping.subDistrict}, </span>}
                  {shipping.district} - {shipping.postalCode}
                  <br />
                  <span className="text-xs font-medium bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg text-slate-500 mt-1 inline-block">
                    {shipping.country}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-400">Estimated Delivery</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {new Date(estimatedDelivery).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                })}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Courier Partner</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg">Steadfast</span>
              </div>
            </div>

            {order.courierInfo?.trackingCode && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-slate-400" />
                  Courier Tracking
                </h2>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-500">Tracking Number</span>
                      <span className="font-mono text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg">{order.courierInfo.trackingCode}</span>
                    </div>
                    {order.courierInfo.consignmentId && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-500">Consignment ID</span>
                        <span className="font-mono text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg">{order.courierInfo.consignmentId}</span>
                      </div>
                    )}
                  </div>
                  <a
                    href={`https://steadfast.com.bd/t/${order.courierInfo.trackingCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-maroon text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-maroon/90 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Truck className="h-4 w-4" />
                    Track on Courier Website
                  </a>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-slate-400" />
                Payment Summary
              </h2>

              <div className="space-y-2">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Method</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm uppercase flex items-center gap-1.5">
                    {order.paymentMethod === 'cod' ? 'Cash On Delivery' : order.paymentMethod}
                    {order.paymentMethod === 'cod' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Status</span>
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold uppercase ${order.paymentStatus === 'paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="pt-3 mt-1 border-t border-slate-100 dark:border-slate-700 flex justify-between items-end">
                  <span className="text-sm font-semibold text-slate-400">Total Amount</span>
                  <span className="text-xl font-bold text-maroon">৳{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 font-semibold hover:text-maroon transition-colors inline-flex items-center gap-1.5 text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Link>
            <Link to="/quick-track" className="text-slate-500 dark:text-slate-400 font-semibold hover:text-maroon transition-colors inline-flex items-center gap-1.5 text-sm">
              <Search className="h-4 w-4" />
              Search Other Orders
            </Link>
            <Link to="/" className="text-slate-500 dark:text-slate-400 font-semibold hover:text-maroon transition-colors text-sm">
              Back to Home
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
            toast.success('Thank you for your review!', {
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

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, XCircle, Eye, Search, Download, LogIn } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Orders = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [guestOrderNumber, setGuestOrderNumber] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const trackGuestOrder = async (e) => {
    e.preventDefault();
    if (!guestOrderNumber || !guestEmail) {
      toast.error('Please enter both order number and email');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/orders/track-guest', {
        orderNumber: guestOrderNumber,
        email: guestEmail
      });

      if (response.data) {
        navigate(`/track/${response.data._id}`);
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      toast.error('Order not found. Please check your order number and email.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/orders/${orderId}/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Invoice download error:', error);
      toast.error('Failed to download invoice');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'processing': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'shipped': return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'delivered': return 'bg-green-50 text-green-700 border border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border border-red-200';
      default: return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order =>
    order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Guest User View - Order History Sign-in Prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 border border-slate-100 dark:border-slate-700 shadow-sm text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-maroon/10 rounded-2xl text-maroon">
              <Package className="h-8 w-8" />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {language === 'bn' ? 'অর্ডার হিস্টোরি' : 'Order History'}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {language === 'bn' 
                  ? 'আপনার অ্যাকাউন্টের অর্ডারের তালিকা দেখতে এবং ইনভয়েস ডাউনলোড করতে অনুগ্রহ করে লগইন করুন।' 
                  : 'Please sign in to view your complete order history, download invoices, and manage your purchases.'}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                to="/login"
                className="w-full bg-maroon text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-maroon/90 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>{language === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
              </Link>

              <div className="relative py-2 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">{language === 'bn' ? 'অথবা' : 'OR'}</span></div>
              </div>

              <Link
                to="/quick-track"
                className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <Truck className="h-4 w-4" />
                <span>{language === 'bn' ? 'গেস্ট অর্ডার ট্র্যাক করুন' : 'Track Guest Order'}</span>
              </Link>
            </div>

            <p className="text-xs text-slate-400">
              {language === 'bn' 
                ? 'অ্যাকাউন্ট নেই? এখনই শপিং শুরু করুন।' 
                : "Don't have an account? Start browsing our luxury collection."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in User View
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900/40">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {t('my_orders')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('track_manage_orders')}
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('search_order_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-11 w-full"
            />
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm text-center py-16">
            <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">
              {t('no_orders_found')}
            </h3>
            <p className="text-slate-500 mb-6 text-sm">
              {t('start_shopping_msg')}
            </p>
            <Link to="/shop" className="inline-block bg-maroon text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-maroon/90 transition-colors">
              {t('browse_products')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 p-5">
                  {/* Left - Order Info */}
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        #{order.orderNumber || order._id}
                      </h3>
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 w-fit ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </span>
                    </div>

                    {/* Items */}
                    <div className="space-y-2 mb-4">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img
                            src={item.product?.images?.[0] || 'https://via.placeholder.com/100'}
                            alt={item.product?.name}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-100 dark:border-slate-700 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">
                              {item.product?.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {t('qty_label')}: {item.quantity} × ৳{item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Dates */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 text-xs text-slate-500">
                      <div>
                        <span className="font-semibold">{t('ordered_label')}:</span>{' '}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      {order.estimatedDelivery && (
                        <div>
                          <span className="font-semibold">{t('delivery_label')}:</span>{' '}
                          {new Date(order.estimatedDelivery).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right - Amount & Actions */}
                  <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto lg:border-l lg:border-slate-100 dark:lg:border-slate-700 lg:pl-6">
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-slate-500 mb-0.5">
                        {t('total_amount_label')}
                      </p>
                      <p className="text-xl font-bold text-maroon">
                        ৳{order.totalAmount?.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <Link
                        to={`/track/${order._id}`}
                        className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>{t('track_btn')}</span>
                      </Link>

                      <button
                        onClick={() => handleDownloadInvoice(order._id)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Download className="h-4 w-4" />
                        <span>{t('invoice_btn')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Search, Phone, Mail, ArrowLeft, Truck, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';
import Breadcrumb from '../components/Breadcrumb';

const QuickOrderLookup = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchMethod, setSearchMethod] = useState('phone');
  const [contactValue, setContactValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const savedContact = localStorage.getItem('orderContact');
    if (!savedContact) return;

    try {
      const parsed = JSON.parse(savedContact);
      if (parsed?.method) setSearchMethod(parsed.method);
      if (parsed?.value) setContactValue(parsed.value);
    } catch (err) {
      console.warn('Failed to parse saved order contact', err);
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!contactValue.trim()) {
      toast.error('Please enter your search information');
      return;
    }

    setLoading(true);
    setSearched(true);
    
    try {
      let searchData = {};

      switch (searchMethod) {
        case 'email':
          searchData = { email: contactValue.trim() };
          break;
        case 'phone':
          searchData = { phone: contactValue.trim() };
          break;
        case 'product':
          searchData = { productName: contactValue.trim() };
          break;
        case 'orderId':
          searchData = { orderId: contactValue.trim() };
          break;
        default:
          searchData = { phone: contactValue.trim() };
      }

      const response = await axios.post('/api/orders/search', searchData);

      if (response.data.success && response.data.orders.length > 0) {
        setOrders(response.data.orders);
        toast.success(`Found ${response.data.orders.length} order(s)`);

        localStorage.setItem('orderContact', JSON.stringify({
          method: searchMethod,
          value: contactValue.trim(),
        }));
      } else {
        setOrders([]);
        toast.error('No orders found with this information');
      }
    } catch (error) {
      console.error('Search error:', error);
      setOrders([]);
      const message = error.response?.data?.message || 'Unable to find orders. Please check your information.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'confirmed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'processing': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'shipped': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 py-8 px-4">
      <Breadcrumb items={[{ label: 'Track Order' }]} />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Search className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Track Your Orders
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Find your orders using phone number, email address, product name, or order ID
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { key: 'phone', icon: Phone, label: 'Phone' },
                { key: 'email', icon: Mail, label: 'Email' },
                { key: 'product', icon: Package, label: 'Product' },
                { key: 'orderId', icon: Search, label: 'Order ID' },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSearchMethod(key);
                    setContactValue('');
                  }}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-medium transition-colors text-sm ${
                    searchMethod === key
                      ? 'bg-maroon text-white'
                      : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                {searchMethod === 'phone' ? (
                  <Phone className="h-4 w-4 text-slate-400" />
                ) : searchMethod === 'email' ? (
                  <Mail className="h-4 w-4 text-slate-400" />
                ) : searchMethod === 'product' ? (
                  <Package className="h-4 w-4 text-slate-400" />
                ) : (
                  <Search className="h-4 w-4 text-slate-400" />
                )}
              </div>
              <input
                type={searchMethod === 'email' ? 'email' : 'text'}
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                placeholder={
                  searchMethod === 'phone'
                    ? 'Enter your phone number'
                    : searchMethod === 'email'
                    ? 'Enter your email address'
                    : searchMethod === 'product'
                    ? 'Enter product name'
                    : 'Enter order ID'
                }
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-maroon/40"
                required
                disabled={loading}
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-maroon text-white font-semibold px-8 py-3 rounded-xl hover:bg-maroon/90 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Find My Orders
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {searched && !loading && (
          <div className="max-w-2xl mx-auto">
            {orders.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  Your Orders ({orders.length})
                </h2>
                
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      const params = new URLSearchParams();
                      if (searchMethod === 'phone') params.set('phone', contactValue);
                      if (searchMethod === 'email') params.set('email', contactValue);
                      if (searchMethod === 'phone' || searchMethod === 'email') {
                        localStorage.setItem('orderContact', JSON.stringify({
                          method: searchMethod,
                          value: contactValue.trim(),
                        }));
                      }
                      const query = params.toString();
                      navigate(`/track/${order.orderId || order._id}${query ? `?${query}` : ''}`);
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="h-5 w-5 text-slate-400" />
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            #{order.orderId || order._id}
                          </h3>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDate(order.createdAt)}
                          </span>
                          
                          {order.trackingNumber && (
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg font-mono text-xs">
                              {order.trackingNumber}
                            </span>
                          )}
                        </div>

                        <div className="mt-2.5 flex items-center gap-1.5">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <img
                              key={idx}
                              src={item.image || item.product?.images?.[0] || 'https://via.placeholder.com/40x40?text=No+Image'}
                              alt={item.name || item.product?.name || 'Product'}
                              className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-600"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/40x40?text=No+Image';
                              }}
                            />
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-500">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end gap-3">
                        <div className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 text-sm ${getStatusColor(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          <span className="capitalize">{order.orderStatus}</span>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-maroon">
                            ৳{order.total.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-400">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        Click to view details
                      </span>
                      <div className="flex items-center gap-1 text-maroon font-semibold">
                        <span>View Order</span>
                        <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-10 text-center">
                <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700 dark:text-white mb-1">
                  No Orders Found
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  We couldn't find any orders with this contact information
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 font-semibold hover:text-maroon transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickOrderLookup;

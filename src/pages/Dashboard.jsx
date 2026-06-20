import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  User, Package, Heart, Settings, LogOut, MapPin, Phone, 
  Mail, Eye, Download, Lock, Shield, ShoppingBag, 
  CheckCircle, Clock, Truck, XCircle, ArrowRight, ClipboardCheck,
  Star, RefreshCw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Seo from '../components/Seo';
import Breadcrumb from '../components/Breadcrumb';
import ReviewForm from '../components/ReviewForm';
import { getImageUrl } from '../utils/productUtils';
import { playCartSound } from '../utils/sounds';


const Dashboard = () => {
  const { user, logout, checkAuthStatus } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [reviewingProductId, setReviewingProductId] = useState(null);

  // Edit Profile States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Bangladesh'
  });
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  
  // Avatar Upload States
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Change Password States
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
      // Populate profile form
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || 'Bangladesh'
      });
      setAvatarPreview('');
      setAvatarUrl('');
    }
  }, [user]);

  // Calculations
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(
      o => o.status !== 'delivered' && o.status !== 'cancelled'
    ).length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered');
    const totalSpent = deliveredOrders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0);
    
    return {
      totalOrders,
      pendingOrders,
      totalSpent,
      wishlistCount: wishlist.length
    };
  }, [orders, wishlist]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      setProfileSubmitting(true);
      const token = localStorage.getItem('token');
      await axios.put('/api/users/profile', {
        name: profileForm.name,
        phone: profileForm.phone,
        avatar: avatarUrl || user?.avatar,
        address: {
          street: profileForm.street,
          city: profileForm.city,
          state: profileForm.state,
          zipCode: profileForm.zipCode,
          country: profileForm.country
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await checkAuthStatus();
      setAvatarPreview('');
      setAvatarUrl('');
      setIsEditingProfile(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    // Set preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload immediately
    try {
      setAvatarUploading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/api/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setAvatarUrl(response.data.url);
      toast.success('Image uploaded successfully! Click Save Profile to apply.');
    } catch (err) {
      console.error('Avatar upload error:', err);
      toast.error(err.response?.data?.message || 'Failed to upload image');
      setAvatarPreview('');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleCancelAvatarChange = () => {
    setAvatarPreview('');
    setAvatarUrl('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error('All fields are required');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setPasswordSubmitting(true);
      const token = localStorage.getItem('token');
      await axios.put('/api/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      toast.success('Password updated successfully!');
    } catch (error) {
      console.error('Password change error:', error);
      toast.error(error.response?.data?.message || 'Current password is incorrect');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const handleAddToCartFromWishlist = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
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

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach((item) => {
      const product = {
        _id: item.product?._id || item.product,
        name: item.product?.name || item.name,
        price: item.price,
        images: item.product?.images || item.image ? [{ url: item.image || item.product?.images?.[0]?.url }] : [],
        stock: item.product?.stock || 10,
      };
      addToCart(product, item.quantity);
    });
    playCartSound();
    toast.success('Items added to cart!');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
      case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400';
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400';
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

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'orders', label: 'Order History', icon: Package, badge: stats.totalOrders },
    { id: 'wishlist', label: 'My Wishlist', icon: Heart, badge: stats.wishlistCount },
    { id: 'security', label: 'Security', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 py-8 px-4">
      <Breadcrumb items={[{ label: 'Dashboard' }]} />
      <Seo title="User Dashboard | RongRani" description="Manage your orders, profile details, and account security settings." path="/dashboard" />
      
      <div className="max-w-6xl mx-auto">
        
        {/* Welcome Section */}
        <div className="bg-maroon text-white rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center font-bold text-white text-xl overflow-hidden shrink-0">
                {user?.avatar ? (
                  <img src={getImageUrl(user.avatar)} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Hello, {user?.name || 'Customer'}
                </h1>
                <p className="text-white/70 text-sm mt-0.5">
                  Welcome back to your account.
                </p>
              </div>
            </div>
            <button 
              onClick={logout} 
              className="flex items-center gap-2 bg-white/10 hover:bg-red-500 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Dashboard Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar / Mobile Tabs */}
          <div className="lg:col-span-1">
            {/* Desktop Navigation */}
            <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 p-5 border-b border-slate-100 dark:border-slate-700">
                <div className="w-10 h-10 bg-maroon/10 rounded-xl flex items-center justify-center font-bold text-maroon text-sm overflow-hidden shrink-0">
                  {user?.avatar ? (
                    <img src={getImageUrl(user.avatar)} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm">
                    {user?.name || 'Customer'}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <nav className="p-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsEditingProfile(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-colors font-semibold text-sm ${
                        activeTab === item.id
                          ? 'bg-maroon text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === item.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsEditingProfile(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs whitespace-nowrap border transition-colors ${
                      activeTab === item.id
                        ? 'bg-maroon text-white border-maroon'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === item.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Card Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 md:p-8 min-h-[50vh]">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-maroon" />
                    <span>Account Overview</span>
                  </h2>

                  {/* Summary Cards Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                        Total Orders
                      </p>
                      <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {stats.totalOrders}
                      </h4>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                        Active Orders
                      </p>
                      <h4 className="text-2xl font-bold text-amber-600 dark:text-amber-500">
                        {stats.pendingOrders}
                      </h4>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                        Total Spent
                      </p>
                      <h4 className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
                        ৳{stats.totalSpent.toLocaleString()}
                      </h4>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                        Wishlist Items
                      </p>
                      <h4 className="text-2xl font-bold text-purple-600 dark:text-purple-500">
                        {stats.wishlistCount}
                      </h4>
                    </div>
                  </div>

                  {/* Profile and Quick Details layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-50 dark:bg-slate-900/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <h3 className="font-bold text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2 text-xs uppercase tracking-wider">
                        <User className="h-4 w-4 text-maroon" />
                        <span>Personal Details</span>
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                          <span className="text-slate-400">Name:</span>
                          <span className="text-slate-800 dark:text-slate-200 font-semibold">{user?.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                          <span className="text-slate-400">Email:</span>
                          <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[180px]">{user?.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Phone:</span>
                          <span className="text-slate-800 dark:text-slate-200 font-semibold">{user?.phone || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <h3 className="font-bold text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2 text-xs uppercase tracking-wider">
                        <MapPin className="h-4 w-4 text-maroon" />
                        <span>Primary Address</span>
                      </h3>
                      {user?.address?.street || user?.address?.city ? (
                        <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{user.address.street}</p>
                          <p>{user.address.city}, {user.address.state || ''} {user.address.zipCode || ''}</p>
                          <p className="font-bold text-maroon text-xs uppercase tracking-wider mt-2">{user.address.country}</p>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-slate-400 text-xs">
                          <p>No primary address set.</p>
                          <button 
                            onClick={() => setActiveTab('profile')} 
                            className="text-maroon font-semibold hover:underline mt-2 inline-block"
                          >
                            Add Address
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Order Activity Summary */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        Recent Order
                      </h3>
                      {orders.length > 0 && (
                        <button 
                          onClick={() => setActiveTab('orders')} 
                          className="text-maroon font-semibold text-sm hover:underline flex items-center gap-1"
                        >
                          <span>View All</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    
                    {orders.length > 0 ? (
                      <div className="border border-slate-100 dark:border-slate-700 rounded-2xl p-5">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                          <div>
                            <p className="font-bold text-maroon">Order #{orders[0].orderNumber || orders[0]._id.slice(-6).toUpperCase()}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{new Date(orders[0].createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 capitalize ${getStatusBadgeClass(orders[0].status || orders[0].orderStatus)}`}>
                            {getStatusIcon(orders[0].status || orders[0].orderStatus)}
                            <span>{orders[0].status || orders[0].orderStatus}</span>
                          </span>
                        </div>
                        <div className="space-y-3">
                          {orders[0].items?.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[200px]">
                                {item.product?.name || item.name} <span className="text-xs text-slate-400">×{item.quantity}</span>
                              </span>
                              <span className="font-semibold text-slate-800 dark:text-white">৳{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                          {orders[0].items?.length > 2 && (
                            <p className="text-xs text-slate-400">+ {orders[0].items.length - 2} more items</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                        <ShoppingBag className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                        <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">No orders found</h4>
                        <p className="text-xs text-slate-400 mb-4">You haven't placed any orders with RongRani yet.</p>
                        <Link to="/shop" className="inline-block bg-maroon text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-maroon/90 transition-colors">Shop Now</Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: PROFILE SETTINGS */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <User className="h-5 w-5 text-maroon" />
                      <span>Profile Settings</span>
                    </h2>
                    {!isEditingProfile && (
                      <button 
                        onClick={() => setIsEditingProfile(true)} 
                        className="bg-maroon text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-maroon/90 transition-colors"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {!isEditingProfile ? (
                    <div className="space-y-6">
                      {/* Profile Picture Display */}
                      <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="w-16 h-16 rounded-full bg-maroon/10 flex items-center justify-center font-bold text-maroon text-2xl border border-maroon/10 overflow-hidden shrink-0">
                          {user?.avatar ? (
                            <img src={getImageUrl(user.avatar)} alt={user?.name} className="w-full h-full object-cover" />
                          ) : (
                            user?.name?.charAt(0).toUpperCase() || 'U'
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Profile Picture</h3>
                          <p className="text-xs text-slate-400 mt-0.5">To change your profile picture, click Edit Profile below.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-900/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Full Name</span>
                          <span className="text-slate-800 dark:text-slate-100 font-semibold">{user?.name}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Email Address</span>
                          <span className="text-slate-800 dark:text-slate-100 font-semibold truncate block">{user?.email}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Phone Number</span>
                          <span className="text-slate-800 dark:text-slate-100 font-semibold">{user?.phone || 'Not provided'}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Account Role</span>
                          <span className="text-slate-800 dark:text-slate-100 font-bold capitalize">{user?.role}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-900/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <h3 className="font-bold text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2 text-xs uppercase tracking-wider">
                          <MapPin className="h-4 w-4 text-maroon" />
                          <span>Delivery Address Details</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400 block">Street Address</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-200">{user?.address?.street || 'Not set'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">City</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-200">{user?.address?.city || 'Not set'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">State / Division</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-200">{user?.address?.state || 'Not set'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Zip / Postal Code</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-200">{user?.address?.zipCode || 'Not set'}</span>
                          </div>
                          <div className="md:col-span-2">
                            <span className="text-slate-400 block">Country</span>
                            <span className="font-bold text-maroon uppercase tracking-wider text-xs">{user?.address?.country || 'Bangladesh'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      {/* Avatar Upload Section */}
                      <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="relative w-16 h-16 rounded-full bg-maroon/10 flex items-center justify-center font-bold text-maroon text-2xl border border-maroon/10 overflow-hidden shrink-0">
                          {avatarPreview ? (
                            <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                          ) : user?.avatar ? (
                            <img src={getImageUrl(user.avatar)} alt="Current" className="w-full h-full object-cover" />
                          ) : (
                            user?.name?.charAt(0).toUpperCase() || 'U'
                          )}
                          {avatarUploading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Upload Profile Picture</h3>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              id="avatar-upload-input"
                              className="hidden"
                              onChange={handleAvatarChange}
                              disabled={avatarUploading}
                            />
                            <label
                              htmlFor="avatar-upload-input"
                              className={`bg-maroon hover:bg-maroon-dark text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer inline-block ${avatarUploading ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                              Choose Image
                            </label>
                            {avatarPreview && (
                              <button
                                type="button"
                                onClick={handleCancelAvatarChange}
                                className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                                disabled={avatarUploading}
                              >
                                Reset
                              </button>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400">JPG, PNG or WEBP. Max 2MB.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                          <input 
                            type="text" 
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                            className="input-field bg-slate-50/50 dark:bg-slate-900/40"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Email Address (Read-only)</label>
                          <input 
                            type="email" 
                            value={user?.email || ''} 
                            disabled 
                            className="input-field bg-slate-100 dark:bg-slate-900/60 opacity-60 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                          <input 
                            type="text" 
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            className="input-field bg-slate-50/50 dark:bg-slate-900/40"
                            placeholder="e.g. 018XXXXXXXX"
                          />
                        </div>
                      </div>

                      <div className="bg-slate-50/50 dark:bg-slate-900/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-4">
                        <h3 className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-2">
                          <MapPin className="h-4 w-4 text-maroon" />
                          <span>Delivery Address Details</span>
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Street Address</label>
                            <input 
                              type="text"
                              value={profileForm.street}
                              onChange={(e) => setProfileForm({ ...profileForm, street: e.target.value })}
                              className="input-field dark:bg-slate-900/40"
                              placeholder="House, Road, Area, etc."
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">City</label>
                            <input 
                              type="text"
                              value={profileForm.city}
                              onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                              className="input-field dark:bg-slate-900/40"
                              placeholder="City / District"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">State / Division</label>
                            <input 
                              type="text"
                              value={profileForm.state}
                              onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                              className="input-field dark:bg-slate-900/40"
                              placeholder="State / Division"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Zip / Postal Code</label>
                            <input 
                              type="text"
                              value={profileForm.zipCode}
                              onChange={(e) => setProfileForm({ ...profileForm, zipCode: e.target.value })}
                              className="input-field dark:bg-slate-900/40"
                              placeholder="Zip / Postal Code"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Country</label>
                            <input 
                              type="text"
                              value={profileForm.country}
                              onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                              className="input-field dark:bg-slate-900/40"
                              placeholder="Bangladesh"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button 
                          type="submit" 
                          disabled={profileSubmitting}
                          className="bg-maroon text-white px-8 py-2.5 rounded-xl text-sm font-semibold hover:bg-maroon/90 transition-colors disabled:opacity-50"
                        >
                          {profileSubmitting ? 'Saving...' : 'Save Profile'}
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setIsEditingProfile(false)}
                          className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-8 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 3: ORDER HISTORY */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Package className="h-5 w-5 text-maroon" />
                    <span>My Order History</span>
                  </h2>

                  {ordersLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-maroon"></div>
                      <p className="text-slate-400 mt-4 text-sm">Loading orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                      <Package className="h-14 w-14 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">No orders found</h3>
                      <p className="text-slate-500 mb-6 max-w-sm mx-auto text-sm">
                        You have not placed any orders yet. Visit our shop to browse our beautiful saree and jewelry collection!
                      </p>
                      <Link to="/shop" className="inline-block bg-maroon text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-maroon/90 transition-colors">
                        Browse Products
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div 
                          key={order._id} 
                          className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm"
                        >
                          {/* Order Header */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700 mb-4">
                            <div>
                              <div className="flex items-center gap-3">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                  #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                                </h3>
                                <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold border flex items-center gap-1.5 capitalize ${getStatusBadgeClass(order.status || order.orderStatus)}`}>
                                  {getStatusIcon(order.status || order.orderStatus)}
                                  <span>{order.status || order.orderStatus}</span>
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1">
                                Ordered on: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            
                            <div className="text-left md:text-right">
                              <p className="text-xs text-slate-400">Total Payable</p>
                              <p className="text-xl font-bold text-maroon">
                                ৳{(order.totalAmount || order.total || 0).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-3 mb-4">
                            {order.items?.map((item, idx) => {
                              const isOrderDelivered = (order.status || order.orderStatus) === 'delivered';
                              return (
                                <div key={idx} className="flex gap-3 items-center">
                                  <img 
                                    src={item.image || item.product?.images?.[0]?.url || item.product?.image || 'https://via.placeholder.com/100'} 
                                    alt={item.product?.name || item.name} 
                                    className="w-10 h-10 object-cover rounded-lg border border-slate-100 dark:border-slate-700 flex-shrink-0"
                                    onError={(e) => {
                                      e.target.src = 'https://via.placeholder.com/100?text=Pottery';
                                    }}
                                  />
                                  <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">
                                      {item.product?.name || item.name}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                      ৳{item.price} × {item.quantity}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-3 shrink-0">
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                                      ৳{(item.price * item.quantity).toLocaleString()}
                                    </span>
                                    {isOrderDelivered && (
                                      <button 
                                        onClick={() => setReviewingProductId(item.product?._id || item.product)}
                                        className="bg-white hover:bg-maroon hover:text-white text-maroon border border-maroon px-3 py-1 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                                      >
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        <span>{language === 'bn' ? 'রিভিউ' : 'Review'}</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Order Footer Actions */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <span className="text-xs text-slate-400 font-medium">
                              Payment: <span className="font-semibold text-slate-600 dark:text-slate-300 capitalize">{order.paymentMethod}</span> ({order.paymentStatus || 'Pending'})
                            </span>
                            
                            <div className="flex gap-2">
                              <Link 
                                to={`/track/${order._id}`}
                                className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>Track Order</span>
                              </Link>
                              
                              {(order.status || order.orderStatus) === 'delivered' && (
                                <button 
                                  onClick={() => handleReorder(order)}
                                  className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                  <RefreshCw className="h-3.5 w-3.5" />
                                  <span>Re-order</span>
                                </button>
                              )}
                              
                              <button 
                                onClick={() => handleDownloadInvoice(order._id)}
                                className="bg-emerald-600 text-white font-semibold py-2 px-4 rounded-xl text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                              >
                                <Download className="h-3.5 w-3.5" />
                                <span>Invoice</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: MY WISHLIST */}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-maroon fill-maroon" />
                    <span>My Wishlist</span>
                  </h2>

                  {wishlist.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                      <Heart className="h-14 w-14 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">Wishlist is empty</h3>
                      <p className="text-slate-500 mb-6 max-w-sm mx-auto text-sm">
                        Save products you love here. Tap the heart on any product page to build your wishlist!
                      </p>
                      <Link to="/shop" className="inline-block bg-maroon text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-maroon/90 transition-colors">
                        Shop Collection
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlist.map((item) => (
                        <div 
                          key={item._id} 
                          className="flex gap-4 p-4 border border-slate-100 dark:border-slate-700 rounded-2xl hover:shadow-md transition-shadow items-center justify-between"
                        >
                          <div className="flex gap-3 items-center min-w-0">
                            <img 
                              src={item.images?.[0] || item.image?.url || item.image || 'https://via.placeholder.com/100'} 
                              alt={item.name} 
                              className="w-14 h-14 object-cover rounded-xl border border-slate-100 dark:border-slate-700"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100?text=Product';
                              }}
                            />
                            <div className="min-w-0">
                              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate max-w-[150px] md:max-w-[200px]" title={item.name}>
                                {item.name}
                              </h3>
                              <p className="text-maroon font-bold text-sm mt-0.5">
                                ৳{item.price.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5 shrink-0">
                            <button 
                              onClick={() => handleAddToCartFromWishlist(item)}
                              disabled={item.stock === 0}
                              className="bg-maroon text-white font-semibold py-1.5 px-3 rounded-lg text-xs hover:bg-maroon/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {item.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <button 
                              onClick={() => removeFromWishlist(item._id)}
                              className="bg-slate-100 dark:bg-slate-700 text-red-500 font-semibold py-1.5 px-3 rounded-lg text-xs hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: SECURITY (CHANGE PASSWORD) */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-maroon" />
                    <span>Security & Password Settings</span>
                  </h2>

                  <div className="bg-slate-50 dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 max-w-xl">
                    <h3 className="font-bold text-slate-500 dark:text-slate-400 mb-4 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-maroon" /> Change Password
                    </h3>
                    
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Current Password</label>
                        <div className="relative">
                          <input 
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            className="input-field pr-10 bg-white dark:bg-slate-900/40"
                            required
                          />
                          <button 
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold hover:text-maroon"
                          >
                            {showCurrentPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">New Password</label>
                        <div className="relative">
                          <input 
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="input-field pr-10 bg-white dark:bg-slate-900/40"
                            required
                          />
                          <button 
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold hover:text-maroon"
                          >
                            {showNewPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Must be at least 6 characters long</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Confirm New Password</label>
                        <input 
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="input-field bg-white dark:bg-slate-900/40"
                          required
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={passwordSubmitting}
                        className="w-full bg-maroon text-white py-3 rounded-xl text-sm font-semibold hover:bg-maroon/90 transition-colors disabled:opacity-50 mt-4"
                      >
                        {passwordSubmitting ? 'Updating...' : 'Update Password'}
                      </button>
                    </form>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      {/* Review Modal */}
      {reviewingProductId && (
        <ReviewForm
          productId={reviewingProductId}
          initialGuestEmail={user?.email || ''}
          onClose={() => setReviewingProductId(null)}
          onCancel={() => setReviewingProductId(null)}
          onSuccess={() => setReviewingProductId(null)}
          onReviewSubmitted={() => {
            toast.success(language === 'bn' ? 'রিভিউ প্রদানের জন্য ধন্যবাদ!' : 'Thank you for your review!', {
              icon: <Heart className="w-4 h-4 fill-maroon text-maroon" />,
              style: { borderRadius: '10px', background: '#FFF0F5', color: '#BE123C' }
            });
          }}
        />
      )}
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, ShoppingCart, Heart, Minus, Plus, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Zap, Gift, Package, MessageCircle, MapPin, Globe, Info, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { addToRecentlyViewed } from '../utils/productUtils';
import toast from 'react-hot-toast';
import Seo from '../components/Seo';
import ReviewForm from '../components/ReviewForm';
import ProductItem from '../components/ProductItem';
import { useLanguage } from '../contexts/LanguageContext';
import { useWishlist } from '../contexts/WishlistContext';
import SocialShare from '../components/SocialShare';
import Breadcrumb from '../components/Breadcrumb';

const playCartSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const g = ctx.createGain();
    o1.type = 'sine'; o1.frequency.value = 880;
    o2.type = 'sine'; o2.frequency.value = 1320;
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    o1.connect(g); o2.connect(g); g.connect(ctx.destination);
    o1.start(); o2.start();
    o1.stop(ctx.currentTime + 0.15);
    o2.stop(ctx.currentTime + 0.15);
  } catch (_) {}
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { addToCart, updateQuantity, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const deliverySettings = useMemo(() => ({ chittagongFee: 60, outsideChittagongFee: 130 }), []);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [isImagePaused, setIsImagePaused] = useState(false);

  const imageCount = product?.images?.length || 0;

  useEffect(() => { setActiveImage(0); }, [product?._id]);

  // Sync quantity with cart if product already in cart
  useEffect(() => {
    if (product) {
      const cartItem = cartItems.find(item => item.id === product._id || item.id === product.id);
      if (cartItem) setQuantity(cartItem.quantity);
    }
  }, [product, cartItems]);

  useEffect(() => {
    if (imageCount < 2 || isImagePaused) return undefined;
    const timer = setInterval(() => setActiveImage((prev) => (prev + 1) % imageCount), 3000);
    return () => clearInterval(timer);
  }, [imageCount, isImagePaused]);

  const isWishlisted = product ? isInWishlist(product._id) : false;
  const baseUrl = (import.meta?.env?.VITE_SITE_URL || 'https://rongrani.vercel.app').replace(/\/+$/, '');

  const buildDescription = (text) => {
    if (!text) return '';
    const n = text.replace(/\s+/g, ' ').trim();
    return n.length <= 160 ? n : `${n.slice(0, 157)}...`;
  };

  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
      const canonicalParam = response.data?.slug || response.data?._id;
      if (canonicalParam && canonicalParam !== id) navigate(`/product/${canonicalParam}`, { replace: true });
      if (response.data.category) {
        try {
          const relatedRes = await axios.get(`/api/products?category=${response.data.category}&limit=5`);
          setRelatedProducts(relatedRes.data.products.filter((p) => p._id !== response.data._id).slice(0, 4));
        } catch (_) {}
      }
    } catch (_) {
      const mock = {
        '1': { _id: '1', name: 'Handwoven Silk Scarf', description: 'Beautiful handwoven silk scarf with traditional patterns.', price: 2250, originalPrice: 2500, images: [{ url: '/api/placeholder/400/400' }], stock: 15, category: 'clothing', rating: 4.5 },
        '2': { _id: '2', name: 'Bamboo Basket Set', description: 'Set of 3 handcrafted bamboo baskets.', price: 1800, images: [{ url: '/api/placeholder/400/400' }], stock: 8, category: 'home', rating: 4.2 }
      };
      setProduct(mock[id] || mock['1']);
    } finally { setLoading(false); }
  }, [id, navigate]);

  const fetchReviews = useCallback(async () => {
    try {
      setLoadingReviews(true);
      const res = await axios.get(`/api/products/${product?._id || id}/reviews`);
      setReviews(res.data || []);
    } catch (_) { setReviews([]); } finally { setLoadingReviews(false); }
  }, [id, product?._id]);

  const checkCanReview = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get(`/api/products/${product?._id || id}/can-review`, config);
      setCanReview(res.data.canReview);
    } catch (_) { setCanReview(false); }
  }, [id, product?._id]);

  useEffect(() => { fetchProduct(); fetchReviews(); checkCanReview(); }, [fetchProduct, fetchReviews, checkCanReview]);
  useEffect(() => { if (product) addToRecentlyViewed(product); }, [product]);

  const isInCart = cartItems.some(item => item.id === product?._id || item.id === product?.id);

  const handleAddToCart = useCallback(() => {
    if (isInCart) {
      updateQuantity(product._id || product.id, quantity);
    } else {
      addToCart(product, quantity);
    }
    playCartSound();
    toast.success(`${product.name} added to cart!`);
  }, [addToCart, updateQuantity, product, quantity, isInCart]);

  const handleBuyNow = useCallback(() => {
    if (isInCart) {
      updateQuantity(product._id || product.id, quantity);
    } else {
      addToCart(product, quantity);
    }
    playCartSound();
    toast.success('Redirecting to checkout...');
    navigate('/checkout');
  }, [addToCart, updateQuantity, product, quantity, navigate, isInCart]);
  const handleAddToWishlist = useCallback(() => { toggleWishlist(product); }, [toggleWishlist, product]);

  const getImageUrl = (image) => {
    if (!image) return '';
    if (typeof image === 'string') return image;
    return image.url || image.secure_url || '';
  };

  const routeParam = product?.slug || id;
  const pagePath = `/product/${routeParam}`;
  const shareBaseUrl = (import.meta?.env?.VITE_SHARE_BASE_URL || import.meta?.env?.VITE_BACKEND_URL || import.meta?.env?.VITE_API_BASE_URL || import.meta?.env?.VITE_SITE_URL || window.location.origin).replace(/\/+$/, '');
  const sharePreviewUrl = `${shareBaseUrl}/share/product/${routeParam}`;

  const { pageTitle, pageDescription, pageKeywords, pageImage } = useMemo(() => {
    if (!product) return {};
    const image = getImageUrl(product.images?.[0]) || getImageUrl(product.image);
    const desc = product.seoDescription || (product.description ? buildDescription(product.description) : 'View product details from RongRani.');
    return { pageTitle: product.seoTitle || `${product.name} | RongRani`, pageDescription: desc, pageKeywords: product.tags || [], pageImage: image };
  }, [product]);

  const productSchema = useMemo(() => product ? {
    '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: pageDescription,
    image: pageImage ? [pageImage] : undefined, sku: product._id,
    brand: { '@type': 'Brand', name: 'RongRani' },
    offers: { '@type': 'Offer', priceCurrency: 'BDT', price: String(product.price), availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: `${baseUrl}${pagePath}` },
  } : null, [product, pageDescription, pageImage, baseUrl, pagePath]);

  const socialMeta = useMemo(() => product ? [
    { property: 'product:price:amount', content: String(product.price || 0) },
    { property: 'product:price:currency', content: 'BDT' },
    { property: 'product:availability', content: product.stock > 0 ? 'in stock' : 'out of stock' },
  ] : [], [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Seo title="Product Details | RongRani" description="View product details." path={pagePath} />
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-maroon border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Seo title="Product Not Found | RongRani" path={pagePath} noIndex />
        <div className="text-center">
          <ShoppingCart className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{t('product_not_found')}</h2>
          <p className="text-sm text-slate-400">{t('product_not_found_msg')}</p>
        </div>
      </div>
    );
  }

  const categoryRaw = typeof product?.category === 'string' ? product.category : product?.category?.name || '';
  const categoryLabel = categoryRaw.replace(/[-_]+/g, ' ').trim();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Breadcrumb items={[{ label: 'Shop', to: '/shop' }, { label: product?.name || 'Product' }]} />
      <Seo title={pageTitle} description={pageDescription} keywords={pageKeywords} path={pagePath} image={pageImage} type="product" extraMeta={socialMeta} schema={productSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <div className="flex gap-4">
            {/* Thumbnail strip - vertical on desktop, horizontal on mobile */}
            {product.images && product.images.length > 1 && (
              <div className="hidden lg:flex flex-col gap-2 overflow-y-auto max-h-[500px] scrollbar-hide">
                {product.images.map((img, index) => (
                  <button key={index} onClick={() => setActiveImage(index)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-200 ${activeImage === index ? 'ring-2 ring-maroon shadow-md' : 'ring-1 ring-slate-200 dark:ring-slate-700 opacity-60 hover:opacity-100'}`}>
                    <img src={getImageUrl(img)} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                onMouseEnter={() => setIsImagePaused(true)} onMouseLeave={() => setIsImagePaused(false)}
                onTouchStart={() => setIsImagePaused(true)} onTouchEnd={() => setIsImagePaused(false)}>
                {product.images && product.images.length > 0 ? (
                  <img src={getImageUrl(product.images[activeImage])} alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><Package className="w-16 h-16" /></div>
                )}

                {product.originalPrice > product.price && (
                  <div className="absolute top-4 left-4 bg-maroon text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-maroon/30">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </div>
                )}

                {imageCount > 1 && (
                  <>
                    <button onClick={() => setActiveImage((prev) => (prev - 1 + imageCount) % imageCount)}
                      className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md text-slate-600 dark:text-slate-300 hover:scale-105 transition-transform"><ChevronLeft className="w-5 h-5" /></button>
                    <button onClick={() => setActiveImage((prev) => (prev + 1) % imageCount)}
                      className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md text-slate-600 dark:text-slate-300 hover:scale-105 transition-transform"><ChevronRight className="w-5 h-5" /></button>
                  </>
                )}

                {/* Image counter */}
                {imageCount > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {activeImage + 1} / {imageCount}
                  </div>
                )}
              </div>

              {/* Mobile thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.map((img, index) => (
                    <button key={index} onClick={() => setActiveImage(index)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-200 ${activeImage === index ? 'ring-2 ring-maroon shadow-md' : 'ring-1 ring-slate-200 dark:ring-slate-700 opacity-60 hover:opacity-100'}`}>
                      <img src={getImageUrl(img)} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider">
                    {categoryLabel || 'Premium Collection'}
                  </span>
                  <div className="flex items-center text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-current mr-1" />
                    <span className="text-xs font-bold">{product.rating || '4.8'}</span>
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-3">{product.name}</h1>
                {product.sku && <p className="text-xs text-slate-400 mb-2">SKU: {product.sku}</p>}
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{product.description}</p>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-maroon">৳{product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-slate-300 dark:text-slate-600 line-through">৳{product.originalPrice.toLocaleString()}</span>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.stock > 0 ? t('in_stock_msg') : t('out_of_stock_msg')}
                  </span>
                </div>
                {product.stock > 0 && product.stock < 10 && (
                  <span className="text-[11px] font-medium text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md">{t('limited_stock_msg')}</span>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">{t('select_quantity')}</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => { const next = Math.max(1, quantity - 1); setQuantity(next); if (isInCart) updateQuantity(product._id || product.id, next); }} disabled={product.stock === 0}
                    className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"><Minus className="w-4 h-4" /></button>
                  <div className="w-14 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg text-lg font-bold text-slate-800 dark:text-white">{quantity}</div>
                  <button onClick={() => { const next = Math.min(product.stock, quantity + 1); setQuantity(next); if (isInCart) updateQuantity(product._id || product.id, next); }} disabled={product.stock === 0 || quantity >= product.stock}
                    className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button onClick={handleBuyNow} disabled={product.stock === 0}
                  className="w-full bg-maroon text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-maroon-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]">
                  <Truck className="w-4.5 h-4.5" /> {t('buy_now_zap')}
                </button>
                <button onClick={handleAddToCart} disabled={product.stock === 0}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 active:scale-[0.98]">
                  <ShoppingCart className="w-4.5 h-4.5" /> {t('add_cart_msg')}
                </button>
                <button onClick={handleAddToWishlist}
                  className={`w-full py-3 rounded-xl border font-medium flex items-center justify-center gap-2 transition-colors active:scale-[0.98]
                    ${isWishlisted ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-rose-200 dark:hover:border-rose-500/30'}`}>
                  <Heart className={`w-4.5 h-4.5 ${isWishlisted ? 'fill-current' : ''}`} />
                  {isWishlisted ? t('in_wishlist') : t('add_to_wishlist')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-16 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><Package className="w-4 h-4 text-slate-500" /></div>
              {t('product_description') || 'Product Description'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{product.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Specs */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-400" /> {t('product_details')}
              </h3>
              <div className="space-y-2.5">
                {[
                  { label: t('category') || 'Category', value: categoryLabel || 'General', badge: true },
                  { label: t('sku_label'), value: product.sku || product._id.slice(-6).toUpperCase() },
                  { label: t('availability') || 'Availability', value: product.stock > 0 ? t('in_stock') : t('out_of_stock'), color: product.stock > 0 ? 'text-green-600' : 'text-red-500' },
                  { label: t('brand') || 'Brand', value: 'RongRani', color: 'text-maroon' },
                ].map(({ label, value, badge, color }, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5">
                    <span className="text-xs text-slate-400">{label}:</span>
                    <span className={`text-xs font-semibold ${color || 'text-slate-700 dark:text-slate-300'}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-green-50/30 dark:bg-emerald-950/10 rounded-2xl p-6 border border-green-100 dark:border-emerald-900/30">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-green-500/10 flex items-center justify-center"><Truck className="w-3.5 h-3.5 text-green-600" /></div>
                {t('delivery_info')}
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center py-1.5">
                  <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-green-600" /><span className="text-xs text-slate-600">Inside Cox's Bazar:</span></div>
                  <span className="text-sm font-bold text-green-600">৳{deliverySettings.chittagongFee}</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <div className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-green-600" /><span className="text-xs text-slate-600">Outside Cox's Bazar:</span></div>
                  <span className="text-sm font-bold text-green-600">৳{deliverySettings.outsideChittagongFee}</span>
                </div>
                <div className="bg-amber-400 text-slate-800 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold mt-2">
                  <Truck className="w-3.5 h-3.5" /> Delivered by Steadfast Courier
                </div>
              </div>
            </div>

            {/* Why choose */}
            <div className="bg-pink-50/30 dark:bg-pink-950/10 rounded-2xl p-6 border border-pink-100 dark:border-pink-900/30">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-pink-500/10 flex items-center justify-center"><Gift className="w-3.5 h-3.5 text-pink-600" /></div>
                {t('why_choose_this')}
              </h3>
              <div className="space-y-3">
                {[t('handcrafted_love'), t('perfect_gift_choice'), t('premium_quality'), t('beautiful_packaging')].map((title, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <CheckCircle className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">{title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { icon: Truck, title: t('fast_delivery_title'), desc: t('fast_delivery_desc'), bg: 'bg-blue-50/50 dark:bg-blue-950/10', iconBg: 'bg-blue-500', border: 'border-blue-100 dark:border-blue-900/30' },
              { icon: Shield, title: t('quality_guaranteed_title'), desc: t('authentic_products_desc'), bg: 'bg-emerald-50/50 dark:bg-emerald-950/10', iconBg: 'bg-emerald-500', border: 'border-emerald-100 dark:border-emerald-900/30' },
              { icon: RotateCcw, title: t('easy_returns_title'), desc: t('return_policy_desc'), bg: 'bg-amber-50/50 dark:bg-amber-950/10', iconBg: 'bg-amber-500', border: 'border-amber-100 dark:border-amber-900/30' },
            ].map(({ icon: Icon, title, desc, bg, iconBg, border }, i) => (
              <div key={i} className={`${bg} p-5 rounded-2xl border ${border} text-center`}>
                <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center text-white mx-auto mb-3`}><Icon className="w-5 h-5" /></div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-0.5">{title}</h4>
                <p className="text-[11px] text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Share */}
        <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-0.5">{t('share_love')}</h3>
              <p className="text-sm text-slate-400">{t('tell_friends_art')}</p>
            </div>
            <SocialShare url={window.location.href} previewUrl={sharePreviewUrl} title={product.name} image={pageImage} description={product.description} price={product.price} />
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{t('customer_reviews')}</h2>
              <div className="flex items-center gap-3">
                <div className="flex text-amber-500 gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const rv = product.rating || 5;
                    const isFull = rv >= star;
                    const isHalf = !isFull && rv >= (star - 0.5);
                    return (
                      <div key={star} className="relative w-4 h-4">
                        <Star className="w-4 h-4 text-slate-200 dark:text-slate-700" />
                        {(isFull || isHalf) && <Star className="w-4 h-4 fill-current text-amber-500 absolute top-0 left-0" style={{ width: isFull ? '100%' : '50%', overflow: 'hidden' }} />}
                      </div>
                    );
                  })}
                </div>
                <span className="text-sm text-slate-400">{reviews.length} {t('authentic_reviews')}</span>
              </div>
            </div>
            {canReview && !showReviewForm && (
              <button onClick={() => setShowReviewForm(true)} className="btn-primary px-5 py-2 text-sm rounded-xl flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> {t('write_review')}
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="mb-8">
              <ReviewForm productId={product?._id || id} onSuccess={() => { setShowReviewForm(false); fetchReviews(); checkCanReview(); }} onCancel={() => setShowReviewForm(false)} onClose={() => setShowReviewForm(false)} />
            </div>
          )}

          {loadingReviews ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-maroon border-t-transparent mx-auto mb-2" />
              <p className="text-sm text-slate-400">Fetching authentic feedback...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-maroon/10 flex items-center justify-center font-bold text-sm text-maroon">
                        {review.user?.name?.charAt(0) || review.guestName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">{review.user?.name || review.guestName || 'Anonymous'}</p>
                        <p className="text-[10px] text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex text-amber-500 gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFull = review.rating >= star;
                        const isHalf = !isFull && review.rating >= (star - 0.5);
                        return (
                          <div key={star} className="relative w-3.5 h-3.5">
                            <Star className="w-3.5 h-3.5 text-slate-200 dark:text-slate-700" />
                            {(isFull || isHalf) && <Star className="w-3.5 h-3.5 fill-current text-amber-500 absolute top-0 left-0" style={{ width: isFull ? '100%' : '50%', overflow: 'hidden' }} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">"{review.comment}"</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-14 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <MessageCircle className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-400 mb-0.5">{t('no_reviews_yet')}</h3>
              <p className="text-xs text-slate-400">{t('be_first_review')}</p>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5">{t('you_might_also_love')}</h2>
                <p className="text-sm text-slate-400">{t('curated_art_similar')}</p>
              </div>
              <Link to="/shop" className="text-sm font-semibold text-maroon hover:underline flex items-center gap-1">
                {t('view_all_collection')} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {relatedProducts.map((p) => <div key={p._id}><ProductItem product={p} /></div>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

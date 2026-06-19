import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import {
  ArrowRight, Sparkles, Star, Users, Award, Heart,
  ShoppingBag, Shirt, Gift, Clock, Package, Shield,
  Truck, Gem, TrendingUp
} from 'lucide-react';
import Seo from '@/components/Seo';
import { ProductCardSkeleton } from '@/components/Skeletons';
import { useSocket } from '@/contexts/socketContextBase';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/ProductItem';

const BannerSlider = lazy(() => import('@/components/BannerSlider'));
const Newsletter = lazy(() => import('@/components/Newsletter'));
const FlashSale = lazy(() => import('@/components/FlashSale'));
const HomeCategorySlider = lazy(() => import('@/components/HomeCategorySlider'));

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bestSellersLoading, setBestSellersLoading] = useState(true);
  const [hotOffer, setHotOffer] = useState(null);
  const { socket } = useSocket() || {};
  const { t, language } = useLanguage();

  useEffect(() => {
    fetchFeaturedProducts();
    fetchBestSellers();
    fetchCategories();
    fetchHotOffer();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleHotOffer = (data) => setHotOffer(data);
    socket.on('hot_offer:updated', handleHotOffer);
    socket.on('category:created', fetchCategories);
    socket.on('category:updated', fetchCategories);
    socket.on('category:deleted', fetchCategories);
    return () => {
      socket.off('hot_offer:updated', handleHotOffer);
      socket.off('category:created', fetchCategories);
      socket.off('category:updated', fetchCategories);
      socket.off('category:deleted', fetchCategories);
    };
  }, [socket]);

  const fetchHotOffer = async () => {
    try {
      const response = await api.get('/api/promotions/hot-offer');
      if (response.data) setHotOffer(response.data);
    } catch (_) {}
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      if (response.data.success) setCategories(response.data.categories);
    } catch (_) { setCategories(FALLBACK_CATEGORIES); }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/api/products?limit=12');
      setFeaturedProducts(response.data.products || []);
    } catch (_) { setFeaturedProducts(FALLBACK_PRODUCTS.slice(0, 12)); }
    finally { setLoading(false); }
  };

  const fetchBestSellers = async () => {
    try {
      const response = await api.get('/api/products?sort=popular&limit=10');
      setBestSellers(response.data.products || []);
    } catch (_) {
      try {
        const fallback = await api.get('/api/products?limit=10');
        setBestSellers(fallback.data.products || FALLBACK_PRODUCTS.slice(0, 8));
      } catch (_) { setBestSellers(FALLBACK_PRODUCTS.slice(0, 8)); }
    } finally { setBestSellersLoading(false); }
  };

  const featuredCategory =
    categories.find((c) => c.showOnHome && c.isActive) ||
    categories.find((c) => c.isActive && (c.productCount || 0) > 0) ||
    categories[0];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Seo
        title="RongRani | Handmade Gifts, Surprise Boxes & Delivery in Bangladesh"
        description="Handmade gifts, surprise boxes, jewelry, flowers, and decor with fast delivery across Bangladesh."
        path="/"
      />

      {/* ─── Hero Slider ─── */}
      <section className="w-full">
        <Suspense fallback={<div className="h-[400px] sm:h-[500px] md:h-[600px] w-full animate-pulse bg-slate-100 dark:bg-slate-800" />}>
          <BannerSlider />
        </Suspense>
      </section>

      {/* ─── Hot Offer ─── */}
      {hotOffer?.isActive && (
        <section className="py-3 px-4">
          <div className="section-container">
            <div
              className="rounded-2xl border border-rose-200/40 dark:border-rose-500/20 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
              style={{
                background: hotOffer.backgroundColor
                  ? `linear-gradient(135deg, ${hotOffer.backgroundColor}10, ${hotOffer.backgroundColor}08)`
                  : 'linear-gradient(135deg, rgba(253,226,228,0.5), rgba(252,200,206,0.3))',
              }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-maroon text-white text-[10px] font-bold uppercase tracking-wider shrink-0">
                  <Sparkles className="w-3 h-3 mr-1" /> {hotOffer.badgeText || t('hot_offer')}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{hotOffer.title}</p>
                  {hotOffer.subtitle && <p className="text-[11px] text-slate-500 truncate">{hotOffer.subtitle}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {hotOffer.discountText && <span className="text-lg font-bold text-maroon">{hotOffer.discountText}</span>}
                <Link to={hotOffer.ctaLink || '/shop'} className="px-4 py-1.5 bg-maroon text-white rounded-lg font-semibold text-xs hover:bg-maroon-dark transition-colors">
                  {hotOffer.ctaText || t('shop_now')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Flash Sale ─── */}
      <Suspense fallback={<div className="h-28 animate-pulse bg-slate-50 dark:bg-slate-800/50 mx-4 my-3 rounded-xl" />}>
        <FlashSale />
      </Suspense>

      {/* ─── Trust Badges ─── */}
      <section className="py-4 border-y border-slate-100 dark:border-slate-800/60">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Truck, title: language === 'bn' ? 'দ্রুত ডেলিভারি' : 'Fast Delivery', desc: language === 'bn' ? 'সারা বাংলাদেশে' : 'All over Bangladesh' },
              { icon: Shield, title: language === 'bn' ? 'নিরাপদ পেমেন্ট' : 'Secure Payment', desc: language === 'bn' ? '১০০% নিরাপদ' : '100% safe checkout' },
              { icon: Gem, title: language === 'bn' ? 'হস্তনির্মিত পণ্য' : 'Handmade Quality', desc: language === 'bn' ? 'স্থানীয় কারিগর' : 'By local artisans' },
              { icon: Heart, title: language === 'bn' ? 'গিফট র‍্যাপিং' : 'Gift Wrapping', desc: language === 'bn' ? 'প্রতিটি অর্ডারে বিনামূল্যে' : 'Free on every order' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-maroon" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-white leading-tight">{title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Shop by Category ─── */}
      <section className="section-spacing">
        <div className="section-container">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">{t('shop_by_category')}</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">{t('explore_diverse')}</p>
            </div>
            <Link to="/shop" className="text-xs sm:text-sm font-semibold text-maroon hover:underline flex items-center gap-1 shrink-0">
              {t('view_all')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="lg:hidden overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-2.5 min-w-max">
              {categories.slice(0, 8).map((category, index) => {
                const iconMap = { Heart, Sparkles, ShoppingBag, Gift, Star, Clock, Package, Shirt };
                const Icon = iconMap[category.icon] || Gift;
                const { gradient } = getCategoryGradient(category.color);
                return (
                  <Link key={category._id || index} to={`/shop?category=${category.name}`} className="flex-shrink-0 w-32 group">
                    <div className="rounded-xl p-3 text-left shadow-sm hover:shadow-md transition-all h-32 flex flex-col justify-between" style={{ background: gradient }}>
                      <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white truncate">{t('cat_' + category.name.toLowerCase().replace(/\s+/g, '_')) || category.name}</h3>
                        <p className="text-[9px] text-white/70 font-medium mt-0.5">
                          {category.productCount ? `${category.productCount} items` : 'Browse'}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
              <Link to="/shop" className="flex-shrink-0 w-32">
                <div className="bg-slate-800 dark:bg-slate-700 rounded-xl p-3 text-left shadow-sm hover:shadow-md transition-all h-32 flex flex-col justify-between">
                  <div className="bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center">
                    <Shirt className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{t('all_products')}</h3>
                    <p className="text-[9px] text-white/70 font-medium mt-0.5">{t('browse_everything')}</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Desktop grid */}
          <div className="hidden lg:grid grid-cols-4 xl:grid-cols-5 gap-3">
            {categories.slice(0, 7).map((category, index) => {
              const iconMap = { Heart, Sparkles, ShoppingBag, Gift, Star, Clock, Package, Shirt };
              const Icon = iconMap[category.icon] || Gift;
              const { gradient } = getCategoryGradient(category.color);
              return (
                <Link key={category._id || index} to={`/shop?category=${category.name}`} className="group rounded-xl overflow-hidden">
                  <div className="p-4 text-left shadow-sm hover:shadow-md transition-all h-36 flex flex-col justify-between" style={{ background: gradient }}>
                    <div className="bg-white/20 w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{t('cat_' + category.name.toLowerCase().replace(/\s+/g, '_')) || category.name}</h3>
                      <p className="text-[10px] text-white/80 font-medium mt-1">
                        {category.productCount ? `${category.productCount} items` : 'Explore'} →
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
            <Link to="/shop" className="group rounded-xl overflow-hidden">
              <div className="bg-slate-800 dark:bg-slate-700 p-4 text-left shadow-sm hover:shadow-md transition-all h-36 flex flex-col justify-between">
                <div className="bg-white/10 w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shirt className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{t('all_products')}</h3>
                  <p className="text-[10px] text-white/80 font-medium mt-1">View catalog →</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Best Sellers ─── */}
      <section className="section-spacing bg-slate-50/50 dark:bg-slate-900/50">
        <div className="section-container">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-maroon/5 dark:bg-pink-500/10 mb-2">
                <TrendingUp className="w-3 h-3 text-maroon dark:text-pink-400" />
                <span className="text-[10px] font-bold text-maroon dark:text-pink-400 uppercase tracking-wider">
                  {language === 'bn' ? 'সর্বাধিক বিক্রীত' : 'Best Sellers'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                {language === 'bn' ? 'জনপ্রিয় পণ্যসমূহ' : 'Most Popular Products'}
              </h2>
            </div>
            <Link to="/shop" className="text-xs sm:text-sm font-semibold text-maroon hover:underline flex items-center gap-1 shrink-0">
              {t('view_all')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {bestSellersLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {[...Array(10)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : bestSellers.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {bestSellers.slice(0, 10).map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
          ) : null}
        </div>
      </section>

      {/* ─── Category Slider ─── */}
      {featuredCategory && (
        <section className="section-spacing">
          <div className="section-container">
            <Suspense fallback={<div className="h-64 animate-pulse bg-slate-50 dark:bg-slate-800 rounded-xl" />}>
              <HomeCategorySlider category={featuredCategory} />
            </Suspense>
          </div>
        </section>
      )}

      {/* ─── Featured Products ─── */}
      <section className="section-spacing">
        <div className="section-container">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-maroon/5 dark:bg-pink-500/10 mb-2">
                <Sparkles className="w-3 h-3 text-maroon dark:text-pink-400" />
                <span className="text-[10px] font-bold text-maroon dark:text-pink-400 uppercase tracking-wider">
                  {t('premium_collection')}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">{t('featured_products')}</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">{t('handpicked_treasures')}</p>
            </div>
            <Link to="/shop" className="text-xs sm:text-sm font-semibold text-maroon hover:underline flex items-center gap-1 shrink-0">
              {t('view_all')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[...Array(12)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {featuredProducts.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-semibold text-sm transition-colors">
              {t('view_all_products')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Newsletter ─── */}
      <Suspense fallback={<div className="h-28 animate-pulse bg-slate-50 dark:bg-slate-800" />}>
        <Newsletter />
      </Suspense>

      {/* ─── Why Choose Us ─── */}
      <section className="section-spacing">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Award className="w-8 h-8 text-maroon mx-auto mb-2" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-1">{t('why_choose_us')}</h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto">{t('platform_connects')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { icon: Users, title: t('auth_artisans'), desc: t('auth_artisans_desc') },
                { icon: Award, title: t('quality_guarantee'), desc: t('quality_guarantee_desc') },
                { icon: Sparkles, title: t('cultural_heritage'), desc: t('cultural_heritage_desc') },
              ].map(({ icon: Icon, title, desc }, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 text-center hover:shadow-card transition-shadow">
                  <Icon className="w-7 h-7 text-maroon mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">{title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <Link to="/about" className="px-5 py-2 bg-maroon hover:bg-maroon-dark text-white rounded-xl font-semibold text-sm transition-colors">
                {t('learn_more')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ─── Helpers ─── */
const categoryColorGradients = {
  'bg-pink-600':    'linear-gradient(135deg, #EC4899, #DB2777)',
  'bg-maroon':      'linear-gradient(135deg, #B91C3C, #9B1830)',
  'bg-amber-500':   'linear-gradient(135deg, #F59E0B, #D97706)',
  'bg-amber-800':   'linear-gradient(135deg, #92400E, #78350F)',
  'bg-red-500':     'linear-gradient(135deg, #EF4444, #DC2626)',
  'bg-yellow-500':  'linear-gradient(135deg, #F59E0B, #EAB308)',
  'bg-slate-700':   'linear-gradient(135deg, #475569, #334155)',
  'bg-emerald-500': 'linear-gradient(135deg, #10B981, #059669)',
  'bg-purple-600':  'linear-gradient(135deg, #A855F7, #9333EA)',
  'bg-indigo-600':  'linear-gradient(135deg, #6366F1, #4F46E5)',
  'bg-teal-600':    'linear-gradient(135deg, #14B8A6, #0D9488)',
  'bg-rose-600':    'linear-gradient(135deg, #F43F5E, #E11D48)',
};

const getCategoryGradient = (color) => ({
  gradient: categoryColorGradients[color] || 'linear-gradient(135deg, #B91C3C, #9B1830)',
});

const FALLBACK_CATEGORIES = [
  { name: 'Love Combo',   icon: 'Heart',      color: 'bg-pink-600' },
  { name: 'Anniversary',  icon: 'Sparkles',    color: 'bg-maroon' },
  { name: 'Birthday',     icon: 'ShoppingBag', color: 'bg-amber-500' },
  { name: 'Valentine',    icon: 'Heart',       color: 'bg-red-500' },
];

const FALLBACK_PRODUCTS = [
  { _id: '1', name: 'Bamboo Basket Set',     price: 1800, images: [{ url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format,compress&q=60&w=300' }], category: 'home',     rating: 4.2 },
  { _id: '2', name: 'Clay Pottery Set',      price: 3200, images: [{ url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format,compress&q=60&w=300' }], category: 'home',     rating: 4.5 },
  { _id: '3', name: 'Handwoven Silk Scarf',  price: 2500, images: [{ url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format,compress&q=60&w=300' }], category: 'clothing', rating: 4.8 },
  { _id: '4', name: 'Handcrafted Gift Box',  price: 1500, images: [{ url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format,compress&q=60&w=300' }], category: 'gifts',    rating: 4.7 },
  { _id: '5', name: 'Wooden Jewelry Box',    price: 1200, images: [{ url: 'https://images.unsplash.com/photo-1512413314640-5391a29d5b4d?auto=format,compress&q=60&w=300' }], category: 'gifts',    rating: 4.6 },
  { _id: '6', name: 'Terracotta Vase',       price:  950, images: [{ url: 'https://images.unsplash.com/photo-1581264692636-357e1ad4fb05?auto=format,compress&q=60&w=300' }], category: 'home',     rating: 4.3 },
  { _id: '7', name: 'Embroidered Cushion',   price:  850, images: [{ url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format,compress&q=60&w=300' }], category: 'home',     rating: 4.4 },
  { _id: '8', name: 'Brass Oil Lamp',        price: 2200, images: [{ url: 'https://images.unsplash.com/photo-1510072021570-52e25f8b9cb9?auto=format,compress&q=60&w=300' }], category: 'decor',    rating: 4.9 },
];

export default Home;

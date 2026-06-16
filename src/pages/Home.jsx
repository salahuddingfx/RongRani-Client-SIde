import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import { ArrowRight, Sparkles, Star, Users, Award, Heart, ShoppingBag, Shirt, Gift, Clock, Package } from 'lucide-react';
import TypingEffect from '@/components/TypingEffect';
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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hotOffer, setHotOffer] = useState(null);
  const { socket } = useSocket() || {};
  const { t, language } = useLanguage();

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
    fetchHotOffer();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (data) => setHotOffer(data);

    socket.on('hot_offer:updated', handleUpdate);
    socket.on('category:created', fetchCategories);
    socket.on('category:updated', fetchCategories);
    socket.on('category:deleted', fetchCategories);

    return () => {
      socket.off('hot_offer:updated', handleUpdate);
      socket.off('category:created', fetchCategories);
      socket.off('category:updated', fetchCategories);
      socket.off('category:deleted', fetchCategories);
    };
  }, [socket]);

  const fetchHotOffer = async () => {
    try {
      const response = await api.get('/api/promotions/hot-offer');
      if (response.data) {
        setHotOffer(response.data);
      }
    } catch (error) {
      console.error('Error fetching hot offer:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(FALLBACK_CATEGORIES);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const isMobile = window.innerWidth < 768;
      const limit = isMobile ? 6 : 8;
      const response = await api.get(`/api/products?limit=${limit}`);
      setFeaturedProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      const isMobile = window.innerWidth < 768;
      setFeaturedProducts(FALLBACK_PRODUCTS.slice(0, isMobile ? 6 : 8));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDFD] via-[#FFF9FA] to-[#FFFDFD] dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-900 transition-colors duration-500">
      <Seo
        title="RongRani | Handmade Gifts, Surprise Boxes & Delivery in Bangladesh"
        description="Handmade gifts, surprise boxes, jewelry, flowers, and decor with fast delivery across Bangladesh. Custom orders and festive deals from RongRani."
        path="/"
      />

      {/* Hero Section - Premium Glassmorphic Mesh Design */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:py-24 md:py-32 min-h-[500px]">
        {/* Soft Background Blur Circles */}
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-rose-200/20 dark:bg-rose-950/15 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-amber-200/20 dark:bg-amber-950/10 blur-3xl pointer-events-none"></div>

        <div className="section-container relative z-10">
          <div className="max-w-5xl mx-auto text-center px-4">
            
            {/* Hot Offer Dynamic Banner */}
            {hotOffer?.isActive && (
              <div
                className="mb-8 rounded-3xl border border-rose-500/20 dark:border-rose-500/30 p-6 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.01]"
                style={{
                  background: hotOffer.backgroundColor 
                    ? `linear-gradient(135deg, ${hotOffer.backgroundColor}E0, ${hotOffer.backgroundColor}C0)`
                    : 'linear-gradient(135deg, rgba(253, 226, 228, 0.7), rgba(253, 200, 206, 0.5))'
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="text-left md:flex-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/80 text-maroon dark:text-pink-400 text-xs font-black shadow-sm uppercase tracking-wider">
                      ✨ {hotOffer.badgeText || t('hot_offer')}
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-maroon dark:text-rose-900 mt-2 tracking-tight">
                      {hotOffer.title}
                    </h3>
                    {hotOffer.subtitle && (
                      <p className="text-sm text-slate-700 dark:text-rose-950/80 mt-1 font-medium">{hotOffer.subtitle}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-start md:items-end justify-center">
                    {hotOffer.discountText && (
                      <div className="text-2xl font-black text-maroon dark:text-rose-900 tracking-tighter drop-shadow-sm">
                        {hotOffer.discountText}
                      </div>
                    )}
                    <Link
                      to={hotOffer.ctaLink || '/shop'}
                      className="inline-flex items-center mt-2 px-5 py-2.5 bg-maroon dark:bg-rose-800 hover:bg-maroon-dark text-white rounded-xl font-bold shadow-lg shadow-maroon/20 hover:scale-105 active:scale-95 transition-all text-sm"
                    >
                      {hotOffer.ctaText || t('shop_now')}
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-maroon/[0.04] dark:bg-pink-500/10 border border-maroon/10 dark:border-pink-500/20 mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4 text-maroon dark:text-pink-400 animate-pulse" />
              <span className="text-xs font-black text-maroon dark:text-pink-400 uppercase tracking-widest">
                {t('premium_collection')}
              </span>
            </div>

            {/* Main Heading with Typing Effect */}
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-slate-800 dark:text-white mb-6 tracking-tight leading-tight">
              {t('hero_title')}<br />
              <span className="bg-gradient-to-r from-maroon via-pink-600 to-rose-700 bg-clip-text text-transparent dark:from-pink-400 dark:to-rose-400 inline-block min-h-[1.4em]">
                <TypingEffect
                  texts={language === 'bn'
                    ? ['ভালোবাসা ও রোমান্স ❤️', 'विशेष মুহূর্ত ✨', 'হৃদয়স্পর্শী সারপ্রাইজ 🎁', 'হস্তনির্মিত অনন্য উপহার 🎨', 'প্রিয়জনের স্মৃতির পাতায় 📸', 'সেরা কোয়ালিটি গ্যারান্টি ⭐']
                    : ['Love & Romance ❤️', 'Special Moments ✨', 'Heartfelt Surprises 🎁', 'Unique Handmade Gifts 🎨', 'Memories That Last 📸', 'Premium Quality Guaranteed ⭐']
                  }
                  speed={window.innerWidth < 768 ? 120 : 80}
                  deleteSpeed={50}
                  pauseTime={2500}
                />
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-3xl mx-auto">
              {t('hero_subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link to="/shop" className="w-full sm:w-auto px-8 py-4 bg-maroon hover:bg-maroon-dark text-white rounded-2xl font-bold shadow-lg shadow-maroon/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-base flex items-center justify-center space-x-2 group">
                <span>{t('explore_collection')}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="w-full sm:w-auto px-8 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all text-base">
                {t('our_story')}
              </Link>
            </div>

            {/* Stats Block */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-white/40 dark:bg-slate-800/20 backdrop-blur-sm border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow-sm max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-maroon dark:text-pink-500 mb-1">
                  20+
                </div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{t('products_count')}</div>
              </div>
              <div className="text-center border-l border-slate-200/50 dark:border-slate-700/50">
                <div className="text-3xl md:text-4xl font-black text-maroon dark:text-pink-500 mb-1">
                  05+
                </div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{t('artisans_count')}</div>
              </div>
              <div className="text-center border-l border-slate-200/50 dark:border-slate-700/50">
                <div className="text-3xl md:text-4xl font-black text-maroon dark:text-pink-500 mb-1 flex items-center justify-center gap-1">
                  4.8 <Star className="h-5 w-5 fill-gold text-gold" />
                </div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{t('rating')}</div>
              </div>
              <div className="text-center border-l border-slate-200/50 dark:border-slate-700/50">
                <div className="text-3xl md:text-4xl font-black text-maroon dark:text-pink-500 mb-1">
                  100+
                </div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{t('customers_count')}</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Flash Sale Banner */}
      <Suspense fallback={<div className="h-40 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" />}>
        <FlashSale />
      </Suspense>

      {/* Top Banner Slider */}
      <section className="py-10 bg-transparent">
        <div className="section-container">
          <Suspense fallback={<div className="h-[400px] animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl" />}>
            <BannerSlider />
          </Suspense>
        </div>
      </section>

      {/* Category Section - Refined Glassmorphism Cards */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800/50">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-800 dark:text-white mb-4">
              {t('shop_by_category')}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto px-4">
              {t('explore_diverse')}
            </p>
          </div>

          {/* Horizontally scrollable list for mobile screens, Grid for desktops */}
          <div className="lg:hidden overflow-x-auto pb-6 -mx-4 px-4 scrollbar-none">
            <div className="flex space-x-4 min-w-max">
              {categories.slice(0, 8).map((category, index) => {
                const iconMap = {
                  'Heart': Heart,
                  'Sparkles': Sparkles,
                  'ShoppingBag': ShoppingBag,
                  'Gift': Gift,
                  'Star': Star,
                  'Clock': Clock,
                  'Package': Package,
                  'Shirt': Shirt,
                };
                const Icon = iconMap[category.icon] || Gift;
                const styleConfig = getCategoryGradient(category.color);
                return (
                  <Link
                    key={category._id || index}
                    to={`/shop?category=${category.name}`}
                    className="flex-shrink-0 w-48 group"
                  >
                    <div
                      className="rounded-3xl p-6 text-left shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1.5 border border-white/20 relative overflow-hidden h-48 flex flex-col justify-between"
                      style={{ background: styleConfig.gradient }}
                    >
                      <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-white/10 blur-xl group-hover:scale-125 transition-transform duration-500"></div>
                      <div className="bg-white/20 w-11 h-11 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white truncate">
                          {t('cat_' + category.name.toLowerCase().replace(/\s+/g, '_'))}
                        </h3>
                        <p className="text-[10px] text-white/90 font-bold uppercase tracking-wider mt-1">
                          {category.productCount ? `${category.productCount} items` : 'Browse Shop'}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
              <Link to="/shop" className="flex-shrink-0 w-48 group">
                <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-3xl p-6 text-left shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1.5 border border-white/20 h-48 flex flex-col justify-between">
                  <div className="bg-white/20 w-11 h-11 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Shirt className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">{t('all_products')}</h3>
                    <p className="text-[10px] text-white/90 font-bold uppercase tracking-wider mt-1">{t('browse_everything')}</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Desktop Categories Grid */}
          <div className="hidden lg:grid grid-cols-4 gap-6">
            {categories.slice(0, 7).map((category, index) => {
              const iconMap = {
                'Heart': Heart,
                'Sparkles': Sparkles,
                'ShoppingBag': ShoppingBag,
                'Gift': Gift,
                'Star': Star,
                'Clock': Clock,
                'Package': Package,
                'Shirt': Shirt,
              };
              const Icon = iconMap[category.icon] || Gift;
              const styleConfig = getCategoryGradient(category.color);
              return (
                <Link
                  key={category._id || index}
                  to={`/shop?category=${category.name}`}
                  className="group relative overflow-hidden rounded-3xl"
                >
                  <div
                    className="p-8 text-left shadow-lg transition-all duration-500 transform hover:-translate-y-2 border border-white/20 h-56 flex flex-col justify-between"
                    style={{ background: styleConfig.gradient }}
                  >
                    <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-white/10 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">
                        {t('cat_' + category.name.toLowerCase().replace(/\s+/g, '_'))}
                      </h3>
                      <p className="text-white/85 text-xs mt-1 font-medium line-clamp-2 max-w-[90%]">
                        {category.description ? (language === 'bn' && category.descriptionBn ? category.descriptionBn : category.description) : 'Explore bespoke handmade gift sets.'}
                      </p>
                      <div className="flex items-center justify-between text-xs text-white/90 mt-4 font-bold border-t border-white/10 pt-3">
                        <span>{category.productCount ? `${category.productCount} items` : 'Explore Items'}</span>
                        <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">{t('explore_more')} →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
            
            {/* View All Products Grid Block */}
            <Link to="/shop" className="group relative overflow-hidden rounded-3xl">
              <div className="bg-gradient-to-br from-teal-600 to-emerald-700 p-8 text-left shadow-lg transition-all duration-500 transform hover:-translate-y-2 border border-white/20 h-56 flex flex-col justify-between">
                <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-white/10 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Shirt className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{t('all_products')}</h3>
                  <p className="text-white/85 text-xs mt-1 font-medium">{t('browse_everything')}</p>
                  <div className="flex items-center justify-between text-xs text-white/90 mt-4 font-bold border-t border-white/10 pt-3">
                    <span>View catalog</span>
                    <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">{t('explore_more')} →</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Wise Sliders */}
      <section className="py-16 bg-slate-50/50 dark:bg-slate-800/10 overflow-hidden">
        <div className="section-container">
          {categories.length === 0 ? (
            <div className="text-center py-12 opacity-50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-12">
              {(() => {
                let displayCategories = categories.filter(c => c.showOnHome && c.isActive);

                if (displayCategories.length === 0) {
                  displayCategories = categories
                    .filter(c => c.isActive && (c.productCount > 0))
                    .sort((a, b) => (b.productCount || 0) - (a.productCount || 0))
                    .slice(0, 3);
                }

                if (displayCategories.length === 0) {
                  displayCategories = categories.filter(c => c.isActive).slice(0, 3);
                }

                return (
                  <Suspense fallback={<div className="h-64 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl my-4" />}>
                    {displayCategories.map((category, index) => (
                      <HomeCategorySlider key={category._id || index} category={category} />
                    ))}
                  </Suspense>
                );
              })()}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-cream-light/35 dark:bg-slate-900/40 relative">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-800 dark:text-white mb-4">
              {t('featured_products')}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto px-4">
              {t('handpicked_treasures')}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <Suspense key={product._id} fallback={<ProductCardSkeleton />}>
                  <ProductCard product={product} />
                </Suspense>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/shop" className="w-full sm:w-auto inline-flex justify-center px-8 py-4 border-2 border-maroon text-maroon hover:bg-maroon hover:text-white dark:border-pink-500 dark:text-pink-400 dark:hover:bg-pink-500 dark:hover:text-white rounded-2xl font-bold transition-all text-base shadow-sm hover:scale-105 active:scale-95 duration-300">
              {t('view_all_products')}
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Block */}
      <Suspense fallback={<div className="h-40 animate-pulse bg-slate-100 dark:bg-slate-800" />}>
        <Newsletter />
      </Suspense>

      {/* CTA Why Choose Us Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="section-container">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-cream-light/40 to-pink-50/10 dark:from-slate-800/30 dark:to-slate-900/10 border border-maroon/5 dark:border-slate-800 p-8 sm:p-12 md:p-16 rounded-[40px] text-center shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-pink-100/10 dark:bg-pink-900/5 rounded-full blur-2xl"></div>
              
              <Award className="h-14 w-14 text-maroon dark:text-pink-400 mx-auto mb-6" />
              <h2 className="text-2xl sm:text-4xl font-black text-slate-800 dark:text-white mb-4">
                {t('why_choose_us')}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg mb-12 max-w-2xl mx-auto font-medium">
                {t('platform_connects')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm p-8 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <Users className="h-10 w-10 text-maroon dark:text-pink-400 mx-auto mb-4" />
                  <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">{t('auth_artisans')}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t('auth_artisans_desc')}</p>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm p-8 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <Award className="h-10 w-10 text-maroon dark:text-pink-400 mx-auto mb-4" />
                  <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">{t('quality_guarantee')}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t('quality_guarantee_desc')}</p>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm p-8 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <Sparkles className="h-10 w-10 text-maroon dark:text-pink-400 mx-auto mb-4" />
                  <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">{t('cultural_heritage')}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t('cultural_heritage_desc')}</p>
                </div>
              </div>

              <div className="flex justify-center">
                <Link to="/about" className="px-8 py-4 bg-maroon hover:bg-maroon-dark text-white rounded-2xl font-bold shadow-lg shadow-maroon/20 hover:scale-105 active:scale-95 transition-all text-base">
                  {t('learn_more')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const categoryColorGradients = {
  'bg-pink-600': 'linear-gradient(135deg, #EC4899, #DB2777)',
  'bg-maroon': 'linear-gradient(135deg, #be123c, #9f1239)',
  'bg-amber-500': 'linear-gradient(135deg, #F59E0B, #D97706)',
  'bg-amber-800': 'linear-gradient(135deg, #92400E, #78350F)',
  'bg-red-500': 'linear-gradient(135deg, #EF4444, #DC2626)',
  'bg-yellow-500': 'linear-gradient(135deg, #F59E0B, #EAB308)',
  'bg-slate-700': 'linear-gradient(135deg, #475569, #334155)',
  'bg-emerald-500': 'linear-gradient(135deg, #10B981, #059669)',
  'bg-purple-600': 'linear-gradient(135deg, #A855F7, #9333EA)',
  'bg-indigo-600': 'linear-gradient(135deg, #6366F1, #4F46E5)',
  'bg-teal-600': 'linear-gradient(135deg, #14B8A6, #0D9488)',
  'bg-rose-600': 'linear-gradient(135deg, #F43F5E, #E11D48)',
};

const getCategoryGradient = (color) => {
  return { gradient: categoryColorGradients[color] || 'linear-gradient(135deg, #be123c, #9f1239)' };
};

const FALLBACK_CATEGORIES = [
  { name: 'Love Combo', slug: 'love-combo', icon: 'Heart', color: 'bg-pink-600' },
  { name: 'Anniversary', slug: 'anniversary-combo', icon: 'Sparkles', color: 'bg-maroon' },
  { name: 'Birthday', slug: 'birthday-combo', icon: 'ShoppingBag', color: 'bg-amber-500' },
  { name: 'Valentine', slug: 'valentine-combo', icon: 'Heart', color: 'bg-red-500' },
];

const FALLBACK_PRODUCTS = [
  { _id: '1', name: 'Bamboo Basket Set', price: 1800, images: [{ url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format,compress&q=60&w=300' }], category: 'home', rating: 4.2 },
  { _id: '2', name: 'Clay Pottery Set', price: 3200, images: [{ url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format,compress&q=60&w=300' }], category: 'home', rating: 4.5 },
  { _id: '3', name: 'Handwoven Silk Scarf', price: 2500, images: [{ url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format,compress&q=60&w=300' }], category: 'clothing', rating: 4.8 },
  { _id: '4', name: 'Handcrafted Gift Box', price: 1500, images: [{ url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format,compress&q=60&w=300' }], category: 'gifts', rating: 4.7 },
  { _id: '5', name: 'Wooden Jewelry Box', price: 1200, images: [{ url: 'https://images.unsplash.com/photo-1512413314640-5391a29d5b4d?auto=format,compress&q=60&w=300' }], category: 'gifts', rating: 4.6 },
  { _id: '6', name: 'Terracotta Vase', price: 950, images: [{ url: 'https://images.unsplash.com/photo-1581264692636-357e1ad4fb05?auto=format,compress&q=60&w=300' }], category: 'home', rating: 4.3 },
  { _id: '7', name: 'Embroidered Cushion', price: 850, images: [{ url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format,compress&q=60&w=300' }], category: 'home', rating: 4.4 },
  { _id: '8', name: 'Brass Oil Lamp', price: 2200, images: [{ url: 'https://images.unsplash.com/photo-1510072021570-52e25f8b9cb9?auto=format,compress&q=60&w=300' }], category: 'decor', rating: 4.9 },
];

export default Home;
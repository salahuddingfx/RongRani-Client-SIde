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
    } catch (error) {
      console.error('Error fetching hot offer:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      if (response.data.success) setCategories(response.data.categories);
    } catch (error) {
      setCategories(FALLBACK_CATEGORIES);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/api/products?limit=12');
      setFeaturedProducts(response.data.products || []);
    } catch (error) {
      setFeaturedProducts(FALLBACK_PRODUCTS.slice(0, 12));
    } finally {
      setLoading(false);
    }
  };

  const fetchBestSellers = async () => {
    try {
      const response = await api.get('/api/products?sort=popular&limit=10');
      const products = response.data.products || [];
      setBestSellers(products.length > 0 ? products : []);
    } catch (error) {
      try {
        const fallback = await api.get('/api/products?limit=10');
        setBestSellers(fallback.data.products || FALLBACK_PRODUCTS.slice(0, 8));
      } catch (_) {
        setBestSellers(FALLBACK_PRODUCTS.slice(0, 8));
      }
    } finally {
      setBestSellersLoading(false);
    }
  };

  // Pick a single featured category for the category slider
  const featuredCategory =
    categories.find((c) => c.showOnHome && c.isActive) ||
    categories.find((c) => c.isActive && (c.productCount || 0) > 0) ||
    categories[0];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <Seo
        title="RongRani | Handmade Gifts, Surprise Boxes & Delivery in Bangladesh"
        description="Handmade gifts, surprise boxes, jewelry, flowers, and decor with fast delivery across Bangladesh. Custom orders and festive deals from RongRani."
        path="/"
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          [1] HERO SLIDER — Primary hero, full width
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="w-full">
        <Suspense
          fallback={
            <div className="h-[400px] sm:h-[500px] md:h-[600px] w-full animate-pulse bg-slate-100 dark:bg-slate-800" />
          }
        >
          <BannerSlider />
        </Suspense>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          [2] HOT OFFER STRIP — Conditional, compact
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {hotOffer?.isActive && (
        <section className="py-3 px-4">
          <div className="section-container">
            <div
              className="rounded-2xl border border-rose-400/20 dark:border-rose-500/20 px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:shadow-md transition-all duration-300"
              style={{
                background: hotOffer.backgroundColor
                  ? `linear-gradient(135deg, ${hotOffer.backgroundColor}D8, ${hotOffer.backgroundColor}B0)`
                  : 'linear-gradient(135deg, rgba(253,226,228,0.9), rgba(252,200,206,0.7))',
              }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/95 dark:bg-white/90 text-maroon text-[10px] font-black shadow-sm uppercase tracking-wider shrink-0">
                  <Sparkles className="inline-block w-3.5 h-3.5" /> {hotOffer.badgeText || t('hot_offer')}
                </span>
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-black text-maroon truncate">{hotOffer.title}</p>
                  {hotOffer.subtitle && (
                    <p className="text-[11px] text-slate-700 font-medium truncate">{hotOffer.subtitle}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {hotOffer.discountText && (
                  <span className="text-lg font-black text-maroon tracking-tighter">{hotOffer.discountText}</span>
                )}
                <Link
                  to={hotOffer.ctaLink || '/shop'}
                  className="px-4 py-2 bg-maroon text-white rounded-xl font-bold shadow hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm whitespace-nowrap"
                >
                  {hotOffer.ctaText || t('shop_now')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          [3] FLASH SALE — Conditional
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Suspense fallback={<div className="h-32 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl mx-4 my-3" />}>
        <FlashSale />
      </Suspense>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          [4] TRUST BADGES STRIP
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-5 border-y border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/20">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                icon: Truck,
                title: language === 'bn' ? 'দ্রুত ডেলিভারি' : 'Fast Delivery',
                desc: language === 'bn' ? 'সারা বাংলাদেশে' : 'All over Bangladesh',
              },
              {
                icon: Shield,
                title: language === 'bn' ? 'নিরাপদ পেমেন্ট' : 'Secure Payment',
                desc: language === 'bn' ? '১০০% নিরাপদ' : '100% safe checkout',
              },
              {
                icon: Gem,
                title: language === 'bn' ? 'হস্তনির্মিত পণ্য' : 'Handmade Quality',
                desc: language === 'bn' ? 'স্থানীয় কারিগর' : 'By local artisans',
              },
              {
                icon: Heart,
                title: language === 'bn' ? 'গিফট র‍্যাপিং' : 'Gift Wrapping',
                desc: language === 'bn' ? 'প্রতিটি অর্ডারে বিনামূল্যে' : 'Free on every order',
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 sm:p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-50 dark:bg-maroon/20 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-maroon dark:text-pink-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-white leading-tight">{title}</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          [5] SHOP BY CATEGORY
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-10 md:py-14">
        <div className="section-container">
          {/* Section Header */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-800 dark:text-white">
                {t('shop_by_category')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t('explore_diverse')}
              </p>
            </div>
            <Link
              to="/shop"
              className="text-xs sm:text-sm font-bold text-maroon dark:text-pink-400 hover:underline flex items-center gap-1 shrink-0"
            >
              {t('view_all')} <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </div>

          {/* Mobile: Horizontal Scroll */}
          <div className="lg:hidden overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none">
            <div className="flex space-x-3 min-w-max">
              {categories.slice(0, 8).map((category, index) => {
                const iconMap = { Heart, Sparkles, ShoppingBag, Gift, Star, Clock, Package, Shirt };
                const Icon = iconMap[category.icon] || Gift;
                const { gradient } = getCategoryGradient(category.color);
                return (
                  <Link
                    key={category._id || index}
                    to={`/shop?category=${category.name}`}
                    className="flex-shrink-0 w-36 group"
                  >
                    <div
                      className="rounded-2xl p-4 text-left shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20 h-36 flex flex-col justify-between"
                      style={{ background: gradient }}
                    >
                      <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-white/10 blur-lg group-hover:scale-125 transition-transform duration-500" />
                      <div className="bg-white/20 w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white truncate leading-tight">
                          {t('cat_' + category.name.toLowerCase().replace(/\s+/g, '_')) || category.name}
                        </h3>
                        <p className="text-[9px] text-white/80 font-bold uppercase tracking-wider mt-0.5">
                          {category.productCount ? `${category.productCount} items` : 'Browse'}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
              {/* View All tile */}
              <Link to="/shop" className="flex-shrink-0 w-36 group">
                <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20 h-36 flex flex-col justify-between">
                  <div className="bg-white/20 w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shirt className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">{t('all_products')}</h3>
                    <p className="text-[9px] text-white/80 font-bold uppercase tracking-wider mt-0.5">
                      {t('browse_everything')}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-4 xl:grid-cols-5 gap-4">
            {categories.slice(0, 7).map((category, index) => {
              const iconMap = { Heart, Sparkles, ShoppingBag, Gift, Star, Clock, Package, Shirt };
              const Icon = iconMap[category.icon] || Gift;
              const { gradient } = getCategoryGradient(category.color);
              return (
                <Link
                  key={category._id || index}
                  to={`/shop?category=${category.name}`}
                  className="group relative overflow-hidden rounded-2xl"
                >
                  <div
                    className="p-5 text-left shadow-lg transition-all duration-500 transform hover:-translate-y-1.5 border border-white/20 h-44 flex flex-col justify-between"
                    style={{ background: gradient }}
                  >
                    <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-white/10 blur-xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white leading-snug">
                        {t('cat_' + category.name.toLowerCase().replace(/\s+/g, '_')) || category.name}
                      </h3>
                      <div className="flex items-center justify-between text-[10px] text-white/90 mt-2 font-bold border-t border-white/10 pt-2">
                        <span>{category.productCount ? `${category.productCount} items` : 'Explore'}</span>
                        <span className="group-hover:translate-x-1 transition-transform">{t('explore_more')} →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
            {/* View All tile */}
            <Link to="/shop" className="group relative overflow-hidden rounded-2xl">
              <div className="bg-gradient-to-br from-teal-600 to-emerald-700 p-5 text-left shadow-lg transition-all duration-500 transform hover:-translate-y-1.5 border border-white/20 h-44 flex flex-col justify-between">
                <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-white/10 blur-xl group-hover:scale-150 transition-transform duration-700" />
                <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shirt className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">{t('all_products')}</h3>
                  <div className="flex items-center justify-between text-[10px] text-white/90 mt-2 font-bold border-t border-white/10 pt-2">
                    <span>View catalog</span>
                    <span className="group-hover:translate-x-1 transition-transform">{t('explore_more')} →</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          [6] BEST SELLERS — New section
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-10 md:py-14 bg-gradient-to-b from-rose-50/50 to-white dark:from-slate-800/30 dark:to-slate-900">
        <div className="section-container">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-maroon/[0.07] border border-maroon/10 dark:bg-pink-500/10 dark:border-pink-500/20 mb-2">
                <TrendingUp className="h-3.5 w-3.5 text-maroon dark:text-pink-400" />
                <span className="text-[10px] font-black text-maroon dark:text-pink-400 uppercase tracking-widest">
                  {language === 'bn' ? 'সর্বাধিক বিক্রীত' : 'Best Sellers'}
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-800 dark:text-white">
                {language === 'bn' ? 'জনপ্রিয় পণ্যসমূহ' : 'Most Popular Products'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {language === 'bn' ? 'গ্রাহকদের পছন্দের সেরা পণ্যগুলি' : "Our customers' all-time favourites"}
              </p>
            </div>
            <Link
              to="/shop"
              className="text-xs sm:text-sm font-bold text-maroon dark:text-pink-400 hover:underline flex items-center gap-1 shrink-0"
            >
              {t('view_all')} <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </div>

          {bestSellersLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {[...Array(10)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : bestSellers.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {bestSellers.slice(0, 10).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          [7] CATEGORY SLIDER — Single featured category
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {featuredCategory && (
        <section className="py-8 md:py-12 overflow-hidden bg-slate-50/50 dark:bg-slate-800/10">
          <div className="section-container">
            <Suspense
              fallback={
                <div className="h-64 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />
              }
            >
              <HomeCategorySlider category={featuredCategory} />
            </Suspense>
          </div>
        </section>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          [8] FEATURED PRODUCTS — 12 products
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-10 md:py-14">
        <div className="section-container">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-maroon/[0.07] border border-maroon/10 dark:bg-pink-500/10 dark:border-pink-500/20 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-maroon dark:text-pink-400 animate-pulse" />
                <span className="text-[10px] font-black text-maroon dark:text-pink-400 uppercase tracking-widest">
                  {t('premium_collection')}
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-800 dark:text-white">
                {t('featured_products')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t('handpicked_treasures')}
              </p>
            </div>
            <Link
              to="/shop"
              className="text-xs sm:text-sm font-bold text-maroon dark:text-pink-400 hover:underline flex items-center gap-1 shrink-0"
            >
              {t('view_all')} <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(12)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-7 py-3 border-2 border-maroon text-maroon hover:bg-maroon hover:text-white dark:border-pink-500 dark:text-pink-400 dark:hover:bg-pink-500 dark:hover:text-white rounded-2xl font-bold transition-all text-sm shadow-sm hover:scale-105 active:scale-95 duration-300"
            >
              {t('view_all_products')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          [9] NEWSLETTER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Suspense fallback={<div className="h-32 animate-pulse bg-slate-100 dark:bg-slate-800" />}>
        <Newsletter />
      </Suspense>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          [10] WHY CHOOSE US — Compact
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-10 md:py-14 bg-white dark:bg-slate-900">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Award className="h-10 w-10 text-maroon dark:text-pink-400 mx-auto mb-3" />
              <h2 className="text-xl sm:text-3xl font-black text-slate-800 dark:text-white mb-2">
                {t('why_choose_us')}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                {t('platform_connects')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Users, title: t('auth_artisans'), desc: t('auth_artisans_desc') },
                { icon: Award, title: t('quality_guarantee'), desc: t('quality_guarantee_desc') },
                { icon: Sparkles, title: t('cultural_heritage'), desc: t('cultural_heritage_desc') },
              ].map(({ icon: Icon, title, desc }, i) => (
                <div
                  key={i}
                  className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] text-center"
                >
                  <Icon className="h-8 w-8 text-maroon dark:text-pink-400 mx-auto mb-3" />
                  <h3 className="text-base font-black text-slate-800 dark:text-white mb-1.5">{title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <Link
                to="/about"
                className="px-6 py-2.5 bg-maroon hover:bg-maroon-dark text-white rounded-xl font-bold shadow-lg shadow-maroon/20 hover:scale-105 active:scale-95 transition-all text-sm"
              >
                {t('learn_more')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Helpers & Static Data
───────────────────────────────────────────── */
const categoryColorGradients = {
  'bg-pink-600':   'linear-gradient(135deg, #EC4899, #DB2777)',
  'bg-maroon':     'linear-gradient(135deg, #be123c, #9f1239)',
  'bg-amber-500':  'linear-gradient(135deg, #F59E0B, #D97706)',
  'bg-amber-800':  'linear-gradient(135deg, #92400E, #78350F)',
  'bg-red-500':    'linear-gradient(135deg, #EF4444, #DC2626)',
  'bg-yellow-500': 'linear-gradient(135deg, #F59E0B, #EAB308)',
  'bg-slate-700':  'linear-gradient(135deg, #475569, #334155)',
  'bg-emerald-500':'linear-gradient(135deg, #10B981, #059669)',
  'bg-purple-600': 'linear-gradient(135deg, #A855F7, #9333EA)',
  'bg-indigo-600': 'linear-gradient(135deg, #6366F1, #4F46E5)',
  'bg-teal-600':   'linear-gradient(135deg, #14B8A6, #0D9488)',
  'bg-rose-600':   'linear-gradient(135deg, #F43F5E, #E11D48)',
};

const getCategoryGradient = (color) => ({
  gradient: categoryColorGradients[color] || 'linear-gradient(135deg, #be123c, #9f1239)',
});

const FALLBACK_CATEGORIES = [
  { name: 'Love Combo',   icon: 'Heart',       color: 'bg-pink-600'  },
  { name: 'Anniversary',  icon: 'Sparkles',     color: 'bg-maroon'    },
  { name: 'Birthday',     icon: 'ShoppingBag',  color: 'bg-amber-500' },
  { name: 'Valentine',    icon: 'Heart',        color: 'bg-red-500'   },
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
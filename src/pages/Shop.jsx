import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductItem from '../components/ProductItem';
import { Search, Filter, X, Star, ChevronDown } from 'lucide-react';
import Seo from '../components/Seo';
import { useSocket } from '../contexts/socketContextBase';
import { useLanguage } from '../contexts/LanguageContext';

const Shop = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'createdAt'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 12;
  const { socket } = useSocket() || {};

  useEffect(() => {
    setFilters({
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      search: searchParams.get('search') || '',
      sort: searchParams.get('sort') || 'createdAt'
    });
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => { if (value) params.append(key, value); });
      params.append('page', currentPage);
      params.append('limit', productsPerPage);
      const response = await axios.get(`/api/products?${params}`);
      setProducts(response.data.products);
      setTotalProducts(response.data.total);
      setTotalPages(Math.ceil(response.data.total / productsPerPage));
    } catch (_) {
      let filtered = FALLBACK_PRODUCTS;
      if (filters.search) { const s = filters.search.toLowerCase(); filtered = filtered.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)); }
      if (filters.category) filtered = filtered.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
      if (filters.minPrice) filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice));
      if (filters.maxPrice) filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice));
      const start = (currentPage - 1) * productsPerPage;
      setProducts(filtered.slice(start, start + productsPerPage));
      setTotalProducts(filtered.length);
      setTotalPages(Math.ceil(filtered.length / productsPerPage));
    } finally { setLoading(false); }
  }, [filters, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/products/categories');
      setCategories(response.data);
    } catch (_) {
      setCategories(['Love Combo', 'Anniversary Combo', 'Birthday Combo', 'Valentine Combo', 'Proposal Combo', 'Jewellery', 'Watches', 'Chocolates', 'Gifts', 'Handmade', 'Clothing', 'Gift Boxes']);
    }
  };

  useEffect(() => { fetchProducts(); fetchCategories(); }, [fetchProducts, currentPage]);

  useEffect(() => {
    if (!socket) return;
    socket.on('product:created', fetchProducts);
    socket.on('product:updated', fetchProducts);
    socket.on('product:deleted', fetchProducts);
    socket.on('category:created', fetchCategories);
    socket.on('category:updated', fetchCategories);
    socket.on('category:deleted', fetchCategories);
    return () => {
      socket.off('product:created', fetchProducts);
      socket.off('product:updated', fetchProducts);
      socket.off('product:deleted', fetchProducts);
      socket.off('category:created', fetchCategories);
      socket.off('category:updated', fetchCategories);
      socket.off('category:deleted', fetchCategories);
    };
  }, [socket, fetchProducts, fetchCategories]);

  useEffect(() => { if (window.innerWidth >= 1024) setShowFilters(true); }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => { if (v) params.set(k, v); });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '', search: '', sort: 'createdAt' });
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen">
      <Seo title="Shop Handmade Gifts & Surprise Boxes | RongRani" description="Browse handmade gifts, surprise boxes, jewelry, chocolates, and decor." path="/shop" />

      {/* Hero */}
      <section className="py-12 sm:py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3">
            {t('shop_hero_title')}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto mb-6">
            {t('shop_hero_subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-maroon">{totalProducts || 500}+</div>
              <div className="text-xs text-slate-400">{t('products_count')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-maroon">50+</div>
              <div className="text-xs text-slate-400">{t('artisans_count')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-maroon inline-flex items-center gap-1">4.8<Star className="w-4 h-4 fill-amber-400 text-amber-400" /></div>
              <div className="text-xs text-slate-400">{t('rating')}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{t('shop_collection')}</h2>
            <p className="text-sm text-slate-400">{t('shop_collection_subtitle')}</p>
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none">
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-10 pr-4 py-2.5 w-full lg:w-72"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary px-4 py-2.5 flex items-center gap-2 text-sm shrink-0">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">{showFilters ? t('hide_filters') : t('show_filters')}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} w-full lg:w-72 shrink-0`}>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 lg:sticky lg:top-28">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-slate-800 dark:text-white">{t('filters_label')}</h3>
                <div className="flex items-center gap-2">
                  <button onClick={clearFilters} className="text-xs text-slate-400 hover:text-maroon transition-colors">{t('clear_all')}</button>
                  <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('category_label').replace(':', '')}</label>
                <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)} className="input-field py-2.5 text-sm">
                  <option value="">{t('all_categories')}</option>
                  {categories && categories.map((category) => (
                    <option key={category._id || category.name || category} value={typeof category === 'string' ? category : category.name}>
                      {t('cat_' + (typeof category === 'string' ? category : category.name).toLowerCase().replace(/\s+/g, '_'))}
                      {typeof category === 'object' && category.productCount ? ` (${category.productCount})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('price_range')} (৳)</label>
                <div className="flex gap-2">
                  <input type="number" placeholder={t('min_price')} value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)} className="input-field py-2.5 text-sm flex-1" />
                  <input type="number" placeholder={t('max_price')} value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)} className="input-field py-2.5 text-sm flex-1" />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('sort_by')}</label>
                <select value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)} className="input-field py-2.5 text-sm">
                  <option value="createdAt">{t('newest_first')}</option>
                  <option value="price">{t('price_low_high')}</option>
                  <option value="-price">{t('price_high_low')}</option>
                  <option value="name">{t('name_a_z')}</option>
                  <option value="-name">{t('name_z_a')}</option>
                </select>
              </div>

              <button onClick={clearFilters} className="w-full btn-secondary py-2.5 text-sm">{t('reset_filters')}</button>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-maroon border-t-transparent" />
              </div>
            ) : products && products.length > 0 ? (
              <>
                <p className="text-sm text-slate-400 mb-4">{t('showing_products').replace('{count}', products.length)}</p>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {products.map((product, index) => (
                    <div key={product._id} className="animate-fade-in" style={{ animationDelay: `${index * 0.03}s` }}>
                      <ProductItem product={product} />
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-1.5 mt-10">
                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                      {t('previous')}
                    </button>
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                        return (
                          <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum ? 'bg-maroon text-white' : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                            {pageNum}
                          </button>
                        );
                      } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                        return <span key={pageNum} className="px-1 text-slate-400">...</span>;
                      }
                      return null;
                    })}
                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                      {t('next')}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <Search className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{t('no_products_found_msg')}</h3>
                <p className="text-sm text-slate-400 mb-4">{t('try_adjust_filters')}</p>
                <button onClick={clearFilters} className="btn-primary px-6 py-2 text-sm">{t('clear_all')}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FALLBACK_PRODUCTS = [
  { _id: '1', name: 'Gold Plated Party Necklace', description: 'Elegant gold plated necklace', price: 2500, originalPrice: 3200, images: [{ url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400' }], stock: 15, category: 'Jewellery', rating: 4.8 },
  { _id: '2', name: 'Designer Bangles Set', description: 'Beautiful set of 4 designer bangles', price: 1800, originalPrice: 2200, images: [{ url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400' }], stock: 20, category: 'Jewellery', rating: 4.7 },
  { _id: '3', name: 'Couple Rings Set', description: 'Matching couple rings', price: 3500, originalPrice: 4200, images: [{ url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400' }], stock: 12, category: 'Jewellery', rating: 4.9 },
  { _id: '4', name: 'Jhumka Earrings', description: 'Traditional jhumka earrings', price: 1200, originalPrice: 1500, images: [{ url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400' }], stock: 25, category: 'Jewellery', rating: 4.6 },
  { _id: '5', name: 'Ladies Elegant Watch', description: 'Stylish ladies watch', price: 4500, originalPrice: 5500, images: [{ url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400' }], stock: 10, category: 'Watches', rating: 4.8 },
  { _id: '6', name: 'Couple Watch Set', description: 'Matching his & her watch set', price: 7500, originalPrice: 9000, images: [{ url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400' }], stock: 8, category: 'Watches', rating: 4.9 },
  { _id: '7', name: 'Premium Chocolate Gift Box', description: 'Assorted chocolates', price: 1500, originalPrice: 1800, images: [{ url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400' }], stock: 30, category: 'Chocolates', rating: 4.7 },
  { _id: '8', name: 'Heart Shape Chocolate Box', description: 'Romantic heart-shaped box', price: 2200, originalPrice: 2500, images: [{ url: 'https://images.unsplash.com/photo-1548848774-1f1db32f8e20?w=400' }], stock: 18, category: 'Chocolates', rating: 4.9 },
  { _id: '9', name: 'Large Teddy Bear', description: 'Cute and cuddly teddy bear', price: 1800, originalPrice: 2200, images: [{ url: 'https://images.unsplash.com/photo-1560012057-71269d46f5f8?w=400' }], stock: 15, category: 'Gifts', rating: 4.8 },
  { _id: '10', name: 'Artificial Rose Bouquet', description: 'Beautiful artificial rose bouquet', price: 800, originalPrice: 1000, images: [{ url: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400' }], stock: 40, category: 'Gifts', rating: 4.5 },
  { _id: '11', name: 'Love Combo - RongRani Special', description: 'Handwritten love letter + chocolate + flower', price: 2500, originalPrice: 3000, images: [{ url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400' }], stock: 12, category: 'Love Combo', rating: 5.0 },
  { _id: '12', name: 'Ring + Teddy + Chocolate Combo', description: 'Perfect romantic surprise combo', price: 4500, originalPrice: 5500, images: [{ url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400' }], stock: 8, category: 'Love Combo', rating: 4.9 },
  { _id: '13', name: 'Birthday Gift Box', description: 'Complete birthday surprise', price: 3500, originalPrice: 4200, images: [{ url: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400' }], stock: 10, category: 'Birthday Combo', rating: 4.8 },
  { _id: '14', name: 'Anniversary Surprise Box', description: 'Necklace + bangles + love note combo', price: 5500, originalPrice: 6800, images: [{ url: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400' }], stock: 6, category: 'Anniversary Combo', rating: 5.0 },
  { _id: '15', name: 'Premium Gift Sharee', description: 'Beautiful gift-wrapped sharee', price: 6500, originalPrice: 8000, images: [{ url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400' }], stock: 5, category: 'Clothing', rating: 4.9 },
  { _id: '16', name: 'Handwritten Love Letter', description: 'Personalized handwritten love letter', price: 500, images: [{ url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400' }], stock: 50, category: 'Handmade', rating: 4.9 },
  { _id: '17', name: 'Memory Scrap Book', description: 'Custom photo memory scrapbook', price: 1500, originalPrice: 1800, images: [{ url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400' }], stock: 15, category: 'Handmade', rating: 4.8 },
  { _id: '18', name: 'Valentine Special Combo', description: 'Ring + roses + chocolate + love letter', price: 6500, originalPrice: 7800, images: [{ url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400' }], stock: 10, category: 'Valentine Combo', rating: 5.0 },
  { _id: '19', name: 'Proposal Gift Box', description: 'Complete proposal setup', price: 8500, originalPrice: 10000, images: [{ url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400' }], stock: 5, category: 'Proposal Combo', rating: 5.0 },
  { _id: '20', name: 'Premium Luxury Gift Box', description: 'Customizable luxury gift box', price: 9500, originalPrice: 12000, images: [{ url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400' }], stock: 8, category: 'Gift Boxes', rating: 4.9 },
];

export default Shop;

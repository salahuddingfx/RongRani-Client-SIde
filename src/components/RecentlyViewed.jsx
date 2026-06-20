import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const RecentlyViewed = ({ mode = 'widget' }) => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const scrollRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    const loadRecentlyViewed = () => {
      const stored = localStorage.getItem('recentlyViewed');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setRecentProducts(parsed.slice(0, 8));
        } catch (error) {
          console.error('Error parsing recently viewed:', error);
        }
      }
    };

    loadRecentlyViewed();

    const handleStorage = () => loadRecentlyViewed();
    window.addEventListener('recentlyViewedUpdated', handleStorage);

    const handleScroll = () => {
      setIsVisible(window.pageYOffset > 500 && recentProducts.length > 0);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('recentlyViewedUpdated', handleStorage);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [recentProducts.length]);

  const clearRecent = () => {
    localStorage.removeItem('recentlyViewed');
    setRecentProducts([]);
  };

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  const isWidget = mode === 'widget';

  if (!recentProducts.length) return null;
  if (isWidget && !isVisible) return null;

  if (mode === 'section') {
    return (
      <div className="mt-12 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-maroon/10 dark:bg-maroon/20 flex items-center justify-center">
              <Eye className="h-4.5 w-4.5 text-maroon" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('recently_viewed') || 'Recently Viewed'}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">{recentProducts.length} products</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll('left')} className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-400">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => scroll('right')} className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-400">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {recentProducts.map((product, index) => (
            <Link
              key={product._id || index}
              to={`/product/${product.slug || product._id}`}
              className="flex-shrink-0 w-[160px] sm:w-[180px] snap-start group"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:border-maroon/20 dark:hover:border-maroon/30 transition-all duration-300">
                <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-700/50">
                  <img
                    src={product.images?.[0]?.url || product.images?.[0] || 'https://via.placeholder.com/200'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg px-2.5 py-1 text-center">
                      <span className="text-[10px] font-semibold text-maroon">{t('view_details') || 'View Details'}</span>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-xs mb-1.5 line-clamp-2 group-hover:text-maroon transition-colors leading-relaxed">
                    {product.name}
                  </h4>
                  <p className="text-maroon font-bold text-sm">
                    ৳{product.price?.toLocaleString()}
                  </p>
                  {product.category && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 capitalize">{product.category}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-28 sm:bottom-36 left-2 sm:left-4 z-40 transition-all duration-300 ${isExpanded ? 'w-72' : 'w-12'}`}>
      {isExpanded ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-slide-in-left">
          {/* Header */}
          <div className="bg-gradient-to-r from-maroon/5 to-maroon/10 dark:from-maroon/10 dark:to-maroon/5 px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-maroon/10 dark:bg-maroon/20 flex items-center justify-center">
                <Eye className="h-3.5 w-3.5 text-maroon" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{t('recently_viewed') || 'Recently Viewed'}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={clearRecent} className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" aria-label="Clear recent">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Products */}
          <div className="max-h-64 overflow-y-auto">
            {recentProducts.slice(0, 4).map((product, index) => (
              <Link
                key={product._id || index}
                to={`/product/${product.slug || product._id}`}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group border-b border-slate-50 dark:border-slate-700/50 last:border-0"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                  <img
                    src={product.images?.[0]?.url || product.images?.[0] || 'https://via.placeholder.com/80'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate group-hover:text-maroon transition-colors">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs font-bold text-maroon">৳{product.price?.toLocaleString()}</p>
                    {product.category && (
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 capitalize truncate">{product.category}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          {recentProducts.length > 4 && (
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
                +{recentProducts.length - 4} more products
              </p>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center text-maroon hover:shadow-2xl hover:scale-110 transition-all"
          aria-label="Show recently viewed"
        >
          <Eye className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default RecentlyViewed;

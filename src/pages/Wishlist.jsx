import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, Package, Star } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';
import Seo from '../components/Seo';

const Wishlist = () => {
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { t } = useLanguage();

  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  const getImageUrl = (item) => {
    if (!item.images || item.images.length === 0) {
      return item.image?.url || item.image || '/placeholder.jpg';
    }
    const first = item.images[0];
    return typeof first === 'string' ? first : first.url;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-900/40">
        <Seo title="My Wishlist | RongRani" description="Your favorite items saved for later." path="/wishlist" />
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-maroon/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-10 w-10 text-maroon" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            {t('wishlist_empty') || 'Your Wishlist is Empty'}
          </h2>
          <p className="text-slate-500 mb-8">
            {t('wishlist_empty_msg') || 'Start adding your favorite gift items to your wishlist'}
          </p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-maroon text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-maroon/90 transition-colors">
            <Package className="h-4 w-4" />
            <span>{t('browse_products') || 'Browse Products'}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 py-8 px-4">
      <Seo title="My Wishlist | RongRani" description="Your favorite items saved for later." path="/wishlist" />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-maroon/10 rounded-xl">
              <Heart className="h-5 w-5 text-maroon fill-maroon" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {t('my_wishlist') || 'My Wishlist'}
            </h1>
          </div>
          <p className="text-slate-500 max-w-xl">
            {t('wishlist_subtitle') || 'Save your favorite gift items and complete your purchase when you\'re ready.'}
          </p>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-700">
                <Link to={`/product/${item.slug || item._id}`}>
                  <img
                    src={getImageUrl(item)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                {item.originalPrice > item.price && (
                  <div className="absolute top-3 left-3 bg-maroon text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                    {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                  </div>
                )}
                <button
                  onClick={() => removeFromWishlist(item._id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-800/90 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    {item.category || 'Premium'}
                  </span>
                  {item.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-bold text-amber-600">{item.rating}</span>
                    </div>
                  )}
                </div>

                <Link to={`/product/${item.slug || item._id}`}>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-maroon transition-colors line-clamp-2 leading-snug">
                    {item.name}
                  </h3>
                </Link>

                <div className="flex items-baseline gap-2 mb-5">
                  <span className="text-xl font-bold text-maroon">
                    ৳{item.price.toLocaleString()}
                  </span>
                  {item.originalPrice > item.price && (
                    <span className="text-sm text-slate-400 line-through">
                      ৳{item.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={item.stock === 0}
                    className="flex items-center justify-center gap-2 bg-maroon text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-maroon/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>{item.stock > 0 ? t('add_to_cart') || 'Add to Cart' : t('out_of_stock') || 'Out of Stock'}</span>
                  </button>
                  <Link
                    to={`/product/${item.slug || item._id}`}
                    className="flex items-center justify-center bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border border-slate-100 dark:border-slate-600"
                  >
                    {t('view_detail') || 'Details'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-10 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
          <p className="text-4xl font-bold text-maroon mb-1">{wishlist.length}</p>
          <p className="text-slate-500 font-semibold uppercase tracking-wider text-xs">
            {wishlist.length === 1 ? t('item_in_wishlist') || 'Item in your wishlist' : t('items_in_wishlist') || 'Items in your wishlist'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

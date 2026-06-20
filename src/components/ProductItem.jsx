import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Truck, Star, Eye } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useWishlist } from '../contexts/WishlistContext';
import QuickViewModal from './QuickViewModal';
import { getImageUrl } from '../utils/productUtils';

const ProductItem = ({ product }) => {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [showQuickView, setShowQuickView] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!product || !product._id) return null;

  const handleAddToCart = (e) => { e.preventDefault(); addToCart(product); };
  const handleWishlist = (e) => { e.preventDefault(); toggleWishlist(product); };

  const productName = product.name || t('unnamed_product');
  const productPrice = product.price || 0;
  const firstImage = product.images?.[0];
  const productImage = getImageUrl(firstImage) || getImageUrl(product.image) || '/api/placeholder/300/300';
  const productStock = product.stock || 0;
  const productRating = product.rating || 0;
  const isWishlisted = isInWishlist(product._id);
  const hasDiscount = product.originalPrice && product.originalPrice > productPrice;
  const discountPercent = hasDiscount ? Math.round(((product.originalPrice - productPrice) / product.originalPrice) * 100) : 0;

  return (
    <>
      <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col h-full">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800/50">
          {!imageLoaded && <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 animate-pulse" />}
          <Link to={`/product/${product.slug || product._id}`} className="block w-full h-full">
            <img
              src={productImage}
              alt={productName}
              width="300" height="300"
              loading="lazy" decoding="async"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </Link>

          {/* Out of stock overlay */}
          {productStock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
              <span className="bg-white/90 text-slate-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {t('out_of_stock')}
              </span>
            </div>
          )}

          {/* Discount badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-maroon text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              -{discountPercent}%
            </div>
          )}

          {/* Hover actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
            <button
              className="p-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg text-slate-500 hover:text-maroon shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0 hidden sm:flex items-center justify-center"
              onClick={(e) => { e.preventDefault(); setShowQuickView(true); }}
              aria-label={t('quick_view')}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              className={`p-1.5 backdrop-blur-sm rounded-lg shadow-sm sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 sm:translate-x-1 sm:group-hover:translate-x-0 flex items-center justify-center
                ${isWishlisted ? 'bg-maroon text-white' : 'bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-rose-500'}`}
              onClick={handleWishlist}
              aria-label={t('add_to_wishlist')}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col flex-grow">
          <Link to={`/product/${product.slug || product._id}`} className="block group-hover:text-maroon transition-colors mb-1">
            <h3 className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug min-h-[2.4em]">
              {productName}
            </h3>
          </Link>

          {product.description && (
            <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1 mb-1.5">{product.description}</p>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold text-maroon">৳{productPrice.toLocaleString()}</span>
            {hasDiscount && (
              <span className="text-[10px] text-slate-400 line-through">৳{product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto pt-2 border-t border-slate-50 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => {
                  const ratingValue = i + 1;
                  const isFull = productRating >= ratingValue;
                  const isHalf = !isFull && productRating >= ratingValue - 0.5;
                  return (
                    <div key={i} className="relative">
                      <Star className="w-2.5 h-2.5 text-slate-200 dark:text-slate-700" />
                      {(isFull || isHalf) && (
                        <div className="absolute inset-0 overflow-hidden" style={{ width: isFull ? '100%' : '50%' }}>
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <span className="text-[10px] font-medium text-slate-500">
                {productRating > 0 ? productRating.toFixed(1) : '5.0'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleAddToCart}
                disabled={productStock === 0}
                className={`p-1.5 rounded-lg transition-all duration-200 active:scale-95
                  ${productStock > 0
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-maroon hover:text-white'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'}`}
                aria-label={t('add_to_cart')}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { addToCart(product); navigate('/checkout'); }}
                disabled={productStock === 0}
                className={`p-1.5 rounded-lg transition-all duration-200 active:scale-95
                  ${productStock > 0
                    ? 'bg-maroon text-white hover:bg-maroon-dark'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'}`}
                aria-label={t('order_now')}
              >
                <Truck className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showQuickView && <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />}
    </>
  );
};

export default React.memo(ProductItem);

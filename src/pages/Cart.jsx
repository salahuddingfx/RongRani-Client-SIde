import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ShoppingCart, ArrowRight, Shield, Truck, Star, Heart, Gift } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useDeliveryCalculation } from '../hooks/useDeliveryCalculation';
import RecentlyViewed from '../components/RecentlyViewed';
import Breadcrumb from '../components/Breadcrumb';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { delivery, fetchDelivery } = useDeliveryCalculation();
  const { t } = useLanguage();

  useEffect(() => {
    if (totalPrice > 0) fetchDelivery(totalPrice, "Cox's Bazar", "Cox's Bazar");
  }, [totalPrice, fetchDelivery]);

  const [giftWrapping, setGiftWrapping] = useState(false);
  const giftWrappingFee = 50;
  const paymentBadges = ['COD', 'bKash', 'Nagad', 'Rocket', 'Upay', 'SSLCommerz'];
  const shipping = delivery?.charge || 0;
  const finalTotal = totalPrice + shipping + (giftWrapping ? giftWrappingFee : 0);
  const etaLabel = shipping === 0 ? 'Free delivery applies' : '1-2 days (Local delivery)';

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t('empty_cart')}</h2>
          <p className="text-sm text-slate-400 mb-6">{t('empty_cart_msg')}</p>
          <Link to="/shop" className="btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2 rounded-xl">
            <ShoppingBag className="w-4 h-4" /> {t('start_shopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/30">
      <Breadcrumb items={[{ label: 'Cart', to: '/cart' }]} />
      {isAuthenticated && (
        <div className="bg-maroon text-white py-2">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /><span>{t('lifetime_customer')}</span></div>
            <div className="hidden md:flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /><span>{t('free_shipping_calc').replace('{amount}', '2500')}</span></div>
            <div className="hidden md:flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" /><span>{t('exclusive_discounts')}</span></div>
          </div>
        </div>
      )}

      <div className="py-10 sm:py-14 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">{t('your_cart_title')}</h1>
          <p className="text-sm text-slate-400">{t('review_selections')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">{t('items_in_cart').replace('{count}', totalItems)}</h2>
              <Link to="/shop" className="text-sm text-slate-400 hover:text-maroon transition-colors">{t('continue_shopping')}</Link>
            </div>

            {cartItems.map((item, index) => (
              <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative shrink-0">
                    <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    {item.discount > 0 && (
                      <div className="absolute -top-1.5 -right-1.5 bg-maroon text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">-{item.discount}%</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-0.5">
                      <Link to={`/product/${item.slug || item.id}`} className="hover:text-maroon transition-colors line-clamp-2">{item.name}</Link>
                    </h3>
                    <p className="text-sm text-slate-400">৳{item.price.toLocaleString()} × {item.quantity}</p>
                  </div>

                  {/* Mobile controls */}
                  <div className="w-full sm:hidden flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => { const newQ = Math.max(1, item.quantity - 1); updateQuantity(item.id, newQ); if (newQ < item.quantity) toast.success(`Quantity updated to ${newQ}`); }} disabled={item.quantity <= 1}
                        className="p-1 border border-slate-200 dark:border-slate-700 rounded-md disabled:opacity-30"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="w-8 text-center text-sm font-bold text-slate-800 dark:text-white">{item.quantity}</span>
                      <button onClick={() => { const newQ = Math.min(item.stock || 999, item.quantity + 1); updateQuantity(item.id, newQ); if (newQ > item.quantity) toast.success(`Quantity updated to ${newQ}`); }}
                        className="p-1 border border-slate-200 dark:border-slate-700 rounded-md"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                    <p className="text-sm font-bold text-maroon">৳{(item.price * item.quantity).toLocaleString()}</p>
                    <button onClick={() => { removeFromCart(item.id); toast.success(`${item.name} removed from cart`); }} className="p-1 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>

                  {/* Desktop controls */}
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg">
                      <button onClick={() => { const newQ = Math.max(1, item.quantity - 1); updateQuantity(item.id, newQ); if (newQ < item.quantity) toast.success(`Quantity updated to ${newQ}`); }} disabled={item.quantity <= 1}
                        className="px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 rounded-l-lg transition-colors border-r border-slate-100 dark:border-slate-800"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => { const newQ = Math.min(item.stock || 999, item.quantity + 1); updateQuantity(item.id, newQ); if (newQ > item.quantity) toast.success(`Quantity updated to ${newQ}`); }}
                        className="px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-r-lg transition-colors border-l border-slate-100 dark:border-slate-800"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                    <p className="text-lg font-bold text-maroon min-w-[80px] text-right">৳{(item.price * item.quantity).toLocaleString()}</p>
                    <button onClick={() => { removeFromCart(item.id); toast.success(`${item.name} removed from cart`); }} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-4 lg:space-y-0">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 lg:sticky lg:top-28">
              <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4">{t('order_summary')}</h2>

              <div className="mb-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 flex items-center justify-between text-xs">
                <span className="text-slate-500">Save more on your order with coupons at checkout.</span>
                <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md">Promo</span>
              </div>

              {/* Free shipping progress */}
              <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-500">
                    {totalPrice >= 2500 ? t('unlocked_free_shipping') : t('more_for_free_shipping').replace('{amount}', (2500 - totalPrice).toLocaleString())}
                  </span>
                  <Truck className={`w-3.5 h-3.5 ${totalPrice >= 2500 ? 'text-green-500' : 'text-slate-400'}`} />
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 rounded-full ${totalPrice >= 2500 ? 'bg-green-500' : 'bg-maroon'}`}
                    style={{ width: `${Math.min((totalPrice / 2500) * 100, 100)}%` }} />
                </div>
              </div>

              <div className="space-y-2.5 mb-4 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">{t('items_label')} ({totalItems})</span><span className="font-semibold">৳{totalPrice.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">{t('shipping')}</span><span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>{shipping === 0 ? t('free') : `৳${shipping}`}</span></div>
                <div className="flex justify-between text-xs text-slate-400"><span>Estimated delivery</span><span className="font-medium text-slate-500">{etaLabel}</span></div>

                <div className="flex items-center justify-between py-1.5">
                  <label htmlFor="giftWrapping" className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                    <input type="checkbox" id="giftWrapping" checked={giftWrapping} onChange={(e) => setGiftWrapping(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-maroon focus:ring-maroon" />
                    <Gift className="w-3.5 h-3.5 text-amber-500" /> {t('gift_wrapping')}
                  </label>
                  <span className="font-semibold text-maroon text-sm">৳{giftWrappingFee}</span>
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />
                <div className="flex justify-between text-base font-bold">
                  <span className="text-slate-800 dark:text-white">{t('total')}</span>
                  <span className="text-maroon">৳{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <Link to="/checkout" state={{ giftWrapping }}
                className="btn-primary w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 mb-2">
                {t('checkout')} <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex flex-wrap gap-1.5 justify-center mb-2">
                {paymentBadges.map((badge) => (
                  <span key={badge} className="text-[10px] font-medium text-slate-500 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 px-2 py-0.5 rounded-md">{badge}</span>
                ))}
              </div>

              <Link to="/shop" className="btn-secondary w-full py-2 rounded-xl text-sm flex items-center justify-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" /> {t('continue_shopping')}
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3">
                <Truck className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-white">{t('fast_delivery_title')}</h4>
                  <p className="text-[11px] text-slate-400">{t('on_orders_over').replace('{amount}', '2500')}</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3">
                <Shield className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-white">{t('secure_checkout_label')}</h4>
                  <p className="text-[11px] text-slate-400">{t('ssl_encrypted')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <RecentlyViewed mode="section" />
      </div>
    </div>
  );
};

export default Cart;

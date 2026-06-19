import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const CartDrawer = () => {
  const { cartItems, totalPrice, updateQuantity, removeFromCart, isCartOpen, closeCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isCartOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleCheckout = () => { closeCart(); navigate('/checkout'); };
  const handleViewCart = () => { closeCart(); navigate('/cart'); };

  return (
    <div className="fixed inset-0 z-[1001] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={closeCart} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-950 h-full shadow-drawer animate-slide-in-left flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-slate-400" />
            <h2 className="text-base font-bold text-slate-800 dark:text-white">Cart ({cartItems.length})</h2>
          </div>
          <button onClick={closeCart} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-slate-300" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Your cart is empty</h3>
                <p className="text-sm text-slate-400 mt-0.5">Looks like you haven't added anything yet.</p>
              </div>
              <button onClick={closeCart} className="btn-primary px-6 py-2 text-sm rounded-lg">Start Shopping</button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="group flex gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-colors relative">
                <div className="w-18 h-18 rounded-lg overflow-hidden bg-white dark:bg-slate-700 shrink-0 border border-slate-100 dark:border-slate-700 w-[72px] h-[72px]">
                  <img src={item.image?.url || item.image || '/placeholder.jpg'} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="pr-6">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white truncate">{item.name}</h4>
                    <p className="text-[11px] text-slate-400">{item.category}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 h-7">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} disabled={item.quantity <= 1}
                        className="px-1.5 h-full hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 rounded-l-lg transition-colors border-r border-slate-100 dark:border-slate-800">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-slate-800 dark:text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, Math.min(item.stock || 999, item.quantity + 1))}
                        className="px-1.5 h-full hover:bg-slate-50 dark:hover:bg-slate-800 rounded-r-lg transition-colors border-l border-slate-100 dark:border-slate-800">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-maroon">৳{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)}
                  className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Remove item">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-3 shrink-0">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Subtotal</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-white">৳{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-slate-800 dark:text-white">Total</span>
              <span className="text-base font-bold text-maroon">৳{totalPrice.toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleViewCart} className="btn-secondary py-2.5 rounded-lg text-sm flex items-center justify-center gap-1.5">View Cart</button>
              <button onClick={handleCheckout} className="btn-primary py-2.5 rounded-lg text-sm flex items-center justify-center gap-1.5">
                Checkout <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-center text-slate-400">Free shipping on orders over ৳2500</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;

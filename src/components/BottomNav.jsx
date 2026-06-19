import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, User, LayoutGrid, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { getImageUrl } from '../utils/productUtils';

const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/shop', icon: LayoutGrid, label: 'Shop' },
    { to: '/cart', icon: ShoppingCart, label: 'Cart', badge: totalItems },
    { to: '/wishlist', icon: Heart, label: 'Wishlist', badge: wishlist.length },
    {
      to: user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login',
      icon: User,
      label: 'Account',
      isActive: () => isActive('/dashboard') || isActive('/login') || isActive('/admin')
    }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800/60">
      <nav className="max-w-md mx-auto px-2 py-1 pb-safe-bottom">
        <ul className="flex items-center justify-around">
          {navItems.map((item, index) => {
            const active = item.isActive ? item.isActive() : isActive(item.to);
            return (
              <li key={index} className="flex-1">
                <Link
                  to={item.to}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 relative
                    ${active
                      ? 'text-maroon dark:text-pink-400'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  aria-label={item.label}
                >
                  <div className="relative">
                    {item.label === 'Account' && user?.avatar ? (
                      <div className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-all ${active ? 'border-maroon dark:border-pink-400' : 'border-slate-200 dark:border-slate-700'}`}>
                        <img src={getImageUrl(user.avatar)} alt="Account" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <item.icon className={`w-5 h-5 transition-all ${active ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                    )}
                    {item.badge > 0 && (
                      <span className="absolute -top-1 -right-2 bg-maroon text-white text-[8px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center border border-white dark:border-slate-950">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] mt-0.5 transition-all ${active ? 'font-bold' : 'font-medium'}`}>
                    {item.label}
                  </span>
                  {active && (
                    <span className="absolute top-0 w-6 h-0.5 bg-maroon dark:bg-pink-400 rounded-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default BottomNav;

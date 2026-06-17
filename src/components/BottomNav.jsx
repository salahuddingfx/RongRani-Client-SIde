import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, User, LayoutGrid, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
      <nav className="max-w-md mx-auto px-4 py-1.5 pb-safe-bottom">
        <ul className="flex items-center justify-between">
          {navItems.map((item, index) => {
            const active = item.isActive ? item.isActive() : isActive(item.to);

            return (
              <li key={index} className="flex-1">
                <Link
                  to={item.to}
                  className={`
                    flex flex-col items-center justify-center py-1.5 px-2 rounded-xl
                    transition-all duration-300 select-none outline-none relative
                    ${active 
                      ? 'text-maroon dark:text-pink-400 font-extrabold scale-102' 
                      : 'text-slate-400 dark:text-slate-500 hover:text-maroon dark:hover:text-pink-300'
                    }
                  `}
                  aria-label={item.label}
                >
                  {/* Icon wrapper */}
                  <div className="relative p-0.5">
                    {item.label === 'Account' && user?.avatar ? (
                      <div className={`h-6 w-6 rounded-full overflow-hidden border-2 transition-all ${active ? 'border-maroon dark:border-pink-400' : 'border-slate-200 dark:border-slate-700'}`}>
                        <img src={user.avatar} alt="Account" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <item.icon 
                        className={`h-5 w-5 transition-transform duration-300 ${active ? 'scale-108 stroke-[2.5px]' : 'stroke-[2px]'}`} 
                      />
                    )}
                    
                    {/* Badge */}
                    {item.badge > 0 && (
                      <span className={`
                        absolute -top-1 -right-1.5 font-black flex items-center justify-center 
                        rounded-full text-[8px] min-w-4.5 h-4.5 px-1 border border-white dark:border-slate-950 bg-maroon text-white
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <span className="text-[10px] tracking-tight mt-0.5 leading-none font-black transition-all duration-300">
                    {item.label}
                  </span>

                  {/* Subtle active line indicator */}
                  {active && (
                    <span className="absolute top-0 w-8 h-0.75 bg-maroon dark:bg-pink-400 rounded-full animate-pulse-slow" />
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

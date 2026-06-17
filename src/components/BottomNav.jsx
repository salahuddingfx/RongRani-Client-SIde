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
    <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/80 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-2">
        <ul className="flex items-center justify-around relative">
          {navItems.map((item, index) => {
            const active = item.isActive ? item.isActive() : isActive(item.to);

            return (
              <li key={index} className="flex-1 flex justify-center">
                <Link
                  to={item.to}
                  className={`
                    relative flex flex-col items-center justify-center py-2 px-3 rounded-xl
                    transition-all duration-300 ease-out select-none outline-none
                    ${active 
                      ? 'text-maroon dark:text-pink-400 -translate-y-1 scale-105' 
                      : 'text-slate-400 hover:text-maroon dark:hover:text-pink-300 active:scale-95'
                    }
                  `}
                  aria-label={item.label}
                >
                  {/* Icon wrapper */}
                  <div className="relative p-1">
                    <item.icon 
                      className={`h-5 w-5 transition-transform duration-300 ${active ? 'scale-110 stroke-[2.5px]' : 'stroke-[2px]'}`} 
                    />
                    
                    {/* Badge */}
                    {item.badge > 0 && (
                      <span className={`
                        absolute -top-1.5 -right-2 font-black flex items-center justify-center 
                        rounded-full text-[9px] w-4.5 h-4.5 border-2 border-white dark:border-slate-900 
                        transition-all duration-300 animate-scale-in
                        ${active 
                          ? 'bg-yellow-400 text-maroon shadow-md shadow-yellow-400/20' 
                          : 'bg-maroon text-white dark:bg-pink-500'
                        }
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <span className={`
                    text-[10px] font-black tracking-tight mt-0.5 transition-all duration-300
                    ${active ? 'opacity-100 max-h-4' : 'opacity-0 max-h-0 overflow-hidden'}
                  `}>
                    {item.label}
                  </span>

                  {/* Active Indicator Dot */}
                  {active && (
                    <span className="absolute -bottom-1 w-1 h-1 bg-maroon dark:bg-pink-400 rounded-full animate-pulse-slow shadow-glow" />
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

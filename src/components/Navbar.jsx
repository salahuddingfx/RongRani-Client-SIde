import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Heart, Package, LogOut, Crown, LayoutDashboard, Moon, Sun, Phone, Mail, ChevronDown, Home, Globe, Clock, ArrowLeft, Gift, Truck, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useWishlist } from '../contexts/WishlistContext';
import { getImageUrl } from '../utils/productUtils';

const SearchSection = React.memo(({ isScrolled, language, t, isMobile = false, setIsOpen }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [popularSearches] = useState(['Love Combo', 'Anniversary', 'Birthday', 'Gift Box']);
  const [suggestedCategories, setSuggestedCategories] = useState([]);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) setShowSuggestions(false);
    };
    if (showSuggestions) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSuggestions]);

  const saveToRecent = useCallback((query) => {
    if (!query) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  }, [recentSearches]);

  const placeholders = useMemo(() => language === 'bn'
    ? ['উপহার খুজুন...', 'ভালোবাসার কম্বো...', 'বার্থডে গিফট...', 'সারপ্রাইজ বক্স...']
    : ['Search for gifts...', 'Love Combo...', 'Birthday Gifts...', 'Surprise Boxes...'], [language]);

  useEffect(() => {
    let currentText = placeholders[placeholderIndex];
    let charIndex = 0;
    let isDeleting = false;
    let timer;
    const type = () => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setPlaceholder(currentText.substring(0, charIndex + 1));
          charIndex++;
          timer = setTimeout(type, 120);
        } else {
          timer = setTimeout(() => { isDeleting = true; type(); }, 2500);
        }
      } else {
        if (charIndex > 0) {
          setPlaceholder(currentText.substring(0, charIndex - 1));
          charIndex--;
          timer = setTimeout(type, 80);
        } else {
          isDeleting = false;
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
          timer = setTimeout(type, 800);
        }
      }
    };
    timer = setTimeout(type, 1500);
    return () => clearTimeout(timer);
  }, [placeholderIndex, placeholders]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const query = searchQuery.trim();
      if (query.length < 2) { setSuggestions([]); setIsSearching(false); return; }
      setIsSearching(true);
      try {
        const response = await axios.get('/api/search/suggestions', { params: { q: query } });
        if (response.data?.success) {
          setSuggestions(response.data.suggestions || []);
          setSuggestedCategories(response.data.categories || []);
          setShowSuggestions(true);
        }
      } catch (_) {} finally { setIsSearching(false); }
    };
    const debounceTimer = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      saveToRecent(query);
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      setSearchQuery('');
      setShowSuggestions(false);
      if (setIsOpen) setIsOpen(false);
    }
  };

  const highlightMatch = (text, query) => {
    if (!query || typeof text !== 'string') return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <span key={i} className="text-maroon font-semibold">{part}</span>
        : part
    );
  };

  return (
    <div className={`relative search-container ${isMobile ? 'w-full' : 'w-full'}`}>
      <form onSubmit={handleSearch} className="w-full relative" role="search">
        <input
          type="text"
          placeholder={placeholder}
          aria-label={t('search_placeholder') || "Search for gifts"}
          className={`w-full bg-slate-100 dark:bg-slate-800 border border-transparent
                     focus:border-slate-200 dark:focus:border-slate-600
                     ${isMobile ? 'rounded-xl py-2.5' : 'rounded-full py-2.5'} pl-11 pr-12
                     focus:ring-0 focus:bg-white dark:focus:bg-slate-800
                     transition-all text-sm text-slate-700 dark:text-slate-200`}
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); if (!showSuggestions) setShowSuggestions(true); }}
          onFocus={() => { if (searchQuery.length >= 2 || (isMobile && !searchQuery)) setShowSuggestions(true); }}
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-maroon text-white rounded-lg
                     hover:bg-maroon-dark transition-colors active:scale-95"
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      </form>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-elevated border border-slate-100 dark:border-slate-700 overflow-hidden z-[9999] animate-fade-in">
          {isSearching ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-maroon border-t-transparent mx-auto mb-2" />
              <p className="text-xs text-slate-400">{t('searching_magic')}</p>
            </div>
          ) : (
            <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
              {searchQuery.trim().length < 2 && (
                <div className="p-4 border-b border-slate-50 dark:border-slate-700/50">
                  <h5 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">{t('trending_now')}</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {popularSearches.map((term, i) => (
                      <button key={i} onClick={() => { saveToRecent(term); navigate(`/shop?search=${encodeURIComponent(term)}`); setShowSuggestions(false); if (setIsOpen) setIsOpen(false); }}
                        className="px-3 py-1 bg-slate-50 dark:bg-slate-700/50 hover:bg-maroon hover:text-white dark:hover:bg-maroon text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors">
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchQuery.trim().length < 2 && recentSearches.length > 0 && (
                <div className="p-4 border-b border-slate-50 dark:border-slate-700/50">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t('recent_searches')}</h5>
                    <button onClick={(e) => { e.stopPropagation(); setRecentSearches([]); localStorage.removeItem('recentSearches'); }}
                      className="text-[10px] text-slate-400 hover:text-maroon">{t('clear_recent')}</button>
                  </div>
                  <div className="space-y-0.5">
                    {recentSearches.map((term, i) => (
                      <button key={i} onClick={() => { saveToRecent(term); navigate(`/shop?search=${encodeURIComponent(term)}`); setShowSuggestions(false); if (setIsOpen) setIsOpen(false); }}
                        className="w-full text-left px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg text-sm text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-2">
                        <Clock className="w-3 h-3 text-slate-300" />{term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {suggestedCategories.length > 0 && searchQuery.trim().length >= 2 && (
                <div className="p-4 border-b border-slate-50 dark:border-slate-700/50">
                  <h5 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Categories</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedCategories.map((cat, i) => (
                      <Link key={i} to={`/shop?category=${encodeURIComponent(cat)}`}
                        className="px-3 py-1 bg-slate-50 dark:bg-slate-700/50 hover:bg-maroon hover:text-white border border-slate-100 dark:border-slate-600 rounded-lg text-xs font-medium transition-colors"
                        onClick={() => { setShowSuggestions(false); if (setIsOpen) setIsOpen(false); }}>
                        {highlightMatch(cat, searchQuery)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-2">
                {suggestions.length > 0 ? (
                  <>
                    <h5 className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t('products_found')}</h5>
                    {suggestions.map((product) => (
                      <Link key={product._id} to={`/product/${product.slug || product._id}`}
                        className="flex items-center gap-3 p-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors"
                        onClick={() => { setShowSuggestions(false); setSearchQuery(''); if (setIsOpen) setIsOpen(false); }}>
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                          <img src={product.image?.url || product.image || '/placeholder.jpg'} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{highlightMatch(product.name, searchQuery)}</h4>
                          <span className="text-sm font-semibold text-maroon">৳{product.price}</span>
                        </div>
                      </Link>
                    ))}
                    <Link to={`/shop?search=${encodeURIComponent(searchQuery)}`}
                      className="flex items-center justify-center p-3 text-sm font-semibold text-maroon hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors mt-1"
                      onClick={() => { setShowSuggestions(false); if (setIsOpen) setIsOpen(false); }}>
                      {t('view_all_results')}
                    </Link>
                  </>
                ) : (
                  searchQuery.length >= 2 && !isSearching && (
                    <div className="p-8 text-center">
                      <Search className="w-8 h-8 text-slate-200 dark:text-slate-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-500">{t('no_products_found_msg')}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { totalItems, openCart } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isSimplifiedPage = ['/checkout', '/login', '/register', '/forgot-password'].includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu-container')) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { to: '/', label: 'home' },
    { to: '/shop', label: 'shop' },
    { to: '/quick-track', label: 'track_order' },
    { to: '/reviews', label: 'reviews' },
    { to: '/contact', label: 'contact' },
  ];

  const adminUrl = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174';

  const userMenuItems = [
    { to: '/dashboard', label: 'dashboard', icon: LayoutDashboard },
    { to: '/orders', label: 'my_orders', icon: Package },
    { to: '/wishlist', label: 'wishlist', icon: Heart },
    ...(user?.role === 'admin' ? [{ to: adminUrl, label: 'admin_panel', icon: Crown, external: true }] : []),
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] flex flex-col w-full pointer-events-none">
      <div className="pointer-events-auto">
        {/* ─── Top Announcement Bar ─── */}
        {!isSimplifiedPage && (
          <div className={`bg-maroon text-white text-[11px] py-1.5 px-4 transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden opacity-0 py-0' : ''}`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex-1 overflow-hidden mr-4">
                <div className="animate-marquee whitespace-nowrap inline-block">
                  <span className="inline-flex items-center mr-10 font-medium"><Gift className="w-3.5 h-3.5 mr-1.5 inline-block" /> {t('welcome_offer')}</span>
                  <span className="inline-flex items-center mr-10 text-yellow-300 font-medium"><Truck className="w-3.5 h-3.5 mr-1.5 inline-block" /> {t('free_shipping')}</span>
                  <span className="inline-flex items-center mr-10 font-medium"><Sparkles className="w-3.5 h-3.5 mr-1.5 inline-block" /> {t('handcrafted_love_top')}</span>
                  <span className="inline-flex items-center mr-10 font-medium"><Gift className="w-3.5 h-3.5 mr-1.5 inline-block" /> {t('welcome_offer')}</span>
                  <span className="inline-flex items-center mr-10 text-yellow-300 font-medium"><Truck className="w-3.5 h-3.5 mr-1.5 inline-block" /> {t('free_shipping')}</span>
                  <span className="inline-flex items-center mr-10 font-medium"><Sparkles className="w-3.5 h-3.5 mr-1.5 inline-block" /> {t('handcrafted_love_top')}</span>
                </div>
              </div>
              <div className="hidden md:flex items-center divide-x divide-white/20 shrink-0 text-[11px]">
                <div className="flex items-center space-x-4 pr-4">
                  <a href="tel:+8801851075537" className="flex items-center hover:text-yellow-300 transition-colors"><Phone className="w-3 h-3 mr-1" /> +880 1851-075537</a>
                  <a href="mailto:info.rongrani@gmail.com" className="flex items-center hover:text-yellow-300 transition-colors pl-4"><Mail className="w-3 h-3 mr-1" /> info.rongrani@gmail.com</a>
                </div>
                <div className="flex items-center pl-4">
                  <button onClick={toggleLanguage} className="flex items-center hover:text-yellow-300 font-semibold uppercase tracking-wider">
                    <Globe className="w-3 h-3 mr-1" />{language === 'en' ? 'BN' : 'EN'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Main Navigation ─── */}
        <nav className={`transition-all duration-300 w-full
          ${isScrolled || isOpen
            ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-soft border-b border-slate-100 dark:border-slate-800/50'
            : 'bg-white dark:bg-slate-950 border-b border-slate-100/50 dark:border-slate-800/30'}
        `}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between gap-4 h-16">
              {/* Left: Logo + Mobile Menu */}
              <div className="flex items-center gap-2">
                {!isSimplifiedPage && (
                  <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label={isOpen ? "Close menu" : "Open menu"}>
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                )}
                <Link to="/" className="flex items-center gap-2 group shrink-0">
                  <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl overflow-hidden">
                    <img src="/RongRani-Logo.png" alt="RongRani Logo" className="w-full h-full object-contain" width="40" height="40" fetchpriority="high" />
                  </div>
                  <span className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Rong<span className="text-maroon">Rani</span>
                  </span>
                </Link>
              </div>

              {/* Center: Search (desktop) */}
              {!isSimplifiedPage && (
                <div className="hidden md:flex flex-1 max-w-lg mx-6">
                  <SearchSection isScrolled={isScrolled} language={language} t={t} />
                </div>
              )}

              {/* Right: Actions */}
              <div className="flex items-center gap-1 md:gap-2">
                {/* Simplified page nav buttons */}
                {isSimplifiedPage && (
                  <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-1">
                    <button onClick={() => window.history.back()} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors" title="Go Back">
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <Link to="/" className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors" title="Home">
                      <Home className="w-4 h-4" />
                    </Link>
                  </div>
                )}

                {/* Desktop links */}
                {!isSimplifiedPage && (
                  <div className="hidden lg:flex items-center gap-1 mr-2">
                    {menuItems.map((item) => (
                      <Link key={item.to} to={item.to}
                        className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors
                          ${location.pathname === item.to
                            ? 'text-maroon bg-maroon/5'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}>
                        {t(item.label)}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Icon buttons */}
                {!isSimplifiedPage && (
                  <>
                    <Link to="/shop" className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors" aria-label="Search">
                      <Search className="w-5 h-5" />
                    </Link>

                    <button onClick={toggleTheme} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-600 dark:text-slate-300" aria-label={isDark ? "Light mode" : "Dark mode"}>
                      {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
                    </button>

                    {/* Desktop icons */}
                    <div className="hidden md:flex items-center gap-1">
                      <Link to="/cart" onClick={(e) => { e.preventDefault(); openCart(); }}
                        className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group" aria-label="Cart">
                        <ShoppingCart className="w-4.5 h-4.5 text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white" />
                        {totalItems > 0 && (
                          <span className="absolute -top-1 -right-1 bg-maroon text-white text-[10px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-sm">{totalItems > 99 ? '99+' : totalItems}</span>
                        )}
                      </Link>

                      <Link to="/wishlist" className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group" aria-label="Wishlist">
                        <Heart className="w-4.5 h-4.5 text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white" />
                        {wishlist.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-maroon text-white text-[10px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-sm">{wishlist.length > 99 ? '99+' : wishlist.length}</span>
                        )}
                      </Link>

                      {/* User menu */}
                      {user ? (
                        <div className="relative ml-1 user-menu-container">
                          <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-1.5 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors" aria-label="User menu">
                            <div className="w-7 h-7 rounded-lg bg-maroon/10 dark:bg-maroon/20 flex items-center justify-center overflow-hidden">
                              {user.avatar ? (
                                <img src={getImageUrl(user.avatar)} alt={user.name} className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-3.5 h-3.5 text-maroon" />
                              )}
                            </div>
                            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                          </button>

                          {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-elevated border border-slate-100 dark:border-slate-700 py-1.5 z-[100] animate-fade-in">
                              <div className="px-3.5 py-2.5 mb-1 border-b border-slate-100 dark:border-slate-700">
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t('welcome')}</p>
                                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user.name}</p>
                              </div>
                              {userMenuItems.map((item) => (
                                item.external ? (
                                  <a key={item.to} href={item.to} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-maroon transition-colors"
                                    onClick={() => setShowUserMenu(false)}>
                                    <item.icon className="w-4 h-4" /> {t(item.label)}
                                  </a>
                                ) : (
                                  <Link key={item.to} to={item.to}
                                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-maroon transition-colors"
                                    onClick={() => setShowUserMenu(false)}>
                                    <item.icon className="w-4 h-4" /> {t(item.label)}
                                  </Link>
                                )
                              ))}
                              <button onClick={handleLogout}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors mt-1 border-t border-slate-100 dark:border-slate-700 pt-2">
                                <LogOut className="w-4 h-4" /> {t('logout')}
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link to="/login" className="ml-1 px-4 py-1.5 bg-maroon text-white text-xs font-semibold rounded-lg hover:bg-maroon-dark transition-colors">{t('login')}</Link>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mobile search */}
            {!isSimplifiedPage && (
              <div className="md:hidden pb-3">
                <SearchSection isMobile isScrolled={isScrolled} language={language} t={t} setIsOpen={setIsOpen} />
              </div>
            )}
          </div>
        </nav>

        {/* ─── Mobile Menu Drawer ─── */}
        {isOpen && !isSimplifiedPage && (
          <div className="lg:hidden fixed inset-0 z-[100]">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-[82%] max-w-xs bg-white dark:bg-slate-950 shadow-drawer flex flex-col animate-slide-in-left">
              {/* Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden">
                    <img src="/RongRani-Logo.png" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    Rong<span className="text-maroon">Rani</span>
                  </span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors" aria-label="Close menu">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* User greeting */}
                {user && (
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-maroon/10 dark:bg-maroon/20 flex items-center justify-center overflow-hidden shrink-0">
                      {user.avatar ? (
                        <img src={getImageUrl(user.avatar)} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-maroon" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-medium">{t('welcome_back')}</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user.name || 'User'}</p>
                    </div>
                  </div>
                )}

                {/* Main nav */}
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">{t('menu')}</p>
                  <div className="space-y-0.5">
                    {menuItems.map((item) => (
                      <Link key={item.to} to={item.to}
                        className={`block px-3 py-2.5 rounded-xl font-medium text-sm transition-colors
                          ${location.pathname === item.to
                            ? 'bg-maroon text-white'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        onClick={() => setIsOpen(false)}>
                        {t(item.label)}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Account */}
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">{t('account')}</p>
                  {user ? (
                    <div className="space-y-0.5">
                      {userMenuItems.map((item) => (
                        item.external ? (
                          <a key={item.to} href={item.to} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            onClick={() => setIsOpen(false)}>
                            <item.icon className="w-4 h-4 opacity-60" /> {t(item.label)}
                          </a>
                        ) : (
                          <Link key={item.to} to={item.to}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            onClick={() => setIsOpen(false)}>
                            <item.icon className="w-4 h-4 opacity-60" /> {t(item.label)}
                          </Link>
                        )
                      ))}
                    </div>
                  ) : (
                    <Link to="/login" className="flex items-center justify-center gap-2 w-full py-2.5 bg-maroon text-white font-semibold rounded-xl hover:bg-maroon-dark transition-colors" onClick={() => setIsOpen(false)}>
                      {t('login')}
                    </Link>
                  )}
                </div>

                {/* Preferences */}
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">{t('preferences')}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={toggleLanguage} className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center text-xs font-bold ring-1 ring-slate-200 dark:ring-slate-600 mb-1.5">
                        {language === 'en' ? 'BN' : 'EN'}
                      </div>
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">{language === 'en' ? 'Bangla' : 'English'}</span>
                    </button>
                    <button onClick={toggleTheme} className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center mb-1.5 ${isDark ? 'bg-slate-700 text-yellow-400' : 'bg-white text-slate-500 ring-1 ring-slate-200'}`}>
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      </div>
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">{isDark ? 'Light' : 'Dark'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 text-center border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400">© 2026 RongRani</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

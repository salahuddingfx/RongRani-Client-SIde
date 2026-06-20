import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';
import AIChatFloatingWidget from './AIChatFloatingWidget';
import Seo from './Seo';
import ScrollRevealManager from './ScrollRevealManager';
import RecentlyViewed from './RecentlyViewed';
import CompareBar from './CompareBar';
import CartDrawer from './CartDrawer';
import { ArrowUp } from 'lucide-react';

const BackToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.pageYOffset > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 z-40 w-10 h-10 rounded-full bg-maroon text-white shadow-lg shadow-maroon/30 flex items-center justify-center hover:scale-110 transition-all duration-200 active:scale-95"
      aria-label="Back to top"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
};

const AppLayout = () => {
  const location = useLocation();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowChat(true), 5000);
    const trigger = () => {
      setShowChat(true);
      clearTimeout(timer);
      window.removeEventListener('scroll', trigger);
      window.removeEventListener('touchstart', trigger);
    };
    window.addEventListener('scroll', trigger, { passive: true });
    window.addEventListener('touchstart', trigger, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', trigger);
      window.removeEventListener('touchstart', trigger);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-white">
      <Seo path={location.pathname} />
      <ScrollRevealManager />

      <div className="fixed top-0 left-0 right-0 z-[60]">
        <Navbar />
      </div>

      <main className="pt-[140px] md:pt-28 pb-20 lg:pb-0 page-content-fade-in">
        <Outlet />
      </main>

      <RecentlyViewed />
      <CompareBar />
      <CartDrawer />
      <Footer />
      <BackToTop />
      {showChat && <AIChatFloatingWidget />}
      <BottomNav />
    </div>
  );
};

export default AppLayout;

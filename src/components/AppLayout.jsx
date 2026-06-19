import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';
import AIChatFloatingWidget from './AIChatFloatingWidget';
import Seo from './Seo';
import ScrollRevealManager from './ScrollRevealManager';
import RecentlyViewed from './RecentlyViewed';
import CartDrawer from './CartDrawer';

const AppLayout = () => {
  const location = useLocation();
  const [showChat, setShowChat] = React.useState(false);

  React.useEffect(() => {
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

      <main className="pt-20 sm:pt-24 md:pt-28 pb-20 lg:pb-0 page-content-fade-in">
        <Outlet />
      </main>

      <RecentlyViewed />
      <CartDrawer />
      <Footer />
      {showChat && <AIChatFloatingWidget />}
      <BottomNav />
    </div>
  );
};

export default AppLayout;

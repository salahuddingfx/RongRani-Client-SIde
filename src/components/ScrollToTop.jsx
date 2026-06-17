import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { pathname } = useLocation();

  // Automatically reset scroll position to top when navigating to a new page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-[10.5rem] right-6 z-50 w-14 h-14 bg-white/90 dark:bg-slate-900/90 text-maroon dark:text-pink-400 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:bg-maroon hover:text-white dark:hover:bg-pink-500 dark:hover:text-slate-950 transition-all duration-500 hover:scale-110 transform border border-maroon/20 dark:border-pink-500/20 backdrop-blur-md flex items-center justify-center group overflow-hidden"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6 group-hover:-translate-y-10 transition-all duration-500 absolute" />
          <ArrowUp className="h-6 w-6 translate-y-10 group-hover:translate-y-0 transition-all duration-500 absolute" />
          <div className="h-6 w-6 opacity-0"></div>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;

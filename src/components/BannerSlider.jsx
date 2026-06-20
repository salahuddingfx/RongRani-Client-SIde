import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../contexts/socketContextBase';

const DEFAULT_BANNERS = [
  {
    id: 1,
    title: 'Handcrafted Excellence',
    subtitle: 'Discover Traditional Bengali Crafts',
    description: 'Each piece tells a story of heritage and craftsmanship',
    bgColor: 'bg-maroon',
    textColor: 'text-white',
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=1000&q=80&auto=format,webp',
    link: '/shop'
  },
  {
    id: 2,
    title: 'Anniversary Special',
    subtitle: 'Make Your Moments Memorable',
    description: 'Customized surprise boxes and flowers for your loved ones',
    bgColor: 'bg-pink-800',
    textColor: 'text-white',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1000&q=80&auto=format,webp',
    link: '/shop'
  },
  {
    id: 3,
    title: 'Support Local Artisans',
    subtitle: 'Every Purchase Makes a Difference',
    description: 'Empowering craftspeople across Bangladesh',
    bgColor: 'bg-teal-700',
    textColor: 'text-white',
    image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=1000&q=80&auto=format,webp',
    link: '/shop'
  }
];

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket() || {};

  const getOptimizedUrl = (url, width) => {
    if (!url) return '';
    if (!url.includes('unsplash.com')) return url;
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?auto=format,compress&q=60&w=${width}`;
  };

  const fetchBanners = useCallback(async () => {
    try {
      const response = await axios.get('/api/admin/banners');
      const fetchedBanners = response.data.map((banner) => {
        let imageUrl = typeof banner.image === 'object' ? banner.image.url : (banner.image || '');

        return {
          id: banner._id,
          title: banner.title || 'Banner Title',
          subtitle: banner.subtitle || '',
          description: banner.description || '',
          bgColor: banner.bgColor || 'bg-maroon',
          textColor: banner.textColor || 'text-white',
          image: imageUrl,
          link: banner.link || '#'
        };
      });
      setBanners(fetchedBanners.length > 0 ? fetchedBanners : DEFAULT_BANNERS);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners(DEFAULT_BANNERS);
    } finally {
      setLoading(false);
    }
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  useEffect(() => {
    if (!socket) return;

    socket.on('banner:created', () => fetchBanners());
    socket.on('banner:updated', () => fetchBanners());
    socket.on('banner:deleted', () => fetchBanners());

    return () => {
      socket.off('banner:created');
      socket.off('banner:updated');
      socket.off('banner:deleted');
    };
  }, [socket, fetchBanners]);

  useEffect(() => {
    if (!isAutoPlaying || banners.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying, nextSlide, banners.length]);

  if (loading) {
    return (
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden bg-slate-200 dark:bg-slate-800 animate-pulse" />
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden group">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`min-w-full h-full ${banner.bgColor} flex items-center justify-center px-8 md:px-16 relative`}
          >
            {/* Background Image at low opacity */}
            {banner.image && (
              <div className="absolute inset-0 z-0">
                <img
                  src={getOptimizedUrl(banner.image, 1200)}
                  srcSet={`
                    ${getOptimizedUrl(banner.image, 600)} 600w,
                    ${getOptimizedUrl(banner.image, 1200)} 1200w
                  `}
                  sizes="(max-width: 640px) 100vw, 100vw"
                  alt=""
                  className="w-full h-full object-cover opacity-15"
                  decoding="async"
                  loading={index === 0 ? "eager" : "lazy"}
                  {...(index === 0 ? { fetchpriority: "high" } : {})}
                  width="1200"
                  height="600"
                />
              </div>
            )}

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center h-full">
              <div className="text-center md:text-left px-4">
                <h2 className={`text-3xl sm:text-4xl md:text-6xl font-black ${banner.textColor} mb-3 sm:mb-4 leading-tight`}>
                  {banner.title}
                </h2>
                <p className={`text-lg sm:text-xl md:text-3xl ${banner.textColor} mb-4 sm:mb-6 font-semibold opacity-90`}>
                  {banner.subtitle}
                </p>
                <p className={`text-sm sm:text-base md:text-lg ${banner.textColor} mb-6 sm:mb-8 opacity-80 line-clamp-2 sm:line-clamp-none`}>
                  {banner.description}
                </p>
                <div className="flex justify-center md:justify-start">
                  <Link
                    to={banner.link || '/shop'}
                    className="bg-white text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors inline-block"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>

              {/* Banner Image */}
              <div className="hidden md:block">
                <div className="w-full h-96 rounded-2xl overflow-hidden shadow-elevated">
                  {banner.image ? (
                    <img
                      src={getOptimizedUrl(banner.image, 800)}
                      alt={banner.title}
                      width="800"
                      height="400"
                      className="w-full h-full object-cover"
                      decoding="async"
                      loading={index === 0 ? "eager" : "lazy"}
                      {...(index === 0 ? { fetchpriority: "high" } : {})}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50 text-4xl font-bold">
                      No Image
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
        <button
          onClick={prevSlide}
          className="p-2.5 bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-card hover:bg-white dark:hover:bg-slate-700 transition-colors flex items-center justify-center cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 text-slate-700 dark:text-slate-200" />
        </button>
        <button
          onClick={nextSlide}
          className="p-2.5 bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-card hover:bg-white dark:hover:bg-slate-700 transition-colors flex items-center justify-center cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 text-slate-700 dark:text-slate-200" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${currentSlide === index
              ? 'w-8 h-2.5 bg-white'
              : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;

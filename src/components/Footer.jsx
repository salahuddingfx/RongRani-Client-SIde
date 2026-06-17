import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Package, Shield, Heart, Truck } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import DeveloperProfile from './DeveloperProfile';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showDevProfile, setShowDevProfile] = useState(false);
  const [bdTime, setBdTime] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Dhaka',
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setBdTime(now.toLocaleString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showDevProfile) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showDevProfile]);

  return (
    <>
      <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 mt-20 relative overflow-hidden pt-12">
        {/* Subtle glow accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-maroon/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Trust Badges Panel */}
        <div className="container mx-auto px-4 pb-10 border-b border-slate-900 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 bg-slate-900/30 p-4 rounded-2xl border border-slate-900/60">
              <div className="w-10 h-10 rounded-xl bg-maroon/10 flex items-center justify-center text-maroon shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs uppercase tracking-wider">Free Shipping</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">On orders above ৳2500</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 bg-slate-900/30 p-4 rounded-2xl border border-slate-900/60">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs uppercase tracking-wider">Secure Checkout</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">100% Protected Payments</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 bg-slate-900/30 p-4 rounded-2xl border border-slate-900/60">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs uppercase tracking-wider">Easy Returns</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">7-Day Return Policy</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 bg-slate-900/30 p-4 rounded-2xl border border-slate-900/60">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs uppercase tracking-wider">24/7 Support</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Dedicated Customer Helpline</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12">
            {/* Brand details */}
            <div className="col-span-2 lg:col-span-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl overflow-hidden bg-white p-0.5 shadow-md">
                  <img src="/RongRani-Logo.png" alt="RongRani Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">
                    Rong<span className="text-maroon dark:text-pink-400">Rani</span>
                  </h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">Authentic Surprises</p>
                </div>
              </div>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-sm">
                {t('footer_desc')}
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3">
                <a href="https://facebook.com/rongraniofficial" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-maroon hover:text-white flex items-center justify-center transition-all shadow-sm border border-slate-900" aria-label="Facebook">
                  <FaFacebook className="w-4.5 h-4.5" />
                </a>
                <a href="https://instagram.com/rongraniofficial" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-gradient-to-tr hover:from-yellow-500 hover:to-purple-600 hover:text-white flex items-center justify-center transition-all shadow-sm border border-slate-900" aria-label="Instagram">
                  <FaInstagram className="w-4.5 h-4.5" />
                </a>
                <a href="https://twitter.com/rongraniofficial" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all shadow-sm border border-slate-900" aria-label="Twitter">
                  <FaTwitter className="w-4.5 h-4.5" />
                </a>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="col-span-1">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6 relative">
                {t('quick_links')}
                <span className="absolute bottom-[-8px] left-0 w-8 h-0.75 bg-maroon dark:bg-pink-400 rounded-full"></span>
              </h4>
              <ul className="space-y-3.5">
                {[
                  { to: '/shop', label: t('shop') },
                  { to: '/about', label: t('about') },
                  { to: '/contact', label: t('contact') },
                  { to: '/wishlist', label: t('wishlist') },
                  { to: '/reviews', label: t('customer_reviews') }
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link to={link.to} className="text-slate-400 hover:text-maroon dark:hover:text-pink-400 transition-all flex items-center gap-2 text-xs md:text-sm font-semibold group">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-maroon dark:group-hover:bg-pink-400 transition-colors"></span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Care Column */}
            <div className="col-span-1">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6 relative">
                {t('customer_care')}
                <span className="absolute bottom-[-8px] left-0 w-8 h-0.75 bg-maroon dark:bg-pink-400 rounded-full"></span>
              </h4>
              <ul className="space-y-3.5">
                {[
                  { to: '/dashboard', label: t('my_orders') },
                  { to: '/quick-track', label: t('track_order') },
                  { to: '/help', label: t('help_center') },
                  { to: '/privacy-policy', label: t('privacy_policy') }
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link to={link.to} className="text-slate-400 hover:text-maroon dark:hover:text-pink-400 transition-all flex items-center gap-2 text-xs md:text-sm font-semibold group">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-maroon dark:group-hover:bg-pink-400 transition-colors"></span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact details */}
            <div className="col-span-2 lg:col-span-1 space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6 relative">
                {t('contact_info_label')}
                <span className="absolute bottom-[-8px] left-0 w-8 h-0.75 bg-maroon dark:bg-pink-400 rounded-full"></span>
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-xs md:text-sm">
                  <Phone className="w-4 h-4 mt-0.5 text-maroon dark:text-pink-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{t('call_us')}</p>
                    <a href="tel:+8801851075537" className="text-slate-300 hover:text-white font-bold leading-tight mt-0.5 inline-block">+880 1851-075537</a>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-xs md:text-sm">
                  <Mail className="w-4 h-4 mt-0.5 text-maroon dark:text-pink-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{t('email_us')}</p>
                    <a href="mailto:info.rongrani@gmail.com" className="text-slate-300 hover:text-white font-bold leading-tight mt-0.5 inline-block break-all">info.rongrani@gmail.com</a>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-xs md:text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 text-maroon dark:text-pink-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{t('location_label') || 'Location'}</p>
                    <span className="text-slate-300 font-bold leading-tight mt-0.5 inline-block">Cox's Bazar, Bangladesh-4700</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bg-slate-950 border-t border-slate-900/60 py-8 relative z-10">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Bangladesh Time Clock */}
            <div className="flex items-center gap-3 bg-slate-900/40 px-5 py-3 rounded-2xl border border-slate-900/80">
              <div className="relative shrink-0">
                <span className="absolute inset-0 bg-pink-500/25 blur-md rounded-full scale-150 animate-pulse"></span>
                <Clock className="w-5 h-5 text-maroon dark:text-pink-400 relative z-10" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-wider text-slate-500 font-black leading-none">{t('bd_local_time') || 'BD Local Time'}</p>
                <span className="text-white font-extrabold text-sm tracking-tight mt-1 inline-block leading-none">{bdTime}</span>
              </div>
            </div>

            {/* Copyright and developer details */}
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="leading-tight">
                <p className="text-xs text-slate-400 font-bold">© {currentYear} RongRani</p>
                <p className="text-[9px] text-slate-600 uppercase tracking-widest mt-0.5">{t('all_rights_reserved')}</p>
              </div>

              <div className="h-6 w-0.25 bg-slate-800 hidden sm:block"></div>

              <div className="leading-tight">
                <p className="text-xs text-slate-400">
                  {t('developed_with')} <Heart className="w-3 h-3 text-red-600 fill-red-600 inline-block mx-0.5" /> by{' '}
                  <button 
                    onClick={() => setShowDevProfile(true)} 
                    className="text-maroon dark:text-pink-400 font-black hover:underline cursor-pointer"
                  >
                    Salah Uddin Kader
                  </button>
                </p>
                <p className="text-[9px] text-slate-600 uppercase tracking-widest mt-0.5">MERN Stack Specialist</p>
              </div>
            </div>

          </div>
        </div>
      </footer>
      <DeveloperProfile isOpen={showDevProfile} onClose={() => setShowDevProfile(false)} />
    </>
  );
};

export default Footer;
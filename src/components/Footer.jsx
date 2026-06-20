import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Package, Shield, Heart, Truck } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-400 mt-16">
      {/* Trust bar */}
      <div className="border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders above ৳2500', color: 'text-blue-400' },
              { icon: Shield, title: 'Secure Checkout', desc: '100% Protected Payments', color: 'text-emerald-400' },
              { icon: Package, title: 'Easy Returns', desc: '7-Day Return Policy', color: 'text-amber-400' },
              { icon: Phone, title: '24/7 Support', desc: 'Dedicated Customer Helpline', color: 'text-rose-400' },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center ${color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white text-xs font-semibold">{title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden shrink-0">
                <img src="/RongRani-Logo.png" alt="RongRani Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Rong<span className="text-maroon">Rani</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto lg:mx-0 mb-4">
              {t('footer_desc')}
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <a href="https://facebook.com/rongraniofficial" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-maroon flex items-center justify-center text-slate-400 hover:text-white transition-all" aria-label="Facebook">
                <FaFacebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com/rongraniofficial" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-gradient-to-tr hover:from-yellow-500 hover:to-purple-600 flex items-center justify-center text-slate-400 hover:text-white transition-all" aria-label="Instagram">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="https://twitter.com/rongraniofficial" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-blue-500 flex items-center justify-center text-slate-400 hover:text-white transition-all" aria-label="Twitter">
                <FaTwitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">{t('quick_links')}</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/shop', label: t('shop') },
                { to: '/about', label: t('about') },
                { to: '/contact', label: t('contact') },
                { to: '/wishlist', label: t('wishlist') },
                { to: '/reviews', label: t('customer_reviews') }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="text-sm text-slate-500 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">{t('customer_care')}</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/dashboard', label: t('my_orders') },
                { to: '/quick-track', label: t('track_order') },
                { to: '/help', label: t('help_center') },
                { to: '/contact', label: t('contact') }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.to} className="text-sm text-slate-500 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">{t('contact_info_label')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm">
                <Phone className="w-4 h-4 mt-0.5 text-slate-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-600 uppercase tracking-wider font-medium">{t('call_us')}</p>
                  <a href="tel:+8801851075537" className="text-slate-400 hover:text-white font-medium transition-colors">+880 1851-075537</a>
                </div>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <Mail className="w-4 h-4 mt-0.5 text-slate-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-600 uppercase tracking-wider font-medium">{t('email_us')}</p>
                  <a href="mailto:info.rongrani@gmail.com" className="text-slate-400 hover:text-white font-medium transition-colors break-all">info.rongrani@gmail.com</a>
                </div>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-slate-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-600 uppercase tracking-wider font-medium">{t('location_label') || 'Location'}</p>
                  <span className="text-slate-400 font-medium">Cox's Bazar, Bangladesh-4700</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-3 gap-y-1 text-[11px]">
            {[
              { to: '/privacy-policy', label: t('privacy_policy') },
              { to: '/terms', label: t('terms_conditions') },
              { to: '/refund-policy', label: t('refund_policy') },
              { to: '/shipping-policy', label: t('shipping_policy') },
              { to: '/cookie-policy', label: t('cookie_policy') }
            ].map((link, idx) => (
              <Link key={idx} to={link.to} className="text-slate-500 hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <span className="text-xs text-slate-500 shrink-0">
            © {currentYear} RongRani · {t('developed_with')} <Heart className="w-3 h-3 text-red-500 fill-red-500 inline mx-0.5" />{' '}
            <Link to="/developer" className="text-maroon font-semibold hover:underline">Salah Uddin Kader</Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

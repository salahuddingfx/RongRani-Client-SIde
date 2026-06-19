import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, Package, ShoppingBag, Heart } from 'lucide-react';
import Seo from '../components/Seo';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Seo
        title="Page Not Found | RongRani"
        description="The gift you're looking for seems to have vanished into thin air! Let's get you back to the magic."
        noIndex
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center">
        {/* 404 Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[200px] md:text-[300px] font-black text-white/5 leading-none select-none">
            404
          </span>
        </div>

        {/* Icon Box */}
        <div className="relative mb-12">
          <div className="w-28 h-28 md:w-36 md:h-36 bg-maroon rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(190,18,60,0.3)]">
            <Package className="w-14 h-14 md:w-18 md:h-18 text-white" />
          </div>
          <div className="absolute -bottom-3 -right-3 w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <Search className="w-6 h-6 md:w-7 md:h-7 text-slate-900" />
          </div>
        </div>

        {/* Text Content */}
        <div className="max-w-xl mx-auto space-y-4">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full max-w-sm sm:max-w-none">
          <Link
            to="/"
            className="w-full sm:w-auto bg-maroon text-white px-8 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-maroon/90 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Return Home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Quick Links Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
          {[
            { to: '/shop', label: 'Shop', icon: ShoppingBag },
            { to: '/category/Surprise-Combo', label: 'Surprises', icon: Package },
            { to: '/wishlist', label: 'Wishlist', icon: Heart },
            { to: '/orders', label: 'Track Order', icon: Search }
          ].map((link, i) => (
            <Link
              key={i}
              to={link.to}
              className="bg-white/5 border border-white/5 p-5 rounded-xl transition-colors hover:bg-white/10 group"
            >
              <link.icon className="w-6 h-6 text-white/40 group-hover:text-white transition-colors mx-auto mb-2" />
              <h4 className="text-white text-sm font-medium">{link.label}</h4>
            </Link>
          ))}
        </div>

        {/* Brand Footer */}
        <div className="mt-16 opacity-30">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white rounded-full p-0.5 overflow-hidden">
              <img src="/RongRani-Logo.png" alt="RongRani" className="w-full h-full object-cover" />
            </div>
            <span className="text-white font-semibold tracking-widest text-xs uppercase">RongRani Handmade</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

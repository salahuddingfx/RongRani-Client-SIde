import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Home, Mail, Phone, MapPin, Clock, Package, Search, AlertTriangle } from 'lucide-react';
import Seo from '../components/Seo';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 py-12 px-4">
      <Seo
        title="Shipping Policy | RongRani"
        description="Learn about RongRani's shipping areas, rates, delivery times, and order tracking."
        path="/shipping-policy"
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center">
              <Truck className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3">
            Shipping Policy
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Last updated: February 7, 2026
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mb-3">
              <Package className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Free Shipping</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Free delivery on all orders above 2,500 taka.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mb-3">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Fast Processing</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Orders are processed within 1-2 business days.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mb-3">
              <Search className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Track Your Order</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Real-time tracking for every shipment.</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-8 md:p-10 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Introduction</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              At RongRani, we work hard to deliver your handmade gifts safely and on time. This shipping
              policy provides detailed information about our shipping methods, rates, delivery times, and
              how to track your order.
            </p>
          </section>

          {/* Shipping Areas */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <MapPin className="h-5 w-5 text-emerald-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Shipping Areas</h2>
            </div>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed">
                We currently ship to all addresses within Bangladesh. This includes all divisions, districts,
                and upazilas. We are working to expand our shipping coverage to international locations in the
                future.
              </p>
              <p className="leading-relaxed">
                Please ensure that your shipping address is complete and accurate, including any landmark
                references that may help our delivery partners locate you easily.
              </p>
            </div>
          </section>

          {/* Shipping Rates */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Package className="h-5 w-5 text-emerald-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Shipping Rates</h2>
            </div>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 mb-3">
                <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                  Free shipping on all orders above 2,500 taka!
                </p>
              </div>
              <p className="leading-relaxed">For orders below 2,500 taka, a flat shipping fee applies:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Dhaka city:</strong> 80 taka</li>
                <li><strong>Outside Dhaka:</strong> 120 taka</li>
              </ul>
              <p className="leading-relaxed mt-3">
                Shipping charges are calculated at checkout and will be displayed before you confirm your
                order. No hidden fees — what you see is what you pay.
              </p>
            </div>
          </section>

          {/* Processing Time */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="h-5 w-5 text-emerald-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Processing Time</h2>
            </div>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed">
                All orders are processed within <strong>1-2 business days</strong> after receiving your
                order confirmation. Please note that processing time may be longer during peak seasons
                (Eid, Valentine&apos;s Day, Mother&apos;s Day) or for personalized/custom items.
              </p>
              <p className="leading-relaxed">
                You will receive a shipping confirmation email with a tracking number once your order has
                been dispatched.
              </p>
            </div>
          </section>

          {/* Delivery Time */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Truck className="h-5 w-5 text-emerald-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Delivery Time</h2>
            </div>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed">Estimated delivery times after dispatch:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Dhaka city:</strong> 2-3 business days</li>
                <li><strong>Outside Dhaka:</strong> 4-7 business days</li>
              </ul>
              <p className="leading-relaxed mt-3">
                Delivery times are estimates and may vary due to weather conditions, holidays, or
                unforeseen circumstances. Rural or remote areas may experience slightly longer delivery
                times.
              </p>
            </div>
          </section>

          {/* Order Tracking */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Search className="h-5 w-5 text-emerald-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">6. Order Tracking</h2>
            </div>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed">
                Once your order is shipped, you will receive a tracking number via email and SMS. You can
                use this tracking number to monitor your shipment&apos;s progress in real-time through our
                website or the courier partner&apos;s tracking portal.
              </p>
              <p className="leading-relaxed">
                If you have trouble tracking your order, please contact our support team with your order
                number and we will assist you.
              </p>
            </div>
          </section>

          {/* Lost or Damaged Shipments */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-emerald-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">7. Lost or Damaged Shipments</h2>
            </div>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed">
                While we take every precaution to ensure safe delivery, accidents can happen. If your
                package arrives damaged or does not arrive within the estimated delivery window:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Contact us within 48 hours of the expected delivery date</li>
                <li>Provide photos of the damaged packaging and product (if applicable)</li>
                <li>We will investigate and either reship the item or issue a full refund</li>
              </ul>
              <p className="leading-relaxed mt-3">
                We are not responsible for packages that are lost due to incorrect shipping addresses
                provided by the customer.
              </p>
            </div>
          </section>

          {/* Contact Us */}
          <section className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Contact Us</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              If you have any questions about our shipping policy or need help with your order, please contact us:
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                <Mail className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">info.rongrani@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                <Phone className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">+8801851075537</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                <Home className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">Cox&apos;s Bazar, Bangladesh-4700</span>
              </div>
            </div>
          </section>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Link to="/" className="inline-flex items-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;

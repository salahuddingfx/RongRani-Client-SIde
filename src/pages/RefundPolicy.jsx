import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, Home, Mail, Phone, Shield, Clock, FileCheck, RefreshCw, AlertCircle } from 'lucide-react';
import Seo from '../components/Seo';
import Breadcrumb from '../components/Breadcrumb';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 py-12 px-4">
      <Breadcrumb items={[{ label: 'Refund Policy' }]} />
      <Seo
        title="Refund Policy | RongRani"
        description="Learn about RongRani's refund policy, eligibility, process, and timeline for returns."
        path="/refund-policy"
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
              <RotateCcw className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3">
            Refund Policy
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Last updated: February 7, 2026
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-3">
              <RotateCcw className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Easy Refunds</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">A simple, hassle-free process to get your money back.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-3">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">7-Day Window</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Request a refund within 7 days of receiving your order.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-3">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Secure Process</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Refunds are processed securely through your original payment method.</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-8 md:p-10 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Introduction</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              At RongRani, your satisfaction is our priority. We understand that sometimes a product may not
              meet your expectations. This refund policy outlines the guidelines and process for requesting
              a refund on your purchase.
            </p>
          </section>

          {/* Eligibility for Refund */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <FileCheck className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Eligibility for Refund</h2>
            </div>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed">You may be eligible for a refund if:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>The item arrived damaged or defective</li>
                <li>The wrong item was delivered</li>
                <li>The item does not match the description on the website</li>
                <li>You received the item late (beyond the guaranteed delivery window)</li>
                <li>The item is unused, unwashed, and in its original packaging</li>
              </ul>
              <p className="leading-relaxed mt-3">
                Refund requests must be made within 7 days of receiving the product. Requests made after this
                period may not be eligible for a refund.
              </p>
            </div>
          </section>

          {/* Non-Refundable Items */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Non-Refundable Items</h2>
            </div>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed">The following items are not eligible for a refund:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Personalized or custom-made items</strong> — These are crafted specifically for you and cannot be resold</li>
                <li><strong>Sale or discounted items</strong> — Products purchased during sales or at a reduced price</li>
                <li>Items that have been used, washed, or altered after delivery</li>
                <li>Items without original packaging or tags</li>
                <li>Gift cards and digital products</li>
              </ul>
            </div>
          </section>

          {/* Refund Process */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <RefreshCcw className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Refund Process</h2>
            </div>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed">To request a refund, please follow these steps:</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Contact our support team at info.rongrani@gmail.com or call +8801851075537</li>
                <li>Provide your order number and reason for the refund request</li>
                <li>Include photos of the product if it is damaged or defective</li>
                <li>Our team will review your request and respond within 2-3 business days</li>
                <li>If approved, you will receive instructions on how to return the item</li>
                <li>Once we receive and inspect the returned item, the refund will be processed</li>
              </ol>
            </div>
          </section>

          {/* Refund Timeline */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Refund Timeline</h2>
            </div>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed">
                Once your refund is approved, please allow <strong>7-14 business days</strong> for the refund
                to be processed and reflected in your account. The exact timeline depends on your payment method:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Credit/Debit Card:</strong> 7-14 business days</li>
                <li><strong>Mobile Banking (bKash, Nagad):</strong> 3-5 business days</li>
                <li><strong>Bank Transfer:</strong> 7-14 business days</li>
              </ul>
            </div>
          </section>

          {/* Late or Missing Refunds */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">6. Late or Missing Refunds</h2>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed">
                If you haven&apos;t received your refund within the expected timeframe, please check the following:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Check your bank or mobile account statement again</li>
                <li>Contact your bank or payment provider — processing times may vary</li>
                <li>If you&apos;ve done all of this and still have not received your refund, contact us at info.rongrani@gmail.com</li>
              </ul>
            </div>
          </section>

          {/* Exchanges */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <RefreshCw className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">7. Exchanges</h2>
            </div>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed">
                We only replace items if they are defective or damaged. If you need to exchange an item for
                the same product, send us an email at info.rongrani@gmail.com with your order number and
                photos of the defect. Our team will guide you through the exchange process.
              </p>
            </div>
          </section>

          {/* Contact Us */}
          <section className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Contact Us</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              If you have any questions about our refund policy or need assistance with a return, please contact us:
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="text-sm">info.rongrani@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                <Phone className="h-4 w-4 text-blue-500" />
                <span className="text-sm">+8801851075537</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                <Home className="h-4 w-4 text-blue-500" />
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

export default RefundPolicy;

import React from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Home, Mail, Phone, Shield, Settings, BarChart3, Megaphone, Heart, RefreshCw } from 'lucide-react';
import Seo from '../components/Seo';
import Breadcrumb from '../components/Breadcrumb';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 py-12 px-4">
      <Breadcrumb items={[{ label: 'Cookie Policy' }]} />
      <Seo
        title="Cookie Policy | RongRani"
        description="Learn how RongRani uses cookies to improve your shopping experience while respecting your privacy."
        path="/cookie-policy"
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center">
              <Cookie className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3">
            Cookie Policy
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Last updated: February 7, 2026
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center mb-3">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">We Value Privacy</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your privacy is at the heart of every cookie we use.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center mb-3">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">You&apos;re In Control</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage or disable cookies anytime from your browser.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center mb-3">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Transparent Practices</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">We clearly explain what each cookie does and why.</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-8 md:p-10 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Introduction</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              This Cookie Policy explains how RongRani (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) uses cookies and similar
              technologies when you visit our website. By using our website, you consent to the use of cookies
              as described in this policy.
            </p>
          </section>

          {/* What Are Cookies */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Cookie className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. What Are Cookies</h2>
            </div>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed">
                Cookies are small text files that are placed on your device when you visit a website. They are
                widely used to make websites work efficiently, provide a better user experience, and supply
                information to the site owners.
              </p>
              <p className="leading-relaxed">
                Cookies can be &quot;persistent&quot; (remaining on your device until deleted) or &quot;session-based&quot;
                (deleted when you close your browser).
              </p>
            </div>
          </section>

          {/* Types of Cookies We Use */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <BarChart3 className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Types of Cookies We Use</h2>
            </div>
            <div className="space-y-4 text-slate-600 dark:text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Essential Cookies</h3>
                <p className="leading-relaxed mb-2">
                  These cookies are necessary for the website to function properly. They enable core features
                  such as account login, shopping cart management, and secure checkout.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Analytics Cookies</h3>
                <p className="leading-relaxed mb-2">
                  These cookies help us understand how visitors interact with our website by collecting and
                  reporting information anonymously. This helps us improve our services and user experience.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Marketing Cookies</h3>
                <p className="leading-relaxed mb-2">
                  These cookies are used to track visitors across websites to display relevant advertisements.
                  They help us measure the effectiveness of our advertising campaigns.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Preference Cookies</h3>
                <p className="leading-relaxed mb-2">
                  These cookies allow the website to remember choices you make (such as your language, region,
                  or display preferences) and provide enhanced, personalized features.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Cookies */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Settings className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. How We Use Cookies</h2>
            </div>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed">We use cookies for the following purposes:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Keep you signed in during your session</li>
                <li>Remember your shopping cart contents</li>
                <li>Remember your language and currency preferences</li>
                <li>Analyze website traffic and user behavior</li>
                <li>Provide personalized product recommendations</li>
                <li>Prevent fraudulent activity and enhance security</li>
                <li>Measure the effectiveness of marketing campaigns</li>
              </ul>
            </div>
          </section>

          {/* Managing Cookies */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Settings className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Managing Cookies</h2>
            </div>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed">
                You can control and manage cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>View and delete cookies</li>
                <li>Block third-party cookies</li>
                <li>Block all cookies</li>
                <li>Clear all cookies when you close your browser</li>
              </ul>
              <p className="leading-relaxed mt-3">
                Please note that disabling cookies may affect the functionality of our website. Certain
                features may not work properly without cookies enabled.
              </p>
              <p className="leading-relaxed mt-2">
                For instructions on managing cookies, please refer to your browser&apos;s help documentation.
              </p>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Megaphone className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">6. Third-Party Cookies</h2>
            </div>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed">
                In addition to our own cookies, we may also use various third-party cookies to report usage
                statistics of the website and deliver advertisements on and through the site. These may include:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Google Analytics for website analytics</li>
                <li>Social media cookies for sharing features</li>
                <li>Advertising cookies for targeted promotions</li>
              </ul>
              <p className="leading-relaxed mt-3">
                We do not have control over third-party cookies. Please refer to the respective privacy
                policies of these third parties for more information.
              </p>
            </div>
          </section>

          {/* Changes to Cookie Policy */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <RefreshCw className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">7. Changes to This Policy</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for
              operational, legal, or regulatory reasons. We will notify you of any significant changes by
              posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          {/* Contact Us */}
          <section className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Contact Us</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              If you have any questions about our use of cookies or other technologies, please contact us:
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                <Mail className="h-4 w-4 text-amber-500" />
                <span className="text-sm">info.rongrani@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                <Phone className="h-4 w-4 text-amber-500" />
                <span className="text-sm">+8801851075537</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                <Home className="h-4 w-4 text-amber-500" />
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

export default CookiePolicy;

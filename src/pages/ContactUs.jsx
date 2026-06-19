import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Loader2 } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Seo from '../components/Seo';
import { useLanguage } from '../contexts/LanguageContext';

const ContactUs = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await axios.post('/api/contact', formData);
      if (response.data.success) {
        toast.success(t('message_sent_success'));
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        toast.error(t('message_send_failed'));
      }
    } catch (error) {
      console.error('Contact Form Error:', error);
      toast.error(error.response?.data?.message || t('generic_error'));
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 py-12 px-4">
      <Seo
        title="Contact RongRani | Gift Shop Support in Bangladesh"
        description="Contact RongRani for gift orders, custom surprises, and support. Call, email, or visit our gift shop team in Bangladesh."
        path="/contact"
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">{t('contact_title')}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('contact_subtitle')}
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 text-center">
            <div className="w-14 h-14 bg-maroon rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('call_us')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{t('mon_sat')}: 9AM - 9PM</p>
            <a href="tel:+8801851075537" className="text-maroon font-semibold hover:underline block">
              +880 1851-075537
            </a>
            <a href="tel:+8801570249301" className="text-maroon font-semibold hover:underline block">
              +880 1570-249301
            </a>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 text-center">
            <div className="w-14 h-14 bg-maroon rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('email_us')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{t('reply_24_hours')}</p>
            <a href="mailto:info.rongrani@gmail.com" className="text-maroon font-semibold hover:underline">
              info.rongrani@gmail.com
            </a>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 text-center">
            <div className="w-14 h-14 bg-maroon rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('visit_us')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{t('come_see_collection')}</p>
            <p className="text-slate-700 dark:text-slate-300 font-medium">
              House 23, Road 5<br />
              Cox&apos;s Bazar, Bangladesh-4700
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <MessageCircle className="mr-3 h-6 w-6 text-maroon" />
              {t('send_message')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('full_name')} *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-maroon/50 focus:border-maroon transition-colors"
                  placeholder={t('your_name_placeholder')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('email')} *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-maroon/50 focus:border-maroon transition-colors"
                    placeholder={t('your_email_placeholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('phone_number')}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-maroon/50 focus:border-maroon transition-colors"
                    placeholder="+880 1711-111111"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('subject_label') || 'Subject'} *</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-maroon/50 focus:border-maroon transition-colors"
                  placeholder={t('subject_placeholder') || 'How can we help you?'}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('message_label') || 'Message'} *</label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-maroon/50 focus:border-maroon transition-colors"
                  rows="5"
                  placeholder={t('message_placeholder')}
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full flex items-center justify-center space-x-2 bg-maroon hover:bg-maroon/90 text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{t('sending_msg')}</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>{t('send_message')}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="space-y-6">
            {/* Business Hours */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-maroon rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{t('business_hours')}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{t('monday_friday')}:</span>
                      <span className="text-slate-600 dark:text-slate-400">9:00 AM - 9:00 PM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{t('saturday')}:</span>
                      <span className="text-slate-600 dark:text-slate-400">10:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{t('sunday')}:</span>
                      <span className="text-slate-600 dark:text-slate-400">10:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-slate-100 dark:border-slate-700">
                      <span className="font-medium text-maroon">{t('holidays')}:</span>
                      <span className="text-maroon">{t('call_for_availability')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-maroon rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-2">{t('follow_us_social')}</h3>
              <p className="text-white/80 mb-5 text-sm">
                {t('stay_updated_social')}
              </p>
              <div className="flex space-x-3">
                <a href="https://facebook.com/rongraniofficial" className="w-11 h-11 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors">
                  <FaFacebook className="h-5 w-5" />
                </a>
                <a href="https://instagram.com/rongraniofficial" className="w-11 h-11 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors">
                  <FaInstagram className="h-5 w-5" />
                </a>
                <a href="https://twitter.com/rongraniofficial" className="w-11 h-11 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors">
                  <FaTwitter className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="w-full h-52 bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-maroon mx-auto mb-2" />
                  <p className="text-slate-700 dark:text-slate-300 font-semibold text-sm">{t('visit_showroom')}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Cox&apos;s Bazar, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

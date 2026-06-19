import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Award, ShoppingBag, Package, CheckCircle, Star, Globe } from 'lucide-react';
import Seo from '../components/Seo';
import { useLanguage } from '../contexts/LanguageContext';

const AboutUs = () => {
  const { t } = useLanguage();
  const stats = [
    { icon: ShoppingBag, value: '50+', label: t('products_sold') },
    { icon: Users, value: '100+', label: t('happy_customers') },
    { icon: Award, value: '05+', label: t('skilled_artisans') },
    { icon: Star, value: '4.8', label: t('avg_rating') },
  ];

  const values = [
    {
      icon: Heart,
      title: t('passion_for_crafts'),
      description: t('passion_desc'),
    },
    {
      icon: Award,
      title: t('premium_quality'),
      description: t('quality_desc'),
    },
    {
      icon: CheckCircle,
      title: t('cust_satisfaction'),
      description: t('cust_satisfaction_desc'),
    },
    {
      icon: Globe,
      title: t('cultural_heritage'),
      description: t('cultural_heritage_desc'),
    },
  ];

  const team = [
    {
      name: 'Salah Uddin Kader',
      role: t('founder_ceo'),
      image: 'https://ui-avatars.com/api/?name=Salah+Uddin+Kader&background=8B1538&color=fff&size=200',
      description: 'Visionary leader passionate about promoting Bangladeshi crafts globally.',
    },
    {
      name: 'Artisan Team',
      role: t('master_craftspeople'),
      image: 'https://ui-avatars.com/api/?name=Artisan+Team&background=C9A86A&color=fff&size=200',
      description: 'Skilled artisans keeping traditional Bangladeshi crafts alive through their expertise.',
    },
    {
      name: 'Customer Support',
      role: t('support_team_label'),
      image: 'https://ui-avatars.com/api/?name=Support+Team&background=2F3645&color=fff&size=200',
      description: 'Dedicated team ensuring every customer has a delightful shopping experience.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 py-12 px-4">
      <Seo
        title="About RongRani | Handmade Gifts in Bangladesh"
        description="Learn about RongRani, our artisans, and our mission to deliver handcrafted gifts and surprise boxes across Bangladesh."
        path="/about"
      />

      {/* Hero Section */}
      <section className="bg-maroon text-white rounded-2xl max-w-4xl mx-auto py-16 px-8 mb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('about_hero_title')}
          </h1>
          <p className="text-xl mb-4 text-white/90 leading-relaxed">
            {t('about_hero_subtitle')}
          </p>
          <p className="text-lg text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed">
            {t('about_hero_desc')}
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 bg-white text-maroon px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Explore Our Collection</span>
          </Link>
        </div>
      </section>

      <div className="max-w-4xl mx-auto">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 text-center"
            >
              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-7 w-7 text-maroon" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Our Story Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {t('crafting_memories')}
            </h2>
          </div>
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('about_story_p1')}
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('about_story_p2')}
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('about_story_p3')}
            </p>
            <blockquote className="border-l-4 border-maroon pl-6 py-2 my-6">
              <p className="text-lg text-slate-900 dark:text-white italic leading-relaxed">
                &ldquo;{t('mission_quote')}&rdquo;
              </p>
            </blockquote>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('about_story_p4')}
            </p>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {t('what_we_stand_for')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('values_guide')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6"
              >
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-maroon" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {t('meet_team')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('team_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden text-center"
              >
                <div className="bg-slate-100 dark:bg-slate-700 h-32 flex items-center justify-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-sm"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{member.name}</h3>
                  <div className="text-sm font-medium text-maroon mb-3">
                    {member.role}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-maroon rounded-2xl p-8 text-center">
          <Package className="h-12 w-12 text-white/80 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {t('ready_perfect_gift')}
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            {t('browse_cta_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center space-x-2 bg-white text-maroon px-6 py-3 rounded-full font-bold hover:bg-slate-100 transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>{t('shop_now_btn')}</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-bold border border-white/30 transition-colors"
            >
              <Heart className="h-5 w-5" />
              <span>{t('contact')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

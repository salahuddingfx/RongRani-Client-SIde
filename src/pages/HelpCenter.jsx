import React, { useState } from 'react';
import { HelpCircle, ShoppingBag, Truck, CreditCard, Gift, Package, RefreshCw, Shield, ChevronDown, ChevronUp, Search } from 'lucide-react';
import Seo from '../components/Seo';
import Breadcrumb from '../components/Breadcrumb';

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    {
      title: 'Orders & Purchases',
      icon: ShoppingBag,
      faqs: [
        {
          q: 'How do I place an order?',
          a: 'Browse our collection, add items to cart, proceed to checkout, enter your delivery details, and complete payment. You will receive an order confirmation via email.'
        },
        {
          q: 'Can I modify my order after placing it?',
          a: 'Yes! You can modify your order within 2 hours of placing it. Contact our support team immediately via phone or email with your order ID.'
        },
        {
          q: 'How do I track my order?',
          a: 'Visit the "My Orders" section in your account or use the "Track Order" feature. Enter your order ID to see real-time tracking updates.'
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept Cash on Delivery (COD), Mobile Banking (bKash, Nagad, Rocket), and Credit/Debit Cards.'
        }
      ]
    },
    {
      title: 'Shipping & Delivery',
      icon: Truck,
      faqs: [
        {
          q: 'What areas do you deliver to?',
          a: 'We deliver all over Bangladesh. Same-day delivery available in Dhaka city, 2-3 days for other major cities, and 3-5 days for remote areas.'
        },
        {
          q: 'What are the delivery charges?',
          a: 'Inside Cox\'s Bazar City: ৳70, Outside Cox\'s Bazar City: ৳150. FREE delivery on orders above ৳2500!'
        },
        {
          q: 'Can I choose a specific delivery time?',
          a: 'Yes! For special occasions, you can select a preferred delivery date and time slot during checkout (additional charges may apply).'
        },
        {
          q: 'What if I miss the delivery?',
          a: 'Our delivery agent will contact you 3 times. If unsuccessful, the order will be held for 24 hours before returning to warehouse.'
        }
      ]
    },
    {
      title: 'Payment & Pricing',
      icon: CreditCard,
      faqs: [
        {
          q: 'Is Cash on Delivery available?',
          a: 'Yes! COD is available for all orders. Just select "Cash on Delivery" at checkout.'
        },
        {
          q: 'Are prices negotiable?',
          a: 'Our prices are fixed, but we offer seasonal discounts, bundle deals, and special coupon codes. Subscribe to our newsletter for exclusive offers!'
        },
        {
          q: 'Do you have EMI facility?',
          a: 'Yes, EMI is available for credit card payments on orders above ৳5000. Check with your bank for EMI terms.'
        }
      ]
    },
    {
      title: 'Gift Customization',
      icon: Gift,
      faqs: [
        {
          q: 'Can I add a personalized message?',
          a: 'Absolutely! Add your heartfelt message in the "Gift Message" field during checkout. We\'ll include a beautiful handwritten card.'
        },
        {
          q: 'Do you offer gift wrapping?',
          a: 'Yes! All our gift items come with complimentary elegant gift wrapping. Premium wrapping available for ৳50 extra.'
        },
        {
          q: 'Can I create a custom gift combo?',
          a: 'Yes! Contact us with your requirements, budget, and occasion. Our team will create a personalized combo for you.'
        },
        {
          q: 'Do you deliver surprise gifts at midnight?',
          a: 'Yes! We offer midnight surprise delivery service in select areas. Contact customer support to arrange.'
        }
      ]
    },
    {
      title: 'Returns & Exchanges',
      icon: RefreshCw,
      faqs: [
        {
          q: 'What is your return policy?',
          a: '7-day return policy for damaged or defective items. Items must be unused, in original packaging with tags intact.'
        },
        {
          q: 'Can I exchange an item?',
          a: 'Yes! You can exchange within 5 days if the size, color, or design doesn\'t match. Contact us with photos of the item.'
        },
        {
          q: 'Who pays for return shipping?',
          a: 'We cover return shipping for damaged/defective items. For change-of-mind returns, customer pays return shipping.'
        },
        {
          q: 'How long does refund take?',
          a: 'Refunds are processed within 7-10 business days after we receive the returned item. Amount will be credited to your original payment method.'
        }
      ]
    },
    {
      title: 'Product Information',
      icon: Package,
      faqs: [
        {
          q: 'Are your products authentic?',
          a: 'Yes! We guarantee 100% authentic products. All jewellery items come with authenticity certificates.'
        },
        {
          q: 'What materials are used in jewellery?',
          a: 'We use gold-plated, sterling silver, and premium alloy materials. Full details are mentioned on each product page.'
        },
        {
          q: 'Do chocolates have expiry dates?',
          a: 'Yes, all food items have clear expiry dates. We ensure minimum 2-3 months shelf life for all chocolates.'
        },
        {
          q: 'Are products suitable for sensitive skin?',
          a: 'Most jewellery is hypoallergenic. Check product descriptions or contact us for specific allergy concerns.'
        }
      ]
    }
  ];

  const toggleFaq = (categoryIndex, faqIndex) => {
    const key = `${categoryIndex}-${faqIndex}`;
    setOpenFaq(openFaq === key ? null : key);
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 py-12 px-4">
      <Breadcrumb items={[{ label: 'Help Center' }]} />
      <Seo
        title="Help Center | RongRani Gift Delivery FAQs"
        description="Find answers about gift orders, delivery, payments, and returns. Browse RongRani help topics and FAQs."
        path="/help"
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <HelpCircle className="h-14 w-14 text-maroon mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Help Center</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Find answers to all your questions about gifts, delivery, and more
          </p>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm mb-10 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for help (e.g., delivery, payment, return...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-transparent text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const summary = category.faqs[0]?.q || 'Browse support topics';
            return (
              <a
                key={index}
                href={`#category-${index}`}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5 text-left"
              >
                <div className="w-11 h-11 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-3">
                  <Icon className="h-5 w-5 text-maroon" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{category.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {summary}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                  {category.faqs.length} answers
                </p>
              </a>
            );
          })}
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {(searchTerm ? filteredCategories : categories).map((category, catIndex) => {
            const Icon = category.icon;
            return (
              <div key={catIndex} id={`category-${catIndex}`} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-11 h-11 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                    <Icon className="h-5 w-5 text-maroon" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{category.title}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {category.faqs.length} common questions
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {category.faqs.map((faq, faqIndex) => {
                    const isOpen = openFaq === `${catIndex}-${faqIndex}`;
                    return (
                      <div
                        key={faqIndex}
                        className="border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggleFaq(catIndex, faqIndex)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <span className="font-semibold text-slate-900 dark:text-white pr-4 text-sm">{faq.q}</span>
                          {isOpen ? (
                            <ChevronUp className="h-4 w-4 text-maroon flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-3">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {searchTerm && filteredCategories.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm text-center py-16">
            <HelpCircle className="h-14 w-14 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No results found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Try different keywords or browse categories above</p>
            <button
              onClick={() => setSearchTerm('')}
              className="bg-maroon hover:bg-maroon/90 text-white px-6 py-2 rounded-xl font-bold transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Still Need Help */}
        <div className="bg-maroon rounded-2xl text-center p-8 mt-10">
          <Shield className="h-12 w-12 text-white/80 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Still Need Help?</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto text-sm">
            Our dedicated support team is here to assist you with any questions or concerns
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/contact" className="bg-white text-maroon hover:bg-slate-100 px-6 py-3 rounded-xl font-bold transition-colors">
              Contact Support
            </a>
            <a href="tel:+8801851075537" className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold border border-white/30 transition-colors">
              Call: +880 18510-75537
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;

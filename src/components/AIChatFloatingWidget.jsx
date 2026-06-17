import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Minimize2, Sparkles, Package, MessageCircle, Phone, ShoppingBag } from 'lucide-react';

const AIChatFloatingWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! Welcome to RongRani! I'm your AI assistant. What can I help you with today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const deliverySettings = {
    chittagongFee: 70,
    outsideChittagongFee: 150,
    freeShippingThreshold: 2500,
  };
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Note: We use default delivery settings in the AI chat
  // These will be updated when admin changes settings and page reloads
  // For real-time updates, a Socket.io listener can be added

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    if (msg.includes('love') || msg.includes('romantic') || msg.includes('প্রেম')) {
      return "Perfect! Our Love Combo Special (৳2500) includes a handwritten love letter, chocolates, and a teddy bear. We also have Couple Rings Set (৳3500) and Valentine Special Combo (৳6500). Which one interests you?";
    } else if (msg.includes('anniversary') || msg.includes('বার্ষিকী')) {
      return "For anniversaries, our Anniversary Surprise Box (৳5500) is the best seller! It includes a necklace, bangles, and a love note. Also check out Couple Watch Set (৳7500) and Premium Gift Sharee (৳6500).";
    } else if (msg.includes('birthday') || msg.includes('জন্মদিন')) {
      return "Birthday Gift Box (৳3500) is super popular! For something extra special, try Premium Luxury Gift Box (৳9500) or Proposal Gift Box (৳8500). What's your budget?";
    } else if (msg.includes('chocolate') || msg.includes('চকলেট')) {
      return "We have amazing chocolates! Premium Chocolate Gift Box (৳1500) with assorted Dairy Milk, KitKat & Silk, and Heart Shape Chocolate Box (৳2200) for romantic occasions!";
    } else if (msg.includes('price') || msg.includes('cost') || msg.includes('দাম')) {
      return "Our products range from ৳500 (Handwritten Love Letter) to ৳9500 (Premium Luxury Gift Box). Most popular items are between ৳1500-৳5500. What's your budget?";
    } else if (msg.includes('delivery') || msg.includes('shipping') || msg.includes('ডেলিভারি')) {
      return `Cox's Bazar: ৳${deliverySettings.chittagongFee} | Other districts: ৳${deliverySettings.outsideChittagongFee} | FREE delivery on orders above ৳${deliverySettings.freeShippingThreshold}.`;
    } else if (msg.includes('payment') || msg.includes('পেমেন্ট')) {
      return "We accept: Cash on Delivery (COD), bKash, Nagad, Rocket. For mobile banking, please provide Transaction ID and last 4 digits after payment.";
    } else if (msg.includes('track') || msg.includes('order') || msg.includes('অর্ডার')) {
      return "You can track your order from 'My Orders' page after logging in. We send email updates for every status change. Need help with a specific order?";
    } else if (msg.includes('contact') || msg.includes('call') || msg.includes('যোগাযোগ')) {
      return "Call us: +8801851075537 | Email: info.rongrani@gmail.com | WhatsApp: Click the green button on left! We reply instantly!";
    } else if (msg.includes('gift') || msg.includes('suggest') || msg.includes('উপহার')) {
      return "What's the occasion? Choose from: Love/Romance | Birthday | Anniversary | Proposal | Valentine's | Graduation. Tell me and I'll suggest perfect gifts!";
    } else if (msg.includes('thanks') || msg.includes('thank') || msg.includes('ধন্যবাদ')) {
      return "You're very welcome! Feel free to ask anything anytime. Happy shopping at RongRani! Need anything else?";
    } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('হাই')) {
      return "Hello! Great to see you! I'm here to help you find the perfect gift. Tell me, what occasion are you shopping for today?";
    } else if (msg.includes('help') || msg.includes('সহায়তা') || msg.includes('/')) {
      return "Important Commands & Links:\n\n" +
        "Track Order: Navigate to /track\n" +
        "Shop: Browse our collection at /shop\n" +
        "Contact: Call +8801851075537\n" +
        "WhatsApp: Direct support at wa.me/8801851075537\n" +
        "Help Center: Visit /help for FAQs\n\n" +
        "Simply type what you're looking for (e.g., 'birthday gift') and I'll find it for you!";
    } else {
      return "I'm here to help! Type 'help' to see all important links, or ask me about:\n\n" +
        "• Order Tracking\n" +
        "• Gift Suggestions\n" +
        "• Delivery & Shipping\n" +
        "• Payment Methods\n\n" +
        "What can I do for you today?";
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);

    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 800);

    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-[1001] bg-white/95 dark:bg-slate-900/95 text-maroon dark:text-pink-400 rounded-full p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-maroon/20 hover:scale-110 active:scale-95 transition-all duration-500 group border border-maroon/20 dark:border-pink-500/20 backdrop-blur-md flex items-center justify-center"
          aria-label="Open AI Chat"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-maroon/10 to-pink-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          {/* Pulsing glow ring */}
          <span className="absolute inset-0 rounded-full border border-maroon/30 dark:border-pink-500/30 animate-ping opacity-75 pointer-events-none scale-102"></span>
          
          <Bot className="h-6.5 w-6.5 relative z-10 transition-transform duration-500 group-hover:rotate-12" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border border-white dark:border-slate-900"></span>
          
          <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 text-maroon dark:text-pink-400 border border-maroon/10 dark:border-pink-500/10 px-4 py-2 rounded-2xl text-xs font-black shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none hidden sm:block backdrop-blur-md">
            Need Help? Chat with AI!
          </div>
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-[1001] w-[calc(100vw-2rem)] sm:w-85 md:w-96 h-[450px] sm:h-[530px] max-h-[70vh] sm:max-h-[calc(100vh-8rem)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-maroon to-pink-950 text-white p-4 flex items-center justify-between relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm -skew-x-12 translate-x-1/2"></div>
            <div className="flex items-center space-x-3 relative z-10">
              <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden group/icon border border-white/10">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm md:text-base tracking-tight">RongRani Assistant</h3>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                  <p className="text-[9px] text-pink-200 font-black uppercase tracking-wider">Online & Active</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 rounded-xl p-2 transition-all hover:rotate-90 relative z-10 text-white/80 hover:text-white"
              aria-label="Close Chat"
            >
              <X className="h-5.5 w-5.5" />
            </button>
          </div>

          {/* Quick Actions Bar */}
          <div className="bg-slate-50/60 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/80 p-2 flex overflow-x-auto gap-2 shrink-0 scrollbar-hide no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            <a href="/track" className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:border-maroon hover:text-maroon dark:hover:text-pink-400 text-slate-600 dark:text-slate-300 text-[10px] font-black rounded-xl transition-all border border-slate-200/60 dark:border-slate-700/80 shadow-sm shrink-0">
              <Package className="w-3.5 h-3.5" /> Track Order
            </a>
            <a href="https://wa.me/8801851075537" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:border-emerald-500 hover:text-emerald-500 text-slate-600 dark:text-slate-300 text-[10px] font-black rounded-xl transition-all border border-slate-200/60 dark:border-slate-700/80 shadow-sm shrink-0">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp
            </a>
            <a href="tel:+8801851075537" className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:border-blue-500 hover:text-blue-500 text-slate-600 dark:text-slate-300 text-[10px] font-black rounded-xl transition-all border border-slate-200/60 dark:border-slate-700/80 shadow-sm shrink-0">
              <Phone className="w-3.5 h-3.5 text-blue-500" /> Call Support
            </a>
            <a href="/shop" className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:border-amber-500 hover:text-amber-500 text-slate-600 dark:text-slate-300 text-[10px] font-black rounded-xl transition-all border border-slate-200/60 dark:border-slate-700/80 shadow-sm shrink-0">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-500" /> Shop Now
            </a>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 dark:bg-slate-900/10 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm border ${message.sender === 'user'
                    ? 'bg-maroon text-white dark:bg-pink-500 dark:text-slate-950 border-transparent rounded-br-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-100 dark:border-slate-700/60 rounded-bl-sm'
                    }`}
                >
                  {message.sender === 'bot' && (
                    <div className="flex items-center space-x-1.5 mb-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                      <span className="font-black text-[10px] uppercase tracking-wider text-maroon dark:text-pink-400">RongRani Bot</span>
                    </div>
                  )}
                  <p className="text-xs md:text-sm leading-relaxed whitespace-pre-line font-medium">
                    {message.text}
                  </p>
                  <p className={`text-[9px] mt-1.5 font-bold ${message.sender === 'user' ? 'text-white/60 dark:text-slate-950/60' : 'text-slate-400'}`}>
                    {new Date(message.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Panel */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  id="ai-chat-input"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  aria-label="Message to AI assistant"
                  className="w-full px-4 py-3 pr-10 border border-slate-200 dark:border-slate-700 focus:border-maroon dark:focus:border-pink-500 focus:ring-1 focus:ring-maroon rounded-2xl resize-none text-xs md:text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 outline-none transition-all scrollbar-hide"
                  rows={1}
                  style={{
                    minHeight: '44px',
                    maxHeight: '100px'
                  }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-maroon hover:bg-maroon-dark text-white dark:bg-pink-500 dark:hover:bg-pink-600 dark:text-slate-950 p-3 rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all shadow-md shrink-0"
                aria-label="Send Message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2 font-bold uppercase tracking-wider">
              Powered by RongRani AI
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatFloatingWidget;

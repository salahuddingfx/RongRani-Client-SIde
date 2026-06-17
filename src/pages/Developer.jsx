import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, MapPin, Code2, Database, Layout, Server, MessageCircle, GitBranch, Box, Cloud, Zap, Layers, Terminal, Atom, Wind, HardDrive, Network, Globe2, FileCode, ExternalLink, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { FaGithub, FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import Seo from '../components/Seo';

const Developer = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeTab, setActiveTab] = useState('developer'); // 'developer' or 'agency'

  const developerSkills = {
    frontend: ['React.js', 'Next.js', 'Redux Toolkit', 'Tailwind CSS', 'JavaScript (ES6+)', 'TypeScript'],
    backend: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'GraphQL', 'JWT Auth'],
    tools: ['Git & GitHub', 'Docker', 'AWS', 'Firebase', 'Vercel / Heroku', 'Postman']
  };

  const skillIcons = {
    'React.js': Atom,
    'Next.js': Globe2,
    'Redux Toolkit': Layers,
    'Tailwind CSS': Wind,
    'JavaScript (ES6+)': FileCode,
    'TypeScript': Code2,
    'Node.js': Server,
    'Express.js': Zap,
    'MongoDB': Database,
    'REST APIs': Network,
    'GraphQL': GitBranch,
    'JWT Auth': ShieldCheck,
    'Git & GitHub': GitBranch,
    'Docker': Box,
    'AWS': Cloud,
    'Firebase': Zap,
    'Vercel / Heroku': Globe,
    'Postman': Terminal
  };

  const agencyServices = [
    { title: 'Full-Stack Web Apps', desc: 'Custom tailored enterprise SaaS and MERN stack business management web portals.', icon: Code2 },
    { title: 'Premium E-Commerce Systems', desc: 'High-performance ecommerce platforms with local/global payments, coupons, real-time inventory, and SMS/Email automation.', icon: Database },
    { title: 'UI/UX Interactive Design', desc: 'Stunning layouts, interactive dashboards, micro-interactions, and premium responsive web design.', icon: Layout },
    { title: 'API Integration & Cloud', desc: 'Secure third-party API configurations, custom messaging gateways, courier integrations, and cloud hosting.', icon: Server }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-16 relative overflow-hidden transition-colors duration-300">
      <Seo
        title="Meet the Developers | Nextora Studio & Salah Uddin Kader"
        description="Discover the creative minds behind RongRani. Salah Uddin Kader (MERN Stack Expert) & Nextora Studio - delivering high-performance, premium web applications."
        path="/developer"
      />

      {/* Decorative Background Glows */}
      <div className="absolute top-40 left-10 w-96 h-96 bg-maroon/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        
        {/* Header Hero Panel */}
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="bg-maroon/10 dark:bg-pink-900/30 text-maroon dark:text-pink-400 text-xs sm:text-sm font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full">
            Engineering Excellence
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-white mt-4 tracking-tight">
            Meet the Developers
          </h1>
          <p className="text-slate text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Designing and building high-fidelity web experiences that combine lightning-fast performance with premium aesthetics.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-10 animate-fade-in-up stagger-1">
          <div className="bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex gap-2">
            <button
              onClick={() => setActiveTab('developer')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === 'developer'
                  ? 'bg-maroon text-white shadow-lg shadow-maroon/10'
                  : 'text-slate hover:text-maroon dark:hover:text-pink-400 bg-transparent'
              }`}
            >
              Lead Developer Profile
            </button>
            <button
              onClick={() => setActiveTab('agency')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === 'agency'
                  ? 'bg-maroon text-white shadow-lg shadow-maroon/10'
                  : 'text-slate hover:text-maroon dark:hover:text-pink-400 bg-transparent'
              }`}
            >
              Nextora Studio (Agency)
            </button>
          </div>
        </div>

        {/* Tab Contents: Lead Developer */}
        {activeTab === 'developer' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">
            
            {/* Left Column: Brief profile card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 text-center">
                <div className="relative inline-block group mb-5">
                  <div className="w-32 h-32 bg-maroon/5 rounded-3xl overflow-hidden border-4 border-maroon p-1 shadow-xl">
                    <img
                      src="https://github.com/salahuddingfx.png"
                      alt="Salah Uddin Kader"
                      className="w-full h-full object-cover rounded-2xl"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <span className="w-full h-full flex items-center justify-center text-4xl font-bold text-maroon dark:text-pink-400 bg-maroon/10 dark:bg-pink-900/30 hidden rounded-2xl">
                      SK
                    </span>
                  </div>
                  <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-lg" title="Active Developer">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-1">
                  Salah Uddin Kader
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-maroon dark:text-pink-400 uppercase tracking-wider mb-4">
                  Lead MERN Stack Expert
                </p>

                <div className="flex justify-center items-center gap-2 text-xs text-slate mb-6 bg-slate-50 dark:bg-slate-900/50 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                  <MapPin className="h-4 w-4 text-maroon shrink-0" />
                  <span>Cox's Bazar, Bangladesh</span>
                </div>

                {/* Social Connect buttons */}
                <div className="space-y-2.5">
                  <a
                    href="https://github.com/salahuddingfx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 bg-slate-900 hover:bg-slate-950 text-white rounded-2xl text-sm font-bold transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <FaGithub className="w-5 h-5 shrink-0" />
                      <span>GitHub</span>
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-75" />
                  </a>

                  <a
                    href="https://facebook.com/salahuddingfx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <FaFacebook className="w-5 h-5 shrink-0" />
                      <span>Facebook</span>
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-75" />
                  </a>

                  <a
                    href="https://salahuddin.codes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 bg-maroon hover:bg-maroon-dark text-white rounded-2xl text-sm font-bold transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 shrink-0" />
                      <span>Portfolio Website</span>
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-75" />
                  </a>

                  <a
                    href="https://wa.me/8801570249299"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-bold transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <FaWhatsapp className="w-5 h-5 shrink-0" />
                      <span>WhatsApp Chat</span>
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-75" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Detailed info & tech stack */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Biography Section */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2.5">
                  <Code2 className="w-6 h-6 text-maroon" />
                  <span>About Salah Uddin</span>
                </h3>
                <p className="text-slate text-sm sm:text-base leading-relaxed mb-4">
                  I am a professional Full-Stack Developer with 1.5+ years of focus on high-fidelity web applications and MERN stack infrastructures. 
                  My core focus is executing state-of-the-art designs, complex state flows, and secure APIs into production-ready platforms.
                </p>
                <div className="border-l-4 border-maroon dark:border-pink-600 bg-maroon/5 dark:bg-pink-600/5 p-4 rounded-r-2xl italic text-slate text-sm sm:text-base leading-relaxed">
                  "Building RongRani required implementing optimized asset deliveries, real-time sync systems with Socket.io, and a modular framework to support multi-step checkout processes. My commitment is crafting code that translates seamlessly into absolute luxury for customers."
                </div>
              </div>

              {/* Technologies Section */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 sm:p-8 space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2.5">
                  <Terminal className="w-6 h-6 text-maroon" />
                  <span>Technical Proficiency</span>
                </h3>

                {/* Frontend */}
                <div>
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Frontend Architecture</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {developerSkills.frontend.map(skill => {
                      const Icon = skillIcons[skill];
                      return (
                        <span key={skill} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                          {Icon && <Icon className="w-3.5 h-3.5 text-blue-500" />}
                          <span>{skill}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Backend */}
                <div>
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Backend & Database</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {developerSkills.backend.map(skill => {
                      const Icon = skillIcons[skill];
                      return (
                        <span key={skill} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                          {Icon && <Icon className="w-3.5 h-3.5 text-green-500" />}
                          <span>{skill}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Tools */}
                <div>
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Tools & Systems</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {developerSkills.tools.map(skill => {
                      const Icon = skillIcons[skill];
                      return (
                        <span key={skill} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                          {Icon && <Icon className="w-3.5 h-3.5 text-purple-500" />}
                          <span>{skill}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

          </div>
        ) : (
          /* Tab Contents: Nextora Studio Agency */
          <div className="space-y-8 animate-slide-up">
            
            {/* Agency Banner Info */}
            <div className="bg-gradient-to-tr from-slate-900 to-slate-800 text-white rounded-[2rem] border border-slate-850 p-6 sm:p-10 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-maroon/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="max-w-2xl relative z-10 space-y-4">
                <span className="bg-maroon text-white text-[10px] font-black tracking-widest uppercase px-3.5 py-1.5 rounded-full inline-block">
                  Creative Software Agency
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                  Nextora Studio
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Nextora Studio is a next-gen digital agency specialized in crafting luxury software solutions. We conceptualize, build, and deploy ultra-performance platforms, interactive UI systems, and robust enterprise infrastructures that elevate brand authority.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <a
                    href="https://nextorastudio.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3 bg-white text-slate-900 hover:bg-slate-50 font-bold text-sm rounded-xl transition-all shadow-lg shadow-black/10"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Visit website: nextorastudio.tech</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Agency Contacts & Socials */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 sm:p-8 space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2.5">
                  <Network className="w-6 h-6 text-maroon" />
                  <span>Connect with Agency</span>
                </h3>
                <p className="text-slate text-sm">
                  Reach out to Nextora Studio for collaboration, enterprise partnerships, or custom software projects.
                </p>

                <div className="space-y-3">
                  <a
                    href="https://nextorastudio.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-slate shrink-0 group-hover:text-maroon transition-colors" />
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase leading-none">Official Site</p>
                        <span className="text-slate-800 dark:text-white text-xs sm:text-sm font-bold mt-1 inline-block">nextorastudio.tech</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate group-hover:translate-x-1 transition-transform" />
                  </a>

                  <a
                    href="https://instagram.com/nextorastudio.bd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <FaInstagram className="w-5 h-5 text-slate shrink-0 group-hover:text-pink-600 transition-colors" />
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase leading-none">Instagram</p>
                        <span className="text-slate-800 dark:text-white text-xs sm:text-sm font-bold mt-1 inline-block">@nextorastudio.bd</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate group-hover:translate-x-1 transition-transform" />
                  </a>

                  <a
                    href="https://facebook.com/nextorastudio.bd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <FaFacebook className="w-5 h-5 text-slate shrink-0 group-hover:text-blue-600 transition-colors" />
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase leading-none">Facebook</p>
                        <span className="text-slate-800 dark:text-white text-xs sm:text-sm font-bold mt-1 inline-block">Nextora Studio BD</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Agency Core Values */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 sm:p-8 space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2.5">
                  <Zap className="w-6 h-6 text-maroon" />
                  <span>Expertise & Services</span>
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {agencyServices.map(service => {
                    const Icon = service.icon;
                    return (
                      <div key={service.title} className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-maroon/5 flex items-center justify-center text-maroon shrink-0 mt-0.5">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white text-sm sm:text-base leading-tight">
                            {service.title}
                          </h4>
                          <p className="text-slate text-xs mt-1 leading-normal">
                            {service.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Agency Direct Contact Hire */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 sm:p-10 text-center mt-12 animate-fade-in-up">
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white mb-2">
            Build Your Dream Project with Us
          </h3>
          <p className="text-slate text-sm max-w-xl mx-auto mb-6">
            Looking for expert development or premium UI designs? The Nextora Studio engineering team is ready to materialize your vision.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <a
              href="mailto:salauddinkaderappy@gmail.com"
              className="w-full sm:w-auto btn-primary px-8 py-3.5 rounded-xl font-bold transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              <span>Contact Nextora Studio</span>
            </a>
            <a
              href="https://nextorastudio.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto btn-secondary px-8 py-3.5 rounded-xl font-bold transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              <Globe className="w-5 h-5" />
              <span>Visit nextorastudio.tech</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Developer;

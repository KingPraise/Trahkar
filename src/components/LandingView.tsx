import React, { useEffect, useState, useRef } from 'react';

const faqItems = [
  {
    question: "📡 How does the offline sync capability work when electricity or network cuts out?",
    answer: "Trahka operates using safe local database stores built directly within your device's web browser sector (utilizing secure secure-sandbox indexing). Every transaction, stock alteration, and debtor update is processed key-by-key in complete isolation without calling the internet. Once electricity returns and network channels reconnect, Trahka detects the secure socket and propagates backlogged data securely to remote servers in under 3 seconds."
  },
  {
    question: "🛡️ Where is our commercial business data stored, and is it confidential?",
    answer: "Your inventory values, P&L reports, and staff logs are securely hashed locally on your physical system and wrapped in 256-bit automated encryption keys during cloud transitions (TLS 1.3 protocol standards). Your financial ledger balances remain strictly private to you. We do not inspect, rent, or distribute store records, satisfying absolute transactional secrecy."
  },
  {
    question: "👥 Can store attendants or staff manipulate master medicine prices or override profit records?",
    answer: "Absolutely not. Trahka includes comprehensive staff role-based restriction layers. Desk-side cashiers or dispensaries can query stock listings and log daily sales, but they are fully restricted from opening backend expense streams, altering master medicine selling tariffs, or wiping historical customer files. Primary audit permissions remain locked under owner override controls."
  },
  {
    question: "📱 What happens to our databases if a mobile phone or retail computer gets damaged or stolen?",
    answer: "Since Trahka holds high-frequency server synchronization buffers, your entire store profile is continuously updated on remote enterprise servers. If a device breaks down or is stolen, you can simply load the Trahka web platform on any other computer, login with your credentials, and restore your exact dashboard state—retaining all debtors, supplier tags, and history tags instantly."
  },
  {
    question: "💬 Does Trahka protect our custom client listings and debt balance notes safely?",
    answer: "Yes, fully in accordance with confidential data metrics. Debtor registries, contact details, and custom WhatsApp message templates are stored strictly in dedicated workspace sectors. Custom debt reminders are never dispatched without your conscious consent. Automatic reminders are initiated strictly at your command, avoiding unsolicited customer alerts or external disclosures."
  }
];

interface LandingViewProps {
  onEnterApp: () => void;
  onSignupClick: () => void;
}

export default function LandingView({ onEnterApp, onSignupClick }: LandingViewProps) {
  const [navScrolled, setNavScrolled] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [activeReveals, setActiveReveals] = useState<Record<string, boolean>>({});
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [heroActive, setHeroActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroActive(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // Stats Counters
  const [smeCount, setSmeCount] = useState(0);
  const [pharmacyCount, setPharmacyCount] = useState(0);
  const [softwareCount, setSoftwareCount] = useState(0);
  const [marketValueCount, setMarketValueCount] = useState(0);

  // Trigger counters when stat section is in view
  const statsRef = useRef<HTMLDivElement | null>(null);

  // Scroll event for navbar coloring and opacity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setNavScrolled(true);
      } else {
        setNavScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse move event for 3D parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (window.innerWidth / 2 - e.clientX) / 50;
    const y = (window.innerHeight / 2 - e.clientY) / 50;
    setParallaxOffset({ x, y });
  };

  // IntersectionObserver for Scroll Reveal & Animate Stats
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id || entry.target.getAttribute('data-reveal-id') || '';
            setActiveReveals((prev) => ({ ...prev, [id]: true }));

            // Trigger stat counting if it's the stats section
            if (entry.target === statsRef.current) {
              startCounting();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    // Target elements
    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  // Count animations
  const startCounting = () => {
    // 84M+
    let startSme = 0;
    const endSme = 84;
    const timerSme = setInterval(() => {
      startSme += 2;
      if (startSme >= endSme) {
        setSmeCount(endSme);
        clearInterval(timerSme);
      } else {
        setSmeCount(startSme);
      }
    }, 45);

    // 100k+
    let startPharm = 0;
    const endPharm = 100;
    const timerPharm = setInterval(() => {
      startPharm += 2;
      if (startPharm >= endPharm) {
        setPharmacyCount(endPharm);
        clearInterval(timerPharm);
      } else {
        setPharmacyCount(startPharm);
      }
    }, 40);

    // <3%
    let startSoft = 0;
    const endSoft = 3;
    const timerSoft = setInterval(() => {
      startSoft += 1;
      if (startSoft >= endSoft) {
        setSoftwareCount(endSoft);
        clearInterval(timerSoft);
      } else {
        setSoftwareCount(startSoft);
      }
    }, 300);

    // $1.97B
    let startValue = 0.0;
    const endValue = 1.97;
    const timerValue = setInterval(() => {
      startValue += 0.05;
      if (startValue >= endValue) {
        setMarketValueCount(endValue);
        clearInterval(timerValue);
      } else {
        setMarketValueCount(parseFloat(startValue.toFixed(2)));
      }
    }, 50);
  };

  // Smooth scroll logic
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-surface font-inter text-on-surface overflow-x-hidden min-h-screen">
      
      {/* Top Navigation Header */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 h-20 flex items-center ${
          navScrolled 
            ? 'bg-white shadow-md border-b border-border' 
            : 'bg-trahka-navy/85 backdrop-blur-md'
        }`}
      >
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full">
          <div className="flex flex-col">
            <a 
              href="#" 
              onClick={(e) => handleAnchorClick(e, 'html')}
              className={`font-headline-page text-headline-page font-extrabold tracking-tight transition-colors duration-200 ${
                navScrolled ? 'text-trahka-navy' : 'text-white'
              }`}
            >
              Trahka
            </a>
            <span className="text-[10px] text-muted md:hidden">SME Operating System for Africa</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a 
              className={`font-medium text-sm transition-colors duration-200 ${
                navScrolled ? 'text-secondary hover:text-trahka-navy' : 'text-white/80 hover:text-white'
              }`} 
              href="#product"
              onClick={(e) => handleAnchorClick(e, '#product')}
            >
              Product
            </a>
            <a 
              className={`font-medium text-sm transition-colors duration-200 ${
                navScrolled ? 'text-secondary hover:text-trahka-navy' : 'text-white/80 hover:text-white'
              }`} 
              href="#how-it-works"
              onClick={(e) => handleAnchorClick(e, '#how-it-works')}
            >
              How It Works
            </a>
            <a 
              className={`font-medium text-sm transition-colors duration-200 ${
                navScrolled ? 'text-secondary hover:text-trahka-navy' : 'text-white/80 hover:text-white'
              }`} 
              href="#why-trahka"
              onClick={(e) => handleAnchorClick(e, '#why-trahka')}
            >
              Why Trahka
            </a>
            <a 
              className={`font-medium text-sm transition-colors duration-200 ${
                navScrolled ? 'text-secondary hover:text-trahka-navy' : 'text-white/80 hover:text-white'
              }`} 
              href="#vision"
              onClick={(e) => handleAnchorClick(e, '#vision')}
            >
              Vision
            </a>
            <a 
              className={`font-medium text-sm transition-colors duration-200 ${
                navScrolled ? 'text-secondary hover:text-trahka-navy' : 'text-white/80 hover:text-white'
              }`} 
              href="#faq"
              onClick={(e) => handleAnchorClick(e, '#faq')}
            >
              FAQs
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={onEnterApp}
              className={`hidden sm:block font-bold text-sm hover:underline transition-colors ${
                navScrolled ? 'text-trahka-navy' : 'text-white'
              }`}
            >
              Sign In
            </button>
            <button 
              onClick={onSignupClick}
              className="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-xl font-bold text-sm cta-hover active:scale-95 transition-all cursor-pointer"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        onMouseMove={handleMouseMove}
        className="relative pt-32 pb-20 md:py-48 bg-trahka-navy hero-3d-bg overflow-hidden min-h-screen flex items-center"
      >
        <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-7xl relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className={`text-center lg:text-left space-y-8 reveal ${heroActive ? 'active' : ''}`}>
              <span className="inline-block bg-primary/20 border border-primary/40 text-primary-fixed px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-widest uppercase">
                African SME Infrastructure
              </span>
              <h1 className="text-white font-extrabold text-5xl md:text-7xl leading-[1.1] max-w-xl mx-auto lg:mx-0 tracking-tight">
                Every African Business Deserves to See Clearly.
              </h1>
              <p className="text-blue-200/80 text-xl leading-relaxed max-w-lg mx-auto lg:mx-0">
                Trahka is the back-office operating system built for Nigerian and African SMEs. Know your stock. Know your sales. Know your profit.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
                <button 
                  onClick={onSignupClick}
                  className="w-full sm:w-auto bg-trahka-amber hover:bg-warning text-trahka-navy px-9 py-4 rounded-xl font-extrabold text-lg cta-hover text-center cursor-pointer transition-all"
                >
                  Start Free Trial
                </button>
                <a 
                  className="w-full sm:w-auto border border-white/30 text-white px-9 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors text-center" 
                  href="#how-it-works"
                  onClick={(e) => handleAnchorClick(e, '#how-it-works')}
                >
                  See How It Works
                </a>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-slate-500 text-sm">
                  ✓ No credit card required &nbsp; • &nbsp; Free 14-day trial &nbsp; • &nbsp; Cancel anytime
                </p>
                <button 
                  onClick={onEnterApp}
                  className="text-white/80 hover:text-white flex items-center justify-center lg:justify-start gap-2 text-sm font-medium cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">play_circle</span>
                  <span>Open Interactive App Demo</span>
                </button>
              </div>
            </div>

            {/* Right Mockup with 3D Depth effects */}
            <div className="relative group parallax-container">
              <div 
                className="relative z-10 parallax-target" 
                style={{ 
                  transform: `translate(${parallaxOffset.x * 0.8}px, ${parallaxOffset.y * 0.8}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <img 
                  alt="Trahka Dashboard Preview" 
                  className="rounded-2xl shadow-2xl border border-white/10 w-full" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwRdE7jyHuopCD8HPNk51D8omTRD7gmx7uvvXm_qItiNNRDxeFMqnSWaqn67et23L-mC6ORorDv2vpPiXa89zHKVNt9Pp8hy93yjl93tmQYJDm6QpFryUNGszBHL6-vBYYeM0sLDbK_ECRBvRDicPV3akjEORljCqAI7n9zdgomj_aE4AfldfWhpDcIp0N0zbBuvV5i-jHNE1r_v_XPuizfjxTT7j7iM2DXIT2piPENS6htAC2xsEb3SPidB5HzUp5kREowt7IB1b0"
                />
              </div>

              {/* Floating interactive Badges */}
              <div 
                className="absolute -top-6 -right-6 glass-badge px-4 py-3 rounded-xl shadow-xl animate-bounce parallax-target hidden sm:block" 
                style={{ 
                  animationDuration: '3s',
                  transform: `translate(${parallaxOffset.x * 0.4}px, ${parallaxOffset.y * 0.4}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <span className="text-trahka-amber font-bold text-sm">📦 Stock Alert: Coartem low</span>
              </div>

              <div 
                className="absolute top-1/2 -left-12 glass-badge px-4 py-3 rounded-xl shadow-xl animate-pulse parallax-target hidden sm:block"
                style={{ 
                  transform: `translate(${parallaxOffset.x * -0.2}px, ${parallaxOffset.y * -0.2}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <span className="text-success font-bold text-sm">✅ Sale: ₦47,500 today</span>
              </div>

              <div 
                className="absolute -bottom-4 right-12 glass-badge px-4 py-3 rounded-xl shadow-xl parallax-target hidden sm:block"
                style={{ 
                  transform: `translate(${parallaxOffset.x * 0.2}px, ${parallaxOffset.y * 0.2}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <span className="text-primary-fixed font-bold text-sm">💰 Profit: ₦312,000</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Market Reality Stats */}
      <section 
        ref={statsRef}
        id="stats-section"
        className="bg-white py-16 border-y border-outline-variant"
      >
        <div className={`container mx-auto px-margin-mobile md:px-margin-desktop max-w-7xl reveal-on-scroll reveal ${activeReveals['stats-section'] ? 'active' : ''}`} data-reveal-id="stats-section">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            
            <div className="text-center relative md:after:content-[''] md:after:absolute md:after:right-0 md:after:top-1/4 md:after:h-1/2 md:after:w-[1px] md:after:bg-outline-variant last:after:hidden">
              <div className="text-4xl md:text-5xl font-black text-primary">
                {smeCount || 84}M+
              </div>
              <p className="font-bold text-on-surface mt-2 text-sm sm:text-base">SMEs across Africa</p>
              <p className="text-xs text-muted mt-1">The engine room of commerce</p>
            </div>

            <div className="text-center relative md:after:content-[''] md:after:absolute md:after:right-0 md:after:top-1/4 md:after:h-1/2 md:after:w-[1px] md:after:bg-outline-variant last:after:hidden">
              <div className="text-4xl md:text-5xl font-black text-primary">
                {pharmacyCount || 100}k+
              </div>
              <p className="font-bold text-on-surface mt-2 text-sm sm:text-base">Pharmacies in Nigeria</p>
              <p className="text-xs text-muted mt-1">Our primary launch vertical</p>
            </div>

            <div className="text-center relative md:after:content-[''] md:after:absolute md:after:right-0 md:after:top-1/4 md:after:h-1/2 md:after:w-[1px] md:after:bg-outline-variant last:after:hidden">
              <div className="text-4xl md:text-5xl font-black text-primary">
                &lt;{softwareCount || 3}%
              </div>
              <p className="font-bold text-on-surface mt-2 text-sm sm:text-base">Use back-office systems</p>
              <p className="text-xs text-muted mt-1">Huge digital tracking gap</p>
            </div>

            <div className="text-center relative last:after:hidden">
              <div className="text-4xl md:text-5xl font-black text-primary">
                ${marketValueCount || '1.97'}B
              </div>
              <p className="font-bold text-on-surface mt-2 text-sm sm:text-base">Nig. Pharmacy Market</p>
              <p className="text-xs text-muted mt-1">Reaching $3.2B by 2031</p>
            </div>

          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="bg-surface py-24" id="product">
        <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16">
            
            <div className={`reveal-on-scroll reveal ${activeReveals['problem-desc'] ? 'active' : ''}`} data-reveal-id="problem-desc">
              <span className="text-primary font-bold tracking-widest text-xs uppercase">The Problem</span>
              <h2 className="text-4xl font-extrabold text-on-surface mt-4 leading-tight">
                Africa's businesses are running blind.
              </h2>
              <div className="space-y-6 mt-8">
                <p className="text-secondary text-lg leading-relaxed">
                  Walk into any pharmacy, wholesale shop, or distribution business across Nigeria. Ask the owner how much profit they made last month. Most cannot answer. 
                </p>
                <p className="text-secondary text-lg leading-relaxed">
                  Not because they are bad at business — but because nobody has built them the right tools. Trahka changes that. From Lagos to Ibadan to Kano, the story is the same: stock managed by memory, sales unrecorded, customer debts tracked in notebooks that get lost.
                </p>
              </div>
            </div>

            <div className={`grid sm:grid-cols-2 gap-6 reveal-on-scroll reveal ${activeReveals['problem-cards'] ? 'active' : ''}`} data-reveal-id="problem-cards">
              
              <div className="bg-white p-6 rounded-2xl shadow-xs border-l-4 border-trahka-amber tilt-card">
                <div className="text-3xl mb-4">📦</div>
                <h3 className="font-bold text-lg text-on-surface mb-2">Stock Managed by Memory</h3>
                <p className="text-secondary text-sm leading-relaxed">Drugs expire silently on shelves. Owners discover low items when the customer walks in.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-xs border-l-4 border-primary tilt-card">
                <div className="text-3xl mb-4">💸</div>
                <h3 className="font-bold text-lg text-on-surface mb-2">Sales Go Unrecorded</h3>
                <p className="text-secondary text-sm leading-relaxed">Every day cash transactions slip away. Shrinkage occurs unnoticed due to pen-and-paper deficits.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-xs border-l-4 border-trahka-amber tilt-card">
                <div className="text-3xl mb-4">📒</div>
                <h3 className="font-bold text-lg text-on-surface mb-2">Debts Tracked on Paper</h3>
                <p className="text-secondary text-sm leading-relaxed">The physical debtor ledger gets lost. Customers forget totals. Dispute delays limit daily cash reserves.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-xs border-l-4 border-primary tilt-card">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="font-bold text-lg text-on-surface mb-2">Profit is Invisible</h3>
                <p className="text-secondary text-sm leading-relaxed">No store owner should struggle to summarize monthly net earnings. Accurate P&amp;L remains unseen.</p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="bg-white py-24" id="how-it-works">
        <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-7xl">
          
          <div className={`text-center max-w-3xl mx-auto mb-16 reveal-on-scroll reveal ${activeReveals['sol-header'] ? 'active' : ''}`} data-reveal-id="sol-header">
            <span className="text-primary font-bold tracking-widest text-xs uppercase">The Solution</span>
            <h2 className="text-4xl font-extrabold text-on-surface mt-4">One platform. Complete visibility. Built for Africa.</h2>
            <p className="text-secondary text-lg mt-6 leading-relaxed">
              Trahka is a mobile-first, offline-capable business operating system built specifically for African small enterprises. We offer absolute visibility.
            </p>
          </div>

          <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 reveal-on-scroll reveal ${activeReveals['sol-cards'] ? 'active' : ''}`} data-reveal-id="sol-cards">
            
            {/* Feature 1 */}
            <div className="bg-white p-7 rounded-2xl border border-outline-variant tilt-card">
              <div className="w-12 h-12 bg-[#EDE9FE] rounded-2xl flex items-center justify-center text-2xl">📦</div>
              <h3 className="font-bold text-lg text-on-surface mt-4">Inventory Manager</h3>
              <p className="text-secondary text-sm mt-3 leading-relaxed">Track batch expiry dates, define reorder minimum alerts, and keep shelves consistently replenished.</p>
              <span className="inline-block mt-4 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Live in v1.0</span>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-7 rounded-2xl border border-outline-variant tilt-card">
              <div className="w-12 h-12 bg-[#DCFCE7] rounded-2xl flex items-center justify-center text-2xl">🛒</div>
              <h3 className="font-bold text-lg text-on-surface mt-4">Sales Recorder</h3>
              <p className="text-secondary text-sm mt-3 leading-relaxed">Process sales instantly in physical channels. Adjust inventory balances instantly on the fly.</p>
              <span className="inline-block mt-4 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Live in v1.0</span>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-7 rounded-2xl border border-outline-variant tilt-card">
              <div className="w-12 h-12 bg-[#FEF3C7] rounded-2xl flex items-center justify-center text-2xl">📋</div>
              <h3 className="font-bold text-lg text-on-surface mt-4">Debt Reminder</h3>
              <p className="text-secondary text-sm mt-3 leading-relaxed">Organize credit balances safely. Share reminders with customizable WhatsApp presets in one click.</p>
              <span className="inline-block mt-4 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Live in v1.0</span>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-7 rounded-2xl border border-outline-variant tilt-card">
              <div className="w-12 h-12 bg-[#DBEAFE] rounded-2xl flex items-center justify-center text-2xl">📊</div>
              <h3 className="font-bold text-lg text-on-surface mt-4">Profit &amp; Loss</h3>
              <p className="text-secondary text-sm mt-3 leading-relaxed">Summarize gross sales, deduct operational shop expenses, and view clear profit reports on-demand.</p>
              <span className="inline-block mt-4 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Live in v1.0</span>
            </div>

          </div>

          {/* Platform Statement Box */}
          <div className={`bg-trahka-navy rounded-3xl p-10 flex flex-col lg:flex-row gap-12 items-center reveal-on-scroll reveal ${activeReveals['sol-statement'] ? 'active' : ''} tilt-card shadow-2xl border border-white/5`} data-reveal-id="sol-statement">
            <div className="lg:w-2/3">
              <h3 className="text-white text-3xl font-extrabold mb-4">Trahka is a platform, not a single vertical.</h3>
              <p className="text-blue-200/70 text-lg leading-relaxed">
                We launch inside the pharmacy vertical because it is the most inventory-sensitive retail model. But Trahka is built to power every FMCG outlet, cosmetics distributor, and wholesale business across Nigeria.
              </p>
            </div>
            <div className="lg:w-1/3 flex flex-wrap gap-3 justify-center">
              <span className="bg-trahka-amber text-trahka-navy px-4 py-2 rounded-full font-bold text-sm select-none">💊 Pharmacies — Live Now</span>
              <span className="bg-primary/20 text-primary-fixed border border-primary/40 px-4 py-2 rounded-full font-bold text-sm">🛒 FMCG — Coming 2026</span>
              <span className="bg-primary/20 text-primary-fixed border border-primary/40 px-4 py-2 rounded-full font-bold text-sm">🔧 Auto Parts — Coming 2027</span>
            </div>
          </div>

        </div>
      </section>

      {/* Why Trahka Section */}
      <section className="bg-surface py-24" id="why-trahka">
        <div className={`container mx-auto px-margin-mobile md:px-margin-desktop max-w-7xl text-center reveal-on-scroll reveal ${activeReveals['why-header'] ? 'active' : ''}`} data-reveal-id="why-header">
          
          <span className="text-primary font-bold tracking-widest text-xs uppercase">Why Trahka</span>
          <h2 className="text-4xl font-extrabold text-on-surface mt-4 mb-16">Built for this market. Not adapted for it.</h2>

          <div className={`grid lg:grid-cols-3 gap-8 mb-24 reveal-on-scroll reveal ${activeReveals['why-cards'] ? 'active' : ''}`} data-reveal-id="why-cards">
            
            <div className="bg-white p-8 rounded-2xl shadow-xs text-left tilt-card">
              <div className="w-12 h-12 bg-trahka-amber rounded-2xl flex items-center justify-center text-2xl mb-6">📡</div>
              <h3 className="font-bold text-xl mb-4">Offline-First</h3>
              <p className="text-secondary leading-relaxed mb-6">Lagos electricity can fluctuate and data cuts out. Trahka runs completely locally inside the browser memory, syncing gracefully.</p>
              <div className="text-trahka-amber font-extrabold text-xs uppercase tracking-wider">100% offline sync capability</div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xs text-left tilt-card">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-2xl mb-6 text-white">🤝</div>
              <h3 className="font-bold text-xl mb-4">Agent-Distributed</h3>
              <p className="text-secondary leading-relaxed mb-6">Local representatives visit your pharmacy, configure records, and ensure your team understands the ledger in under 45 minutes.</p>
              <div className="text-primary font-extrabold text-xs uppercase tracking-wider">On-site onboarding assistance</div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xs text-left tilt-card">
              <div className="w-12 h-12 bg-success rounded-2xl flex items-center justify-center text-2xl mb-6 text-white">🇳🇬</div>
              <h3 className="font-bold text-xl mb-4">Naira-Native</h3>
              <p className="text-secondary leading-relaxed mb-6">Styled entirely around Nigerian business reality—precise Naira denominations, local tax logs, and NAFDAC safety alerts.</p>
              <div className="text-success font-extrabold text-xs uppercase tracking-wider">Built for Nigerian Pharmacies</div>
            </div>

          </div>

          {/* Comparison Table */}
          <div className={`overflow-x-auto rounded-2xl shadow-md bg-white border border-border reveal-on-scroll reveal ${activeReveals['why-table'] ? 'active' : ''} tilt-card shadow-lg`} data-reveal-id="why-table">
            <table className="w-full text-left min-w-[32rem]">
              <thead>
                <tr className="bg-surface-container-low border-b border-border">
                  <th className="p-6 font-bold text-on-surface">Capability Feature</th>
                  <th className="p-6 font-extrabold text-primary bg-primary/5 border-x border-primary/20">Trahka OS</th>
                  <th className="p-6 font-bold text-on-surface-variant">Western Softwares (Sage / QuickBooks)</th>
                  <th className="p-6 font-bold text-on-surface-variant">Traditional Paper / Notebooks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-6 font-semibold">Works 100% Offline</td>
                  <td className="p-6 bg-primary/5 border-x border-primary/20 text-sm font-bold text-primary">✅ Yes (Runs Locally)</td>
                  <td className="p-6 text-secondary text-sm">❌ Requires active internet</td>
                  <td className="p-6 text-secondary text-sm">✅ Yes, but no automation</td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold">Nigerian Retail Focus</td>
                  <td className="p-6 bg-primary/5 border-x border-primary/20 text-sm font-bold text-primary">✅ Native NAFDAC logs</td>
                  <td className="p-6 text-secondary text-sm">❌ Built for Western retail systems</td>
                  <td className="p-6 text-secondary text-sm">⚠️ Dependent on physical health</td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold">Price Index</td>
                  <td className="p-6 bg-primary/5 border-x border-primary/20 text-sm font-bold text-primary">✅ From ₦3,000 / month</td>
                  <td className="p-6 text-secondary text-sm">❌ Expensive USD subscriptons</td>
                  <td className="p-6 text-secondary text-sm">✅ Paper costs, but prone to losses</td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold">Local Agent Audits</td>
                  <td className="p-6 bg-primary/5 border-x border-primary/20 text-sm font-bold text-primary">✅ On-site setup visits</td>
                  <td className="p-6 text-secondary text-sm">❌ Self-guided documentation only</td>
                  <td className="p-6 text-secondary text-sm">N/A</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="bg-white py-24 border-t border-border" id="faq">
        <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-4xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-bold tracking-widest text-xs uppercase">DATA SECURE &amp; SYNCHRONIZED</span>
            <h2 className="text-4xl font-extrabold text-on-surface mt-4 mb-4 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-secondary text-lg">
              Everything you need to know about our reliable offline system, privacy guidelines, and business safety mechanisms.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index}
                  className={`border rounded-2xl transition-all duration-300 transform ${
                    isOpen 
                      ? 'border-primary bg-primary/5 shadow-xl scale-[1.01] -translate-y-1' 
                      : 'border-border bg-surface hover:border-outline-variant hover:shadow-md hover:-translate-y-0.5'
                  } overflow-hidden`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex justify-between items-center p-6 text-left font-bold text-lg text-on-surface cursor-pointer focus:outline-hidden"
                  >
                    <span className="font-semibold text-base md:text-lg pr-4">{item.question}</span>
                    <span className={`material-symbols-outlined transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-primary' : 'text-secondary'}`}>
                      keyboard_arrow_down
                    </span>
                  </button>
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-96 opacity-100 border-t border-primary/15 p-6 bg-white' : 'max-h-0 opacity-0 pointer-events-none'
                    } overflow-hidden`}
                  >
                    <p className="text-secondary leading-relaxed text-sm md:text-base">{item.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Vision Section */}
      <section className="bg-trahka-navy py-24 text-center overflow-hidden relative" id="vision">
        <div className={`container mx-auto px-margin-mobile md:px-margin-desktop max-w-4xl relative z-10 reveal-on-scroll reveal ${activeReveals['vision-header'] ? 'active' : ''}`} data-reveal-id="vision-header">
          
          <span className="text-trahka-amber font-bold tracking-widest text-xs uppercase">Our Vision</span>
          <h2 className="text-white text-5xl md:text-6xl font-extrabold mt-6 leading-tight tracking-tight">
            From every pharmacy in Ibadan to every SME in Africa.
          </h2>

          <div className="mt-12 space-y-8 text-blue-200/80 text-lg leading-relaxed max-w-3xl mx-auto">
            <p>Trahka starts with a deliberate entry point: Nigeria's retail pharmacies. This is where inventory expiry risks are highest and cash conversion is vital.</p>
            <p>But Trahka is built as transactional back-office plumbing. Once cemented in health, we extend to hardware shops, wholesale auto part warehouses, and local distribution hubs.</p>
            <p>By capturing transaction ledger sequences offline, Trahka transforms data points into credit profiles, facilitating underwriting for working capital growth.</p>
          </div>

          {/* Evolution Cards */}
          <div className={`grid md:grid-cols-3 gap-6 mt-20 relative reveal-on-scroll reveal ${activeReveals['vision-cards'] ? 'active' : ''}`} data-reveal-id="vision-cards">
            
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-left relative z-10 digital-pulse tilt-card hover:bg-white/10 shadow-lg cursor-default">
              <div className="text-blue-400 font-extrabold text-lg mb-4">01</div>
              <h3 className="text-white font-bold text-xl mb-3">Trahka Records</h3>
              <p className="text-sm text-blue-200/60 mb-6">Four pillars capture every transaction ledger, debtor log, and shop expense immediately offline.</p>
              <span className="bg-success/20 text-success text-[10px] font-black uppercase px-3 py-1 rounded-full">Live v1.0</span>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-left relative z-10 digital-pulse tilt-card hover:bg-white/10 shadow-lg cursor-default">
              <div className="text-blue-400 font-extrabold text-lg mb-4">02</div>
              <h3 className="text-white font-bold text-xl mb-3">Trahka Thinks</h3>
              <p className="text-sm text-blue-200/60 mb-6 font-medium">Auto-analyzers flag margin anomalies, detect stock level drift patterns, and provide smart cash insights.</p>
              <span className="bg-trahka-amber/20 text-trahka-amber text-[10px] font-black uppercase px-3 py-1 rounded-full">Coming 2026-27</span>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-[15px] text-left relative z-10 digital-pulse tilt-card hover:bg-white/10 shadow-lg cursor-default">
              <div className="text-blue-400 font-extrabold text-lg mb-4">03</div>
              <h3 className="text-white font-bold text-xl mb-3">Trahka Acts</h3>
              <p className="text-sm text-blue-200/60 mb-6">AI agents dispatch collections, reorder dwindling inventory batches, and evaluate lines of credit.</p>
              <span className="bg-primary-fixed/20 text-primary-fixed text-[10px] font-black uppercase px-3 py-1 rounded-full">Coming 2027</span>
            </div>

          </div>

          {/* Agentic AI Preview */}
          <div className={`mt-16 bg-primary/10 border border-primary/30 p-8 rounded-2xl text-left reveal-on-scroll reveal ${activeReveals['vision-agentic'] ? 'active' : ''} tilt-card shadow-2xl`} data-reveal-id="vision-agentic">
            <span className="text-blue-400 text-xs font-black uppercase tracking-widest">🤖 Trahka AI Agent — Coming 2027</span>
            <h4 className="text-white text-2xl font-black mt-4">The first autonomous agent framework for retail distribution.</h4>
            <p className="text-blue-200/70 text-base mt-4 leading-relaxed">
              Imagine a business assistant that handles late collections reminders on autopilot, replenishes critical medical inventory ahead of seasonal strain, and delivers weekly financial recaps directly as simple audio reports. That is our roadmap.
            </p>
          </div>

        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-trahka-navy py-32 border-t border-white/5">
        <div className={`container mx-auto px-margin-mobile md:px-margin-desktop text-center reveal-on-scroll reveal ${activeReveals['cta-section'] ? 'active' : ''}`} data-reveal-id="cta-section">
          <h2 className="text-white text-5xl md:text-7xl font-extrabold max-w-4xl mx-auto leading-tight tracking-tight">
            Your business deserves better than a paper notebook.
          </h2>
          <p className="text-blue-200/80 text-xl mt-8 max-w-xl mx-auto">
            Join pharmacies and distributors across Ibadan and Lagos using Trahka to see numbers clearly.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-12 justify-center">
            <button 
              onClick={onSignupClick}
              className="w-full sm:w-auto bg-trahka-amber hover:bg-warning text-trahka-navy px-12 py-5 rounded-xl font-extrabold text-xl cta-hover shadow-xl text-center cursor-pointer transition-all"
            >
              Start Your Free Trial
            </button>
            <a 
              className="w-full sm:w-auto border border-white/40 text-white px-12 py-5 rounded-xl font-bold hover:bg-white/10 transition-all text-center" 
              href="mailto:hello@trahka.com"
            >
              Request Agent Visit
            </a>
          </div>

          <p className="text-slate-500 text-sm mt-8">
            ✓ Free 14-day trial &nbsp; • &nbsp; Agent visit option &nbsp; • &nbsp; Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-trahka-navy border-t border-white/5 py-20">
        <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-7xl flex flex-col md:flex-row justify-between gap-12 w-full">
          
          <div className="max-w-xs text-left">
            <span className="text-white font-extrabold text-2xl tracking-tight">Trahka</span>
            <p className="text-blue-200/50 text-sm mt-4 leading-relaxed">
              The Back-Office Operating System for African SMEs. Infrastructure driving the engine room of local commerce.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-left">
            
            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-6 text-blue-200/80">Product</h5>
              <ul className="space-y-4 text-blue-200/60 text-sm font-medium">
                <li><a className="hover:text-white transition-colors" href="#product" onClick={(e) => handleAnchorClick(e, '#product')}>Inventory</a></li>
                <li><a className="hover:text-white transition-colors" href="#product" onClick={(e) => handleAnchorClick(e, '#product')}>Sales</a></li>
                <li><a className="hover:text-white transition-colors" href="#product" onClick={(e) => handleAnchorClick(e, '#product')}>Debts</a></li>
                <li><a className="hover:text-white transition-colors" href="#product" onClick={(e) => handleAnchorClick(e, '#product')}>Reports</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-6 text-blue-200/80">Company</h5>
              <ul className="space-y-4 text-blue-200/60 text-sm font-medium">
                <li><a className="hover:text-white transition-colors" href="#vision" onClick={(e) => handleAnchorClick(e, '#vision')}>Vision</a></li>
                <li><a className="hover:text-white transition-colors" href="#why-trahka" onClick={(e) => handleAnchorClick(e, '#why-trahka')}>Why Trahka</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-6 text-blue-200/80">Get Support</h5>
              <ul className="space-y-4 text-blue-200/60 text-sm font-medium">
                <li><button onClick={onEnterApp} className="hover:text-white transition-colors text-left cursor-pointer">Live Demo App</button></li>
                <li><a className="hover:text-white transition-colors" href="mailto:hello@trahka.com">Contact Agents</a></li>
              </ul>
            </div>

          </div>

        </div>

        <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-7xl mt-20 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-600 text-xs">
            © 2026 Trahka OS. All rights reserved. SME infrastructure for African Retail.
          </p>
        </div>
      </footer>

    </div>
  );
}

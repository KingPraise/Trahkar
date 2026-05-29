import React, { useEffect, useState, useRef } from "react";

const faqItems = [
  {
    question:
      "📡 How does the offline sync capability work when electricity or network cuts out?",
    answer:
      "When your light goes or your data cuts out, Trahka keeps working, exactly as normal. Every sale you record, every stock update you make, and every debt you log is saved directly on your device. Nothing is lost. The moment your connection returns, Trahka automatically uploads everything to the cloud in seconds. You never have to do anything manually.",
  },
  {
    question:
      "🛡️ Where is our commercial business data stored, and is it confidential?",
    answer:
      "Your business data belongs to you and only you. Everything is encrypted on your device and protected during transfer to our secure cloud servers. We do not read your records, share them with third parties, or use them for any purpose outside of running your Trahka account. Your inventory, sales figures, and financial reports are completely private.",
  },
  {
    question:
      "👥 Can store attendants or staff manipulate master medicine prices or override profit records?",
    answer:
      "No. You are in full control of what your staff can and cannot do on Trahka. Cashiers and attendants can record sales and check stock but they cannot change prices, edit your profit records, or access your financial history. Only the account owner has access to those settings. You decide who sees what.",
  },
  {
    question:
      "📱 What happens to our databases if a mobile phone or retail computer gets damaged or stolen?",
    answer:
      "Nothing is lost. Because Trahka syncs your data to secure cloud servers continuously, your entire business profile is safe even if your device is broken or stolen. Simply open Trahka on any other phone or computer, log in with your account details, and everything — your stock, your customers, your sales history, your debtors — will be exactly as you left it.",
  },
  {
    question:
      "💬 Does Trahka protect our custom client listings and debt balance notes safely?",
    answer:
      "Yes. Your customer list and debt records are stored securely and are never shared or exposed. Debt reminder messages are only sent when you explicitly trigger them — Trahka will never automatically contact your customers without your instruction. You stay in control of every message that goes out.",
  },
];

interface LandingViewProps {
  onEnterApp: () => void;
  onSignupClick: () => void;
}

export default function LandingView({
  onEnterApp,
  onSignupClick,
}: LandingViewProps) {
  const [navScrolled, setNavScrolled] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [activeReveals, setActiveReveals] = useState<Record<string, boolean>>(
    {},
  );
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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
            const id =
              entry.target.id ||
              entry.target.getAttribute("data-reveal-id") ||
              "";
            setActiveReveals((prev) => ({ ...prev, [id]: true }));

            // Trigger stat counting if it's the stats section
            if (entry.target === statsRef.current) {
              startCounting();
            }
          }
        });
      },
      { threshold: 0.1 },
    );

    // Target elements
    const elements = document.querySelectorAll(".reveal-on-scroll");
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
  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-surface font-inter text-on-surface overflow-x-hidden min-h-screen">
      {/* Top Navigation Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 h-25 flex items-center ${
          navScrolled
            ? "bg-white shadow-md border-b border-border"
            : "bg-trahka-navy/85 backdrop-blur-md"
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-12 xl:px-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col items-start">
            <a
              href="#"
              onClick={(e) => handleAnchorClick(e, "html")}
              className="transition-opacity duration-200 hover:opacity-80"
            >
              <img 
                src={navScrolled ? "/logo.png" : "/logo1.png"} 
                alt="Trahka Logo" 
                className="h-25 w-auto object-contain"
              />
            </a>
            <span className="text-[10px] text-muted md:hidden mt-1">
              SME Operating System for Africa
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              className={`font-medium text-sm transition-colors duration-200 ${
                navScrolled
                  ? "text-secondary hover:text-trahka-navy"
                  : "text-white/80 hover:text-white"
              }`}
              href="#product"
              onClick={(e) => handleAnchorClick(e, "#product")}
            >
              Product
            </a>
            <a
              className={`font-medium text-sm transition-colors duration-200 ${
                navScrolled
                  ? "text-secondary hover:text-trahka-navy"
                  : "text-white/80 hover:text-white"
              }`}
              href="#how-it-works"
              onClick={(e) => handleAnchorClick(e, "#how-it-works")}
            >
              How It Works
            </a>
            <a
              className={`font-medium text-sm transition-colors duration-200 ${
                navScrolled
                  ? "text-secondary hover:text-trahka-navy"
                  : "text-white/80 hover:text-white"
              }`}
              href="#why-trahka"
              onClick={(e) => handleAnchorClick(e, "#why-trahka")}
            >
              Why Trahka
            </a>
            <a
              className={`font-medium text-sm transition-colors duration-200 ${
                navScrolled
                  ? "text-secondary hover:text-trahka-navy"
                  : "text-white/80 hover:text-white"
              }`}
              href="#vision"
              onClick={(e) => handleAnchorClick(e, "#vision")}
            >
              Vision
            </a>
            <a
              className={`font-medium text-sm transition-colors duration-200 ${
                navScrolled
                  ? "text-secondary hover:text-trahka-navy"
                  : "text-white/80 hover:text-white"
              }`}
              href="#faq"
              onClick={(e) => handleAnchorClick(e, "#faq")}
            >
              FAQs
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={onEnterApp}
              className={`hidden sm:block font-bold text-sm hover:underline transition-colors ${
                navScrolled ? "text-trahka-navy" : "text-white"
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
        <div className="container mx-auto px-6 md:px-12 xl:px-8 max-w-7xl relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div
              className={`text-center lg:text-left space-y-8 reveal ${heroActive ? "active" : ""}`}
            >
              <span className="inline-block bg-primary/20 border border-[#2563EB]/40 text-[#2563EB] dark:text-blue-200 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.08em] uppercase">
                AFRICA'S FIRST SME BACK-OFFICE INFRASTRUCTURE
              </span>
              <h1 className="text-white font-extrabold text-5xl lg:text-6xl xl:text-7xl leading-[1.1] max-w-xl mx-auto lg:mx-0 tracking-tight">
                Africa's Businesses Are Flying Blind. Trahka Changes That.
              </h1>
              <p className="text-blue-200/80 text-xl leading-relaxed max-w-lg mx-auto lg:mx-0 font-normal">
                Trahka is the back-office operating system built for Nigerian
                and African SMEs. We are giving every African business complete
                visibility over their operations.
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
                  onClick={(e) => handleAnchorClick(e, "#how-it-works")}
                >
                  See How It Works
                </a>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-slate-500 text-sm">
                  ✓ No credit card required &nbsp; • &nbsp; Free 14-day trial
                  &nbsp; • &nbsp; Cancel anytime
                </p>
                <button
                  onClick={onEnterApp}
                  className="text-white/80 hover:text-white flex items-center justify-center lg:justify-start gap-2 text-sm font-medium cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">
                    play_circle
                  </span>
                  <span>Open Interactive App Demo</span>
                </button>
              </div>
            </div>

            {/* Right Mockup with 3D Depth effects */}
            <div className="relative group parallax-container">
              <div
                className="relative z-10 parallax-target bg-[#0e131d]/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl w-full text-left font-sans text-xs"
                style={{
                  transform: `translate(${parallaxOffset.x * 0.8}px, ${parallaxOffset.y * 0.8}px)`,
                  transition: "transform 0.1s ease-out",
                }}
              >
                {/* Window header */}
                <div className="bg-[#18202d] border-b border-white/5 px-4 py-3 flex items-center justify-between select-none">
                  <div className="flex items-center gap-1.5 flex-none">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block"></span>
                  </div>
                  <div className="bg-[#111722] text-[10px] text-slate-400 px-6 py-1 rounded-md max-w-45 w-full text-center border border-white/5 truncate font-mono select-none">
                    app.trahka.com/dashboard
                  </div>
                  <div className="w-8 shrink-0"></div>
                </div>

                {/* Dashboard mock interior */}
                <div className="grid grid-cols-12 min-h-75">
                  {/* Left Sidebar mock */}
                  <div className="col-span-3 bg-[#111722] border-r border-white/5 p-3 space-y-4 hidden sm:block select-none shrink-0">
                    <div className="flex items-center gap-2 px-1 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-extrabold text-[10px]">
                        T
                      </div>
                      <span className="font-extrabold text-white text-[11px] tracking-tight">
                        Trahka
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="bg-[#18202d] text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2">
                        📊 Dashboard
                      </div>
                      <div className="text-slate-400 px-2.5 py-1.5 rounded-lg text-[10px] flex items-center gap-2 hover:bg-white/5">
                        📦 Inventory
                      </div>
                      <div className="text-slate-400 px-2.5 py-1.5 rounded-lg text-[10px] flex items-center gap-2 hover:bg-white/5">
                        🛒 Sales Log
                      </div>
                      <div className="text-slate-400 px-2.5 py-1.5 rounded-lg text-[10px] flex items-center gap-2 hover:bg-white/5">
                        📒 Debts
                      </div>
                    </div>
                  </div>

                  {/* Main content body mock */}
                  <div className="col-span-12 sm:col-span-9 p-4 space-y-4 bg-[#090d14]/40">
                    <div className="flex justify-between items-center select-none">
                      <div>
                        <h4 className="text-white font-black text-xs md:text-sm">
                          MedicLabs Pharmacy
                        </h4>
                        <p className="text-[9px] text-slate-400">
                          Welcome back, Owner
                        </p>
                      </div>
                      <span className="bg-[#34d399]/10 text-[#34d399] border border-[#34d399]/20 font-bold px-2 py-0.5 rounded-full text-[9px]">
                        ● Online
                      </span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="bg-[#18202d] p-2 rounded-xl border border-white/5 flex flex-col justify-between">
                        <span className="text-[9px] text-slate-400 select-none">
                          Today's Sales
                        </span>
                        <span className="text-white font-black text-xs md:text-sm mt-1">
                          ₦47,500
                        </span>
                      </div>
                      <div className="bg-[#18202d] p-2 rounded-xl border border-white/5 flex flex-col justify-between">
                        <span className="text-[9px] text-slate-400 select-none">
                          Active Debts
                        </span>
                        <span className="text-red-400 font-black text-xs md:text-sm mt-1">
                          ₦185,200
                        </span>
                      </div>
                      <div className="bg-[#18202d] p-2 rounded-xl border border-white/5 flex flex-col justify-between">
                        <span className="text-[9px] text-slate-400 select-none">
                          Net Profit
                        </span>
                        <span className="text-[#34d399] font-black text-xs md:text-sm mt-1">
                          ₦312,000
                        </span>
                      </div>
                    </div>

                    {/* Low Stock Checklist */}
                    <div className="bg-[#111722] p-3 rounded-xl border border-white/5 space-y-2">
                      <span className="text-[10px] font-bold text-white block select-none">
                        ⚠️ High Risk Expiry Warning
                      </span>
                      <div className="divide-y divide-white/5 text-[9px]">
                        <div className="py-1.5 flex justify-between">
                          <span className="text-slate-300">
                            Coartem 80/480mg (Sachet)
                          </span>
                          <span className="text-red-400 font-bold">
                            Expires in 12 days
                          </span>
                        </div>
                        <div className="py-1.5 flex justify-between">
                          <span className="text-slate-300">
                            Amoxil 500mg (Cap)
                          </span>
                          <span className="text-amber-400 font-bold">
                            Qty low: 4 left
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating interactive Badges with brought-to-front z-index fix */}
              <div
                className="absolute -top-6 -right-6 glass-badge px-4 py-3 rounded-xl shadow-xl animate-bounce parallax-target hidden sm:block z-20"
                style={{
                  animationDuration: "3s",
                  transform: `translate(${parallaxOffset.x * 0.4}px, ${parallaxOffset.y * 0.4}px)`,
                  transition: "transform 0.1s ease-out",
                }}
              >
                <span className="text-trahka-amber font-bold text-sm">
                  📦 Stock Alert: Coartem low
                </span>
              </div>

              <div
                className="absolute top-1/2 -left-12 glass-badge px-4 py-3 rounded-xl shadow-xl animate-pulse parallax-target hidden sm:block z-20"
                style={{
                  transform: `translate(${parallaxOffset.x * -0.2}px, ${parallaxOffset.y * -0.2}px)`,
                  transition: "transform 0.1s ease-out",
                }}
              >
                <span className="text-success font-bold text-sm">
                  ✅ Sale: ₦47,500 today
                </span>
              </div>

              <div
                className="absolute -bottom-4 right-12 glass-badge px-4 py-3 rounded-xl shadow-xl parallax-target hidden sm:block z-20"
                style={{
                  transform: `translate(${parallaxOffset.x * 0.2}px, ${parallaxOffset.y * 0.2}px)`,
                  transition: "transform 0.1s ease-out",
                }}
              >
                <span className="text-primary-fixed font-bold text-sm">
                  💰 Profit: ₦312,000
                </span>
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
        <div
          className={`container mx-auto px-6 md:px-12 xl:px-8 max-w-7xl reveal-on-scroll reveal ${activeReveals["stats-section"] ? "active" : ""}`}
          data-reveal-id="stats-section"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center relative md:after:content-[''] md:after:absolute md:after:right-0 md:after:top-1/4 md:after:h-1/2 md:after:w-px md:after:bg-outline-variant last:after:hidden">
              <div className="text-4xl md:text-5xl font-black text-primary">
                {smeCount || 84}M+
              </div>
              <p className="font-bold text-on-surface mt-2 text-sm sm:text-base">
                SMEs across Africa
              </p>
              <p className="text-xs text-muted mt-1">
                The engine room of commerce
              </p>
            </div>

            <div className="text-center relative md:after:content-[''] md:after:absolute md:after:right-0 md:after:top-1/4 md:after:h-1/2 md:after:w-px md:after:bg-outline-variant last:after:hidden">
              <div className="text-4xl md:text-5xl font-black text-primary">
                {pharmacyCount || 100}k+
              </div>
              <p className="font-bold text-on-surface mt-2 text-sm sm:text-base">
                Pharmacies in Nigeria
              </p>
              <p className="text-xs text-muted mt-1">
                Our primary launch vertical
              </p>
            </div>

            <div className="text-center relative md:after:content-[''] md:after:absolute md:after:right-0 md:after:top-1/4 md:after:h-1/2 md:after:w-px md:after:bg-outline-variant last:after:hidden">
              <div className="text-4xl md:text-5xl font-black text-primary">
                &lt;{softwareCount || 3}%
              </div>
              <p className="font-bold text-on-surface mt-2 text-sm sm:text-base">
                Use back-office systems
              </p>
              <p className="text-xs text-muted mt-1">
                Huge digital tracking gap
              </p>
            </div>

            <div className="text-center relative last:after:hidden">
              <div className="text-4xl md:text-5xl font-black text-primary">
                ${marketValueCount || "1.97"}B
              </div>
              <p className="font-bold text-on-surface mt-2 text-sm sm:text-base">
                Nig. Pharmacy Market
              </p>
              <p className="text-xs text-muted mt-1">Reaching $3.2B by 2031</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="bg-surface py-24" id="product">
        <div className="container mx-auto px-6 md:px-12 xl:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16">
            <div
              className={`reveal-on-scroll reveal ${activeReveals["problem-desc"] ? "active" : ""}`}
              data-reveal-id="problem-desc"
            >
              <span className="text-primary font-bold tracking-[0.08em] text-[14px] uppercase">
                The Problem
              </span>
              <h2 className="text-4xl font-extrabold text-on-surface mt-4 leading-tight">
                Africa's businesses are running blind.
              </h2>
              <div className="space-y-6 mt-8">
                <p className="text-secondary text-lg leading-relaxed">
                  Walk into any pharmacy, wholesale shop, or distribution
                  business across Nigeria. Ask the owner how much profit they
                  made last month. Most cannot answer.
                </p>
                <p className="text-secondary text-lg leading-relaxed">
                  Not because they are bad at business — but because nobody has
                  built them the right tools. Trahka changes that. From Lagos to
                  Ibadan to Kano, the story is the same: stock managed by
                  memory, sales unrecorded, customer debts tracked in notebooks
                  that get lost.
                </p>
                <p className="text-secondary text-lg leading-relaxed">
                  We grow into their working capital lender. We evolve into
                  their autonomous AI business agent. The back-office
                  infrastructure layer Africa has never had, until now.
                </p>
              </div>
            </div>

            <div
              className={`grid sm:grid-cols-2 gap-6 reveal-on-scroll reveal ${activeReveals["problem-cards"] ? "active" : ""}`}
              data-reveal-id="problem-cards"
            >
              <div className="bg-white p-6 rounded-2xl shadow-xs border-l-4 border-trahka-amber tilt-card">
                <div className="text-3xl mb-4">📦</div>
                <h3 className="font-bold text-lg text-on-surface mb-2">
                  Stock Managed by Memory
                </h3>
                <p className="text-secondary text-sm leading-relaxed">
                  Drugs expire silently on shelves. Owners discover low items
                  when the customer walks in.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-xs border-l-4 border-primary tilt-card">
                <div className="text-3xl mb-4">💸</div>
                <h3 className="font-bold text-lg text-on-surface mb-2">
                  Sales Go Unrecorded
                </h3>
                <p className="text-secondary text-sm leading-relaxed">
                  Every day cash transactions slip away. Shrinkage occurs
                  unnoticed due to pen-and-paper deficits.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-xs border-l-4 border-trahka-amber tilt-card">
                <div className="text-3xl mb-4">📒</div>
                <h3 className="font-bold text-lg text-on-surface mb-2">
                  Debts Tracked on Paper
                </h3>
                <p className="text-secondary text-sm leading-relaxed">
                  The physical debtor ledger gets lost. Customers forget totals.
                  Dispute delays limit daily cash reserves.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-xs border-l-4 border-primary tilt-card">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="font-bold text-lg text-on-surface mb-2">
                  Profit is Invisible
                </h3>
                <p className="text-secondary text-sm leading-relaxed">
                  No store owner should struggle to summarize monthly net
                  earnings. Accurate P&amp;L remains unseen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="bg-white py-24" id="how-it-works">
        <div className="container mx-auto px-6 md:px-12 xl:px-8 max-w-7xl">
          <div
            className={`text-center max-w-3xl mx-auto mb-16 reveal-on-scroll reveal ${activeReveals["sol-header"] ? "active" : ""}`}
            data-reveal-id="sol-header"
          >
            <span className="text-primary font-bold tracking-[0.08em] text-[14px] uppercase">
              The Solution
            </span>
            <h2 className="text-4xl font-extrabold text-on-surface mt-4">
              One platform. Complete visibility. Built for Africa.
            </h2>
            <p className="text-secondary text-lg mt-6 leading-relaxed">
              Trahka is a mobile-first, offline-capable business operating
              system built specifically for African small enterprises.
            </p>
          </div>

          <div
            className={`grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 reveal-on-scroll reveal ${activeReveals["sol-cards"] ? "active" : ""}`}
            data-reveal-id="sol-cards"
          >
            {/* Feature 1 */}
            <div className="bg-white p-7 rounded-2xl border border-outline-variant tilt-card">
              <div className="w-12 h-12 bg-[#EDE9FE] rounded-2xl flex items-center justify-center text-2xl">
                📦
              </div>
              <h3 className="font-bold text-lg text-on-surface mt-4">
                Inventory Manager
              </h3>
              <p className="text-secondary text-sm mt-3 leading-relaxed">
                Track batch expiry dates, define reorder minimum alerts, and
                keep shelves consistently replenished.
              </p>
              <span className="inline-block mt-4 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                Live in v1.0
              </span>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-7 rounded-2xl border border-outline-variant tilt-card">
              <div className="w-12 h-12 bg-[#DCFCE7] rounded-2xl flex items-center justify-center text-2xl">
                🛒
              </div>
              <h3 className="font-bold text-lg text-on-surface mt-4">
                Sales Recorder
              </h3>
              <p className="text-secondary text-sm mt-3 leading-relaxed">
                Process sales instantly in physical channels. Adjust inventory
                balances instantly on the fly.
              </p>
              <span className="inline-block mt-4 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                Live in v1.0
              </span>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-7 rounded-2xl border border-outline-variant tilt-card">
              <div className="w-12 h-12 bg-[#FEF3C7] rounded-2xl flex items-center justify-center text-2xl">
                📋
              </div>
              <h3 className="font-bold text-lg text-on-surface mt-4">
                Debt Reminder
              </h3>
              <p className="text-secondary text-sm mt-3 leading-relaxed">
                Organize credit balances safely. Share reminders with
                customizable WhatsApp presets in one click.
              </p>
              <span className="inline-block mt-4 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                Live in v1.0
              </span>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-7 rounded-2xl border border-outline-variant tilt-card">
              <div className="w-12 h-12 bg-[#DBEAFE] rounded-2xl flex items-center justify-center text-2xl">
                📊
              </div>
              <h3 className="font-bold text-lg text-on-surface mt-4">
                Profit &amp; Loss
              </h3>
              <p className="text-secondary text-sm mt-3 leading-relaxed">
                Summarize gross sales, deduct operational shop expenses, and
                view clear profit reports on-demand.
              </p>
              <span className="inline-block mt-4 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                Live in v1.0
              </span>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-7 rounded-2xl border border-outline-variant tilt-card">
              <div className="w-12 h-12 bg-[#FEE2E2] rounded-2xl flex items-center justify-center text-2xl">
                💳
              </div>
              <h3 className="font-bold text-lg text-on-surface mt-4">
                Payroll Manager
              </h3>
              <p className="text-secondary text-sm mt-3 leading-relaxed">
                Process staff salaries, deduct PAYE tax, and generate digital
                payslips — all inside Trahka. No disputes. No paper records.
              </p>
              <span className="inline-block mt-4 text-xs font-bold px-3 py-1 rounded-full text-trahka-amber bg-[#FFFBEB] border border-amber-200">
                Live in v2.0
              </span>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-7 rounded-2xl border border-outline-variant tilt-card">
              <div className="w-12 h-12 bg-[#FFEDD5] rounded-2xl flex items-center justify-center text-2xl">
                🚚
              </div>
              <h3 className="font-bold text-lg text-on-surface mt-4">
                Supplier Management
              </h3>
              <p className="text-secondary text-sm mt-3 leading-relaxed">
                Track every supplier, manage purchase orders, monitor what you
                owe and when it is due. Never miss a payment deadline again.
              </p>
              <span className="inline-block mt-4 text-xs font-bold px-3 py-1 rounded-full text-trahka-amber bg-[#FFFBEB] border border-amber-200">
                Live in v2.0
              </span>
            </div>

            {/* Feature 7 */}
            <div className="bg-white p-7 rounded-2xl border border-outline-variant tilt-card">
              <div className="w-12 h-12 bg-[#ECFDF5] rounded-2xl flex items-center justify-center text-2xl">
                💰
              </div>
              <h3 className="font-bold text-lg text-on-surface mt-4">
                Working Capital Loans
              </h3>
              <p className="text-secondary text-sm mt-3 leading-relaxed">
                After 6 months on Trahka, your transaction data unlocks access
                to working capital loans. Built on your own numbers.
              </p>
              <span className="inline-block mt-4 text-xs font-bold px-3 py-1 rounded-full text-trahka-amber bg-[#FFFBEB] border border-amber-200">
                Live in v2.0
              </span>
            </div>

            {/* Feature 8 */}
            <div className="bg-white p-7 rounded-2xl border border-outline-variant tilt-card">
              <div className="w-12 h-12 bg-[#F5F3FF] rounded-2xl flex items-center justify-center text-2xl">
                📊
              </div>
              <h3 className="font-bold text-lg text-on-surface mt-4">
                Advanced Business Intelligence
              </h3>
              <p className="text-secondary text-sm mt-3 leading-relaxed">
                Weekly and monthly business performance reports generated
                automatically. Spot trends, catch problems early, and make
                decisions backed by real data.
              </p>
              <span className="inline-block mt-4 text-xs font-bold px-3 py-1 rounded-full text-trahka-amber bg-[#FFFBEB] border border-amber-200">
                Live in v2.0
              </span>
            </div>

            {/* Feature 9 */}
            <div className="bg-white p-7 rounded-2xl border border-outline-variant tilt-card">
              <div className="w-12 h-12 bg-[#EEF2F6] rounded-2xl flex items-center justify-center text-2xl">
                🤖
              </div>
              <h3 className="font-bold text-lg text-on-surface mt-4">
                Stock Watcher Agent
              </h3>
              <p className="text-secondary text-sm mt-3 leading-relaxed">
                An AI agent that monitors your inventory continuously — and
                automatically drafts reorder messages to your supplier before
                you run out. No action required.
              </p>
              <span className="inline-block mt-4 text-xs font-bold px-3 py-1 rounded-full text-[#2563EB] bg-[#EFF6FF] border border-blue-100">
                Live in v3.0
              </span>
            </div>

            {/* Feature 10 */}
            <div className="bg-white p-7 rounded-2xl border border-outline-variant tilt-card">
              <div className="w-12 h-12 bg-[#FFF1F2] rounded-2xl flex items-center justify-center text-2xl">
                📬
              </div>
              <h3 className="font-bold text-lg text-on-surface mt-4">
                Debt Collector Agent
              </h3>
              <p className="text-secondary text-sm mt-3 leading-relaxed">
                Sends personalised WhatsApp payment reminders to credit
                customers on a learned schedule. Tracks who pays reliably.
                Builds customer credit scores automatically.
              </p>
              <span className="inline-block mt-4 text-xs font-bold px-3 py-1 rounded-full text-[#2563EB] bg-[#EFF6FF] border border-blue-100">
                Live in v3.0
              </span>
            </div>

            {/* Feature 11 */}
            <div className="bg-white p-7 rounded-2xl border border-outline-variant tilt-card">
              <div className="w-12 h-12 bg-[#FAF5FF] rounded-2xl flex items-center justify-center text-2xl">
                🧠
              </div>
              <h3 className="font-bold text-lg text-on-surface mt-4">
                CFO Agent
              </h3>
              <p className="text-secondary text-sm mt-3 leading-relaxed">
                On the first of every month, Trahka's AI generates your complete
                financial report and delivers it as a voice note summary on
                WhatsApp. Your first CFO — automated.
              </p>
              <span className="inline-block mt-4 text-xs font-bold px-3 py-1 rounded-full text-[#2563EB] bg-[#EFF6FF] border border-blue-100">
                Live in v3.0
              </span>
            </div>

            {/* Feature 12 */}
            <div className="bg-white p-7 rounded-2xl border border-outline-variant tilt-card">
              <div className="w-12 h-12 bg-[#FEFCE8] rounded-2xl flex items-center justify-center text-2xl">
                💡
              </div>
              <h3 className="font-bold text-lg text-on-surface mt-4">
                Trahka Business Advisor
              </h3>
              <p className="text-secondary text-sm mt-3 leading-relaxed">
                Ask your business anything. 'Should I hire another attendant?'
                'Which product has the best margin?' Trahka answers — using your
                own data.
              </p>
              <span className="inline-block mt-4 text-xs font-bold px-3 py-1 rounded-full text-[#2563EB] bg-[#EFF6FF] border border-blue-100">
                Live in v3.0
              </span>
            </div>
          </div>

          {/* Platform Statement Box */}
          <div
            className={`bg-trahka-navy rounded-3xl p-10 flex flex-col lg:flex-row gap-12 items-center reveal-on-scroll reveal ${activeReveals["sol-statement"] ? "active" : ""} tilt-card shadow-2xl border border-white/5`}
            data-reveal-id="sol-statement"
          >
            <div className="lg:w-7/12">
              <h3 className="text-white text-3xl font-extrabold mb-4">
                Trahka is a platform, not a single vertical.
              </h3>
              <p className="text-blue-200/70 text-lg leading-relaxed">
                We launch inside the pharmacy vertical because it is the most
                inventory-sensitive and regulatory-pressured entry point in
                Nigeria. But Trahka is built to power every FMCG outlet, auto
                parts dealer, fashion wholesaler, and SME across Africa. The
                platform scales. The vision is the continent.
              </p>
            </div>
            <div className="lg:w-5/12 flex flex-wrap gap-3 justify-center">
              <span className="bg-[#FFFBEB] text-trahka-amber border border-amber-200/60 px-4 py-2 rounded-full font-bold text-sm select-none">
                💊 Pharmacies — Live Now
              </span>
              <span className="bg-[#EFF6FF] text-[#2563EB] border border-blue-200/60 px-4 py-2 rounded-full font-bold text-sm select-none">
                🛒 FMCG Distributors — Coming 2026
              </span>
              <span className="bg-[#EFF6FF] text-[#2563EB] border border-blue-200/60 px-4 py-2 rounded-full font-bold text-sm select-none">
                👗 Fashion & Wholesale — Coming 2026
              </span>
              <span className="bg-[#EFF6FF] text-[#2563EB] border border-blue-200/60 px-4 py-2 rounded-full font-bold text-sm select-none">
                🔧 Auto Parts — Coming 2027
              </span>
              <span className="bg-[#EFF6FF] text-[#2563EB] border border-blue-200/60 px-4 py-2 rounded-full font-bold text-sm select-none">
                🌍 West Africa — Expansion 2027
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Trahka Section */}
      <section className="bg-surface py-24" id="why-trahka">
        <div
          className={`container mx-auto px-6 md:px-12 xl:px-8 max-w-7xl text-center reveal-on-scroll reveal ${activeReveals["why-header"] ? "active" : ""}`}
          data-reveal-id="why-header"
        >
          <span className="text-primary font-bold tracking-[0.08em] text-[14px] uppercase mb-1 block">
            Why Trahka
          </span>
          <span className="text-secondary text-sm font-semibold tracking-wider uppercase mb-4 block">
            Built for Nigerian/African SMEs
          </span>
          <h2 className="text-4xl font-extrabold text-on-surface mt-4 mb-16">
            Built for this market. Not adapted for it.
          </h2>

          <div
            className={`grid lg:grid-cols-3 gap-8 mb-24 reveal-on-scroll reveal ${activeReveals["why-cards"] ? "active" : ""}`}
            data-reveal-id="why-cards"
          >
            <div className="bg-white p-8 rounded-2xl shadow-xs text-left tilt-card">
              <div className="w-12 h-12 bg-trahka-amber rounded-2xl flex items-center justify-center text-2xl mb-6">
                📡
              </div>
              <h3 className="font-bold text-xl mb-4">Offline-First</h3>
              <p className="text-secondary leading-relaxed mb-6">
                Your business operations don't have to pause when NEPA takes the
                light or when you run out of data. Trahka runs entirely without
                internet — every sale recorded, every stock count logged, every
                report available. The moment you reconnect, everything syncs.
              </p>
              <div className="text-trahka-amber font-extrabold text-xs uppercase tracking-wider">
                100% offline sync capability
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xs text-left tilt-card">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-2xl mb-6 text-white">
                🤝
              </div>
              <h3 className="font-bold text-xl mb-4">Agent-Distributed</h3>
              <p className="text-secondary leading-relaxed mb-6">
                Our agents come to you. They set up your account, walk your team
                through the system, and don't leave until everything is running.
                We know that great software means nothing if nobody shows you
                how to use it.
              </p>
              <div className="text-primary font-extrabold text-xs uppercase tracking-wider">
                On-site onboarding assistance
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xs text-left tilt-card">
              <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center text-xl font-bold mb-6 text-white dark:bg-zinc-800">
                ₦
              </div>
              <h3 className="font-bold text-xl mb-4">
                Naira-Native & Localization
              </h3>
              <p className="text-secondary leading-relaxed mb-6">
                No currency conversions. No workarounds. Trahka is built
                entirely around how Nigerian businesses actually operate; naira
                denominations, NAFDAC compliance, CBN payment rails, and local
                tax requirements.
              </p>
              <div className="text-success font-extrabold text-xs uppercase tracking-wider">
                Built for Nigerian/African SMEs
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-xs text-left tilt-card">
              <div className="w-12 h-12 bg-purple-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl mb-6 text-purple-600">
                📊
              </div>
              <h3 className="font-bold text-xl mb-4">
                Complete Business Visibility
              </h3>
              <p className="text-secondary leading-relaxed mb-6">
                For the first time, you can see exactly how your business is
                performing — what's selling, who owes you, and what your actual
                profit is. Not estimates. Not guesses. Real numbers, in real
                time, on any device.
              </p>
              <div className="text-purple-600 font-extrabold text-xs uppercase tracking-wider">
                Full P&L visibility
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-8 rounded-2xl shadow-xs text-left tilt-card">
              <div className="w-12 h-12 bg-amber-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl mb-6 text-amber-600">
                🏦
              </div>
              <h3 className="font-bold text-xl mb-4">
                Your Data Becomes Your Credit
              </h3>
              <p className="text-secondary leading-relaxed mb-6">
                Every transaction you record on Trahka is building your
                financial identity. Over time, the data becomes the evidence
                that unlocks working capital loans for business owners who have
                never qualified for a bank loan before.
              </p>
              <div className="text-amber-600 font-extrabold text-xs uppercase tracking-wider">
                Finance-ready from day one
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-white p-8 rounded-2xl shadow-xs text-left tilt-card">
              <div className="w-12 h-12 bg-teal-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl mb-6 text-teal-600">
                🤖
              </div>
              <h3 className="font-bold text-xl mb-4">AI That Works for You</h3>
              <p className="text-secondary leading-relaxed mb-6">
                Trahka doesn't just record what happens, it tells you what to do
                next. Reorder alerts before you run out of stock. Debt reminders
                before customers go cold. Demand forecasts before the next
                market cycle. An AI back-office that never sleeps.
              </p>
              <div className="text-teal-600 font-extrabold text-xs uppercase tracking-wider">
                Intelligent. Predictive. Yours.
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div
            className={`overflow-x-auto rounded-2xl shadow-md bg-white border border-border reveal-on-scroll reveal ${activeReveals["why-table"] ? "active" : ""} tilt-card shadow-lg`}
            data-reveal-id="why-table"
          >
            <table className="w-full text-left min-w-lg">
              <thead>
                <tr className="bg-surface-container-low border-b border-border">
                  <th className="p-6 font-bold text-on-surface">
                    Capability Feature
                  </th>
                  <th className="p-6 font-extrabold text-primary bg-primary/5 border-x border-primary/20">
                    Trahka
                  </th>
                  <th className="p-6 font-bold text-on-surface-variant">
                    Western Softwares (Sage / QuickBooks)
                  </th>
                  <th className="p-6 font-bold text-on-surface-variant">
                    Traditional Paper / Notebooks
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-6 font-semibold">Works 100% Offline</td>
                  <td className="p-6 bg-primary/5 border-x border-primary/20 text-sm font-bold text-primary">
                    ✅ Yes (Runs Locally)
                  </td>
                  <td className="p-6 text-secondary text-sm">
                    ❌ Requires active internet
                  </td>
                  <td className="p-6 text-secondary text-sm">
                    ✅ Yes, but no automation
                  </td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold">Nigerian Retail Focus</td>
                  <td className="p-6 bg-primary/5 border-x border-primary/20 text-sm font-bold text-primary">
                    ✅ Native NAFDAC logs
                  </td>
                  <td className="p-6 text-secondary text-sm">
                    ❌ Built for Western retail systems
                  </td>
                  <td className="p-6 text-secondary text-sm">
                    ⚠️ Dependent on physical health
                  </td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold">Price Index</td>
                  <td className="p-6 bg-primary/5 border-x border-primary/20 text-sm font-bold text-primary">
                    ✅ From ₦3,000 / month
                  </td>
                  <td className="p-6 text-secondary text-sm">
                    ❌ Expensive USD subscriptions
                  </td>
                  <td className="p-6 text-secondary text-sm">
                    ✅ Paper costs, but prone to losses
                  </td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold">Local Agent Audits</td>
                  <td className="p-6 bg-primary/5 border-x border-primary/20 text-sm font-bold text-primary">
                    ✅ On-site setup visits
                  </td>
                  <td className="p-6 text-secondary text-sm">
                    ❌ Self-guided documentation only
                  </td>
                  <td className="p-6 text-secondary text-sm">N/A</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="bg-white py-24 border-t border-border" id="faq">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-on-surface mt-4 mb-4 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className={`border rounded-2xl transition-all duration-300 transform ${
                    isOpen
                      ? "border-primary bg-primary/5 shadow-xl scale-[1.01] -translate-y-1"
                      : "border-border bg-surface hover:border-outline-variant hover:shadow-md hover:-translate-y-0.5"
                  } overflow-hidden`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex justify-between items-center p-6 text-left font-bold text-lg text-on-surface cursor-pointer focus:outline-hidden"
                  >
                    <span className="font-semibold text-base md:text-lg pr-4">
                      {item.question}
                    </span>
                    <span
                      className={`material-symbols-outlined transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-primary" : "text-secondary"}`}
                    >
                      keyboard_arrow_down
                    </span>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "max-h-96 opacity-100 border-t border-primary/15 p-6 bg-white"
                        : "max-h-0 opacity-0 pointer-events-none"
                    } overflow-hidden`}
                  >
                    <p className="text-secondary leading-relaxed text-sm md:text-base">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Vision Section */}
      <section
        className="bg-trahka-navy py-24 text-center overflow-hidden relative"
        id="vision"
      >
        <div
          className={`container mx-auto px-6 md:px-12 max-w-4xl relative z-10 reveal-on-scroll reveal ${activeReveals["vision-header"] ? "active" : ""}`}
          data-reveal-id="vision-header"
        >
          <span className="text-trahka-amber font-bold tracking-[0.08em] text-[14px] uppercase">
            Our Vision
          </span>
          <h2 className="text-white text-5xl md:text-6xl font-extrabold mt-6 leading-tight tracking-tight">
            From every pharmacy in Ibadan to every SME in Africa.
          </h2>

          <div className="mt-12 space-y-8 text-blue-200/80 text-lg leading-relaxed max-w-3xl mx-auto">
            <p>
              Trahka starts with a deliberate entry point: Nigeria's retail
              pharmacies. This is where inventory expiry risks are highest and
              cash conversion is vital.
            </p>
            <p>
              Beyond pharmacies, we are expanding our service offerings to
              include hardware stores, wholesale distributors, auto parts
              dealers, and every other SME category across Nigeria and Africa.
            </p>
            <p>
              Every transaction a business owner records on Trahka quietly
              builds something powerful — a financial track record. Over time,
              that record becomes the evidence that unlocks working capital
              loans for business owners who have never been able to access
              formal credit from traditional banks before. Your data works for
              you.
            </p>
          </div>

          {/* Evolution Cards */}
          <div
            className={`grid md:grid-cols-3 gap-6 mt-20 relative reveal-on-scroll reveal ${activeReveals["vision-cards"] ? "active" : ""}`}
            data-reveal-id="vision-cards"
          >
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-left relative z-10 digital-pulse tilt-card hover:bg-white/10 shadow-lg cursor-default">
              <div className="text-blue-400 font-extrabold text-lg mb-4">
                01
              </div>
              <h3 className="text-white font-bold text-xl mb-3">
                Trahka Records
              </h3>
              <p className="text-sm text-blue-200/60 mb-6">
                Four pillars capture every transaction ledger, debtor log, and
                shop expense immediately offline.
              </p>
              <span className="bg-success/20 text-success text-[10px] font-black uppercase px-3 py-1 rounded-full">
                Live v1.0
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-left relative z-10 digital-pulse tilt-card hover:bg-white/10 shadow-lg cursor-default">
              <div className="text-blue-400 font-extrabold text-lg mb-4">
                02
              </div>
              <h3 className="text-white font-bold text-xl mb-3">
                Trahka Thinks
              </h3>
              <p className="text-sm text-blue-200/60 mb-6 font-medium">
                Auto-analyzers flag margin anomalies, detect stock level drift
                patterns, and provide smart cash insights.
              </p>
              <span className="bg-trahka-amber/20 text-trahka-amber text-[10px] font-black uppercase px-3 py-1 rounded-full">
                Coming 2026-27
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-[15px] text-left relative z-10 digital-pulse tilt-card hover:bg-white/10 shadow-lg cursor-default">
              <div className="text-blue-400 font-extrabold text-lg mb-4">
                03
              </div>
              <h3 className="text-white font-bold text-xl mb-3">Trahka Acts</h3>
              <p className="text-sm text-blue-200/60 mb-6">
                AI agents dispatch collections, reorder dwindling inventory
                batches, and evaluate lines of credit.
              </p>
              <span className="bg-primary-fixed/20 text-primary-fixed text-[10px] font-black uppercase px-3 py-1 rounded-full">
                Coming 2027
              </span>
            </div>
          </div>

          {/* Agentic AI Preview */}
          <div
            className={`mt-16 bg-primary/10 border border-primary/30 p-8 rounded-2xl text-left reveal-on-scroll reveal ${activeReveals["vision-agentic"] ? "active" : ""} tilt-card shadow-2xl`}
            data-reveal-id="vision-agentic"
          >
            <span className="text-blue-400 text-xs font-black uppercase tracking-widest">
              🤖 Trahka AI Agent — Coming 2027
            </span>
            <h4 className="text-white text-2xl font-black mt-4">
              The first autonomous AI agent built for African SMEs.
            </h4>
            <p className="text-blue-200/70 text-base mt-4 leading-relaxed">
              Trahka AI is not a chatbot. It is a business operations assistant
              that handles late collections reminders on autopilot, replenishes
              critical inventory ahead of seasonal strain, and delivers weekly
              financial recaps directly as simple audio reports. Trahka AI
              monitors your stock levels and tells you what to reorder before
              you run out. It watches your cash flow and flags when something
              looks wrong and generates a clear, plain-language summary of your
              business performance every week, so you always know where you
              stand. This is not a feature. This is a new kind of business
              partner — one that every African SME owner deserves but has never
              had access to. Until now.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-trahka-navy py-32 border-t border-white/5">
        <div
          className={`container mx-auto px-6 md:px-12 xl:px-8 text-center reveal-on-scroll reveal ${activeReveals["cta-section"] ? "active" : ""}`}
          data-reveal-id="cta-section"
        >
          <h2 className="text-white text-5xl md:text-7xl font-extrabold max-w-4xl mx-auto leading-tight tracking-tight">
            Your business deserves better than a paper notebook.
          </h2>
          <p className="text-blue-200/80 text-xl mt-8 max-w-xl mx-auto">
            Join other SMEs using Trahka to see their numbers clearly.
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
            ✓ Free 14-day trial &nbsp; • &nbsp; Agent visit option &nbsp; •
            &nbsp; Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-trahka-navy border-t border-white/5 py-20">
        <div className="container mx-auto px-6 md:px-12 xl:px-8 max-w-7xl flex flex-col md:flex-row justify-between gap-12 w-full">
          <div className="max-w-xs text-left">
            <img 
              src="/logo1.png" 
              alt="Trahka Logo" 
              className="h-25 w-auto object-contain mb-4"
            />
            <p className="text-blue-200/50 text-sm leading-relaxed">
              The Back-Office Operating System for African SMEs.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-left">
            <div>
              <h5 className="font-bold text-xs uppercase tracking-widest mb-6 text-blue-200/80">
                Product
              </h5>
              <ul className="space-y-4 text-blue-200/60 text-sm font-medium">
                <li>
                  <a
                    className="hover:text-white transition-colors"
                    href="#product"
                    onClick={(e) => handleAnchorClick(e, "#product")}
                  >
                    Inventory
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-white transition-colors"
                    href="#product"
                    onClick={(e) => handleAnchorClick(e, "#product")}
                  >
                    Sales
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-white transition-colors"
                    href="#product"
                    onClick={(e) => handleAnchorClick(e, "#product")}
                  >
                    Debts
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-white transition-colors"
                    href="#product"
                    onClick={(e) => handleAnchorClick(e, "#product")}
                  >
                    Reports
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-xs uppercase tracking-widest mb-6 text-blue-200/80">
                Company
              </h5>
              <ul className="space-y-4 text-blue-200/60 text-sm font-medium">
                <li>
                  <a
                    className="hover:text-white transition-colors"
                    href="#vision"
                    onClick={(e) => handleAnchorClick(e, "#vision")}
                  >
                    Vision
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-white transition-colors"
                    href="#why-trahka"
                    onClick={(e) => handleAnchorClick(e, "#why-trahka")}
                  >
                    Why Trahka
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-xs uppercase tracking-widest mb-6 text-blue-200/80">
                Get Support
              </h5>
              <ul className="space-y-4 text-blue-200/60 text-sm font-medium">
                <li>
                  <button
                    onClick={onEnterApp}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    Live Demo App
                  </button>
                </li>
                <li>
                  <a
                    className="hover:text-white transition-colors"
                    href="mailto:hello@trahka.com"
                  >
                    Contact Agents
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 md:px-12 xl:px-8 max-w-7xl mt-20 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-600 text-xs">
            © 2026 Trahka. All rights reserved. SME infrastructure for African
            SMEs.
          </p>
        </div>
      </footer>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  TrendingUp, 
  HelpCircle, 
  Check, 
  UserSquare2, 
  BadgePlus, 
  UserPlus, 
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface SignupSuccessViewProps {
  onNavigate: (screen: 'profile' | 'inventory' | 'staff' | 'dashboard' | 'settings') => void;
  businessName: string;
}

export default function SignupSuccessView({ onNavigate, businessName }: SignupSuccessViewProps) {
  // Checklist dynamic state
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({
    profile: false,
    drug: false,
    team: false,
  });

  // Help Guide Modal State
  const [showGuide, setShowGuide] = useState(false);

  // Confetti particles
  const [particles, setParticles] = useState<Array<{ id: number; left: number; color: string; duration: number; delay: number; scale: number }>>([]);

  useEffect(() => {
    // Generate realistic festive confetti particles
    const colors = ['#2563EB', '#16A34A', '#004ac6', '#636e83', '#CA8A04', '#EA4335', '#FBBC05'];
    const partList = Array.from({ length: 65 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 3 + 2.5,
      delay: Math.random() * 2,
      scale: Math.random() * 0.8 + 0.4,
    }));
    setParticles(partList);
  }, []);

  const toggleItem = (key: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const completedCount = Object.values(completedItems).filter(Boolean).length;

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">
      
      {/* Falling Confetti Layer with dynamic keyframes */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-xs animate-fall select-none"
            style={{
              left: `${p.left}%`,
              width: '8px',
              height: '8px',
              backgroundColor: p.color,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              transform: `scale(${p.scale})`,
              top: '-10px',
            }}
          />
        ))}

        {/* Dynamic style tag for standard fallback frames */}
        <style>{`
          @keyframes customFall {
            0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
            10% { opacity: 0.9; }
            90% { opacity: 0.9; }
            100% { transform: translateY(105vh) rotate(540deg); opacity: 0; }
          }
          .animate-fall {
            animation-name: customFall;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
          }
          .success-pulse {
            animation: scaleUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.2);
          }
          @keyframes scaleUp {
            from { transform: scale(0.6); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>

      <main className="relative z-10 w-full max-w-[640px] flex flex-col items-center my-6 md:my-12">
        
        {/* Header Branding */}
        <div className="mb-4 flex flex-col items-center">
          <span className="text-3xl font-extrabold text-[#004ac6] tracking-tight hover:scale-105 transition-transform cursor-pointer">
            Trahka
          </span>
        </div>

        {/* Success Visual Area */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="success-pulse w-20 h-20 md:w-24 md:h-24 bg-[#16A34A] flex items-center justify-center rounded-full shadow-lg shadow-green-600/25 mb-6 relative">
            <span className="absolute inset-0 rounded-full bg-[#16A34A] animate-ping opacity-25" />
            <Check className="text-white w-10 h-10 md:w-12 md:h-12 stroke-[3]" />
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1e] mb-4 max-w-[500px] tracking-tight leading-tight">
            Welcome to the future of your business
          </h1>
          <p className="text-sm md:text-base text-[#515f74] max-w-[440px] leading-relaxed font-medium">
            Account for <span className="text-[#004ac6] font-bold">{businessName || 'your Pharmacy'}</span> has been successfully created. You're now ready to get full visibility into your operations.
          </p>
        </div>

        {/* Bento Checklist Card */}
        <div 
          className="w-full bg-white border border-[#E2E8F0] rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          {/* List Header */}
          <div className="p-5 border-b border-[#E2E8F0] bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              <h2 className="font-bold text-base text-[#191c1e]">Getting Started Guide</h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-full">
              {completedCount}/3 Completed
            </span>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {/* Onboarding Checklist Task 1 */}
            <div className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-all group">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleItem('profile')}
                  className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    completedItems.profile 
                      ? 'border-[#16A34A] bg-[#16A34A] text-white' 
                      : 'border-slate-300 hover:border-[#004ac6] text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>
                <div>
                  <button 
                    onClick={() => onNavigate('profile')}
                    className="font-bold text-[#191c1e] text-left hover:text-[#004ac6] transition-colors flex items-center gap-1.5"
                  >
                    <span>Complete Business Profile</span>
                    <UserSquare2 className="w-4 h-4 text-slate-400 group-hover:text-[#004ac6] transition-colors" />
                  </button>
                  <p className="text-xs text-[#515f74] mt-0.5">Help us tailor Trahka specifically to your pharmacy store details</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('profile')}
                className="p-1 hover:bg-slate-100 rounded-lg group-hover:translate-x-1 transition-transform"
              >
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Onboarding Checklist Task 2 */}
            <div className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-all group">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleItem('drug')}
                  className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    completedItems.drug 
                      ? 'border-[#16A34A] bg-[#16A34A] text-white' 
                      : 'border-slate-300 hover:border-[#004ac6] text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>
                <div>
                  <button 
                    onClick={() => onNavigate('inventory')}
                    className="font-bold text-[#191c1e] text-left hover:text-[#004ac6] transition-colors flex items-center gap-1.5"
                  >
                    <span>Add Your First Medicine / Drug</span>
                    <BadgePlus className="w-4 h-4 text-slate-400 group-hover:text-[#004ac6] transition-colors" />
                  </button>
                  <p className="text-xs text-[#515f74] mt-0.5">Establish your digital medicine shelves and log item levels</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('inventory')}
                className="p-1 hover:bg-slate-100 rounded-lg group-hover:translate-x-1 transition-transform"
              >
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Onboarding Checklist Task 3 */}
            <div className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-all group">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleItem('team')}
                  className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    completedItems.team 
                      ? 'border-[#16A34A] bg-[#16A34A] text-white' 
                      : 'border-slate-300 hover:border-[#004ac6] text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>
                <div>
                  <button 
                    onClick={() => onNavigate('staff')}
                    className="font-bold text-[#191c1e] text-left hover:text-[#004ac6] transition-colors flex items-center gap-1.5"
                  >
                    <span>Invite Store Attendants</span>
                    <UserPlus className="w-4 h-4 text-slate-400 group-hover:text-[#004ac6] transition-colors" />
                  </button>
                  <p className="text-xs text-[#515f74] mt-0.5">Add desk clerks and helpers with role restrictions</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('staff')}
                className="p-1 hover:bg-slate-100 rounded-lg group-hover:translate-x-1 transition-transform"
              >
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/10 hover:bg-blue-700 active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setShowGuide(true)}
            className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-slate-300 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore Features Guide</span>
          </button>
        </div>

        {/* Quick Start Trigger */}
        <div className="mt-8">
          <button 
            onClick={() => setShowGuide(true)}
            className="text-xs font-bold text-[#515f74] hover:text-[#004ac6] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>View Quick Start Guide Manual</span>
          </button>
        </div>
      </main>

      {/* Guide Modal Backdrop */}
      {showGuide && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-scaleUp border border-slate-200">
            <h3 className="text-xl font-extrabold text-[#191c1e] mb-2 flex items-center gap-2">
              <Sparkles className="text-amber-500 w-5 h-5" />
              Quick Start Store Manual
            </h3>
            <p className="text-xs text-[#515f74] mb-4">
              Learn how to utilize Trahka's offline database and Naira-native patterns to manage your pharmacy smoothly.
            </p>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 mt-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-blue-600 tracking-wider">01. INVENTORY TRACKING</span>
                <p className="text-xs text-[#515f74] mt-1 font-medium">
                  Add generic medicines, batch expiration dates, and low threshold boundaries. Trahka will continuously evaluate shelves to notify you about critical depletion levels.
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-blue-600 tracking-wider">02. DEBTER MANAGEMENT</span>
                <p className="text-xs text-[#515f74] mt-1 font-medium">
                  Record patient credit and phone logs. You can launch pre-formatted WhatsApp collections tags to outstanding customers with details about credit history lines.
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-blue-600 tracking-wider">03. SECURE OFFLINE SYSTEM</span>
                <p className="text-xs text-[#515f74] mt-1 font-medium">
                  Trahka stores all active logs inside local browser memory, securing items and cash balances when network signals fail. It uploads safely within 3 seconds of reconnection.
                </p>
              </div>
            </div>

            <button 
              onClick={() => setShowGuide(false)}
              className="mt-6 w-full text-center py-2.5 bg-[#004ac6] font-bold text-white text-sm rounded-xl hover:bg-blue-700 transition-colors"
            >
              Understand &amp; Close
            </button>
          </div>
        </div>
      )}

      {/* Success Background Geometric Decor */}
      <div className="fixed bottom-0 right-0 p-8 opacity-5 pointer-events-none select-none">
        <TrendingUp className="w-[280px] h-[280px]" />
      </div>

    </div>
  );
}

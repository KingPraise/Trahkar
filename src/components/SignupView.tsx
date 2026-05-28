import React, { useState } from 'react';
import { Eye, EyeOff, Shield, Wifi, Award, Users, ArrowLeft } from 'lucide-react';

interface SignupViewProps {
  onSignupSuccess: (data: { fullName: string; businessName: string; emailAddress: string }) => void;
  onNavigateToLogin: () => void;
  onBackToLanding: () => void;
}

export default function SignupView({ onSignupSuccess, onNavigateToLogin, onBackToLanding }: SignupViewProps) {
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!fullName.trim()) tempErrors.fullName = 'Full Name is required';
    if (!businessName.trim()) tempErrors.businessName = 'Business Name is required';
    if (!emailAddress.trim()) {
      tempErrors.emailAddress = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(emailAddress)) {
      tempErrors.emailAddress = 'Email address is invalid';
    }
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }
    if (!agreeTerms) {
      tempErrors.terms = 'You must agree to the Terms of Service';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSuccessMsg('Account created successfully! Redirecting...');
      setTimeout(() => {
        onSignupSuccess({
          fullName,
          businessName,
          emailAddress,
        });
      }, 1000);
    }
  };

  const handleGoogleSignup = () => {
    // Fill with smart simulation values and sign up
    setSuccessMsg('Connecting Google Account...');
    setTimeout(() => {
      onSignupSuccess({
        fullName: 'Chidi Okafor',
        businessName: 'MedicLabs Pharmacy',
        emailAddress: 'chidi.o@medicarepharmacy.com.ng',
      });
    }, 1000);
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col justify-between font-sans">
      
      {/* Top action bar to go back */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button 
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-[#515f74] hover:text-[#004ac6] font-semibold text-sm transition-all group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Landing Page</span>
        </button>
      </div>

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div 
          className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        >
          {/* Left Side: Registration Form */}
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
            <div className="mb-8">
              <span className="text-xl md:text-2xl text-[#004ac6] font-bold tracking-tight">Trahka</span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#191c1e] mt-6 mb-2 tracking-tight">
                Create your Trahka account
              </h1>
              <p className="text-sm md:text-base text-[#515f74] leading-relaxed">
                Join thousands of African businesses managing their operations with clarity.
              </p>
            </div>

            {/* Google Social Auth */}
            <button 
              type="button"
              onClick={handleGoogleSignup}
              className="w-full h-12 flex items-center justify-center gap-3 border border-slate-200 bg-slate-50 rounded-xl font-medium text-sm text-[#191c1e] hover:bg-slate-100 hover:border-slate-300 transition-colors active:scale-95 duration-200 mb-6 cursor-pointer"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span>Sign up with Google</span>
            </button>

            <div className="relative flex items-center mb-6">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">or sign up with email</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {successMsg && (
              <div className="p-4 mb-6 bg-green-50 text-green-700 rounded-xl border border-green-200 text-sm font-semibold animate-pulse">
                {successMsg}
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 px-1" htmlFor="full_name">Full Name</label>
                <input 
                  className={`w-full px-4 h-12 bg-white border ${errors.fullName ? 'border-red-500 bg-red-50/10' : 'border-slate-200'} rounded-xl text-sm focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] outline-hidden transition-all`}
                  id="full_name" 
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                  }}
                  placeholder="Enter your full name" 
                  type="text"
                />
                {errors.fullName && <p className="text-xs text-red-500 pl-1">{errors.fullName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 px-1" htmlFor="business_name">Business Name</label>
                <input 
                  className={`w-full px-4 h-12 bg-white border ${errors.businessName ? 'border-red-500 bg-red-50/10' : 'border-slate-200'} rounded-xl text-sm focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] outline-hidden transition-all`}
                  id="business_name" 
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    if (errors.businessName) setErrors(prev => ({ ...prev, businessName: '' }));
                  }}
                  placeholder="Enter business name" 
                  type="text"
                />
                {errors.businessName && <p className="text-xs text-red-500 pl-1">{errors.businessName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 px-1" htmlFor="email">Email Address</label>
                <input 
                  className={`w-full px-4 h-12 bg-white border ${errors.emailAddress ? 'border-red-500 bg-red-50/10' : 'border-slate-200'} rounded-xl text-sm focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] outline-hidden transition-all`}
                  id="email" 
                  value={emailAddress}
                  onChange={(e) => {
                    setEmailAddress(e.target.value);
                    if (errors.emailAddress) setErrors(prev => ({ ...prev, emailAddress: '' }));
                  }}
                  placeholder="name@company.com" 
                  type="email"
                />
                {errors.emailAddress && <p className="text-xs text-red-500 pl-1">{errors.emailAddress}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 px-1" htmlFor="password">Password</label>
                <div className="relative">
                  <input 
                    className={`w-full px-4 h-12 bg-white border ${errors.password ? 'border-red-500 bg-red-50/10' : 'border-slate-200'} rounded-xl text-sm focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] outline-hidden transition-all pr-12`}
                    id="password" 
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                    placeholder="••••••••" 
                    type={showPassword ? 'text' : 'password'}
                  />
                  <button 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors h-10 w-10 flex items-center justify-center cursor-pointer" 
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 pl-1">{errors.password}</p>}
              </div>

              <div className="flex items-start gap-3 py-2">
                <div className="flex items-center h-5">
                  <input 
                    className="w-5 h-5 rounded-sm border-slate-300 text-[#004ac6] focus:ring-[#004ac6]/50 cursor-pointer" 
                    id="terms" 
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                    }}
                  />
                </div>
                <label className="text-xs text-slate-500 cursor-pointer select-none leading-5" htmlFor="terms">
                  I agree to the <a className="text-[#004ac6] font-semibold hover:underline" href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a> and <a className="text-[#004ac6] font-semibold hover:underline" href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
                </label>
              </div>
              {errors.terms && <p className="text-xs text-red-500 px-1 -mt-1">{errors.terms}</p>}

              <button 
                className="w-full h-12 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md shadow-blue-600/10 mt-4 cursor-pointer" 
                type="submit"
              >
                Create Account
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <button onClick={onNavigateToLogin} className="text-[#004ac6] font-bold hover:underline cursor-pointer">
                Sign in
              </button>
            </p>
          </div>

          {/* Right Side: Visual Showcase & Benefits */}
          <div className="hidden md:flex flex-col bg-slate-950 p-12 lg:p-16 text-white justify-between relative overflow-hidden">
            {/* Background Pattern Decor */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 blur-[130px]" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500 blur-[120px]" />
            </div>

            <div className="relative z-10">
              <div className="mb-12">
                <div className="w-16 h-1 border-t-4 border-[#004ac6] mb-4" />
                <h2 className="text-3xl lg:text-4xl font-extrabold text-[#b4c5ff] leading-tight">
                  Empowering growth across the continent.
                </h2>
              </div>

              <div className="space-y-8">
                {/* Benefit 1 */}
                <div className="flex items-start gap-4 hover:translate-x-1 transition-transform duration-200">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-blue-300 border border-white/10 group-hover:scale-110 transition-transform">
                    <Wifi className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white mb-1">Offline-first Technology</h3>
                    <p className="text-sm text-slate-300/80 leading-relaxed">
                      Manage your shop even without internet. Sync automatically when you're back online.
                    </p>
                  </div>
                </div>

                {/* Benefit 2 */}
                <div className="flex items-start gap-4 hover:translate-x-1 transition-transform duration-200">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-amber-300 border border-white/10">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white mb-1">Naira-native Ledger</h3>
                    <p className="text-sm text-slate-300/80 leading-relaxed">
                      Built specifically for the Nigerian market with deep integration for local payment patterns.
                    </p>
                  </div>
                </div>

                {/* Benefit 3 */}
                <div className="flex items-start gap-4 hover:translate-x-1 transition-transform duration-200">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-[#b4c5ff] border border-white/10">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white mb-1">Agent-supported</h3>
                    <p className="text-sm text-slate-300/80 leading-relaxed">
                      Local support teams ready to help you optimize your business operations 24/7.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Panel */}
            <div className="relative z-10 mt-12">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs shadow-xl">
                <p className="italic text-sm text-slate-200 mb-4 leading-relaxed">
                  "Before Trahka, I couldn't tell you how much profit I made in a month. Now I check my dashboard every morning and I know exactly how my business is performing. Trahka transformed how we track our inventory. We reduced stockouts by 40% in just three months."
                </p>
                <div className="flex items-center gap-3">
                  <img 
                    className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover" 
                    referrerPolicy="no-referrer"
                    alt="Chidi Okafor" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOerPrz2NMRj0sd_YJ1FsDnuwfDCWo_-_wmCr3BhWV4RO3m2aKKi7HM66XGpUB4W78WV-zrfiIQu-1au2SCVpmO_LvDxUGlhKD3rHl1HDe4rBkcMEpYgUVBheJ2aYUYji7IYzGvDlIHh8B6GZrN5OWpNyeZ_VAsiH_VWZXL2C-U9tjvqg2bVkvqAEsY0NdNxEh4ZtdPUjYR_vHQoeULVS5nuf2H6Gtqcf_6RA_A8-7qNBOpx8tB3i_Yc1qUPVv8kfBHQdyHEGUMrQY"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">Chidi Okafor</p>
                    <p className="text-[11px] text-[#b4c5ff]">MedicLabs Pharmacy, Lagos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Simplified footer matching the exact requirement */}
      <footer className="w-full py-8 bg-slate-100 border-t border-slate-200 mt-auto">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#004ac6] text-base">Trahka</span>
            <span className="text-slate-400 text-xs">|</span>
            <p className="text-xs text-slate-500">© 2026 Trahka. All rights reserved. SME Infrastructure for Africa.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
            <a className="hover:text-[#004ac6] transition-colors underline" href="#prod" onClick={(e) => e.preventDefault()}>Product</a>
            <a className="hover:text-[#004ac6] transition-colors underline" href="#sec" onClick={(e) => e.preventDefault()}>Security</a>
            <a className="hover:text-[#004ac6] transition-colors underline" href="#priv" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a className="hover:text-[#004ac6] transition-colors underline" href="#term" onClick={(e) => e.preventDefault()}>Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

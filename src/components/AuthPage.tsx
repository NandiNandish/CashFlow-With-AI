import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  User, 
  Phone, 
  Wallet, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  LogIn, 
  LogOut as LogOutIcon, 
  RotateCcw,
  Zap,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { PaytmLogo } from './PaytmLogo';
import { UserFinancialState } from '../types';

interface AuthPageProps {
  mode: 'login' | 'logged_out';
  onLogin: (customProfile?: { name: string; balance: number; income: number }) => void;
  currentUser?: UserFinancialState;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  mode,
  onLogin,
  currentUser,
}) => {
  const [authTab, setAuthTab] = useState<'personas' | 'custom'>('personas');
  const [name, setName] = useState('Priya Sharma');
  const [phone, setPhone] = useState('98765 43210');
  const [balance, setBalance] = useState('28000');
  const [income, setIncome] = useState('52000');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Quick Demo Personas
  const personas = [
    {
      id: 'priya',
      name: 'Priya Sharma',
      role: 'Salaried Software Professional',
      location: 'Bengaluru, KA',
      balance: 28000,
      income: 52000,
      expenses: 39500,
      score: 72,
      scenario: 'High recurring EMI & Rent in Week 3 (Liquidity dip to ~₹4,500)',
      recommended: true,
      tag: 'Hackathon Hero Profile',
    },
    {
      id: 'rohan',
      name: 'Rohan Verma',
      role: 'Freelance UI/UX Designer',
      location: 'Bengaluru, KA',
      balance: 45000,
      income: 68000,
      expenses: 42000,
      score: 78,
      scenario: 'Variable milestone payments, evaluating a ₹1.5 Lakh equipment loan',
      recommended: false,
      tag: 'Freelancer Journey',
    }
  ];

  const handleSelectPersona = (p: typeof personas[0]) => {
    onLogin({
      name: p.name,
      balance: p.balance,
      income: p.income,
    });
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOtpSent(true);
    setOtp('4242'); // synthetic autofill
  };

  const handleVerifyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      onLogin({
        name: name.trim() || 'Demo User',
        balance: parseFloat(balance) || 28000,
        income: parseFloat(income) || 52000,
      });
      setIsVerifying(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#050811] bg-radial from-slate-900 via-[#070b16] to-[#04060c] text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 font-sans">
      {/* Background Ambience */}
      <div className="fixed w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20"></div>
      <div className="fixed w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20"></div>

      {/* Top Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-2 border-b border-slate-800/80">
        <PaytmLogo size="md" showTagline={true} />
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Paytm Build for India AI Hackathon
          </span>
          <span className="text-slate-500 text-xs hidden md:inline">•</span>
          <span className="text-slate-400 text-xs hidden md:inline font-mono">Track 2: Financial Journeys</span>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="max-w-xl mx-auto w-full my-auto py-8">
        {mode === 'logged_out' ? (
          /* LOGGED OUT CONFIRMATION VIEW */
          <div 
            id="logged-out-card"
            className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 text-center space-y-6 animate-in zoom-in-95 duration-200"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 mx-auto shadow-inner">
              <LogOutIcon className="w-8 h-8 text-cyan-400" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Session Ended Safely
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                You have been logged out
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Your synthetic demo changes and simulation parameters have been stored for your review. You can log back in immediately.
              </p>
            </div>

            {/* Quick Session Summary */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-left text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Previous Session</span>
                <span className="text-cyan-400 font-mono text-[11px]">Paytm CashFlow AI</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1">
                <div>
                  <span className="text-slate-500 block text-[10px]">Active Profile:</span>
                  <span className="font-medium text-white">Priya Sharma</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Liquid Balance:</span>
                  <span className="font-mono font-bold text-cyan-300">₹28,000</span>
                </div>
              </div>
            </div>

            {/* Log In Again Button */}
            <div className="space-y-3">
              <button
                id="btn-relogin-after-logout"
                onClick={() => onLogin()}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <LogIn className="w-4 h-4" />
                <span>Log Back In to Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ) : (
          /* LOGIN / SIGN IN VIEW */
          <div 
            id="login-card"
            className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 space-y-6 animate-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Intelligent Financial Copilot
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Log In to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Paytm CashFlow AI</span>
              </h1>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Predict cash flow, detect Week 3 liquidity compression, and simulate loan trade-offs with explainable AI.
              </p>
            </div>

            {/* Login Mode Selector Tabs */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
              <button
                id="tab-auth-personas"
                type="button"
                onClick={() => setAuthTab('personas')}
                className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                  authTab === 'personas'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>1-Click Demo Profiles</span>
              </button>
              <button
                id="tab-auth-custom"
                type="button"
                onClick={() => setAuthTab('custom')}
                className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                  authTab === 'custom'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Custom Sign In</span>
              </button>
            </div>

            {/* TAB 1: 1-Click Demo Personas */}
            {authTab === 'personas' ? (
              <div className="space-y-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-1">
                  Select a Synthetic Financial Persona:
                </div>

                {personas.map((p) => (
                  <div
                    key={p.id}
                    id={`persona-card-${p.id}`}
                    onClick={() => handleSelectPersona(p)}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/60 hover:bg-slate-900 transition-all cursor-pointer group relative overflow-hidden"
                  >
                    {p.recommended && (
                      <span className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-blue-600 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-bl-xl uppercase tracking-wider">
                        {p.tag}
                      </span>
                    )}

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
                          {p.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-slate-500">({p.location})</span>
                          </div>
                          <div className="text-xs text-slate-400">{p.role}</div>
                        </div>
                      </div>

                      <div className="text-right pr-2">
                        <div className="text-xs font-mono font-bold text-cyan-300">
                          ₹{p.balance.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[10px] text-slate-500">Starting Balance</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-900 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 truncate max-w-[320px]">
                        {p.scenario}
                      </span>
                      <span className="text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform shrink-0 flex items-center gap-0.5">
                        Log In &rarr;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* TAB 2: Custom Sign In Form */
              <form onSubmit={isOtpSent ? handleVerifyCustom : handleSendOtp} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Your Name:
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Mobile Number (Demo Verification):
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Starting Balance (₹):
                    </label>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="number"
                        required
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Monthly Salary (₹):
                    </label>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="number"
                        required
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {isOtpSent && (
                  <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-300 font-semibold text-[11px]">
                        Synthetic OTP Code:
                      </span>
                      <span className="text-slate-400 text-[10px]">Autofilled: 4242</span>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        maxLength={4}
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 4242"
                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-cyan-500/50 rounded-lg text-white font-mono tracking-widest text-center text-sm font-bold focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isVerifying ? (
                    <span>Verifying Credentials...</span>
                  ) : isOtpSent ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify &amp; Launch Dashboard</span>
                    </>
                  ) : (
                    <>
                      <span>Get Demo OTP &amp; Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Prototype Security Disclaimer */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Prototype demonstration for Paytm Build for India AI Hackathon. Strictly operates on synthetic local data; no real banking credentials used.
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full py-3 text-center text-xs text-slate-400 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>Paytm CashFlow AI • Predict. Explain. Plan.</div>
        <div>Bengaluru Edition • Track 2: AI-Powered Financial Journeys</div>
      </footer>
    </div>
  );
};

import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Wallet,
  Activity,
  Layers
} from 'lucide-react';
import { PaytmLogo } from './PaytmLogo';

interface DemoLoginModalProps {
  onLogin: () => void;
}

export const DemoLoginModal: React.FC<DemoLoginModalProps> = ({ onLogin }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050811] bg-radial from-slate-900 via-[#070b16] to-[#04060c]">
      {/* Decorative gradient glow */}
      <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20"></div>
      <div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20"></div>

      <div 
        id="demo-login-card"
        className="relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-cyan-950/40 text-center space-y-6"
      >
        {/* Brand Mark */}
        <div className="flex flex-col items-center space-y-3">
          <PaytmLogo size="lg" showTagline={false} />

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Paytm Build for India AI Hackathon
            </div>
            <p className="text-sm text-cyan-300/90 font-semibold tracking-wide mt-0.5">
              Predict. Explain. Plan.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Your intelligent financial copilot for cash-flow forecasting &amp; scenario simulation.
            </p>
          </div>
        </div>

        {/* Demo Account Preview Box */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-left space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Synthetic Demo Profile</span>
            <span className="text-emerald-400 font-mono text-[11px]">Active</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1">
            <div>
              <span className="text-slate-500 block text-[10px]">User:</span>
              <span className="font-medium text-white">Priya Sharma</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Current Balance:</span>
              <span className="font-mono font-bold text-cyan-300">₹28,000</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Monthly Income:</span>
              <span className="font-mono text-emerald-400">₹52,000</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Health Score:</span>
              <span className="font-mono text-amber-300">72 / 100</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="space-y-3">
          <button
            id="btn-continue-demo-account"
            onClick={onLogin}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Continue with Demo Account</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <p className="text-[11px] text-slate-500">
            Prototype • Uses synthetic financial data
          </p>
        </div>
      </div>
    </div>
  );
};

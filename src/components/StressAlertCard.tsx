import React from 'react';
import { 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  Sliders, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { StressAlert } from '../types';

interface StressAlertCardProps {
  alert: StressAlert;
  onOpenWhyModal: () => void;
  onGoToWhatIf: () => void;
}

export const StressAlertCard: React.FC<StressAlertCardProps> = ({
  alert,
  onOpenWhyModal,
  onGoToWhatIf,
}) => {
  return (
    <div 
      id="stress-alert-card"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 p-5 shadow-xl shadow-amber-950/20 mb-6"
    >
      {/* Decorative subtle background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Alert Header & Message */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Potential Cash-Flow Pressure Detected
            </span>

            <span className="text-xs text-slate-400">
              Risk:{' '}
              <strong className="text-amber-400 font-semibold px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20">
                {alert.riskLevel}
              </strong>
            </span>

            <span className="text-xs text-slate-400">
              Confidence:{' '}
              <span className="text-slate-300 italic">{alert.confidence}</span>
            </span>
          </div>

          <h3 className="text-lg font-bold text-white tracking-tight">
            &ldquo;{alert.summary}&rdquo;
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            AI forward simulation models indicate an estimated cash squeeze around{' '}
            <span className="text-amber-300 font-medium">{alert.period}</span>, where liquid reserves may dip near ₹4,500 due to early-cycle obligations.
          </p>

          {/* Quick Reasons List */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-xs text-slate-300">
            {alert.reasons.slice(0, 4).map((reason, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-400 mt-0.5">•</span>
                <span className="text-slate-300 line-clamp-1">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 self-start lg:self-center">
          <button
            id="btn-why-am-i-seeing-this"
            onClick={onOpenWhyModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 hover:border-amber-500 text-xs font-semibold transition-all shadow-sm hover:shadow-amber-500/20 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Why am I seeing this?</span>
          </button>

          <button
            id="btn-simulate-in-what-if"
            onClick={onGoToWhatIf}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulate in What If?</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

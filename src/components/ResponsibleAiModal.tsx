import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  Lock, 
  Eye, 
  Scale, 
  UserCheck 
} from 'lucide-react';

interface ResponsibleAiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResponsibleAiModal: React.FC<ResponsibleAiModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const pillars = [
    {
      icon: <UserCheck className="w-4 h-4 text-emerald-400" />,
      title: 'User Consent & Transparency',
      desc: 'Users explicitly control which accounts are analyzed, with full visibility into data flows.',
    },
    {
      icon: <Eye className="w-4 h-4 text-cyan-400" />,
      title: 'Synthetic & Demo Isolation',
      desc: 'All data displayed in this prototype is strictly synthetic. No real Paytm credentials or bank accounts are accessed.',
    },
    {
      icon: <Scale className="w-4 h-4 text-amber-400" />,
      title: 'Explainable Insights',
      desc: 'Every alert and recommendation provides transparent factor attribution and confidence ratings rather than black-box scores.',
    },
    {
      icon: <Lock className="w-4 h-4 text-blue-400" />,
      title: 'User-Controlled Scenarios',
      desc: 'The "What If?" sandbox empowers users to test alternatives without automated underwriting trigger risk.',
    },
    {
      icon: <AlertCircle className="w-4 h-4 text-rose-400" />,
      title: 'No Guaranteed Outcomes',
      desc: 'Forecasts are mathematical and probabilistic estimates, not loan commitments or investment promises.',
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-purple-400" />,
      title: 'Human-in-the-Loop Safeguards',
      desc: 'Consequential financial actions require deliberate human affirmation. The AI acts exclusively as an advisor.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="responsible-ai-modal"
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Responsible AI Principles
              </h2>
              <p className="text-xs text-slate-400">
                Ethical framing for Paytm Build for India AI Hackathon
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-300 leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pillars.map((p, i) => (
              <div key={i} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-white">
                  {p.icon}
                  <span>{p.title}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Mandatory Formal Disclaimer */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-200/90 leading-relaxed">
            <div className="font-bold uppercase tracking-wider text-amber-300 text-[10px] mb-1">
              Statutory Prototype Disclaimer
            </div>
            &ldquo;CashFlow AI is a prototype for financial education and planning support. Forecasts are estimates and are not financial, lending, insurance or investment decisions.&rdquo;
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Acknowledged
          </button>
        </div>
      </div>
    </div>
  );
};

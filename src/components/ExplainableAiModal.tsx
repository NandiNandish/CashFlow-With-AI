import React, { useState, useEffect } from 'react';
import { 
  X, 
  HelpCircle, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { StressAlert, UserFinancialState } from '../types';
import { formatINR } from '../utils/financialCalculations';

interface ExplainableAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: StressAlert;
  userState: UserFinancialState;
  onGoToWhatIf: () => void;
}

export const ExplainableAiModal: React.FC<ExplainableAiModalProps> = ({
  isOpen,
  onClose,
  alert,
  userState,
  onGoToWhatIf,
}) => {
  const [dynamicExplanation, setDynamicExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [aiSource, setAiSource] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);

    fetch('/api/ai/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'stress',
        context: {
          currentBalance: userState.currentBalance,
          monthlyIncome: userState.monthlyIncome,
          monthlyExpenses: userState.monthlyExpenses,
          projectedBuffer: userState.projectedBuffer,
          rentAmount: userState.rentAmount,
          emiAmount: userState.emiAmount,
          typicalSpending: userState.typicalSpending,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setDynamicExplanation(data.explanation || alert.explanationNotes);
          setAiSource(data.source || 'engine');
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching AI explanation:', err);
        if (isMounted) {
          setDynamicExplanation(alert.explanationNotes);
          setAiSource('fallback');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, userState]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="explainable-ai-modal"
        className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl shadow-amber-950/40 max-h-[90vh] overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-gradient-to-r from-amber-950/30 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Why did CashFlow AI flag this?
                </h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  EXPLAINABLE AI
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Transparent factor attribution & Forward timeline diagnostic
              </p>
            </div>
          </div>

          <button
            id="btn-close-why-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {/* Summary Lead */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              Summary of Findings
            </h4>
            <p className="text-slate-200 font-medium text-sm mb-3">
              Your projected buffer is estimated to be lower around Week 3 because:
            </p>
            <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside marker:text-amber-400">
              <li>
                <span className="font-semibold text-white">Recurring expenses increased:</span> ₹12,000 rent payment debits early on Day 10.
              </li>
              <li>
                <span className="font-semibold text-white">Current discretionary spending is above average:</span> Dining out and Swiggy delivery is +18% higher than your 90-day baseline.
              </li>
              <li>
                <span className="font-semibold text-white">EMI due prior to income arrival:</span> An active installment of ₹6,500 occurs on Day 12 before your primary monthly salary credit.
              </li>
              <li>
                <span className="font-semibold text-white">Available buffer is smaller than usual:</span> Current liquid account balance (₹28,000) provides less cushion against concurrent peak outflows.
              </li>
            </ol>
          </div>

          {/* Impact Breakdown Table */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Impact Breakdown (Key Contributors)
              </h4>
              <span className="text-[11px] text-slate-500">Synthetic Indian Demo Cycle</span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {alert.impacts.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-300 font-normal">{item.label}</span>
                  <span className={`font-mono font-semibold ${item.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatINR(item.amount, { signed: true })}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Projected Lowest Balance (Day 23)</span>
              <span className="text-amber-400 font-mono text-sm">~₹4,500</span>
            </div>
          </div>

          {/* AI Narrative from Gemini or Deterministic Engine */}
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-cyan-900/40 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                <Cpu className="w-3.5 h-3.5" />
                <span>AI Synthesis {aiSource === 'gemini' ? '(Powered by Gemini)' : '(Rule-Based Engine)'}</span>
              </div>
              {loading && (
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                  Generating...
                </span>
              )}
            </div>

            <div className="text-xs text-slate-300 space-y-2 whitespace-pre-line leading-relaxed">
              {dynamicExplanation || alert.explanationNotes}
            </div>
          </div>

          {/* Confidence Section */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-slate-400">How confident is this insight?</div>
              <div className="text-base font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
                <span>MEDIUM CONFIDENCE</span>
                <span className="text-xs text-slate-400 font-normal">
                  (Estimated prototype fidelity)
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                &ldquo;Confidence reflects the amount and consistency of available demo data.&rdquo;
              </div>
            </div>

            <div className="shrink-0">
              <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-[11px] font-medium text-slate-300 border border-slate-700">
                Simulated Probabilistic Model
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
          <button
            id="btn-modal-close"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Close
          </button>

          <button
            id="btn-modal-go-what-if"
            onClick={() => {
              onClose();
              onGoToWhatIf();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold transition-all shadow-lg shadow-cyan-600/20"
          >
            <span>Open &ldquo;What If?&rdquo; Simulator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

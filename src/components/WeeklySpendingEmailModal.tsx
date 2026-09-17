import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Copy, 
  Check, 
  Calendar, 
  ExternalLink,
  ShieldCheck,
  TrendingDown,
  Sparkles,
  Flame
} from 'lucide-react';
import { PaytmLogo } from './PaytmLogo';
import { CategorySpending, SpendingCap, WeeklyEmailSettings } from '../types';
import { formatINR } from '../utils/financialCalculations';

interface WeeklySpendingEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategorySpending[];
  spendingCaps: SpendingCap[];
  emailSettings: WeeklyEmailSettings;
  onNavigateTab: (tab: string) => void;
}

export const WeeklySpendingEmailModal: React.FC<WeeklySpendingEmailModalProps> = ({
  isOpen,
  onClose,
  categories,
  spendingCaps,
  emailSettings,
  onNavigateTab,
}) => {
  const [copied, setCopied] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  if (!isOpen) return null;

  // Calculate stats for the email
  const weeklySpend = 9450;
  const categoriesWithCaps = categories.map((cat) => {
    const cap = spendingCaps.find((c) => c.category === cat.category);
    const capAmount = cap ? cap.monthlyCap : 10000;
    const percent = Math.round((cat.currentMonth / capAmount) * 100);
    const isExceeded80 = percent >= 80;
    const isOverCap = percent > 100;
    return {
      ...cat,
      capAmount,
      percent,
      isExceeded80,
      isOverCap,
      remaining: Math.max(0, capAmount - cat.currentMonth),
    };
  });

  const flaggedCategories = categoriesWithCaps.filter((c) => c.isExceeded80);

  const handleCopyEmail = () => {
    const text = `Paytm CashFlow AI - Weekly Spending Digest
Sent to: ${emailSettings.email}
Subject: [Paytm CashFlow AI] Weekly Outflow Digest: ${flaggedCategories.length} Categories Exceeding 80% Cap

Summary:
- Total Outflow this Week: ₹${weeklySpend.toLocaleString('en-IN')}
- Month-to-date Spending: ₹39,500
- Safe Daily Spending: ₹320/day

Flagged Categories (>80% Cap):
${flaggedCategories.map(c => `- ${c.category}: ₹${c.currentMonth.toLocaleString('en-IN')} / ₹${c.capAmount.toLocaleString('en-IN')} (${c.percent}% utilized)`).join('\n')}

AI Copilot Advice:
Reduce weekend food delivery and defer non-essential shopping to prevent Week 3 balance from dipping below ₹4,500 reserve floor.`;

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        id="weekly-email-preview-modal"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Window Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Weekly Spending Email Message
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Email Preview
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Rendered message delivered to <span className="text-cyan-300 font-mono">{emailSettings.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-copy-email-text"
              onClick={handleCopyEmail}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Copy email text"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy Text</span>
                </>
              )}
            </button>

            <button
              id="btn-resend-test-email"
              onClick={handleResend}
              disabled={isResending}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              {isResending ? (
                <span>Dispatching...</span>
              ) : resendSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sent!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Resend Email</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Simulated Email Client Envelope Info */}
        <div className="bg-slate-950/90 px-5 py-3 border-b border-slate-800/80 text-xs space-y-1.5 text-slate-300 font-sans">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium text-[11px] w-14">From:</span>
              <span className="font-semibold text-white">Paytm CashFlow AI</span>
              <span className="text-slate-400 text-[11px]">&lt;cashflow-insights@paytm.com&gt;</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                Verified Paytm Sender
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
              Every {emailSettings.dayOfWeek}, {emailSettings.time} IST
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium text-[11px] w-14">To:</span>
            <span className="font-mono text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/60 font-semibold">
              {emailSettings.email}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium text-[11px] w-14">Subject:</span>
            <span className="font-bold text-white">
              [Paytm CashFlow AI] Weekly Outflow Digest: {flaggedCategories.length} Categories Exceeding 80% Spending Cap ⚠️
            </span>
          </div>
        </div>

        {/* Email Body: Clean, High-End Paytm Branded Email View */}
        <div className="p-5 sm:p-7 overflow-y-auto bg-[#070b14] space-y-6 text-slate-200 font-sans">
          {/* Email Container Canvas */}
          <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Paytm Top Brand Bar */}
            <div className="bg-[#002e6e] p-5 border-b border-cyan-500/30 flex items-center justify-between">
              <PaytmLogo size="md" showTagline={true} />
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider block">
                  Weekly Outflow Report
                </span>
                <span className="text-xs text-white font-mono">
                  Cycle: Week 2 • Sep 2026
                </span>
              </div>
            </div>

            {/* Email Body Content */}
            <div className="p-5 sm:p-6 space-y-5 text-xs sm:text-sm">
              <div>
                <h4 className="text-base font-extrabold text-white">
                  Hello Nandisha,
                </h4>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  Here is your weekly financial intelligence digest. We analyzed your recent UPI, cards, and recurring debits to help safeguard your Week 3 cash buffer.
                </p>
              </div>

              {/* Weekly Highlights Grid */}
              <div className="grid grid-cols-3 gap-2.5 bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                    7-Day Outflow
                  </span>
                  <span className="text-sm sm:text-base font-bold font-mono text-white">
                    ₹{weeklySpend.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block">14 UPI txns</span>
                </div>

                <div className="border-x border-slate-800 px-1">
                  <span className="text-[10px] text-amber-400 block uppercase tracking-wider font-semibold">
                    Cap Warnings
                  </span>
                  <span className="text-sm sm:text-base font-bold font-mono text-amber-300">
                    {flaggedCategories.length} Categories
                  </span>
                  <span className="text-[10px] text-amber-400/80 block">&gt;80% threshold</span>
                </div>

                <div>
                  <span className="text-[10px] text-emerald-400 block uppercase tracking-wider font-semibold">
                    Safe Daily Cap
                  </span>
                  <span className="text-sm sm:text-base font-bold font-mono text-emerald-300">
                    ₹320<span className="text-[10px] font-normal text-slate-400">/day</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block">Next 18 days</span>
                </div>
              </div>

              {/* 80% Spending Cap Warning Card */}
              {flaggedCategories.length > 0 && (
                <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>In-App Spending Cap Alert Triggered (&gt;80%)</span>
                  </div>
                  <p className="text-[11px] text-amber-200/90 leading-relaxed">
                    You configured custom spending guardrails. The following categories have exceeded 80% of their monthly limit:
                  </p>

                  <div className="space-y-2 pt-1">
                    {flaggedCategories.map((cat) => (
                      <div key={cat.category} className="bg-slate-950/70 border border-amber-500/20 rounded-lg p-2.5 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white">{cat.category}</span>
                          <span className="font-mono font-bold text-amber-300">
                            ₹{cat.currentMonth.toLocaleString('en-IN')} / ₹{cat.capAmount.toLocaleString('en-IN')}
                            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {cat.percent}%
                            </span>
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all"
                            style={{ width: `${Math.min(100, cat.percent)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>{cat.isOverCap ? 'Budget breached' : `Headroom: ₹${cat.remaining.toLocaleString('en-IN')} remaining`}</span>
                          <span className="text-amber-400">Exceeded 80% cap</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Copilot Actionable Advice */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>CashFlow AI Copilot Recommendation</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  With your ₹12,000 Rent and ₹6,500 EMI auto-debits taking effect in Week 3, capping dining delivery to ₹750 for the remainder of this cycle will preserve your ₹4,500 liquid emergency floor.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('spending');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Adjust Spending Caps in App</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('what-if');
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 underline"
                  >
                    Simulate What-If EMI &rarr;
                  </button>
                </div>
              </div>

              {/* Email Footer */}
              <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 text-center space-y-1">
                <p>
                  You received this weekly message because you subscribed to Paytm CashFlow Outflow Intelligence at {emailSettings.email}.
                </p>
                <p>
                  Paytm AI Financial Journeys • Prototype Build for India Hackathon • Bengaluru, KA
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Controls */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            Delivery Schedule: <strong className="text-slate-200">{emailSettings.dayOfWeek} at {emailSettings.time}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

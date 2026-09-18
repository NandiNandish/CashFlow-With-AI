import React from 'react';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { FinancialHealth, UserFinancialState } from '../types';
import { calculateFinancialHealth, formatINR } from '../utils/financialCalculations';

interface FinancialHealthViewProps {
  userState: UserFinancialState;
  onNavigateTab?: (tab: string) => void;
  onOpenCopilot?: () => void;
  onOpenWhatIf?: () => void;
  onOpenCommitments?: () => void;
}

export function FinancialHealthView({
  userState,
  onNavigateTab,
  onOpenCopilot,
  onOpenWhatIf,
  onOpenCommitments,
}: FinancialHealthViewProps) {
  const health: FinancialHealth = calculateFinancialHealth({
    currentBalance: userState.currentBalance,
    monthlyIncome: userState.monthlyIncome,
    monthlyExpenses: userState.monthlyExpenses,
    projectedBuffer: userState.projectedBuffer,
    emiBurden: userState.emiAmount || 6500,
    lowestBalance: 4500,
  });

  const getStatusBadge = (status: FinancialHealth['status']) => {
    switch (status) {
      case 'HEALTHY':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'MODERATE':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'STRESSED':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  const handleWhatIf = () => {
    if (onOpenWhatIf) onOpenWhatIf();
    else if (onNavigateTab) onNavigateTab('what-if');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Deterministic Financial Health Score
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Rule-Based • 0 to 100
            </span>
          </div>
          <p className="text-xs text-slate-400">
            A transparent 5-factor evaluation of your cash-flow durability, liquidity buffer, and debt commitments
          </p>
        </div>

        <button
          onClick={handleWhatIf}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Improve via What-If Sandbox
        </button>
      </div>

      {/* Main Score Hero Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Score Gauge / Number */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-xl border border-slate-800 text-center">
          <div className="relative flex items-center justify-center w-28 h-28">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-cyan-400 transition-all duration-1000 ease-out"
                strokeDasharray={`${health.overallScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white font-mono">{health.overallScore}</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">out of 100</span>
            </div>
          </div>

          <div className="mt-4">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(health.status)}`}>
              {health.status}
            </span>
          </div>
        </div>

        {/* Plain Language Explanation */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[11px]">
              Plain Language Diagnostic
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {health.summary}
          </p>

          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Monthly Income Inflows</span>
              <span className="font-mono font-bold text-white text-sm">{formatINR(userState.monthlyIncome)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Fixed Commitments Burden</span>
              <span className="font-mono font-bold text-amber-400 text-sm">~35.6% of income</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Factors Breakdown Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          Key Health Factors Scoring Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {health.factors.map((factor) => {
            const pct = (factor.score / factor.maxScore) * 100;
            const isGood = factor.status === 'good';
            const isWarning = factor.status === 'warning';

            return (
              <div
                key={factor.label}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">{factor.label}</span>
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {factor.score}/{factor.maxScore} pts
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mb-2.5">
                    <div
                      className={`h-full rounded-full ${
                        isGood ? 'bg-emerald-400' : isWarning ? 'bg-cyan-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-2">
                    {factor.explanation}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-cyan-300/90 flex items-start gap-1.5">
                  <span className="font-bold shrink-0">Metric:</span>
                  <span className="font-mono">{factor.metricValue}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

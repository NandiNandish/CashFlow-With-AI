import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Sliders, 
  ReceiptText, 
  PieChart, 
  Bot, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Activity, 
  Clock, 
  Flame, 
  Zap, 
  Percent,
  Compass
} from 'lucide-react';
import { UserFinancialState, StressAlert, Transaction, SmartRecommendation } from '../types';
import { MetricCards } from './MetricCards';
import { StressAlertCard } from './StressAlertCard';
import { CashFlowForecastChart } from './CashFlowForecastChart';
import { SmartRecommendations } from './SmartRecommendations';
import { formatINR } from '../utils/financialCalculations';

interface DashboardViewProps {
  userState: UserFinancialState;
  stressAlert: StressAlert;
  transactions: Transaction[];
  recommendations: SmartRecommendation[];
  onOpenStressModal: () => void;
  onNavigateTab: (tabId: string) => void;
  onOpenCopilot: () => void;
  warningCapsCount?: number;
  flaggedCategories?: string[];
  onOpenEmailPreview?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userState,
  stressAlert,
  transactions,
  recommendations,
  onOpenStressModal,
  onNavigateTab,
  onOpenCopilot,
  warningCapsCount = 0,
  flaggedCategories = [],
  onOpenEmailPreview,
}) => {
  // Compute vital stats for Dashboard
  const daysUntilSalary = 18; // approx days until next monthly salary credit
  const dailyBurnRate = Math.round(userState.monthlyExpenses / 30);
  const safeDailySpend = Math.max(0, Math.round((userState.currentBalance - 18500) / daysUntilSalary));
  const userCorrectedCount = transactions.filter(t => t.isUserCorrected).length;

  return (
    <div id="dashboard-main-view" className="space-y-6 animate-in fade-in duration-200">
      {/* 1. TOP METRIC CARDS */}
      <MetricCards
        userState={userState}
        onOpenStressModal={onOpenStressModal}
      />

      {/* 2. DASHBOARD QUICK ACTIONS & FINANCIAL VITALS BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Financial Vitals Gauge */}
        <div className="lg:col-span-2 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Liquidity Vitals &amp; Runway Gauge
              </h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
              Live AI Metrics
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {/* Runway */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
              <div className="flex items-center gap-1 text-slate-400 text-[10px] mb-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>Runway to Salary</span>
              </div>
              <div className="text-base font-bold font-mono text-white">
                {daysUntilSalary} Days
              </div>
              <div className="text-[10px] text-slate-400">Credit on Day 1</div>
            </div>

            {/* Daily Burn Rate */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
              <div className="flex items-center gap-1 text-slate-400 text-[10px] mb-1">
                <Flame className="w-3 h-3 text-rose-400" />
                <span>Daily Burn Rate</span>
              </div>
              <div className="text-base font-bold font-mono text-slate-200">
                ₹{dailyBurnRate.toLocaleString('en-IN')}<span className="text-xs text-slate-400 font-normal">/day</span>
              </div>
              <div className="text-[10px] text-slate-400">Based on past 30d</div>
            </div>

            {/* Safe Discretionary Spend */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
              <div className="flex items-center gap-1 text-slate-400 text-[10px] mb-1">
                <ShieldAlert className="w-3 h-3 text-emerald-400" />
                <span>Safe Daily Spend</span>
              </div>
              <div className="text-base font-bold font-mono text-emerald-400">
                ₹{safeDailySpend.toLocaleString('en-IN')}<span className="text-xs text-slate-400 font-normal">/day</span>
              </div>
              <div className="text-[10px] text-emerald-400/80">Protects ₹4.5k buffer</div>
            </div>

            {/* Fixed Outflow Load */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
              <div className="flex items-center gap-1 text-slate-400 text-[10px] mb-1">
                <Percent className="w-3 h-3 text-amber-400" />
                <span>Fixed Commitments</span>
              </div>
              <div className="text-base font-bold font-mono text-amber-300">
                35.5%
              </div>
              <div className="text-[10px] text-slate-400">Rent + Loan EMI</div>
            </div>
          </div>
        </div>

        {/* Quick Action Launchpad */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Dashboard Actions
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Direct access to interactive planning tools
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-dash-action-whatif"
              onClick={() => onNavigateTab('what-if')}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold">
                <Sliders className="w-3.5 h-3.5" />
                <span>What-If?</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Test ₹2L EMI load</div>
            </button>

            <button
              id="btn-dash-action-tx"
              onClick={() => onNavigateTab('transactions')}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                <ReceiptText className="w-3.5 h-3.5" />
                <span>Re-categorize</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{userCorrectedCount} edited</div>
            </button>

            <button
              id="btn-dash-action-spending"
              onClick={() => onNavigateTab('spending')}
              className={`p-2.5 rounded-xl border text-left transition-all group ${
                warningCapsCount > 0
                  ? 'bg-amber-950/30 border-amber-500/40 hover:border-amber-500/70'
                  : 'bg-slate-950 hover:bg-slate-800 border-slate-800 hover:border-blue-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-1.5 text-xs font-semibold ${
                  warningCapsCount > 0 ? 'text-amber-400' : 'text-blue-400'
                }`}>
                  <PieChart className="w-3.5 h-3.5" />
                  <span>Spending Caps</span>
                </div>
                {warningCapsCount > 0 && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {warningCapsCount} &gt;80%
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {warningCapsCount > 0 ? 'Near budget cap' : 'Category guardrails'}
              </div>
            </button>

            <button
              id="btn-dash-action-copilot"
              onClick={onOpenCopilot}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 hover:from-cyan-900/60 hover:to-blue-900/60 border border-cyan-700/50 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-bold">
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ask Copilot</span>
              </div>
              <div className="text-[10px] text-cyan-400/80 mt-0.5">Explain balances</div>
            </button>
          </div>
        </div>
      </div>

      {/* 3. AI CASH-FLOW STRESS DETECTION ALERT CARD */}
      <StressAlertCard
        alert={stressAlert}
        onOpenWhyModal={onOpenStressModal}
        onGoToWhatIf={() => onNavigateTab('what-if')}
      />

      {/* SPENDING CAPS & EMAIL DIGEST ALERT WIDGET */}
      {warningCapsCount > 0 && (
        <div 
          id="dashboard-caps-warning-widget"
          className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  Spending Caps Alert: {flaggedCategories.join(', ')} &gt;80%
                </h4>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  In-App Trigger
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Outflow in these categories is approaching your custom threshold. Check progress or preview your weekly email report.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenEmailPreview && (
              <button
                id="btn-dash-preview-weekly-email"
                onClick={onOpenEmailPreview}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <span>Weekly Email</span>
              </button>
            )}
            <button
              id="btn-dash-manage-caps"
              onClick={() => onNavigateTab('spending')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
            >
              <span>Manage Caps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 4. MAIN CASH FLOW FORECAST GRAPH */}
      <CashFlowForecastChart
        currentBalance={userState.currentBalance}
        onOpenStressModal={onOpenStressModal}
      />

      {/* 5. SMART RECOMMENDATIONS SECTION */}
      <SmartRecommendations
        recommendations={recommendations}
        onAction={(targetTab) => {
          if (targetTab) onNavigateTab(targetTab);
          else onOpenStressModal();
        }}
      />

      {/* 6. RECENT ACTIVITY & AUTO-CLASSIFICATIONS LEDGER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Recent Transactions &amp; AI Classification
            </h3>
            <p className="text-xs text-slate-400">
              Auto-categorized ledger items with manual override &amp; user-corrected badges
            </p>
          </div>
          <button
            id="btn-view-all-tx-dashboard"
            onClick={() => onNavigateTab('transactions')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View &amp; Re-categorize All {transactions.length}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="text-slate-400 font-mono text-[11px] w-16">
                  {tx.date}
                </div>
                <div>
                  <div className="font-semibold text-white">{tx.description}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {tx.isUserCorrected ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        User-corrected ({tx.category})
                      </span>
                    ) : (
                      <div className="text-[10px] text-cyan-400 flex items-center gap-1">
                        <span className="bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">{tx.aiCategory}</span>
                        <span className="text-slate-500 font-mono">• {Math.round(tx.aiConfidence * 100)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`font-mono font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-slate-200'}`}>
                  {formatINR(tx.amount, { signed: true })}
                </div>
                <div className="text-[10px] text-slate-400">{tx.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

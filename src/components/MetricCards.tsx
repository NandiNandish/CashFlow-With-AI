import React from 'react';
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldAlert, 
  Activity,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { UserFinancialState } from '../types';
import { formatINR } from '../utils/financialCalculations';

interface MetricCardsProps {
  userState: UserFinancialState;
  onOpenStressModal: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ userState, onOpenStressModal }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6">
      {/* 1. CURRENT BALANCE */}
      <div 
        id="card-current-balance"
        className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 transition-all hover:shadow-lg hover:shadow-cyan-950/20"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Current Balance
          </span>
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Wallet className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-white mb-1">
          {formatINR(userState.currentBalance)}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Liquid savings in primary account</span>
        </div>
      </div>

      {/* 2. MONTHLY INCOME */}
      <div 
        id="card-monthly-income"
        className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 transition-all hover:shadow-lg hover:shadow-cyan-950/20"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Monthly Income
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ArrowDownLeft className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-emerald-400 mb-1">
          {formatINR(userState.monthlyIncome)}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>Salary credited on 9th of month</span>
        </div>
      </div>

      {/* 3. MONTHLY EXPENSES */}
      <div 
        id="card-monthly-expenses"
        className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 transition-all hover:shadow-lg hover:shadow-cyan-950/20"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Monthly Expenses
          </span>
          <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-slate-200 mb-1">
          {formatINR(userState.monthlyExpenses)}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span>Rent (₹12k) + EMI (₹6.5k) + Variable</span>
        </div>
      </div>

      {/* 4. PROJECTED BUFFER */}
      <div 
        id="card-projected-buffer"
        onClick={onOpenStressModal}
        className="bg-slate-900/80 border border-amber-500/30 hover:border-amber-500/60 rounded-2xl p-4 transition-all hover:shadow-lg hover:shadow-amber-950/30 cursor-pointer group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-full pointer-events-none"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-amber-300/90 uppercase tracking-wider">
            Projected Buffer
          </span>
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-amber-300 mb-1">
          {formatINR(userState.projectedBuffer)}
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-amber-400/90 font-medium">⚠️ Tight in Wk 3</span>
          <span className="text-slate-400 underline group-hover:text-amber-200 transition-colors">
            Why? &rarr;
          </span>
        </div>
      </div>

      {/* 5. FINANCIAL HEALTH */}
      <div 
        id="card-financial-health"
        className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 transition-all hover:shadow-lg hover:shadow-cyan-950/20"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Financial Health
          </span>
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Activity className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-2xl font-bold tracking-tight text-white">
            {userState.financialHealthScore}
          </span>
          <span className="text-xs font-medium text-slate-400">/ 100</span>
          <span className="ml-auto text-[11px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            MODERATE
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
          <div 
            className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full"
            style={{ width: `${userState.financialHealthScore}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

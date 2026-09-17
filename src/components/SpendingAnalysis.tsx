import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  AlertCircle,
  Sparkles,
  Sliders,
  Mail,
  Bell,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import { CategorySpending, SpendingCap, WeeklyEmailSettings } from '../types';
import { formatINR } from '../utils/financialCalculations';
import { SpendingCapsSection } from './SpendingCapsSection';

interface SpendingAnalysisProps {
  categories: CategorySpending[];
  spendingCaps: SpendingCap[];
  onUpdateCap: (category: string, newCap: number, notifyAt80?: boolean) => void;
  onResetCaps: () => void;
  emailSettings: WeeklyEmailSettings;
  onUpdateEmailSettings: (settings: Partial<WeeklyEmailSettings>) => void;
  onSendTestEmail: () => void;
  onOpenEmailPreview: () => void;
}

export const SpendingAnalysis: React.FC<SpendingAnalysisProps> = ({ 
  categories,
  spendingCaps,
  onUpdateCap,
  onResetCaps,
  emailSettings,
  onUpdateEmailSettings,
  onSendTestEmail,
  onOpenEmailPreview,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'caps' | 'trends'>('caps');

  // Key movers for callout cards
  const bigMovers = [
    { name: 'Food & Dining', change: 18, direction: 'up', note: 'Swiggy & Zomato peak weekend surge', impact: '+₹1,260 outflow' },
    { name: 'Shopping & Lifestyle', change: 12, direction: 'up', note: 'Apparel & Amazon festive orders', impact: '+₹600 outflow' },
    { name: 'Transport & Fuel', change: -4, direction: 'down', note: 'Hybrid office commute savings', impact: '-₹150 saved' },
    { name: 'Entertainment', change: -7, direction: 'down', note: 'Reduced cinema & offline events', impact: '-₹150 saved' },
  ];

  // Count how many categories exceed 80%
  const categoriesOver80 = categories.filter((cat) => {
    const cap = spendingCaps.find((c) => c.category === cat.category);
    const capAmt = cap ? cap.monthlyCap : 10000;
    return (cat.currentMonth / capAmt) >= 0.8;
  });

  return (
    <div id="spending-analysis-page" className="space-y-6">
      {/* Sub-Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-2 sm:p-2.5 shadow-lg">
        <div className="flex items-center gap-1.5">
          <button
            id="subtab-spending-caps"
            onClick={() => setActiveSubTab('caps')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'caps'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Category Spending Caps &amp; Guardrails</span>
            {categoriesOver80.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950">
                {categoriesOver80.length} &gt;80%
              </span>
            )}
          </button>

          <button
            id="subtab-spending-trends"
            onClick={() => setActiveSubTab('trends')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'trends'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Month-over-Month Velocity &amp; Trends</span>
          </button>
        </div>

        {/* Quick Email Trigger */}
        <div className="flex items-center gap-2">
          <button
            id="btn-quick-preview-email-top"
            onClick={onOpenEmailPreview}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Weekly Email Digest</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: SPENDING CAPS & EMAIL SETTINGS */}
      {activeSubTab === 'caps' ? (
        <SpendingCapsSection
          categories={categories}
          spendingCaps={spendingCaps}
          onUpdateCap={onUpdateCap}
          onResetCaps={onResetCaps}
          emailSettings={emailSettings}
          onUpdateEmailSettings={onUpdateEmailSettings}
          onSendTestEmail={onSendTestEmail}
          onOpenEmailPreview={onOpenEmailPreview}
        />
      ) : (
        /* VIEW 2: HISTORICAL TRENDS & MOM VELOCITY */
        <div className="space-y-6">
          {/* Top Header */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    OUTFLOW INTELLIGENCE
                  </span>
                  <span className="text-xs text-slate-400">Month-over-Month Velocity</span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Spending Analysis &amp; Category Trends
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Comparing current billing cycle against your 90-day baseline to isolate discretionary drift.
                </p>
              </div>
            </div>

            {/* Big Movers Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800">
              {bigMovers.map((mover, idx) => {
                const isIncrease = mover.direction === 'up';
                return (
                  <div 
                    key={idx}
                    id={`spending-mover-${idx}`}
                    className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{mover.name}</span>
                      <span className={`inline-flex items-center text-xs font-bold font-mono px-1.5 py-0.5 rounded ${
                        isIncrease 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {isIncrease ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                        {isIncrease ? `+${mover.change}%` : `${mover.change}%`}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{mover.note}</div>
                    <div className="text-[11px] font-medium text-cyan-400 font-mono">{mover.impact}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Bar Chart: This Month vs Previous Month */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Expense by Category: This Month vs Previous Month
                </h3>
                <p className="text-xs text-slate-400">
                  Values in INR (₹). Notice the discretionary surge in Food &amp; Dining and Shopping.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-3 h-3 rounded bg-slate-600"></span>
                  Previous Month
                </span>
                <span className="flex items-center gap-1.5 text-cyan-300 font-medium">
                  <span className="w-3 h-3 rounded bg-cyan-500"></span>
                  This Month
                </span>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categories}
                  margin={{ top: 20, right: 20, left: -5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="category" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${Math.round(v/1000)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                    formatter={(val: any) => [formatINR(Number(val)), '']}
                  />
                  <Bar dataKey="previousMonth" name="Previous Month" fill="#475569" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="currentMonth" name="This Month" fill="#00baf2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

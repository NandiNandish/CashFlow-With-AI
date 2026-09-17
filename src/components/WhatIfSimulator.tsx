import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  Sparkles, 
  HelpCircle, 
  ShieldAlert, 
  CheckCircle2, 
  Info, 
  ArrowRight,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Cpu
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { RiskLevel, UserFinancialState } from '../types';
import { 
  calculateEmi, 
  evaluateScenario, 
  formatINR, 
  generateForecastTimeline 
} from '../utils/financialCalculations';

interface WhatIfSimulatorProps {
  userState: UserFinancialState;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ userState }) => {
  // Scenario Interactive Parameters
  const [loanAmount, setLoanAmount] = useState<number>(200000);
  const [interestRate, setInterestRate] = useState<number>(11.5);
  const [tenureMonths, setTenureMonths] = useState<number>(36);
  const [activeScenarioComparison, setActiveScenarioComparison] = useState<'A' | 'B'>('B');

  // Baseline scenario (Scenario A: Conservative ₹4,500 EMI)
  const scenarioA = useMemo(() => {
    return evaluateScenario(
      { loanAmount: 140000, interestRate: 10.5, tenureMonths: 36, customEmi: 4500 },
      {
        currentBalance: userState.currentBalance,
        monthlyIncome: userState.monthlyIncome,
        monthlyExpenses: userState.monthlyExpenses,
        existingEmi: userState.emiAmount,
      }
    );
  }, [userState]);

  // Current simulated scenario (Dynamic or Scenario B: ₹6,500 / ₹6,600 EMI)
  const currentSimResult = useMemo(() => {
    return evaluateScenario(
      { loanAmount, interestRate, tenureMonths },
      {
        currentBalance: userState.currentBalance,
        monthlyIncome: userState.monthlyIncome,
        monthlyExpenses: userState.monthlyExpenses,
        existingEmi: userState.emiAmount,
      }
    );
  }, [loanAmount, interestRate, tenureMonths, userState]);

  // Scenario B predefined comparison preset
  const scenarioB = useMemo(() => {
    return evaluateScenario(
      { loanAmount: 200000, interestRate: 11.5, tenureMonths: 36, customEmi: 6500 },
      {
        currentBalance: userState.currentBalance,
        monthlyIncome: userState.monthlyIncome,
        monthlyExpenses: userState.monthlyExpenses,
        existingEmi: userState.emiAmount,
      }
    );
  }, [userState]);

  // Multi-scenario chart data comparing Baseline vs Scenario A vs Current Simulation
  const comparisonChartData = useMemo(() => {
    const baselinePoints = generateForecastTimeline(userState.currentBalance, 0, 30);
    const scenarioAPoints = generateForecastTimeline(userState.currentBalance, 4500 - 6500, 30);
    const scenarioBPoints = generateForecastTimeline(userState.currentBalance, currentSimResult.monthlyEmi - 6500, 30);

    return baselinePoints.map((pt, idx) => ({
      day: pt.day,
      dateStr: pt.dateStr,
      baselineBalance: pt.projectedBalance,
      scenarioABalance: scenarioAPoints[idx]?.projectedBalance ?? pt.projectedBalance,
      scenarioBBalance: scenarioBPoints[idx]?.projectedBalance ?? pt.projectedBalance,
    }));
  }, [userState, currentSimResult.monthlyEmi]);

  return (
    <div id="what-if-simulator-page" className="space-y-6">
      {/* Title & Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                SCENARIO SIMULATOR
              </span>
              <span className="text-xs text-slate-400">
                AI Decision Sandbox
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              What If?
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Explore financial decisions before you make them. Test loan sizing, EMI thresholds, and liquidity trade-offs.
            </p>
          </div>

          {/* Quick Hero Demo Workflow Preset Button */}
          <div className="flex items-center gap-2">
            <button
              id="btn-hero-demo-preset"
              onClick={() => {
                setLoanAmount(200000);
                setInterestRate(11.5);
                setTenureMonths(36);
                setActiveScenarioComparison('B');
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-cyan-600/25"
            >
              <Sparkles className="w-4 h-4" />
              <span>Load Hero Scenario: ₹2 Lakh Loan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls & Right Dynamic Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Sliders & Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Loan Scenario Parameters
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Formula: P·r·(1+r)ⁿ / ((1+r)ⁿ-1)</span>
            </div>

            {/* Slider 1: Loan Amount */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Loan Principal (P)
                </label>
                <span className="text-base font-bold font-mono text-cyan-300">
                  {formatINR(loanAmount)}
                </span>
              </div>
              <input
                id="slider-loan-amount"
                type="range"
                min={50000}
                max={1000000}
                step={25000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>₹50,000</span>
                <span>₹5,00,000</span>
                <span>₹10,00,000</span>
              </div>
            </div>

            {/* Slider 2: Interest Rate */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Interest Rate (Annual %)
                </label>
                <span className="text-base font-bold font-mono text-cyan-300">
                  {interestRate}% p.a.
                </span>
              </div>
              <input
                id="slider-interest-rate"
                type="range"
                min={8.5}
                max={20.0}
                step={0.5}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>8.5% (Prime)</span>
                <span>11.5% (Standard)</span>
                <span>20.0%</span>
              </div>
            </div>

            {/* Slider 3: Tenure Months */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Tenure (Months)
                </label>
                <span className="text-base font-bold font-mono text-cyan-300">
                  {tenureMonths} Months ({(tenureMonths / 12).toFixed(1)} yrs)
                </span>
              </div>
              <input
                id="slider-tenure-months"
                type="range"
                min={12}
                max={60}
                step={6}
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>12 mo</span>
                <span>36 mo</span>
                <span>60 mo</span>
              </div>
            </div>

            {/* Quick EMI Preset Switcher (Demo Hero Test) */}
            <div className="pt-3 border-t border-slate-800">
              <label className="text-xs font-medium text-slate-400 block mb-2">
                Quick Preset: Compare EMI Amounts Directly
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="btn-preset-emi-4500"
                  onClick={() => {
                    setLoanAmount(140000);
                    setInterestRate(10.5);
                    setTenureMonths(36);
                  }}
                  className="p-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-left transition-colors"
                >
                  <div className="text-[10px] text-emerald-400 font-semibold uppercase">Scenario A</div>
                  <div className="text-xs font-bold text-white">EMI: ₹4,500/mo</div>
                  <div className="text-[10px] text-slate-400">Projected buffer: Higher</div>
                </button>

                <button
                  id="btn-preset-emi-6500"
                  onClick={() => {
                    setLoanAmount(200000);
                    setInterestRate(11.5);
                    setTenureMonths(36);
                  }}
                  className="p-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-left transition-colors"
                >
                  <div className="text-[10px] text-amber-400 font-semibold uppercase">Scenario B</div>
                  <div className="text-xs font-bold text-white">EMI: ₹6,600/mo</div>
                  <div className="text-[10px] text-slate-400">Projected buffer: Lower</div>
                </button>
              </div>
            </div>
          </div>

          {/* Responsible AI Notice Box */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-300">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Transparent AI Boundary</span>
            </div>
            <p className="leading-relaxed">
              This simulator is an educational decision-support tool. It does not underwrite, approve, or reject credit, nor guarantee rate offers.
            </p>
          </div>
        </div>

        {/* Right 7 Cols: Dynamic Simulation Metrics & Visual Comparison */}
        <div className="lg:col-span-7 space-y-4">
          {/* Dynamic Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Monthly EMI */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-left">
              <div className="text-[11px] font-medium text-slate-400 uppercase">
                Monthly EMI
              </div>
              <div className="text-xl font-extrabold font-mono text-cyan-400 mt-0.5">
                {formatINR(currentSimResult.monthlyEmi)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Total int: {formatINR(currentSimResult.totalInterest)}
              </div>
            </div>

            {/* Projected Monthly Buffer */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-left">
              <div className="text-[11px] font-medium text-slate-400 uppercase">
                Projected Buffer
              </div>
              <div className={`text-xl font-extrabold font-mono mt-0.5 ${
                currentSimResult.projectedMonthlyBuffer < 5000 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {formatINR(currentSimResult.projectedMonthlyBuffer)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Down from ₹9,500
              </div>
            </div>

            {/* Projected Lowest Balance */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-left">
              <div className="text-[11px] font-medium text-slate-400 uppercase">
                Lowest Balance
              </div>
              <div className="text-xl font-extrabold font-mono text-white mt-0.5">
                {formatINR(currentSimResult.projectedLowestBalance)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Estimated Day 23
              </div>
            </div>

            {/* Cash-flow pressure level */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-left">
              <div className="text-[11px] font-medium text-slate-400 uppercase">
                Pressure Level
              </div>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                  currentSimResult.pressureLevel === 'HIGH'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : currentSimResult.pressureLevel === 'MEDIUM'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {currentSimResult.pressureLevel} RISK
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Mid-month squeeze
              </div>
            </div>
          </div>

          {/* Interactive Multi-Curve Scenario Comparison Chart */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">
                  Dynamic Cash-Flow Trajectory Under Scenarios
                </h4>
                <p className="text-xs text-slate-400">
                  Visualizing how changing EMI impacts your Day 23 liquidity dip
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                  Baseline
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  Scenario A (₹4.5k)
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  Simulated ({formatINR(currentSimResult.monthlyEmi)})
                </span>
              </div>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={comparisonChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="dateStr" stroke="#64748b" fontSize={10} tickLine={false} interval={4} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${Math.round(v/1000)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                    formatter={(value: any, name: any) => [formatINR(Number(value)), name]}
                  />
                  {/* Baseline curve */}
                  <Line type="monotone" dataKey="baselineBalance" stroke="#64748b" strokeWidth={1.5} strokeDasharray="3 3" dot={false} name="Baseline" />
                  {/* Scenario A (Lower EMI) */}
                  <Line type="monotone" dataKey="scenarioABalance" stroke="#10b981" strokeWidth={2} dot={false} name="Scenario A (₹4.5k EMI)" />
                  {/* Current Simulated / Scenario B */}
                  <Line type="monotone" dataKey="scenarioBBalance" stroke="#f59e0b" strokeWidth={2.5} dot={false} name={`Simulated (${formatINR(currentSimResult.monthlyEmi)})`} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Explainable Trade-off Box */}
          <div className="bg-gradient-to-br from-slate-900 to-cyan-950/30 border border-cyan-500/30 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                AI Trade-Off Diagnostic
              </h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              &ldquo;With the higher EMI scenario, your projected monthly buffer decreases from ₹9,500 down to {formatINR(currentSimResult.projectedMonthlyBuffer)}. This does not mean the loan is unaffordable; it highlights a potential cash-flow trade-off that should be considered alongside actual eligibility, rates and obligations.&rdquo;
            </p>

            {/* Side-by-Side Scenario Comparison Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs">
                <div className="font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  SCENARIO A (Conservative)
                </div>
                <div className="text-slate-300 space-y-1 text-[11px]">
                  <div>• Monthly EMI: <strong className="text-white">₹4,500</strong></div>
                  <div>• Projected Buffer: <strong className="text-emerald-400">Higher (₹5,000)</strong></div>
                  <div>• Cash Flow Pressure: <strong className="text-emerald-400">Lower</strong></div>
                </div>
              </div>

              <div className="bg-slate-950/70 border border-amber-500/30 rounded-xl p-3 text-xs">
                <div className="font-bold text-amber-400 uppercase tracking-wider mb-1">
                  SCENARIO B (Target Loan)
                </div>
                <div className="text-slate-300 space-y-1 text-[11px]">
                  <div>• Monthly EMI: <strong className="text-white">{formatINR(currentSimResult.monthlyEmi)}</strong></div>
                  <div>• Projected Buffer: <strong className="text-amber-400">Lower ({formatINR(currentSimResult.projectedMonthlyBuffer)})</strong></div>
                  <div>• Cash Flow Pressure: <strong className="text-amber-400">Moderate / High</strong></div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-400">Personalized Next Step:</span>
              <span className="text-cyan-300 font-medium">
                Consider extending tenure to 48 months or deferring discretionary spends to protect buffer.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

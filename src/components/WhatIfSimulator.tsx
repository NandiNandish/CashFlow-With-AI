import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sliders, 
  Sparkles, 
  HelpCircle, 
  ShieldAlert, 
  CheckCircle2, 
  Info, 
  ArrowRight,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Shield,
  DollarSign,
  Percent,
  Layers
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
  calculateEMI, 
  calculateScenarioImpact,
  formatINR, 
  generateForecastTimeline 
} from '../utils/financialCalculations';

interface WhatIfSimulatorProps {
  userState: UserFinancialState;
  onApplyScenarioToSession?: (delta: { deltaBalance: number; deltaBuffer: number }) => void;
}

type ScenarioTab = 'loan' | 'transaction' | 'insurance' | 'income' | 'spending_change';

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ userState, onApplyScenarioToSession }) => {
  const [activeTab, setActiveTab] = useState<ScenarioTab>('loan');

  // Loan Scenario State
  const [loanAmount, setLoanAmount] = useState<number>(200000);
  const [interestRate, setInterestRate] = useState<number>(11.5);
  const [tenureMonths, setTenureMonths] = useState<number>(36);
  const [customEmiSlider, setCustomEmiSlider] = useState<number>(6500);

  // Transaction Scenario State
  const [txAmount, setTxAmount] = useState<number>(3000);
  const [txCategory, setTxCategory] = useState<string>('Shopping');
  const [txType, setTxType] = useState<'expense' | 'income'>('expense');

  // Insurance Scenario State
  const [insuranceAmount, setInsuranceAmount] = useState<number>(12000);
  const [insuranceType, setInsuranceType] = useState<string>('Health Insurance Annual');

  // Income Scenario State
  const [incomeBonus, setIncomeBonus] = useState<number>(10000);

  // Spending Change Scenario State
  const [spendingPctChange, setSpendingPctChange] = useState<number>(10); // +10%

  // AI Explanation State
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Synchronize loan EMI when loan amount / tenure / interest rate changes
  useEffect(() => {
    const calc = calculateEMI(loanAmount, interestRate, tenureMonths);
    setCustomEmiSlider(calc);
  }, [loanAmount, interestRate, tenureMonths]);

  // Baseline Financial Model
  const baseline = useMemo(() => ({
    currentBalance: userState.currentBalance,
    monthlyIncome: userState.monthlyIncome,
    monthlyExpenses: userState.monthlyExpenses,
    projectedBuffer: userState.projectedBuffer,
    existingEmi: userState.emiAmount,
    lowestBalance: 4500,
  }), [userState]);

  // Calculate Scenario Impact Deterministically
  const impact = useMemo(() => {
    if (activeTab === 'loan') {
      return calculateScenarioImpact('loan', loanAmount, baseline, {
        interestRate,
        tenureMonths,
      });
    }
    if (activeTab === 'transaction') {
      return calculateScenarioImpact('transaction', txAmount, baseline, {
        category: txCategory,
        isIncome: txType === 'income',
      });
    }
    if (activeTab === 'insurance') {
      return calculateScenarioImpact('insurance', insuranceAmount, baseline);
    }
    if (activeTab === 'income') {
      return calculateScenarioImpact('income', incomeBonus, baseline);
    }
    // spending_change
    return calculateScenarioImpact('spending_change', spendingPctChange, baseline);
  }, [activeTab, loanAmount, interestRate, tenureMonths, txAmount, txCategory, txType, insuranceAmount, incomeBonus, spendingPctChange, baseline]);

  // Fetch or generate grounded AI Explanation
  useEffect(() => {
    let isCancelled = false;
    async function fetchAiAnalysis() {
      setIsLoadingAi(true);
      try {
        const res = await fetch('/api/ai/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'scenario',
            scenario: {
              type: activeTab,
              amount: activeTab === 'loan' ? loanAmount : activeTab === 'transaction' ? txAmount : activeTab === 'insurance' ? insuranceAmount : activeTab === 'income' ? incomeBonus : spendingPctChange,
              impact,
            },
            context: {
              ...baseline,
              activeTab,
            },
          }),
        });

        if (res.ok && !isCancelled) {
          const data = await res.json();
          setAiExplanation(data.explanation);
        }
      } catch (err) {
        if (!isCancelled) {
          setAiExplanation(impact.explanation);
        }
      } finally {
        if (!isCancelled) setIsLoadingAi(false);
      }
    }

    fetchAiAnalysis();
    return () => {
      isCancelled = true;
    };
  }, [activeTab, impact, baseline, loanAmount, txAmount, insuranceAmount, incomeBonus, spendingPctChange]);

  // Dual-Curve Forecast Timeline Data
  const forecastData = useMemo(() => {
    const additionalEmi = activeTab === 'loan' ? (customEmiSlider > 6500 ? customEmiSlider - 6500 : 0) : 0;
    const simDelta = {
      balanceDelta: impact.deltaBalance,
      bufferDelta: impact.deltaBuffer,
    };
    return generateForecastTimeline(baseline.currentBalance, additionalEmi, 30, simDelta);
  }, [baseline.currentBalance, customEmiSlider, activeTab, impact]);

  const handleReset = () => {
    setLoanAmount(200000);
    setInterestRate(11.5);
    setTenureMonths(36);
    setTxAmount(3000);
    setTxCategory('Shopping');
    setTxType('expense');
    setInsuranceAmount(12000);
    setIncomeBonus(10000);
    setSpendingPctChange(10);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Unified "What-If" Financial Scenario Sandbox
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Deterministic Math Engine
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Simulate decisions before committing. The AI informs and models consequences; it does not approve loans or make decisions for you.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Scenario
        </button>
      </div>

      {/* Scenario Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'loan', label: 'Loan / EMI', icon: CreditCard },
          { id: 'transaction', label: 'What if I spend / receive?', icon: ShoppingBag },
          { id: 'insurance', label: 'Insurance Due', icon: Shield },
          { id: 'income', label: 'Income Inflow', icon: DollarSign },
          { id: 'spending_change', label: 'Spending Velocity Change', icon: Percent },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ScenarioTab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Controls (Left) vs Comparison & Forecast (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[11px]">
                Scenario Parameters
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {activeTab.toUpperCase()}
              </span>
            </div>

            {/* 1. Loan Controls */}
            {activeTab === 'loan' && (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1.5">
                    <span>Loan Principal:</span>
                    <span className="font-bold text-white font-mono">{formatINR(loanAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="500000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>₹50K</span>
                    <span>₹2.5L</span>
                    <span>₹5L</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Interest Rate (% p.a.)</label>
                    <input
                      type="number"
                      step="0.25"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Tenure (Months)</label>
                    <select
                      value={tenureMonths}
                      onChange={(e) => setTenureMonths(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    >
                      <option value={12}>12 Months (1 yr)</option>
                      <option value={24}>24 Months (2 yrs)</option>
                      <option value={36}>36 Months (3 yrs)</option>
                      <option value={48}>48 Months (4 yrs)</option>
                      <option value={60}>60 Months (5 yrs)</option>
                    </select>
                  </div>
                </div>

                {/* Interactive EMI Slider */}
                <div className="pt-2 border-t border-slate-800">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-slate-300 font-medium">Interactive EMI Sensitivity:</span>
                    <span className="font-mono font-bold text-cyan-400 text-sm">{formatINR(customEmiSlider)}/mo</span>
                  </div>
                  <input
                    type="range"
                    min="4000"
                    max="10000"
                    step="500"
                    value={customEmiSlider}
                    onChange={(e) => setCustomEmiSlider(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>₹4,000</span>
                    <span>₹6,500</span>
                    <span>₹10,000</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Transaction Controls */}
            {activeTab === 'transaction' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1.5">Transaction Type</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setTxType('expense')}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        txType === 'expense' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400'
                      }`}
                    >
                      Expense Outflow
                    </button>
                    <button
                      type="button"
                      onClick={() => setTxType('income')}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        txType === 'income' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400'
                      }`}
                    >
                      Income Inflow
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1.5">
                    <span>Amount:</span>
                    <span className="font-bold text-white font-mono">{formatINR(txAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="25000"
                    step="500"
                    value={txAmount}
                    onChange={(e) => setTxAmount(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Shopping">Shopping & Lifestyle</option>
                    <option value="Dining">Food & Dining</option>
                    <option value="Travel">Travel & Fuel</option>
                    <option value="Bills">Bills & Utilities</option>
                  </select>
                </div>
              </div>
            )}

            {/* 3. Insurance Controls */}
            {activeTab === 'insurance' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Insurance Type</label>
                  <select
                    value={insuranceType}
                    onChange={(e) => setInsuranceType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Health Insurance Annual">Health Insurance (Annual Lump-Sum)</option>
                    <option value="Vehicle Comprehensive">Vehicle Comprehensive Insurance</option>
                    <option value="Life Term Insurance">Life Term Cover</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1.5">
                    <span>Upcoming Premium Amount:</span>
                    <span className="font-bold text-white font-mono">{formatINR(insuranceAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min="3000"
                    max="30000"
                    step="1000"
                    value={insuranceAmount}
                    onChange={(e) => setInsuranceAmount(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>₹3,000</span>
                    <span>₹15,000</span>
                    <span>₹30,000</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Income Controls */}
            {activeTab === 'income' && (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1.5">
                    <span>Additional Income / Freelance Bonus:</span>
                    <span className="font-bold text-emerald-400 font-mono">+{formatINR(incomeBonus)}</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="50000"
                    step="2000"
                    value={incomeBonus}
                    onChange={(e) => setIncomeBonus(Number(e.target.value))}
                    className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* 5. Spending Change Controls */}
            {activeTab === 'spending_change' && (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1.5">
                    <span>Monthly Discretionary Velocity Shift:</span>
                    <span className={`font-bold font-mono ${spendingPctChange > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {spendingPctChange > 0 ? `+${spendingPctChange}%` : `${spendingPctChange}%`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="40"
                    step="5"
                    value={spendingPctChange}
                    onChange={(e) => setSpendingPctChange(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>-30% (Frugal)</span>
                    <span>0% (Baseline)</span>
                    <span>+40% (Surge)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Consequence Disclaimer */}
            <div className="p-3 rounded-xl bg-slate-950 text-[11px] text-slate-400 border border-slate-800 flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Projected cash-flow impact is an educational simulation based on demo data. It does not constitute a loan approval or credit decision.
              </span>
            </div>
          </div>
        </div>

        {/* Comparison & Forecast Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Side-by-Side Comparison Box */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              Current Position vs. Simulated Scenario
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* CURRENT */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  CURRENT BASELINE
                </span>

                <div className="space-y-2 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Available Balance</span>
                    <span className="font-mono font-bold text-white text-base">
                      {formatINR(impact.currentBalance)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Projected Month-End Buffer</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {formatINR(impact.projectedBufferCurrent)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Week 3 Cash Floor</span>
                    <span className="font-mono font-medium text-slate-300">
                      ~{formatINR(impact.lowestBalanceCurrent)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Cash-Flow Risk</span>
                    <span className="font-bold text-amber-400 text-xs">
                      MODERATE
                    </span>
                  </div>
                </div>
              </div>

              {/* WITH SCENARIO */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 to-cyan-950/20 border border-cyan-500/40 space-y-3 shadow-lg shadow-cyan-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    WITH SCENARIO
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      impact.riskLevel === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-300'
                        : impact.riskLevel === 'MEDIUM'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {impact.riskLevel} PRESSURE
                  </span>
                </div>

                <div className="space-y-2 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Simulated Balance</span>
                    <span className="font-mono font-bold text-white text-base">
                      {formatINR(impact.scenarioBalance)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Scenario Month-End Buffer</span>
                    <span className={`font-mono font-bold text-sm ${impact.projectedBufferScenario < 4000 ? 'text-rose-400' : 'text-cyan-400'}`}>
                      {formatINR(impact.projectedBufferScenario)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">New Week 3 Cash Floor</span>
                    <span className="font-mono font-medium text-slate-300">
                      ~{formatINR(impact.lowestBalanceScenario)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Projected Consequence</span>
                    <span className="text-xs text-slate-300 font-medium">
                      {impact.pressureChangeDescription}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Explanation Box */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-cyan-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Cognee Cloud 3 / AI Trade-off Explanation
                </span>
                {isLoadingAi && (
                  <span className="text-[10px] text-cyan-400 animate-pulse font-mono">
                    Evaluating...
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {aiExplanation || impact.explanation}
              </p>
            </div>
          </div>

          {/* Live Dual-Curve Forecast Graph */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Forward 30-Day Liquidity Trajectory
                </h4>
                <p className="text-[11px] text-slate-400">
                  Visualizing baseline forecast vs. simulated scenario curve
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                  <span className="w-2.5 h-0.5 bg-slate-400 inline-block" /> Current
                </span>
                <span className="flex items-center gap-1 text-cyan-400 font-mono text-[11px]">
                  <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" /> Scenario
                </span>
              </div>
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="dateStr" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(val) => `₹${Math.round(val / 1000)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                    formatter={(val: any, name: any) => [
                      formatINR(Number(val)),
                      name === 'projectedBalance' ? 'Baseline Balance' : 'Scenario Balance',
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="projectedBalance"
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                    dot={false}
                    name="projectedBalance"
                  />
                  <Line
                    type="monotone"
                    dataKey="scenarioBalance"
                    stroke="#22d3ee"
                    strokeWidth={2.5}
                    dot={false}
                    name="scenarioBalance"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

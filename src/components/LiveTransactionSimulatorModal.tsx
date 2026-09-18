import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  Wallet,
  Calendar,
  Layers,
  Info
} from 'lucide-react';
import { formatINR } from '../utils/financialCalculations';
import { Transaction, UserFinancialState } from '../types';

interface LiveTransactionSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userState: UserFinancialState;
  onApplyTransaction?: (simulatedTx: Transaction) => void;
  onApplySimulation?: (simulatedTx: Transaction, impact: { deltaBalance: number; deltaBuffer: number }) => void;
  onResetSimulation?: () => void;
  activeSimulation?: Transaction | null;
  onOpenWhatIf?: () => void;
}

const CATEGORIES = [
  'Food & Dining',
  'Shopping & Lifestyle',
  'Travel & Fuel',
  'Bills & Utilities',
  'Entertainment',
  'Health & Healthcare',
  'Education',
  'Other'
];

export function LiveTransactionSimulatorModal({
  isOpen,
  onClose,
  userState,
  onApplyTransaction,
  onApplySimulation,
  onResetSimulation,
  activeSimulation,
  onOpenWhatIf,
}: LiveTransactionSimulatorModalProps) {
  const [amount, setAmount] = useState<number>(3000);
  const [category, setCategory] = useState<string>('Shopping & Lifestyle');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [date, setDate] = useState<string>('Today');
  const [merchant, setMerchant] = useState<string>('Amazon India');
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Calculate live numbers
  const isExpense = type === 'expense';
  const delta = isExpense ? -amount : amount;

  const currentBalance = userState.currentBalance;
  const simulatedBalance = Math.max(0, currentBalance + delta);

  const currentBuffer = userState.projectedBuffer;
  const simulatedBuffer = Math.max(0, currentBuffer + delta);

  const currentWeek3Floor = 4500;
  const simulatedWeek3Floor = Math.max(800, currentWeek3Floor + delta);

  // Generate or fetch AI explanation
  useEffect(() => {
    let isCancelled = false;
    async function fetchExplanation() {
      setIsLoadingAi(true);
      try {
        const res = await fetch('/api/ai/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'transaction',
            transaction: { amount, category, type },
            context: {
              currentBalance,
              projectedBuffer: currentBuffer,
              simulatedBalance,
              simulatedBuffer,
            },
          }),
        });
        if (res.ok && !isCancelled) {
          const data = await res.json();
          setAiExplanation(data.explanation);
        }
      } catch (err) {
        if (!isCancelled) {
          setAiExplanation(
            isExpense
              ? `Your simulated ₹${amount.toLocaleString('en-IN')} ${category} expense reduces your projected buffer by ₹${amount.toLocaleString('en-IN')}. Because existing commitments (Rent ₹12,000 + EMI ₹6,500) already create pressure around Week 3, this leaves less room for discretionary spending.`
              : `Your simulated ₹${amount.toLocaleString('en-IN')} ${category} credit increases your balance and expands your projected buffer to ₹${simulatedBuffer.toLocaleString('en-IN')}.`
          );
        }
      } finally {
        if (!isCancelled) setIsLoadingAi(false);
      }
    }

    if (isOpen) {
      fetchExplanation();
    }

    return () => {
      isCancelled = true;
    };
  }, [amount, category, type, isOpen, currentBalance, currentBuffer, simulatedBalance, simulatedBuffer, isExpense]);

  if (!isOpen) return null;

  const handleApply = () => {
    const newTx: Transaction = {
      id: `sim-tx-${Date.now()}`,
      date: date === 'Today' ? '18 Sep' : date,
      rawDate: '2026-09-18',
      description: merchant || `Simulated ${category}`,
      category,
      amount: isExpense ? -Math.abs(amount) : Math.abs(amount),
      type,
      status: 'SIMULATED',
      aiCategory: category,
      aiConfidence: 0.99,
      isSimulated: true,
    };

    if (onApplyTransaction) {
      onApplyTransaction(newTx);
    } else if (onApplySimulation) {
      onApplySimulation(newTx, { deltaBalance: delta, deltaBuffer: delta });
    }
    onClose();
  };

  const handleReset = () => {
    if (onResetSimulation) {
      onResetSimulation();
    }
    setAmount(3000);
    setCategory('Shopping & Lifestyle');
    setType('expense');
    setMerchant('Amazon India');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-6"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                  Live Transaction Simulator
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    SIMULATION • NO REAL PAYMENT MADE
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Test any financial action and instantly see its consequence on your future cash flow
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Input Form Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Type Toggle */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Transaction Type
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      type === 'expense'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      type === 'income'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    Income
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="100"
                    step="500"
                    value={amount}
                    onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-3 py-2 text-sm text-white font-medium focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    placeholder="3,000"
                  />
                </div>
                {/* Preset amount pills */}
                <div className="flex gap-1.5 mt-2">
                  {[1000, 3000, 5000, 10000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                        amount === preset
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-white'
                      }`}
                    >
                      ₹{preset.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Merchant / Description */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Merchant / Label (Optional)
                </label>
                <input
                  type="text"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all"
                  placeholder="e.g. Amazon, Zara, Swiggy"
                />
              </div>
            </div>

            {/* Impact Step-by-Step Flow Card */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                IMPACT OF THIS TRANSACTION
              </div>

              {/* Flow Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                {/* Step 1 */}
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400">Action</span>
                  <span className="font-semibold text-white mt-1">
                    {formatINR(amount)} {category.split(' ')[0]}
                  </span>
                </div>

                {/* Step 2 */}
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400">Balance Impact</span>
                  <span className={`font-semibold mt-1 ${isExpense ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isExpense ? `-${formatINR(amount)}` : `+${formatINR(amount)}`}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {formatINR(currentBalance)} → {formatINR(simulatedBalance)}
                  </span>
                </div>

                {/* Step 3 */}
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400">Projected Buffer</span>
                  <span className={`font-semibold mt-1 ${isExpense ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isExpense ? `-${formatINR(amount)}` : `+${formatINR(amount)}`}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {formatINR(currentBuffer)} → {formatINR(simulatedBuffer)}
                  </span>
                </div>

                {/* Step 4 */}
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400">Week 3 Pressure</span>
                  <span className={`font-semibold mt-1 ${isExpense ? 'text-amber-400' : 'text-cyan-400'}`}>
                    {isExpense ? 'Higher pressure' : 'Pressure relieved'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Floor: ~{formatINR(simulatedWeek3Floor)}
                  </span>
                </div>
              </div>

              {/* Numerical Changes Summary Grid */}
              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Current Balance</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-slate-400 line-through text-xs font-mono">
                      {formatINR(currentBalance)}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span className={`font-bold font-mono ${isExpense ? 'text-rose-300' : 'text-emerald-300'}`}>
                      {formatINR(simulatedBalance)}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Projected Buffer</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-slate-400 line-through text-xs font-mono">
                      {formatINR(currentBuffer)}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span className={`font-bold font-mono ${isExpense ? 'text-rose-300' : 'text-emerald-300'}`}>
                      {formatINR(simulatedBuffer)}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[11px]">Week 3 Status</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-xs text-amber-300 font-medium">
                      {isExpense ? 'Increased Risk' : 'Healthy Reserve'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Explanation Callout */}
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-cyan-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  AI Contextual Explanation
                </span>
                {isLoadingAi && (
                  <span className="text-[10px] text-cyan-400/80 animate-pulse font-mono">
                    Generating insight...
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {aiExplanation ||
                  `Your simulated ₹${amount.toLocaleString('en-IN')} ${category} expense reduces your projected buffer by ₹${amount.toLocaleString('en-IN')}. Because existing commitments already create pressure around Week 3, this leaves less room for discretionary spending.`}
              </p>
            </div>

            {/* Disclaimer */}
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400">
              <Info className="w-4 h-4 text-slate-500 shrink-0" />
              <span>
                Simulated transactions only modify the temporary scenario model. No real banking requests or payment executions take place.
              </span>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Simulation
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Apply to Demo Session
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Shield,
  CreditCard,
  Home,
  Zap,
  Plus,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  DollarSign,
  TrendingDown
} from 'lucide-react';
import { formatINR, calculateCommitmentImpact } from '../utils/financialCalculations';
import { Commitment, InsurancePolicy, UserFinancialState } from '../types';

interface CommitmentsPageProps {
  commitments: Commitment[];
  insurancePolicies?: InsurancePolicy[];
  policies?: InsurancePolicy[];
  userState: UserFinancialState;
  onNavigateTab: (tab: string) => void;
  onOpenWhatIf?: () => void;
  onOpenWhatIfForCommitment?: (commitment: Commitment) => void;
  onAddCommitment?: (commitment: Commitment) => void;
}

export function CommitmentsPage({
  commitments,
  insurancePolicies,
  policies,
  userState,
  onNavigateTab,
  onOpenWhatIf,
  onOpenWhatIfForCommitment,
  onAddCommitment,
}: CommitmentsPageProps) {
  const effectivePolicies = insurancePolicies || policies || [];
  const [selectedInsurance, setSelectedInsurance] = useState<InsurancePolicy | undefined>(effectivePolicies[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCommitmentName, setNewCommitmentName] = useState('');
  const [newCommitmentAmount, setNewCommitmentAmount] = useState(2000);
  const [newCommitmentDate, setNewCommitmentDate] = useState('15 Sep');
  const [newCommitmentFrequency, setNewCommitmentFrequency] = useState<'Monthly' | 'Annual'>('Monthly');
  const [newCommitmentCategory, setNewCommitmentCategory] = useState('Bills & Utilities');

  // Timeline items sorted by day of the month
  const timelineItems = [...commitments].sort((a, b) => a.dueDayNumber - b.dueDayNumber);

  const totalMonthlyCommitments = commitments
    .filter((c) => c.status !== 'PAID')
    .reduce((sum, c) => sum + (c.frequency === 'Annual' ? Math.round(c.amount / 12) : c.amount), 0);

  const healthInsurance = effectivePolicies.find((p) => p.type === 'Health') || effectivePolicies[0];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommitmentName.trim()) return;

    const dayNum = parseInt(newCommitmentDate.replace(/\D/g, ''), 10) || 15;
    const newCmt: Commitment = {
      id: `cmt-custom-${Date.now()}`,
      name: newCommitmentName,
      category: newCommitmentCategory,
      amount: newCommitmentAmount,
      frequency: newCommitmentFrequency,
      dueDate: newCommitmentDate,
      dueDayNumber: dayNum,
      status: 'UPCOMING',
      projectedImpact: `Simulated obligation adds ${formatINR(newCommitmentAmount)} outflow on Day ${dayNum}.`,
    };

    if (onAddCommitment) {
      onAddCommitment(newCmt);
    }
    setIsAddModalOpen(false);
    setNewCommitmentName('');
  };

  return (
    <div className="space-y-6">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Financial Commitments & Outflow Timeline
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Deterministic Schedule
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Mandatory obligations scheduled across the month that directly constrain your available buffer
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Commitment
          </button>
          <button
            onClick={() => onNavigateTab('what-if')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Test in What-If
          </button>
        </div>
      </div>

      {/* Visual Timeline Section */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Cash-Flow Obligation Timeline
            </h3>
            <p className="text-xs text-slate-400">
              Chronological sequence of commitments feeding directly into the 30-day forecast engine
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Total Pending Outflow: <strong className="text-white">{formatINR(totalMonthlyCommitments)}</strong>
          </span>
        </div>

        {/* Horizontal / Visual Stepper Timeline */}
        <div className="pt-4 pb-2 overflow-x-auto">
          <div className="min-w-[640px] flex items-center justify-between relative px-6">
            {/* Base Horizontal Connecting Line */}
            <div className="absolute top-6 left-12 right-12 h-0.5 bg-slate-800 -z-0" />

            {/* Today Point */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/20">
                <span className="text-[10px] font-bold">TODAY</span>
              </div>
              <span className="mt-2 text-xs font-bold text-white">18 Sep</span>
              <span className="text-[11px] text-cyan-400 font-mono">{formatINR(userState.currentBalance)} Bal</span>
            </div>

            {/* Commitments Sequence */}
            {timelineItems.map((item) => {
              const isPaid = item.status === 'PAID';
              const isDueSoon = item.status === 'DUE SOON';
              const isInsurance = item.isInsurance;

              return (
                <div key={item.id} className="relative z-10 flex flex-col items-center text-center max-w-[130px]">
                  <div
                    className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-105 ${
                      isPaid
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : isDueSoon
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                        : isInsurance
                        ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                        : 'bg-slate-800 border-slate-600 text-slate-300'
                    }`}
                  >
                    {isPaid ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isDueSoon ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : isInsurance ? (
                      <Shield className="w-5 h-5" />
                    ) : item.category === 'Housing' ? (
                      <Home className="w-5 h-5" />
                    ) : (
                      <Zap className="w-5 h-5" />
                    )}
                  </div>
                  <span className="mt-2 text-xs font-bold text-white">{item.dueDate}</span>
                  <span className="text-[11px] font-semibold text-slate-300 truncate w-full" title={item.name}>
                    {item.name.split(' ')[0]}
                  </span>
                  <span className={`text-[11px] font-mono font-bold ${isPaid ? 'text-slate-500 line-through' : 'text-rose-400'}`}>
                    -{formatINR(item.amount)}
                  </span>
                  <span
                    className={`mt-1 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded ${
                      isPaid
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : isDueSoon
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Insurance Deep-Dive Section */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Insurance as a Financial Commitment
              </h3>
              <p className="text-xs text-slate-400">
                Understand the cash-flow impact of insurance premiums on your monthly buffer
              </p>
            </div>
          </div>
          <span className="text-[11px] text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 font-medium">
            Educational Cash-Flow Model • Not a Broker/Marketplace
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Policy Overview Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                Selected Policy
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[10px] font-bold">
                {healthInsurance.type} Cover
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">
              {healthInsurance.providerLabel}
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Premium Outflow:</span>
                <span className="font-mono font-bold text-white">{formatINR(healthInsurance.premium)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Payment Frequency:</span>
                <span className="font-semibold text-slate-200">{healthInsurance.frequency}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Next Payment Date:</span>
                <span className="font-mono font-bold text-amber-400">{healthInsurance.nextPaymentDate}</span>
              </div>
            </div>
          </div>

          {/* Buffer Impact Before vs After */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">
              Projected Buffer Impact
            </span>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Projected Buffer Before Payment:</span>
                <span className="font-mono font-bold text-emerald-400">{formatINR(healthInsurance.projectedBufferBefore)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Projected Buffer After Payment:</span>
                <span className="font-mono font-bold text-rose-400">{formatINR(healthInsurance.projectedBufferAfter)}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500 w-[65%]" />
                <div className="h-full bg-rose-500 w-[35%]" />
              </div>
              <span className="text-[11px] text-rose-300 block font-medium">
                ⚠️ Temporary deficit of {formatINR(Math.abs(healthInsurance.projectedBufferAfter))} without salary credit
              </span>
            </div>
          </div>

          {/* Neutral AI Explanation */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Neutral Cash-Flow Explanation
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {healthInsurance.neutralExplanation}
              </p>
            </div>
            <div className="text-[10px] text-slate-400 pt-2 border-t border-indigo-500/20">
              * Does not represent insurance eligibility, claims advice, or purchase recommendation.
            </div>
          </div>
        </div>
      </div>

      {/* Commitments Table */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-cyan-400" />
            Active Obligations Ledger
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {commitments.length} Total Commitments Tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <th className="py-3 px-3">Commitment Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Frequency</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Projected Impact</th>
                <th className="py-3 px-3 text-right">What-If Test</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {commitments.map((cmt) => (
                <tr key={cmt.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">
                    {cmt.name}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                      {cmt.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-white">
                    {formatINR(cmt.amount)}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {cmt.frequency}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-200">
                    {cmt.dueDate}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        cmt.status === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : cmt.status === 'DUE SOON'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {cmt.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[11px] text-slate-400 max-w-xs">
                    {cmt.projectedImpact}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onNavigateTab('what-if')}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 ml-auto"
                    >
                      Simulate
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Commitment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Add Financial Commitment
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Commitment Name
                </label>
                <input
                  type="text"
                  required
                  value={newCommitmentName}
                  onChange={(e) => setNewCommitmentName(e.target.value)}
                  placeholder="e.g. Gym Membership, Child School Fee"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    required
                    value={newCommitmentAmount}
                    onChange={(e) => setNewCommitmentAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="text"
                    required
                    value={newCommitmentDate}
                    onChange={(e) => setNewCommitmentDate(e.target.value)}
                    placeholder="e.g. 15 Sep"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Frequency
                  </label>
                  <select
                    value={newCommitmentFrequency}
                    onChange={(e) => setNewCommitmentFrequency(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCommitmentCategory}
                    onChange={(e) => setNewCommitmentCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Bills & Utilities">Bills & Utilities</option>
                    <option value="Housing">Housing</option>
                    <option value="Insurance">Insurance</option>
                    <option value="EMI & Loans">EMI & Loans</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Save Commitment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

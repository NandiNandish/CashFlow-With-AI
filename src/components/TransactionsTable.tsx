import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Calendar,
  CheckCircle2,
  Tag,
  Edit3,
  SlidersHorizontal,
  Check,
  RotateCcw,
  ArrowUpDown
} from 'lucide-react';
import { Transaction } from '../types';
import { formatINR } from '../utils/financialCalculations';
import { EditTransactionModal } from './EditTransactionModal';

interface TransactionsTableProps {
  transactions: Transaction[];
  onUpdateTransaction?: (updatedTx: Transaction) => void;
  onOpenSimulateTx?: () => void;
  onRemoveSimulatedTx?: (txId: string) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ 
  transactions,
  onUpdateTransaction,
  onOpenSimulateTx,
  onRemoveSimulatedTx
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE' | 'USER_CORRECTED' | 'SIMULATED'>('ALL');
  
  // Modal state for editing
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((tx) => set.add(tx.category));
    return ['ALL', ...Array.from(set)];
  }, [transactions]);

  const userCorrectedCount = useMemo(() => {
    return transactions.filter((t) => t.isUserCorrected).length;
  }, [transactions]);

  const simulatedCount = useMemo(() => {
    return transactions.filter((t) => t.isSimulated || t.status === 'SIMULATED').length;
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch = 
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.aiCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'ALL' || tx.category === selectedCategory;
      
      const matchesFilter = 
        selectedFilter === 'ALL' ||
        (selectedFilter === 'INCOME' && tx.type === 'income') ||
        (selectedFilter === 'EXPENSE' && tx.type === 'expense') ||
        (selectedFilter === 'USER_CORRECTED' && tx.isUserCorrected) ||
        (selectedFilter === 'SIMULATED' && (tx.isSimulated || tx.status === 'SIMULATED'));

      return matchesSearch && matchesCategory && matchesFilter;
    });
  }, [transactions, searchTerm, selectedCategory, selectedFilter]);

  const handleOpenEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (updatedTx: Transaction) => {
    if (onUpdateTransaction) {
      onUpdateTransaction(updatedTx);
    }
  };

  const handleRevertTransaction = (txId: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (tx && onUpdateTransaction) {
      const reverted: Transaction = {
        ...tx,
        category: tx.originalCategory || tx.category,
        aiCategory: tx.originalCategory || tx.aiCategory,
        isUserCorrected: false,
        correctedAt: undefined,
      };
      onUpdateTransaction(reverted);
    }
  };

  // Quick Demo Action: Trigger editing the first dining transaction
  const handleQuickDemoEdit = () => {
    const target = transactions.find(t => t.id === 'tx-4' || t.category === 'Food & Dining') || transactions[0];
    if (target) {
      handleOpenEdit(target);
    }
  };

  return (
    <div id="transactions-page-container" className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Account Transactions
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {filteredTransactions.length} of {transactions.length} Records
              </span>
              {userCorrectedCount > 0 && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {userCorrectedCount} User-corrected
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Synthetic Indian banking ledger with NLP classification &amp; manual re-categorization override
            </p>
          </div>

          {/* Quick Actions: Simulate Tx & Re-categorize Demo */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {onOpenSimulateTx && (
              <button
                id="btn-simulate-tx-table"
                onClick={onOpenSimulateTx}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-all shadow-sm shrink-0"
                title="Test a simulated transaction"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulate Transaction</span>
              </button>
            )}

            <button
              id="btn-quick-recategorize-demo"
              onClick={handleQuickDemoEdit}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all shadow-sm shrink-0"
              title="Quickly test re-categorizing a sample transaction"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Re-categorize Demo Transaction</span>
            </button>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="input-search-transactions"
                type="text"
                placeholder="Search merchant, tag, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
          {/* Filter Type Buttons: All, Income, Expenses, and User-corrected */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              id="btn-filter-all"
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedFilter === 'ALL'
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Records
            </button>
            <button
              id="btn-filter-income"
              onClick={() => setSelectedFilter('INCOME')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedFilter === 'INCOME'
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Income (+)
            </button>
            <button
              id="btn-filter-expense"
              onClick={() => setSelectedFilter('EXPENSE')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedFilter === 'EXPENSE'
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Expenses (-)
            </button>
            <button
              id="btn-filter-user-corrected"
              onClick={() => setSelectedFilter('USER_CORRECTED')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                selectedFilter === 'USER_CORRECTED'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>User-corrected ({userCorrectedCount})</span>
            </button>

            {simulatedCount > 0 && (
              <button
                id="btn-filter-simulated"
                onClick={() => setSelectedFilter('SIMULATED')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                  selectedFilter === 'SIMULATED'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-amber-300 hover:text-amber-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulated ({simulatedCount})</span>
              </button>
            )}
          </div>

          {/* Category Selector */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
            <span className="text-slate-500 text-[11px] shrink-0">Category:</span>
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-700 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Classification Status</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <tr 
                    key={tx.id}
                    id={`tx-row-${tx.id}`}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-300 font-mono font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{tx.date}</span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {tx.description}
                      </div>
                      {tx.isRecurring && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-medium mt-0.5">
                          Recurring Mandate
                        </span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-lg border font-medium ${
                        tx.isUserCorrected 
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-600/50' 
                          : 'bg-slate-800 text-slate-300 border-slate-700/60'
                      }`}>
                        {tx.category}
                      </span>
                    </td>

                    {/* Classification Status / User-corrected / Simulated Badge */}
                    <td className="py-3.5 px-4">
                      {tx.isSimulated || tx.status === 'SIMULATED' ? (
                        <div className="space-y-0.5">
                          <span 
                            id={`badge-simulated-${tx.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold tracking-wider shadow-xs shadow-amber-950 animate-pulse"
                          >
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            SIMULATED • NO REAL PAYMENT MADE
                          </span>
                          <div className="text-[10px] text-amber-400/80 font-medium">
                            Live What-If Sandbox Active
                          </div>
                        </div>
                      ) : tx.isUserCorrected ? (
                        <div className="space-y-0.5">
                          <span 
                            id={`badge-user-corrected-${tx.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold shadow-xs shadow-emerald-950"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            User-corrected
                          </span>
                          {tx.originalCategory && tx.originalCategory !== tx.category && (
                            <div className="text-[10px] text-slate-400">
                              (Original: {tx.originalCategory})
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 text-[11px] font-medium">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            {tx.aiCategory}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {Math.round(tx.aiConfidence * 100)}%
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-bold text-sm">
                      <span className={isIncome ? 'text-emerald-400' : tx.isSimulated ? 'text-amber-300' : 'text-slate-200'}>
                        {formatINR(tx.amount, { signed: true })}
                      </span>
                    </td>

                    {/* Action: Re-categorize or Remove Simulation */}
                    <td className="py-3.5 px-4 text-center">
                      {tx.isSimulated && onRemoveSimulatedTx ? (
                        <button
                          id={`btn-remove-sim-tx-${tx.id}`}
                          onClick={() => onRemoveSimulatedTx(tx.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-[11px] font-medium transition-all shadow-xs"
                          title="Remove this simulated transaction"
                        >
                          <RotateCcw className="w-3 h-3 text-rose-400" />
                          <span>Remove</span>
                        </button>
                      ) : (
                        <button
                          id={`btn-edit-tx-${tx.id}`}
                          onClick={() => handleOpenEdit(tx)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-300 border border-slate-700 hover:border-cyan-500 text-[11px] font-medium transition-all shadow-xs"
                          title="Re-categorize this transaction"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Re-categorize</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No transactions match your search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Re-categorize Modal */}
      <EditTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={editingTransaction}
        onSave={handleSaveTransaction}
        onRevertToAi={handleRevertTransaction}
      />
    </div>
  );
};

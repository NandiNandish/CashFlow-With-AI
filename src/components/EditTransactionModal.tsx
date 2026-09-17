import React, { useState, useEffect } from 'react';
import { 
  X, 
  Tag, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Calendar, 
  Check, 
  AlertCircle,
  Edit3
} from 'lucide-react';
import { Transaction } from '../types';
import { formatINR } from '../utils/financialCalculations';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onSave: (updatedTx: Transaction) => void;
  onRevertToAi?: (txId: string) => void;
}

const AVAILABLE_CATEGORIES = [
  'Food & Dining',
  'Shopping & Lifestyle',
  'Housing',
  'Utilities',
  'Transport & Fuel',
  'Entertainment',
  'Healthcare & Medical',
  'Income',
  'Other',
];

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onSave,
  onRevertToAi,
}) => {
  const [category, setCategory] = useState<string>('');
  const [subCategory, setSubCategory] = useState<string>('');
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    if (transaction) {
      setCategory(transaction.category);
      setSubCategory(transaction.aiCategory || transaction.category);
      setNote(transaction.isUserCorrected ? 'User adjusted classification' : '');
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const isIncome = transaction.type === 'income';

  const handleSave = () => {
    const isCategoryChanged = category !== (transaction.originalCategory || transaction.category) || !transaction.isUserCorrected;
    
    const updated: Transaction = {
      ...transaction,
      category,
      aiCategory: subCategory.trim() || category,
      isUserCorrected: true,
      originalCategory: transaction.originalCategory || transaction.category,
      correctedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    onSave(updated);
    onClose();
  };

  const handleRevert = () => {
    if (onRevertToAi && transaction.originalCategory) {
      onRevertToAi(transaction.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        id="edit-transaction-modal"
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Re-categorize Transaction
              </h2>
              <p className="text-xs text-slate-400">
                Override automatic NLP classification with user preference
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          {/* Transaction Summary Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <Calendar className="w-3.5 h-3.5" />
                <span>{transaction.date}</span>
                <span>•</span>
                <span className="font-mono">{transaction.rawDate}</span>
              </div>
              <div className="text-sm font-bold text-white">
                {transaction.description}
              </div>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-slate-400 text-[11px]">Original AI Tag:</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-medium">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  {transaction.originalCategory || transaction.aiCategory} ({Math.round(transaction.aiConfidence * 100)}%)
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className={`text-base font-bold font-mono ${isIncome ? 'text-emerald-400' : 'text-slate-100'}`}>
                {formatINR(transaction.amount, { signed: true })}
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {transaction.type}
              </span>
            </div>
          </div>

          {/* Category Selector Chips */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-200 block">
              Select Primary Category:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {AVAILABLE_CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-2 rounded-xl text-left font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500 shadow-sm shadow-cyan-950'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800'
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategory / Merchant Tag */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 block">
              Custom Subcategory / Tag:
            </label>
            <input
              type="text"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              placeholder="e.g. Work Reimbursement, Client Lunch, Grocery..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Note / Reason */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 block">
              Correction Note (Optional):
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Reclassified to separate personal vs household spend"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* User Corrected Badge Preview */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between text-[11px] text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Will display a <strong className="font-semibold underline">&lsquo;User-corrected&rsquo;</strong> badge in the transaction ledger.</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <div>
            {transaction.isUserCorrected && onRevertToAi && (
              <button
                type="button"
                onClick={handleRevert}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Revert to AI</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save &amp; Apply Badge</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

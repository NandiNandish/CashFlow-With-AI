import React, { useState } from 'react';
import { 
  Sliders, 
  Bell, 
  Mail, 
  AlertTriangle, 
  CheckCircle2, 
  Edit3, 
  Save, 
  X, 
  RotateCcw, 
  Send, 
  Eye, 
  Sparkles, 
  ShieldAlert, 
  Percent, 
  TrendingUp,
  Info
} from 'lucide-react';
import { CategorySpending, SpendingCap, WeeklyEmailSettings } from '../types';
import { formatINR } from '../utils/financialCalculations';

interface SpendingCapsSectionProps {
  categories: CategorySpending[];
  spendingCaps: SpendingCap[];
  onUpdateCap: (category: string, newCap: number, notifyAt80?: boolean) => void;
  onResetCaps: () => void;
  emailSettings: WeeklyEmailSettings;
  onUpdateEmailSettings: (settings: Partial<WeeklyEmailSettings>) => void;
  onSendTestEmail: () => void;
  onOpenEmailPreview: () => void;
}

export const SpendingCapsSection: React.FC<SpendingCapsSectionProps> = ({
  categories,
  spendingCaps,
  onUpdateCap,
  onResetCaps,
  emailSettings,
  onUpdateEmailSettings,
  onSendTestEmail,
  onOpenEmailPreview,
}) => {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [customCapInput, setCustomCapInput] = useState<string>('');
  const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>(emailSettings.email);
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);

  // Compute stats across categories
  const categoriesWithCaps = categories.map((cat) => {
    const capObj = spendingCaps.find((c) => c.category === cat.category);
    const monthlyCap = capObj ? capObj.monthlyCap : 10000;
    const isEnabled = capObj ? capObj.isEnabled : true;
    const notifyAt80 = capObj ? capObj.notifyAt80 : true;
    const percentUtilized = Math.round((cat.currentMonth / monthlyCap) * 100);
    const isOver80 = percentUtilized >= 80;
    const isOverCap = percentUtilized > 100;
    const remaining = monthlyCap - cat.currentMonth;

    return {
      ...cat,
      monthlyCap,
      isEnabled,
      notifyAt80,
      percentUtilized,
      isOver80,
      isOverCap,
      remaining,
    };
  });

  const categoriesOver80 = categoriesWithCaps.filter((c) => c.isOver80 && c.isEnabled);
  const totalCaps = categoriesWithCaps.reduce((acc, c) => acc + (c.isEnabled ? c.monthlyCap : 0), 0);
  const totalSpent = categoriesWithCaps.reduce((acc, c) => acc + (c.isEnabled ? c.currentMonth : 0), 0);
  const overallPercent = totalCaps > 0 ? Math.round((totalSpent / totalCaps) * 100) : 0;

  const handleStartEdit = (category: string, currentCap: number) => {
    setEditingCategory(category);
    setCustomCapInput(currentCap.toString());
  };

  const handleSaveEdit = (category: string) => {
    const parsed = parseFloat(customCapInput);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdateCap(category, Math.round(parsed));
    }
    setEditingCategory(null);
  };

  const handlePresetChange = (category: string, factor: number) => {
    const target = categoriesWithCaps.find((c) => c.category === category);
    if (target) {
      const newCap = Math.round(target.monthlyCap * factor);
      onUpdateCap(category, newCap);
    }
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      onUpdateEmailSettings({ email: emailInput.trim() });
      setIsEditingEmail(false);
    }
  };

  const handleSendEmailClick = () => {
    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      onSendTestEmail();
    }, 600);
  };

  return (
    <div id="spending-caps-section" className="space-y-6">
      {/* 1. TOP SUMMARY CARD */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                CUSTOM SPENDING CAPS &amp; NOTIFICATIONS
              </span>
              <span className="text-xs text-slate-400">80% In-App Threshold Engine</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Category Spending Caps &amp; Guardrails
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Define maximum monthly outflow limits for each spending bucket. When current spend exceeds <strong className="text-amber-400 font-semibold">80% of your custom cap</strong>, an in-app notification triggers automatically to protect your liquid reserves.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Outflow vs Cap</span>
              <span className="text-sm font-mono font-bold text-white">
                ₹{totalSpent.toLocaleString('en-IN')} <span className="text-slate-400 font-normal">/ ₹{totalCaps.toLocaleString('en-IN')}</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-mono block">({overallPercent}% utilized)</span>
            </div>

            <div className={`border rounded-xl px-3.5 py-2 ${
              categoriesOver80.length > 0
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            }`}>
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Threshold Triggers</span>
              </div>
              <div className="text-sm font-bold font-mono">
                {categoriesOver80.length} {categoriesOver80.length === 1 ? 'Category' : 'Categories'} &gt;80%
              </div>
              <span className="text-[10px] opacity-80 block">Active in-app notifications</span>
            </div>
          </div>
        </div>

        {/* 80% Warning Banner if any category crossed */}
        {categoriesOver80.length > 0 && (
          <div 
            id="caps-warning-callout"
            className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 to-slate-950 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-start sm:items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">
                  In-App Notification Active: {categoriesOver80.map(c => `${c.category} (${c.percentUtilized}%)`).join(', ')}
                </span>
                <span className="text-slate-400 text-[11px]">
                  Spending has surpassed 80% of your defined cap. Adjust caps below or apply AI savings suggestions.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                id="btn-caps-open-email-from-banner"
                onClick={onOpenEmailPreview}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>View Weekly Email Digest</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. CATEGORY SPENDING CAPS GRID / LIST */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Active Category Caps &amp; 80% Triggers
            </h3>
            <p className="text-xs text-slate-400">
              Set custom limits for each category. Click any cap amount to edit.
            </p>
          </div>

          <button
            id="btn-reset-caps-default"
            onClick={onResetCaps}
            className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            title="Reset caps to initial defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {categoriesWithCaps.map((cat) => {
            const isEditing = editingCategory === cat.category;
            const isOver80 = cat.isOver80;
            const isOverCap = cat.isOverCap;

            // Determine border and progress color
            const statusColor = isOverCap 
              ? 'rose' 
              : isOver80 
              ? 'amber' 
              : 'cyan';

            return (
              <div
                key={cat.category}
                id={`cap-card-${cat.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                className={`p-4 rounded-xl border transition-all space-y-3 ${
                  isOver80
                    ? 'bg-slate-950/90 border-amber-500/50 shadow-md shadow-amber-950/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header: Name, Spent, Cap */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: cat.color }} 
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        {cat.category}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        Past 30d spend: ₹{cat.currentMonth.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="text-right">
                    {isOverCap ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        <ShieldAlert className="w-3 h-3" />
                        Cap Breached ({cat.percentUtilized}%)
                      </span>
                    ) : isOver80 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                        <Bell className="w-3 h-3 text-amber-400" />
                        &gt;80% Cap Alert ({cat.percentUtilized}%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {cat.percentUtilized}% utilized
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar with 80% Marker */}
                <div className="space-y-1">
                  <div className="relative w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    {/* 80% Marker line */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-amber-400/80 z-10"
                      style={{ left: '80%' }}
                      title="80% in-app notification trigger threshold"
                    />

                    {/* Fill */}
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOverCap
                          ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600'
                          : isOver80
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                      }`}
                      style={{ width: `${Math.min(100, cat.percentUtilized)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Spent: <strong className="text-white font-mono">₹{cat.currentMonth.toLocaleString('en-IN')}</strong></span>
                    <span className="text-amber-400/90 font-mono text-[9px]">80% mark: ₹{Math.round(cat.monthlyCap * 0.8).toLocaleString('en-IN')}</span>
                    <span>Cap: <strong className="text-cyan-300 font-mono">₹{cat.monthlyCap.toLocaleString('en-IN')}</strong></span>
                  </div>
                </div>

                {/* Inline Cap Edit Mode or Display Controls */}
                {isEditing ? (
                  <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                    <span className="text-xs text-slate-400">New Cap ₹:</span>
                    <input
                      type="number"
                      step="500"
                      value={customCapInput}
                      onChange={(e) => setCustomCapInput(e.target.value)}
                      className="flex-1 bg-slate-900 border border-cyan-500 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-white focus:outline-none"
                      autoFocus
                    />
                    <button
                      id={`btn-save-cap-${cat.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      onClick={() => handleSaveEdit(cat.category)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2 text-xs">
                    {/* Remaining Headroom info */}
                    <div className="text-[11px]">
                      {cat.remaining >= 0 ? (
                        <span className="text-slate-400">
                          Remaining headroom: <strong className="text-emerald-400 font-mono">₹{cat.remaining.toLocaleString('en-IN')}</strong>
                        </span>
                      ) : (
                        <span className="text-rose-400 font-semibold">
                          Over budget by ₹{Math.abs(cat.remaining).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Edit Trigger & Quick Presets */}
                    <div className="flex items-center gap-1.5">
                      <button
                        id={`btn-edit-cap-${cat.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                        onClick={() => handleStartEdit(cat.category, cat.monthlyCap)}
                        className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3 h-3 text-cyan-400" />
                        <span>Edit Cap</span>
                      </button>

                      {/* Quick Adjust Button: +10% or -10% */}
                      <button
                        onClick={() => handlePresetChange(cat.category, 1.15)}
                        className="px-1.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 text-[10px] font-mono"
                        title="Increase cap by +15%"
                      >
                        +15%
                      </button>
                      <button
                        onClick={() => handlePresetChange(cat.category, 0.85)}
                        className="px-1.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 text-[10px] font-mono"
                        title="Tighten cap by -15%"
                      >
                        -15%
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. WEEKLY SPENDING MESSAGE IN EMAIL CARD */}
      <div 
        id="weekly-email-settings-card"
        className="bg-gradient-to-br from-slate-900/95 via-slate-900 to-slate-950 border border-cyan-800/40 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Weekly Spending Message in Email
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Active Subscription
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Receive an automated Monday morning email digest summarizing your weekly outflow, flagging any categories near or past the 80% cap.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-preview-weekly-email"
              onClick={onOpenEmailPreview}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Preview Email Message</span>
            </button>

            <button
              id="btn-trigger-test-weekly-email"
              onClick={handleSendEmailClick}
              disabled={isSendingEmail}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              {isSendingEmail ? (
                <span>Generating &amp; Sending...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Weekly Email Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Email Preferences and Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
          {/* Recipient Email */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Recipient Email Address:
            </span>
            {isEditingEmail ? (
              <form onSubmit={handleSaveEmail} className="flex items-center gap-2 pt-1">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 px-2 py-1 bg-slate-900 border border-cyan-500 rounded text-xs text-white font-mono focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-2 py-1 bg-cyan-500 text-slate-950 font-bold rounded text-xs"
                >
                  Save
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-cyan-300 truncate">
                  {emailSettings.email}
                </span>
                <button
                  id="btn-edit-email-address"
                  onClick={() => setIsEditingEmail(true)}
                  className="text-[10px] text-slate-400 hover:text-cyan-400 underline ml-2"
                >
                  Change
                </button>
              </div>
            )}
            <span className="text-[10px] text-slate-500 block">Verified primary user email</span>
          </div>

          {/* Delivery Schedule */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Delivery Schedule:
            </span>
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">
                Every {emailSettings.dayOfWeek} at {emailSettings.time} IST
              </span>
            </div>
            <div className="flex items-center gap-1.5 pt-0.5">
              {(['Monday', 'Friday', 'Sunday'] as const).map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => onUpdateEmailSettings({ dayOfWeek: day })}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    emailSettings.dayOfWeek === day
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Last Dispatched Status */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Last Dispatched Message:
            </span>
            <div className="text-white font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{emailSettings.lastSentAt || 'Just now'}</span>
            </div>
            <span className="text-[10px] text-slate-400 block">
              Includes {categoriesOver80.length} warning caps &amp; copilot guidance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

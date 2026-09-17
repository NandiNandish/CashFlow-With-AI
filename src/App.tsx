import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  HelpCircle, 
  Play, 
  Sliders, 
  ShieldAlert, 
  ArrowRight,
  TrendingDown,
  RotateCcw,
  CheckCircle2,
  Edit3
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { MetricCards } from './components/MetricCards';
import { StressAlertCard } from './components/StressAlertCard';
import { CashFlowForecastChart } from './components/CashFlowForecastChart';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { TransactionsTable } from './components/TransactionsTable';
import { SpendingAnalysis } from './components/SpendingAnalysis';
import { AiInsightsPage } from './components/AiInsightsPage';
import { FinancialJourney } from './components/FinancialJourney';
import { SmartRecommendations } from './components/SmartRecommendations';
import { DashboardView } from './components/DashboardView';
import { ExplainableAiModal } from './components/ExplainableAiModal';
import { ResponsibleAiModal } from './components/ResponsibleAiModal';
import { AuthPage } from './components/AuthPage';
import { NotificationsModal } from './components/NotificationsModal';
import { AiCopilotDrawer } from './components/AiCopilotDrawer';
import { WeeklySpendingEmailModal } from './components/WeeklySpendingEmailModal';

import { 
  INITIAL_USER_STATE, 
  INITIAL_STRESS_ALERT, 
  MOCK_TRANSACTIONS, 
  MOCK_CATEGORY_SPENDING, 
  MOCK_FINANCIAL_BRIEFS, 
  MOCK_SMART_RECOMMENDATIONS,
  INITIAL_SPENDING_CAPS,
  INITIAL_WEEKLY_EMAIL_SETTINGS,
  INITIAL_IN_APP_NOTIFICATIONS
} from './data/mockFinancialData';
import { Transaction, SpendingCap, WeeklyEmailSettings, InAppNotification } from './types';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [authMode, setAuthMode] = useState<'login' | 'logged_out'>('login');

  // Interactive Modals State
  const [isWhyModalOpen, setIsWhyModalOpen] = useState<boolean>(false);
  const [isResponsibleAiOpen, setIsResponsibleAiOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isWeeklyEmailModalOpen, setIsWeeklyEmailModalOpen] = useState<boolean>(false);

  // In-App Toast Alert State
  const [inAppToast, setInAppToast] = useState<{
    id: string;
    title: string;
    message: string;
    type: 'warning' | 'success' | 'info';
  } | null>(null);

  // Financial & Transactions State
  const [userState, setUserState] = useState(INITIAL_USER_STATE);
  const [stressAlert, setStressAlert] = useState(INITIAL_STRESS_ALERT);

  // Spending Caps & Email Settings State
  const [spendingCaps, setSpendingCaps] = useState<SpendingCap[]>(INITIAL_SPENDING_CAPS);
  const [emailSettings, setEmailSettings] = useState<WeeklyEmailSettings>(INITIAL_WEEKLY_EMAIL_SETTINGS);
  const [notifications, setNotifications] = useState<InAppNotification[]>(INITIAL_IN_APP_NOTIFICATIONS);

  // Calculate categories approaching or exceeding 80% cap
  const flaggedCaps = spendingCaps.filter((cap) => {
    const cat = MOCK_CATEGORY_SPENDING.find((c) => c.category === cap.category);
    if (!cat) return false;
    return (cat.currentMonth / cap.monthlyCap) >= 0.8;
  });
  const warningCapsCount = flaggedCaps.length;
  const flaggedCategoryNames = flaggedCaps.map((c) => c.category);

  // Helper to show in-app toast for 5 seconds
  const showToast = (title: string, message: string, type: 'warning' | 'success' | 'info' = 'info') => {
    const toastId = `toast-${Date.now()}`;
    setInAppToast({ id: toastId, title, message, type });
    setTimeout(() => {
      setInAppToast((prev) => (prev?.id === toastId ? null : prev));
    }, 5500);
  };

  // Handler to update or set custom spending cap for a category
  const handleUpdateCap = (category: string, newCap: number, notifyAt80 = true) => {
    setSpendingCaps((prev) =>
      prev.map((item) =>
        item.category === category
          ? { ...item, monthlyCap: newCap, notifyAt80 }
          : item
      )
    );

    // Calculate utilization with new cap
    const cat = MOCK_CATEGORY_SPENDING.find((c) => c.category === category);
    const spent = cat ? cat.currentMonth : 0;
    const ratio = newCap > 0 ? spent / newCap : 0;
    const percent = Math.round(ratio * 100);

    if (ratio >= 0.8 && notifyAt80) {
      // Trigger in-app notification & toast
      const newNotif: InAppNotification = {
        id: `cap-alert-${category.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        type: 'cap_exceeded',
        category,
        title: `Spending Cap Alert: ${category} at ${percent}%`,
        description: `Your spend of ₹${spent.toLocaleString('en-IN')} has crossed 80% of your ₹${newCap.toLocaleString('en-IN')} cap. Review transactions to avoid budget overrun.`,
        time: 'Just now',
        actionText: 'View Spending Guardrails',
        actionTargetTab: 'spending',
        createdAt: new Date().toISOString(),
      };

      setNotifications((prev) => [newNotif, ...prev.filter((n) => n.category !== category)]);
      showToast(
        `⚠️ In-App Alert: ${category} Cap Exceeded 80%!`,
        `Current spend ₹${spent.toLocaleString('en-IN')} has reached ${percent}% of your custom limit (₹${newCap.toLocaleString('en-IN')}).`,
        'warning'
      );
    } else {
      // Safe cap update
      showToast(
        `✓ Spending Cap Updated: ${category}`,
        `New limit set to ₹${newCap.toLocaleString('en-IN')} (${percent}% utilized - Safe zone).`,
        'success'
      );
    }
  };

  // Handler to reset caps to defaults
  const handleResetCaps = () => {
    setSpendingCaps(INITIAL_SPENDING_CAPS);
    showToast('Spending Caps Reset', 'All categories restored to standard baseline limits.', 'info');
  };

  // Handler for sending/simulating weekly email
  const handleSendWeeklyEmail = () => {
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    setEmailSettings((prev) => ({
      ...prev,
      lastSentAt: `Sent on ${formattedDate}`,
    }));

    // Add in-app notification
    const emailNotif: InAppNotification = {
      id: `email-digest-${Date.now()}`,
      type: 'email_sent',
      title: 'Weekly Spending Email Delivered',
      description: `Your weekly spending message and cap status report was delivered to ${emailSettings.email}.`,
      time: 'Just now',
      actionText: 'Preview Email Message',
      onAction: () => setIsWeeklyEmailModalOpen(true),
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => [emailNotif, ...prev]);
    showToast(
      '📧 Weekly Spending Message Delivered!',
      `Sent complete spending analysis & 80% cap breakdown to ${emailSettings.email}.`,
      'success'
    );
  };

  // Seed with one user-corrected transaction so judges can immediately observe the feature
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    return MOCK_TRANSACTIONS.map((tx, idx) => {
      if (idx === 3) {
        return {
          ...tx,
          isUserCorrected: true,
          originalCategory: 'Food & Dining',
          category: 'Food & Dining',
          aiCategory: 'Personal Dinner',
          correctedAt: '12 Sep 21:40',
        };
      }
      return tx;
    });
  });

  const correctedCount = transactions.filter((t) => t.isUserCorrected).length;

  // Handle re-categorizing a transaction
  const handleUpdateTransaction = (updatedTx: Transaction) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === updatedTx.id ? updatedTx : tx))
    );
  };

  // Quick reset demo function
  const handleResetDemo = () => {
    setUserState(INITIAL_USER_STATE);
    setStressAlert(INITIAL_STRESS_ALERT);
    setTransactions(MOCK_TRANSACTIONS);
    setActiveTab('dashboard');
  };

  // Login handler with persona/custom profile support
  const handleLogin = (customProfile?: { name: string; balance: number; income: number }) => {
    if (customProfile) {
      setUserState(prev => ({
        ...prev,
        name: customProfile.name,
        currentBalance: customProfile.balance,
        monthlyIncome: customProfile.income,
      }));
    }
    setIsLoggedIn(true);
    setAuthMode('login');
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthMode('logged_out');
  };

  if (!isLoggedIn) {
    return (
      <AuthPage 
        mode={authMode} 
        onLogin={handleLogin} 
        currentUser={userState} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* LEFT NAVIGATION SIDEBAR (Fixed on desktop, drawer on mobile) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userState={userState}
        onOpenResponsibleAi={() => setIsResponsibleAiOpen(true)}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onResetDemo={handleResetDemo}
        onLogout={handleLogout}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        correctedCount={correctedCount}
        warningCapsCount={warningCapsCount}
      />

      {/* MAIN VIEWPORT CONTAINER (Padded left for desktop sidebar) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Navbar */}
        <TopNav
          activeTab={activeTab}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenCopilot={() => setIsCopilotOpen(true)}
          onOpenResponsibleAi={() => setIsResponsibleAiOpen(true)}
          onLogout={handleLogout}
          unreadCount={notifications.length}
        />

        {/* Hero 60-Second Demo Judge Walkthrough Banner */}
        <aside 
          aria-label="Hackathon Quick Tour"
          className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border-b border-cyan-900/30 px-4 sm:px-6 py-2 text-xs"
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="font-semibold text-cyan-300">
                Judges&rsquo; Quick Tour:
              </span>
              <span className="text-slate-300 hidden md:inline">
                1. Inspect Dashboard &amp; 80% spending caps &rarr; 2. Test ₹2L loan in &ldquo;What If?&rdquo; &rarr; 3. Edit category caps &rarr; 4. Check weekly email message preview.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="btn-quick-tour-caps"
                onClick={() => setActiveTab('spending')}
                className="text-amber-300 hover:text-amber-200 font-semibold underline text-[11px]"
              >
                Spending Caps ({warningCapsCount} &gt;80%)
              </button>
              <span className="text-slate-600">•</span>
              <button
                id="btn-quick-tour-email"
                onClick={() => setIsWeeklyEmailModalOpen(true)}
                className="text-cyan-300 hover:text-cyan-200 font-semibold underline text-[11px]"
              >
                Weekly Email
              </button>
              <span className="text-slate-600">•</span>
              <button
                id="btn-quick-tour-what-if"
                onClick={() => setActiveTab('what-if')}
                className="text-cyan-400 hover:text-cyan-300 font-semibold underline text-[11px]"
              >
                What If?
              </button>
              <span className="text-slate-600">•</span>
              <button
                id="btn-quick-tour-recategorize"
                onClick={() => setActiveTab('transactions')}
                className="text-emerald-400 hover:text-emerald-300 font-semibold underline text-[11px]"
              >
                Re-categorize
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
          {/* DASHBOARD TAB (Central mission control with vitals, alerts, forecast & quick actions) */}
          {(activeTab === 'dashboard' || activeTab === 'overview') && (
            <DashboardView
              userState={userState}
              stressAlert={stressAlert}
              transactions={transactions}
              recommendations={MOCK_SMART_RECOMMENDATIONS}
              onOpenStressModal={() => setIsWhyModalOpen(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenCopilot={() => setIsCopilotOpen(true)}
              warningCapsCount={warningCapsCount}
              flaggedCategories={flaggedCategoryNames}
              onOpenEmailPreview={() => setIsWeeklyEmailModalOpen(true)}
            />
          )}

          {/* CASH FLOW PROJECTION TAB */}
          {activeTab === 'cashflow' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <MetricCards
                userState={userState}
                onOpenStressModal={() => setIsWhyModalOpen(true)}
              />
              <StressAlertCard
                alert={stressAlert}
                onOpenWhyModal={() => setIsWhyModalOpen(true)}
                onGoToWhatIf={() => setActiveTab('what-if')}
              />
              <CashFlowForecastChart
                currentBalance={userState.currentBalance}
                onOpenStressModal={() => setIsWhyModalOpen(true)}
              />
            </div>
          )}

          {/* WHAT IF SIMULATOR TAB */}
          {activeTab === 'what-if' && (
            <div className="animate-in fade-in duration-200">
              <WhatIfSimulator userState={userState} />
            </div>
          )}

          {/* TRANSACTIONS TAB (With Re-categorize feature and User-corrected badge) */}
          {activeTab === 'transactions' && (
            <div className="animate-in fade-in duration-200">
              <TransactionsTable 
                transactions={transactions} 
                onUpdateTransaction={handleUpdateTransaction}
              />
            </div>
          )}

          {/* SPENDING ANALYSIS & CAPS TAB */}
          {activeTab === 'spending' && (
            <div className="animate-in fade-in duration-200">
              <SpendingAnalysis 
                categories={MOCK_CATEGORY_SPENDING}
                spendingCaps={spendingCaps}
                onUpdateCap={handleUpdateCap}
                onResetCaps={handleResetCaps}
                emailSettings={emailSettings}
                onUpdateEmailSettings={(patch) => setEmailSettings((prev) => ({ ...prev, ...patch }))}
                onSendTestEmail={handleSendWeeklyEmail}
                onOpenEmailPreview={() => setIsWeeklyEmailModalOpen(true)}
              />
            </div>
          )}

          {/* FINANCIAL BRIEF / AI INSIGHTS TAB */}
          {activeTab === 'insights' && (
            <div className="animate-in fade-in duration-200">
              <AiInsightsPage
                insights={MOCK_FINANCIAL_BRIEFS}
                onActionClick={(item) => {
                  if (item.type === 'warning' || item.type === 'upcoming') {
                    setIsWhyModalOpen(true);
                  } else if (item.type === 'opportunity') {
                    setActiveTab('what-if');
                  } else {
                    setActiveTab('spending');
                  }
                }}
              />
            </div>
          )}

          {/* GUIDED FINANCIAL JOURNEY TAB */}
          {activeTab === 'journey' && (
            <div className="animate-in fade-in duration-200">
              <FinancialJourney
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenStressModal={() => setIsWhyModalOpen(true)}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900/90 bg-slate-950/80 py-6 px-6 text-xs text-slate-500 mt-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-400">Paytm CashFlow AI</span>
              <span>•</span>
              <span>Paytm Build for India AI Hackathon (Bengaluru Edition)</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <button
                onClick={() => setIsResponsibleAiOpen(true)}
                className="text-cyan-400 hover:underline"
              >
                Responsible AI Framework
              </button>
              <span>•</span>
              <span className="text-slate-400">Track 2: AI-Powered Financial Journeys</span>
              <span>•</span>
              <span className="text-slate-400">Demo Mode • Synthetic Data</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating "Ask CashFlow AI" Copilot Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="btn-floating-ask-ai"
          onClick={() => setIsCopilotOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-2xl shadow-cyan-500/40 hover:scale-105 transition-all cursor-pointer border border-cyan-300/40"
        >
          <div className="w-6 h-6 rounded-full bg-slate-950/20 flex items-center justify-center text-slate-950">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="tracking-tight">Ask CashFlow AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
      </div>

      {/* Modals & Drawers */}
      <ExplainableAiModal
        isOpen={isWhyModalOpen}
        onClose={() => setIsWhyModalOpen(false)}
        alert={stressAlert}
        userState={userState}
        onGoToWhatIf={() => setActiveTab('what-if')}
      />

      <ResponsibleAiModal
        isOpen={isResponsibleAiOpen}
        onClose={() => setIsResponsibleAiOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onOpenStressAlert={() => setIsWhyModalOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenEmailPreview={() => setIsWeeklyEmailModalOpen(true)}
        onDismissNotification={(id) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
        onClearAll={() => setNotifications([])}
      />

      <WeeklySpendingEmailModal
        isOpen={isWeeklyEmailModalOpen}
        onClose={() => setIsWeeklyEmailModalOpen(false)}
        categories={MOCK_CATEGORY_SPENDING}
        spendingCaps={spendingCaps}
        emailSettings={emailSettings}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      <AiCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        userState={userState}
      />

      {/* Floating Real-Time In-App Alert Toast */}
      {inAppToast && (
        <div 
          id="in-app-notification-toast"
          className="fixed top-5 right-5 z-50 max-w-sm w-full animate-in slide-in-from-top-3 duration-200"
        >
          <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-md flex items-start gap-3 ${
            inAppToast.type === 'warning'
              ? 'bg-amber-950/95 border-amber-500/60 text-amber-200 shadow-amber-950/40'
              : inAppToast.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500/60 text-emerald-200 shadow-emerald-950/40'
              : 'bg-slate-900/95 border-cyan-500/50 text-cyan-200 shadow-cyan-950/40'
          }`}>
            <div className="shrink-0 mt-0.5 text-base">
              {inAppToast.type === 'warning' ? '⚠️' : inAppToast.type === 'success' ? '✅' : 'ℹ️'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white leading-tight mb-0.5">
                {inAppToast.title}
              </h4>
              <p className="text-[11px] text-slate-300 leading-snug">
                {inAppToast.message}
              </p>
            </div>
            <button
              onClick={() => setInAppToast(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg shrink-0 transition-colors text-xs font-mono"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

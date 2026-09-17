import React from 'react';
import { 
  Bell, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  User, 
  TrendingUp,
  Cpu
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onResetDemo: () => void;
  onOpenResponsibleAi: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  aiEngine: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onResetDemo,
  onOpenResponsibleAi,
  onOpenNotifications,
  unreadCount,
  aiEngine,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'cashflow', label: 'Cash Flow' },
    { id: 'what-if', label: 'What If?', badge: 'Hero Demo' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'spending', label: 'Spending' },
    { id: 'insights', label: 'AI Insights' },
    { id: 'journey', label: 'Financial Journey' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Top Demo Banner */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border-b border-cyan-900/30 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              DEMO MODE
            </span>
            <span className="text-slate-400">
              Paytm Build for India AI Hackathon (Track 2: AI-Powered Financial Journeys)
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">Synthetic Indian financial dataset</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-cyan-400/90 font-medium">
              <Cpu className="w-3.5 h-3.5" />
              <span>Engine: {aiEngine}</span>
            </div>

            <button
              id="btn-reset-demo-header"
              onClick={onResetDemo}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 text-[11px]"
              title="Reset data to default canonical state for judges"
            >
              <RotateCcw className="w-3 h-3 text-cyan-400" />
              Reset Demo
            </button>

            <button
              id="btn-responsible-ai-header"
              onClick={onOpenResponsibleAi}
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Responsible AI
            </button>
          </div>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-btn"
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              {/* Paytm Styled Logo Mark */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00baf2] to-[#002970] p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center font-black text-white text-base tracking-tight">
                <span className="text-white">P</span>
                <span className="text-cyan-300 text-xs ml-0.5">AI</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                    Paytm CashFlow <span className="text-cyan-400 font-extrabold">AI</span>
                  </span>
                  <span className="hidden md:inline-flex text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-medium">
                    PROTOTYPE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 tracking-wide font-normal -mt-0.5">
                  Predict. Explain. Plan. • Your financial copilot
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.badge && (
                      <span className="px-1.5 py-0.2 text-[9px] font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              id="btn-notifications-trigger"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Demo User Info */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-medium text-xs border border-cyan-400/40 shadow-inner">
                PS
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-medium text-white flex items-center gap-1">
                  Priya Sharma
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
                <div className="text-[10px] text-slate-400">Tech Mahindra • ₹52k/mo</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-800/60">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-mobile-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

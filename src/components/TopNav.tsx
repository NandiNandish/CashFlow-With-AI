import React from 'react';
import { 
  Menu, 
  Bell, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  RotateCcw,
  Sliders,
  LogOut
} from 'lucide-react';
import { PaytmLogo } from './PaytmLogo';

interface TopNavProps {
  activeTab: string;
  onOpenMobileMenu: () => void;
  onOpenNotifications: () => void;
  onOpenCopilot: () => void;
  onOpenResponsibleAi: () => void;
  onLogout?: () => void;
  unreadCount?: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onOpenMobileMenu,
  onOpenNotifications,
  onOpenCopilot,
  onOpenResponsibleAi,
  onLogout,
  unreadCount = 3,
}) => {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
      case 'overview':
        return { title: 'Financial Dashboard', desc: 'Real-time liquidity buffer & predictive stress diagnostics' };
      case 'cashflow':
        return { title: 'Projected Cash Flow', desc: 'Forward 30-day liquidity simulation' };
      case 'what-if':
        return { title: 'What If? Simulator', desc: 'EMI impact & financial decision sandbox' };
      case 'transactions':
        return { title: 'Transactions Ledger', desc: 'Manual re-categorization & NLP classification' };
      case 'spending':
        return { title: 'Spending & Custom Caps', desc: 'Category budget caps, 80% threshold triggers & weekly email digest' };
      case 'insights':
        return { title: 'AI Insights Brief', desc: 'Transparent factor attribution & action briefs' };
      case 'journey':
        return { title: 'Guided Financial Journey', desc: 'Structured 4-step financial copilot roadmap' };
      default:
        return { title: 'Paytm CashFlow AI', desc: 'Predict. Explain. Plan.' };
    }
  };

  const current = getTabTitle(activeTab);

  return (
    <header className="sticky top-0 z-30 bg-[#070b16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Hamburger & Page Title */}
        <div className="flex items-center gap-3">
          <button
            id="btn-open-sidebar-mobile"
            onClick={onOpenMobileMenu}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden border border-slate-800"
            aria-label="Open Navigation Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
              {current.title}
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {current.desc}
            </p>
          </div>
        </div>

        {/* Right: Notifications, Demo Badge, and AI Copilot */}
        <div className="flex items-center gap-2.5">
          {/* Synthetic Demo Badge */}
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Demo Data
          </span>

          {/* Notifications Trigger */}
          <button
            id="btn-open-notifications-top"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            title="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-slate-950">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Ask AI Copilot Button */}
          <button
            id="btn-top-ask-copilot"
            onClick={onOpenCopilot}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-sm shadow-cyan-600/30 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Ask AI</span>
          </button>

          {/* Log Out Button */}
          {onLogout && (
            <button
              id="btn-top-logout"
              onClick={onLogout}
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-colors"
              title="Log out of Paytm CashFlow AI"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

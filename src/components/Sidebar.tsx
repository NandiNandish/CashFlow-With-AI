import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Sliders, 
  ReceiptText, 
  PieChart, 
  Sparkles, 
  Compass, 
  Bot, 
  RotateCcw, 
  ShieldCheck, 
  User, 
  Wallet,
  Activity,
  X,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { PaytmLogo } from './PaytmLogo';
import { UserFinancialState } from '../types';
import { formatINR } from '../utils/financialCalculations';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userState: UserFinancialState;
  onOpenResponsibleAi: () => void;
  onOpenCopilot: () => void;
  onResetDemo: () => void;
  onLogout?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  correctedCount?: number;
  warningCapsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userState,
  onOpenResponsibleAi,
  onOpenCopilot,
  onResetDemo,
  onLogout,
  isMobileOpen = false,
  onCloseMobile,
  correctedCount = 0,
  warningCapsCount = 0,
}) => {
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard className="w-4 h-4" />,
      description: 'Snapshot & key health score'
    },
    { 
      id: 'cashflow', 
      label: 'Cash Flow', 
      icon: <TrendingUp className="w-4 h-4" />,
      description: '30-day liquidity timeline'
    },
    { 
      id: 'what-if', 
      label: 'What If?', 
      icon: <Sliders className="w-4 h-4" />,
      badge: 'Hero Demo',
      description: 'EMI & loan trade-off sandbox'
    },
    { 
      id: 'transactions', 
      label: 'Transactions', 
      icon: <ReceiptText className="w-4 h-4" />,
      badge: correctedCount > 0 ? `${correctedCount} edited` : undefined,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      description: 'Ledger & re-categorization'
    },
    { 
      id: 'spending', 
      label: 'Spending & Caps', 
      icon: <PieChart className="w-4 h-4" />,
      badge: warningCapsCount > 0 ? `${warningCapsCount} near cap` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      description: 'Caps, alerts & weekly email'
    },
    { 
      id: 'insights', 
      label: 'AI Insights', 
      icon: <Sparkles className="w-4 h-4" />,
      description: 'Contextual factor briefs'
    },
    { 
      id: 'journey', 
      label: 'Financial Journey', 
      icon: <Compass className="w-4 h-4" />,
      description: 'Understand → Plan → Decide'
    },
  ];

  const handleSelect = (tabId: string) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-left-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-[#050811] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Section: Brand & Track Info */}
        <div>
          {/* Logo Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <button 
              onClick={() => handleSelect('dashboard')}
              className="text-left focus:outline-none group"
            >
              <PaytmLogo size="md" showTagline={true} />
            </button>

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Hackathon Track Tag */}
          <div className="px-5 py-2 bg-slate-950/80 border-b border-slate-800/60 flex items-center justify-between text-[10px]">
            <span className="text-cyan-400 font-semibold tracking-wider uppercase">
              Track 2: Financial Journeys
            </span>
            <span className="text-slate-400 font-mono">Bengaluru AI</span>
          </div>

          {/* Main Navigation Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-340px)]">
            <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </div>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600/25 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950/40'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                      {item.icon}
                    </div>
                    <div className="text-left">
                      <div className="leading-tight">{item.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal hidden xl:block">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span 
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border ${
                        item.badgeColor || (isActive 
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 animate-pulse' 
                          : 'bg-slate-800 text-slate-300 border-slate-700')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: User Profile & Actions */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-3">
          {/* Ask CashFlow AI Copilot Button */}
          <button
            id="btn-sidebar-ask-copilot"
            onClick={onOpenCopilot}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-between shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              <span>Ask CashFlow AI</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          {/* Synthetic Demo User Profile Pill */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300 text-xs font-bold">
                  PS
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">Priya Sharma</div>
                  <div className="text-[10px] text-slate-400">Demo Account</div>
                </div>
              </div>

              <span className="text-[10px] font-semibold font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Current Balance:</span>
              <span className="font-mono font-bold text-cyan-300">
                {formatINR(userState.currentBalance)}
              </span>
            </div>
          </div>

          {/* Quick Utility Links: Reset Demo & Responsible AI & Log Out */}
          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
            <button
              id="btn-sidebar-reset-demo"
              onClick={onResetDemo}
              className="inline-flex items-center gap-1 hover:text-cyan-300 transition-colors"
              title="Reset data to initial state"
            >
              <RotateCcw className="w-3 h-3 text-cyan-400" />
              <span>Reset</span>
            </button>

            <button
              id="btn-sidebar-responsible-ai"
              onClick={onOpenResponsibleAi}
              className="inline-flex items-center gap-1 hover:text-emerald-300 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Responsible AI</span>
            </button>

            {onLogout && (
              <button
                id="btn-sidebar-logout"
                onClick={onLogout}
                className="inline-flex items-center gap-1 hover:text-rose-400 text-slate-400 transition-colors"
                title="Log out of session"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

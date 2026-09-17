import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { FinancialBriefItem } from '../types';

interface AiInsightsPageProps {
  insights: FinancialBriefItem[];
  onActionClick: (insight: FinancialBriefItem) => void;
}

export const AiInsightsPage: React.FC<AiInsightsPageProps> = ({ insights, onActionClick }) => {
  const getBadgeStyle = (type: FinancialBriefItem['type']) => {
    switch (type) {
      case 'good':
        return {
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          cardBorder: 'border-emerald-500/30',
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          cardBorder: 'border-amber-500/30',
        };
      case 'upcoming':
        return {
          bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          icon: <Clock className="w-4 h-4 text-rose-400" />,
          cardBorder: 'border-rose-500/30',
        };
      case 'opportunity':
        return {
          bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          icon: <Zap className="w-4 h-4 text-cyan-400" />,
          cardBorder: 'border-cyan-500/30',
        };
    }
  };

  return (
    <div id="ai-insights-page" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                EXPLAINABLE BRIEFS
              </span>
              <span className="text-xs text-slate-400">Contextual Narrative Analysis</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Your Financial Brief
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Synthesized by Paytm CashFlow AI. Every observation links to evidence, impact analysis, and practical mitigations.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 4 Core Briefs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item) => {
          const style = getBadgeStyle(item.type);
          return (
            <div
              key={item.id}
              id={`insight-card-${item.id}`}
              className={`bg-slate-900/90 border ${style.cardBorder} rounded-2xl p-5 shadow-xl space-y-3.5 transition-all hover:scale-[1.01]`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${style.bg}`}>
                  {style.icon}
                  {item.tag}
                </span>

                {item.metric && (
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {item.metric}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-white leading-snug">
                &ldquo;{item.title}&rdquo;
              </h3>

              {/* 3 Pillars: Why, Impact, Suggested Action */}
              <div className="space-y-2 text-xs divide-y divide-slate-800/80">
                <div className="pt-2">
                  <span className="font-semibold text-slate-400 block mb-0.5">Why?</span>
                  <p className="text-slate-300 leading-relaxed">{item.why}</p>
                </div>

                <div className="pt-2">
                  <span className="font-semibold text-slate-400 block mb-0.5">Impact:</span>
                  <p className="text-slate-300 leading-relaxed">{item.impact}</p>
                </div>

                <div className="pt-2">
                  <span className="font-semibold text-cyan-400 block mb-0.5">Suggested Action:</span>
                  <p className="text-slate-200 font-medium leading-relaxed">{item.suggestedAction}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  id={`btn-act-${item.id}`}
                  onClick={() => onActionClick(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium transition-colors border border-slate-700"
                >
                  <span>Explore Mitigation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

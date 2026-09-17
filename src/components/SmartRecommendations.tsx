import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  TrendingUp, 
  CalendarClock, 
  Coffee 
} from 'lucide-react';
import { SmartRecommendation } from '../types';

interface SmartRecommendationsProps {
  recommendations: SmartRecommendation[];
  onAction: (targetTab?: string) => void;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  recommendations,
  onAction,
}) => {
  return (
    <div id="smart-recommendations-section" className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Smart Recommendations
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">
          User-controlled actions • No automated lock-in
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            id={`rec-card-${rec.id}`}
            className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 flex flex-col justify-between shadow-lg transition-all"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                  {rec.tag}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white leading-tight">
                {rec.title}
              </h4>

              <div className="space-y-2 text-xs divide-y divide-slate-800/80 pt-1">
                <div className="pt-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    WHY:
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                    {rec.why}
                  </p>
                </div>

                <div className="pt-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    IMPACT:
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                    {rec.impact}
                  </p>
                </div>

                <div className="pt-1.5">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                    OPTION:
                  </span>
                  <p className="text-slate-200 font-medium text-[11px] leading-relaxed mt-0.5">
                    {rec.option}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 mt-3 flex justify-end">
              <button
                id={`btn-rec-action-${rec.id}`}
                onClick={() => onAction(rec.actionTargetTab)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors"
              >
                <span>{rec.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

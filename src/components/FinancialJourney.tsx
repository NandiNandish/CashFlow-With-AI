import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  Layers, 
  Sliders, 
  FileCheck2,
  ShieldAlert
} from 'lucide-react';

interface FinancialJourneyProps {
  onNavigateTab: (tabId: string) => void;
  onOpenStressModal: () => void;
}

export const FinancialJourney: React.FC<FinancialJourneyProps> = ({
  onNavigateTab,
  onOpenStressModal,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  const steps = [
    {
      stepNumber: 1,
      title: 'Understand your cash flow',
      subtitle: 'Analyze current liquid balances, historical trends, and recurring salary/rent schedules.',
      actionLabel: 'Inspect Dashboard & Timeline',
      action: () => onNavigateTab('dashboard'),
      keyMetric: 'Current: ₹28,000 | Income: ₹52,000',
    },
    {
      stepNumber: 2,
      title: 'Identify upcoming pressure',
      subtitle: 'Review AI-flagged liquidity bottlenecks in Week 3 resulting from early-cycle rent & EMI obligations.',
      actionLabel: 'View "Why?" Diagnostic',
      action: () => onOpenStressModal(),
      keyMetric: 'Risk: MEDIUM | Day 23 Dip: ~₹4,500',
    },
    {
      stepNumber: 3,
      title: 'Compare financial scenarios',
      subtitle: 'Simulate loan affordability (e.g. ₹2 Lakh loan) with variable EMI tenures in the What-If sandbox.',
      actionLabel: 'Launch What If? Simulator',
      action: () => onNavigateTab('what-if'),
      keyMetric: 'Compare ₹4,500 vs ₹6,500 EMI',
    },
    {
      stepNumber: 4,
      title: 'Make an informed decision',
      subtitle: 'Receive clear trade-off analysis, protect emergency buffer thresholds, and execute sustainable planning.',
      actionLabel: 'Check AI Recommendations',
      action: () => onNavigateTab('insights'),
      keyMetric: 'Transparent Educational Guidance',
    },
  ];

  const toggleStep = (num: number) => {
    setCompletedSteps((prev) =>
      prev.includes(num) ? prev.filter((s) => s !== num) : [...prev, num]
    );
  };

  return (
    <div id="financial-journey-page" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                GUIDED ROADMAP
              </span>
              <span className="text-xs text-slate-400">Track 2 Hackathon Workflow</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Financial Journey: Understand &rarr; Plan &rarr; Compare &rarr; Decide
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Follow this structured sequence to experience the full AI copilot evaluation loop.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Progress:</span>
            <span className="text-cyan-400 font-bold font-mono">
              {completedSteps.length} / 4 Steps Completed
            </span>
          </div>
        </div>

        {/* Progress Visual Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${(completedSteps.length / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 4 Interactive Journey Steps */}
      <div className="space-y-3.5">
        {steps.map((step) => {
          const isDone = completedSteps.includes(step.stepNumber);
          return (
            <div
              key={step.stepNumber}
              id={`journey-step-${step.stepNumber}`}
              className={`rounded-2xl border p-5 transition-all ${
                isDone
                  ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                  : 'bg-slate-950/70 border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => toggleStep(step.stepNumber)}
                    className="mt-0.5 shrink-0 focus:outline-none"
                    title={isDone ? 'Mark uncompleted' : 'Mark completed'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-cyan-400 fill-cyan-950" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-600 hover:text-slate-400" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        STEP {step.stepNumber}
                      </span>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      {step.subtitle}
                    </p>
                    <div className="text-[11px] text-cyan-400 font-mono pt-0.5">
                      {step.keyMetric}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => {
                      if (!isDone) toggleStep(step.stepNumber);
                      step.action();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white border border-slate-700 hover:border-cyan-500 text-xs font-semibold transition-all shadow-sm"
                  >
                    <span>{step.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

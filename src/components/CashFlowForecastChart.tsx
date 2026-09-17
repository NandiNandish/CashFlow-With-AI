import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Sparkles,
  Info
} from 'lucide-react';
import { CashFlowPoint } from '../types';
import { formatINR, generateForecastTimeline } from '../utils/financialCalculations';

interface CashFlowForecastChartProps {
  currentBalance: number;
  additionalEmiDelta?: number;
  onOpenStressModal?: () => void;
}

export const CashFlowForecastChart: React.FC<CashFlowForecastChartProps> = ({
  currentBalance,
  additionalEmiDelta = 0,
  onOpenStressModal,
}) => {
  const [horizon, setHorizon] = useState<7 | 30 | 90>(30);

  const chartData = useMemo(() => {
    return generateForecastTimeline(currentBalance, additionalEmiDelta, horizon);
  }, [currentBalance, additionalEmiDelta, horizon]);

  // Key event highlights for timeline pills below the chart
  const keyEvents = [
    { day: 'Today', desc: 'Starting Balance', amount: currentBalance, type: 'baseline' },
    { day: 'Day 5', desc: 'Rent Due', amount: -12000, type: 'recurring' },
    { day: 'Day 12', desc: `EMI Due (${formatINR(6500 + additionalEmiDelta)})`, amount: -(6500 + additionalEmiDelta), type: 'emi' },
    { day: 'Day 18', desc: 'Discretionary Spending', amount: -5000, type: 'discretionary' },
    { day: 'Day 23', desc: '⚠️ Cash Flow Pressure Point', amount: -1800, type: 'risk' },
    { day: 'Day 30', desc: 'Salary Deposit (+₹52,000)', amount: 52000, type: 'income' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: CashFlowPoint = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1.5 backdrop-blur-md z-50">
          <div className="flex items-center justify-between gap-4 font-semibold text-white border-b border-slate-800 pb-1.5">
            <span>{data.dateStr}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${data.isForecast ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-slate-800 text-slate-300'}`}>
              {data.isForecast ? 'AI FORECAST' : 'RECORDED'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 text-slate-300">
            <span>Projected Balance:</span>
            <span className="font-mono font-bold text-cyan-300 text-sm">
              {formatINR(data.projectedBalance)}
            </span>
          </div>

          {data.eventDescription && (
            <div className="pt-1 border-t border-slate-800/80 text-[11px]">
              <div className="text-slate-400 font-medium">Event Marker:</div>
              <div className="text-amber-300 font-medium">{data.eventDescription}</div>
              {data.eventAmount && (
                <div className={`font-mono ${data.eventAmount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatINR(data.eventAmount, { signed: true })}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      id="cash-flow-forecast-container"
      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-6 shadow-xl shadow-slate-950/40"
    >
      {/* Header with Title and Horizon Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Projected Cash Flow
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              <Sparkles className="w-3 h-3" />
              AI Predictive Horizon
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Forward liquidity simulation mapping obligations, recurring debits, and timing sensitivity
          </p>
        </div>

        {/* 7 Days / 30 Days / 90 Days Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {([7, 30, 90] as const).map((days) => (
            <button
              key={days}
              id={`btn-horizon-${days}`}
              onClick={() => setHorizon(days)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                horizon === days
                  ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 15, left: -10, bottom: 5 }}
          >
            <defs>
              {/* Projected Balance Gradient */}
              <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00baf2" stopOpacity={0.35} />
                <stop offset="60%" stopColor="#0052cc" stopOpacity={0.10} />
                <stop offset="95%" stopColor="#0a0f1d" stopOpacity={0.0} />
              </linearGradient>
              {/* Historical Balance Gradient */}
              <linearGradient id="historicalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

            <XAxis
              dataKey="dateStr"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              interval={horizon === 90 ? 10 : horizon === 30 ? 4 : 0}
            />

            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => `₹${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`}
              domain={[0, 'auto']}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Vertical Marker: AI Forecast Point */}
            <ReferenceLine
              x="Today"
              stroke="#38bdf8"
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{
                value: 'AI Forecast ▶',
                position: 'insideTopRight',
                fill: '#38bdf8',
                fontSize: 11,
                fontWeight: 600,
              }}
            />

            {/* Warning Reference Line at Critical Liquidity Threshold (₹5,000) */}
            <ReferenceLine
              y={5000}
              stroke="#f59e0b"
              strokeDasharray="3 3"
              label={{
                value: 'Reserve Safety Floor (₹5,000)',
                position: 'insideBottomLeft',
                fill: '#f59e0b',
                fontSize: 10,
              }}
            />

            {/* Projected Area */}
            <Area
              type="monotone"
              dataKey="projectedBalance"
              stroke="#00baf2"
              strokeWidth={2.5}
              fill="url(#projectedGradient)"
              name="Projected Balance"
              activeDot={{ r: 5, fill: '#00baf2', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive Timeline Event Badges */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Forecast Timeline Milestones</span>
          <span className="text-[11px] text-cyan-400 font-normal">
            Click &ldquo;⚠️ Cash Flow Pressure Point&rdquo; for diagnostic
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {keyEvents.map((ev, i) => {
            const isRisk = ev.type === 'risk';
            return (
              <button
                key={i}
                id={`timeline-event-${i}`}
                onClick={() => {
                  if (isRisk && onOpenStressModal) {
                    onOpenStressModal();
                  }
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isRisk
                    ? 'bg-amber-500/10 border-amber-500/40 hover:bg-amber-500/20 cursor-pointer shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 cursor-default'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-0.5">
                  <span>{ev.day}</span>
                  {isRisk && <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <div className="text-xs font-medium text-slate-200 line-clamp-1">
                  {ev.desc}
                </div>
                <div className={`text-xs font-mono font-bold mt-1 ${
                  ev.amount > 0 ? 'text-emerald-400' : isRisk ? 'text-amber-400' : 'text-slate-300'
                }`}>
                  {formatINR(ev.amount, { signed: ev.amount !== currentBalance })}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

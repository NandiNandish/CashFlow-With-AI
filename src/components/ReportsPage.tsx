import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import {
  FileText,
  Download,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Shield,
  Home,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Clock,
  ExternalLink
} from 'lucide-react';
import {
  Transaction,
  Commitment,
  InsurancePolicy,
  UserFinancialState,
  ReportPeriod
} from '../types';
import { formatINR } from '../utils/financialCalculations';

interface ReportsPageProps {
  userState: UserFinancialState;
  transactions: Transaction[];
  commitments?: Commitment[];
  insurancePolicies?: InsurancePolicy[];
  simulatedTransactions?: Transaction[];
  spendingCaps?: any[];
}

export function ReportsPage({
  userState,
  transactions,
  commitments = [],
  insurancePolicies = [],
  simulatedTransactions = [],
  spendingCaps,
}: ReportsPageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('monthly');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  // Proportional breakdown data for Money Flow
  const incomeTotal = userState.monthlyIncome; // 52,000
  const moneyFlowNodes = [
    { label: 'House Rent', amount: 12000, icon: Home, color: '#3b82f6', percent: 23.1 },
    { label: 'Loan EMI', amount: 6500, icon: CreditCard, color: '#6366f1', percent: 12.5 },
    { label: 'Food & Dining', amount: 8250, icon: TrendingDown, color: '#f59e0b', percent: 15.9 },
    { label: 'Shopping & Lifestyle', amount: 5600, icon: Layers, color: '#ec4899', percent: 10.8 },
    { label: 'Transport & Fuel', amount: 3450, icon: TrendingDown, color: '#10b981', percent: 6.6 },
    { label: 'Insurance (Amortized)', amount: 1000, icon: Shield, color: '#a855f7', percent: 1.9 },
    { label: 'Remaining Buffer', amount: userState.projectedBuffer, icon: CheckCircle2, color: '#22d3ee', percent: 18.3, isBuffer: true },
  ];

  // PDF Generation Function
  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);

    try {
      // Step 1: Analyzing transactions
      setGenerationStep('Analyzing transactions & obligations...');
      await new Promise((r) => setTimeout(r, 400));

      // Step 2: Calculating cash flow
      setGenerationStep('Calculating forward cash-flow trajectory...');
      await new Promise((r) => setTimeout(r, 400));

      // Step 3: Preparing visualizations
      setGenerationStep('Formatting money-flow & spending matrices...');
      await new Promise((r) => setTimeout(r, 400));

      // Step 4: Generating AI summary
      setGenerationStep('Synthesizing Cognee Cloud AI financial brief...');
      let aiBrief = 'Net cash flow trajectory remains positive with ₹9,500 projected buffer. Front-loaded housing and loan EMI obligations concentrate 36% of outflow within the first 12 days, inducing moderate liquidity compression around Week 3 before month-end salary deposits arrive.';
      try {
        const res = await fetch('/api/ai/report-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            period: selectedPeriod,
            context: {
              currentBalance: userState.currentBalance,
              monthlyIncome: userState.monthlyIncome,
              monthlyExpenses: userState.monthlyExpenses,
              projectedBuffer: userState.projectedBuffer,
              simulatedCount: simulatedTransactions.length,
            },
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.summary) aiBrief = data.summary;
        }
      } catch (err) {
        console.warn('AI report brief fetch failed, using fallback summary:', err);
      }

      // Step 5: Creating PDF document
      setGenerationStep('Assembling PDF document...');
      await new Promise((r) => setTimeout(r, 300));

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Styling parameters
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;

      // Header Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 32, 'F');

      doc.setTextColor(34, 211, 238); // cyan-400
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('PAYTM CASHFLOW AI', margin, 12);

      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.setFont('helvetica', 'normal');
      doc.text('Predict. Explain. Plan. • Executive Financial Report', margin, 18);
      doc.text(`Period: ${selectedPeriod.toUpperCase()} | Generated: 18 Sep 2026 | User: Demo Account`, margin, 24);

      let y = 40;

      // 1. Financial Snapshot
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('1. Financial Snapshot', margin, y);
      y += 6;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`• Available Liquid Balance: Rs. ${userState.currentBalance.toLocaleString('en-IN')}`, margin + 4, y);
      doc.text(`• Monthly Inflows: Rs. ${userState.monthlyIncome.toLocaleString('en-IN')}`, margin + 70, y);
      y += 5;
      doc.text(`• Total Scheduled Outflows: Rs. ${userState.monthlyExpenses.toLocaleString('en-IN')}`, margin + 4, y);
      doc.text(`• Projected Month-End Buffer: Rs. ${userState.projectedBuffer.toLocaleString('en-IN')}`, margin + 70, y);
      y += 5;
      doc.text(`• Cash-Flow Health Score: 72/100 (Moderate Stability)`, margin + 4, y);
      y += 9;

      // 2. Money Flow Summary
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('2. Diagrammatic Money Flow (Where did money go?)', margin, y);
      y += 6;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Gross Income Rs. 52,000:', margin + 4, y);
      y += 5;
      doc.text('  ├── House Rent (Indiranagar): Rs. 12,000 (23.1%)', margin + 4, y);
      y += 4.5;
      doc.text('  ├── Personal Loan EMI: Rs. 6,500 (12.5%)', margin + 4, y);
      y += 4.5;
      doc.text('  ├── Food & Dining (Swiggy/Zomato): Rs. 8,250 (15.9%)', margin + 4, y);
      y += 4.5;
      doc.text('  ├── Shopping & Lifestyle (Amazon/Zara): Rs. 5,600 (10.8%)', margin + 4, y);
      y += 4.5;
      doc.text('  ├── Transport & Fuel: Rs. 3,450 (6.6%)', margin + 4, y);
      y += 4.5;
      doc.text('  ├── Health Insurance (Amortized): Rs. 1,000 (1.9%)', margin + 4, y);
      y += 4.5;
      doc.text(`  └── Projected Safe Buffer: Rs. ${userState.projectedBuffer.toLocaleString('en-IN')} (18.3%)`, margin + 4, y);
      y += 9;

      // 3. Commitment Summary
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('3. Scheduled Commitments Ledger', margin, y);
      y += 6;

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      commitments.forEach((c) => {
        doc.text(`• ${c.name} | Rs. ${c.amount.toLocaleString('en-IN')} | Due: ${c.dueDate} | Status: ${c.status}`, margin + 4, y);
        y += 4.5;
      });
      y += 5;

      // 4. Pressure Periods & Forecast
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('4. Cash-Flow Forecast & Identified Pressure Window', margin, y);
      y += 6;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('• Critical Window: Week 3 (approx. Days 21 to 24).', margin + 4, y);
      y += 4.5;
      doc.text('• Projected Lowest Cash Floor: Rs. 4,500 prior to month-end salary credit.', margin + 4, y);
      y += 4.5;
      doc.text('• Key Driver: 47% of monthly outflows exit before Day 12 while primary salary arrives at month end.', margin + 4, y);
      y += 8;

      // 5. AI Financial Brief
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('5. Cognee Cloud 3 / AI Executive Brief', margin, y);
      y += 6;

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      const splitText = doc.splitTextToSize(aiBrief.replace(/###/g, '').replace(/\*\*/g, ''), pageWidth - (margin * 2) - 4);
      doc.text(splitText, margin + 4, y);
      y += (splitText.length * 4.2) + 6;

      // 6. Simulation Summary (Separating Actual from Simulated)
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('6. Simulation Summary (Demo vs. Simulated Scenarios)', margin, y);
      y += 6;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      if (simulatedTransactions.length > 0) {
        doc.text(`[SIMULATED SCENARIO ACTIVE] Found ${simulatedTransactions.length} temporary simulated transaction(s):`, margin + 4, y);
        y += 4.5;
        simulatedTransactions.forEach((st) => {
          doc.text(`  - ${st.description}: ${st.amount < 0 ? '-' : '+'}Rs. ${Math.abs(st.amount).toLocaleString('en-IN')} (SIMULATION • NO REAL PAYMENT MADE)`, margin + 4, y);
          y += 4.5;
        });
      } else {
        doc.text('No active transaction simulations applied. Showing pristine baseline demo data.', margin + 4, y);
        y += 4.5;
      }

      // Footer Disclaimer
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, 280, pageWidth - margin, 280);

      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('CashFlow AI — Predict. Explain. Plan. • Paytm Build for India AI Hackathon Bengaluru Edition', margin, 285);
      doc.text('Prototype using synthetic/demo data. Forecasts are estimates and are not financial advice.', margin, 289);

      // Trigger Save
      doc.save(`Paytm_CashFlow_AI_Report_${selectedPeriod}.pdf`);
    } catch (error) {
      console.error('PDF Generation failed:', error);
    } finally {
      setIsGeneratingPdf(false);
      setGenerationStep('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Visual Financial Reports & PDF Export
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Deterministic Reporting
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Generate and export comprehensive cash-flow reports with money-flow diagrams and Cognee Cloud AI briefs
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleGeneratePdf}
          disabled={isGeneratingPdf}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 self-start sm:self-auto"
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-cyan-200" />
              <span>{generationStep || 'Generating PDF...'}</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-cyan-100" />
              <span>Generate PDF Report</span>
            </>
          )}
        </button>
      </div>

      {/* Period Filter Pills */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          Period:
        </span>
        {(['today', 'last10days', 'weekly', 'monthly'] as ReportPeriod[]).map((period) => {
          const labels: Record<ReportPeriod, string> = {
            today: 'Today',
            last10days: 'Last 10 Days',
            weekly: 'Weekly',
            monthly: 'Monthly',
          };
          const isActive = selectedPeriod === period;
          return (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {labels[period]}
            </button>
          );
        })}
      </div>

      {/* Diagrammatic Money-Flow Visualization */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Money-Flow Visualization (Where did my money go?)
            </h3>
            <p className="text-xs text-slate-400">
              Proportional distribution of your monthly income across mandatory commitments and buffer
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-500/30">
            Gross Income: {formatINR(incomeTotal)}
          </span>
        </div>

        {/* Visual Flow Tree / Diagram */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800/80 space-y-4 font-mono">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs">
              IN
            </div>
            <div>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {formatINR(incomeTotal)} MONTHLY INCOME
              </span>
              <span className="text-[11px] text-slate-400 block font-sans">
                Tech Mahindra Net Payroll Credit
              </span>
            </div>
          </div>

          {/* Connectors & Nodes */}
          <div className="pl-4 border-l-2 border-slate-800 space-y-3.5 ml-4">
            {moneyFlowNodes.map((node, index) => {
              const Icon = node.icon;
              const isLast = index === moneyFlowNodes.length - 1;

              return (
                <div key={node.label} className="relative flex items-center justify-between gap-4 group">
                  {/* Connector line */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-3 h-0.5 bg-slate-700" />
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${node.color}15`,
                        borderColor: `${node.color}40`,
                        color: node.color,
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-200 font-sans font-medium truncate">
                          {node.label}
                        </span>
                        <span className="font-mono font-bold text-white">
                          {formatINR(node.amount)}
                        </span>
                      </div>
                      {/* Proportional Bar */}
                      <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, node.percent * 3.5)}%`,
                            backgroundColor: node.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono shrink-0 w-12 text-right">
                    {node.percent}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Snapshot Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-slate-400 block font-medium">Available Balance</span>
          <span className="text-lg font-bold font-mono text-white mt-1 block">
            {formatINR(userState.currentBalance)}
          </span>
          <span className="text-[11px] text-cyan-400 mt-0.5 block">
            9 days until salary cycle
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-slate-400 block font-medium">Monthly Outflows</span>
          <span className="text-lg font-bold font-mono text-white mt-1 block">
            {formatINR(userState.monthlyExpenses)}
          </span>
          <span className="text-[11px] text-amber-400 mt-0.5 block">
            +18% Dining velocity surge
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-slate-400 block font-medium">Projected Buffer</span>
          <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">
            {formatINR(userState.projectedBuffer)}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            18.3% of gross income
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-slate-400 block font-medium">Cash-Flow Health</span>
          <span className="text-lg font-bold font-mono text-cyan-300 mt-1 block">
            72/100
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Moderate stability
          </span>
        </div>
      </div>

      {/* Cognee Cloud 3 AI Brief Preview */}
      <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Cognee Cloud 3 AI Financial Brief
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Included in generated PDF
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Your cash-flow health score (72/100) indicates a sustainable baseline, but highlights acute sensitivity to front-loaded obligations. With Rent (₹12,000) and EMI (₹6,500) hitting within the first 12 days, available cash dips to a seasonal floor of ~₹4,500 on Day 23. Smoothing variable dining delivery orders expands the safe runway comfortably until salary arrival on Day 30.
        </p>
      </div>

      {/* PDF Generation Progress Bar if Active */}
      {isGeneratingPdf && (
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-cyan-300 font-medium flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              {generationStep}
            </span>
            <span className="text-slate-400 font-mono text-[10px]">Processing</span>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}
    </div>
  );
}

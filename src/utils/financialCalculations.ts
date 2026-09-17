import { RiskLevel, ScenarioParams, ScenarioResult, CashFlowPoint } from '../types';

/**
 * Standard Equated Monthly Installment (EMI) Formula:
 * EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
 * where:
 * P = Principal loan amount
 * r = Monthly interest rate (Annual rate / 12 / 100)
 * n = Tenure in months
 */
export function calculateEmi(principal: number, annualRate: number, tenureMonths: number): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRate <= 0) return Math.round(principal / tenureMonths);

  const monthlyRate = annualRate / (12 * 100);
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths);
  const denominator = Math.pow(1 + monthlyRate, tenureMonths) - 1;

  if (denominator === 0) return Math.round(principal / tenureMonths);

  return Math.round(numerator / denominator);
}

/**
 * Format amounts into Indian Rupee strings with commas (Lakhs/Crores convention)
 */
export function formatINR(amount: number, options?: { hideSymbol?: boolean; signed?: boolean }): string {
  const isNegative = amount < 0;
  const absVal = Math.round(Math.abs(amount));
  
  // Indian formatting regex
  const str = absVal.toString();
  let lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  const symbol = options?.hideSymbol ? '' : '₹';
  if (options?.signed) {
    return isNegative ? `-${symbol}${formatted}` : `+${symbol}${formatted}`;
  }
  return isNegative ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
}

/**
 * Evaluate scenario metrics given baseline financial state
 */
export function evaluateScenario(
  params: ScenarioParams,
  baseline: {
    currentBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    existingEmi: number;
  }
): ScenarioResult {
  const emi = params.customEmi !== undefined && params.customEmi > 0
    ? params.customEmi
    : calculateEmi(params.loanAmount, params.interestRate, params.tenureMonths);

  const totalRepayment = emi * params.tenureMonths;
  const totalInterest = Math.max(0, totalRepayment - params.loanAmount);

  // New monthly expenses includes the incremental EMI if adding to existing, or replacing
  // In the demo, the scenario tests taking on this new EMI obligation
  const newMonthlyExpenses = baseline.monthlyExpenses + emi;
  const projectedMonthlyBuffer = baseline.monthlyIncome - newMonthlyExpenses;

  // Projected lowest balance (occurring before salary arrives, after rent & EMI)
  // Baseline lowest balance is around ₹4,500
  const bufferDelta = baseline.existingEmi > 0 ? (emi - baseline.existingEmi) : emi;
  const projectedLowestBalance = Math.max(0, 4500 - (bufferDelta * 0.45));

  let pressureLevel: RiskLevel = 'LOW';
  if (projectedMonthlyBuffer < 5000 || projectedLowestBalance < 3000) {
    pressureLevel = 'HIGH';
  } else if (projectedMonthlyBuffer < 8000 || projectedLowestBalance < 6000) {
    pressureLevel = 'MEDIUM';
  }

  let tradeOffAnalysis = '';
  if (emi >= 6500) {
    tradeOffAnalysis = `With the higher EMI of ${formatINR(emi)}/mo, your projected monthly buffer contracts to ${formatINR(projectedMonthlyBuffer)}. Your lowest cash balance dips near ${formatINR(projectedLowestBalance)} around Week 3 before your salary cycle resets. While serviceable on a ₹52,000 income, this leaves minimal cushion for unplanned emergencies.`;
  } else if (emi >= 4500) {
    tradeOffAnalysis = `At ${formatINR(emi)}/mo, your monthly buffer remains relatively sound at ${formatINR(projectedMonthlyBuffer)}. You maintain an estimated cash floor of ${formatINR(projectedLowestBalance)} during peak outflow weeks, offering a sustainable balance between loan amortization and liquidity.`;
  } else {
    tradeOffAnalysis = `At a modest ${formatINR(emi)}/mo, your projected buffer remains comfortable at ${formatINR(projectedMonthlyBuffer)}, preserving liquidity throughout the month with low cash-flow pressure.`;
  }

  return {
    monthlyEmi: emi,
    totalInterest,
    totalRepayment,
    projectedMonthlyBuffer,
    projectedLowestBalance,
    pressureLevel,
    tradeOffAnalysis,
  };
}

/**
 * Generate 30-day forecast points reflecting baseline and hypothetical loan changes
 */
export function generateForecastTimeline(
  baselineBalance: number,
  additionalEmiDelta: number = 0,
  horizonDays: 7 | 30 | 90 = 30
): CashFlowPoint[] {
  const points: CashFlowPoint[] = [];
  
  // Historical data (past 5 days)
  const historicalEvents: { day: number; desc: string; amount: number }[] = [
    { day: -4, desc: 'Utility Bill Paid', amount: -1400 },
    { day: -3, desc: 'Grocery Store (Zepto)', amount: -1850 },
    { day: -2, desc: 'Fuel (Shell)', amount: -1200 },
    { day: -1, desc: 'Dining (Swiggy)', amount: -850 },
  ];

  let currentHistorical = 33300;
  for (let d = -4; d <= 0; d++) {
    const ev = historicalEvents.find((e) => e.day === d);
    if (ev) {
      currentHistorical += ev.amount;
    }
    const date = new Date(2026, 8, 17 + d); // Sept 17, 2026 as reference
    const dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

    points.push({
      day: d,
      dateStr: d === 0 ? 'Today' : dateStr,
      historicalBalance: d === 0 ? baselineBalance : currentHistorical,
      projectedBalance: d === 0 ? baselineBalance : currentHistorical,
      eventDescription: d === 0 ? `Current Balance: ${formatINR(baselineBalance)}` : ev?.desc,
      eventAmount: ev?.amount,
      eventType: d === 0 ? 'income' : 'discretionary',
      isForecast: false,
    });
  }

  // Future projected days
  let runningBalance = baselineBalance;

  for (let d = 1; d <= horizonDays; d++) {
    const date = new Date(2026, 8, 17 + d);
    const dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

    let eventDesc: string | undefined;
    let eventAmt: number | undefined;
    let eventType: CashFlowPoint['eventType'];
    let isRiskPoint = false;

    // Day 5: Rent (-₹12,000)
    if (d === 5) {
      eventDesc = 'Rent Due';
      eventAmt = -12000;
      eventType = 'recurring';
      runningBalance += eventAmt;
    } 
    // Day 12: EMI (-₹6,500 + additionalEmiDelta)
    else if (d === 12) {
      const emiAmt = -(6500 + additionalEmiDelta);
      eventDesc = `EMI Payment: ${formatINR(Math.abs(emiAmt))}`;
      eventAmt = emiAmt;
      eventType = 'emi';
      runningBalance += eventAmt;
    } 
    // Day 18: Typical spending (-₹5,000 cumulative)
    else if (d === 18) {
      eventDesc = 'Discretionary & Lifestyle Spend';
      eventAmt = -5000;
      eventType = 'discretionary';
      runningBalance += eventAmt;
    }
    // Day 23: Week 3 Cash-flow pressure lowest point
    else if (d === 23) {
      eventDesc = '⚠️ Projected Cash Flow Pressure Point';
      eventAmt = -1800;
      eventType = 'risk';
      runningBalance += eventAmt;
      isRiskPoint = true;
    }
    // Day 30: Salary cycle arrives (+₹52,000)
    else if (d === 30) {
      eventDesc = 'Expected Salary Credit';
      eventAmt = 52000;
      eventType = 'income';
      runningBalance += eventAmt;
    }
    // Minor daily burn rate
    else {
      const dailySpend = Math.round(200 + (Math.sin(d) * 80));
      runningBalance -= dailySpend;
    }

    // Boundary check
    const floorBal = Math.max(800, runningBalance);

    points.push({
      day: d,
      dateStr,
      projectedBalance: floorBal,
      eventDescription: eventDesc,
      eventAmount: eventAmt,
      eventType,
      isForecast: true,
      isRiskPoint,
    });
  }

  return points;
}

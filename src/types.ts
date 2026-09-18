export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Transaction {
  id: string;
  date: string;
  rawDate: string;
  description: string;
  merchant?: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  status?: 'COMPLETED' | 'PENDING' | 'SIMULATED';
  aiCategory: string;
  aiConfidence: number; // e.g. 0.96
  merchantIcon?: string;
  isRecurring?: boolean;
  isUserCorrected?: boolean;
  originalCategory?: string;
  correctedAt?: string;
  isSimulated?: boolean;
}

export interface CashFlowPoint {
  day: number;
  dateStr: string;
  historicalBalance?: number;
  projectedBalance: number;
  scenarioBalance?: number;
  eventDescription?: string;
  eventAmount?: number;
  eventType?: 'income' | 'recurring' | 'discretionary' | 'emi' | 'insurance' | 'risk' | 'simulation';
  isForecast: boolean;
  isRiskPoint?: boolean;
  isScenarioRiskPoint?: boolean;
}

export interface Commitment {
  id: string;
  name: string;
  category: string;
  amount: number;
  frequency: 'Monthly' | 'Quarterly' | 'Half-yearly' | 'Annual';
  dueDate: string; // e.g. '5 Sep' or 'Day 5'
  dueDayNumber: number; // 5, 12, 20, 25
  status: 'PAID' | 'UPCOMING' | 'DUE SOON' | 'SIMULATED';
  projectedImpact: string;
  isInsurance?: boolean;
  policyType?: 'Health' | 'Life' | 'Vehicle' | 'Other';
}

export interface InsurancePolicy {
  id: string;
  providerLabel: string;
  type: 'Health' | 'Life' | 'Vehicle' | 'Other';
  premium: number;
  frequency: 'Monthly' | 'Quarterly' | 'Half-yearly' | 'Annual';
  nextPaymentDate: string; // e.g. '25 Sep'
  dueDayNumber: number;
  policyLabel?: string;
  projectedBufferBefore: number;
  projectedBufferAfter: number;
  neutralExplanation: string;
}

export interface Loan {
  id: string;
  name: string;
  principal: number;
  interestRate: number;
  tenure: number; // months
  emi: number;
  startDate: string;
}

export interface ScenarioParams {
  loanAmount: number;
  interestRate: number; // annual percentage e.g. 11.5
  tenureMonths: number;
  customEmi?: number;
}

export interface ScenarioResult {
  monthlyEmi: number;
  totalInterest: number;
  totalRepayment: number;
  projectedMonthlyBuffer: number;
  projectedLowestBalance: number;
  pressureLevel: RiskLevel;
  tradeOffAnalysis: string;
}

export interface ScenarioImpact {
  currentBalance: number;
  scenarioBalance: number;
  projectedBufferCurrent: number;
  projectedBufferScenario: number;
  lowestBalanceCurrent: number;
  lowestBalanceScenario: number;
  pressurePeriod: string;
  riskLevel: RiskLevel;
  explanation: string;
  deltaBalance: number;
  deltaBuffer: number;
  pressureChangeDescription: string;
}

export interface Scenario {
  id: string;
  type: 'transaction' | 'loan' | 'insurance' | 'income' | 'spending_change';
  amount: number;
  category?: string;
  title: string;
  description: string;
  createdAt: string;
  impact: ScenarioImpact;
}

export interface FinancialHealthFactor {
  label: string;
  score: number;
  maxScore: number;
  status: 'good' | 'warning' | 'critical';
  metricValue: string;
  explanation: string;
}

export interface FinancialHealth {
  overallScore: number;
  status: 'MODERATE' | 'HEALTHY' | 'STRESSED';
  factors: FinancialHealthFactor[];
  summary: string;
}

export interface StressAlert {
  title: string;
  summary: string;
  period: string;
  riskLevel: RiskLevel;
  confidence: string;
  reasons: string[];
  impacts: {
    label: string;
    amount: number;
    type: 'income' | 'expense';
  }[];
  explanationNotes: string;
}

export interface CategorySpending {
  category: string;
  currentMonth: number;
  previousMonth: number;
  percentageChange: number; // e.g. +18
  color: string;
}

export interface SpendingCap {
  category: string;
  monthlyCap: number;
  isEnabled: boolean;
  notifyAt80: boolean;
}

export interface WeeklyEmailSettings {
  isEnabled: boolean;
  email: string;
  dayOfWeek: 'Monday' | 'Friday' | 'Sunday';
  time: string;
  lastSentAt?: string;
  includeCapWarnings: boolean;
  includeAiRunwayTip: boolean;
}

export interface InAppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'warning' | 'info' | 'schedule' | 'cap_exceeded' | 'email_sent';
  category?: string;
  actionText?: string;
  actionTargetTab?: string;
  isRead?: boolean;
  thresholdPercent?: number;
  createdAt?: string;
  onAction?: () => void;
}

export interface FinancialBriefItem {
  id: string;
  type: 'good' | 'warning' | 'upcoming' | 'opportunity';
  tag: string;
  title: string;
  why: string;
  impact: string;
  suggestedAction: string;
  metric?: string;
}

export interface SmartRecommendation {
  id: string;
  title: string;
  tag: string;
  why: string;
  impact: string;
  option: string;
  actionText: string;
  actionTargetTab?: string;
}

export interface UserFinancialState {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  projectedBuffer: number;
  financialHealthScore: number;
  salaryDay: number;
  rentAmount: number;
  rentDay: number;
  emiAmount: number;
  emiDay: number;
  typicalSpending: number;
  name?: string;
}

export type ReportPeriod = 'today' | 'last10days' | 'weekly' | 'monthly';

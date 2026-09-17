export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Transaction {
  id: string;
  date: string;
  rawDate: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  aiCategory: string;
  aiConfidence: number; // e.g. 0.96
  merchantIcon?: string;
  isRecurring?: boolean;
  isUserCorrected?: boolean;
  originalCategory?: string;
  correctedAt?: string;
}

export interface CashFlowPoint {
  day: number;
  dateStr: string;
  historicalBalance?: number;
  projectedBalance: number;
  eventDescription?: string;
  eventAmount?: number;
  eventType?: 'income' | 'recurring' | 'discretionary' | 'emi' | 'risk';
  isForecast: boolean;
  isRiskPoint?: boolean;
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
}

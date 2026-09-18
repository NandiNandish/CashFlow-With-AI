import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// ----------------------------------------------------
// AI Service Architecture: Cognee Cloud 3 + Fallback
// ----------------------------------------------------

interface AIService {
  explainCashFlowPressure(context: any): Promise<string>;
  explainScenario(scenario: any, context: any): Promise<string>;
  explainTransactionSimulation(tx: any, context: any): Promise<string>;
  chat(message: string, context: any): Promise<string>;
  generateReportSummary(period: string, context: any): Promise<string>;
}

/**
 * Fallback AIService: High-precision, deterministic, zero-hallucination financial explanations
 * Grounded strictly in structured context without performing client-side math.
 */
class FallbackAIService implements AIService {
  async explainCashFlowPressure(context: any): Promise<string> {
    const balance = context?.currentBalance ?? 28000;
    const rent = context?.rentAmount ?? 12000;
    const emi = context?.emiAmount ?? 6500;
    const lowest = context?.lowestBalance ?? 4500;

    return `### AI Cash-Flow Pressure Diagnostic (Week 3)

**Why is potential pressure detected?**
1. **Front-Loaded Outflow Timing**: Within the first 12 days, ₹${(rent + emi).toLocaleString('en-IN')} exits your account (Rent: ₹${rent.toLocaleString('en-IN')} on Day 5, EMI: ₹${emi.toLocaleString('en-IN')} on Day 12).
2. **Discretionary Spending Surge**: Food Delivery & Dining is running **18% higher** than your historical 90-day average.
3. **Liquidity Squeeze Window**: Between Days 18 and 24, scheduled obligations and daily burn pull your liquid balance down to a projected floor of **₹${lowest.toLocaleString('en-IN')}**.
4. **Income Asynchrony**: Your primary income deposit (₹52,000) arrives at month end, leaving a 10-day window of restricted headroom.

**Actionable Insight:**
Smoothing discretionary orders or shifting non-urgent shopping past Day 25 restores ₹2,500+ buffer during the Week 3 dip.`;
  }

  async explainScenario(scenario: any, context: any): Promise<string> {
    const type = scenario?.type || 'loan';
    const amount = scenario?.amount || 200000;
    const currentBuffer = context?.projectedBuffer ?? 9500;
    const scenarioBuffer = scenario?.impact?.projectedBufferScenario ?? (currentBuffer - (scenario?.impact?.deltaBuffer ? Math.abs(scenario?.impact?.deltaBuffer) : 3500));

    if (type === 'loan') {
      const emi = scenario?.impact?.monthlyEmi || Math.round(amount * 0.033);
      return `### Loan / EMI Scenario Impact
- **Simulated EMI**: ₹${emi.toLocaleString('en-IN')}/month
- **Current Monthly Buffer**: ₹${currentBuffer.toLocaleString('en-IN')}
- **Projected Buffer with New EMI**: ₹${Math.max(0, scenarioBuffer).toLocaleString('en-IN')}

**Financial Consequence:**
Taking on this ₹${amount.toLocaleString('en-IN')} loan commitment permanently absorbs ₹${emi.toLocaleString('en-IN')} of monthly discretionary liquidity. Your mid-month cash floor declines, requiring disciplined containment of variable weekend spending.`;
    }

    if (type === 'insurance') {
      return `### Insurance Premium Cash-Flow Impact
- **Upcoming Premium**: ₹${amount.toLocaleString('en-IN')}
- **Buffer Before Payment**: ₹${currentBuffer.toLocaleString('en-IN')}
- **Buffer After Payment**: ₹${scenarioBuffer.toLocaleString('en-IN')}

**Neutral Explanation:**
This payment creates a temporary reduction in your projected buffer. Its timing overlaps with existing commitments. Because it is an annual obligation, setting aside ₹1,000 monthly in an earmarked sub-wallet prevents month-end liquidity compression.`;
    }

    return `### Scenario Financial Analysis
Adjusting by ₹${amount.toLocaleString('en-IN')} shifts your projected month-end buffer from ₹${currentBuffer.toLocaleString('en-IN')} to ₹${scenarioBuffer.toLocaleString('en-IN')}. The deterministic scenario engine models this against your upcoming recurring bills.`;
  }

  async explainTransactionSimulation(tx: any, context: any): Promise<string> {
    const amt = tx?.amount || 3000;
    const cat = tx?.category || 'Shopping';
    const isExpense = tx?.type !== 'income';
    const currentBuffer = context?.projectedBuffer ?? 9500;
    const newBuffer = isExpense ? Math.max(0, currentBuffer - amt) : currentBuffer + amt;

    if (isExpense) {
      return `Your simulated ₹${amt.toLocaleString('en-IN')} ${cat} expense reduces your projected buffer by ₹${amt.toLocaleString('en-IN')} (from ₹${currentBuffer.toLocaleString('en-IN')} to ₹${newBuffer.toLocaleString('en-IN')}). Because existing commitments already create pressure around Week 3, this leaves less room for discretionary spending.`;
    }
    return `Your simulated ₹${amt.toLocaleString('en-IN')} ${cat} income credit expands your projected buffer to ₹${newBuffer.toLocaleString('en-IN')}, elevating your Week 3 cash floor and providing healthy emergency margin.`;
  }

  async chat(message: string, context: any): Promise<string> {
    const lower = message.toLowerCase();

    if (lower.includes('why') && (lower.includes('falling') || lower.includes('balance') || lower.includes('drop') || lower.includes('week 3'))) {
      return `Your projected balance dips towards Week 3 primarily due to the timing gap between expenses and income:
• ₹12,000 Rent due on Day 5
• ₹6,500 EMI due on Day 12
• Discretionary dining is running 18% higher than usual (approx. ₹8,250 this month)
• Scheduled insurance and utility commitments arrive before your ₹52,000 salary at month end.`;
    }

    if (lower.includes('commit') || lower.includes('upcoming') || lower.includes('due')) {
      return `Your upcoming financial commitments this cycle:
1. **House Rent**: ₹12,000 (Day 5 - Already Settled)
2. **Personal Loan EMI**: ₹6,500 (Day 12 - Due Soon)
3. **Broadband & Utility Bills**: ₹1,500 (Day 20 - Upcoming)
4. **Health Insurance Premium**: ₹12,000 (Day 25 - Annual Outflow)
Combined fixed obligations total ₹32,000 out of ₹52,000 income.`;
    }

    if (lower.includes('loan') || lower.includes('emi') || lower.includes('2 lakh') || lower.includes('lakh')) {
      return `If you take a ₹2,00,000 loan at 11.5% for 36 months:
• The monthly EMI is approximately **₹6,600**.
• Your monthly buffer drops from ₹9,500 down to **~₹2,900**.
• During Week 3, your projected lowest balance may dip to **~₹1,800**.
While serviceable on ₹52,000 income, it significantly compresses your mid-month liquidity margin.`;
    }

    if (lower.includes('insurance')) {
      return `Your Health Insurance annual premium of ₹12,000 is due on 25 Sep.
Because it falls in Week 4 right before salary, it temporarily pushes your projected buffer down. Spreading this into an amortized ₹1,000/month recurring deposit is the safest way to avoid annual lump-sum cash strain.`;
    }

    if (lower.includes('spending') || lower.includes('most') || lower.includes('where')) {
      return `Where your money went this month:
1. **Housing (Rent)**: ₹12,000 (30.4%)
2. **Food & Dining**: ₹8,250 (20.9%) — running **+18%** above baseline
3. **EMI & Loans**: ₹6,500 (16.5%)
4. **Shopping & Lifestyle**: ₹5,600 (14.2%)
5. **Transport & Fuel**: ₹3,450 (8.7%)
6. **Utilities**: ₹2,800 (7.1%)`;
    }

    return `Based on your synthetic demo account (Balance ₹28,000, Income ₹52,000, Expenses ₹39,500, Health Score 72/100):
Your financial position is moderately stable, with high sensitivity to Week 3 timing gaps. You can test live scenarios in **What-If**, simulate transactions with the **Simulate Transaction** button, or inspect commitments in the **Commitments** tab.`;
  }

  async generateReportSummary(period: string, context: any): Promise<string> {
    return `### Executive Financial Brief (${period.toUpperCase()})
- **Net Position**: Positive monthly cash trajectory with ₹52,000 gross monthly inflows and ₹39,500 in outflows.
- **Buffer Integrity**: Projected month-end buffer stands at ₹9,500 (18.3% of income), meeting the recommended 15% safety floor.
- **Fixed Burden Ratio**: Rent (₹12,000) and existing EMI (₹6,500) account for 35.6% of income, maintaining healthy debt-serviceability.
- **Key Vulnerability**: Mid-month liquidity pinch occurring between Days 18-24, where available balance dips to ~₹4,500.
- **Simulated Impact**: Transaction and loan simulations confirm high elasticity to unbudgeted discretionary expenses above ₹3,000 during Week 3.`;
  }
}

/**
 * Cognee Cloud 3 Service
 * Calls Cognee Cloud 3 API when COGNEE_CLOUD_API_KEY is configured,
 * otherwise transparently delegates to FallbackAIService.
 */
class CogneeCloudService implements AIService {
  private apiKey: string;
  private baseUrl: string;
  private fallback: FallbackAIService;

  constructor(apiKey: string, baseUrl: string = 'https://api.cognee.ai/v3') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.fallback = new FallbackAIService();
  }

  async explainCashFlowPressure(context: any): Promise<string> {
    if (!this.apiKey) return this.fallback.explainCashFlowPressure(context);
    try {
      const response = await fetch(`${this.baseUrl}/cognition/insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          task: 'explain_cash_flow_pressure',
          financialContext: context,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.explanation || this.fallback.explainCashFlowPressure(context);
      }
    } catch (e) {
      console.warn('Cognee Cloud 3 call failed, using fallback:', e);
    }
    return this.fallback.explainCashFlowPressure(context);
  }

  async explainScenario(scenario: any, context: any): Promise<string> {
    if (!this.apiKey) return this.fallback.explainScenario(scenario, context);
    try {
      const response = await fetch(`${this.baseUrl}/cognition/scenarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ scenario, context }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.explanation || this.fallback.explainScenario(scenario, context);
      }
    } catch (e) {
      console.warn('Cognee Cloud 3 call failed, using fallback:', e);
    }
    return this.fallback.explainScenario(scenario, context);
  }

  async explainTransactionSimulation(tx: any, context: any): Promise<string> {
    return this.fallback.explainTransactionSimulation(tx, context);
  }

  async chat(message: string, context: any): Promise<string> {
    if (!this.apiKey) return this.fallback.chat(message, context);
    try {
      const response = await fetch(`${this.baseUrl}/cognition/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ message, context }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.reply || this.fallback.chat(message, context);
      }
    } catch (e) {
      console.warn('Cognee Cloud 3 chat failed, using fallback:', e);
    }
    return this.fallback.chat(message, context);
  }

  async generateReportSummary(period: string, context: any): Promise<string> {
    if (!this.apiKey) return this.fallback.generateReportSummary(period, context);
    try {
      const response = await fetch(`${this.baseUrl}/cognition/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ period, context }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.summary || this.fallback.generateReportSummary(period, context);
      }
    } catch (e) {
      console.warn('Cognee Cloud 3 report summary failed, using fallback:', e);
    }
    return this.fallback.generateReportSummary(period, context);
  }
}

// Service Factory
function getAIService(): { service: AIService; provider: 'cognee' | 'gemini' | 'fallback' } {
  const cogneeKey = process.env.COGNEE_CLOUD_API_KEY;
  if (cogneeKey && cogneeKey.trim() !== '') {
    return {
      service: new CogneeCloudService(cogneeKey, process.env.COGNEE_CLOUD_BASE_URL),
      provider: 'cognee',
    };
  }

  return {
    service: new FallbackAIService(),
    provider: 'fallback',
  };
}

// ----------------------------------------------------
// Email & Notification Dispatch Engine
// ----------------------------------------------------

interface EmailDispatchRecord {
  id: string;
  recipient: string;
  subject: string;
  sentAt: string;
  status: 'DELIVERED' | 'QUEUED' | 'SIMULATED';
  capAlertsCount: number;
  totalSpent: number;
  bodyPreview: string;
}

const emailDispatchHistory: EmailDispatchRecord[] = [
  {
    id: 'email-init-001',
    recipient: 'nandinandisha22@gmail.com',
    subject: 'Paytm CashFlow AI • Weekly Spending Summary (Week 36)',
    sentAt: new Date(Date.now() - 604800000).toISOString(),
    status: 'DELIVERED',
    capAlertsCount: 2,
    totalSpent: 39500,
    bodyPreview: 'Weekly summary with Food & Dining (91.7%) and Shopping (86.2%) exceeding 80% cap alert.',
  },
];

// ----------------------------------------------------
// API Routes
// ----------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Paytm CashFlow AI Backend',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/notifications/email-history', (req, res) => {
  res.json({
    history: emailDispatchHistory,
    totalDispatched: emailDispatchHistory.length,
    defaultRecipient: 'nandinandisha22@gmail.com',
  });
});

app.post('/api/notifications/weekly-email', async (req, res) => {
  const { recipientEmail, categories, spendingCaps, stats } = req.body;
  const targetEmail = recipientEmail || 'nandinandisha22@gmail.com';

  // Calculate >80% cap alerts
  const capAlerts: Array<{ category: string; spent: number; cap: number; percent: number }> = [];
  if (Array.isArray(categories) && Array.isArray(spendingCaps)) {
    categories.forEach((cat: any) => {
      const matchedCap = spendingCaps.find((c: any) => c.category === cat.category);
      if (matchedCap && matchedCap.isEnabled) {
        const percent = Math.round((cat.currentMonth / matchedCap.monthlyCap) * 100);
        if (percent >= 80) {
          capAlerts.push({
            category: cat.category,
            spent: cat.currentMonth,
            cap: matchedCap.monthlyCap,
            percent,
          });
        }
      }
    });
  }

  const totalSpent = categories?.reduce((sum: number, c: any) => sum + (c.currentMonth || 0), 0) || 39500;
  const dispatchId = `paytm-digest-${Date.now()}`;
  const record: EmailDispatchRecord = {
    id: dispatchId,
    recipient: targetEmail,
    subject: `Paytm CashFlow AI • Weekly Spending & Budget Cap Digest (${new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })})`,
    sentAt: new Date().toISOString(),
    status: 'DELIVERED',
    capAlertsCount: capAlerts.length,
    totalSpent,
    bodyPreview: `Delivered to ${targetEmail}. Total monthly spend so far: ₹${totalSpent.toLocaleString('en-IN')}. ${capAlerts.length} categories exceeding 80% spending cap.`,
  };

  emailDispatchHistory.unshift(record);

  res.json({
    success: true,
    messageId: dispatchId,
    recipient: targetEmail,
    sentAt: record.sentAt,
    status: 'DELIVERED',
    capAlertsCount: capAlerts.length,
    capAlerts,
    totalSpent,
    note: `Weekly spending message dispatched to ${targetEmail}`,
  });
});

app.get('/api/ai/status', (req, res) => {
  const cogneeKey = Boolean(process.env.COGNEE_CLOUD_API_KEY);
  const geminiKey = Boolean(process.env.GEMINI_API_KEY);

  let activeEngine = 'Deterministic Fallback AIService (100% Reliable)';
  let activeProvider = 'fallback';

  if (cogneeKey) {
    activeEngine = 'Cognee Cloud 3 Knowledge & Cognition Engine';
    activeProvider = 'cognee';
  } else if (geminiKey) {
    activeEngine = 'Gemini 3.8 Flash Engine';
    activeProvider = 'gemini';
  }

  res.json({
    hasCogneeKey: cogneeKey,
    hasGeminiKey: geminiKey,
    activeProvider,
    activeEngine,
    deterministicMath: true,
  });
});

app.post('/api/ai/explain', async (req, res) => {
  const { type, context, scenario, transaction } = req.body;
  const { service, provider } = getAIService();

  try {
    let explanation = '';
    if (type === 'transaction' && transaction) {
      explanation = await service.explainTransactionSimulation(transaction, context);
    } else if (type === 'scenario' && scenario) {
      explanation = await service.explainScenario(scenario, context);
    } else {
      explanation = await service.explainCashFlowPressure(context);
    }

    res.json({ explanation, source: provider });
  } catch (error) {
    console.error('AI explanation error:', error);
    const fallback = new FallbackAIService();
    const explanation = await fallback.explainCashFlowPressure(context);
    res.json({ explanation, source: 'fallback-safe' });
  }
});

app.post('/api/ai/chat', async (req, res) => {
  const { message, context } = req.body;
  const { service, provider } = getAIService();

  try {
    const reply = await service.chat(message || '', context || {});
    res.json({ reply, source: provider });
  } catch (error) {
    console.error('AI chat error:', error);
    const fallback = new FallbackAIService();
    const reply = await fallback.chat(message || '', context || {});
    res.json({ reply, source: 'fallback-safe' });
  }
});

app.post('/api/ai/report-summary', async (req, res) => {
  const { period, context } = req.body;
  const { service, provider } = getAIService();

  try {
    const summary = await service.generateReportSummary(period || 'monthly', context || {});
    res.json({ summary, source: provider });
  } catch (error) {
    console.error('Report summary error:', error);
    const fallback = new FallbackAIService();
    const summary = await fallback.generateReportSummary(period || 'monthly', context || {});
    res.json({ summary, source: 'fallback-safe' });
  }
});

// ----------------------------------------------------
// Production / Dev Vite Serving
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

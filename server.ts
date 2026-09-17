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

// Initialize Gemini client lazily
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// ----------------------------------------------------
// Deterministic Fallback Generators for High Reliability
// ----------------------------------------------------

function generateFallbackExplanation(context: any): string {
  const balance = context?.currentBalance ?? 28000;
  const rent = context?.rentAmount ?? 12000;
  const emi = context?.emiAmount ?? 6500;
  const discretionary = context?.typicalSpending ?? 5000;
  const buffer = context?.projectedBuffer ?? 9500;

  return `### AI Cash Flow Diagnostic

**Primary Root Causes Identified:**
1. **Front-Loaded Outflows**: Out of your ₹39,500 expected monthly outflows, ₹18,500 (Rent ₹${rent.toLocaleString('en-IN')} + EMI ₹${emi.toLocaleString('en-IN')}) is scheduled to exit within the first 12 days.
2. **Discretionary Spending Surge**: Dining & food delivery is currently running **18% above** your 90-day baseline average, creating an accelerated cash bleed of ~₹1,260.
3. **Income Timing Asynchrony**: While outflows hit in early and mid-month spikes, your primary salary deposit (₹52,000) arrives at month end.
4. **Compressed Liquidity Floor**: Your current balance of ₹${balance.toLocaleString('en-IN')} is insufficient to absorb concurrent peak outflows without dipping into your emergency buffer.

**Timeline Projection:**
Around **Week 3 (approx. Day 21–24)**, your available liquid balance is projected to touch an estimated low of **₹4,500** before stabilizing.

*Confidence: Prototype estimate based on synthetic demo profile.*`;
}

function generateFallbackTradeOffAnalysis(context: any): string {
  const emi = context?.emi ?? 6500;
  const loanAmount = context?.loanAmount ?? 200000;
  const tenure = context?.tenureMonths ?? 36;
  const buffer = context?.projectedBuffer ?? 3000;
  const lowest = context?.lowestBalance ?? 2200;

  return `### Loan Scenario Analysis: ₹${(loanAmount / 100000).toFixed(1)} Lakh over ${tenure} Months

- **Estimated Monthly EMI**: ₹${emi.toLocaleString('en-IN')}
- **Projected Remaining Monthly Buffer**: ₹${buffer.toLocaleString('en-IN')}
- **Estimated Cash Floor (Week 3)**: ₹${lowest.toLocaleString('en-IN')}

**AI Trade-off Evaluation:**
With this EMI commitment of ₹${emi.toLocaleString('en-IN')}, your monthly buffer contracts from ₹9,500 down to ₹${buffer.toLocaleString('en-IN')}. During peak outflow windows (days 10–23), your projected balance may decline to approx. ₹${lowest.toLocaleString('en-IN')}. 

*Important Note: This simulation illustrates cash-flow liquidity sensitivity rather than formal underwriting approval or credit rejection. It highlights how monthly payment obligations interact with existing rent and living expenses.*`;
}

function generateFallbackChatResponse(message: string, context: any): string {
  const lower = message.toLowerCase();

  if (lower.includes('why') && (lower.includes('falling') || lower.includes('balance') || lower.includes('drop'))) {
    return `Your projected balance is falling towards Week 3 primarily due to the timing gap between expenses and income:
• ₹12,000 Rent due on Day 10
• ₹6,500 EMI due on Day 12
• Discretionary dining is 18% higher than usual (approx. ₹8,250 this month)
This pulls your liquid balance down to around ₹4,500 on Day 23 before your ₹52,000 salary arrives at month end.`;
  }

  if (lower.includes('spending') && (lower.includes('most') || lower.includes('where'))) {
    return `Looking at your current month category breakdown:
1. **Housing (Rent)**: ₹12,000 (30.4% of total)
2. **Food & Dining**: ₹8,250 (20.9% of total)
3. **EMI & Loans**: ₹6,500 (16.5% of total)
4. **Shopping & Lifestyle**: ₹5,600 (14.2% of total)
5. **Transport & Fuel**: ₹3,450 (8.7% of total)
Your highest outflow is Rent, but the fastest-growing discretionary category is Dining (+18%).`;
  }

  if (lower.includes('increase') || lower.includes('rising') || lower.includes('changes')) {
    return `Your biggest spending changes compared to last month are:
• **Dining & Food Delivery**: **+18%** (increased Swiggy/Zomato weekend orders)
• **Shopping & Lifestyle**: **+12%** (Zara & Amazon purchases)
• **Transport & Fuel**: **-4%** (decreased fuel & metro rides)
• **Entertainment**: **-7%** (lower cinema spending)
Trimming dining by just ₹2,000 would safely elevate your projected buffer to ₹11,500.`;
  }

  if (lower.includes('loan') || lower.includes('2 lakh') || lower.includes('lakh')) {
    return `If you take a ₹2,00,000 personal loan at 11.5% for 36 months:
• The monthly EMI is approximately **₹6,600**.
• Your projected monthly buffer drops from ₹9,500 to **~₹2,900**.
• During Week 3, your projected lowest balance may dip down to **~₹1,800**.
While serviceable on your ₹52,000 monthly income, it significantly tightens your mid-month liquidity. You can test tenure extensions (e.g. 48 months for an EMI of ₹5,200) in the **What If?** tab.`;
  }

  if (lower.includes('buffer') || lower.includes('save') || lower.includes('protect')) {
    return `Here are 3 concrete ways to expand your projected buffer:
1. **Cap Food Delivery**: Reducing Swiggy/Zomato orders from 5x/wk to 2x/wk restores approx. ₹1,800/mo.
2. **Shift Discretionary Shopping**: Postpone non-urgent apparel/electronics checkouts past Day 25.
3. **EMI Date Alignment**: Request your lender to align the EMI debit date to Day 2 or 3 (immediately after salary), avoiding mid-month cash strain.`;
  }

  return `Based on your synthetic demo account (Current Balance ₹28,000, Income ₹52,000, Expenses ₹39,500):
Your financial position is moderately stable (Health score 72/100), but vulnerable to mid-month liquidity squeezes around Day 23. You can explore the **Cash Flow** timeline, examine **Transactions**, or simulate loan impacts in the **What If?** tab.`;
}

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

app.get('/api/ai/status', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    hasGeminiKey: hasKey,
    engine: hasKey ? 'Gemini 3.8 Flash' : 'Deterministic Financial Analysis Engine',
    model: hasKey ? 'gemini-3.8-flash' : 'rule-based-v1',
  });
});

app.post('/api/ai/explain', async (req, res) => {
  const { type, context } = req.body;
  const client = getGeminiClient();

  if (!client) {
    // Return deterministic fallback
    const fallback = type === 'scenario'
      ? generateFallbackTradeOffAnalysis(context)
      : generateFallbackExplanation(context);
    return res.json({ explanation: fallback, source: 'fallback' });
  }

  try {
    const prompt = `You are Paytm CashFlow AI, an intelligent, empathetic Indian fintech copilot built for the Paytm Build for India AI Hackathon.
Explain ${type === 'scenario' ? 'the financial trade-offs of this loan scenario' : 'why potential cash-flow pressure was detected in Week 3'}.
Context data:
${JSON.stringify(context, null, 2)}

Strict guidelines:
- Never claim absolute certainty; use calibrated phrasing ("may", "projected", "estimated", "based on demo data").
- Reference the exact figures: Income ₹52,000, Balance ₹28,000, Rent ₹12,000, EMI ₹6,500, Week 3 lowest balance around ₹4,500, Dining +18%.
- Structure with clear bullet points, impact breakdown, and a practical next step.
- Keep the tone professional, objective, and supportive. Under 200 words.`;

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const text = response.text || generateFallbackExplanation(context);
    res.json({ explanation: text, source: 'gemini' });
  } catch (error) {
    console.error('Gemini explanation error:', error);
    const fallback = type === 'scenario'
      ? generateFallbackTradeOffAnalysis(context)
      : generateFallbackExplanation(context);
    res.json({ explanation: fallback, source: 'fallback-error' });
  }
});

app.post('/api/ai/chat', async (req, res) => {
  const { message, context, history } = req.body;
  const client = getGeminiClient();

  if (!client) {
    const reply = generateFallbackChatResponse(message, context);
    return res.json({ reply, source: 'fallback' });
  }

  try {
    const systemPrompt = `You are Paytm CashFlow AI, the conversational financial copilot for the Paytm Build for India AI Hackathon prototype.
You help users understand their cash flow, forecast upcoming pressure, explain trade-offs, and simulate decisions.
Current user financial context:
- Current balance: ₹28,000
- Monthly income: ₹52,000 (Tech Mahindra Payroll)
- Monthly expenses: ₹39,500
- Projected buffer: ₹9,500
- Financial health score: 72/100
- Rent: ₹12,000 (Day 10)
- EMI: ₹6,500 (Day 12)
- Discretionary dining: ₹8,250 (+18% above baseline)
- Week 3 cash floor projection: ~₹4,500 on Day 23

Rules:
1. Always reference the actual synthetic figures in your answers.
2. Keep explanations concise, practical, and grounded in Indian personal finance contexts (UPI, EMI, Rent, Dining apps).
3. Do not guarantee financial outcomes or approve/reject loans. Frame insights as educational projections.`;

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `${systemPrompt}\n\nUser Question: ${message}`,
    });

    const reply = response.text || generateFallbackChatResponse(message, context);
    res.json({ reply, source: 'gemini' });
  } catch (error) {
    console.error('Gemini chat error:', error);
    const reply = generateFallbackChatResponse(message, context);
    res.json({ reply, source: 'fallback-error' });
  }
});

// ----------------------------------------------------
// Vite Server Integration
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
    console.log(`Paytm CashFlow AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

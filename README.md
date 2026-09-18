# Paytm CashFlow AI
### Predict. Explain. Plan.

> **Paytm Build for India AI Hackathon – Bengaluru Edition**  
> **Track 2:** AI-Powered Financial Journeys  
> **Prototype Status:** Fully Functional Interactive Prototype (Synthetic & Demo Data)

---

## 📌 Executive Summary & Hackathon Overview

**Paytm CashFlow AI** is an AI-powered personal finance copilot designed to help users understand their current liquidity, forecast upcoming cash flow, preemptively detect financial stress, simulate financial decisions before taking them, and enforce proactive spending guardrails.

> ⚠️ **Demo Data Notice:** This is an interactive hackathon prototype built for evaluation. It uses synthetic financial datasets and does not claim access to real Paytm customer data, banking APIs, or credit bureau records.

---

### ✨ Key Features & Capabilities

1. **Financial Dashboard & Liquidity Vitals**
   - Live health score, liquid balance, runway to salary day, and safe daily spend gauge.
   - Month-to-date income vs. expense breakdown.
   - **Quick Action Launchpad** connecting What-If, Commitments, Health Score, Caps, Reports, and Copilot.

2. **Unified "What-If?" Decision Sandbox**
   - Five interactive financial decision models:
     - **Personal Loan / EMI**: ₹50k to ₹5L with tenure & interest sliders.
     - **Salary Delay / Variance**: Test impact of 5 to 15-day delayed paycheck credits.
     - **Large Discretionary Purchase**: Test lump-sum gadget or travel spends.
     - **Insurance Premium Outflow**: Test annual health/life premium shock.
     - **Emergency Medical Buffer**: Model sudden hospital emergency outlays.
   - Real-time recalculation of cash runway, lowest balance floor, and safe decision recommendation.

3. **Commitments & Fixed Outflow Timeline**
   - Dedicated tracker for recurring obligations: Rent (₹12,000), Personal Loan EMI (₹6,500), Broadband & Utilities (₹1,500), and Health Insurance (₹12,000).
   - Calendar impact tags, status indicators (`PAID`, `DUE SOON`, `UPCOMING`), and insurance policy buffer analysis.

4. **Financial Health Score (0–100) & Factor Breakdown**
   - 4-Pillar composite index:
     - **Liquidity Buffer** (82/100): Runway vs. recurring liabilities.
     - **Debt Burden** (68/100): EMI-to-income ratio (currently ~12.5%).
     - **Discretionary Velocity** (64/100): Dining & lifestyle burn rates.
     - **Savings Discipline** (75/100): Month-end retention consistency.
   - Actionable remediation levers to push score into the 80+ tier.

5. **Live Sandbox Transaction Simulator**
   - Global **"Simulate Transaction"** trigger accessible from TopNav, Sidebar, Dashboard, and Transactions ledger.
   - Apply hypothetical transactions in sandbox mode (e.g. ₹4,500 weekend dining or ₹15,000 gadget).
   - Dedicated ledger badge: `SIMULATED • NO REAL PAYMENT MADE` with one-click removal to restore balance.

6. **Money-Flow Reports & PDF Export**
   - Comprehensive money flow statement showing Net Cash Flow, Safe Buffer, Category Breakdown, and Stress Factors.
   - One-click **"Export PDF Summary"** formatting a print-ready executive summary.

7. **Transactions Ledger & Manual Re-categorization**
   - Auto-categorized transactions using simulated financial NLP.
   - Ability to edit/re-categorize transactions with an automated **"User-corrected" badge**.

8. **Custom Spending Caps & 80% Threshold Guardrails**
   - Set custom monthly caps per category (Dining, Shopping, Utilities, etc.).
   - **Real-time In-App Notifications & Floating Toast** triggered when category spending reaches or crosses 80% of its cap.
   - Dashboard alert widget and sidebar status counter.

9. **Weekly Spending Email Digest & Backend API**
   - Automated weekly financial digest dispatch via `POST /api/notifications/weekly-email` to `nandinandisha22@gmail.com`.
   - High-fidelity Paytm-branded email preview modal detailing category breakdown, cap alerts, and runway advice.
   - Backend dispatch history endpoint at `GET /api/notifications/email-history`.

10. **Dual-AI Service: Cognee Cloud 3 + Fallback**
    - Built-in adapter for **Cognee Cloud 3 Knowledge & Cognition Engine** (`COGNEE_CLOUD_API_KEY`).
    - Ultra-reliable deterministic fallback ensuring 100% uptime with zero hallucination.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React, Recharts
- **Backend:** Node.js, Express, tsx (dev), esbuild (production server bundle)
- **AI SDK:** `@google/genai` (Google Gen AI SDK for Gemini models) with deterministic fallbacks
- **Bundler & Tooling:** Vite, TypeScript compiler (`tsc`)

---

## 🚀 Local Execution Guide

Follow these steps to run the application on your local machine:

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher (`v20+` recommended)
- **npm**: `v9.0.0` or higher (or `bun` / `pnpm` / `yarn`)
- **Git**: Installed and configured

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/paytm-cashflow-ai.git
cd paytm-cashflow-ai
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a local `.env` file from the example:
```bash
cp .env.example .env
```

Edit `.env` if you wish to use a live Gemini API key:
```env
# Optional: Live Gemini API Key. If omitted, robust local AI fallbacks are used.
GEMINI_API_KEY="your_gemini_api_key_here"

# Application host URL
APP_URL="http://localhost:3000"
```

> **Note on AI Fallbacks:** If `GEMINI_API_KEY` is not provided, the application automatically uses deterministic, high-fidelity AI diagnostics so all features work seamlessly out of the box without any paid API keys.

### 5. Start the Development Server
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

### 6. Build and Test Production Locally
To verify the production build locally:
```bash
# Build both frontend Vite assets and backend server bundle
npm run build

# Start production server
npm start
```
The production server will listen on `http://localhost:3000`.

### 7. Run Code Quality Checks
```bash
# Type check and lint
npm run lint
```

---

## ☁️ Publishing & Cloud Deployment

### Option A: Deploy to Google Cloud Run (Recommended)

Because this app uses an Express + Vite full-stack architecture binding to port `3000`, it is fully container-ready for Google Cloud Run:

#### 1. Build and Submit Container Image
```bash
# Set your GCP Project ID
gcloud config set project YOUR_PROJECT_ID

# Build container with Google Cloud Build
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/paytm-cashflow-ai
```

#### 2. Deploy to Cloud Run
```bash
gcloud run deploy paytm-cashflow-ai \
  --image gcr.io/YOUR_PROJECT_ID/paytm-cashflow-ai \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars NODE_ENV=production,GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

---

### Option B: Deploy Using Docker

A standard `Dockerfile` can be created to deploy anywhere (AWS ECS, Azure App Service, DigitalOcean, Render):

```dockerfile
# 1. Base image
FROM node:20-alpine AS builder
WORKDIR /app

# 2. Install dependencies
COPY package*.json ./
RUN npm ci

# 3. Copy source and build
COPY . .
RUN npm run build

# 4. Production runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.cjs"]
```

Build and run Docker container locally:
```bash
docker build -t paytm-cashflow-ai .
docker run -p 3000:3000 -e GEMINI_API_KEY="your_api_key" paytm-cashflow-ai
```

---

### Option C: Deploy to Render / Railway / Fly.io

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of Paytm CashFlow AI"
   git branch -M main
   git remote add origin https://github.com/your-username/paytm-cashflow-ai.git
   git push -u origin main
   ```

2. **Configure Service on Render / Railway:**
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `NODE_ENV`: `production`
     - `PORT`: `3000`
     - `GEMINI_API_KEY`: *(Optional) your Gemini API key*

---

## 📂 Project Structure

```
paytm-cashflow-ai/
├── public/                     # Static assets & icons
├── src/
│   ├── components/             # Modular UI components
│   │   ├── AiCopilotDrawer.tsx         # Conversational copilot
│   │   ├── AiInsightsPage.tsx          # Key insights & factor briefs
│   │   ├── AuthPage.tsx                # Login / Logout & persona picker
│   │   ├── CashFlowForecastChart.tsx   # 30-day projection graph
│   │   ├── DashboardView.tsx           # Mission control dashboard & vitals
│   │   ├── ExplainableAiModal.tsx      # "Why?" diagnostic modal
│   │   ├── FinancialJourney.tsx        # 4-stage guided journey
│   │   ├── MetricCards.tsx             # Balance, score, buffer metrics
│   │   ├── NotificationsModal.tsx      # Real-time alert center
│   │   ├── PaytmLogo.tsx               # Paytm vector branding
│   │   ├── ResponsibleAiModal.tsx      # AI transparency & ethics
│   │   ├── Sidebar.tsx                 # Left desktop sidebar & mobile drawer
│   │   ├── SmartRecommendations.tsx    # Impact-ranked action recommendations
│   │   ├── SpendingAnalysis.tsx        # MoM category velocity & tabs
│   │   ├── SpendingCapsSection.tsx     # Custom caps & 80% guardrails
│   │   ├── StressAlertCard.tsx         # Week 3 stress warning card
│   │   ├── TopNav.tsx                  # Header bar with notification badge
│   │   ├── TransactionsTable.tsx       # Ledger with manual re-categorization
│   │   ├── WeeklySpendingEmailModal.tsx# Paytm weekly email preview
│   │   └── WhatIfSimulator.tsx         # Loan & EMI stress sandbox
│   ├── data/
│   │   └── mockFinancialData.ts# Synthetic financial models & profiles
│   ├── utils/
│   │   └── financialCalculations.ts    # INR formatting & calculation helpers
│   ├── types.ts                # TypeScript interfaces and contracts
│   ├── App.tsx                 # Primary state orchestrator & navigation
│   ├── main.tsx                # React DOM entry point
│   └── index.css               # Global styles & Tailwind imports
├── .env.example                # Environment variable specification
├── .gitignore                  # Git ignore rules
├── metadata.json               # App metadata
├── package.json                # Dependencies & scripts
├── server.ts                   # Express server & API endpoints
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration
```

---

## ⚖️ Responsible AI & Ethical Guardrails

- **Advisory Role Only:** Clearly distinguishes cash-flow simulation from formal credit sanctioning or financial advice.
- **Explainable Factors:** Every warning and alert links directly to transparent root-cause factors.
- **Privacy First:** Client-side mock execution ensures no personal banking credentials or proprietary data are required or stored.

---

## 🏆 Hackathon Submission Details

- **Hackathon:** Paytm Build for India AI Hackathon – Bengaluru Edition
- **Track:** Track 2 – AI-Powered Financial Journeys
- **Theme:** Predict. Explain. Plan.
- **License:** MIT License

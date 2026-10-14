# WhatIf Lab — Interactive Simulation Platform

> **“Don’t Just Imagine. Experiment.”**

WhatIf Lab is an interactive scientific and decision-making simulation platform. It empowers users to explore hypothetical scenarios, manipulate variables, compare counterfactuals side by side, and understand non-linear outcomes through transparent calculations and data visualizations.

---

## 🌟 Core Simulation Worlds

1. **World 1: Artisan Coffee Shop Economics (Business)**
   - **Inputs:** Beverages sold per day, selling price, variable cost per cup, monthly fixed overhead, operating days, and ad spend.
   - **Calculations:** Monthly revenue, total variable costs, contribution margin per unit, break-even unit threshold, operating profit/loss, and operating margin.
   - **Visuals:** Revenue vs. cost sensitivity curves across sales volumes.

2. **World 2: Long-Term Wealth & Compound Growth (Personal Finance)**
   - **Inputs:** Initial principal, monthly recurring contributions, annual return rate, investment horizon, and annual inflation rate.
   - **Calculations:** Total cash contributions, compound interest earned, nominal future balance, and inflation-discounted real purchasing power.
   - **Visuals:** Year-by-year multi-decade compounding growth area chart.

3. **World 2b: Loan Amortization & Accelerated Payoff (Personal Finance)**
   - **Inputs:** Principal loan amount, interest rate (APR), loan term (years), and extra monthly principal.
   - **Calculations:** Scheduled monthly payment, total interest paid, interest saved through extra principal, and years shaved off debt.
   - **Visuals:** Standard vs. accelerated loan balance curve over time.

4. **World 3: Urban Transit & Carbon Mitigation (City & Policy)**
   - **Inputs:** Commuter population, current vs. target transit mode share, electric bus fleet percentage, average commute distance.
   - **Calculations:** Commuters shifted, vehicle-kilometers eliminated, net metric tons of CO₂ avoided, and regional household fuel savings.
   - **Visuals:** Implementation milestone trajectory for carbon reduction.

5. **World 4: Weekly Time Budget & Compounding Mastery (Life Decisions)**
   - **Inputs:** Sleep hours/day, core work/study hours/day, deliberate skill practice hours/week, exercise hours/week, chores, and leisure.
   - **Calculations:** Discretionary weekly slack buffer, burnout deficit warnings, and 5-year cumulative practice accumulation.
   - **Visuals:** 5-year skill mastery compounding curve.

6. **World 5: Ballistic Motion & Gravitational Kinematics (Physics & Science)**
   - **Inputs:** Launch velocity ($v_0$), elevation angle ($\theta$), initial height ($y_0$), and gravitational acceleration ($g$ - Earth, Moon, Mars presets).
   - **Calculations:** Total horizontal range, maximum apogee height, airborne flight duration, and ground impact velocity.
   - **Visuals:** Parabolic ballistic trajectory $y(x)$ curve.

7. **World 6: Custom Experiment Builder**
   - Safe mathematical formula grammar evaluator (zero `eval()`, strictly tokenized math parser).
   - Define custom variables, boundary limits, units, equations, and observe immediate recalculated results.

---

## 🔬 Core Product Features

- **Instant Deterministic Engine:** Zero-latency recalculations immediately upon slider or number input modification.
- **Scenario Comparison Engine:** Compare Baseline against Alternative scenarios with absolute deltas, percentage shifts, changed input highlights, and analytical written summaries.
- **Client-Side Persistence:** Save named scenarios, duplicate, rename, and delete with confirmation dialogs (stored in browser `localStorage`).
- **Audit Trail & History:** Chronological log of executed simulations with 1-click reproduction.
- **Export & Import:** Export scenarios as JSON or CSV reports; validate and import JSON scenario bundles safely.
- **Formula Transparency:** Every model displays exact equations, working assumptions, and unmodeled real-world boundaries.
- **Automated Test Suite:** Built-in verification test suite testing boundary conditions, zero divisions, and formula precision.

---

## 🛠️ Technology Stack

- **Framework:** React 19 (SPA)
- **Bundler:** Vite 8
- **Styling:** Modern Tailwind CSS with custom lab design system tokens (`#080B14`, `#0E1422`, `#121B2B`, `#7C5CFC`, `#35D9FF`)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Persistence:** LocalStorage API
- **Testing:** Native deterministic in-app test suite

---

## 🚀 Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
The application will be running at `http://localhost:3000`.

### 3. Run Formula Linting & Type Checks
```bash
npm run lint
```

### 4. Build for Production
```bash
npm run build
```
Production output files will be compiled into the `dist/` directory.

---

## ☁️ Deploying to Vercel

WhatIf Lab is designed for zero-config production deployment on Vercel:

### Option A: Via Vercel Web Dashboard (Recommended)
1. Push your code to your GitHub / GitLab / Bitbucket repository.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Vercel automatically detects Vite:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **"Deploy"**. The site will be live in seconds.

### Option B: Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```
When prompted:
- Set up and deploy: **Yes**
- Which scope: Select your account
- Link to existing project: **No**
- What's your project's name: **whatif-lab**
- In which directory is your code located: `./`
- Want to modify these settings: **No** (Vite defaults are pre-configured)

For production deployment:
```bash
vercel --prod
```

---

## 📜 Scientific & Ethical Disclosures

Calculated simulation results are transparent mathematical approximations designed for conceptual exploration and decision analysis. They do not constitute personalized financial, legal, medical, or investment advice.

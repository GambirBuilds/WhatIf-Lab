import React, { useState } from 'react';
import {
  ArrowRight,
  Beaker,
  Sliders,
  GitCompare,
  TrendingUp,
  ShieldCheck,
  Coffee,
  CreditCard,
  Bus,
  Atom,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';

interface LandingPageViewProps {
  onNavigate: (tab: string, simulationId?: string) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onNavigate }) => {
  // Interactive Live Hero Mini-Simulator: Coffee Shop variable slider
  const [heroCupsPerDay, setHeroCupsPerDay] = useState(250);
  const [heroPrice, setHeroPrice] = useState(260);

  // Computed values in real-time
  const heroOperatingDays = 26;
  const heroCostPerCup = 75;
  const heroFixedExpenses = 110000;
  const heroMonthlyUnits = heroCupsPerDay * heroOperatingDays;
  const heroRevenue = heroMonthlyUnits * heroPrice;
  const heroTotalCost = heroMonthlyUnits * heroCostPerCup + heroFixedExpenses + 8000;
  const heroProfit = heroRevenue - heroTotalCost;
  const heroBreakEven = Math.ceil((heroFixedExpenses + 8000) / (heroPrice - heroCostPerCup));

  return (
    <div className="space-y-24 py-6">
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Copy (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#35D9FF]">
              Interactive Simulation Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#F4F7FF] tracking-tight leading-[1.1]">
              Explore Every <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFC] via-[#35D9FF] to-[#38D996]">
                Possibility.
              </span>
            </h1>

            <p className="text-lg font-medium text-[#F4F7FF]/90">
              “Don’t Just Imagine. Experiment.”
            </p>

            <p className="text-base text-[#9AA8BD] max-w-xl leading-relaxed">
              Test hypothetical decisions, manipulate systemic variables, compare counterfactual scenarios, and uncover
              non-linear consequences with transparent mathematical formulas and immediate visual feedback.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('workspace', 'coffee-shop')}
                className="px-6 py-3 text-sm font-semibold text-white bg-[#7C5CFC] hover:bg-[#6b47fa] rounded-xl transition-all shadow-lg shadow-[#7C5CFC]/25 flex items-center gap-2 active:scale-95"
              >
                Start Experimenting
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('explore')}
                className="px-6 py-3 text-sm font-medium text-[#F4F7FF] bg-[#121B2B] hover:bg-[#1a253a] border border-[#9AA8BD]/20 rounded-xl transition-colors"
              >
                Explore Simulations
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs text-[#9AA8BD]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#38D996]" />
                Zero black-box guesses
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#38D996]" />
                Deterministic formulas
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#38D996]" />
                Client-side privacy
              </span>
            </div>
          </div>

          {/* Hero Right: Live Interactive Sandbox Teaser (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-[#0E1422] rounded-2xl border border-[#9AA8BD]/20 p-6 shadow-2xl relative overflow-hidden space-y-5">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#7C5CFC]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between pb-3 border-b border-[#9AA8BD]/15">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#FFBD59]/20 text-[#FFBD59] flex items-center justify-center">
                    <Coffee className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#F4F7FF]">Live Model Sandbox</span>
                </div>
                <span className="text-[11px] font-mono text-[#38D996]">Instant Feedback</span>
              </div>

              {/* Dynamic Interactive Slider Controls */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#9AA8BD]">Beverages Sold / Day:</span>
                    <strong className="text-[#F4F7FF] font-mono">{heroCupsPerDay} cups</strong>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={600}
                    step={10}
                    value={heroCupsPerDay}
                    onChange={(e) => setHeroCupsPerDay(parseInt(e.target.value))}
                    className="w-full accent-[#35D9FF] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#9AA8BD]">Average Price / Cup:</span>
                    <strong className="text-[#F4F7FF] font-mono">Rs. {heroPrice}</strong>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={600}
                    step={10}
                    value={heroPrice}
                    onChange={(e) => setHeroPrice(parseInt(e.target.value))}
                    className="w-full accent-[#7C5CFC] cursor-pointer"
                  />
                </div>
              </div>

              {/* Real-time Computed Mini Dashboard */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#9AA8BD]/15">
                <div className="p-3 rounded-xl bg-[#121B2B] border border-[#9AA8BD]/10">
                  <span className="text-[10px] text-[#9AA8BD] uppercase tracking-wider block">
                    Monthly Revenue
                  </span>
                  <span className="text-lg font-bold font-mono text-[#35D9FF] mt-0.5 block">
                    {formatCurrency(heroRevenue)}
                  </span>
                  <span className="text-[10px] text-[#9AA8BD]/70 font-mono">
                    {formatNumber(heroMonthlyUnits)} cups/mo
                  </span>
                </div>

                <div
                  className={`p-3 rounded-xl bg-[#121B2B] border ${
                    heroProfit > 0 ? 'border-[#38D996]/30' : 'border-[#FF647C]/30'
                  }`}
                >
                  <span className="text-[10px] text-[#9AA8BD] uppercase tracking-wider block">
                    Operating Profit
                  </span>
                  <span
                    className={`text-lg font-bold font-mono mt-0.5 block ${
                      heroProfit > 0 ? 'text-[#38D996]' : 'text-[#FF647C]'
                    }`}
                  >
                    {formatCurrency(heroProfit)}
                  </span>
                  <span className="text-[10px] text-[#9AA8BD]/70 font-mono">
                    {heroProfit > 0 ? 'Surplus' : 'Deficit'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-[#9AA8BD] leading-relaxed bg-[#121B2B]/60 p-2.5 rounded-lg border border-[#9AA8BD]/10">
                Break-even occurs at <strong className="text-[#F4F7FF]">{formatNumber(heroBreakEven)} cups/mo</strong>.
                Drag the sliders to watch margins expand or contract.
              </div>

              <button
                onClick={() => onNavigate('workspace', 'coffee-shop')}
                className="w-full py-2 text-xs font-semibold text-[#35D9FF] hover:text-white bg-[#35D9FF]/10 hover:bg-[#35D9FF]/20 border border-[#35D9FF]/25 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                Open Full Coffee Shop Simulation
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How WhatIf Lab Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#35D9FF]">
            Product Methodology
          </span>
          <h2 className="text-3xl font-bold text-[#F4F7FF] tracking-tight">
            How The Lab Operates
          </h2>
          <p className="text-sm text-[#9AA8BD]">
            Every simulation provides transparent arithmetic, verifiable assumptions, and instant comparison.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-[#0E1422] border border-[#9AA8BD]/15 space-y-3 relative">
            <span className="text-xs font-mono text-[#7C5CFC] font-semibold">01.</span>
            <div className="w-10 h-10 rounded-xl bg-[#7C5CFC]/20 text-[#7C5CFC] flex items-center justify-center">
              <Beaker className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F4F7FF]">Choose a Model</h3>
            <p className="text-xs text-[#9AA8BD] leading-relaxed">
              Select an analytical or illustrative model from business unit economics, wealth compounding, city transit,
              habit planning, or Newtonian kinematics.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0E1422] border border-[#9AA8BD]/15 space-y-3 relative">
            <span className="text-xs font-mono text-[#35D9FF] font-semibold">02.</span>
            <div className="w-10 h-10 rounded-xl bg-[#35D9FF]/20 text-[#35D9FF] flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F4F7FF]">Adjust Parameters</h3>
            <p className="text-xs text-[#9AA8BD] leading-relaxed">
              Manipulate synchronized sliders and numeric bounds. Observe zero-latency recalculations of key metrics,
              trajectories, and sensitivity charts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0E1422] border border-[#9AA8BD]/15 space-y-3 relative">
            <span className="text-xs font-mono text-[#38D996] font-semibold">03.</span>
            <div className="w-10 h-10 rounded-xl bg-[#38D996]/20 text-[#38D996] flex items-center justify-center">
              <GitCompare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F4F7FF]">Compare Scenarios</h3>
            <p className="text-xs text-[#9AA8BD] leading-relaxed">
              Lock a baseline and build alternative counterfactuals. Inspect variance tables, absolute deltas, percentage
              shifts, and narrative interpretations.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Featured Simulations Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#35D9FF]">
              Curated Worlds
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F7FF] tracking-tight mt-1">
              Featured Simulations
            </h2>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-semibold text-[#35D9FF] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            Browse all models
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Coffee Shop */}
          <div
            onClick={() => onNavigate('workspace', 'coffee-shop')}
            className="cursor-pointer bg-[#0E1422] rounded-2xl border border-[#9AA8BD]/15 p-6 hover:border-[#FFBD59]/50 transition-all hover:-translate-y-1 group space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFBD59]/20 text-[#FFBD59] flex items-center justify-center">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#FFBD59] uppercase tracking-wider">Business</span>
              <h3 className="text-base font-bold text-[#F4F7FF] group-hover:text-[#35D9FF] transition-colors mt-0.5">
                Coffee Shop Economics
              </h3>
              <p className="text-xs text-[#9AA8BD] mt-1.5 leading-relaxed">
                Test how cup volumes, retail prices, ingredients, and commercial rent determine monthly break-even and margins.
              </p>
            </div>
            <div className="pt-3 border-t border-[#9AA8BD]/10 text-xs font-semibold text-[#35D9FF] flex items-center gap-1">
              Launch model <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Compound Growth */}
          <div
            onClick={() => onNavigate('workspace', 'compound-growth')}
            className="cursor-pointer bg-[#0E1422] rounded-2xl border border-[#9AA8BD]/15 p-6 hover:border-[#38D996]/50 transition-all hover:-translate-y-1 group space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-[#38D996]/20 text-[#38D996] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#38D996] uppercase tracking-wider">Finance</span>
              <h3 className="text-base font-bold text-[#F4F7FF] group-hover:text-[#35D9FF] transition-colors mt-0.5">
                Compound Wealth & Inflation
              </h3>
              <p className="text-xs text-[#9AA8BD] mt-1.5 leading-relaxed">
                Simulate monthly deposits over decades. Contrast nominal portfolio totals with inflation-adjusted real purchasing power.
              </p>
            </div>
            <div className="pt-3 border-t border-[#9AA8BD]/10 text-xs font-semibold text-[#35D9FF] flex items-center gap-1">
              Launch model <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Projectile Motion */}
          <div
            onClick={() => onNavigate('workspace', 'projectile-motion')}
            className="cursor-pointer bg-[#0E1422] rounded-2xl border border-[#9AA8BD]/15 p-6 hover:border-[#35D9FF]/50 transition-all hover:-translate-y-1 group space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-[#35D9FF]/20 text-[#35D9FF] flex items-center justify-center">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#35D9FF] uppercase tracking-wider">Science</span>
              <h3 className="text-base font-bold text-[#F4F7FF] group-hover:text-[#35D9FF] transition-colors mt-0.5">
                Ballistic Motion & Gravity
              </h3>
              <p className="text-xs text-[#9AA8BD] mt-1.5 leading-relaxed">
                Explore Newtonian parabolic flight paths. Compare ranges and flight times across Earth, the Moon, and Mars.
              </p>
            </div>
            <div className="pt-3 border-t border-[#9AA8BD]/10 text-xs font-semibold text-[#35D9FF] flex items-center gap-1">
              Launch model <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Transparency & Methodological Disclosures */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0E1422] rounded-3xl border border-[#9AA8BD]/20 p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FFBD59]">
              <ShieldCheck className="w-4 h-4" />
              <span>Scientific Rigor & Ethics</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F7FF] tracking-tight">
              Calculated Results vs Real Predictions
            </h2>

            <p className="text-xs sm:text-sm text-[#9AA8BD] leading-relaxed">
              WhatIf Lab explicitly separates mathematical modeling from clairvoyance. Real-world systems contain
              friction, psychological nuance, unforeseen market shocks, and unmodeled friction.
            </p>

            <div className="space-y-2 text-xs text-[#9AA8BD]">
              <div className="flex items-start gap-2">
                <span className="text-[#35D9FF] font-bold">✓</span>
                <span>All formulas and equations are open and disclosed on every workspace screen.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#35D9FF] font-bold">✓</span>
                <span>Unmodeled variables (such as tax brackets, machine depreciation, or drag friction) are clearly itemized.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#35D9FF] font-bold">✓</span>
                <span>No arbitrary black-box scores, fake live tickers, or unsupported predictions.</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('tests')}
                className="px-4 py-2 text-xs font-medium text-[#F4F7FF] bg-[#121B2B] hover:bg-[#1a253a] border border-[#9AA8BD]/20 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                Inspect Formula Test Suite
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-3xl font-extrabold text-[#F4F7FF] tracking-tight">
          Ready to Test Your Hypotheses?
        </h2>
        <p className="text-sm text-[#9AA8BD] max-w-lg mx-auto">
          Start with any pre-built simulation world or build your own custom formula sandbox.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => onNavigate('workspace')}
            className="px-6 py-3 text-sm font-semibold text-white bg-[#7C5CFC] hover:bg-[#6b47fa] rounded-xl transition-all shadow-lg shadow-[#7C5CFC]/25 flex items-center gap-2"
          >
            Launch WhatIf Workspace
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('custom')}
            className="px-6 py-3 text-sm font-semibold text-[#35D9FF] bg-[#35D9FF]/10 hover:bg-[#35D9FF]/20 border border-[#35D9FF]/30 rounded-xl transition-colors"
          >
            Custom Formula Builder
          </button>
        </div>
      </section>
    </div>
  );
};

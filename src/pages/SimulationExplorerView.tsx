import React, { useState } from 'react';
import { getAllSimulations, searchSimulations } from '../simulations/registry';
import { SimulationDefinition } from '../engine/types';
import {
  Search,
  SlidersHorizontal,
  Clock,
  Sparkles,
  ArrowRight,
  Coffee,
  TrendingUp,
  CreditCard,
  Bus,
  Atom,
  HelpCircle,
} from 'lucide-react';

interface SimulationExplorerViewProps {
  onSelectSimulation: (simulationId: string) => void;
}

export const SimulationExplorerView: React.FC<SimulationExplorerViewProps> = ({
  onSelectSimulation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Domains' },
    { id: 'business', label: 'Business & Commerce' },
    { id: 'finance', label: 'Personal Finance' },
    { id: 'city', label: 'City & Policy' },
    { id: 'life', label: 'Life Decisions' },
    { id: 'science', label: 'Physics & Science' },
  ];

  const simulations = searchSimulations(searchQuery, selectedCategory);

  const getSimIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-[#FFBD59]" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-[#38D996]" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-[#35D9FF]" />;
      case 'Bus':
        return <Bus className="w-5 h-5 text-[#7C5CFC]" />;
      case 'Atom':
        return <Atom className="w-5 h-5 text-[#35D9FF]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#7C5CFC]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#35D9FF]">
          <span>Simulation Catalog</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#F4F7FF] tracking-tight sm:text-4xl">
          Explore Simulation Worlds
        </h1>
        <p className="text-sm text-[#9AA8BD] max-w-2xl leading-relaxed">
          Select an interactive mathematical model below. Change underlying assumptions, test counterfactual variables,
          and discover non-linear systemic outcomes.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2">
        {/* Category Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 p-1 bg-[#0E1422] rounded-xl border border-[#9AA8BD]/15">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === c.id
                  ? 'bg-[#121B2B] text-[#35D9FF] shadow-sm border border-[#35D9FF]/30'
                  : 'text-[#9AA8BD] hover:text-[#F4F7FF]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#9AA8BD] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search simulations or variables..."
            className="w-full bg-[#0E1422] border border-[#9AA8BD]/20 rounded-xl pl-9 pr-4 py-2 text-xs text-[#F4F7FF] placeholder-[#9AA8BD]/60 focus:outline-none focus:border-[#35D9FF] focus:ring-1 focus:ring-[#35D9FF]"
          />
        </div>
      </div>

      {/* Cards Grid */}
      {simulations.length === 0 ? (
        <div className="bg-[#0E1422] rounded-2xl border border-[#9AA8BD]/15 p-12 text-center space-y-3">
          <Search className="w-8 h-8 text-[#9AA8BD]/40 mx-auto" />
          <h3 className="text-sm font-semibold text-[#F4F7FF]">No matching simulations found</h3>
          <p className="text-xs text-[#9AA8BD] max-w-sm mx-auto">
            Try adjusting your search keywords or switch category filter to "All Domains".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-2 px-3 py-1.5 text-xs font-semibold text-[#35D9FF] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simulations.map((sim) => (
            <div
              key={sim.id}
              className="bg-[#0E1422] rounded-2xl border border-[#9AA8BD]/15 p-6 hover:border-[#7C5CFC]/50 transition-all hover:-translate-y-1 group flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-4">
                {/* Card Top: Icon & Metadata text (NO PILLS) */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#121B2B] border border-[#9AA8BD]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getSimIcon(sim.iconName)}
                  </div>

                  <div className="text-right text-[11px] text-[#9AA8BD]">
                    <span>{sim.difficulty}</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {sim.estimatedMinutes}m
                    </span>
                  </div>
                </div>

                {/* Title & Tagline */}
                <div>
                  <div className="text-xs font-medium text-[#7C5CFC] mb-1">
                    {sim.categoryLabel}
                  </div>
                  <h3 className="text-lg font-bold text-[#F4F7FF] group-hover:text-[#35D9FF] transition-colors">
                    {sim.title}
                  </h3>
                  <p className="text-xs text-[#9AA8BD] mt-1.5 leading-relaxed">
                    {sim.description}
                  </p>
                </div>

                {/* Key Variables Checklist */}
                <div className="pt-3 border-t border-[#9AA8BD]/10 space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9AA8BD]/70 block">
                    Key Adjustable Variables:
                  </span>
                  <div className="text-xs text-[#F4F7FF]/90 font-mono space-y-1">
                    {sim.variables.slice(0, 3).map((v) => (
                      <div key={v.id} className="flex items-center justify-between text-[11px]">
                        <span className="truncate pr-2 font-sans text-[#9AA8BD]">{v.label}</span>
                        <span className="text-[#35D9FF] shrink-0">{v.defaultValue} {v.unit}</span>
                      </div>
                    ))}
                    {sim.variables.length > 3 && (
                      <div className="text-[10px] text-[#9AA8BD]/60">
                        + {sim.variables.length - 3} more parameters
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer: Model Type and CTA button */}
              <div className="pt-5 mt-4 border-t border-[#9AA8BD]/10 flex items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-[#9AA8BD]">
                  {sim.modelType}
                </span>

                <button
                  onClick={() => onSelectSimulation(sim.id)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#7C5CFC] hover:bg-[#6b47fa] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm group-hover:shadow-[#7C5CFC]/25"
                >
                  Run Simulation
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

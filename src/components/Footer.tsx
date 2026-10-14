import React from 'react';
import { Beaker, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-[#9AA8BD]/15 bg-[#0E1422] text-[#9AA8BD] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#7C5CFC] to-[#35D9FF] flex items-center justify-center">
                <Beaker className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-[#F4F7FF]">WhatIf Lab</span>
            </div>
            <p className="text-xs leading-relaxed max-w-md text-[#9AA8BD]">
              An interactive simulation platform designed to explore hypothetical situations, manipulate variables,
              compare scenarios side-by-side, and visualize mathematical and systemic consequences.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#9AA8BD]/80">
              <ShieldAlert className="w-3.5 h-3.5 text-[#FFBD59]" />
              <span>Simulated approximations for educational analysis, not real-world certified forecasts.</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F4F7FF] mb-3">
              Simulations
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-[#35D9FF] transition-colors"
                >
                  Simulation Explorer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('workspace')}
                  className="hover:text-[#35D9FF] transition-colors"
                >
                  Interactive Workspace
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('custom')}
                  className="hover:text-[#35D9FF] transition-colors"
                >
                  Custom Formula Builder
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tests')}
                  className="hover:text-[#35D9FF] transition-colors"
                >
                  Formula Test Suite
                </button>
              </li>
            </ul>
          </div>

          {/* Scenarios & Data */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F4F7FF] mb-3">
              Management & Data
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('scenarios')}
                  className="hover:text-[#35D9FF] transition-colors"
                >
                  Saved Scenarios
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('history')}
                  className="hover:text-[#35D9FF] transition-colors"
                >
                  Experiment History
                </button>
              </li>
              <li>
                <span className="text-[#9AA8BD]/70">Client-Side Persistence (LocalStorage)</span>
              </li>
              <li>
                <span className="text-[#9AA8BD]/70">Zero External Telemetry</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#9AA8BD]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} WhatIf Lab. Open scientific principles. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-[#9AA8BD]/70">
            <span>Built with React + Vite</span>
            <span>·</span>
            <span>Transparent Mathematical Models</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

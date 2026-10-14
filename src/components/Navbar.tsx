import React, { useState } from 'react';
import { Compass, Beaker, History, Bookmark, Sparkles, CheckCircle2, Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, simulationId?: string) => void;
  activeSimulationTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'explore', label: 'Simulations', icon: Compass },
    { id: 'workspace', label: 'Workspace', icon: Beaker },
    { id: 'scenarios', label: 'Saved Scenarios', icon: Bookmark },
    { id: 'history', label: 'History', icon: History },
    { id: 'custom', label: 'Custom Builder', icon: Sparkles },
    { id: 'tests', label: 'Engine Tests', icon: CheckCircle2 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#9AA8BD]/15 bg-[#080B14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Single Brand Element */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35D9FF] rounded-lg"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C5CFC] to-[#35D9FF] flex items-center justify-center shadow-lg shadow-[#7C5CFC]/25">
            <Beaker className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-[#F4F7FF] group-hover:text-[#35D9FF] transition-colors whitespace-nowrap">
              WhatIf Lab
            </span>
          </div>
        </button>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`text-sm font-medium transition-colors whitespace-nowrap relative py-1 focus-visible:outline-none focus-visible:text-[#35D9FF] ${
                  isActive
                    ? 'text-[#35D9FF]'
                    : 'text-[#9AA8BD] hover:text-[#F4F7FF]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#35D9FF] rounded-full shadow-[0_0_8px_#35D9FF]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('workspace')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#7C5CFC] hover:bg-[#6b47fa] rounded-lg transition-all duration-200 shadow-md shadow-[#7C5CFC]/20 active:scale-95 whitespace-nowrap"
          >
            Launch Lab
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#9AA8BD] hover:text-white rounded-lg border border-[#9AA8BD]/20 bg-[#0E1422] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#9AA8BD]/15 bg-[#0E1422] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-[#121B2B] text-[#35D9FF] border border-[#35D9FF]/30'
                    : 'text-[#9AA8BD] hover:bg-[#121B2B]/60 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => {
                onNavigate('workspace');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#7C5CFC] rounded-lg"
            >
              Launch Lab Workspace
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

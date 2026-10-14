import React, { useState, useEffect, useMemo } from 'react';
import { SimulationDefinition, Preset } from '../engine/types';
import { VariableControl } from '../components/VariableControl';
import { ResultCard } from '../components/ResultCard';
import { ChartPanel } from '../components/ChartPanel';
import { ScenarioComparisonView } from '../components/ScenarioComparisonView';
import { SaveScenarioModal } from '../components/SaveScenarioModal';
import { StorageService } from '../services/storage';
import { ExportImportService } from '../services/exportImport';
import {
  ArrowLeft,
  RotateCcw,
  Bookmark,
  GitCompare,
  Download,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Check,
  Share2,
} from 'lucide-react';

interface SimulationWorkspaceViewProps {
  simulation: SimulationDefinition;
  initialInputs?: Record<string, number>;
  initialScenarioName?: string;
  onBackToExplorer: () => void;
  onNavigateToScenarios: () => void;
}

export const SimulationWorkspaceView: React.FC<SimulationWorkspaceViewProps> = ({
  simulation,
  initialInputs,
  initialScenarioName = 'Current Experiment',
  onBackToExplorer,
  onNavigateToScenarios,
}) => {
  // Scenario state
  const [scenarioName, setScenarioName] = useState(initialScenarioName);

  // Initialize input state from initialInputs or defaults
  const [inputs, setInputs] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    simulation.variables.forEach((v) => {
      init[v.id] = initialInputs?.[v.id] ?? v.defaultValue;
    });
    return init;
  });

  // Comparison state
  const [compareMode, setCompareMode] = useState(false);
  const [baselineInputs, setBaselineInputs] = useState<Record<string, number>>(() => {
    const b: Record<string, number> = {};
    simulation.variables.forEach((v) => {
      b[v.id] = v.defaultValue;
    });
    return b;
  });
  const [baselineName, setBaselineName] = useState('Default Baseline');

  // Modal & toggles
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // If simulation changes or initialInputs changes, update
  useEffect(() => {
    const init: Record<string, number> = {};
    simulation.variables.forEach((v) => {
      init[v.id] = initialInputs?.[v.id] ?? v.defaultValue;
    });
    setInputs(init);
    setScenarioName(initialScenarioName || 'Current Experiment');
  }, [simulation.id, initialInputs]);

  // Recalculate outputs immediately when inputs change
  const result = useMemo(() => {
    return simulation.calculate(inputs);
  }, [simulation, inputs]);

  // Handle variable change
  const handleVariableChange = (id: string, value: number) => {
    setInputs((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleResetVariable = (id: string) => {
    const variable = simulation.variables.find((v) => v.id === id);
    if (variable) {
      handleVariableChange(id, variable.defaultValue);
    }
  };

  const handleResetAllToDefault = () => {
    const defs: Record<string, number> = {};
    simulation.variables.forEach((v) => {
      defs[v.id] = v.defaultValue;
    });
    setInputs(defs);
    setScenarioName('Default Baseline');
  };

  const handleApplyPreset = (preset: Preset) => {
    setInputs({ ...preset.inputs });
    setScenarioName(preset.name);
  };

  const handleSaveScenario = (name: string, notes: string) => {
    StorageService.saveScenario({
      simulationId: simulation.id,
      name,
      notes,
      inputs,
    });

    // Also log experiment to history
    StorageService.recordExperiment({
      simulationId: simulation.id,
      simulationTitle: simulation.title,
      scenarioName: name,
      inputs,
      primaryOutput: {
        label: result.primaryMetric.label,
        value: result.primaryMetric.formattedValue,
      },
    });

    setScenarioName(name);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const handleSetCurrentAsBaseline = () => {
    setBaselineInputs({ ...inputs });
    setBaselineName(scenarioName);
  };

  const handleExportCSV = () => {
    const rawOut: Record<string, any> = {};
    rawOut[result.primaryMetric.label] = { value: result.primaryMetric.formattedValue, unit: result.primaryMetric.unit };
    result.metrics.forEach((m) => {
      rawOut[m.label] = { value: m.formattedValue, unit: m.unit };
    });

    ExportImportService.exportResultsAsCSV(
      simulation.title,
      scenarioName,
      inputs,
      rawOut,
      `${simulation.id}_results.csv`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#9AA8BD]/15">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToExplorer}
            className="p-2 text-[#9AA8BD] hover:text-white hover:bg-[#121B2B] rounded-lg transition-colors border border-[#9AA8BD]/15"
            title="Back to Explorer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-[#9AA8BD]">
              <span>{simulation.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[#35D9FF]">{simulation.modelType}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F4F7FF] tracking-tight mt-0.5">
              {simulation.title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {saveSuccessMsg && (
            <span className="text-xs text-[#38D996] flex items-center gap-1 font-medium mr-2">
              <Check className="w-4 h-4" /> Saved!
            </span>
          )}

          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              compareMode
                ? 'bg-[#35D9FF] text-[#080B14] shadow-md shadow-[#35D9FF]/20'
                : 'text-[#F4F7FF] bg-[#121B2B] hover:bg-[#1a253a] border border-[#9AA8BD]/20'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            {compareMode ? 'Exit Compare' : 'Compare Scenarios'}
          </button>

          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#7C5CFC] hover:bg-[#6b47fa] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Bookmark className="w-3.5 h-3.5" />
            Save Scenario
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-medium text-[#9AA8BD] hover:text-white bg-[#121B2B] hover:bg-[#1a253a] border border-[#9AA8BD]/20 rounded-lg transition-colors flex items-center gap-1.5"
            title="Download CSV Results"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            onClick={handleResetAllToDefault}
            className="p-2 text-[#9AA8BD] hover:text-white bg-[#121B2B] hover:bg-[#1a253a] border border-[#9AA8BD]/20 rounded-lg transition-colors"
            title="Reset all inputs to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preset Selector Chips if available */}
      {simulation.presets && simulation.presets.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[#9AA8BD] shrink-0 font-medium mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#35D9FF]" />
            Presets:
          </span>
          {simulation.presets.map((p) => {
            const isMatch = Object.entries(p.inputs).every(
              ([k, v]) => Math.abs((inputs[k] ?? 0) - v) < 1e-4
            );
            return (
              <button
                key={p.id}
                onClick={() => handleApplyPreset(p)}
                className={`px-3 py-1 rounded-lg border transition-colors whitespace-nowrap ${
                  isMatch
                    ? 'bg-[#35D9FF]/15 text-[#35D9FF] border-[#35D9FF]/40 font-semibold'
                    : 'bg-[#0E1422] text-[#9AA8BD] border-[#9AA8BD]/15 hover:text-white hover:border-[#9AA8BD]/30'
                }`}
                title={p.description}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Two-Zone Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Variable Controls Deck (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h2 className="text-sm font-bold text-[#F4F7FF]">
                Input Parameters
              </h2>
              <p className="text-xs text-[#9AA8BD]">
                Adjust sliders to immediately observe systemic recalculations.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {simulation.variables.map((variable) => (
              <VariableControl
                key={variable.id}
                variable={variable}
                value={inputs[variable.id] ?? variable.defaultValue}
                onChange={handleVariableChange}
                onReset={handleResetVariable}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Key Results, Interactive Charts & Analytical Insights (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Calculated Results Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#F4F7FF]">
                Calculated Outcomes
              </h2>
              <span className="text-[11px] font-mono text-[#38D996]">
                Instant Deterministic Engine
              </span>
            </div>

            {/* Primary Result Metric */}
            <ResultCard metric={result.primaryMetric} isPrimary={true} />

            {/* Secondary Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              {result.metrics.map((metric) => (
                <ResultCard key={metric.id} metric={metric} />
              ))}
            </div>
          </div>

          {/* Interactive Chart */}
          <ChartPanel config={result.chartConfig} data={result.chartData} />

          {/* Written Analytical Insights */}
          {result.insights && result.insights.length > 0 && (
            <div className="p-4 rounded-xl bg-[#0E1422] border border-[#9AA8BD]/15 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#35D9FF] block">
                Model Interpretations & Observations
              </span>
              <ul className="space-y-1.5 text-xs text-[#F4F7FF]/90">
                {result.insights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[#35D9FF] shrink-0 font-bold">›</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Scenario Comparison Section (if active) */}
      {compareMode && (
        <div className="pt-6 border-t border-[#9AA8BD]/15">
          <ScenarioComparisonView
            simulation={simulation}
            baselineName={baselineName}
            baselineInputs={baselineInputs}
            alternativeName={scenarioName}
            alternativeInputs={inputs}
            onPromoteAlternativeToBaseline={handleSetCurrentAsBaseline}
          />
        </div>
      )}

      {/* Model Assumptions, Transparent Formulas & Model Limitations Accordion */}
      <div className="rounded-xl border border-[#9AA8BD]/15 bg-[#0E1422] overflow-hidden">
        <button
          onClick={() => setShowAssumptions(!showAssumptions)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#121B2B]/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#35D9FF]" />
            <span className="text-xs font-semibold text-[#F4F7FF]">
              Mathematical Formulas, Assumptions & Model Boundaries
            </span>
          </div>
          {showAssumptions ? (
            <ChevronUp className="w-4 h-4 text-[#9AA8BD]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#9AA8BD]" />
          )}
        </button>

        {showAssumptions && (
          <div className="p-5 pt-0 border-t border-[#9AA8BD]/10 space-y-6 text-xs">
            {/* Transparent Formulas */}
            {simulation.formulas && simulation.formulas.length > 0 && (
              <div>
                <h4 className="font-semibold text-[#F4F7FF] uppercase tracking-wider text-[11px] mb-3">
                  Underlying Equations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {simulation.formulas.map((f, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#121B2B] border border-[#9AA8BD]/15">
                      <span className="font-semibold text-[#35D9FF] block text-[11px]">{f.name}</span>
                      <code className="block my-1.5 font-mono text-xs text-[#F4F7FF] bg-[#080B14] p-1.5 rounded border border-[#9AA8BD]/10">
                        {f.equation}
                      </code>
                      <p className="text-[11px] text-[#9AA8BD]">{f.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assumptions */}
            <div>
              <h4 className="font-semibold text-[#F4F7FF] uppercase tracking-wider text-[11px] mb-2">
                Explicit Working Assumptions
              </h4>
              <ul className="list-disc list-inside space-y-1 text-[#9AA8BD] leading-relaxed">
                {simulation.assumptions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Model Boundaries & Limitations */}
            <div>
              <h4 className="font-semibold text-[#FFBD59] uppercase tracking-wider text-[11px] mb-2">
                Model Boundaries & Real-World Exclusions
              </h4>
              <ul className="list-disc list-inside space-y-1 text-[#9AA8BD] leading-relaxed">
                {simulation.limitations.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Save Scenario Modal */}
      <SaveScenarioModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveScenario}
        initialName={scenarioName}
      />
    </div>
  );
};

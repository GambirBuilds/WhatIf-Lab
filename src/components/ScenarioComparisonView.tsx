import React from 'react';
import { SimulationDefinition } from '../engine/types';
import { compareScenarios } from '../engine/compare';
import { formatDelta, formatNumber } from '../utils/formatters';
import { GitCompare, ArrowRight, Download, Check } from 'lucide-react';
import { ExportImportService } from '../services/exportImport';

interface ScenarioComparisonViewProps {
  simulation: SimulationDefinition;
  baselineName: string;
  baselineInputs: Record<string, number>;
  alternativeName: string;
  alternativeInputs: Record<string, number>;
  onPromoteAlternativeToBaseline?: () => void;
}

export const ScenarioComparisonView: React.FC<ScenarioComparisonViewProps> = ({
  simulation,
  baselineName,
  baselineInputs,
  alternativeName,
  alternativeInputs,
  onPromoteAlternativeToBaseline,
}) => {
  const baselineResult = simulation.calculate(baselineInputs);
  const altResult = simulation.calculate(alternativeInputs);

  const report = compareScenarios(
    baselineName,
    baselineInputs,
    [baselineResult.primaryMetric, ...baselineResult.metrics],
    alternativeName,
    alternativeInputs,
    [altResult.primaryMetric, ...altResult.metrics],
    simulation.variables
  );

  const handleExportCSV = () => {
    const combinedOutputs: Record<string, any> = {};
    report.metricDiffs.forEach((m) => {
      combinedOutputs[`${m.label} (Baseline)`] = m.baselineFormatted;
      combinedOutputs[`${m.label} (${alternativeName})`] = m.alternativeFormatted;
      combinedOutputs[`${m.label} Delta`] = `${m.absoluteDelta > 0 ? '+' : ''}${m.absoluteDelta} ${m.unit || ''}`;
    });

    ExportImportService.exportResultsAsCSV(
      simulation.title,
      `${baselineName} vs ${alternativeName}`,
      alternativeInputs,
      combinedOutputs,
      `comparison_${simulation.id}.csv`
    );
  };

  return (
    <div className="bg-[#0E1422] rounded-2xl border border-[#9AA8BD]/20 p-5 sm:p-6 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#9AA8BD]/15">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#7C5CFC]/20 text-[#7C5CFC] flex items-center justify-center">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F4F7FF]">
              Scenario Comparison Engine
            </h3>
            <p className="text-xs text-[#9AA8BD]">
              {report.changedInputsCount === 0
                ? 'Both scenarios currently have identical parameters.'
                : `${report.changedInputsCount} input parameter${report.changedInputsCount > 1 ? 's' : ''} modified between scenarios.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onPromoteAlternativeToBaseline && (
            <button
              onClick={onPromoteAlternativeToBaseline}
              className="px-3 py-1.5 text-xs font-medium text-[#F4F7FF] bg-[#121B2B] hover:bg-[#1a253a] border border-[#9AA8BD]/20 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-[#35D9FF]" />
              Set as New Baseline
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-medium text-[#35D9FF] bg-[#35D9FF]/10 hover:bg-[#35D9FF]/20 border border-[#35D9FF]/30 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Comparison CSV
          </button>
        </div>
      </div>

      {/* Analytical Narrative Box */}
      {report.summaryNarrative.length > 0 && (
        <div className="p-4 rounded-xl bg-[#121B2B] border border-[#7C5CFC]/30 text-xs text-[#F4F7FF] space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#35D9FF] block">
            Analytical Insight & Variance
          </span>
          {report.summaryNarrative.map((item, idx) => (
            <p key={idx} className="leading-relaxed text-[#F4F7FF]/90">
              {item}
            </p>
          ))}
        </div>
      )}

      {/* Side-by-Side Key Metrics Table */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#9AA8BD] mb-3">
          Output Variance Analysis
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#9AA8BD]/15 text-[#9AA8BD]">
                <th className="py-2.5 px-3 font-medium">Metric</th>
                <th className="py-2.5 px-3 font-medium text-right">{baselineName} (Baseline)</th>
                <th className="py-2.5 px-3 font-medium text-right">{alternativeName}</th>
                <th className="py-2.5 px-3 font-medium text-right">Absolute Delta</th>
                <th className="py-2.5 px-3 font-medium text-right">Relative Shift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#9AA8BD]/10 font-mono">
              {report.metricDiffs.map((diff) => {
                const deltaObj = formatDelta(diff.absoluteDelta, diff.unit || '');
                const pctStr =
                  diff.percentChange !== null
                    ? `${diff.percentChange > 0 ? '+' : ''}${(diff.percentChange * 100).toFixed(1)}%`
                    : 'N/A';

                const sentimentClass =
                  diff.sentiment === 'positive'
                    ? 'text-[#38D996]'
                    : diff.sentiment === 'negative'
                    ? 'text-[#FF647C]'
                    : 'text-[#9AA8BD]';

                return (
                  <tr key={diff.metricId} className="hover:bg-[#121B2B]/60 transition-colors">
                    <td className="py-2.5 px-3 text-[#F4F7FF] font-sans font-medium">
                      {diff.label}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#9AA8BD]">
                      {diff.baselineFormatted}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#F4F7FF] font-semibold">
                      {diff.alternativeFormatted}
                    </td>
                    <td className={`py-2.5 px-3 text-right ${sentimentClass}`}>
                      {deltaObj.text}
                    </td>
                    <td className={`py-2.5 px-3 text-right ${sentimentClass}`}>
                      {pctStr}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Input Differences Breakdown */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#9AA8BD] mb-3">
          Variable Modifications
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {report.inputDiffs.map((diff) => {
            return (
              <div
                key={diff.variableId}
                className={`p-3 rounded-xl border text-xs transition-colors ${
                  diff.hasChanged
                    ? 'bg-[#121B2B] border-[#35D9FF]/40 shadow-sm'
                    : 'bg-[#121B2B]/40 border-[#9AA8BD]/10 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-[#F4F7FF]">{diff.label}</span>
                  {diff.hasChanged && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#35D9FF]/20 text-[#35D9FF] font-mono">
                      Shifted
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between font-mono text-[11px] text-[#9AA8BD] mt-2">
                  <span>
                    Baseline: <strong className="text-[#F4F7FF]">{diff.baselineValue}</strong> {diff.unit}
                  </span>
                  <ArrowRight className="w-3 h-3 text-[#9AA8BD]" />
                  <span>
                    Alt: <strong className="text-[#35D9FF]">{diff.alternativeValue}</strong> {diff.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

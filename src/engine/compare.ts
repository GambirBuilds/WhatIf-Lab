/**
 * Scenario Comparison Engine
 * Computes side-by-side delta, percent change, highlights changed inputs,
 * and generates human-readable analytical explanations.
 */

import { OutputMetric, VariableDefinition } from './types';
import { formatNumber, formatPercent } from '../utils/formatters';

export interface InputDiff {
  variableId: string;
  label: string;
  unit: string;
  baselineValue: number;
  alternativeValue: number;
  delta: number;
  hasChanged: boolean;
}

export interface MetricDiff {
  metricId: string;
  label: string;
  unit?: string;
  baselineValue: number;
  alternativeValue: number;
  baselineFormatted: string;
  alternativeFormatted: string;
  absoluteDelta: number;
  percentChange: number | null; // null if baseline is zero
  isImprovement: boolean | null; // contextual: higher isn't always better
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface ScenarioComparisonReport {
  baselineName: string;
  alternativeName: string;
  inputDiffs: InputDiff[];
  changedInputsCount: number;
  metricDiffs: MetricDiff[];
  summaryNarrative: string[];
}

export function compareScenarios(
  baselineName: string,
  baselineInputs: Record<string, number>,
  baselineMetrics: OutputMetric[],
  alternativeName: string,
  alternativeInputs: Record<string, number>,
  alternativeMetrics: OutputMetric[],
  variableDefs: VariableDefinition[]
): ScenarioComparisonReport {
  // 1. Compute input diffs
  const inputDiffs: InputDiff[] = variableDefs.map((v) => {
    const bVal = baselineInputs[v.id] ?? v.defaultValue;
    const aVal = alternativeInputs[v.id] ?? v.defaultValue;
    const delta = aVal - bVal;
    return {
      variableId: v.id,
      label: v.label,
      unit: v.unit,
      baselineValue: bVal,
      alternativeValue: aVal,
      delta,
      hasChanged: Math.abs(delta) > 1e-6,
    };
  });

  const changedInputsCount = inputDiffs.filter((d) => d.hasChanged).length;

  // 2. Compute metric diffs
  const metricDiffs: MetricDiff[] = [];
  const narrative: string[] = [];

  for (const bMetric of baselineMetrics) {
    const aMetric = alternativeMetrics.find((m) => m.id === bMetric.id) || bMetric;
    const bVal = bMetric.value;
    const aVal = aMetric.value;
    const absDelta = aVal - bVal;

    let pctChange: number | null = null;
    if (Math.abs(bVal) > 1e-6) {
      pctChange = absDelta / Math.abs(bVal);
    }

    // Determine if higher is better or worse based on metric context
    // E.g., expenses, costs, debts, burnout hours, travel delays are negative when higher
    const lowerIsBetterTerms = ['cost', 'expense', 'debt', 'loss', 'burnout', 'delay', 'waste', 'emissions', 'interest paid'];
    const isLowerBetter = lowerIsBetterTerms.some((term) => bMetric.label.toLowerCase().includes(term));

    let isImprovement: boolean | null = null;
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';

    if (Math.abs(absDelta) > 1e-6) {
      if (isLowerBetter) {
        isImprovement = absDelta < 0;
      } else {
        isImprovement = absDelta > 0;
      }
      sentiment = isImprovement ? 'positive' : 'negative';
    }

    metricDiffs.push({
      metricId: bMetric.id,
      label: bMetric.label,
      unit: bMetric.unit,
      baselineValue: bVal,
      alternativeValue: aVal,
      baselineFormatted: bMetric.formattedValue,
      alternativeFormatted: aMetric.formattedValue,
      absoluteDelta: absDelta,
      percentChange: pctChange,
      isImprovement,
      sentiment,
    });
  }

  // 3. Generate summary narrative
  const primaryBaseline = baselineMetrics.find((m) => m.isPrimary) || baselineMetrics[0];
  const primaryAlt = alternativeMetrics.find((m) => m.id === primaryBaseline?.id) || alternativeMetrics[0];

  if (primaryBaseline && primaryAlt) {
    const delta = primaryAlt.value - primaryBaseline.value;
    const diff = metricDiffs.find((d) => d.metricId === primaryBaseline.id);

    if (Math.abs(delta) < 1e-4) {
      narrative.push(`Both scenarios yield the same primary outcome (${primaryBaseline.formattedValue}).`);
    } else {
      const dirWord = delta > 0 ? 'increases' : 'decreases';
      const pctStr = diff?.percentChange !== null && diff?.percentChange !== undefined
        ? ` (${delta > 0 ? '+' : ''}${formatPercent(diff.percentChange, 1)})`
        : '';
      narrative.push(
        `In ${alternativeName}, ${primaryBaseline.label.toLowerCase()} ${dirWord} to ${primaryAlt.formattedValue} compared to ${primaryBaseline.formattedValue} in ${baselineName}${pctStr}.`
      );
    }
  }

  // Highlight key changed drivers
  const changedList = inputDiffs.filter((d) => d.hasChanged);
  if (changedList.length === 0) {
    narrative.push('No input variables differ between these two scenarios.');
  } else if (changedList.length <= 3) {
    const changesStr = changedList
      .map((c) => `${c.label} (${c.delta > 0 ? '+' : ''}${formatNumber(c.delta)} ${c.unit})`)
      .join(', ');
    narrative.push(`Key input adjustments: ${changesStr}.`);
  } else {
    narrative.push(`${changedList.length} variables modified across the scenario parameters.`);
  }

  return {
    baselineName,
    alternativeName,
    inputDiffs,
    changedInputsCount,
    metricDiffs,
    summaryNarrative: narrative,
  };
}

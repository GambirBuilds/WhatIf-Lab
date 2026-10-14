/**
 * Simulation Engine Core Type Definitions
 */

export type SimulationCategory = 'business' | 'finance' | 'city' | 'life' | 'science' | 'custom';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type ModelType = 'Analytical Model' | 'Illustrative Model' | 'Empirical Approximation';

export interface VariableDefinition {
  id: string;
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  formatType: 'currency' | 'number' | 'percent' | 'raw';
  decimals?: number;
}

export interface OutputMetric {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  unit?: string;
  isPrimary?: boolean;
  sentiment?: 'positive' | 'negative' | 'neutral' | 'highlight';
  explanation?: string;
}

export interface ChartSeries {
  dataKey: string;
  name: string;
  color: string;
  type?: 'bar' | 'line' | 'area';
  yAxisId?: string;
}

export interface ChartConfig {
  title: string;
  description?: string;
  type: 'line' | 'bar' | 'area' | 'composed';
  xAxisKey: string;
  xAxisLabel: string;
  yAxisLabel: string;
  series: ChartSeries[];
}

export interface FormulaExplanation {
  name: string;
  equation: string;
  explanation: string;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  inputs: Record<string, number>;
}

export interface SimulationResult {
  primaryMetric: OutputMetric;
  metrics: OutputMetric[];
  chartData: any[];
  chartConfig: ChartConfig;
  secondaryChartConfig?: ChartConfig;
  insights: string[];
  rawOutputs?: Record<string, number>;
}

export interface SimulationDefinition {
  id: string;
  title: string;
  tagline: string;
  category: SimulationCategory;
  categoryLabel: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  modelType: ModelType;
  iconName: string;
  description: string;
  variables: VariableDefinition[];
  presets: Preset[];
  assumptions: string[];
  limitations: string[];
  formulas: FormulaExplanation[];
  calculate: (inputs: Record<string, number>) => SimulationResult;
}

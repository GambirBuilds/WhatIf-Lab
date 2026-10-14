/**
 * Automated Unit Test Suite for Simulation Engine and Critical Formulas
 * Tests edge cases, zero division, boundaries, formula parser, storage, and comparison.
 */

import { coffeeShopSimulation } from '../simulations/business/coffeeShop';
import { compoundGrowthSimulation } from '../simulations/finance/compoundGrowth';
import { loanRepaymentSimulation } from '../simulations/finance/loanRepayment';
import { projectileMotionSimulation } from '../simulations/science/projectileMotion';
import { evaluateSafeFormula } from './safeFormulaParser';
import { compareScenarios } from './compare';
import { formatCurrency, formatPercent, formatDelta } from '../utils/formatters';
import { ExportImportService } from '../services/exportImport';

export interface TestCaseResult {
  id: string;
  suite: string;
  name: string;
  passed: boolean;
  expected?: any;
  actual?: any;
  error?: string;
  durationMs: number;
}

export interface TestSuiteSummary {
  total: number;
  passed: number;
  failed: number;
  durationMs: number;
  results: TestCaseResult[];
}

export function runAllEngineTests(): TestSuiteSummary {
  const startTime = performance.now();
  const results: TestCaseResult[] = [];

  function assert(suite: string, name: string, fn: () => boolean | void) {
    const t0 = performance.now();
    try {
      const res = fn();
      const passed = res !== false;
      results.push({
        id: 'test-' + Math.random().toString(36).substring(2, 8),
        suite,
        name,
        passed,
        durationMs: Math.round((performance.now() - t0) * 100) / 100,
      });
    } catch (e: any) {
      results.push({
        id: 'test-' + Math.random().toString(36).substring(2, 8),
        suite,
        name,
        passed: false,
        error: e.message || String(e),
        durationMs: Math.round((performance.now() - t0) * 100) / 100,
      });
    }
  }

  // Suite 1: Coffee Shop Business Model Formulas
  assert('Business Engine', 'Calculates monthly units sold correctly', () => {
    const res = coffeeShopSimulation.calculate({
      unitsPerDay: 200,
      operatingDays: 25,
      pricePerUnit: 5.0,
      costPerUnit: 1.0,
      fixedExpenses: 10000,
      adSpend: 500,
    });
    const revMetric = res.metrics.find((m) => m.id === 'monthlyRevenue');
    // 200 * 25 * $5 = $25,000
    if (revMetric?.value !== 25000) throw new Error(`Expected $25,000, got ${revMetric?.value}`);
  });

  assert('Business Engine', 'Calculates operating profit accurately with overhead', () => {
    const res = coffeeShopSimulation.calculate({
      unitsPerDay: 200,
      operatingDays: 25,
      pricePerUnit: 5.0,
      costPerUnit: 1.0,
      fixedExpenses: 10000,
      adSpend: 500,
    });
    // Units: 5000. Revenue: 25,000. VarCost: 5,000. Fixed: 10,000. Ad: 500. Total Cost: 15,500. Profit = 9,500.
    if (res.primaryMetric.value !== 9500) {
      throw new Error(`Expected profit 9500, got ${res.primaryMetric.value}`);
    }
  });

  assert('Business Engine', 'Handles zero and edge inputs safely without NaN', () => {
    const res = coffeeShopSimulation.calculate({
      unitsPerDay: 0,
      operatingDays: 0,
      pricePerUnit: 0,
      costPerUnit: 0,
      fixedExpenses: 0,
      adSpend: 0,
    });
    if (isNaN(res.primaryMetric.value) || !isFinite(res.primaryMetric.value)) {
      throw new Error('Produced NaN or Infinite operating result for zero inputs');
    }
  });

  // Suite 2: Compound Growth Formulas
  assert('Finance Engine', 'Computes compound growth without recurring contributions', () => {
    const res = compoundGrowthSimulation.calculate({
      initialDeposit: 10000,
      monthlyDeposit: 0,
      annualRate: 10,
      years: 1,
      inflationRate: 0,
    });
    // $10,000 * (1 + 0.10/12)^12 = 11047.13
    const nominal = res.primaryMetric.value;
    if (Math.abs(nominal - 11047.13) > 1.0) {
      throw new Error(`Expected ~11047.13, got ${nominal}`);
    }
  });

  assert('Finance Engine', 'Real purchasing power discounts inflation properly', () => {
    const res = compoundGrowthSimulation.calculate({
      initialDeposit: 10000,
      monthlyDeposit: 0,
      annualRate: 5,
      years: 10,
      inflationRate: 5,
    });
    const realMetric = res.metrics.find((m) => m.id === 'realBalance');
    if (!realMetric || isNaN(realMetric.value)) throw new Error('Missing realBalance metric');
    // If return rate ~ inflation rate, real purchasing power remains close to initial
    if (Math.abs(realMetric.value - 10000) > 300) {
      throw new Error(`Real balance deviated unexpectedly: ${realMetric.value}`);
    }
  });

  // Suite 3: Loan Amortization
  assert('Finance Engine', 'Calculates base monthly payment on standard 30-yr loan', () => {
    const res = loanRepaymentSimulation.calculate({
      loanAmount: 300000,
      interestRate: 6.0,
      termYears: 30,
      extraPayment: 0,
    });
    const basePmt = res.metrics.find((m) => m.id === 'basePayment')?.value || 0;
    // Standard PMT for $300k at 6% over 30 yrs is $1,798.65
    if (Math.abs(basePmt - 1798.65) > 1.0) {
      throw new Error(`Expected PMT ~$1,798.65, got ${basePmt}`);
    }
  });

  assert('Finance Engine', 'Extra monthly payment saves interest and shortens loan', () => {
    const res = loanRepaymentSimulation.calculate({
      loanAmount: 300000,
      interestRate: 6.0,
      termYears: 30,
      extraPayment: 300,
    });
    const interestSaved = res.primaryMetric.value;
    if (interestSaved <= 10000) {
      throw new Error(`Expected substantial interest savings > $10,000, got ${interestSaved}`);
    }
  });

  // Suite 4: Kinematics Projectile Physics
  assert('Science Engine', 'Calculates vacuum projectile range on Earth', () => {
    const res = projectileMotionSimulation.calculate({
      velocity: 30,
      angle: 45,
      initialHeight: 0,
      gravity: 9.81,
    });
    // R = v^2 * sin(2*theta) / g = 30^2 * 1 / 9.81 = 900 / 9.81 = 91.74m
    const range = res.primaryMetric.value;
    if (Math.abs(range - 91.74) > 0.5) {
      throw new Error(`Expected range ~91.74m, got ${range}`);
    }
  });

  assert('Science Engine', 'Lunar gravity increases range proportional to 1/g', () => {
    const earthRes = projectileMotionSimulation.calculate({ velocity: 20, angle: 45, initialHeight: 0, gravity: 9.81 });
    const moonRes = projectileMotionSimulation.calculate({ velocity: 20, angle: 45, initialHeight: 0, gravity: 1.62 });
    if (moonRes.primaryMetric.value <= earthRes.primaryMetric.value * 4) {
      throw new Error('Moon range should be roughly ~6x greater than Earth range');
    }
  });

  // Suite 5: Safe Formula Parser (No eval)
  assert('Formula Parser', 'Correctly evaluates arithmetic precedence and parentheses', () => {
    const res = evaluateSafeFormula('(10 + 5) * 2 - 4 / 2', {});
    if (res.error) throw new Error(res.error);
    if (res.result !== 28) throw new Error(`Expected 28, got ${res.result}`);
  });

  assert('Formula Parser', 'Substitutes user variables accurately', () => {
    const res = evaluateSafeFormula('price * volume - overhead', { price: 5, volume: 100, overhead: 200 });
    if (res.error) throw new Error(res.error);
    if (res.result !== 300) throw new Error(`Expected 300, got ${res.result}`);
  });

  assert('Formula Parser', 'Supports math functions min, max, sqrt, abs, pow', () => {
    const res = evaluateSafeFormula('max(10, sqrt(144)) + 2^3', {});
    if (res.error) throw new Error(res.error);
    // max(10, 12) + 8 = 12 + 8 = 20
    if (res.result !== 20) throw new Error(`Expected 20, got ${res.result}`);
  });

  assert('Formula Parser', 'Traps division by zero gracefully without throwing', () => {
    const res = evaluateSafeFormula('100 / 0', {});
    if (!res.error || !res.error.toLowerCase().includes('zero')) {
      throw new Error('Expected division by zero error string, got ' + JSON.stringify(res));
    }
  });

  assert('Formula Parser', 'Rejects syntax errors and unknown characters safely', () => {
    const res = evaluateSafeFormula('10 + * 5', {});
    if (!res.error) throw new Error('Expected syntax error for malformed expression');
  });

  // Suite 6: Scenario Comparison Engine
  assert('Comparison Engine', 'Safely calculates percent change when baseline is zero', () => {
    const baselineMetrics = [{ id: 'rev', label: 'Revenue', value: 0, formattedValue: 'Rs. 0' }];
    const altMetrics = [{ id: 'rev', label: 'Revenue', value: 5000, formattedValue: 'Rs. 5,000' }];
    const report = compareScenarios(
      'Baseline',
      {},
      baselineMetrics,
      'Alternative',
      {},
      altMetrics,
      []
    );
    const diff = report.metricDiffs[0];
    if (diff.percentChange !== null) {
      throw new Error(`Expected null percent change for zero baseline, got ${diff.percentChange}`);
    }
    if (diff.absoluteDelta !== 5000) {
      throw new Error(`Expected absolute delta 5000, got ${diff.absoluteDelta}`);
    }
  });

  // Suite 7: Formatters and Export Validation
  assert('Utilities', 'Formats currency and deltas accurately', () => {
    const c = formatCurrency(12500.5);
    if (c !== 'Rs. 12,501') throw new Error(`Unexpected currency formatting: ${c}`);
    const d = formatDelta(25, 'kg');
    if (d.text !== '+25 kg' || !d.isPositive) throw new Error(`Unexpected delta format: ${d.text}`);
  });

  assert('Import/Export', 'Validates corrupted JSON schema safely', () => {
    const validation = ExportImportService.validateAndParseScenarioJSON('{ bad json string ');
    if (validation.success) throw new Error('Should have rejected corrupted JSON');
  });

  const totalTime = Math.round(performance.now() - startTime);
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.length - passedCount;

  return {
    total: results.length,
    passed: passedCount,
    failed: failedCount,
    durationMs: totalTime,
    results,
  };
}

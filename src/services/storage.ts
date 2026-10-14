/**
 * LocalStorage Persistence Service for Scenarios and Experiment History
 */

export interface SavedScenario {
  id: string;
  simulationId: string;
  name: string;
  notes?: string;
  inputs: Record<string, number>;
  createdAt: number;
  updatedAt: number;
}

export interface ExperimentRecord {
  id: string;
  simulationId: string;
  simulationTitle: string;
  scenarioName: string;
  inputs: Record<string, number>;
  primaryOutput: {
    label: string;
    value: string;
  };
  timestamp: number;
}

const STORAGE_KEYS = {
  SCENARIOS: 'whatif_saved_scenarios_v2',
  HISTORY: 'whatif_experiment_history_v2',
  CUSTOM_MODELS: 'whatif_custom_models_v2',
};

// Default seed scenarios so users immediately have realistic presets to compare
const DEFAULT_PRESET_SCENARIOS: SavedScenario[] = [
  {
    id: 'preset-coffee-baseline',
    simulationId: 'coffee-shop',
    name: 'Kathmandu Valley Cafe Baseline',
    notes: 'Established weekday cafe foot traffic with typical espresso & latte pricing.',
    inputs: {
      unitsPerDay: 220,
      pricePerUnit: 260,
      costPerUnit: 75,
      fixedExpenses: 110000,
      operatingDays: 26,
      adSpend: 8000,
    },
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'preset-coffee-expansion',
    simulationId: 'coffee-shop',
    name: 'High-Volume Rush + Advertising',
    notes: 'Pushing throughput with Rs. 15k monthly digital/local ad spend and 350 cups/day.',
    inputs: {
      unitsPerDay: 350,
      pricePerUnit: 280,
      costPerUnit: 80,
      fixedExpenses: 180000,
      operatingDays: 28,
      adSpend: 15000,
    },
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'preset-compound-standard',
    simulationId: 'compound-growth',
    name: 'Systematic Investment Plan (SIP)',
    notes: 'Rs. 15,000/mo investing in diversified mutual funds & equities at 10% return.',
    inputs: {
      initialDeposit: 100000,
      monthlyDeposit: 15000,
      annualRate: 10.0,
      years: 20,
      inflationRate: 5.5,
    },
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'preset-compound-aggressive',
    simulationId: 'compound-growth',
    name: 'Aggressive Wealth Accumulation',
    notes: 'Rs. 40,000/mo savings rate over 15 years.',
    inputs: {
      initialDeposit: 300000,
      monthlyDeposit: 40000,
      annualRate: 11.5,
      years: 15,
      inflationRate: 5.5,
    },
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 86400000 * 1,
  },
];

export const StorageService = {
  getScenarios(): SavedScenario[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCENARIOS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(DEFAULT_PRESET_SCENARIOS));
        return DEFAULT_PRESET_SCENARIOS;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
      return DEFAULT_PRESET_SCENARIOS;
    } catch (e) {
      console.warn('LocalStorage error reading scenarios:', e);
      return DEFAULT_PRESET_SCENARIOS;
    }
  },

  getScenariosForSimulation(simulationId: string): SavedScenario[] {
    return this.getScenarios().filter((s) => s.simulationId === simulationId);
  },

  saveScenario(scenario: Omit<SavedScenario, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): SavedScenario {
    const list = this.getScenarios();
    const now = Date.now();
    let saved: SavedScenario;

    if (scenario.id) {
      const existingIdx = list.findIndex((s) => s.id === scenario.id);
      if (existingIdx >= 0) {
        saved = {
          ...list[existingIdx],
          ...scenario,
          id: scenario.id,
          updatedAt: now,
        };
        list[existingIdx] = saved;
      } else {
        saved = {
          ...scenario,
          id: scenario.id,
          createdAt: now,
          updatedAt: now,
        };
        list.unshift(saved);
      }
    } else {
      saved = {
        ...scenario,
        id: 'scen-' + Math.random().toString(36).substring(2, 9) + '-' + now.toString(36),
        createdAt: now,
        updatedAt: now,
      };
      list.unshift(saved);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save scenario to localStorage:', e);
    }
    return saved;
  },

  deleteScenario(id: string): boolean {
    try {
      const list = this.getScenarios().filter((s) => s.id !== id);
      localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(list));
      return true;
    } catch (e) {
      console.error('Failed to delete scenario:', e);
      return false;
    }
  },

  duplicateScenario(id: string, newName?: string): SavedScenario | null {
    const list = this.getScenarios();
    const target = list.find((s) => s.id === id);
    if (!target) return null;

    const duplicated: SavedScenario = {
      ...target,
      id: 'scen-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36),
      name: newName || `${target.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    list.unshift(duplicated);
    try {
      localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to persist duplicated scenario:', e);
    }
    return duplicated;
  },

  // Experiment History
  getHistory(): ExperimentRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('LocalStorage error reading history:', e);
      return [];
    }
  },

  recordExperiment(record: Omit<ExperimentRecord, 'id' | 'timestamp'>): ExperimentRecord {
    const history = this.getHistory();
    const entry: ExperimentRecord = {
      ...record,
      id: 'exp-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36),
      timestamp: Date.now(),
    };
    // Keep max 50 recent records
    const updated = [entry, ...history.slice(0, 49)];
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to record experiment history:', e);
    }
    return entry;
  },

  clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  },

  deleteHistoryItem(id: string): void {
    try {
      const updated = this.getHistory().filter((h) => h.id !== id);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete history item:', e);
    }
  },
};

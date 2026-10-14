/**
 * Export and Import Service with JSON/CSV support and strict schema validation
 */

import { SavedScenario } from './storage';

export const ExportImportService = {
  exportScenariosAsJSON(scenarios: SavedScenario[], filename = 'whatif_scenarios.json'): void {
    const payload = {
      app: 'WhatIf Lab',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      count: scenarios.length,
      scenarios,
    };
    const jsonStr = JSON.stringify(payload, null, 2);
    this.downloadFile(jsonStr, filename, 'application/json');
  },

  exportSingleScenarioAsJSON(scenario: SavedScenario): void {
    const sanitizedName = scenario.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    this.exportScenariosAsJSON([scenario], `whatif_${sanitizedName}.json`);
  },

  exportResultsAsCSV(
    simulationTitle: string,
    scenarioName: string,
    inputs: Record<string, number>,
    outputs: Record<string, any>,
    filename = 'simulation_results.csv'
  ): void {
    const rows: string[][] = [
      ['WhatIf Lab Simulation Report'],
      ['Simulation', simulationTitle],
      ['Scenario', scenarioName],
      ['Exported At', new Date().toISOString()],
      [],
      ['INPUTS', 'Value'],
      ...Object.entries(inputs).map(([k, v]) => [k, String(v)]),
      [],
      ['OUTPUTS', 'Value', 'Unit / Metric'],
      ...Object.entries(outputs).map(([k, v]) => {
        if (typeof v === 'object' && v !== null && 'value' in v) {
          return [v.label || k, String(v.value), v.unit || ''];
        }
        return [k, String(v), ''];
      }),
    ];

    const csvContent = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    this.downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
  },

  downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  validateAndParseScenarioJSON(jsonString: string): {
    success: boolean;
    scenarios?: SavedScenario[];
    error?: string;
  } {
    try {
      const parsed = JSON.parse(jsonString);
      let list: any[] = [];

      if (Array.isArray(parsed)) {
        list = parsed;
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.scenarios)) {
        list = parsed.scenarios;
      } else if (parsed && typeof parsed === 'object' && parsed.simulationId && parsed.inputs) {
        list = [parsed];
      } else {
        return {
          success: false,
          error: 'Unrecognized JSON structure. Expected WhatIf Lab scenarios array or export bundle.',
        };
      }

      const validScenarios: SavedScenario[] = [];

      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (!item || typeof item !== 'object') {
          return { success: false, error: `Item ${i + 1} is not a valid JSON object.` };
        }
        if (!item.simulationId || typeof item.simulationId !== 'string') {
          return { success: false, error: `Item ${i + 1} is missing a valid simulationId.` };
        }
        if (!item.inputs || typeof item.inputs !== 'object' || Array.isArray(item.inputs)) {
          return { success: false, error: `Item ${i + 1} has invalid or missing inputs object.` };
        }

        // Validate numeric inputs
        const sanitizedInputs: Record<string, number> = {};
        for (const [k, v] of Object.entries(item.inputs)) {
          const num = Number(v);
          if (isNaN(num)) {
            return {
              success: false,
              error: `Input "${k}" in scenario "${item.name || i + 1}" is not a valid number.`,
            };
          }
          sanitizedInputs[k] = num;
        }

        validScenarios.push({
          id: item.id || 'imported-' + Math.random().toString(36).substring(2, 9),
          simulationId: item.simulationId,
          name: typeof item.name === 'string' && item.name.trim() ? item.name.trim() : `Imported Scenario ${i + 1}`,
          notes: typeof item.notes === 'string' ? item.notes : '',
          inputs: sanitizedInputs,
          createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
          updatedAt: Date.now(),
        });
      }

      return { success: true, scenarios: validScenarios };
    } catch (e: any) {
      return {
        success: false,
        error: `JSON parse error: ${e.message || 'Invalid JSON syntax'}`,
      };
    }
  },
};

import React, { useState } from 'react';
import { evaluateSafeFormula } from '../engine/safeFormulaParser';
import { Sparkles, Plus, Trash2, Play, AlertCircle, CheckCircle2, Bookmark, HelpCircle } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

interface CustomVar {
  id: string;
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit: string;
}

interface CustomFormula {
  id: string;
  label: string;
  expression: string;
  unit: string;
}

export const CustomExperimentView: React.FC<{ onSaveToScenarios?: (customModel: any) => void }> = () => {
  const [modelTitle, setModelTitle] = useState('My Custom Model');
  const [modelDescription, setModelDescription] = useState('Experiment with custom mathematical formulas and variables.');

  const [variables, setVariables] = useState<CustomVar[]>([
    { id: 'v1', name: 'price', label: 'Unit Price', min: 10, max: 2000, step: 10, value: 350, unit: 'Rs.' },
    { id: 'v2', name: 'units', label: 'Units Sold', min: 10, max: 2000, step: 10, value: 400, unit: 'items' },
    { id: 'v3', name: 'cost_pct', label: 'Cost Ratio', min: 0.1, max: 0.9, step: 0.05, value: 0.35, unit: 'ratio' },
    { id: 'v4', name: 'fixed', label: 'Fixed Overhead', min: 5000, max: 150000, step: 1000, value: 45000, unit: 'Rs.' },
  ]);

  const [formulas, setFormulas] = useState<CustomFormula[]>([
    { id: 'f1', label: 'Gross Revenue', expression: 'price * units', unit: 'Rs.' },
    { id: 'f2', label: 'Total Variable Costs', expression: 'price * units * cost_pct', unit: 'Rs.' },
    { id: 'f3', label: 'Estimated Net Operating Profit', expression: '(price * units) - (price * units * cost_pct) - fixed', unit: 'Rs.' },
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Compute variable dictionary
  const varDict: Record<string, number> = {};
  variables.forEach((v) => {
    varDict[v.name] = v.value;
  });

  const handleVarChange = (id: string, newVal: number) => {
    setVariables((prev) => prev.map((v) => (v.id === id ? { ...v, value: newVal } : v)));
  };

  const handleAddVar = () => {
    const nextIdx = variables.length + 1;
    const newName = `x_${nextIdx}`;
    setVariables((prev) => [
      ...prev,
      {
        id: 'var-' + Date.now(),
        name: newName,
        label: `Variable ${nextIdx}`,
        min: 0,
        max: 100,
        step: 1,
        value: 10,
        unit: 'units',
      },
    ]);
  };

  const handleRemoveVar = (id: string) => {
    setVariables((prev) => prev.filter((v) => v.id !== id));
  };

  const handleAddFormula = () => {
    setFormulas((prev) => [
      ...prev,
      {
        id: 'form-' + Date.now(),
        label: `Output Metric ${prev.length + 1}`,
        expression: 'price * 1.5',
        unit: 'units',
      },
    ]);
  };

  const handleRemoveFormula = (id: string) => {
    setFormulas((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#9AA8BD]/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#35D9FF]">
              World 6 · Sandbox Environment
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#F4F7FF] tracking-tight mt-1">
            Custom Experiment Builder
          </h1>
          <p className="text-xs text-[#9AA8BD] mt-1">
            Define custom variables and mathematical formulas evaluated via a safe expression grammar (no eval).
          </p>
        </div>

        <button
          onClick={() => {
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 3000);
          }}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#7C5CFC] hover:bg-[#6b47fa] rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          {savedSuccess ? <CheckCircle2 className="w-4 h-4 text-[#38D996]" /> : <Bookmark className="w-4 h-4" />}
          {savedSuccess ? 'Configuration Saved!' : 'Save Model Sandbox'}
        </button>
      </div>

      {/* Model Metadata */}
      <div className="bg-[#0E1422] rounded-xl border border-[#9AA8BD]/15 p-5 space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#F4F7FF]">
          Model Specifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#9AA8BD] mb-1">Model Title</label>
            <input
              type="text"
              value={modelTitle}
              onChange={(e) => setModelTitle(e.target.value)}
              className="w-full bg-[#121B2B] border border-[#9AA8BD]/25 rounded-lg px-3 py-2 text-xs text-[#F4F7FF] focus:outline-none focus:border-[#35D9FF]"
            />
          </div>
          <div>
            <label className="block text-xs text-[#9AA8BD] mb-1">Description / Notes</label>
            <input
              type="text"
              value={modelDescription}
              onChange={(e) => setModelDescription(e.target.value)}
              className="w-full bg-[#121B2B] border border-[#9AA8BD]/25 rounded-lg px-3 py-2 text-xs text-[#F4F7FF] focus:outline-none focus:border-[#35D9FF]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Variable Definitions & Live Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#F4F7FF]">
              Input Variables ({variables.length})
            </h2>
            <button
              onClick={handleAddVar}
              className="text-xs font-medium text-[#35D9FF] hover:text-white flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Variable
            </button>
          </div>

          <div className="space-y-4">
            {variables.map((v) => (
              <div
                key={v.id}
                className="bg-[#121B2B] rounded-xl border border-[#9AA8BD]/15 p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#080B14] border border-[#9AA8BD]/20 text-[#35D9FF]">
                      {v.name}
                    </span>
                    <input
                      type="text"
                      value={v.label}
                      onChange={(e) =>
                        setVariables((prev) =>
                          prev.map((item) => (item.id === v.id ? { ...item, label: e.target.value } : item))
                        )
                      }
                      className="bg-transparent text-sm font-semibold text-[#F4F7FF] border-b border-transparent hover:border-[#9AA8BD]/30 focus:border-[#35D9FF] focus:outline-none px-1"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#9AA8BD]">Unit:</span>
                    <input
                      type="text"
                      value={v.unit}
                      onChange={(e) =>
                        setVariables((prev) =>
                          prev.map((item) => (item.id === v.id ? { ...item, unit: e.target.value } : item))
                        )
                      }
                      className="w-14 bg-[#080B14] border border-[#9AA8BD]/20 rounded px-1.5 py-0.5 text-xs text-[#F4F7FF] font-mono text-center focus:outline-none"
                    />
                    {variables.length > 1 && (
                      <button
                        onClick={() => handleRemoveVar(v.id)}
                        className="p-1 text-[#9AA8BD] hover:text-[#FF647C] transition-colors"
                        title="Delete variable"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Slider + Numeric Box */}
                <div className="flex items-center gap-4 pt-1">
                  <div className="flex-1">
                    <input
                      type="range"
                      min={v.min}
                      max={v.max}
                      step={v.step}
                      value={v.value}
                      onChange={(e) => handleVarChange(v.id, parseFloat(e.target.value))}
                      className="w-full accent-[#35D9FF]"
                    />
                    <div className="flex justify-between text-[10px] text-[#9AA8BD]/70 font-mono mt-1">
                      <span>min: {v.min}</span>
                      <span>max: {v.max}</span>
                    </div>
                  </div>

                  <div className="w-24 shrink-0">
                    <input
                      type="number"
                      min={v.min}
                      max={v.max}
                      step={v.step}
                      value={v.value}
                      onChange={(e) => handleVarChange(v.id, parseFloat(e.target.value))}
                      className="w-full bg-[#080B14] border border-[#9AA8BD]/25 rounded-lg px-2.5 py-1 text-right text-xs font-mono text-[#F4F7FF] focus:outline-none focus:border-[#35D9FF]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Safe Formula Grammar Reference */}
          <div className="p-4 rounded-xl bg-[#0E1422] border border-[#9AA8BD]/15 text-xs text-[#9AA8BD] space-y-2">
            <div className="flex items-center gap-1.5 text-[#F4F7FF] font-semibold">
              <HelpCircle className="w-4 h-4 text-[#35D9FF]" />
              <span>Safe Formula Grammar & Supported Syntax</span>
            </div>
            <p>
              Use variable identifiers inside equations. Operators: <code className="text-[#35D9FF]">+</code>,{' '}
              <code className="text-[#35D9FF]">-</code>, <code className="text-[#35D9FF]">*</code>,{' '}
              <code className="text-[#35D9FF]">/</code>, <code className="text-[#35D9FF]">^</code> (exponent).
            </p>
            <p>
              Safe functions: <code className="text-[#35D9FF]">sqrt(x)</code>, <code className="text-[#35D9FF]">min(a,b)</code>,{' '}
              <code className="text-[#35D9FF]">max(a,b)</code>, <code className="text-[#35D9FF]">abs(x)</code>,{' '}
              <code className="text-[#35D9FF]">round(x)</code>.
            </p>
          </div>
        </div>

        {/* Right Column: Formulas & Live Evaluated Results (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#F4F7FF]">
              Output Formulas & Live Results
            </h2>
            <button
              onClick={handleAddFormula}
              className="text-xs font-medium text-[#35D9FF] hover:text-white flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Formula
            </button>
          </div>

          <div className="space-y-4">
            {formulas.map((form) => {
              const evalRes = evaluateSafeFormula(form.expression, varDict);
              const hasError = !!evalRes.error;

              return (
                <div
                  key={form.id}
                  className={`rounded-xl border p-4 transition-colors ${
                    hasError ? 'bg-[#FF647C]/5 border-[#FF647C]/40' : 'bg-[#121B2B] border-[#9AA8BD]/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <input
                      type="text"
                      value={form.label}
                      onChange={(e) =>
                        setFormulas((prev) =>
                          prev.map((item) => (item.id === form.id ? { ...item, label: e.target.value } : item))
                        )
                      }
                      className="bg-transparent text-xs font-semibold text-[#F4F7FF] border-b border-transparent hover:border-[#9AA8BD]/30 focus:border-[#35D9FF] focus:outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={form.unit}
                        onChange={(e) =>
                          setFormulas((prev) =>
                            prev.map((item) => (item.id === form.id ? { ...item, unit: e.target.value } : item))
                          )
                        }
                        className="w-12 bg-[#080B14] border border-[#9AA8BD]/20 rounded px-1.5 py-0.5 text-[11px] text-[#9AA8BD] text-center font-mono focus:outline-none"
                        placeholder="unit"
                      />
                      {formulas.length > 1 && (
                        <button
                          onClick={() => handleRemoveFormula(form.id)}
                          className="p-1 text-[#9AA8BD] hover:text-[#FF647C] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Formula Expression Input */}
                  <div className="mb-3">
                    <label className="block text-[11px] text-[#9AA8BD] mb-1">Equation</label>
                    <input
                      type="text"
                      value={form.expression}
                      onChange={(e) =>
                        setFormulas((prev) =>
                          prev.map((item) => (item.id === form.id ? { ...item, expression: e.target.value } : item))
                        )
                      }
                      className="w-full bg-[#080B14] border border-[#9AA8BD]/25 rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#F4F7FF] focus:outline-none focus:border-[#35D9FF]"
                    />
                  </div>

                  {/* Computed Output Result */}
                  <div className="pt-2 border-t border-[#9AA8BD]/10 flex items-center justify-between">
                    <span className="text-[11px] text-[#9AA8BD]">Computed Value:</span>
                    {hasError ? (
                      <span className="text-xs text-[#FF647C] font-mono flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {evalRes.error}
                      </span>
                    ) : (
                      <span className="text-lg font-bold font-mono text-[#35D9FF]">
                        {formatNumber(evalRes.result, 2)} {form.unit}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

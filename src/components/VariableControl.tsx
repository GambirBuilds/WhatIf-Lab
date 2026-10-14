import React from 'react';
import { VariableDefinition } from '../engine/types';
import { RotateCcw } from 'lucide-react';

interface VariableControlProps {
  variable: VariableDefinition;
  value: number;
  onChange: (id: string, value: number) => void;
  onReset?: (id: string) => void;
}

export const VariableControl: React.FC<VariableControlProps> = ({
  variable,
  value,
  onChange,
  onReset,
}) => {
  const isModified = Math.abs(value - variable.defaultValue) > 1e-4;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) onChange(variable.id, val);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      onChange(variable.id, Math.min(variable.max, Math.max(variable.min, val)));
    }
  };

  return (
    <div className="bg-[#121B2B] rounded-xl border border-[#9AA8BD]/15 p-4 hover:border-[#7C5CFC]/40 transition-colors group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <label
            htmlFor={`input-${variable.id}`}
            className="text-sm font-semibold text-[#F4F7FF] flex items-center gap-1.5 cursor-pointer"
          >
            {variable.label}
            {variable.unit && (
              <span className="text-xs font-normal text-[#9AA8BD]">
                ({variable.unit})
              </span>
            )}
          </label>
          <p className="text-xs text-[#9AA8BD] mt-0.5 leading-relaxed">
            {variable.description}
          </p>
        </div>

        {isModified && onReset && (
          <button
            onClick={() => onReset(variable.id)}
            title="Reset to default value"
            className="p-1 text-[#9AA8BD] hover:text-[#35D9FF] rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center gap-3">
        {/* Synchronized Slider */}
        <div className="flex-1">
          <input
            type="range"
            min={variable.min}
            max={variable.max}
            step={variable.step}
            value={value}
            onChange={handleSliderChange}
            className="w-full cursor-pointer accent-[#35D9FF]"
            aria-label={`${variable.label} slider`}
          />
          <div className="flex justify-between items-center text-[10px] text-[#9AA8BD]/70 font-mono mt-1">
            <span>{variable.min} {variable.unit}</span>
            <span>{variable.max} {variable.unit}</span>
          </div>
        </div>

        {/* Synchronized Numeric Input */}
        <div className="w-28 shrink-0">
          <input
            id={`input-${variable.id}`}
            type="number"
            min={variable.min}
            max={variable.max}
            step={variable.step}
            value={value}
            onChange={handleNumberChange}
            className="w-full bg-[#080B14] border border-[#9AA8BD]/25 rounded-lg px-2.5 py-1.5 text-right text-sm font-mono text-[#F4F7FF] focus:outline-none focus:border-[#35D9FF] focus:ring-1 focus:ring-[#35D9FF] transition-all"
          />
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { OutputMetric } from '../engine/types';

interface ResultCardProps {
  metric: OutputMetric;
  isPrimary?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ metric, isPrimary = false }) => {
  const getSentimentStyles = () => {
    switch (metric.sentiment) {
      case 'positive':
        return {
          textColor: 'text-[#38D996]',
          border: 'border-[#38D996]/30',
          bgGlow: 'bg-[#38D996]/5',
        };
      case 'negative':
        return {
          textColor: 'text-[#FF647C]',
          border: 'border-[#FF647C]/30',
          bgGlow: 'bg-[#FF647C]/5',
        };
      case 'highlight':
        return {
          textColor: 'text-[#35D9FF]',
          border: 'border-[#35D9FF]/30',
          bgGlow: 'bg-[#35D9FF]/5',
        };
      default:
        return {
          textColor: 'text-[#F4F7FF]',
          border: 'border-[#9AA8BD]/20',
          bgGlow: 'bg-transparent',
        };
    }
  };

  const sentiment = getSentimentStyles();

  if (isPrimary || metric.isPrimary) {
    return (
      <div className={`p-5 rounded-xl border ${sentiment.border} ${sentiment.bgGlow} bg-[#121B2B] shadow-lg relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#7C5CFC]/15 to-[#35D9FF]/15 blur-2xl pointer-events-none" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[#9AA8BD]">
          Key Calculated Outcome
        </span>
        <h3 className="text-sm font-medium text-[#F4F7FF] mt-1">
          {metric.label}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={`text-3xl font-extrabold font-mono tracking-tight ${sentiment.textColor}`}>
            {metric.formattedValue}
          </span>
          {metric.unit && (
            <span className="text-xs text-[#9AA8BD]">{metric.unit}</span>
          )}
        </div>
        {metric.explanation && (
          <p className="mt-2 text-xs text-[#9AA8BD] leading-relaxed">
            {metric.explanation}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl border ${sentiment.border} bg-[#121B2B] hover:border-[#9AA8BD]/35 transition-colors`}>
      <span className="text-xs text-[#9AA8BD] block font-medium">
        {metric.label}
      </span>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className={`text-xl font-bold font-mono tracking-tight ${sentiment.textColor}`}>
          {metric.formattedValue}
        </span>
        {metric.unit && (
          <span className="text-[11px] text-[#9AA8BD]">{metric.unit}</span>
        )}
      </div>
      {metric.explanation && (
        <p className="mt-1 text-[11px] text-[#9AA8BD]/80 line-clamp-2">
          {metric.explanation}
        </p>
      )}
    </div>
  );
};

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartConfig } from '../engine/types';
import { formatNumber } from '../utils/formatters';

interface ChartPanelProps {
  config: ChartConfig;
  data: any[];
}

export const ChartPanel: React.FC<ChartPanelProps> = ({ config, data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#121B2B] rounded-xl border border-[#9AA8BD]/15 p-8 text-center text-[#9AA8BD] text-xs">
        No visual data generated for this parameter range.
      </div>
    );
  }

  const renderChart = () => {
    switch (config.type) {
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 15, right: 25, left: 10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#9AA8BD" strokeOpacity={0.12} />
            <XAxis
              dataKey={config.xAxisKey}
              stroke="#9AA8BD"
              fontSize={11}
              tickLine={false}
              label={{ value: config.xAxisLabel, position: 'insideBottom', offset: -15, fill: '#9AA8BD', fontSize: 11 }}
            />
            <YAxis
              stroke="#9AA8BD"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => formatNumber(v)}
              label={{ value: config.yAxisLabel, angle: -90, position: 'insideLeft', offset: 0, fill: '#9AA8BD', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0E1422',
                borderColor: 'rgba(154, 168, 189, 0.25)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#F4F7FF',
              }}
              formatter={(value: any, name: any) => [formatNumber(Number(value)), name]}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />
            {config.series.map((s) => (
              <Bar key={s.dataKey} dataKey={s.dataKey} name={s.name} fill={s.color} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 15, right: 25, left: 10, bottom: 25 }}>
            <defs>
              {config.series.map((s) => (
                <linearGradient key={s.dataKey} id={`grad-${s.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0.0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#9AA8BD" strokeOpacity={0.12} />
            <XAxis
              dataKey={config.xAxisKey}
              stroke="#9AA8BD"
              fontSize={11}
              tickLine={false}
              label={{ value: config.xAxisLabel, position: 'insideBottom', offset: -15, fill: '#9AA8BD', fontSize: 11 }}
            />
            <YAxis
              stroke="#9AA8BD"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => formatNumber(v)}
              label={{ value: config.yAxisLabel, angle: -90, position: 'insideLeft', offset: 0, fill: '#9AA8BD', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0E1422',
                borderColor: 'rgba(154, 168, 189, 0.25)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#F4F7FF',
              }}
              formatter={(value: any, name: any) => [formatNumber(Number(value)), name]}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />
            {config.series.map((s) => {
              if (s.type === 'line') {
                return (
                  <Line
                    key={s.dataKey}
                    type="monotone"
                    dataKey={s.dataKey}
                    name={s.name}
                    stroke={s.color}
                    strokeWidth={2}
                    dot={false}
                  />
                );
              }
              return (
                <Area
                  key={s.dataKey}
                  type="monotone"
                  dataKey={s.dataKey}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#grad-${s.dataKey})`}
                />
              );
            })}
          </AreaChart>
        );

      case 'line':
      default:
        return (
          <LineChart data={data} margin={{ top: 15, right: 25, left: 10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#9AA8BD" strokeOpacity={0.12} />
            <XAxis
              dataKey={config.xAxisKey}
              stroke="#9AA8BD"
              fontSize={11}
              tickLine={false}
              label={{ value: config.xAxisLabel, position: 'insideBottom', offset: -15, fill: '#9AA8BD', fontSize: 11 }}
            />
            <YAxis
              stroke="#9AA8BD"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => formatNumber(v)}
              label={{ value: config.yAxisLabel, angle: -90, position: 'insideLeft', offset: 0, fill: '#9AA8BD', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0E1422',
                borderColor: 'rgba(154, 168, 189, 0.25)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#F4F7FF',
              }}
              formatter={(value: any, name: any) => [formatNumber(Number(value)), name]}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />
            {config.series.map((s) => (
              <Line
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name}
                stroke={s.color}
                strokeWidth={2.5}
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div className="bg-[#121B2B] rounded-xl border border-[#9AA8BD]/15 p-5">
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-[#F4F7FF]">{config.title}</h4>
        {config.description && (
          <p className="text-xs text-[#9AA8BD] mt-0.5">{config.description}</p>
        )}
      </div>

      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

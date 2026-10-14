/**
 * Utility functions for formatting numbers, currencies, percentages, and units.
 */

export function formatCurrency(value: number, decimals: number = 0): string {
  if (isNaN(value) || !isFinite(value)) return 'Rs. 0';
  const absFormatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(Math.abs(value));
  return `${value < 0 ? '-' : ''}Rs. ${absFormatted}`;
}

export function formatNumber(value: number, decimals: number = 0): string {
  if (isNaN(value) || !isFinite(value)) return '0';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals: number = 1): string {
  if (isNaN(value) || !isFinite(value)) return '0.0%';
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatDelta(delta: number, unit: string = '', isPercent: boolean = false): {
  text: string;
  isPositive: boolean;
  isZero: boolean;
} {
  if (Math.abs(delta) < 0.0001) {
    return { text: 'No change', isPositive: false, isZero: true };
  }
  const isPositive = delta > 0;
  const sign = isPositive ? '+' : '';
  const text = isPercent
    ? `${sign}${(delta * 100).toFixed(1)}%`
    : `${sign}${formatNumber(delta, delta % 1 === 0 ? 0 : 2)} ${unit}`.trim();
  return { text, isPositive, isZero: false };
}

export function formatDate(timestamp: number | string | Date): string {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'Unknown date';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

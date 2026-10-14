import { SimulationDefinition, SimulationResult } from '../../engine/types';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters';

export const compoundGrowthSimulation: SimulationDefinition = {
  id: 'compound-growth',
  title: 'Long-Term Wealth & Compound Growth',
  tagline: 'Simulate compounding returns, continuous deposits, and inflation-adjusted purchasing power.',
  category: 'finance',
  categoryLabel: 'Personal Finance',
  difficulty: 'Beginner',
  estimatedMinutes: 4,
  modelType: 'Analytical Model',
  iconName: 'TrendingUp',
  description:
    'Witness the mathematical exponential power of compounding returns over decades. Understand the critical distinction between nominal portfolio balance and inflation-adjusted purchasing power.',
  variables: [
    {
      id: 'initialDeposit',
      label: 'Initial Principal',
      description: 'Starting balance currently in the investment or savings account.',
      min: 0,
      max: 5000000,
      step: 10000,
      defaultValue: 100000,
      unit: 'Rs.',
      formatType: 'currency',
    },
    {
      id: 'monthlyDeposit',
      label: 'Monthly Contribution',
      description: 'Regular recurring amount deposited at the start of each month.',
      min: 0,
      max: 300000,
      step: 1000,
      defaultValue: 15000,
      unit: 'Rs./mo',
      formatType: 'currency',
    },
    {
      id: 'annualRate',
      label: 'Annual Return Rate',
      description: 'Expected annualized nominal investment rate of return (e.g. mutual funds, stock market, debentures).',
      min: 1.0,
      max: 25.0,
      step: 0.25,
      defaultValue: 10.0,
      unit: '%/yr',
      formatType: 'percent',
      decimals: 2,
    },
    {
      id: 'years',
      label: 'Investment Horizon',
      description: 'Number of years funds remain invested and compounding.',
      min: 1,
      max: 50,
      step: 1,
      defaultValue: 20,
      unit: 'years',
      formatType: 'number',
    },
    {
      id: 'inflationRate',
      label: 'Annual Inflation Rate',
      description: 'Expected loss of purchasing power over time (Nepal historic consumer inflation ~5.0% to 6.5%).',
      min: 0.0,
      max: 15.0,
      step: 0.2,
      defaultValue: 5.5,
      unit: '%/yr',
      formatType: 'percent',
      decimals: 1,
    },
  ],
  presets: [
    {
      id: 'preset-index',
      name: 'Systematic Investment Plan (SIP)',
      description: 'Rs. 15,000 monthly investment over 20 years with 10% expected return.',
      inputs: {
        initialDeposit: 100000,
        monthlyDeposit: 15000,
        annualRate: 10.0,
        years: 20,
        inflationRate: 5.5,
      },
    },
    {
      id: 'preset-fire',
      name: 'Accelerated Wealth Accumulation',
      description: 'High savings rate: Rs. 40,000/mo over 15 years in diversified equities.',
      inputs: {
        initialDeposit: 300000,
        monthlyDeposit: 40000,
        annualRate: 11.5,
        years: 15,
        inflationRate: 5.5,
      },
    },
    {
      id: 'preset-highyield',
      name: 'Fixed Deposit (FD) & Debentures',
      description: 'Moderate-risk fixed-rate savings compounding at 8.5%.',
      inputs: {
        initialDeposit: 500000,
        monthlyDeposit: 10000,
        annualRate: 8.5,
        years: 10,
        inflationRate: 5.0,
      },
    },
  ],
  assumptions: [
    'Contributions are deposited monthly and compounded at monthly intervals (12 times per year).',
    'Return rate is modeled as a steady constant annualized geometric return without sequence-of-returns volatility.',
    'Dividends and capital distributions are assumed to be 100% reinvested tax-free.',
  ],
  limitations: [
    'Real markets experience market drawdowns, bear cycles, and sequence-of-returns risk.',
    'Does not calculate capital gains taxes or investment advisory/fund expense ratios.',
    'Illustrative model for educational planning; not personalized investment advice.',
  ],
  formulas: [
    {
      name: 'Monthly Rate of Return',
      equation: 'r_{mo} = \\frac{Rate_{annual}}{12}',
      explanation: 'Compounding happens each month across 12 cycles per year.',
    },
    {
      name: 'Future Value with Monthly Deposits',
      equation: 'FV = P (1 + r)^{n} + PMT \\left[ \\frac{(1 + r)^{n} - 1}{r} \\right]',
      explanation: 'The combined value of initial principal P and annuity payments PMT after n months.',
    },
    {
      name: 'Inflation-Adjusted Real Value',
      equation: 'RealFV = \\frac{FV}{(1 + Inflation)^{Years}}',
      explanation: 'Discounted purchasing power expressed in today\'s equivalent dollar value.',
    },
  ],
  calculate(inputs: Record<string, number>): SimulationResult {
    const P = Math.max(0, inputs.initialDeposit ?? 10000);
    const PMT = Math.max(0, inputs.monthlyDeposit ?? 500);
    const annualRate = Math.max(0.1, inputs.annualRate ?? 8.0) / 100;
    const years = Math.max(1, Math.min(60, inputs.years ?? 25));
    const inflationRate = Math.max(0, inputs.inflationRate ?? 2.8) / 100;

    const totalMonths = years * 12;
    const r = annualRate / 12;

    const chartData: any[] = [];
    let currentBalance = P;
    let totalDeposited = P;

    chartData.push({
      year: 0,
      totalDeposited: Math.round(totalDeposited),
      nominalBalance: Math.round(currentBalance),
      realBalance: Math.round(currentBalance),
      interestEarned: 0,
    });

    for (let yr = 1; yr <= years; yr++) {
      for (let m = 0; m < 12; m++) {
        currentBalance = currentBalance * (1 + r) + PMT;
        totalDeposited += PMT;
      }
      const inflationDiscount = Math.pow(1 + inflationRate, yr);
      const realValue = currentBalance / inflationDiscount;
      const interestEarned = currentBalance - totalDeposited;

      chartData.push({
        year: yr,
        totalDeposited: Math.round(totalDeposited),
        nominalBalance: Math.round(currentBalance),
        realBalance: Math.round(realValue),
        interestEarned: Math.round(interestEarned),
      });
    }

    const finalNominal = currentBalance;
    const finalDeposited = totalDeposited;
    const finalInterest = finalNominal - finalDeposited;
    const finalReal = finalNominal / Math.pow(1 + inflationRate, years);
    const interestMultiplier = finalDeposited > 0 ? finalNominal / finalDeposited : 1;

    const insights: string[] = [
      `Over ${years} years, you contribute ${formatCurrency(finalDeposited)}, which grows into ${formatCurrency(finalNominal)} nominal.`,
      `Compound interest accounts for ${formatCurrency(finalInterest)} (${formatPercent(finalInterest / finalNominal)} of your total wealth).`,
      `In today's purchasing power (discounted for ${formatPercent(inflationRate)} annual inflation), your future nest egg is worth ${formatCurrency(finalReal)}.`,
      `Every Rs. 1 contributed turns into approximately ${formatCurrency(interestMultiplier, 2)} in total future value.`,
    ];

    return {
      primaryMetric: {
        id: 'nominalBalance',
        label: 'Nominal Future Value',
        value: finalNominal,
        formattedValue: formatCurrency(finalNominal),
        unit: 'Rs.',
        isPrimary: true,
        sentiment: 'positive',
        explanation: `Total portfolio balance after ${years} years.`,
      },
      metrics: [
        {
          id: 'realBalance',
          label: 'Purchasing Power (Real Rs.)',
          value: finalReal,
          formattedValue: formatCurrency(finalReal),
          sentiment: 'positive',
          explanation: `Discounted at ${formatPercent(inflationRate)}/yr inflation rate.`,
        },
        {
          id: 'totalDeposited',
          label: 'Your Total Contributions',
          value: finalDeposited,
          formattedValue: formatCurrency(finalDeposited),
          sentiment: 'neutral',
          explanation: `${formatCurrency(P)} starting + ${formatCurrency(PMT * totalMonths)} recurring deposits.`,
        },
        {
          id: 'finalInterest',
          label: 'Pure Interest Earned',
          value: finalInterest,
          formattedValue: formatCurrency(finalInterest),
          sentiment: 'positive',
          explanation: `Growth generated entirely by compounding returns.`,
        },
        {
          id: 'interestRatio',
          label: 'Growth Multiplier',
          value: interestMultiplier,
          formattedValue: `${interestMultiplier.toFixed(2)}x`,
          sentiment: 'positive',
          explanation: 'Ratio of total portfolio ending value to your cash deposited.',
        },
      ],
      chartData,
      chartConfig: {
        title: 'Portfolio Trajectory: Deposits vs Compound Growth vs Real Purchasing Power',
        description: 'Year-by-year curve showing contributions, compounding interest, and inflation drag.',
        type: 'area',
        xAxisKey: 'year',
        xAxisLabel: 'Year',
        yAxisLabel: 'Value (Rs.)',
        series: [
          { dataKey: 'nominalBalance', name: 'Nominal Portfolio Value (Rs.)', color: '#35D9FF', type: 'area' },
          { dataKey: 'realBalance', name: 'Real Purchasing Power (Rs.)', color: '#7C5CFC', type: 'line' },
          { dataKey: 'totalDeposited', name: 'Total Cash Contributed (Rs.)', color: '#9AA8BD', type: 'line' },
        ],
      },
      insights,
    };
  },
};

import { SimulationDefinition, SimulationResult } from '../../engine/types';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export const loanRepaymentSimulation: SimulationDefinition = {
  id: 'loan-repayment',
  title: 'Loan Amortization & Accelerated Payoff',
  tagline: 'Simulate early mortgage or student loan payoff and discover interest savings.',
  category: 'finance',
  categoryLabel: 'Personal Finance',
  difficulty: 'Beginner',
  estimatedMinutes: 4,
  modelType: 'Analytical Model',
  iconName: 'CreditCard',
  description:
    'Calculate the true cost of debt amortization. Explore how adding a modest extra monthly principal payment dramatically reduces total interest paid and shortens loan duration by years.',
  variables: [
    {
      id: 'loanAmount',
      label: 'Loan Principal Balance',
      description: 'Initial balance or remaining home mortgage / bank loan amount.',
      min: 100000,
      max: 30000000,
      step: 50000,
      defaultValue: 4500000,
      unit: 'Rs.',
      formatType: 'currency',
    },
    {
      id: 'interestRate',
      label: 'Annual Interest Rate (APR)',
      description: 'Annual interest rate charged on the outstanding loan balance (Nepal commercial bank benchmark ~8.5-13%).',
      min: 2.0,
      max: 20.0,
      step: 0.125,
      defaultValue: 9.5,
      unit: '%/yr',
      formatType: 'percent',
      decimals: 3,
    },
    {
      id: 'termYears',
      label: 'Original Loan Term',
      description: 'Scheduled total duration of the loan in years.',
      min: 2,
      max: 35,
      step: 1,
      defaultValue: 20,
      unit: 'years',
      formatType: 'number',
    },
    {
      id: 'extraPayment',
      label: 'Extra Monthly Principal',
      description: 'Optional additional amount paid directly toward reducing principal each month.',
      min: 0,
      max: 100000,
      step: 1000,
      defaultValue: 10000,
      unit: 'Rs./mo',
      formatType: 'currency',
    },
  ],
  presets: [
    {
      id: 'preset-20yr-mortgage',
      name: '20-Year Home Loan (Rs. 45 Lakhs)',
      description: 'Commercial bank housing loan at 9.5% APR with Rs. 10,000/mo extra payment.',
      inputs: {
        loanAmount: 4500000,
        interestRate: 9.5,
        termYears: 20,
        extraPayment: 10000,
      },
    },
    {
      id: 'preset-aggressive-student',
      name: 'Higher Studies Loan (Rs. 15 Lakhs)',
      description: 'Accelerating a 7-year education loan at 10.5% by adding Rs. 8,000/mo extra.',
      inputs: {
        loanAmount: 1500000,
        interestRate: 10.5,
        termYears: 7,
        extraPayment: 8000,
      },
    },
    {
      id: 'preset-car-refi',
      name: 'Vehicle Financing (Rs. 25 Lakhs)',
      description: 'Paying off a 5-year auto loan at 11% ahead of schedule.',
      inputs: {
        loanAmount: 2500000,
        interestRate: 11.0,
        termYears: 5,
        extraPayment: 6000,
      },
    },
  ],
  assumptions: [
    'Fixed interest rate remains unchanged throughout the repayment period.',
    'Extra payments are applied directly to principal reduction without prepayment penalty fees.',
    'Payments occur once per month on regular 30-day schedule.',
  ],
  limitations: [
    'Does not include escrow payments for property taxes, homeowner insurance, or PMI.',
    'Excludes variable-rate ARM adjustments or loan origination/closing fees.',
  ],
  formulas: [
    {
      name: 'Monthly Standard Payment (PMT)',
      equation: 'PMT = P \\left[ \\frac{r(1 + r)^n}{(1 + r)^n - 1} \\right]',
      explanation: 'Standard fixed amortization payment where r is monthly rate and n is total months.',
    },
    {
      name: 'Interest Portion in Month t',
      equation: 'Interest_t = Balance_{t-1} \\times r',
      explanation: 'Monthly interest calculated on the outstanding balance.',
    },
    {
      name: 'Principal Reduction',
      equation: 'Principal_t = PMT + ExtraPayment - Interest_t',
      explanation: 'Portion of payment directly decreasing the loan liability.',
    },
  ],
  calculate(inputs: Record<string, number>): SimulationResult {
    const P = Math.max(1000, inputs.loanAmount ?? 350000);
    const apr = Math.max(0.1, inputs.interestRate ?? 6.5) / 100;
    const termYears = Math.max(1, Math.min(40, inputs.termYears ?? 30));
    const extra = Math.max(0, inputs.extraPayment ?? 250);

    const r = apr / 12;
    const n = termYears * 12;

    // Standard monthly payment without extra
    const basePmt = (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);

    // Standard schedule calculation (Baseline)
    let stdBalance = P;
    let stdTotalInterest = 0;
    for (let m = 1; m <= n; m++) {
      const interest = stdBalance * r;
      const principal = basePmt - interest;
      stdTotalInterest += interest;
      stdBalance = Math.max(0, stdBalance - principal);
    }

    // Accelerated schedule calculation
    let accBalance = P;
    let accTotalInterest = 0;
    let accMonths = 0;
    const maxMonths = n + 12;

    const chartData: any[] = [];
    let yearMark = 0;
    let yearAccBal = P;
    let yearStdBal = P;

    chartData.push({
      year: 0,
      acceleratedBalance: Math.round(P),
      standardBalance: Math.round(P),
    });

    let simStdBal = P;
    for (let m = 1; m <= maxMonths; m++) {
      if (accBalance > 0) {
        accMonths++;
        const interest = accBalance * r;
        accTotalInterest += interest;
        const totalPmt = Math.min(accBalance + interest, basePmt + extra);
        const principal = totalPmt - interest;
        accBalance = Math.max(0, accBalance - principal);
      }

      if (simStdBal > 0) {
        const stdInt = simStdBal * r;
        const stdPrinc = basePmt - stdInt;
        simStdBal = Math.max(0, simStdBal - stdPrinc);
      }

      if (m % 12 === 0 || m === n) {
        yearMark++;
        chartData.push({
          year: yearMark,
          acceleratedBalance: Math.round(accBalance),
          standardBalance: Math.round(simStdBal),
        });
      }

      if (accBalance <= 0 && simStdBal <= 0) break;
    }

    const interestSaved = Math.max(0, stdTotalInterest - accTotalInterest);
    const monthsSaved = Math.max(0, n - accMonths);
    const yearsSaved = (monthsSaved / 12).toFixed(1);
    const payoffYears = (accMonths / 12).toFixed(1);

    const insights: string[] = [
      `Your standard base monthly payment is ${formatCurrency(basePmt)}/month.`,
      extra > 0
        ? `Adding ${formatCurrency(extra)}/mo extra saves ${formatCurrency(interestSaved)} in interest over the life of the loan.`
        : 'Adding even Rs. 5,000–Rs. 15,000/month in extra principal can eliminate hundreds of thousands in interest charges.',
      extra > 0
        ? `You will pay off your debt in ${payoffYears} years (${yearsSaved} years earlier than scheduled).`
        : `Without extra payments, you will pay ${formatCurrency(stdTotalInterest)} in interest over ${termYears} years.`,
    ];

    return {
      primaryMetric: {
        id: 'interestSaved',
        label: 'Total Interest Saved',
        value: interestSaved,
        formattedValue: formatCurrency(interestSaved),
        unit: 'Rs.',
        isPrimary: true,
        sentiment: interestSaved > 0 ? 'positive' : 'neutral',
        explanation: `Difference between standard interest and accelerated interest.`,
      },
      metrics: [
        {
          id: 'basePayment',
          label: 'Standard Monthly Payment',
          value: basePmt,
          formattedValue: formatCurrency(basePmt),
          sentiment: 'neutral',
          explanation: `Fixed principal + interest payment required by bank.`,
        },
        {
          id: 'actualPayment',
          label: 'Total Monthly Paid',
          value: basePmt + extra,
          formattedValue: formatCurrency(basePmt + extra),
          sentiment: 'neutral',
          explanation: `${formatCurrency(basePmt)} base + ${formatCurrency(extra)} extra principal.`,
        },
        {
          id: 'payoffTime',
          label: 'Payoff Timeline',
          value: Number(payoffYears),
          formattedValue: `${payoffYears} yrs`,
          sentiment: 'positive',
          explanation: `${yearsSaved} years earlier than the scheduled ${termYears} year term.`,
        },
        {
          id: 'totalCost',
          label: 'Total Principal + Interest',
          value: P + accTotalInterest,
          formattedValue: formatCurrency(P + accTotalInterest),
          sentiment: 'neutral',
          explanation: `${formatCurrency(P)} principal + ${formatCurrency(accTotalInterest)} interest.`,
        },
      ],
      chartData,
      chartConfig: {
        title: 'Loan Principal Balance Over Time: Standard vs Accelerated Payoff',
        description: 'Comparison of remaining debt curve with and without additional principal contributions.',
        type: 'line',
        xAxisKey: 'year',
        xAxisLabel: 'Year',
        yAxisLabel: 'Remaining Balance (Rs.)',
        series: [
          { dataKey: 'standardBalance', name: 'Standard Scheduled Balance (Rs.)', color: '#FF647C' },
          { dataKey: 'acceleratedBalance', name: 'Accelerated Payoff Balance (Rs.)', color: '#38D996' },
        ],
      },
      insights,
    };
  },
};

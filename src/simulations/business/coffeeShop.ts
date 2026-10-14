import { SimulationDefinition, SimulationResult } from '../../engine/types';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters';

export const coffeeShopSimulation: SimulationDefinition = {
  id: 'coffee-shop',
  title: 'Artisan Coffee Shop Economics',
  tagline: 'Model unit economics, fixed overhead, break-even thresholds, and operating margins.',
  category: 'business',
  categoryLabel: 'Business & Commerce',
  difficulty: 'Beginner',
  estimatedMinutes: 5,
  modelType: 'Analytical Model',
  iconName: 'Coffee',
  description:
    'Explore the delicate financial dynamics of a neighborhood coffee shop. Test how beverage pricing, daily foot traffic, ingredient costs, and lease overhead determine break-even survival and monthly profitability.',
  variables: [
    {
      id: 'unitsPerDay',
      label: 'Beverages Sold / Day',
      description: 'Average daily count of coffee, espresso, and beverage items served.',
      min: 20,
      max: 1200,
      step: 10,
      defaultValue: 220,
      unit: 'cups/day',
      formatType: 'number',
    },
    {
      id: 'pricePerUnit',
      label: 'Average Selling Price',
      description: 'Weighted average customer spend per drink (including milk/syrup additions).',
      min: 50,
      max: 1000,
      step: 10,
      defaultValue: 260,
      unit: 'Rs./cup',
      formatType: 'currency',
      decimals: 0,
    },
    {
      id: 'costPerUnit',
      label: 'Variable Cost / Cup',
      description: 'Direct cost of coffee beans, dairy/oat milk, syrups, cups, lids, and napkins.',
      min: 20,
      max: 400,
      step: 5,
      defaultValue: 75,
      unit: 'Rs./cup',
      formatType: 'currency',
      decimals: 0,
    },
    {
      id: 'fixedExpenses',
      label: 'Monthly Fixed Overhead',
      description: 'Commercial rent, barista wages, electricity, POS, municipal license, and equipment upkeep.',
      min: 20000,
      max: 600000,
      step: 5000,
      defaultValue: 110000,
      unit: 'Rs./mo',
      formatType: 'currency',
    },
    {
      id: 'operatingDays',
      label: 'Operating Days / Month',
      description: 'Number of active open trading days each calendar month.',
      min: 15,
      max: 31,
      step: 1,
      defaultValue: 26,
      unit: 'days',
      formatType: 'number',
    },
    {
      id: 'adSpend',
      label: 'Monthly Marketing & Ads',
      description: 'Social media promotions, neighborhood flyers, and map listings.',
      min: 0,
      max: 60000,
      step: 500,
      defaultValue: 8000,
      unit: 'Rs./mo',
      formatType: 'currency',
    },
  ],
  presets: [
    {
      id: 'preset-kiosk',
      name: 'Modest Station Kiosk',
      description: 'Low-overhead 1-barista booth in a commuter corridor with moderate volume.',
      inputs: {
        unitsPerDay: 160,
        pricePerUnit: 180,
        costPerUnit: 55,
        fixedExpenses: 55000,
        operatingDays: 24,
        adSpend: 3000,
      },
    },
    {
      id: 'preset-downtown',
      name: 'Busy Downtown Corner',
      description: 'High foot traffic, prime commercial rent, 3 staff members on peak shift.',
      inputs: {
        unitsPerDay: 350,
        pricePerUnit: 280,
        costPerUnit: 80,
        fixedExpenses: 180000,
        operatingDays: 28,
        adSpend: 15000,
      },
    },
    {
      id: 'preset-specialty',
      name: 'Specialty Himalayan Roastery',
      description: 'Single-origin organic beans, higher price points, seated patrons.',
      inputs: {
        unitsPerDay: 190,
        pricePerUnit: 380,
        costPerUnit: 120,
        fixedExpenses: 140000,
        operatingDays: 26,
        adSpend: 10000,
      },
    },
  ],
  assumptions: [
    'Every beverage ordered pays the full modeled average selling price with immediate collection (no uncollected tabs).',
    'Variable unit costs scale linearly with production volume without tiered bulk ingredient discounts.',
    'Fixed monthly expenses remain static regardless of whether sales are 50 cups or 500 cups on a given day.',
    'Operating days are evenly distributed across the month.',
  ],
  limitations: [
    'Does not include corporate income taxes, sales/VAT remittance, or local franchise licensing fees.',
    'Excludes initial capital depreciation on espresso machines, plumbing, and interior buildout.',
    'Assumes zero inventory spoilage or barista beverage remakes/waste (typically 3–6% in real operations).',
    'Working capital cash flow timing is omitted; models steady-state monthly accruals.',
  ],
  formulas: [
    {
      name: 'Monthly Units Sold',
      equation: 'Units_{mo} = Units_{day} \\times OperatingDays',
      explanation: 'Total number of beverage items sold during the operating month.',
    },
    {
      name: 'Monthly Revenue',
      equation: 'Revenue_{mo} = Units_{mo} \\times Price_{unit}',
      explanation: 'Gross receipts earned from all beverage sales.',
    },
    {
      name: 'Total Variable Costs',
      equation: 'Cost_{var} = Units_{mo} \\times Cost_{unit}',
      explanation: 'Direct raw ingredients and consumable packaging expenses.',
    },
    {
      name: 'Unit Contribution Margin',
      equation: 'CM_{unit} = Price_{unit} - Cost_{unit}',
      explanation: 'The dollar amount each individual cup contributes toward covering overhead and generating profit.',
    },
    {
      name: 'Break-Even Units',
      equation: 'BreakEven = \\frac{FixedOverhead + AdSpend}{CM_{unit}}',
      explanation: 'The minimum number of cups required per month to achieve exactly zero net profit/loss.',
    },
    {
      name: 'Modeled Operating Result',
      equation: 'OperatingProfit = Revenue_{mo} - Cost_{var} - FixedOverhead - AdSpend',
      explanation: 'Net pre-tax operational earnings generated by regular business activities.',
    },
  ],
  calculate(inputs: Record<string, number>): SimulationResult {
    const unitsPerDay = Math.max(1, inputs.unitsPerDay ?? 220);
    const pricePerUnit = Math.max(0.1, inputs.pricePerUnit ?? 4.75);
    const costPerUnit = Math.max(0.01, inputs.costPerUnit ?? 1.25);
    const fixedExpenses = Math.max(0, inputs.fixedExpenses ?? 14500);
    const operatingDays = Math.max(1, Math.min(31, inputs.operatingDays ?? 26));
    const adSpend = Math.max(0, inputs.adSpend ?? 600);

    const monthlyUnits = unitsPerDay * operatingDays;
    const monthlyRevenue = monthlyUnits * pricePerUnit;
    const variableCosts = monthlyUnits * costPerUnit;
    const totalFixedCosts = fixedExpenses + adSpend;
    const totalCosts = variableCosts + totalFixedCosts;
    const operatingProfit = monthlyRevenue - totalCosts;
    const operatingMargin = monthlyRevenue > 0 ? operatingProfit / monthlyRevenue : 0;
    const unitMargin = pricePerUnit - costPerUnit;

    const breakEvenUnits = unitMargin > 0 ? Math.ceil(totalFixedCosts / unitMargin) : Infinity;
    const breakEvenRevenue = isFinite(breakEvenUnits) ? breakEvenUnits * pricePerUnit : 0;
    const breakEvenUnitsPerDay = isFinite(breakEvenUnits) ? Math.ceil(breakEvenUnits / operatingDays) : Infinity;

    // Generate chart data across a range of daily volumes (from 40% to 200% of current)
    const chartData: any[] = [];
    const minVol = Math.max(30, Math.floor(unitsPerDay * 0.4));
    const maxVol = Math.ceil(unitsPerDay * 1.8);
    const stepVol = Math.max(10, Math.floor((maxVol - minVol) / 8));

    for (let vol = minVol; vol <= maxVol; vol += stepVol) {
      const volMonthly = vol * operatingDays;
      const volRev = volMonthly * pricePerUnit;
      const volCost = volMonthly * costPerUnit + totalFixedCosts;
      const volProfit = volRev - volCost;

      chartData.push({
        unitsPerDay: vol,
        revenue: Math.round(volRev),
        totalCost: Math.round(volCost),
        fixedCost: Math.round(totalFixedCosts),
        profit: Math.round(volProfit),
        isCurrent: Math.abs(vol - unitsPerDay) < stepVol / 2,
      });
    }

    const insights: string[] = [];
    if (operatingProfit > 0) {
      insights.push(
        `At ${unitsPerDay} cups/day, the shop generates ${formatCurrency(operatingProfit)} in monthly profit (${formatPercent(operatingMargin)} margin).`
      );
      if (isFinite(breakEvenUnitsPerDay)) {
        const safetyMargin = unitsPerDay - breakEvenUnitsPerDay;
        insights.push(
          `Your safety cushion is ${safetyMargin} cups/day (${formatPercent(safetyMargin / unitsPerDay)} above break-even).`
        );
      }
    } else {
      insights.push(
        `The shop is currently operating at a monthly deficit of ${formatCurrency(Math.abs(operatingProfit))}.`
      );
      if (isFinite(breakEvenUnitsPerDay)) {
        insights.push(
          `You must increase sales by ${breakEvenUnitsPerDay - unitsPerDay} cups/day (to ${breakEvenUnitsPerDay} cups/day) to achieve break-even.`
        );
      }
    }

    insights.push(
      `Each cup sold contributes ${formatCurrency(unitMargin, 2)} toward overhead after direct ingredients.`
    );

    return {
      primaryMetric: {
        id: 'operatingProfit',
        label: 'Monthly Operating Result',
        value: operatingProfit,
        formattedValue: formatCurrency(operatingProfit),
        unit: 'Rs./month',
        isPrimary: true,
        sentiment: operatingProfit > 0 ? 'positive' : 'negative',
        explanation: 'Net earnings before taxes, financing, and depreciation.',
      },
      metrics: [
        {
          id: 'operatingMargin',
          label: 'Operating Margin',
          value: operatingMargin,
          formattedValue: formatPercent(operatingMargin),
          sentiment: operatingMargin >= 0.15 ? 'positive' : operatingMargin > 0 ? 'neutral' : 'negative',
          explanation: 'Profit as a proportion of total gross monthly revenue.',
        },
        {
          id: 'monthlyRevenue',
          label: 'Monthly Revenue',
          value: monthlyRevenue,
          formattedValue: formatCurrency(monthlyRevenue),
          sentiment: 'neutral',
          explanation: `${formatNumber(monthlyUnits)} cups sold across ${operatingDays} trading days.`,
        },
        {
          id: 'totalCosts',
          label: 'Total Modeled Costs',
          value: totalCosts,
          formattedValue: formatCurrency(totalCosts),
          sentiment: 'neutral',
          explanation: `${formatCurrency(variableCosts)} ingredients + ${formatCurrency(totalFixedCosts)} overhead & ads.`,
        },
        {
          id: 'breakEvenUnitsPerDay',
          label: 'Break-Even Volume',
          value: isFinite(breakEvenUnitsPerDay) ? breakEvenUnitsPerDay : 0,
          formattedValue: isFinite(breakEvenUnitsPerDay) ? `${breakEvenUnitsPerDay} cups/day` : 'Unreachable',
          sentiment: isFinite(breakEvenUnitsPerDay) && unitsPerDay >= breakEvenUnitsPerDay ? 'positive' : 'negative',
          explanation: `Total of ${formatNumber(breakEvenUnits)} cups/mo needed to cover all expenses.`,
        },
        {
          id: 'unitMargin',
          label: 'Unit Contribution Margin',
          value: unitMargin,
          formattedValue: formatCurrency(unitMargin, 2),
          sentiment: 'positive',
          explanation: `Gross margin of ${formatPercent(unitMargin / pricePerUnit)} on each beverage item.`,
        },
      ],
      chartData,
      chartConfig: {
        title: 'Break-Even & Volume Sensitivity Analysis',
        description: 'Monthly revenue curve vs total costs across varying daily sales volumes.',
        type: 'line',
        xAxisKey: 'unitsPerDay',
        xAxisLabel: 'Cups Sold Per Day',
        yAxisLabel: 'Monthly Amount (Rs.)',
        series: [
          { dataKey: 'revenue', name: 'Monthly Revenue (Rs.)', color: '#35D9FF' },
          { dataKey: 'totalCost', name: 'Total Costs (Rs.)', color: '#FF647C' },
          { dataKey: 'fixedCost', name: 'Fixed Overhead (Rs.)', color: '#9AA8BD' },
          { dataKey: 'profit', name: 'Net Operating Profit (Rs.)', color: '#38D996' },
        ],
      },
      insights,
    };
  },
};

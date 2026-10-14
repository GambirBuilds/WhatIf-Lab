import { SimulationDefinition, SimulationResult } from '../../engine/types';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters';

export const urbanTransitSimulation: SimulationDefinition = {
  id: 'urban-transit',
  title: 'Urban Transit & Carbon Mitigation Simulator',
  tagline: 'Model modal shifts from private cars to mass transit and electric bus fleets.',
  category: 'city',
  categoryLabel: 'City & Environment',
  difficulty: 'Intermediate',
  estimatedMinutes: 6,
  modelType: 'Illustrative Model',
  iconName: 'Bus',
  description:
    'Simulate how urban transport policy shifts alter commuter congestion, tailpipe emissions, and household fuel costs. Test the impact of increasing public transit mode share and electrifying bus routes.',
  variables: [
    {
      id: 'commuterPop',
      label: 'Daily Commuter Population',
      description: 'Total active daily commuters traveling in the metropolitan region.',
      min: 50000,
      max: 3000000,
      step: 25000,
      defaultValue: 450000,
      unit: 'commuters',
      formatType: 'number',
    },
    {
      id: 'currentTransitShare',
      label: 'Current Transit Mode Share',
      description: 'Percentage of trips currently taken via bus, metro, or commuter rail.',
      min: 5,
      max: 60,
      step: 1,
      defaultValue: 18,
      unit: '%',
      formatType: 'percent',
      decimals: 1,
    },
    {
      id: 'targetTransitShare',
      label: 'Target Transit Mode Share',
      description: 'Goal percentage of trips shifted to public transit through policy and service upgrades.',
      min: 10,
      max: 75,
      step: 1,
      defaultValue: 35,
      unit: '%',
      formatType: 'percent',
      decimals: 1,
    },
    {
      id: 'electricFleetShare',
      label: 'Electric Bus Fleet Share',
      description: 'Proportion of the municipal bus fleet converted to zero-emission battery electric.',
      min: 0,
      max: 100,
      step: 5,
      defaultValue: 50,
      unit: '%',
      formatType: 'percent',
    },
    {
      id: 'avgCommuteDistance',
      label: 'Average Round-Trip Distance',
      description: 'Average daily round-trip commute distance per commuter.',
      min: 5,
      max: 50,
      step: 1,
      defaultValue: 22,
      unit: 'km/day',
      formatType: 'number',
    },
  ],
  presets: [
    {
      id: 'preset-metro-hub',
      name: 'Mid-Sized City (Bus Rapid Transit)',
      description: '450k commuters targeting a shift from 18% to 35% with 50% electric bus fleet.',
      inputs: {
        commuterPop: 450000,
        currentTransitShare: 18,
        targetTransitShare: 35,
        electricFleetShare: 50,
        avgCommuteDistance: 22,
      },
    },
    {
      id: 'preset-megacity',
      name: 'High-Density Metro Corridor',
      description: '1.5M commuters pushing toward 55% transit share with 80% electrification.',
      inputs: {
        commuterPop: 1500000,
        currentTransitShare: 32,
        targetTransitShare: 55,
        electricFleetShare: 80,
        avgCommuteDistance: 28,
      },
    },
  ],
  assumptions: [
    'Private car average occupancy is modeled at 1.15 passengers per vehicle (typical urban single-occupant commute).',
    'Private internal combustion engine vehicles emit approximately 170g CO2 per passenger-km.',
    'Diesel municipal buses emit ~80g CO2 per passenger-km, while electric buses charged via average grid emit ~25g CO2/p-km.',
    'Average commuter work year consists of 240 active travel days.',
    'Average fuel/maintenance cost for private passenger vehicle is estimated at Rs. 20 per kilometer.',
  ],
  limitations: [
    'Illustrative regional transport model; does not account for real-world route topologies, bottleneck choke points, or micro-topography.',
    'Capital infrastructure expenditure (subway tunneling, overhead wire installation) is excluded.',
    'Does not simulate dynamic induce-demand effects where freed road capacity attracts new drivers.',
  ],
  formulas: [
    {
      name: 'Commuters Shifted to Transit',
      equation: '\\Delta Commuters = Pop \\times (Share_{target} - Share_{current})',
      explanation: 'Additional daily people utilizing buses and rail instead of private vehicles.',
    },
    {
      name: 'Private Vehicle Kilometers Eliminated',
      equation: 'VKT_{saved} = \\frac{\\Delta Commuters \\times Distance_{daily}}{Occupancy_{car}} \\times Days_{annual}',
      explanation: 'Total annual automobile distance removed from local roadway networks.',
    },
    {
      name: 'Annual Carbon Mitigation',
      equation: 'CO_{2} Saved = VKT_{saved} \\times (Emissions_{car} - Emissions_{transit})',
      explanation: 'Net metric tons of greenhouse gas emissions eliminated per year.',
    },
  ],
  calculate(inputs: Record<string, number>): SimulationResult {
    const pop = Math.max(1000, inputs.commuterPop ?? 450000);
    const currShare = Math.max(1, inputs.currentTransitShare ?? 18) / 100;
    const targetShare = Math.max(currShare, inputs.targetTransitShare ?? 35) / 100;
    const electricShare = Math.max(0, Math.min(100, inputs.electricFleetShare ?? 50)) / 100;
    const distanceKm = Math.max(1, inputs.avgCommuteDistance ?? 22);

    const workDays = 240;
    const carOccupancy = 1.15;
    const carGramsCO2PerKm = 170;
    // Weighted transit emissions based on electric fleet share
    const busDieselGrams = 80;
    const busElectricGrams = 25;
    const transitGramsPerKm = (1 - electricShare) * busDieselGrams + electricShare * busElectricGrams;

    const shiftedCommuters = Math.max(0, Math.round(pop * (targetShare - currShare)));
    const annualShiftedPassengerKm = shiftedCommuters * distanceKm * workDays;
    const annualVehiclesKmRemoved = annualShiftedPassengerKm / carOccupancy;

    const carEmissionsTons = (annualShiftedPassengerKm * carGramsCO2PerKm) / 1000000;
    const transitEmissionsTons = (annualShiftedPassengerKm * transitGramsPerKm) / 1000000;
    const netCO2SavedTons = Math.max(0, carEmissionsTons - transitEmissionsTons);

    // Fuel & maintenance savings for commuters (Rs. 20/km car cost vs Rs. 5/km transit fare)
    const annualCarOperatingCostSaved = annualVehiclesKmRemoved * 20;
    const annualTransitFaresPaid = annualShiftedPassengerKm * 5;
    const netHouseholdSavings = Math.max(0, annualCarOperatingCostSaved - annualTransitFaresPaid);

    // Congestion relief index (0 to 100%)
    const congestionReliefPct = Math.min(65, (shiftedCommuters / pop) * 100 * 1.8);

    // Chart: Milestone progression from current share to target share in 5 stages
    const chartData: any[] = [];
    const steps = 5;
    for (let s = 0; s <= steps; s++) {
      const stepShare = currShare + (targetShare - currShare) * (s / steps);
      const stepShifted = Math.round(pop * (stepShare - currShare));
      const stepVkt = (stepShifted * distanceKm * workDays) / carOccupancy;
      const stepCO2 = Math.round(((stepShifted * distanceKm * workDays) * (carGramsCO2PerKm - transitGramsPerKm)) / 1000000);
      const stepCongestion = Math.round(Math.min(65, (stepShifted / pop) * 100 * 1.8));

      chartData.push({
        milestone: s === 0 ? 'Current' : `Phase ${s}`,
        modeShare: Math.round(stepShare * 100),
        co2SavedTons: stepCO2,
        vehicleKmRemovedMillions: Math.round(stepVkt / 1000000),
        congestionReliefPct: stepCongestion,
      });
    }

    const insights: string[] = [
      `Shifting transit share from ${formatPercent(currShare)} to ${formatPercent(targetShare)} moves ${formatNumber(shiftedCommuters)} daily commuters out of private automobiles.`,
      `Eliminates ${(annualVehiclesKmRemoved / 1000000).toFixed(1)} million vehicle-kilometers from metropolitan roads annually.`,
      `Reduces net urban greenhouse gases by ${formatNumber(Math.round(netCO2SavedTons))} metric tons of CO₂ each year.`,
      `Regional households save an aggregate of ${formatCurrency(netHouseholdSavings)} in automotive fuel and maintenance expenses.`,
    ];

    return {
      primaryMetric: {
        id: 'co2Saved',
        label: 'Annual CO₂ Emissions Reduced',
        value: netCO2SavedTons,
        formattedValue: `${formatNumber(Math.round(netCO2SavedTons))} tons/yr`,
        unit: 'metric tons CO₂',
        isPrimary: true,
        sentiment: 'positive',
        explanation: `Net tailpipe carbon avoided by substituting private driving with mass transit.`,
      },
      metrics: [
        {
          id: 'shiftedCommuters',
          label: 'Daily Commuters Shifted',
          value: shiftedCommuters,
          formattedValue: `${formatNumber(shiftedCommuters)} people`,
          sentiment: 'positive',
          explanation: `Additional people using transit each weekday.`,
        },
        {
          id: 'vktRemoved',
          label: 'Annual Car Kilometers Removed',
          value: annualVehiclesKmRemoved,
          formattedValue: `${(annualVehiclesKmRemoved / 1000000).toFixed(1)}M km`,
          sentiment: 'positive',
          explanation: `Vehicle distance eliminated from city congestion.`,
        },
        {
          id: 'householdSavings',
          label: 'Commuter Fuel & Maint. Savings',
          value: netHouseholdSavings,
          formattedValue: formatCurrency(netHouseholdSavings),
          sentiment: 'positive',
          explanation: `Net household savings after accounting for transit transit fares.`,
        },
        {
          id: 'congestionIndex',
          label: 'Peak Traffic Delay Relief',
          value: congestionReliefPct,
          formattedValue: `${congestionReliefPct.toFixed(1)}%`,
          sentiment: 'positive',
          explanation: `Modeled reduction in peak-hour traffic bottleneck severity.`,
        },
      ],
      chartData,
      chartConfig: {
        title: 'Policy Milestone Trajectory: Carbon Savings & Traffic Relief',
        description: 'Evolution of environmental and congestion benefits across phased transit expansion.',
        type: 'bar',
        xAxisKey: 'milestone',
        xAxisLabel: 'Implementation Stage',
        yAxisLabel: 'CO2 Saved (Metric Tons)',
        series: [
          { dataKey: 'co2SavedTons', name: 'CO₂ Avoided (Tons/yr)', color: '#38D996', type: 'bar' },
          { dataKey: 'vehicleKmRemovedMillions', name: 'Car Travel Eliminated (M km)', color: '#35D9FF', type: 'line' },
        ],
      },
      insights,
    };
  },
};

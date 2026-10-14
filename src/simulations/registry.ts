import { SimulationDefinition } from '../engine/types';
import { coffeeShopSimulation } from './business/coffeeShop';
import { compoundGrowthSimulation } from './finance/compoundGrowth';
import { loanRepaymentSimulation } from './finance/loanRepayment';
import { urbanTransitSimulation } from './city/urbanTransit';
import { timeAllocationSimulation } from './life/timeAllocation';
import { projectileMotionSimulation } from './science/projectileMotion';

export const SIMULATION_REGISTRY: SimulationDefinition[] = [
  coffeeShopSimulation,
  compoundGrowthSimulation,
  loanRepaymentSimulation,
  urbanTransitSimulation,
  timeAllocationSimulation,
  projectileMotionSimulation,
];

export function getAllSimulations(): SimulationDefinition[] {
  return SIMULATION_REGISTRY;
}

export function getSimulationById(id: string): SimulationDefinition | undefined {
  return SIMULATION_REGISTRY.find((s) => s.id === id);
}

export function getSimulationsByCategory(category: string): SimulationDefinition[] {
  if (category === 'all') return SIMULATION_REGISTRY;
  return SIMULATION_REGISTRY.filter((s) => s.category === category);
}

export function searchSimulations(query: string, category: string = 'all'): SimulationDefinition[] {
  let list = getSimulationsByCategory(category);
  if (!query || !query.trim()) return list;

  const q = query.trim().toLowerCase();
  return list.filter((s) => {
    return (
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tagline.toLowerCase().includes(q) ||
      s.categoryLabel.toLowerCase().includes(q) ||
      s.variables.some((v) => v.label.toLowerCase().includes(q) || v.id.toLowerCase().includes(q))
    );
  });
}

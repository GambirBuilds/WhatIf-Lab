import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPageView } from './pages/LandingPageView';
import { SimulationExplorerView } from './pages/SimulationExplorerView';
import { SimulationWorkspaceView } from './pages/SimulationWorkspaceView';
import { SavedScenariosView } from './pages/SavedScenariosView';
import { HistoryView } from './pages/HistoryView';
import { CustomExperimentView } from './pages/CustomExperimentView';
import { TestRunnerView } from './components/TestRunnerView';
import { getSimulationById, getAllSimulations } from './simulations/registry';
import { SavedScenario } from './services/storage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeSimulationId, setActiveSimulationId] = useState<string>('coffee-shop');
  const [workspaceInputs, setWorkspaceInputs] = useState<Record<string, number> | undefined>(undefined);
  const [workspaceScenarioName, setWorkspaceScenarioName] = useState<string>('Current Experiment');

  const activeSimulation = getSimulationById(activeSimulationId) || getAllSimulations()[0];

  const handleNavigate = (tab: string, simulationId?: string) => {
    if (simulationId) {
      setActiveSimulationId(simulationId);
      // Reset custom inputs when picking a new simulation via navigation
      setWorkspaceInputs(undefined);
      setWorkspaceScenarioName('Default Baseline');
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSimulationFromExplorer = (simId: string) => {
    setActiveSimulationId(simId);
    setWorkspaceInputs(undefined);
    setWorkspaceScenarioName('Default Baseline');
    setCurrentTab('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadScenarioIntoWorkspace = (
    simulationId: string,
    inputs: Record<string, number>,
    name: string
  ) => {
    setActiveSimulationId(simulationId);
    setWorkspaceInputs({ ...inputs });
    setWorkspaceScenarioName(name);
    setCurrentTab('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompareScenarios = (
    simulationId: string,
    scenA: SavedScenario,
    scenB: SavedScenario
  ) => {
    setActiveSimulationId(simulationId);
    setWorkspaceInputs({ ...scenB.inputs });
    setWorkspaceScenarioName(scenB.name);
    setCurrentTab('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14] text-[#F4F7FF] selection:bg-[#7C5CFC]/30 selection:text-white">
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        activeSimulationTitle={activeSimulation?.title}
      />

      <main className="flex-1">
        {currentTab === 'home' && (
          <LandingPageView onNavigate={handleNavigate} />
        )}

        {currentTab === 'explore' && (
          <SimulationExplorerView
            onSelectSimulation={handleSelectSimulationFromExplorer}
          />
        )}

        {currentTab === 'workspace' && (
          <SimulationWorkspaceView
            simulation={activeSimulation}
            initialInputs={workspaceInputs}
            initialScenarioName={workspaceScenarioName}
            onBackToExplorer={() => setCurrentTab('explore')}
            onNavigateToScenarios={() => setCurrentTab('scenarios')}
          />
        )}

        {currentTab === 'scenarios' && (
          <SavedScenariosView
            onLoadScenarioIntoWorkspace={handleLoadScenarioIntoWorkspace}
            onCompareScenarios={handleCompareScenarios}
          />
        )}

        {currentTab === 'history' && (
          <HistoryView
            onReopenExperiment={handleLoadScenarioIntoWorkspace}
          />
        )}

        {currentTab === 'custom' && (
          <CustomExperimentView />
        )}

        {currentTab === 'tests' && (
          <TestRunnerView />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

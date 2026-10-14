import React, { useState } from 'react';
import { StorageService, SavedScenario } from '../services/storage';
import { ExportImportService } from '../services/exportImport';
import { getAllSimulations } from '../simulations/registry';
import {
  Bookmark,
  Play,
  Copy,
  Trash2,
  Edit2,
  Download,
  Upload,
  Check,
  X,
  AlertTriangle,
  GitCompare,
  FileText,
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

interface SavedScenariosViewProps {
  onLoadScenarioIntoWorkspace: (simulationId: string, inputs: Record<string, number>, name: string) => void;
  onCompareScenarios: (simulationId: string, scenA: SavedScenario, scenB: SavedScenario) => void;
}

export const SavedScenariosView: React.FC<SavedScenariosViewProps> = ({
  onLoadScenarioIntoWorkspace,
  onCompareScenarios,
}) => {
  const [scenarios, setScenarios] = useState<SavedScenario[]>(() => StorageService.getScenarios());
  const [filterSim, setFilterSim] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [importStatus, setImportStatus] = useState<{ msg: string; isError: boolean } | null>(null);

  const allSims = getAllSimulations();

  const filteredScenarios = scenarios.filter((s) => {
    if (filterSim === 'all') return true;
    return s.simulationId === filterSim;
  });

  const handleStartEdit = (scen: SavedScenario) => {
    setEditingId(scen.id);
    setEditName(scen.name);
    setEditNotes(scen.notes || '');
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    const target = scenarios.find((s) => s.id === id);
    if (!target) return;

    const updated = StorageService.saveScenario({
      ...target,
      name: editName.trim(),
      notes: editNotes.trim(),
    });

    setScenarios(StorageService.getScenarios());
    setEditingId(null);
  };

  const handleDuplicate = (id: string) => {
    StorageService.duplicateScenario(id);
    setScenarios(StorageService.getScenarios());
  };

  const handleDelete = (id: string) => {
    StorageService.deleteScenario(id);
    setScenarios(StorageService.getScenarios());
    setDeleteConfirmId(null);
    setSelectedForComparison((prev) => prev.filter((item) => item !== id));
  };

  const toggleSelectForComparison = (id: string) => {
    setSelectedForComparison((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const handleTriggerCompare = () => {
    if (selectedForComparison.length !== 2) return;
    const scenA = scenarios.find((s) => s.id === selectedForComparison[0]);
    const scenB = scenarios.find((s) => s.id === selectedForComparison[1]);
    if (!scenA || !scenB) return;
    if (scenA.simulationId !== scenB.simulationId) {
      alert('Can only compare two scenarios belonging to the same simulation model.');
      return;
    }
    onCompareScenarios(scenA.simulationId, scenA, scenB);
  };

  const handleExportAll = () => {
    ExportImportService.exportScenariosAsJSON(scenarios);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = ExportImportService.validateAndParseScenarioJSON(content);
      if (res.success && res.scenarios) {
        res.scenarios.forEach((s) => StorageService.saveScenario(s));
        setScenarios(StorageService.getScenarios());
        setImportStatus({ msg: `Successfully imported ${res.scenarios.length} scenario(s)!`, isError: false });
      } else {
        setImportStatus({ msg: res.error || 'Failed to import JSON.', isError: true });
      }
      setTimeout(() => setImportStatus(null), 5000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#9AA8BD]/15">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#35D9FF]">
            Local Persistence
          </span>
          <h1 className="text-2xl font-extrabold text-[#F4F7FF] tracking-tight mt-1">
            Scenario Manager
          </h1>
          <p className="text-xs text-[#9AA8BD] mt-1">
            Browse, duplicate, rename, compare, and export your saved scenario configurations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="cursor-pointer px-3 py-1.5 text-xs font-medium text-[#F4F7FF] bg-[#121B2B] hover:bg-[#1a253a] border border-[#9AA8BD]/20 rounded-lg transition-colors flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-[#35D9FF]" />
            Import JSON
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          <button
            onClick={handleExportAll}
            disabled={scenarios.length === 0}
            className="px-3 py-1.5 text-xs font-medium text-[#F4F7FF] bg-[#121B2B] hover:bg-[#1a253a] border border-[#9AA8BD]/20 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5 text-[#35D9FF]" />
            Export All JSON
          </button>

          {selectedForComparison.length === 2 && (
            <button
              onClick={handleTriggerCompare}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#7C5CFC] hover:bg-[#6b47fa] rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-[#7C5CFC]/20 animate-pulse"
            >
              <GitCompare className="w-3.5 h-3.5" />
              Compare Selected (2)
            </button>
          )}
        </div>
      </div>

      {importStatus && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            importStatus.isError
              ? 'bg-[#FF647C]/10 border-[#FF647C]/30 text-[#FF647C]'
              : 'bg-[#38D996]/10 border-[#38D996]/30 text-[#38D996]'
          }`}
        >
          {importStatus.isError ? <AlertTriangle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          <span>{importStatus.msg}</span>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterSim('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            filterSim === 'all'
              ? 'bg-[#35D9FF]/15 text-[#35D9FF] border border-[#35D9FF]/40'
              : 'text-[#9AA8BD] hover:bg-[#121B2B] hover:text-white'
          }`}
        >
          All Models ({scenarios.length})
        </button>
        {allSims.map((sim) => {
          const count = scenarios.filter((s) => s.simulationId === sim.id).length;
          return (
            <button
              key={sim.id}
              onClick={() => setFilterSim(sim.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterSim === sim.id
                  ? 'bg-[#35D9FF]/15 text-[#35D9FF] border border-[#35D9FF]/40'
                  : 'text-[#9AA8BD] hover:bg-[#121B2B] hover:text-white'
              }`}
            >
              {sim.title} ({count})
            </button>
          );
        })}
      </div>

      {/* Scenarios Grid / List */}
      {filteredScenarios.length === 0 ? (
        <div className="bg-[#0E1422] rounded-2xl border border-[#9AA8BD]/15 p-12 text-center space-y-3">
          <Bookmark className="w-8 h-8 text-[#9AA8BD]/40 mx-auto" />
          <h3 className="text-sm font-semibold text-[#F4F7FF]">No scenarios found</h3>
          <p className="text-xs text-[#9AA8BD] max-w-sm mx-auto">
            Run any simulation in the workspace and click "Save Scenario" to record snapshots here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScenarios.map((scen) => {
            const sim = allSims.find((s) => s.id === scen.simulationId);
            const isEditing = editingId === scen.id;
            const isSelected = selectedForComparison.includes(scen.id);

            return (
              <div
                key={scen.id}
                className={`bg-[#0E1422] rounded-xl border p-4 transition-all space-y-3 relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#35D9FF] shadow-[0_0_12px_rgba(53,217,255,0.2)]'
                    : 'border-[#9AA8BD]/15 hover:border-[#7C5CFC]/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-mono text-[#35D9FF] uppercase tracking-wider block">
                      {sim?.title || scen.simulationId}
                    </span>

                    <button
                      onClick={() => toggleSelectForComparison(scen.id)}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                        isSelected
                          ? 'bg-[#35D9FF] text-[#080B14] border-[#35D9FF] font-bold'
                          : 'text-[#9AA8BD] border-[#9AA8BD]/20 hover:border-white'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select for Compare'}
                    </button>
                  </div>

                  {isEditing ? (
                    <div className="mt-2 space-y-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-[#121B2B] border border-[#35D9FF] rounded px-2 py-1 text-xs text-[#F4F7FF] focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="w-full bg-[#121B2B] border border-[#9AA8BD]/30 rounded px-2 py-1 text-[11px] text-[#F4F7FF] focus:outline-none"
                        placeholder="Notes..."
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-0.5 text-[11px] text-[#9AA8BD] hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(scen.id)}
                          className="px-2 py-0.5 text-[11px] bg-[#38D996] text-black rounded font-medium"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1">
                      <h3 className="text-sm font-bold text-[#F4F7FF] flex items-center justify-between">
                        <span>{scen.name}</span>
                        <button
                          onClick={() => handleStartEdit(scen)}
                          className="text-[#9AA8BD] hover:text-[#35D9FF] p-1"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </h3>
                      {scen.notes && (
                        <p className="text-xs text-[#9AA8BD] mt-1 leading-relaxed line-clamp-2">
                          {scen.notes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Summary of key inputs */}
                  <div className="mt-3 pt-3 border-t border-[#9AA8BD]/10 grid grid-cols-2 gap-2 text-[11px] font-mono text-[#9AA8BD]">
                    {Object.entries(scen.inputs).slice(0, 4).map(([k, v]) => (
                      <div key={k} className="truncate">
                        <span className="text-[#9AA8BD]/60">{k}:</span>{' '}
                        <strong className="text-[#F4F7FF]">{v}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-[#9AA8BD]/10 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[#9AA8BD]/70">
                    {formatDate(scen.updatedAt || scen.createdAt)}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDuplicate(scen.id)}
                      className="p-1.5 text-[#9AA8BD] hover:text-[#35D9FF] rounded transition-colors"
                      title="Duplicate scenario"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => ExportImportService.exportSingleScenarioAsJSON(scen)}
                      className="p-1.5 text-[#9AA8BD] hover:text-[#35D9FF] rounded transition-colors"
                      title="Export single scenario JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {deleteConfirmId === scen.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(scen.id)}
                          className="px-1.5 py-0.5 text-[10px] bg-[#FF647C] text-white rounded font-bold"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1 py-0.5 text-[10px] text-[#9AA8BD]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(scen.id)}
                        className="p-1.5 text-[#9AA8BD] hover:text-[#FF647C] rounded transition-colors"
                        title="Delete scenario"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => onLoadScenarioIntoWorkspace(scen.simulationId, scen.inputs, scen.name)}
                      className="px-2.5 py-1 text-xs font-semibold text-white bg-[#7C5CFC] hover:bg-[#6b47fa] rounded-md transition-colors flex items-center gap-1 ml-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Load
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

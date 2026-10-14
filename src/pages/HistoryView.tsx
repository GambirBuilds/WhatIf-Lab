import React, { useState } from 'react';
import { StorageService, ExperimentRecord } from '../services/storage';
import { History, Play, Trash2, ArrowUpRight, Clock, AlertTriangle } from 'lucide-react';
import { formatDate } from '../utils/formatters';

interface HistoryViewProps {
  onReopenExperiment: (simulationId: string, inputs: Record<string, number>, name: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onReopenExperiment }) => {
  const [history, setHistory] = useState<ExperimentRecord[]>(() => StorageService.getHistory());
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClear = () => {
    StorageService.clearHistory();
    setHistory([]);
    setConfirmClear(false);
  };

  const handleDeleteItem = (id: string) => {
    StorageService.deleteHistoryItem(id);
    setHistory(StorageService.getHistory());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#9AA8BD]/15">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#35D9FF]">
            Audit Trail
          </span>
          <h1 className="text-2xl font-extrabold text-[#F4F7FF] tracking-tight mt-1">
            Experiment History
          </h1>
          <p className="text-xs text-[#9AA8BD] mt-1">
            Chronological log of executed simulations, test parameters, and generated results.
          </p>
        </div>

        {history.length > 0 && (
          <div>
            {confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#FF647C]">Confirm wipe?</span>
                <button
                  onClick={handleClear}
                  className="px-2.5 py-1 text-xs font-bold text-white bg-[#FF647C] rounded-lg transition-colors"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2 py-1 text-xs text-[#9AA8BD]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="px-3 py-1.5 text-xs font-medium text-[#FF647C] hover:bg-[#FF647C]/10 border border-[#FF647C]/30 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All History
              </button>
            )}
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-[#0E1422] rounded-2xl border border-[#9AA8BD]/15 p-12 text-center space-y-3">
          <History className="w-8 h-8 text-[#9AA8BD]/40 mx-auto" />
          <h3 className="text-sm font-semibold text-[#F4F7FF]">No experiment runs recorded yet</h3>
          <p className="text-xs text-[#9AA8BD] max-w-sm mx-auto">
            Whenever you run or calculate a scenario in the Workspace, a reproducible checkpoint is logged here.
          </p>
        </div>
      ) : (
        <div className="bg-[#0E1422] rounded-xl border border-[#9AA8BD]/15 overflow-hidden">
          <div className="divide-y divide-[#9AA8BD]/10 text-xs">
            {history.map((record) => (
              <div
                key={record.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#121B2B]/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#F4F7FF]">
                      {record.simulationTitle}
                    </span>
                    <span className="text-[11px] text-[#9AA8BD]">·</span>
                    <span className="text-xs text-[#35D9FF] font-medium">
                      {record.scenarioName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-[#9AA8BD]/80">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(record.timestamp)}
                    </span>
                    <span>·</span>
                    <span className="font-mono truncate max-w-md">
                      {Object.entries(record.inputs)
                        .slice(0, 3)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(' | ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-[#9AA8BD] uppercase tracking-wider block">
                      {record.primaryOutput.label}
                    </span>
                    <span className="text-base font-bold font-mono text-[#F4F7FF]">
                      {record.primaryOutput.value}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        onReopenExperiment(
                          record.simulationId,
                          record.inputs,
                          `${record.scenarioName} (Restored)`
                        )
                      }
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-[#7C5CFC] hover:bg-[#6b47fa] rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Reopen
                    </button>

                    <button
                      onClick={() => handleDeleteItem(record.id)}
                      className="p-1.5 text-[#9AA8BD] hover:text-[#FF647C] transition-colors rounded"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

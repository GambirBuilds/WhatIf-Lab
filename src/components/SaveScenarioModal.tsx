import React, { useState } from 'react';
import { X, Bookmark, Check } from 'lucide-react';

interface SaveScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, notes: string) => void;
  initialName?: string;
  initialNotes?: string;
}

export const SaveScenarioModal: React.FC<SaveScenarioModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialName = '',
  initialNotes = '',
}) => {
  const [name, setName] = useState(initialName || `Experiment ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
  const [notes, setNotes] = useState(initialNotes || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a name for this scenario.');
      return;
    }
    onSave(name.trim(), notes.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0E1422] rounded-2xl border border-[#9AA8BD]/25 max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#9AA8BD] hover:text-white rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-[#7C5CFC]/20 text-[#7C5CFC] flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F4F7FF]">Save Scenario</h3>
            <p className="text-xs text-[#9AA8BD]">Snapshot current inputs to local browser storage</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#F4F7FF] mb-1.5">
              Scenario Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Aggressive Growth Model"
              className="w-full bg-[#121B2B] border border-[#9AA8BD]/25 rounded-lg px-3 py-2 text-sm text-[#F4F7FF] focus:outline-none focus:border-[#35D9FF] focus:ring-1 focus:ring-[#35D9FF]"
              autoFocus
            />
            {error && <p className="text-xs text-[#FF647C] mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F4F7FF] mb-1.5">
              Notes & Hypothesis (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Document your assumptions, target metrics, or strategic rationale..."
              className="w-full bg-[#121B2B] border border-[#9AA8BD]/25 rounded-lg px-3 py-2 text-xs text-[#F4F7FF] focus:outline-none focus:border-[#35D9FF] focus:ring-1 focus:ring-[#35D9FF]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#9AA8BD] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#7C5CFC] hover:bg-[#6b47fa] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Save to Scenarios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { runAllEngineTests, TestSuiteSummary } from '../engine/testSuite';
import { CheckCircle2, XCircle, Play, RefreshCw, ShieldCheck } from 'lucide-react';

export const TestRunnerView: React.FC = () => {
  const [summary, setSummary] = useState<TestSuiteSummary | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const executeTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = runAllEngineTests();
      setSummary(res);
      setIsRunning(false);
    }, 150);
  };

  useEffect(() => {
    executeTests();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#9AA8BD]/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#35D9FF]">
              Quality Assurance & Verification
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#F4F7FF] tracking-tight mt-1">
            Simulation Engine Test Suite
          </h1>
          <p className="text-xs text-[#9AA8BD] mt-1">
            Automated unit test execution validating formula accuracy, division-by-zero traps, boundary limits, and safe formula evaluation.
          </p>
        </div>

        <button
          onClick={executeTests}
          disabled={isRunning}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#7C5CFC] hover:bg-[#6b47fa] rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 self-start sm:self-auto"
        >
          {isRunning ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5" />
          )}
          {isRunning ? 'Running Tests...' : 'Rerun All Tests'}
        </button>
      </div>

      {summary && (
        <>
          {/* Summary KPI row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#121B2B] border border-[#9AA8BD]/15">
              <span className="text-xs text-[#9AA8BD]">Total Test Cases</span>
              <p className="text-2xl font-bold font-mono text-[#F4F7FF] mt-1">
                {summary.total}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#121B2B] border border-[#38D996]/30 bg-[#38D996]/5">
              <span className="text-xs text-[#38D996]">Passing</span>
              <p className="text-2xl font-bold font-mono text-[#38D996] mt-1">
                {summary.passed}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#121B2B] border border-[#FF647C]/30 bg-[#FF647C]/5">
              <span className="text-xs text-[#FF647C]">Failing</span>
              <p className="text-2xl font-bold font-mono text-[#FF647C] mt-1">
                {summary.failed}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#121B2B] border border-[#9AA8BD]/15">
              <span className="text-xs text-[#9AA8BD]">Execution Latency</span>
              <p className="text-2xl font-bold font-mono text-[#35D9FF] mt-1">
                {summary.durationMs} ms
              </p>
            </div>
          </div>

          {/* Test cases list */}
          <div className="bg-[#0E1422] rounded-xl border border-[#9AA8BD]/15 overflow-hidden">
            <div className="p-4 border-b border-[#9AA8BD]/15 bg-[#121B2B]/40 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F4F7FF]">
                Detailed Assertions
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[#38D996]">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Deterministic Engine</span>
              </div>
            </div>

            <div className="divide-y divide-[#9AA8BD]/10 text-xs">
              {summary.results.map((test) => (
                <div
                  key={test.id}
                  className="p-3.5 flex items-start sm:items-center justify-between gap-4 hover:bg-[#121B2B]/30 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    {test.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#38D996] shrink-0 mt-0.5 sm:mt-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#FF647C] shrink-0 mt-0.5 sm:mt-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#9AA8BD] uppercase">
                          [{test.suite}]
                        </span>
                        <span className="font-medium text-[#F4F7FF]">{test.name}</span>
                      </div>
                      {test.error && (
                        <p className="text-[11px] font-mono text-[#FF647C] mt-1">
                          Error: {test.error}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-[#9AA8BD] shrink-0">
                    {test.durationMs}ms
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

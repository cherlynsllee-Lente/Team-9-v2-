import React, { useState } from 'react';

interface DemoScenarioGuideProps {
  onTriggerDemoFlow: () => void;
}

export const DemoScenarioGuide: React.FC<DemoScenarioGuideProps> = ({ onTriggerDemoFlow }) => {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <div className="fixed top-18 right-3 z-30">
        <button
          onClick={() => setMinimized(false)}
          className="px-2.5 py-1.5 rounded-full bg-orange-500 text-white text-[10px] font-extrabold shadow-lg flex items-center gap-1.5 hover:scale-105 transition-transform border border-orange-400/40"
        >
          <span>🏸 Demo Guide</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-3 pt-2">
      <div className="rounded-2xl bg-slate-900/90 backdrop-blur-xl p-2.5 border border-orange-500/40 shadow-lg flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
            🏸
          </span>
          <div className="min-w-0">
            <span className="font-bold text-slate-100 text-[11px] block truncate">
              Demo Scenario: Badminton with 3 Friends
            </span>
            <span className="text-[10px] text-orange-400 truncate block">
              Group poll → Best match → ActiveSG handoff
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onTriggerDemoFlow}
            className="px-2.5 py-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold shadow-sm transition-transform active:scale-95"
          >
            Run Demo Flow
          </button>
          <button
            onClick={() => setMinimized(true)}
            className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center text-[10px] border border-slate-700/50"
            title="Minimize banner"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

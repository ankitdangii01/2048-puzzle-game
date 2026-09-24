import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatScore } from '../utils/gameLogic';

interface MilestoneModalProps {
  isOpen: boolean;
  milestoneValue: number;
  removedValue: number;
  nextMilestone: number;
  newSpawnRange: number[];
  onContinue: () => void;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({
  isOpen,
  milestoneValue,
  removedValue,
  nextMilestone,
  newSpawnRange,
  onContinue
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-indigo-500/40 p-5 shadow-2xl shadow-indigo-500/20 text-center flex flex-col items-center gap-4">
        {/* Badge */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/40 animate-pulse">
          <Sparkles className="w-7 h-7 text-white" />
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            Infinity Breakthrough
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white mt-0.5">
            {formatScore(milestoneValue)} Reached!
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            You pushed past the boundary of standard 2048!
          </p>
        </div>

        {/* Milestone Changes Card */}
        <div className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-left flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2 text-rose-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-rose-400" />
            <span>
              Tile <strong className="text-white font-bold">{formatScore(removedValue)}</strong> has been culled from the board & future spawns!
            </span>
          </div>

          <div className="flex items-center gap-2 text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>
              New spawn range: <strong className="text-white font-bold">{formatScore(newSpawnRange[0])} → {formatScore(newSpawnRange[newSpawnRange.length - 1])}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-indigo-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-indigo-400" />
            <span>
              Next cosmic target: <strong className="text-white font-bold">{formatScore(nextMilestone)}</strong>
            </span>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
        >
          <span>Continue Infinite Run</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

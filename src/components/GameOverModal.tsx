import React from 'react';
import { RotateCcw, Award, Zap, GitCommitHorizontal, Undo2 } from 'lucide-react';
import { formatScore } from '../utils/gameLogic';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  bestScore: number;
  highestTile: number;
  mergesCount: number;
  movesCount: number;
  reason?: string;
  canUndo: boolean;
  onUndo: () => void;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  bestScore,
  highestTile,
  mergesCount,
  movesCount,
  reason,
  canUndo,
  onUndo,
  onRestart
}) => {
  if (!isOpen) return null;

  const isNewBest = score >= bestScore && score > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-center flex flex-col items-center gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-rose-400">
            Run Concluded
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white mt-0.5">
            Game Over
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {reason || 'No legal moves remaining on the board!'}
          </p>
        </div>

        {/* Highlight Stats */}
        <div className="w-full grid grid-cols-2 gap-2 text-left">
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3 h-3 text-indigo-400" />
              <span>Final Score</span>
            </div>
            <div className="text-xl font-bold font-display text-white mt-1 tabular-nums">
              {formatScore(score)}
            </div>
            {isNewBest && (
              <span className="inline-block mt-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                New High Score!
              </span>
            )}
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-purple-400" />
              <span>Highest Tile</span>
            </div>
            <div className="text-xl font-bold font-display text-indigo-300 mt-1 tabular-nums">
              {formatScore(highestTile)}
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <GitCommitHorizontal className="w-3 h-3 text-emerald-400" />
              <span>Total Merges</span>
            </div>
            <div className="text-lg font-bold font-display text-emerald-300 mt-1 tabular-nums">
              {mergesCount}
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Moves Taken
            </div>
            <div className="text-lg font-bold font-display text-slate-200 mt-1 tabular-nums">
              {movesCount}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-2">
          {canUndo && (
            <button
              onClick={onUndo}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Undo2 className="w-4 h-4 text-indigo-400" />
              <span>Undo Last Move & Continue</span>
            </button>
          )}

          <button
            onClick={onRestart}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};

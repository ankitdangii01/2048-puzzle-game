import React from 'react';
import { RotateCcw, Undo2, Grid3X3, Gamepad2 } from 'lucide-react';
import { BoardSize } from '../types/game';

interface ControlsProps {
  onNewGame: () => void;
  onUndo: () => void;
  undoCount: number;
  maxUndo: number;
  boardSize: BoardSize;
  onChangeSize: (size: BoardSize) => void;
  showDPad: boolean;
  onToggleDPad: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  onNewGame,
  onUndo,
  undoCount,
  boardSize,
  onChangeSize,
  showDPad,
  onToggleDPad
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-4 gap-2">
        {/* New Game */}
        <button
          onClick={onNewGame}
          className="px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Game</span>
        </button>

        {/* Undo */}
        <button
          onClick={onUndo}
          disabled={undoCount <= 0}
          className={`px-3 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 border ${
            undoCount > 0
              ? 'bg-slate-800 hover:bg-slate-700/80 text-slate-100 border-slate-700'
              : 'bg-slate-900/40 text-slate-600 border-slate-800/40 cursor-not-allowed'
          }`}
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>Undo ({undoCount})</span>
        </button>

        {/* Grid Size Cycle */}
        <button
          onClick={() => {
            const nextSize = boardSize === 3 ? 4 : boardSize === 4 ? 5 : 3;
            onChangeSize(nextSize);
          }}
          className="px-2.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 border border-slate-700 transition-all active:scale-95"
          title="Switch board size (3x3, 4x4, 5x5)"
        >
          <Grid3X3 className="w-3.5 h-3.5 text-indigo-400" />
          <span>{boardSize}×{boardSize}</span>
        </button>

        {/* D-Pad Toggle */}
        <button
          onClick={onToggleDPad}
          className={`px-2.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 border transition-all active:scale-95 ${
            showDPad
              ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40'
              : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700'
          }`}
          title="Toggle on-screen arrow controls"
        >
          <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">D-Pad</span>
          <span className="sm:hidden">{showDPad ? 'Hide' : 'Pad'}</span>
        </button>
      </div>

      <div className="flex items-center justify-between px-1 text-[11px] text-slate-500 font-medium">
        <span>Use Arrow Keys or Swipe on screen</span>
        <span>WASD also supported</span>
      </div>
    </div>
  );
};

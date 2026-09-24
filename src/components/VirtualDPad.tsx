import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface VirtualDPadProps {
  onMove: (dir: 0 | 1 | 2 | 3) => void;
}

export const VirtualDPad: React.FC<VirtualDPadProps> = ({ onMove }) => {
  return (
    <div className="flex flex-col items-center gap-1.5 py-1 select-none">
      {/* Up */}
      <button
        onClick={() => onMove(0)}
        aria-label="Move Up"
        className="w-12 h-11 rounded-xl bg-slate-800/90 active:bg-indigo-600 border border-slate-700/80 active:border-indigo-400 text-slate-200 active:text-white flex items-center justify-center shadow transition-all active:scale-90"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* Left, Down, Right */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onMove(3)}
          aria-label="Move Left"
          className="w-12 h-11 rounded-xl bg-slate-800/90 active:bg-indigo-600 border border-slate-700/80 active:border-indigo-400 text-slate-200 active:text-white flex items-center justify-center shadow transition-all active:scale-90"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => onMove(2)}
          aria-label="Move Down"
          className="w-12 h-11 rounded-xl bg-slate-800/90 active:bg-indigo-600 border border-slate-700/80 active:border-indigo-400 text-slate-200 active:text-white flex items-center justify-center shadow transition-all active:scale-90"
        >
          <ArrowDown className="w-5 h-5" />
        </button>

        <button
          onClick={() => onMove(1)}
          aria-label="Move Right"
          className="w-12 h-11 rounded-xl bg-slate-800/90 active:bg-indigo-600 border border-slate-700/80 active:border-indigo-400 text-slate-200 active:text-white flex items-center justify-center shadow transition-all active:scale-90"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

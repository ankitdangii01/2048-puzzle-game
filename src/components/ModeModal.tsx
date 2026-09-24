import React from 'react';
import { X, Sparkles, Footprints, Clock, Wind, Check } from 'lucide-react';
import { GameMode } from '../types/game';

interface ModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
}

const MODES: { id: GameMode; title: string; desc: string; icon: React.ReactNode; badge: string }[] = [
  {
    id: 'classic',
    title: 'Classic Infinity',
    desc: 'The definitive experience. Reach 2048, 4096, and infinite milestones with dynamic base tile culling.',
    icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
    badge: 'Standard'
  },
  {
    id: 'challenge',
    title: '100-Move Challenge',
    desc: 'Race to reach 2048 before using up 100 total moves. Every merge matters!',
    icon: <Footprints className="w-5 h-5 text-amber-400" />,
    badge: '100 Moves'
  },
  {
    id: 'rush',
    title: 'Time Rush Blitz',
    desc: '90-second countdown. Fast-paced sliding where every merge grants +2 seconds bonus time.',
    icon: <Clock className="w-5 h-5 text-rose-400" />,
    badge: '90s Blitz'
  },
  {
    id: 'zen',
    title: 'Zen Flow',
    desc: 'Pure relaxing puzzle flow with unlimited undos and no game over anxiety.',
    icon: <Wind className="w-5 h-5 text-emerald-400" />,
    badge: 'Relaxed'
  }
];

export const ModeModal: React.FC<ModeModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-base font-bold font-display text-white">
            Select Game Mode
          </h2>
          <button
            onClick={onClose}
            aria-label="Close mode dialog"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2">
          {MODES.map((m) => {
            const isSelected = currentMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  onSelectMode(m.id);
                  onClose();
                }}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all active:scale-98 ${
                  isSelected
                    ? 'bg-indigo-950/50 border-indigo-500 shadow-md shadow-indigo-500/20'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/80 shrink-0">
                  {m.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-white">{m.title}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                        {m.badge}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">
                    {m.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

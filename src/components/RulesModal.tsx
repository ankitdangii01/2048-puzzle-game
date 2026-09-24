import React from 'react';
import { X, Sparkles, Zap, Flame, Star, Infinity as InfinityIcon } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[85vh] rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl flex flex-col gap-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <InfinityIcon className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold font-display text-white">
              Rules & Mechanics
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close rules"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-4 pr-1 text-xs text-slate-300">
          {/* Basics */}
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold text-indigo-300 flex items-center gap-1.5">
              <span>Classic Movement & Merging</span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Use your <strong>Arrow Keys</strong>, <strong>WASD</strong>, or <strong>Swipe</strong> across the screen to slide tiles. When two tiles of the same number touch, they merge into one with double the value!
            </p>
          </div>

          {/* Infinite Progression */}
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 space-y-1.5">
            <h3 className="text-sm font-semibold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Infinite Progression Mechanism</span>
            </h3>
            <p className="text-slate-300 leading-relaxed">
              In 2048 Infinity, reaching 2048 is not the end — it’s just level one!
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Hitting a milestone permanently removes the lowest base number (e.g. 2 drops out, baseline becomes 4).</li>
              <li>Higher base numbers start spawning directly on the board.</li>
              <li>New milestones dynamically unlock (4096, 8192, 16384, 32768, 65536, and beyond).</li>
            </ul>
          </div>

          {/* Special Tiles */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-indigo-300">
              Special Ability Tiles
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {/* 2x */}
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm shrink-0 shadow">
                  ×2
                </div>
                <div>
                  <div className="font-semibold text-white flex items-center gap-1">
                    <Zap className="w-3 h-3 text-violet-400" />
                    <span>Multiplier Tile</span>
                  </div>
                  <div className="text-slate-400 mt-0.5 leading-snug">
                    Merges with any adjacent number tile, instantly doubling its value!
                  </div>
                </div>
              </div>

              {/* Bomb */}
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-zinc-900 to-rose-950 border border-rose-500/80 flex items-center justify-center text-rose-400 text-lg shrink-0 shadow">
                  💣
                </div>
                <div>
                  <div className="font-semibold text-white flex items-center gap-1">
                    <Flame className="w-3 h-3 text-rose-400" />
                    <span>Bomb Tile</span>
                  </div>
                  <div className="text-slate-400 mt-0.5 leading-snug">
                    Detonates upon collision, blowing away surrounding low-tier clutter to free vital board space.
                  </div>
                </div>
              </div>

              {/* Wildcard */}
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-500 via-amber-500 to-sky-500 flex items-center justify-center text-white text-lg shrink-0 shadow">
                  ★
                </div>
                <div>
                  <div className="font-semibold text-white flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400" />
                    <span>Wildcard Tile</span>
                  </div>
                  <div className="text-slate-400 mt-0.5 leading-snug">
                    Chameleonic tile that matches any number it touches and upgrades it into the next tier.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modes */}
          <div className="space-y-1.5 pt-1">
            <h3 className="text-sm font-semibold text-indigo-300">
              Game Modes
            </h3>
            <p className="text-slate-400">
              Switch modes anytime via the header mode button:
            </p>
            <ul className="space-y-1 text-slate-400">
              <li><strong className="text-slate-200">Classic Infinity:</strong> The complete progression experience with milestones.</li>
              <li><strong className="text-slate-200">Move Challenge:</strong> Race to reach 2048 in 100 moves or less.</li>
              <li><strong className="text-slate-200">Time Rush:</strong> 90-second speed challenge (+2s per merge).</li>
              <li><strong className="text-slate-200">Zen Flow:</strong> Unlimited undos without stress or timers.</li>
            </ul>
          </div>
        </div>

        {/* Footer Close */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
        >
          Got It, Let's Play!
        </button>
      </div>
    </div>
  );
};

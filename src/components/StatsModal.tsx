import React from 'react';
import { X, Trophy, Award, Zap, GitCommitHorizontal, Flame, Star, Lock, Check } from 'lucide-react';
import { GameStats } from '../types/game';
import { formatScore } from '../utils/gameLogic';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onResetStats: () => void;
}

const MILESTONE_TIERS = [2048, 4096, 8192, 16384, 32768, 65536, 131072];

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onResetStats
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[85vh] rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl flex flex-col gap-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold font-display text-white">
              Career Statistics & Badges
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close stats"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto space-y-4 pr-1 text-xs">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>All-Time Best</span>
              </div>
              <div className="text-lg font-bold font-display text-white mt-1 tabular-nums">
                {formatScore(stats.bestScore)}
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Highest Tile</span>
              </div>
              <div className="text-lg font-bold font-display text-indigo-300 mt-1 tabular-nums">
                {formatScore(stats.highestTileReached)}
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <GitCommitHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Total Merges</span>
              </div>
              <div className="text-lg font-bold font-display text-emerald-300 mt-1 tabular-nums">
                {stats.totalMerges.toLocaleString()}
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Games Played
              </div>
              <div className="text-lg font-bold font-display text-slate-200 mt-1 tabular-nums">
                {stats.gamesPlayed}
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>Bombs Detonated</span>
              </div>
              <div className="text-lg font-bold font-display text-rose-300 mt-1 tabular-nums">
                {stats.totalBombsDetonated}
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>Wilds Used</span>
              </div>
              <div className="text-lg font-bold font-display text-amber-300 mt-1 tabular-nums">
                {stats.totalWildsUsed}
              </div>
            </div>
          </div>

          {/* Milestones Unlocked Gallery */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-200">
              Cosmic Milestone Badges
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MILESTONE_TIERS.map((tier) => {
                const isUnlocked =
                  stats.highestTileReached >= tier ||
                  stats.milestonesUnlocked.includes(tier);

                return (
                  <div
                    key={tier}
                    className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                      isUnlocked
                        ? 'bg-indigo-950/40 border-indigo-500/50 shadow-sm shadow-indigo-500/20 text-slate-200'
                        : 'bg-slate-800/30 border-slate-800 text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1 text-xs">
                      {isUnlocked ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <span className="font-bold text-sm font-display">
                      {formatScore(tier)}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider mt-0.5 opacity-80">
                      {isUnlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reset Stats */}
          <div className="pt-2 text-center">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all career statistics?')) {
                  onResetStats();
                }
              }}
              className="text-[11px] text-rose-400/80 hover:text-rose-400 hover:underline transition-colors"
            >
              Reset Career Statistics
            </button>
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

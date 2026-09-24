import React from 'react';
import { Trophy, Zap, Compass, Clock, Footprints } from 'lucide-react';
import { GameMode } from '../types/game';
import { formatScore } from '../utils/gameLogic';

interface StatsBannerProps {
  score: number;
  bestScore: number;
  highestTile: number;
  currentMilestone: number;
  progressionRange: number[];
  mode: GameMode;
  movesCount: number;
  maxMoves: number;
  timeRemaining?: number;
  scoreGained?: number;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  score,
  bestScore,
  highestTile,
  currentMilestone,
  progressionRange,
  mode,
  movesCount,
  maxMoves,
  timeRemaining,
  scoreGained
}) => {
  // Calculate milestone progress percentage based on log2
  const minVal = progressionRange[0] || 2;
  const progressRatio = Math.max(
    0,
    Math.min(
      1,
      (Math.log2(highestTile) - Math.log2(minVal)) /
        (Math.log2(currentMilestone) - Math.log2(minVal))
    )
  );

  const rangeText = `${formatScore(progressionRange[0])} → ${formatScore(
    progressionRange[progressionRange.length - 1]
  )}`;

  return (
    <div className="flex flex-col gap-2.5">
      {/* Primary Score Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="relative overflow-hidden bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 sm:p-3 text-center shadow-sm">
          <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
            Score
          </div>
          <div className="text-lg sm:text-2xl font-bold font-display text-slate-100 tabular-nums">
            {formatScore(score)}
          </div>
          {scoreGained && scoreGained > 0 ? (
            <span
              key={Date.now()}
              className="absolute right-2 top-1 text-[11px] font-extrabold text-emerald-400 animate-bounce"
            >
              +{scoreGained}
            </span>
          ) : null}
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 sm:p-3 text-center shadow-sm">
          <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>Best</span>
          </div>
          <div className="text-lg sm:text-2xl font-bold font-display text-amber-300 tabular-nums">
            {formatScore(bestScore)}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 sm:p-3 text-center shadow-sm">
          <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
            <Zap className="w-3 h-3 text-indigo-400" />
            <span>Highest</span>
          </div>
          <div className="text-lg sm:text-2xl font-bold font-display text-indigo-300 tabular-nums">
            {formatScore(highestTile)}
          </div>
        </div>
      </div>

      {/* Infinity Progression Progress & Mode HUD */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl px-3 py-2 text-xs flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-1.5 font-medium">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">Target:</span>
            <span className="font-bold text-indigo-300">{formatScore(currentMilestone)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Spawn:</span>
            <span className="font-semibold text-emerald-300">{rangeText}</span>
          </div>

          {mode === 'challenge' && (
            <div className="flex items-center gap-1 font-semibold text-amber-300">
              <Footprints className="w-3.5 h-3.5" />
              <span>{Math.max(0, maxMoves - movesCount)} left</span>
            </div>
          )}

          {mode === 'rush' && timeRemaining !== undefined && (
            <div className="flex items-center gap-1 font-semibold text-rose-300">
              <Clock className="w-3.5 h-3.5" />
              <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
            </div>
          )}
        </div>

        {/* Progress Bar towards Milestone */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.round(progressRatio * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

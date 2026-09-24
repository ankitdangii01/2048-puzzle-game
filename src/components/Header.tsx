import React from 'react';
import { Volume2, VolumeX, Palette, HelpCircle, BarChart3, Shuffle } from 'lucide-react';
import { ThemeId, GameMode } from '../types/game';
import { THEMES } from '../utils/themes';

interface HeaderProps {
  theme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenRules: () => void;
  onOpenStats: () => void;
  onOpenMode: () => void;
  mode: GameMode;
}

const MODE_LABELS: Record<GameMode, string> = {
  classic: 'Classic Infinity',
  challenge: 'Move Challenge',
  rush: 'Time Rush',
  zen: 'Zen Flow'
};

export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeChange,
  isMuted,
  onToggleMute,
  onOpenRules,
  onOpenStats,
  onOpenMode,
  mode
}) => {
  const themeConfig = THEMES[theme];

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2 pt-1 border-b border-slate-800/40">
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black font-display tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            2048 ∞
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400/80 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
            Infinity
          </span>
        </div>

        <button
          onClick={onOpenMode}
          className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 transition-colors flex items-center gap-1.5"
          title="Change game mode"
        >
          <Shuffle className="w-3.5 h-3.5 text-indigo-400" />
          <span>{MODE_LABELS[mode]}</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        {/* Theme Selector */}
        <div className="relative group">
          <button
            aria-label="Change theme"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors flex items-center gap-1 text-xs"
            title="Switch color theme"
          >
            <Palette className="w-4 h-4 text-purple-400" />
            <span className="hidden md:inline capitalize">{themeConfig.name.split(' ')[0]}</span>
          </button>
          <div className="absolute right-0 top-full mt-1 w-40 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 hidden group-hover:block z-30">
            {(Object.keys(THEMES) as ThemeId[]).map((tId) => (
              <button
                key={tId}
                onClick={() => onThemeChange(tId)}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                  theme === tId ? 'text-indigo-400 font-semibold bg-indigo-500/10' : 'text-slate-300'
                }`}
              >
                <span>{THEMES[tId].name}</span>
                {theme === tId && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <button
          onClick={onOpenStats}
          aria-label="Career statistics"
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
          title="Career stats and milestones"
        >
          <BarChart3 className="w-4 h-4 text-cyan-400" />
        </button>

        {/* Rules */}
        <button
          onClick={onOpenRules}
          aria-label="Game rules and special tiles"
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
          title="How to play & Special tiles"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleMute}
          aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
          className={`p-2 rounded-lg border transition-colors ${
            isMuted
              ? 'bg-slate-800/50 text-slate-500 border-slate-800'
              : 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-600/30'
          }`}
          title={isMuted ? 'Unmute sound' : 'Mute sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};

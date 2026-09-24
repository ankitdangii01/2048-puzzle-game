import { ThemeId, TileType } from '../types/game';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bodyBg: string;
  cardBg: string;
  gridBg: string;
  cellEmpty: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  obsidian: {
    id: 'obsidian',
    name: 'Midnight Obsidian',
    bodyBg: 'bg-slate-950',
    cardBg: 'bg-slate-900/90 border border-slate-800',
    gridBg: 'bg-slate-900 border border-slate-800/80',
    cellEmpty: 'bg-slate-800/40',
    accent: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400'
  },
  classic: {
    id: 'classic',
    name: 'Classic Warmth',
    bodyBg: 'bg-[#faf8ef]',
    cardBg: 'bg-[#bbada0]/20 border border-[#bbada0]/30',
    gridBg: 'bg-[#bbada0]',
    cellEmpty: 'bg-[#cdc1b4]',
    accent: 'bg-[#8f7a66] hover:bg-[#9f8b77] text-white',
    textPrimary: 'text-[#776e65]',
    textSecondary: 'text-[#8f7a66]'
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Neon Cyberpunk',
    bodyBg: 'bg-[#090514]',
    cardBg: 'bg-[#150a29]/90 border border-fuchsia-900/50',
    gridBg: 'bg-[#120722] border border-cyan-500/30',
    cellEmpty: 'bg-[#220d3d]/50',
    accent: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-600/30',
    textPrimary: 'text-fuchsia-100',
    textSecondary: 'text-fuchsia-300/70'
  },
  emerald: {
    id: 'emerald',
    name: 'Imperial Emerald',
    bodyBg: 'bg-[#06120e]',
    cardBg: 'bg-[#0b1f18]/90 border border-emerald-900/50',
    gridBg: 'bg-[#081913] border border-emerald-800/60',
    cellEmpty: 'bg-[#0e2b21]/50',
    accent: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30',
    textPrimary: 'text-emerald-100',
    textSecondary: 'text-emerald-300/70'
  }
};

/**
 * Returns Tailwind classes and inline styles for each tile according to value & type.
 */
export function getTileStyle(value: number, type: TileType, theme: ThemeId): {
  bgClass: string;
  textClass: string;
  glowClass?: string;
  borderClass?: string;
  subLabel?: string;
} {
  // Special tiles styling
  if (type === '2x') {
    return {
      bgClass: 'bg-gradient-to-br from-violet-600 to-indigo-700',
      textClass: 'text-white font-extrabold',
      glowClass: 'shadow-[0_0_15px_rgba(139,92,246,0.5)]',
      borderClass: 'border-2 border-violet-300/80',
      subLabel: 'MULTIPLIER'
    };
  }

  if (type === 'bomb') {
    return {
      bgClass: 'bg-gradient-to-br from-zinc-900 via-rose-950 to-neutral-900',
      textClass: 'text-rose-400 font-extrabold',
      glowClass: 'shadow-[0_0_18px_rgba(244,63,94,0.5)]',
      borderClass: 'border-2 border-rose-500 animate-pulse',
      subLabel: 'BLAST'
    };
  }

  if (type === 'wild') {
    return {
      bgClass: 'bg-gradient-to-br from-rose-500 via-amber-500 via-emerald-500 to-sky-500 bg-[length:200%_200%]',
      textClass: 'text-white font-black',
      glowClass: 'shadow-[0_0_20px_rgba(234,179,8,0.6)]',
      borderClass: 'border-2 border-amber-300',
      subLabel: 'WILDCARD'
    };
  }

  // Classic theme special colors
  if (theme === 'classic') {
    switch (value) {
      case 2:
        return { bgClass: 'bg-[#eee4da]', textClass: 'text-[#776e65]' };
      case 4:
        return { bgClass: 'bg-[#ede0c8]', textClass: 'text-[#776e65]' };
      case 8:
        return { bgClass: 'bg-[#f2b179]', textClass: 'text-white' };
      case 16:
        return { bgClass: 'bg-[#f59563]', textClass: 'text-white' };
      case 32:
        return { bgClass: 'bg-[#f67c5f]', textClass: 'text-white' };
      case 64:
        return { bgClass: 'bg-[#f65e3b]', textClass: 'text-white' };
      case 128:
        return { bgClass: 'bg-[#edcf72]', textClass: 'text-white', glowClass: 'shadow-[0_0_8px_rgba(237,207,114,0.4)]' };
      case 256:
        return { bgClass: 'bg-[#edcc61]', textClass: 'text-white', glowClass: 'shadow-[0_0_10px_rgba(237,204,97,0.5)]' };
      case 512:
        return { bgClass: 'bg-[#edc850]', textClass: 'text-white', glowClass: 'shadow-[0_0_12px_rgba(237,200,80,0.6)]' };
      case 1024:
        return { bgClass: 'bg-[#edc53f]', textClass: 'text-white', glowClass: 'shadow-[0_0_15px_rgba(237,197,63,0.7)]' };
      case 2048:
        return { bgClass: 'bg-[#edc22e]', textClass: 'text-white', glowClass: 'shadow-[0_0_20px_rgba(237,194,46,0.8)]' };
      default:
        return {
          bgClass: 'bg-gradient-to-tr from-[#3c3a32] to-[#776e65]',
          textClass: 'text-[#f9f6f2] font-black',
          glowClass: 'shadow-[0_0_25px_rgba(237,194,46,0.8)]',
          borderClass: 'border-2 border-[#edc22e]'
        };
    }
  }

  // Obsidian / Cyberpunk / Emerald default high-tech gradient palette
  switch (value) {
    case 2:
      return { bgClass: 'bg-slate-800 text-slate-200', textClass: 'text-slate-200' };
    case 4:
      return { bgClass: 'bg-slate-700 text-slate-100', textClass: 'text-slate-100' };
    case 8:
      return { bgClass: 'bg-amber-600 text-amber-50', textClass: 'text-amber-50', glowClass: 'shadow-sm shadow-amber-600/30' };
    case 16:
      return { bgClass: 'bg-orange-600 text-orange-50', textClass: 'text-orange-50', glowClass: 'shadow-md shadow-orange-600/40' };
    case 32:
      return { bgClass: 'bg-rose-600 text-rose-50', textClass: 'text-rose-50', glowClass: 'shadow-md shadow-rose-600/40' };
    case 64:
      return { bgClass: 'bg-red-600 text-white', textClass: 'text-white', glowClass: 'shadow-lg shadow-red-600/50' };
    case 128:
      return { bgClass: 'bg-amber-500 text-slate-950 font-bold', textClass: 'text-slate-950', glowClass: 'shadow-lg shadow-amber-500/50' };
    case 256:
      return { bgClass: 'bg-yellow-400 text-slate-950 font-bold', textClass: 'text-slate-950', glowClass: 'shadow-xl shadow-yellow-400/50' };
    case 512:
      return { bgClass: 'bg-emerald-500 text-white', textClass: 'text-white', glowClass: 'shadow-xl shadow-emerald-500/50' };
    case 1024:
      return { bgClass: 'bg-cyan-500 text-white', textClass: 'text-white', glowClass: 'shadow-xl shadow-cyan-500/60' };
    case 2048:
      return {
        bgClass: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white',
        textClass: 'text-white font-black',
        glowClass: 'shadow-[0_0_20px_rgba(99,102,241,0.7)]',
        borderClass: 'border border-indigo-300/40'
      };
    case 4096:
      return {
        bgClass: 'bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 text-white',
        textClass: 'text-white font-black',
        glowClass: 'shadow-[0_0_25px_rgba(217,70,239,0.8)]',
        borderClass: 'border border-fuchsia-300/60'
      };
    case 8192:
      return {
        bgClass: 'bg-gradient-to-br from-pink-500 via-rose-600 to-amber-500 text-white',
        textClass: 'text-white font-black',
        glowClass: 'shadow-[0_0_30px_rgba(244,63,94,0.85)]',
        borderClass: 'border-2 border-amber-300'
      };
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    default:
      return {
        bgClass: 'bg-gradient-to-br from-indigo-900 via-purple-800 to-cyan-500 text-white',
        textClass: 'text-white font-black',
        glowClass: 'shadow-[0_0_35px_rgba(168,85,247,0.9)]',
        borderClass: 'border-2 border-cyan-400 animate-pulse'
      };
  }
}

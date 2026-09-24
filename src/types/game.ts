export type TileType = 'normal' | '2x' | 'bomb' | 'wild';

export interface Tile {
  id: string;
  r: number;
  c: number;
  value: number;
  type: TileType;
  isNew?: boolean;
  isMerged?: boolean;
}

export type GameMode = 'classic' | 'challenge' | 'rush' | 'zen';

export type BoardSize = 3 | 4 | 5;

export type ThemeId = 'obsidian' | 'classic' | 'cyberpunk' | 'emerald';

export interface GameStateSnapshot {
  board: (Tile | null)[][];
  score: number;
  highestTile: number;
  milestoneIndex: number;
  currentMilestone: number;
  progressionRange: number[];
  movesCount: number;
  timeRemaining?: number;
  mergesCount: number;
}

export interface GameStats {
  gamesPlayed: number;
  bestScore: number;
  highestTileReached: number;
  totalMerges: number;
  totalBombsDetonated: number;
  totalWildsUsed: number;
  milestonesUnlocked: number[];
}

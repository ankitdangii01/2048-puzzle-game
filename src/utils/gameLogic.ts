import { Tile, TileType, BoardSize, GameMode } from '../types/game';

export interface ProgressionConfigData {
  initialMilestone: number;
  initialRange: number[];
  specialTileChance: number;
}

export const DEFAULT_PROGRESSION: ProgressionConfigData = {
  initialMilestone: 2048,
  initialRange: [2, 4, 8, 16, 32, 64, 128],
  specialTileChance: 0.10 // 10% chance to spawn special tile when score > 800
};

export function createEmptyBoard(size: BoardSize): (Tile | null)[][] {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => null));
}

let tileIdCounter = 0;
export function generateTileId(): string {
  tileIdCounter++;
  return `tile_${Date.now()}_${tileIdCounter}_${Math.random().toString(36).substring(2, 7)}`;
}

export function formatScore(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 10_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toLocaleString();
}

/**
 * Spawns a new tile into a random empty slot.
 */
export function spawnTileInBoard(
  board: (Tile | null)[][],
  progressionRange: number[],
  score: number
): { board: (Tile | null)[][]; spawnedTile: Tile | null } {
  const size = board.length;
  const emptyCells: { r: number; c: number }[] = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!board[r][c]) {
        emptyCells.push({ r, c });
      }
    }
  }

  if (emptyCells.length === 0) {
    return { board, spawnedTile: null };
  }

  const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newBoard = board.map(row => [...row]);

  // Determine special tile or normal tile
  let type: TileType = 'normal';
  // Pick from the lowest 2 items in current progression range (e.g. 2 or 4, or 4 or 8)
  const minVal = progressionRange[0] || 2;
  const secondVal = progressionRange[1] || minVal * 2;
  let value = Math.random() < 0.85 ? minVal : secondVal;

  // After some gameplay (score >= 800), spawn special tiles with 10% chance
  if (score >= 800 && Math.random() < DEFAULT_PROGRESSION.specialTileChance) {
    const specialPool: TileType[] = ['2x', 'bomb', 'wild'];
    type = specialPool[Math.floor(Math.random() * specialPool.length)];
    // Multiplier/bomb/wild keep minVal as fallback reference
    value = minVal;
  }

  const newTile: Tile = {
    id: generateTileId(),
    r,
    c,
    value,
    type,
    isNew: true
  };

  newBoard[r][c] = newTile;
  return { board: newBoard, spawnedTile: newTile };
}

export interface MoveResult {
  newBoard: (Tile | null)[][];
  moved: boolean;
  scoreAdded: number;
  highestTile: number;
  mergesCount: number;
  bombExplosion?: { r: number; c: number; clearedCount: number };
  wildMatched?: boolean;
}

/**
 * Core Move Engine supporting 0: Up, 1: Right, 2: Down, 3: Left
 */
export function executeMove(
  board: (Tile | null)[][],
  direction: 0 | 1 | 2 | 3,
  currentHighest: number,
  minProgressionTier: number
): MoveResult {
  const size = board.length;
  const isVertical = direction === 0 || direction === 2;
  const isForward = direction === 2 || direction === 1;

  let moved = false;
  let scoreAdded = 0;
  let highestTile = currentHighest;
  let mergesCount = 0;
  let bombExplosion: { r: number; c: number; clearedCount: number } | undefined;
  let wildMatched = false;

  // Create clean cloned matrix
  const newBoard: (Tile | null)[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => null));

  for (let i = 0; i < size; i++) {
    // Extract non-null tiles in directional order
    const line: Tile[] = [];
    for (let j = 0; j < size; j++) {
      const r = isVertical ? (isForward ? size - 1 - j : j) : i;
      const c = isVertical ? i : (isForward ? size - 1 - j : j);
      const cell = board[r][c];
      if (cell) {
        line.push({ ...cell, isNew: false, isMerged: false });
      }
    }

    // Process line collisions
    const processedLine: Tile[] = [];
    for (let j = 0; j < line.length; j++) {
      const current = line[j];
      const next = line[j + 1];

      if (next) {
        let isMerge = false;
        let mergedValue = current.value;

        // Normal number merge
        if (current.type === 'normal' && next.type === 'normal' && current.value === next.value) {
          isMerge = true;
          mergedValue = current.value * 2;
        }
        // Multiplier (2x) merge
        else if (current.type === '2x' && next.type === 'normal') {
          isMerge = true;
          mergedValue = next.value * 2;
        } else if (next.type === '2x' && current.type === 'normal') {
          isMerge = true;
          mergedValue = current.value * 2;
        }
        // Wildcard merge
        else if (current.type === 'wild' && next.type === 'normal') {
          isMerge = true;
          mergedValue = next.value * 2;
          wildMatched = true;
        } else if (next.type === 'wild' && current.type === 'normal') {
          isMerge = true;
          mergedValue = current.value * 2;
          wildMatched = true;
        }
        // Bomb merge
        else if (current.type === 'bomb' || next.type === 'bomb') {
          bombExplosion = {
            r: current.r,
            c: current.c,
            clearedCount: 0
          };
          j++; // consume bomb pair
          scoreAdded += 100;
          mergesCount++;
          continue;
        }

        if (isMerge) {
          mergesCount++;
          scoreAdded += mergedValue;
          if (mergedValue > highestTile) {
            highestTile = mergedValue;
          }
          processedLine.push({
            id: generateTileId(),
            r: 0,
            c: 0,
            value: mergedValue,
            type: 'normal',
            isMerged: true
          });
          j++; // skip next since it merged
          continue;
        }
      }

      processedLine.push(current);
    }

    // Place back onto newBoard and check coordinate movement
    for (let j = 0; j < size; j++) {
      const r = isVertical ? (isForward ? size - 1 - j : j) : i;
      const c = isVertical ? i : (isForward ? size - 1 - j : j);
      const newTile = processedLine[j] || null;

      if (newTile) {
        if (newTile.r !== r || newTile.c !== c || newTile.isMerged) {
          moved = true;
        }
        newTile.r = r;
        newTile.c = c;
      } else if (board[r][c] !== null) {
        moved = true;
      }

      newBoard[r][c] = newTile;
    }
  }

  // Handle bomb blast radius if detonated
  if (bombExplosion) {
    let cleared = 0;
    const { r: centerR, c: centerC } = bombExplosion;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = centerR + dr;
        const nc = centerC + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size && newBoard[nr][nc]) {
          const tile = newBoard[nr][nc]!;
          // Clears tiles that are low-value or special tiles in range
          if (tile.type !== 'normal' || tile.value <= minProgressionTier * 8) {
            newBoard[nr][nc] = null;
            cleared++;
            moved = true;
          }
        }
      }
    }
    bombExplosion.clearedCount = cleared;
  }

  return {
    newBoard,
    moved,
    scoreAdded,
    highestTile,
    mergesCount,
    bombExplosion,
    wildMatched
  };
}

/**
 * Checks if the board has any valid legal moves left.
 */
export function checkHasMovesLeft(board: (Tile | null)[][]): boolean {
  const size = board.length;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const current = board[r][c];
      // Empty cell means moves are definitely available
      if (!current) return true;

      // Any special tile can activate or clear
      if (current.type !== 'normal') return true;

      // Check down neighbor
      if (r < size - 1) {
        const down = board[r + 1][c];
        if (!down || down.type !== 'normal' || down.value === current.value) {
          return true;
        }
      }

      // Check right neighbor
      if (c < size - 1) {
        const right = board[r][c + 1];
        if (!right || right.type !== 'normal' || right.value === current.value) {
          return true;
        }
      }
    }
  }

  return false;
}

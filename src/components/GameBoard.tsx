import React, { useRef, useEffect } from 'react';
import { Tile, BoardSize, ThemeId } from '../types/game';
import { getTileStyle } from '../utils/themes';
import { ParticleCanvas, ParticleCanvasHandle } from './ParticleCanvas';
import { formatScore } from '../utils/gameLogic';

interface GameBoardProps {
  board: (Tile | null)[][];
  boardSize: BoardSize;
  theme: ThemeId;
  isShaking: boolean;
  onMove: (direction: 0 | 1 | 2 | 3) => void;
  particleRef: React.RefObject<ParticleCanvasHandle | null>;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  boardSize,
  theme,
  isShaking,
  onMove,
  particleRef
}) => {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Handle Touch Swipes
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent browser pull-to-refresh and scroll inside the game board
      if (touchStartRef.current) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const threshold = 28;

      if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal: 1: Right, 3: Left
          onMove(deltaX > 0 ? 1 : 3);
        } else {
          // Vertical: 0: Up, 2: Down
          onMove(deltaY > 0 ? 2 : 0);
        }
      }

      touchStartRef.current = null;
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onMove]);

  // Flatten active tiles
  const activeTiles: Tile[] = [];
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      const tile = board[r]?.[c];
      if (tile) {
        activeTiles.push(tile);
      }
    }
  }

  // Calculate gaps and sizing
  const gapPx = boardSize === 5 ? 6 : 8;
  const paddingPx = boardSize === 5 ? 8 : 10;

  return (
    <div
      ref={boardRef}
      className={`relative aspect-square w-full max-w-[460px] mx-auto rounded-2xl p-2 sm:p-2.5 bg-slate-900 border border-slate-800 shadow-2xl select-none touch-none transition-transform duration-100 ${
        isShaking ? 'animate-board-shake' : ''
      }`}
      style={{
        padding: `${paddingPx}px`
      }}
    >
      {/* Particle Overlay */}
      <ParticleCanvas ref={particleRef} />

      {/* Static Background Grid Cells */}
      <div
        className="grid w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${boardSize}, minmax(0, 1fr))`,
          gap: `${gapPx}px`
        }}
      >
        {Array.from({ length: boardSize * boardSize }).map((_, idx) => (
          <div
            key={idx}
            className="w-full h-full rounded-xl bg-slate-800/40 border border-slate-800/30 transition-colors"
          />
        ))}
      </div>

      {/* Floating Dynamic Active Tiles */}
      <div className="absolute inset-0 pointer-events-none" style={{ padding: `${paddingPx}px` }}>
        <div className="relative w-full h-full">
          {activeTiles.map((tile) => {
            const style = getTileStyle(tile.value, tile.type, theme);

            // Compute percentage coordinates
            // Each cell width percentage = (100% - totalGaps%) / boardSize
            const cellPercent = 100 / boardSize;
            const topPercent = tile.r * cellPercent;
            const leftPercent = tile.c * cellPercent;

            return (
              <div
                key={tile.id}
                className={`absolute flex flex-col items-center justify-center rounded-xl font-extrabold select-none transition-all duration-150 ease-out z-10 ${
                  style.bgClass
                } ${style.textClass} ${style.glowClass || ''} ${style.borderClass || ''} ${
                  tile.isNew ? 'animate-tile-spawn' : ''
                } ${tile.isMerged ? 'animate-tile-pop' : ''}`}
                style={{
                  top: `calc(${topPercent}% + ${gapPx / 2}px)`,
                  left: `calc(${leftPercent}% + ${gapPx / 2}px)`,
                  width: `calc(${cellPercent}% - ${gapPx}px)`,
                  height: `calc(${cellPercent}% - ${gapPx}px)`
                }}
              >
                {/* Special tile icons / labels */}
                {tile.type === '2x' && (
                  <span className="text-xl sm:text-2xl font-black drop-shadow">×2</span>
                )}
                {tile.type === 'bomb' && (
                  <span className="text-xl sm:text-2xl filter drop-shadow">💣</span>
                )}
                {tile.type === 'wild' && (
                  <span className="text-2xl sm:text-3xl filter drop-shadow animate-spin-slow">★</span>
                )}

                {/* Normal number tile */}
                {tile.type === 'normal' && (
                  <span
                    className={`leading-none tracking-tight font-display ${
                      tile.value >= 1000000
                        ? 'text-xs sm:text-sm font-bold'
                        : tile.value >= 10000
                        ? 'text-sm sm:text-lg font-bold'
                        : tile.value >= 1024
                        ? 'text-base sm:text-xl'
                        : 'text-xl sm:text-2xl'
                    }`}
                  >
                    {formatScore(tile.value)}
                  </span>
                )}

                {/* Sub-label for special badges */}
                {style.subLabel && (
                  <span className="text-[8px] sm:text-[9px] font-semibold tracking-widest opacity-85 mt-0.5">
                    {style.subLabel}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

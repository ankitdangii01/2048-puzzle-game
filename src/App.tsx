import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Tile, GameMode, BoardSize, ThemeId, GameStateSnapshot, GameStats } from './types/game';
import { THEMES } from './utils/themes';
import { soundManager } from './utils/audio';
import {
  createEmptyBoard,
  spawnTileInBoard,
  executeMove,
  checkHasMovesLeft,
  DEFAULT_PROGRESSION
} from './utils/gameLogic';
import { Header } from './components/Header';
import { StatsBanner } from './components/StatsBanner';
import { GameBoard } from './components/GameBoard';
import { Controls } from './components/Controls';
import { VirtualDPad } from './components/VirtualDPad';
import { MilestoneModal } from './components/MilestoneModal';
import { GameOverModal } from './components/GameOverModal';
import { RulesModal } from './components/RulesModal';
import { StatsModal } from './components/StatsModal';
import { ModeModal } from './components/ModeModal';
import { ParticleCanvasHandle } from './components/ParticleCanvas';

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  bestScore: 0,
  highestTileReached: 2,
  totalMerges: 0,
  totalBombsDetonated: 0,
  totalWildsUsed: 0,
  milestonesUnlocked: []
};

const CHALLENGE_MAX_MOVES = 100;
const RUSH_INITIAL_TIME = 90;

export default function App() {
  const [boardSize, setBoardSize] = useState<BoardSize>(4);
  const [board, setBoard] = useState<(Tile | null)[][]>(() => createEmptyBoard(4));
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [highestTile, setHighestTile] = useState<number>(2);
  const [milestoneIndex, setMilestoneIndex] = useState<number>(0);
  const [currentMilestone, setCurrentMilestone] = useState<number>(DEFAULT_PROGRESSION.initialMilestone);
  const [progressionRange, setProgressionRange] = useState<number[]>([...DEFAULT_PROGRESSION.initialRange]);
  const [movesCount, setMovesCount] = useState<number>(0);
  const [mergesCount, setMergesCount] = useState<number>(0);
  const [history, setHistory] = useState<GameStateSnapshot[]>([]);
  const [mode, setMode] = useState<GameMode>('classic');
  const [timeRemaining, setTimeRemaining] = useState<number>(RUSH_INITIAL_TIME);
  const [theme, setTheme] = useState<ThemeId>('obsidian');
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.muted);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [showDPad, setShowDPad] = useState<boolean>(false);
  const [scoreGained, setScoreGained] = useState<number | undefined>(undefined);

  // Modals state
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameOverReason, setGameOverReason] = useState<string>('');
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isModeOpen, setIsModeOpen] = useState<boolean>(false);
  const [milestoneModal, setMilestoneModal] = useState<{
    isOpen: boolean;
    value: number;
    removed: number;
    next: number;
    range: number[];
  }>({
    isOpen: false,
    value: 2048,
    removed: 2,
    next: 4096,
    range: []
  });

  // Career Stats
  const [careerStats, setCareerStats] = useState<GameStats>(DEFAULT_STATS);

  const particleRef = useRef<ParticleCanvasHandle | null>(null);

  // Load persistent stats & themes from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('2048_infinity_theme') as ThemeId | null;
      if (savedTheme && THEMES[savedTheme]) {
        setTheme(savedTheme);
      }

      const savedStats = localStorage.getItem('2048_infinity_career_stats');
      if (savedStats) {
        const parsed: GameStats = JSON.parse(savedStats);
        setCareerStats(parsed);
        setBestScore(parsed.bestScore || 0);
      }

      // Check if touch device to auto-show D-pad or user preference
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const savedDpad = localStorage.getItem('2048_infinity_dpad');
      if (savedDpad !== null) {
        setShowDPad(savedDpad === 'true');
      } else if (isTouch && window.innerWidth < 640) {
        setShowDPad(true);
      }
    } catch {
      // localStorage error fallback
    }
  }, []);

  // Update Career Stats
  const updateCareerStats = useCallback((updater: (prev: GameStats) => GameStats) => {
    setCareerStats((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem('2048_infinity_career_stats', JSON.stringify(next));
      } catch {
        // storage fallback
      }
      return next;
    });
  }, []);

  // Initialize a fresh new game
  const resetGame = useCallback(
    (size: BoardSize = boardSize, selectedMode: GameMode = mode) => {
      let freshBoard = createEmptyBoard(size);
      const initialRange = [...DEFAULT_PROGRESSION.initialRange];

      // Spawn 2 starting tiles
      const spawn1 = spawnTileInBoard(freshBoard, initialRange, 0);
      freshBoard = spawn1.board;
      const spawn2 = spawnTileInBoard(freshBoard, initialRange, 0);
      freshBoard = spawn2.board;

      setBoard(freshBoard);
      setBoardSize(size);
      setScore(0);
      setHighestTile(initialRange[0] || 2);
      setMilestoneIndex(0);
      setCurrentMilestone(DEFAULT_PROGRESSION.initialMilestone);
      setProgressionRange(initialRange);
      setMovesCount(0);
      setMergesCount(0);
      setHistory([]);
      setTimeRemaining(RUSH_INITIAL_TIME);
      setIsGameOver(false);
      setGameOverReason('');
      setScoreGained(undefined);
      setMilestoneModal((prev) => ({ ...prev, isOpen: false }));

      updateCareerStats((prev) => ({
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1
      }));
    },
    [boardSize, mode, updateCareerStats]
  );

  // Initialize on first mount
  useEffect(() => {
    resetGame(4, 'classic');
  }, []);

  // Timer for Rush Mode
  useEffect(() => {
    if (mode !== 'rush' || isGameOver) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          setGameOverReason("Time's up! The 90-second blitz timer expired.");
          soundManager.playGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, isGameOver]);

  // Handle Move
  const handleMove = useCallback(
    (direction: 0 | 1 | 2 | 3) => {
      if (isGameOver) return;

      const minTier = progressionRange[0] || 2;
      const moveResult = executeMove(board, direction, highestTile, minTier);

      if (!moveResult.moved) {
        return;
      }

      // Save state for undo
      const maxUndoLimit = mode === 'zen' ? 50 : 5;
      const snapshot: GameStateSnapshot = {
        board: board.map((row) => row.map((cell) => (cell ? { ...cell } : null))),
        score,
        highestTile,
        milestoneIndex,
        currentMilestone,
        progressionRange: [...progressionRange],
        movesCount,
        timeRemaining,
        mergesCount
      };

      setHistory((prev) => [...prev.slice(-maxUndoLimit + 1), snapshot]);

      // Sound & Haptic
      soundManager.playMove();

      // Bomb explosion handler
      if (moveResult.bombExplosion) {
        soundManager.playSpecial('bomb');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 350);

        // Burst bomb particles at explosion coordinates
        const cellPercent = (1 / boardSize);
        const relativeX = (moveResult.bombExplosion.c + 0.5) * cellPercent;
        const relativeY = (moveResult.bombExplosion.r + 0.5) * cellPercent;
        particleRef.current?.burstBomb(relativeX, relativeY);

        updateCareerStats((prev) => ({
          ...prev,
          totalBombsDetonated: prev.totalBombsDetonated + 1
        }));
      }

      // Wildcard match handler
      if (moveResult.wildMatched) {
        soundManager.playSpecial('wild');
        particleRef.current?.burstWild();
        updateCareerStats((prev) => ({
          ...prev,
          totalWildsUsed: prev.totalWildsUsed + 1
        }));
      }

      // Merges
      if (moveResult.mergesCount > 0) {
        soundManager.playMerge(moveResult.highestTile);
        // Time rush bonus (+2s per merge)
        if (mode === 'rush') {
          setTimeRemaining((t) => Math.min(180, t + 2 * moveResult.mergesCount));
        }
      }

      // Calculate new score and highest tile
      const newScore = score + moveResult.scoreAdded;
      const newHighest = Math.max(highestTile, moveResult.highestTile);
      const newMoves = movesCount + 1;
      const newMerges = mergesCount + moveResult.mergesCount;

      if (moveResult.scoreAdded > 0) {
        setScoreGained(moveResult.scoreAdded);
        setTimeout(() => setScoreGained(undefined), 800);
      }

      setScore(newScore);
      setHighestTile(newHighest);
      setMovesCount(newMoves);
      setMergesCount(newMerges);

      if (newScore > bestScore) {
        setBestScore(newScore);
      }

      // Spawn new tile in resulting board
      const { board: boardWithSpawn } = spawnTileInBoard(
        moveResult.newBoard,
        progressionRange,
        newScore
      );

      let finalBoard = boardWithSpawn;

      // Update Career Stats
      updateCareerStats((prev) => {
        const milestones = [...prev.milestonesUnlocked];
        if (newHighest >= currentMilestone && !milestones.includes(currentMilestone)) {
          milestones.push(currentMilestone);
        }
        return {
          ...prev,
          bestScore: Math.max(prev.bestScore, newScore),
          highestTileReached: Math.max(prev.highestTileReached, newHighest),
          totalMerges: prev.totalMerges + moveResult.mergesCount,
          milestonesUnlocked: milestones
        };
      });

      // Check Milestone Progression
      if (newHighest >= currentMilestone) {
        soundManager.playMilestone();
        particleRef.current?.burstConfetti();

        // Advance progression range
        const nextRange = [...progressionRange];
        const removedLowest = nextRange.shift() || 2;
        const nextTop = nextRange[nextRange.length - 1] * 2;
        nextRange.push(nextTop);

        const nextMilestoneMultiplier = [2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64][milestoneIndex + 1] || (milestoneIndex + 2) * 4;
        const nextTarget = DEFAULT_PROGRESSION.initialMilestone * nextMilestoneMultiplier;

        // Upgrade/purge stray tiles strictly below the new minimum tier
        const newMin = nextRange[0];
        finalBoard = finalBoard.map((row) =>
          row.map((tile) => {
            if (tile && tile.type === 'normal' && tile.value < newMin) {
              return { ...tile, value: newMin, isMerged: true };
            }
            return tile;
          })
        );

        setProgressionRange(nextRange);
        setMilestoneIndex((idx) => idx + 1);
        setCurrentMilestone(nextTarget);

        setMilestoneModal({
          isOpen: true,
          value: newHighest,
          removed: removedLowest,
          next: nextTarget,
          range: nextRange
        });
      }

      setBoard(finalBoard);

      // Check Challenge Mode limit
      if (mode === 'challenge' && newMoves >= CHALLENGE_MAX_MOVES && newHighest < 2048) {
        setIsGameOver(true);
        setGameOverReason(`Out of moves! Used all ${CHALLENGE_MAX_MOVES} moves.`);
        soundManager.playGameOver();
        return;
      }

      // Check Game Over (No moves left)
      if (!checkHasMovesLeft(finalBoard)) {
        setIsGameOver(true);
        setGameOverReason('Board locked with no valid merges remaining.');
        soundManager.playGameOver();
      }
    },
    [
      board,
      boardSize,
      score,
      bestScore,
      highestTile,
      milestoneIndex,
      currentMilestone,
      progressionRange,
      movesCount,
      mergesCount,
      timeRemaining,
      mode,
      isGameOver,
      updateCareerStats
    ]
  );

  // Undo Move
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;

    const previous = history[history.length - 1];
    setBoard(previous.board);
    setScore(previous.score);
    setHighestTile(previous.highestTile);
    setMilestoneIndex(previous.milestoneIndex);
    setCurrentMilestone(previous.currentMilestone);
    setProgressionRange(previous.progressionRange);
    setMovesCount(previous.movesCount);
    setMergesCount(previous.mergesCount);
    if (previous.timeRemaining !== undefined) {
      setTimeRemaining(previous.timeRemaining);
    }
    setHistory((prev) => prev.slice(0, -1));
    setIsGameOver(false);
    setGameOverReason('');
  }, [history]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isRulesOpen || isStatsOpen || isModeOpen || milestoneModal.isOpen) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          handleMove(0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          handleMove(1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          handleMove(2);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          handleMove(3);
          break;
        case 'z':
        case 'Z':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleUndo();
          }
          break;
        case 'u':
        case 'U':
          e.preventDefault();
          handleUndo();
          break;
        case 'r':
        case 'R':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            resetGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, handleUndo, resetGame, isRulesOpen, isStatsOpen, isModeOpen, milestoneModal.isOpen]);

  // Toggle Mute
  const handleToggleMute = () => {
    const newMuted = soundManager.toggleMute();
    setIsMuted(newMuted);
  };

  // Change Theme
  const handleThemeChange = (newTheme: ThemeId) => {
    setTheme(newTheme);
    localStorage.setItem('2048_infinity_theme', newTheme);
  };

  // Toggle DPad
  const handleToggleDPad = () => {
    setShowDPad((prev) => {
      const next = !prev;
      localStorage.setItem('2048_infinity_dpad', String(next));
      return next;
    });
  };

  // Change Mode
  const handleSelectMode = (newMode: GameMode) => {
    setMode(newMode);
    resetGame(boardSize, newMode);
  };

  // Change Size
  const handleChangeSize = (newSize: BoardSize) => {
    resetGame(newSize, mode);
  };

  // Reset career stats
  const handleResetStats = () => {
    setCareerStats(DEFAULT_STATS);
    setBestScore(0);
    localStorage.removeItem('2048_infinity_career_stats');
  };

  const currentThemeConfig = THEMES[theme];

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-between p-3 sm:p-5 transition-colors duration-200 ${currentThemeConfig.bodyBg} ${currentThemeConfig.textPrimary}`}
    >
      <div className="w-full max-w-[460px] flex flex-col gap-3 my-auto">
        {/* Header */}
        <Header
          theme={theme}
          onThemeChange={handleThemeChange}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenRules={() => setIsRulesOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}
          onOpenMode={() => setIsModeOpen(true)}
          mode={mode}
        />

        {/* Stats & Progression HUD */}
        <StatsBanner
          score={score}
          bestScore={bestScore}
          highestTile={highestTile}
          currentMilestone={currentMilestone}
          progressionRange={progressionRange}
          mode={mode}
          movesCount={movesCount}
          maxMoves={CHALLENGE_MAX_MOVES}
          timeRemaining={timeRemaining}
          scoreGained={scoreGained}
        />

        {/* Game Board */}
        <GameBoard
          board={board}
          boardSize={boardSize}
          theme={theme}
          isShaking={isShaking}
          onMove={handleMove}
          particleRef={particleRef}
        />

        {/* Virtual DPad (if toggled) */}
        {showDPad && <VirtualDPad onMove={handleMove} />}

        {/* Primary Controls */}
        <Controls
          onNewGame={() => resetGame()}
          onUndo={handleUndo}
          undoCount={history.length}
          maxUndo={mode === 'zen' ? 50 : 5}
          boardSize={boardSize}
          onChangeSize={handleChangeSize}
          showDPad={showDPad}
          onToggleDPad={handleToggleDPad}
        />
      </div>

      {/* Modals */}
      <MilestoneModal
        isOpen={milestoneModal.isOpen}
        milestoneValue={milestoneModal.value}
        removedValue={milestoneModal.removed}
        nextMilestone={milestoneModal.next}
        newSpawnRange={milestoneModal.range}
        onContinue={() => setMilestoneModal((prev) => ({ ...prev, isOpen: false }))}
      />

      <GameOverModal
        isOpen={isGameOver}
        score={score}
        bestScore={bestScore}
        highestTile={highestTile}
        mergesCount={mergesCount}
        movesCount={movesCount}
        reason={gameOverReason}
        canUndo={history.length > 0}
        onUndo={handleUndo}
        onRestart={() => resetGame()}
      />

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={careerStats}
        onResetStats={handleResetStats}
      />

      <ModeModal
        isOpen={isModeOpen}
        onClose={() => setIsModeOpen(false)}
        currentMode={mode}
        onSelectMode={handleSelectMode}
      />
    </div>
  );
}

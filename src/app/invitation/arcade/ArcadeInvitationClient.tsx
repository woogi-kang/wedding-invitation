'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { TitleScreen } from '@/components/trick/arcade/TitleScreen';
import { CharacterSelect } from '@/components/trick/arcade/CharacterSelect';
import { WorldMap } from '@/components/trick/arcade/WorldMap';
import { StageEvent } from '@/components/trick/arcade/StageEvent';
import { EndingSequence } from '@/components/trick/arcade/EndingSequence';
import { PostGameVillage } from '@/components/trick/arcade/PostGameVillage';
import { BattleTransition } from '@/components/trick/arcade/shared';
import type { GalleryImage } from '@/lib/gallery';

type GamePhase =
  | 'title'
  | 'character-select'
  | 'world-map'
  | 'stage-event'
  | 'ending'
  | 'post-game';

const TOTAL_STAGES = 5;

/* ── localStorage 진행 상태 저장 ── */
const SAVE_KEY = 'wedding_arcade_progress';
const SAVE_EVENT = 'wedding_arcade_progress_change';

interface SaveData {
  completedStages: number[];
  currentStage: number;
  phase: GamePhase;
}

interface DirectEntryState {
  phase: GamePhase;
  currentStage: number;
  activeStage: number | null;
  completedStages: number[];
}

function saveProgress(data: SaveData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event(SAVE_EVENT));
  } catch { /* 저장 실패 무시 */ }
}

function loadProgress(): SaveData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function clearProgress(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SAVE_KEY);
    window.dispatchEvent(new Event(SAVE_EVENT));
  } catch { /* ignore */ }
}

function buildCompletedStages(stageIndex: number): number[] {
  return Array.from({ length: stageIndex }, (_, i) => i);
}

function parseStageParam(value: string | null): number | null {
  if (!value) return null;

  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;

  switch (normalized) {
    case '1':
    case 'park':
      return 0;
    case '2':
    case 'cafe':
      return 1;
    case '3':
    case 'sunset':
      return 2;
    case '4':
    case 'night':
      return 3;
    case '5':
    case 'ceremony':
    case 'chapel':
      return 4;
    default:
      return null;
  }
}

function parsePhaseParam(value: string | null): GamePhase | null {
  if (!value) return null;

  switch (value.trim().toLowerCase()) {
    case 'title':
      return 'title';
    case 'select':
    case 'character-select':
      return 'character-select';
    case 'map':
    case 'world-map':
      return 'world-map';
    case 'stage':
    case 'stage-event':
      return 'stage-event';
    case 'ending':
      return 'ending';
    case 'village':
    case 'post-game':
      return 'post-game';
    default:
      return null;
  }
}

function resolveDirectEntry(searchParams: URLSearchParams): DirectEntryState | null {
  const phaseParam = parsePhaseParam(searchParams.get('phase'));
  const stageIndex = parseStageParam(searchParams.get('stage'));

  if (stageIndex !== null) {
    const completedStages = buildCompletedStages(stageIndex);
    const phase = phaseParam === 'world-map' ? 'world-map' : 'stage-event';

    return {
      phase,
      currentStage: stageIndex,
      activeStage: phase === 'stage-event' ? stageIndex : null,
      completedStages,
    };
  }

  if (!phaseParam) return null;

  if (phaseParam === 'ending' || phaseParam === 'post-game') {
    const completedStages = Array.from({ length: TOTAL_STAGES }, (_, i) => i);

    return {
      phase: phaseParam,
      currentStage: TOTAL_STAGES - 1,
      activeStage: null,
      completedStages,
    };
  }

  if (phaseParam === 'stage-event') {
    return {
      phase: 'stage-event',
      currentStage: 0,
      activeStage: 0,
      completedStages: [],
    };
  }

  return {
    phase: phaseParam,
    currentStage: 0,
    activeStage: null,
    completedStages: [],
  };
}

function hasStoredProgress(): boolean {
  const saved = loadProgress();
  return !!(saved && saved.completedStages.length > 0);
}

interface ArcadeInvitationClientProps {
  galleryImages: GalleryImage[];
}

export function ArcadeInvitationClient({ galleryImages }: ArcadeInvitationClientProps) {
  const searchParams = useSearchParams();
  const initialDirectEntry = resolveDirectEntry(new URLSearchParams(searchParams.toString()));
  const directEntryActive = initialDirectEntry !== null;
  const [phase, setPhase] = useState<GamePhase>(() => initialDirectEntry?.phase ?? 'title');
  const [completedStages, setCompletedStages] = useState<number[]>(() => initialDirectEntry?.completedStages ?? []);
  const [currentStage, setCurrentStage] = useState(() => initialDirectEntry?.currentStage ?? 0);
  const [activeStage, setActiveStage] = useState<number | null>(() => initialDirectEntry?.activeStage ?? null);
  const [hasSaveData, setHasSaveData] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [pendingPhase, setPendingPhase] = useState<GamePhase | null>(null);
  const [pendingStage, setPendingStage] = useState<number | null>(null);

  // 진행 상태 자동 저장 (title, character-select 제외)
  useEffect(() => {
    if (directEntryActive) return;
    if (phase === 'title' || phase === 'character-select') return;
    saveProgress({ completedStages, currentStage, phase });
  }, [completedStages, currentStage, phase, directEntryActive]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncHasSaveData = () => {
      setHasSaveData(hasStoredProgress());
    };

    const frameId = window.requestAnimationFrame(syncHasSaveData);
    window.addEventListener('storage', syncHasSaveData);
    window.addEventListener(SAVE_EVENT, syncHasSaveData);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('storage', syncHasSaveData);
      window.removeEventListener(SAVE_EVENT, syncHasSaveData);
    };
  }, []);

  // CONTINUE: 저장된 진행 상태 복원
  const handleContinue = useCallback(() => {
    const saved = loadProgress();
    if (saved) {
      setCompletedStages(saved.completedStages);
      setCurrentStage(saved.currentStage);
      // stage-event, ending 등 중간 phase는 world-map으로 복원
      const restorePhase = saved.phase === 'post-game' ? 'post-game' : 'world-map';
      setPhase(restorePhase);
    }
  }, []);

  // NEW GAME: 저장 데이터 삭제 후 새 게임
  const handleNewGame = useCallback(() => {
    clearProgress();
    setPhase('character-select');
  }, []);

  // 전환 효과와 함께 페이즈 변경
  const transitionToPhase = useCallback((nextPhase: GamePhase, stageIdx?: number) => {
    setTransitioning(true);
    setPendingPhase(nextPhase);
    if (stageIdx !== undefined) setPendingStage(stageIdx);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    if (pendingPhase) {
      if (pendingStage !== null) {
        setActiveStage(pendingStage);
      }
      setPhase(pendingPhase);
    }
    setTransitioning(false);
    setPendingPhase(null);
    setPendingStage(null);
  }, [pendingPhase, pendingStage]);

  const handleStageSelect = useCallback(
    (stageIndex: number) => {
      if (transitioning) return;
      // 전환 효과와 함께 스테이지 진입
      transitionToPhase('stage-event', stageIndex);
    },
    [transitioning, transitionToPhase],
  );

  const handleStageComplete = useCallback(() => {
    if (activeStage === null) return;

    const newCompleted = Array.from(new Set([...completedStages, activeStage]));
    setCompletedStages(newCompleted);
    setActiveStage(null);

    if (newCompleted.length >= TOTAL_STAGES) {
      transitionToPhase('ending');
    } else {
      const nextStage = Math.min(activeStage + 1, TOTAL_STAGES - 1);
      setCurrentStage(nextStage);
      setPhase('world-map');
    }
  }, [activeStage, completedStages, transitionToPhase]);

  const handleStageClose = useCallback(() => {
    setActiveStage(null);
    setPhase('world-map');
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="min-h-screen overflow-x-hidden"
        style={{
          background: '#0f0f23',
          color: '#ffffff',
          imageRendering: 'auto',
        }}
      >
        {/* 포켓몬 스타일 배틀 전환 효과 */}
        <BattleTransition
          isActive={transitioning}
          onComplete={handleTransitionComplete}
        />

        <AnimatePresence mode="wait">
          {phase === 'title' && (
            <PhaseWrapper key="title">
              <TitleScreen
                onStart={() => setPhase('character-select')}
                hasSaveData={hasSaveData}
                onContinue={handleContinue}
                onNewGame={handleNewGame}
              />
            </PhaseWrapper>
          )}

          {phase === 'character-select' && (
            <PhaseWrapper key="char-select">
              <CharacterSelect onComplete={() => setPhase('world-map')} />
            </PhaseWrapper>
          )}

          {phase === 'world-map' && (
            <PhaseWrapper key="world-map">
              <WorldMap
                currentStage={currentStage}
                completedStages={completedStages}
                onStageSelect={handleStageSelect}
              />
            </PhaseWrapper>
          )}

          {phase === 'stage-event' && activeStage !== null && (
            <PhaseWrapper key={`stage-${activeStage}`}>
              <StageEvent
                stageIndex={activeStage}
                onComplete={handleStageComplete}
                onClose={handleStageClose}
              />
            </PhaseWrapper>
          )}

          {phase === 'ending' && (
            <PhaseWrapper key="ending">
              <EndingSequence onComplete={() => setPhase('post-game')} />
            </PhaseWrapper>
          )}

          {phase === 'post-game' && (
            <PhaseWrapper key="post-game">
              <PostGameVillage galleryImages={galleryImages} />
            </PhaseWrapper>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

function PhaseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

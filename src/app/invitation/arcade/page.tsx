'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TitleScreen } from '@/components/trick/arcade/TitleScreen';
import { CharacterSelect } from '@/components/trick/arcade/CharacterSelect';
import { WorldMap } from '@/components/trick/arcade/WorldMap';
import { StageEvent } from '@/components/trick/arcade/StageEvent';
import { BossBattle } from '@/components/trick/arcade/BossBattle';
import { EndingSequence } from '@/components/trick/arcade/EndingSequence';
import { PostGameVillage } from '@/components/trick/arcade/PostGameVillage';
import { BattleTransition } from '@/components/trick/arcade/shared';

type GamePhase =
  | 'title'
  | 'character-select'
  | 'world-map'
  | 'stage-event'
  | 'boss-battle'
  | 'ending'
  | 'post-game';

const TOTAL_STAGES = 4;

/* ── localStorage 진행 상태 저장 ── */
const SAVE_KEY = 'wedding_arcade_progress';

interface SaveData {
  completedStages: number[];
  currentStage: number;
  phase: GamePhase;
}

function saveProgress(data: SaveData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
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
  try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ }
}

export default function ArcadeInvitationPage() {
  const [phase, setPhase] = useState<GamePhase>('title');
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [currentStage, setCurrentStage] = useState(0);
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const [hasSaveData, setHasSaveData] = useState(false);

  // 마운트 시 저장된 진행 상태 확인
  useEffect(() => {
    const saved = loadProgress();
    if (saved && saved.completedStages.length > 0) {
      setHasSaveData(true);
    }
  }, []);

  // 진행 상태 자동 저장 (title, character-select 제외)
  useEffect(() => {
    if (phase === 'title' || phase === 'character-select') return;
    saveProgress({ completedStages, currentStage, phase });
  }, [completedStages, currentStage, phase]);

  // CONTINUE: 저장된 진행 상태 복원
  const handleContinue = useCallback(() => {
    const saved = loadProgress();
    if (saved) {
      setCompletedStages(saved.completedStages);
      setCurrentStage(saved.currentStage);
      // stage-event, boss-battle 등 중간 phase는 world-map으로 복원
      const restorePhase = saved.phase === 'post-game' ? 'post-game' : 'world-map';
      setPhase(restorePhase);
    }
  }, []);

  // NEW GAME: 저장 데이터 삭제 후 새 게임
  const handleNewGame = useCallback(() => {
    clearProgress();
    setHasSaveData(false);
    setPhase('character-select');
  }, []);

  // 배틀 전환 효과 상태
  const [transitioning, setTransitioning] = useState(false);
  const [pendingPhase, setPendingPhase] = useState<GamePhase | null>(null);
  const [pendingStage, setPendingStage] = useState<number | null>(null);

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
      if (completedStages.includes(stageIndex)) return;
      // 전환 효과와 함께 스테이지 진입
      transitionToPhase('stage-event', stageIndex);
    },
    [completedStages, transitionToPhase],
  );

  const handleStageComplete = useCallback(() => {
    if (activeStage === null) return;

    const newCompleted = [...completedStages, activeStage];
    setCompletedStages(newCompleted);
    setActiveStage(null);

    if (newCompleted.length >= TOTAL_STAGES) {
      // 보스전 진입도 전환 효과 사용
      transitionToPhase('boss-battle');
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

        {phase === 'boss-battle' && (
          <PhaseWrapper key="boss">
            <BossBattle onVictory={() => setPhase('ending')} />
          </PhaseWrapper>
        )}

        {phase === 'ending' && (
          <PhaseWrapper key="ending">
            <EndingSequence onComplete={() => setPhase('post-game')} />
          </PhaseWrapper>
        )}

        {phase === 'post-game' && (
          <PhaseWrapper key="post-game">
            <PostGameVillage />
          </PhaseWrapper>
        )}
      </AnimatePresence>
    </div>
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

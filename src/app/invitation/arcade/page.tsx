'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TitleScreen } from '@/components/trick/arcade/TitleScreen';
import { CharacterSelect } from '@/components/trick/arcade/CharacterSelect';
import { WorldMap } from '@/components/trick/arcade/WorldMap';
import { StageEvent } from '@/components/trick/arcade/StageEvent';
import { BossBattle } from '@/components/trick/arcade/BossBattle';
import { EndingSequence } from '@/components/trick/arcade/EndingSequence';
import { PostGameVillage } from '@/components/trick/arcade/PostGameVillage';

type GamePhase =
  | 'title'
  | 'character-select'
  | 'world-map'
  | 'stage-event'
  | 'boss-battle'
  | 'ending'
  | 'post-game';

const TOTAL_STAGES = 4;

export default function ArcadeInvitationPage() {
  const [phase, setPhase] = useState<GamePhase>('title');
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [currentStage, setCurrentStage] = useState(0);
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const handleStageSelect = useCallback(
    (stageIndex: number) => {
      if (completedStages.includes(stageIndex)) return;
      setActiveStage(stageIndex);
      setPhase('stage-event');
    },
    [completedStages],
  );

  const handleStageComplete = useCallback(() => {
    if (activeStage === null) return;

    const newCompleted = [...completedStages, activeStage];
    setCompletedStages(newCompleted);
    setActiveStage(null);

    if (newCompleted.length >= TOTAL_STAGES) {
      setPhase('boss-battle');
    } else {
      const nextStage = Math.min(activeStage + 1, TOTAL_STAGES - 1);
      setCurrentStage(nextStage);
      setPhase('world-map');
    }
  }, [activeStage, completedStages]);

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
      <AnimatePresence mode="wait">
        {phase === 'title' && (
          <PhaseWrapper key="title">
            <TitleScreen onStart={() => setPhase('character-select')} />
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

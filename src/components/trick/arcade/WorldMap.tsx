'use client';

import { motion } from 'framer-motion';
import { PixelCharacterWalking } from './shared/PixelCharacter';

const ARCADE_COLORS = {
  bg: '#0f0f23',
  bgLight: '#1a1a3e',
  text: '#ffffff',
  gold: '#ffcc00',
  pink: '#ff6b9d',
  green: '#00ff41',
  blue: '#4a9eff',
  red: '#ff4444',
  gray: '#8b8b8b',
  darkGray: '#333333',
} as const;

interface Stage {
  id: number;
  name: string;
  subtitle: string;
  icon: string;
}

const STAGES: Stage[] = [
  { id: 0, name: 'First Encounter', subtitle: '2022 봄', icon: '♥' },
  { id: 1, name: 'Growing Love', subtitle: '2023', icon: '★' },
  { id: 2, name: 'Anniversary', subtitle: '2024', icon: '◆' },
  { id: 3, name: 'The Proposal', subtitle: '2025', icon: '♛' },
];

interface WorldMapProps {
  currentStage: number;
  completedStages: number[];
  onStageSelect: (stage: number) => void;
}

export function WorldMap({
  currentStage,
  completedStages,
  onStageSelect,
}: WorldMapProps) {
  const isStageAccessible = (stageId: number) => {
    if (stageId === 0) return true;
    return completedStages.includes(stageId - 1);
  };

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center overflow-hidden px-4 py-6"
      style={{ background: ARCADE_COLORS.bg }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-10"
      >
        <p
          className="font-['Press_Start_2P',monospace] text-[8px] sm:text-[10px]"
          style={{ color: ARCADE_COLORS.gray }}
        >
          WORLD 1
        </p>
        <p
          className="font-['Press_Start_2P',monospace] text-[14px] sm:text-[20px] mt-1"
          style={{
            color: ARCADE_COLORS.gold,
            textShadow: `0 0 8px ${ARCADE_COLORS.gold}40`,
          }}
        >
          DESTINY
        </p>
      </motion.div>

      {/* Map area */}
      <div className="relative w-full max-w-sm flex-1 flex flex-col items-center justify-center">
        {/* Path connecting nodes */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 300 500"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Dotted path line */}
          <motion.path
            d="M 150 420 C 100 360, 200 320, 150 260 C 100 200, 200 160, 150 100"
            fill="none"
            stroke={ARCADE_COLORS.gray}
            strokeWidth="2"
            strokeDasharray="6 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
          {/* Completed path overlay */}
          {completedStages.length > 0 && (
            <motion.path
              d="M 150 420 C 100 360, 200 320, 150 260 C 100 200, 200 160, 150 100"
              fill="none"
              stroke={ARCADE_COLORS.green}
              strokeWidth="2"
              strokeDasharray="6 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: completedStages.length / STAGES.length }}
              transition={{ duration: 0.8 }}
            />
          )}
        </svg>

        {/* Stage nodes rendered from bottom to top */}
        <div className="relative w-full flex flex-col items-center gap-10 sm:gap-14 py-4">
          {[...STAGES].reverse().map((stage, reverseIdx) => {
            const idx = STAGES.length - 1 - reverseIdx;
            const isCompleted = completedStages.includes(stage.id);
            const isCurrent = currentStage === stage.id;
            const accessible = isStageAccessible(stage.id);
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.2, type: 'spring', stiffness: 200 }}
                className={`relative flex items-center gap-3 sm:gap-4 ${isEven ? 'flex-row self-start ml-4 sm:ml-8' : 'flex-row-reverse self-end mr-4 sm:mr-8'}`}
              >
                {/* Node */}
                <motion.button
                  onClick={() => accessible && onStageSelect(stage.id)}
                  disabled={!accessible}
                  whileHover={accessible ? { scale: 1.1 } : undefined}
                  whileTap={accessible ? { scale: 0.95 } : undefined}
                  className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center disabled:opacity-40"
                  style={{
                    background: isCompleted
                      ? `${ARCADE_COLORS.green}30`
                      : isCurrent
                        ? `${ARCADE_COLORS.gold}30`
                        : `${ARCADE_COLORS.darkGray}80`,
                    border: `3px solid ${
                      isCompleted
                        ? ARCADE_COLORS.green
                        : isCurrent
                          ? ARCADE_COLORS.gold
                          : ARCADE_COLORS.gray
                    }`,
                    boxShadow: isCurrent
                      ? `0 0 12px ${ARCADE_COLORS.gold}60, inset 0 0 8px ${ARCADE_COLORS.gold}20`
                      : isCompleted
                        ? `0 0 8px ${ARCADE_COLORS.green}40`
                        : 'none',
                    imageRendering: 'pixelated',
                  }}
                  aria-label={`Stage ${stage.id + 1}: ${stage.name}${isCompleted ? ' (completed)' : ''}${!accessible ? ' (locked)' : ''}`}
                >
                  {/* Pulse for current stage */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        border: `2px solid ${ARCADE_COLORS.gold}`,
                      }}
                      animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}

                  {isCompleted ? (
                    <span
                      className="font-['Press_Start_2P',monospace] text-[12px] sm:text-[14px]"
                      style={{ color: ARCADE_COLORS.green }}
                    >
                      {'★'}
                    </span>
                  ) : (
                    <span
                      className="font-['Press_Start_2P',monospace] text-[12px] sm:text-[14px]"
                      style={{
                        color: isCurrent ? ARCADE_COLORS.gold : ARCADE_COLORS.gray,
                      }}
                    >
                      {stage.icon}
                    </span>
                  )}

                  {/* Character sprite on current stage */}
                  {isCurrent && (
                    <div className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2">
                      <PixelCharacterWalking character="groom" scale={2} />
                    </div>
                  )}
                </motion.button>

                {/* Label */}
                <div className={`${isEven ? 'text-left' : 'text-right'}`}>
                  <p
                    className="font-['Press_Start_2P',monospace] text-[7px] sm:text-[9px]"
                    style={{
                      color: isCompleted
                        ? ARCADE_COLORS.green
                        : isCurrent
                          ? ARCADE_COLORS.gold
                          : ARCADE_COLORS.gray,
                    }}
                  >
                    {stage.name}
                  </p>
                  <p
                    className="font-['Press_Start_2P',monospace] text-[6px] sm:text-[7px] mt-0.5"
                    style={{ color: ARCADE_COLORS.gray }}
                  >
                    {stage.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stage counter */}
      <div className="mt-4 text-center">
        <p
          className="font-['Press_Start_2P',monospace] text-[7px] sm:text-[8px]"
          style={{ color: ARCADE_COLORS.gray }}
        >
          STAGES: {completedStages.length}/{STAGES.length}
        </p>
      </div>
    </div>
  );
}

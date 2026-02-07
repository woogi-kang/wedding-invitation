'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { PixelCharacterWalking, ARCADE_COLORS } from './shared';

// --- Pixel sprite renderer (reuses PixelCharacter technique) ---

function renderSprite(
  grid: number[][],
  colorMap: Record<number, string>,
  scale: number,
): string {
  const shadows: string[] = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 0) continue;
      const color = colorMap[grid[y][x]];
      if (!color) continue;
      shadows.push(`${(x + 1) * scale}px ${(y + 1) * scale}px 0 ${color}`);
    }
  }
  return shadows.join(',');
}

function PixelSprite({
  grid,
  colorMap,
  scale = 3,
}: {
  grid: number[][];
  colorMap: Record<number, string>;
  scale?: number;
}) {
  const cols = grid[0].length;
  const rows = grid.length;
  const shadow = useMemo(
    () => renderSprite(grid, colorMap, scale),
    [grid, colorMap, scale],
  );

  return (
    <div
      style={{
        width: (cols + 1) * scale,
        height: (rows + 1) * scale,
        position: 'relative',
        imageRendering: 'pixelated',
      }}
    >
      <div
        style={{
          width: scale,
          height: scale,
          boxShadow: shadow,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
}

// --- Landmark sprites ---

const TREE_GRID = [
  [0, 0, 0, 2, 0, 0, 0],
  [0, 0, 2, 1, 2, 0, 0],
  [0, 2, 1, 2, 1, 2, 0],
  [2, 1, 2, 1, 2, 1, 2],
  [0, 2, 1, 2, 1, 2, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 3, 0, 0, 0],
  [0, 0, 0, 3, 0, 0, 0],
];
const TREE_COLORS: Record<number, string> = {
  1: '#2D7A2D',
  2: '#4A9A40',
  3: '#6B4226',
};

const FLOWER_GRID = [
  [0, 1, 0],
  [1, 2, 1],
  [0, 1, 0],
  [0, 3, 0],
  [0, 3, 0],
];
const FLOWER_COLORS: Record<number, string> = {
  1: '#FF6B9D',
  2: '#FFCC00',
  3: '#4A9A40',
};

const CAFE_GRID = [
  [0, 0, 4, 4, 4, 4, 0, 0],
  [0, 3, 3, 3, 3, 3, 3, 0],
  [3, 3, 3, 3, 3, 3, 3, 3],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 1, 2, 2, 1, 1],
  [1, 2, 2, 1, 2, 2, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 5, 5, 5, 5, 1, 1],
];
const CAFE_COLORS: Record<number, string> = {
  1: '#8B6E4E',
  2: '#FFE4B5',
  3: '#E84040',
  4: '#E84040',
  5: '#6B4226',
};

const RESTAURANT_GRID = [
  [0, 0, 4, 4, 4, 0, 0],
  [0, 4, 4, 4, 4, 4, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 1, 2, 2, 1],
  [1, 2, 2, 1, 2, 2, 1],
  [1, 1, 1, 3, 1, 1, 1],
  [1, 1, 3, 3, 3, 1, 1],
  [5, 5, 5, 5, 5, 5, 5],
];
const RESTAURANT_COLORS: Record<number, string> = {
  1: '#3A3A6E',
  2: '#FFE4B5',
  3: '#FFD700',
  4: '#3A3A6E',
  5: '#2A2A5E',
};

const MOON_GRID = [
  [0, 1, 1, 0, 0],
  [1, 1, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [1, 1, 0, 0, 0],
  [0, 1, 1, 0, 0],
];
const MOON_COLORS: Record<number, string> = { 1: '#FFE4B5' };

const TREE_ALT_COLORS: Record<number, string> = {
  1: '#3B8B3B',
  2: '#5AAA50',
  3: '#7B5236',
};

// --- Landmark scenes per zone ---

function ParkScene() {
  return (
    <div className="flex items-end gap-1">
      <PixelSprite grid={TREE_GRID} colorMap={TREE_COLORS} scale={3} />
      <div className="mb-1">
        <PixelSprite grid={FLOWER_GRID} colorMap={FLOWER_COLORS} scale={2} />
      </div>
      <PixelSprite
        grid={TREE_GRID}
        colorMap={TREE_ALT_COLORS}
        scale={2}
      />
    </div>
  );
}

function CafeScene() {
  return (
    <div className="flex items-end gap-2">
      <PixelSprite grid={CAFE_GRID} colorMap={CAFE_COLORS} scale={3} />
      {/* Steam animation */}
      <div className="flex flex-col gap-1 mb-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{
              width: 3,
              height: 3,
              background: 'rgba(255,255,255,0.4)',
            }}
            animate={{ y: [-2, -8], opacity: [0.5, 0], x: [0, (i - 1) * 3] }}
            transition={{
              duration: 1.2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function RestaurantScene() {
  return (
    <div className="flex items-end gap-2">
      <PixelSprite grid={RESTAURANT_GRID} colorMap={RESTAURANT_COLORS} scale={3} />
      {/* Candle flicker */}
      <motion.div
        className="mb-6"
        style={{ width: 4, height: 4, background: '#FFD700', borderRadius: '50%' }}
        animate={{
          boxShadow: [
            '0 0 4px #FFD700, 0 0 8px #FFA500',
            '0 0 6px #FFD700, 0 0 12px #FFA500',
            '0 0 4px #FFD700, 0 0 8px #FFA500',
          ],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </div>
  );
}

function NightScene() {
  return (
    <div className="flex items-end gap-3">
      <motion.div
        animate={{
          filter: [
            'drop-shadow(0 0 4px #FFE4B580)',
            'drop-shadow(0 0 8px #FFE4B5A0)',
            'drop-shadow(0 0 4px #FFE4B580)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <PixelSprite grid={MOON_GRID} colorMap={MOON_COLORS} scale={3} />
      </motion.div>
      {/* Twinkling stars */}
      <div className="relative w-10 h-10 mb-2">
        {[
          { x: 2, y: 0, d: 0 },
          { x: 8, y: 6, d: 0.5 },
          { x: 0, y: 10, d: 1 },
        ].map((s, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: s.x,
              top: s.y,
              width: 2,
              height: 2,
              background: '#fff',
            }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.5, delay: s.d, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  );
}

type LandmarkType = 'park' | 'cafe' | 'restaurant' | 'night';

const LANDMARK_COMPONENTS: Record<LandmarkType, React.FC> = {
  park: ParkScene,
  cafe: CafeScene,
  restaurant: RestaurantScene,
  night: NightScene,
};

// --- Zone ambient particles ---

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

function createZoneParticles(theme: LandmarkType, count: number): Particle[] {
  const colorSets: Record<string, string[]> = {
    park: ['#4A9A40', '#5AAA50', '#FF6B9D', '#FFCC00'],
    cafe: ['#8B6E4E60', '#FFE4B540', '#FFFFFF30'],
    restaurant: ['#FFD70040', '#FFA50030', '#FF6B9D20'],
    night: ['#FFFFFF', '#4A9EFF80', '#FFE4B560'],
  };
  const colors = colorSets[theme] || colorSets.park;
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: theme === 'night' ? Math.random() * 2 + 1 : Math.random() * 3 + 1,
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 4,
  }));
}

function ZoneParticles({ theme }: { theme: LandmarkType }) {
  const particles = useMemo(() => createZoneParticles(theme, 8), [theme]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            y: theme === 'cafe' ? [0, -15] : [0, -5, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// --- Fog overlay for locked stages ---

function FogOverlay() {
  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center"
      style={{
        background:
          'repeating-linear-gradient(0deg, rgba(15,15,35,0.92) 0px, rgba(15,15,35,0.85) 2px, rgba(15,15,35,0.92) 4px)',
      }}
    >
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span
          className="font-['Press_Start_2P',monospace] text-[13px]"
          style={{ color: ARCADE_COLORS.gray }}
        >
          ? ? ?
        </span>
      </motion.div>
    </div>
  );
}

// --- Stage info popup card ---

interface StageInfo {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  difficulty: number;
  reward: string;
  warning?: string;
}

const STAGE_INFO: StageInfo[] = [
  {
    id: 0,
    name: 'First Encounter',
    subtitle: '2022 봄',
    description: '야생의 김선경이 나타났다! 심장 박동수: ???',
    difficulty: 1,
    reward: '호감도 MAX',
    warning: '심장이 약하신 분 주의',
  },
  {
    id: 1,
    name: 'Butterfly Effect',
    subtitle: '2023',
    description: '상태이상: LOVE_STRUCK Duration: PERMANENT',
    difficulty: 2,
    reward: '사랑 포인트 +9999',
    warning: '부작용: 5분마다 카톡 확인',
  },
  {
    id: 2,
    name: 'Side Quests',
    subtitle: '2024',
    description: '커플 잠옷 획득! (해제 불가) IKEA 조립 퀘스트 발생!',
    difficulty: 3,
    reward: '맛집 리스트 x147',
    warning: '위장 용량 초과 가능',
  },
  {
    id: 3,
    name: 'The Proposal',
    subtitle: '2025',
    description: 'ERROR: NO 버튼을 찾을 수 없습니다',
    difficulty: 5,
    reward: 'Ring of Eternal Promise',
    warning: 'NO.exe has been deleted',
  },
];

function StageInfoCard({
  stage,
  isCompleted,
  onStart,
  onClose,
}: {
  stage: StageInfo;
  isCompleted: boolean;
  onStart: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-xs"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: ARCADE_COLORS.bg,
          border: `3px solid ${ARCADE_COLORS.gold}`,
          boxShadow: `
            inset 2px 2px 0px ${ARCADE_COLORS.darkGray},
            0 0 20px ${ARCADE_COLORS.gold}30
          `,
          imageRendering: 'pixelated',
        }}
      >
        {/* Header */}
        <div
          className="relative px-4 py-2"
          style={{
            background: `${ARCADE_COLORS.gold}20`,
            borderBottom: `2px solid ${ARCADE_COLORS.gold}`,
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center font-['Press_Start_2P',monospace] text-[10px]"
            style={{ color: ARCADE_COLORS.gray }}
            aria-label="Close"
          >
            X
          </button>
          <p
            className="font-['Press_Start_2P',monospace] text-[13px] sm:text-[16px]"
            style={{ color: ARCADE_COLORS.gray }}
          >
            STAGE {stage.id + 1}
          </p>
          <p
            className="font-['Press_Start_2P',monospace] text-[13px] sm:text-[16px] mt-0.5"
            style={{ color: ARCADE_COLORS.gold }}
          >
            {stage.name}
          </p>
          <p
            className="font-['Press_Start_2P',monospace] text-[10px] mt-0.5"
            style={{ color: ARCADE_COLORS.gray }}
          >
            {stage.subtitle}
          </p>
        </div>

        {/* Body */}
        <div className="px-4 py-3 flex flex-col gap-2.5">
          {/* Description */}
          <p
            className="font-['Press_Start_2P',monospace] text-[13px] sm:text-[16px] leading-[18px] sm:leading-[21px] whitespace-pre-wrap"
            style={{ color: ARCADE_COLORS.text }}
          >
            {stage.description}
          </p>

          {/* Difficulty */}
          <div className="flex items-center gap-2">
            <span
              className="font-['Press_Start_2P',monospace] text-[10px]"
              style={{ color: ARCADE_COLORS.gray }}
            >
              LV
            </span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    background:
                      i < stage.difficulty
                        ? ARCADE_COLORS.gold
                        : ARCADE_COLORS.darkGray,
                    border: `1px solid ${i < stage.difficulty ? '#b38f00' : ARCADE_COLORS.gray}40`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Reward */}
          <div>
            <span
              className="font-['Press_Start_2P',monospace] text-[10px]"
              style={{ color: ARCADE_COLORS.gray }}
            >
              REWARD
            </span>
            <p
              className="font-['Press_Start_2P',monospace] text-[10px] mt-0.5"
              style={{ color: ARCADE_COLORS.green }}
            >
              {stage.reward}
            </p>
          </div>

          {/* Warning */}
          {stage.warning && (
            <div
              className="px-2 py-1.5"
              style={{
                background: `${ARCADE_COLORS.red}15`,
                border: `1px solid ${ARCADE_COLORS.red}40`,
              }}
            >
              <p
                className="font-['Press_Start_2P',monospace] text-[10px]"
                style={{ color: ARCADE_COLORS.red }}
              >
                {'! '}{stage.warning}
              </p>
            </div>
          )}
        </div>

        {/* Start button */}
        <div className="px-4 py-3" style={{ borderTop: `1px solid ${ARCADE_COLORS.darkGray}` }}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            className="w-full px-4 py-2.5 font-['Press_Start_2P',monospace] text-[12px] sm:text-[13px]"
            style={{
              color: '#000',
              background: ARCADE_COLORS.gold,
              border: '2px solid #b38f00',
              boxShadow: '3px 3px 0px #b38f00',
            }}
          >
            {isCompleted ? '▶ REPLAY' : '▶ START'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Stage zone themes ---

interface StageZone {
  id: number;
  name: string;
  subtitle: string;
  icon: string;
  landmark: LandmarkType;
  bgGradient: string;
}

const ZONES: StageZone[] = [
  {
    id: 0,
    name: 'First Encounter',
    subtitle: '2022 봄',
    icon: '♥',
    landmark: 'park',
    bgGradient: 'linear-gradient(180deg, #0f1a0f 0%, #152615 50%, #0f1a0f 100%)',
  },
  {
    id: 1,
    name: 'Butterfly Effect',
    subtitle: '2023',
    icon: '★',
    landmark: 'cafe',
    bgGradient: 'linear-gradient(180deg, #1a100f 0%, #251a15 50%, #1a100f 100%)',
  },
  {
    id: 2,
    name: 'Side Quests',
    subtitle: '2024',
    icon: '◆',
    landmark: 'restaurant',
    bgGradient: 'linear-gradient(180deg, #0f0f1a 0%, #151525 50%, #0f0f1a 100%)',
  },
  {
    id: 3,
    name: 'The Proposal',
    subtitle: '2025',
    icon: '♛',
    landmark: 'night',
    bgGradient: 'linear-gradient(180deg, #050508 0%, #0a0a18 50%, #050508 100%)',
  },
];

// --- Pixel path between zones ---

function PixelPath({ completed }: { completed: boolean }) {
  return (
    <div className="relative w-full h-8 flex items-center justify-center">
      <div className="flex flex-col items-center gap-1">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            style={{
              width: 4,
              height: 4,
              background: completed ? ARCADE_COLORS.green : ARCADE_COLORS.gray,
              opacity: completed ? 0.8 : 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// --- 미니 이벤트 (스테이지 클리어 후 랜덤 팝업) ---

const MINI_EVENTS = [
  { icon: '\u2618', text: '들판에서 네잎클로버를 발견했다!', color: ARCADE_COLORS.green },
  { icon: '\u2764', text: '사랑의 파워가 1 올랐다!', color: ARCADE_COLORS.pink },
  { icon: '\u2728', text: '신비한 별빛이 길을 비춘다!', color: ARCADE_COLORS.gold },
  { icon: '\u2709', text: '하객으로부터 편지가 도착했다!', color: ARCADE_COLORS.blue },
  { icon: '\u266A', text: '어디선가 웨딩마치가 들려온다...', color: ARCADE_COLORS.pink },
  { icon: '\u2605', text: '행운의 별을 발견했다! LUK+1', color: ARCADE_COLORS.gold },
  { icon: '\u2615', text: '커피 아이템을 획득! HP 회복!', color: ARCADE_COLORS.green },
  { icon: '\u2661', text: '커플 시너지 효과 발동!', color: ARCADE_COLORS.pink },
];

// --- Main WorldMap component ---

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
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [shakeStage, setShakeStage] = useState<number | null>(null);
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // 미니 이벤트 상태
  const [miniEvent, setMiniEvent] = useState<typeof MINI_EVENTS[number] | null>(null);

  useEffect(() => {
    return () => {
      if (shakeTimerRef.current) {
        clearTimeout(shakeTimerRef.current);
      }
    };
  }, []);

  // 스테이지 클리어 후 60% 확률로 미니 이벤트 표시
  useEffect(() => {
    if (completedStages.length === 0) return;
    if (Math.random() > 0.6) return;
    const delay = setTimeout(() => {
      const evt = MINI_EVENTS[Math.floor(Math.random() * MINI_EVENTS.length)];
      setMiniEvent(evt);
      setTimeout(() => setMiniEvent(null), 3000);
    }, 800);
    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isStageAccessible = useCallback(
    (stageId: number) => {
      if (stageId === 0) return true;
      return completedStages.includes(stageId - 1);
    },
    [completedStages],
  );

  const handleStageTap = useCallback(
    (stageId: number) => {
      if (completedStages.includes(stageId)) {
        setSelectedStage(stageId);
        return;
      }
      if (!isStageAccessible(stageId)) {
        setShakeStage(stageId);
        if (shakeTimerRef.current) {
          clearTimeout(shakeTimerRef.current);
        }
        shakeTimerRef.current = setTimeout(() => {
          setShakeStage(null);
          shakeTimerRef.current = null;
        }, 600);
        return;
      }
      setSelectedStage(stageId);
    },
    [completedStages, isStageAccessible],
  );

  const handleStageStart = useCallback(() => {
    if (selectedStage !== null) {
      onStageSelect(selectedStage);
      setSelectedStage(null);
    }
  }, [selectedStage, onStageSelect]);

  // Reversed zones for bottom-to-top display
  const reversedZones = useMemo(() => [...ZONES].reverse(), []);

  return (
    <div
      className="relative w-full min-h-screen flex flex-col overflow-hidden"
      style={{ background: ARCADE_COLORS.bg }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-4 sm:py-6 flex-shrink-0 z-20"
      >
        <p
          className="font-['Press_Start_2P',monospace] text-[10px] sm:text-[13px]"
          style={{ color: ARCADE_COLORS.gray }}
        >
          WORLD 1
        </p>
        <p
          className="font-['Press_Start_2P',monospace] text-[18px] sm:text-[26px] mt-1"
          style={{
            color: ARCADE_COLORS.gold,
            textShadow: `0 0 8px ${ARCADE_COLORS.gold}40`,
          }}
        >
          DESTINY
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <p
            className="font-['Press_Start_2P',monospace] text-[13px] sm:text-[16px]"
            style={{ color: ARCADE_COLORS.gray }}
          >
            STAGE {completedStages.length}/{ZONES.length}
          </p>
          <div className="flex gap-1">
            {ZONES.map((zone) => (
              <div
                key={zone.id}
                style={{
                  width: 8,
                  height: 8,
                  background: completedStages.includes(zone.id)
                    ? ARCADE_COLORS.green
                    : ARCADE_COLORS.darkGray,
                  border: `1px solid ${
                    completedStages.includes(zone.id)
                      ? ARCADE_COLORS.green
                      : ARCADE_COLORS.gray
                  }`,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Map zones */}
      <div className="flex-1 flex flex-col justify-center px-4 pb-4">
        {reversedZones.map((zone, reverseIdx) => {
          const isCompleted = completedStages.includes(zone.id);
          const isCurrent = currentStage === zone.id && !isCompleted;
          const accessible = isStageAccessible(zone.id);
          const isLocked = !accessible;
          const isEven = zone.id % 2 === 0;
          const LandmarkComponent = LANDMARK_COMPONENTS[zone.landmark];

          return (
            <div key={zone.id}>
              {/* Path between zones (not before first zone) */}
              {reverseIdx > 0 && (
                <PixelPath
                  completed={completedStages.includes(
                    ZONES.length - reverseIdx,
                  )}
                />
              )}

              {/* Zone */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.2 + zone.id * 0.15,
                  type: 'spring',
                  stiffness: 200,
                }}
                className="relative overflow-hidden"
                style={{
                  background: zone.bgGradient,
                  borderRadius: 4,
                  border: `2px solid ${
                    isCompleted
                      ? `${ARCADE_COLORS.green}60`
                      : isCurrent
                        ? `${ARCADE_COLORS.gold}60`
                        : `${ARCADE_COLORS.darkGray}40`
                  }`,
                  minHeight: 90,
                }}
              >
                {/* Ambient particles (hidden for locked stages and reduced motion) */}
                {!isLocked && !prefersReducedMotion && (
                  <ZoneParticles theme={zone.landmark} />
                )}

                {/* Fog overlay for locked stages */}
                {isLocked && <FogOverlay />}

                {/* Zone content */}
                <div
                  className={`relative z-[5] flex items-center gap-3 px-3 py-3 sm:px-4 sm:py-4 ${
                    isEven ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* Landmark scene */}
                  <div className="flex-shrink-0 opacity-80">
                    {LandmarkComponent && <LandmarkComponent />}
                  </div>

                  {/* Stage node + info */}
                  <div className="flex-1 flex flex-col items-center gap-1">
                    {/* 커플 워킹 - 스테이지 진행에 따라 간격 좁아짐 */}
                    {isCurrent && (
                      <div className="mb-1 flex items-end" style={{ gap: ['8px', '5px', '2px', '0px'][zone.id] ?? '8px' }}>
                        <PixelCharacterWalking character="groom" scale={2} />
                        <PixelCharacterWalking character="bride" scale={2} />
                      </div>
                    )}

                    {/* 클리어 스테이지에 하트 마크 */}
                    {isCompleted && !isCurrent && (
                      <div className="mb-1 flex items-center gap-0.5">
                        <span style={{ color: '#ff6b9d', fontSize: 10 }}>{'♥'}</span>
                      </div>
                    )}

                    {/* Stage button */}
                    <motion.button
                      onClick={() => handleStageTap(zone.id)}
                      animate={
                        shakeStage === zone.id
                          ? { x: [-4, 4, -3, 3, -1, 1, 0] }
                          : isCurrent
                            ? {
                                boxShadow: [
                                  `0 0 8px ${ARCADE_COLORS.gold}40`,
                                  `0 0 16px ${ARCADE_COLORS.gold}60`,
                                  `0 0 8px ${ARCADE_COLORS.gold}40`,
                                ],
                              }
                            : {}
                      }
                      transition={
                        shakeStage === zone.id
                          ? { duration: 0.4 }
                          : { duration: 1.5, repeat: Infinity }
                      }
                      whileHover={
                        accessible ? { scale: 1.08 } : undefined
                      }
                      whileTap={
                        accessible ? { scale: 0.95 } : undefined
                      }
                      className="relative w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center"
                      style={{
                        background: isCompleted
                          ? `${ARCADE_COLORS.green}25`
                          : isCurrent
                            ? `${ARCADE_COLORS.gold}25`
                            : `${ARCADE_COLORS.darkGray}60`,
                        border: `3px solid ${
                          isCompleted
                            ? ARCADE_COLORS.green
                            : isCurrent
                              ? ARCADE_COLORS.gold
                              : ARCADE_COLORS.gray
                        }`,
                        imageRendering: 'pixelated',
                      }}
                      aria-label={`Stage ${zone.id + 1}: ${zone.name}${isCompleted ? ' (completed)' : ''}${isLocked ? ' (locked)' : ''}`}
                    >
                      {isCompleted ? (
                        <span
                          className="font-['Press_Start_2P',monospace] text-[14px] sm:text-[16px]"
                          style={{ color: ARCADE_COLORS.green }}
                        >
                          {'★'}
                        </span>
                      ) : (
                        <span
                          className="font-['Press_Start_2P',monospace] text-[14px] sm:text-[16px]"
                          style={{
                            color: isCurrent
                              ? ARCADE_COLORS.gold
                              : ARCADE_COLORS.gray,
                          }}
                        >
                          {zone.icon}
                        </span>
                      )}
                    </motion.button>

                    {/* Stage label */}
                    <div className="text-center">
                      <p
                        className="font-['Press_Start_2P',monospace] text-[13px] sm:text-[16px]"
                        style={{
                          color: isCompleted
                            ? ARCADE_COLORS.green
                            : isCurrent
                              ? ARCADE_COLORS.gold
                              : ARCADE_COLORS.gray,
                        }}
                      >
                        {zone.name}
                      </p>
                      <p
                        className="font-['Press_Start_2P',monospace] text-[13px] sm:text-[16px] mt-0.5"
                        style={{ color: ARCADE_COLORS.gray }}
                      >
                        {zone.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Spacer to balance layout */}
                  <div className="flex-shrink-0 w-8 sm:w-12" />
                </div>

                {/* Completed banner */}
                {isCompleted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-1 right-1 sm:top-2 sm:right-2 px-1.5 py-0.5 z-10"
                    style={{
                      background: `${ARCADE_COLORS.green}30`,
                      border: `1px solid ${ARCADE_COLORS.green}`,
                    }}
                  >
                    <span
                      className="font-['Press_Start_2P',monospace] text-[12px] sm:text-[13px]"
                      style={{ color: ARCADE_COLORS.green }}
                    >
                      CLEAR
                    </span>
                  </motion.div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Hint text */}
      <motion.p
        className="text-center pb-3 font-['Press_Start_2P',monospace] text-[13px] sm:text-[16px]"
        style={{ color: ARCADE_COLORS.gray }}
        animate={prefersReducedMotion ? undefined : { opacity: [0.3, 0.6, 0.3] }}
        transition={prefersReducedMotion ? undefined : { duration: 2.5, repeat: Infinity }}
      >
        TAP A STAGE TO BEGIN
      </motion.p>

      {/* 미니 이벤트 팝업 */}
      <AnimatePresence>
        {miniEvent && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-20 left-4 right-4 z-30 flex justify-center pointer-events-none"
          >
            <div
              className="px-4 py-3 flex items-center gap-2 max-w-sm"
              style={{
                background: 'rgba(0,0,0,0.92)',
                border: `2px solid ${miniEvent.color}`,
                boxShadow: `0 0 12px ${miniEvent.color}40`,
              }}
              onClick={() => setMiniEvent(null)}
              role="status"
            >
              <span className="text-[16px] sm:text-[18px] shrink-0">{miniEvent.icon}</span>
              <p
                className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px] leading-[16px]"
                style={{ color: miniEvent.color }}
              >
                {miniEvent.text}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage info card popup */}
      <AnimatePresence>
        {selectedStage !== null && selectedStage < STAGE_INFO.length && (
          <StageInfoCard
            stage={STAGE_INFO[selectedStage]}
            isCompleted={completedStages.includes(selectedStage)}
            onStart={handleStageStart}
            onClose={() => setSelectedStage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

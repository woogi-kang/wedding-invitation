'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelCharacter, ARCADE_COLORS } from './shared';
import type { EmotionType } from './shared';

// --- 픽셀 스프라이트 렌더러 (WorldMap 패턴 재사용) ---

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
  const shadow = useMemo(() => {
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
  }, [grid, colorMap, scale]);

  return (
    <div style={{ width: (cols + 1) * scale, height: (rows + 1) * scale, position: 'relative', imageRendering: 'pixelated' }}>
      <div style={{ width: scale, height: scale, boxShadow: shadow, position: 'absolute', top: 0, left: 0 }} />
    </div>
  );
}

// --- 배경 스프라이트 데이터 ---

const TREE_GRID = [
  [0,0,0,2,0,0,0],
  [0,0,2,1,2,0,0],
  [0,2,1,2,1,2,0],
  [2,1,2,1,2,1,2],
  [0,2,1,2,1,2,0],
  [0,0,1,1,1,0,0],
  [0,0,0,3,0,0,0],
  [0,0,0,3,0,0,0],
];
const TREE_COLORS: Record<number, string> = { 1: '#2D7A2D', 2: '#4A9A40', 3: '#6B4226' };

const FLOWER_GRID = [
  [0,1,0],
  [1,2,1],
  [0,1,0],
  [0,3,0],
  [0,3,0],
];
const FLOWER_COLORS: Record<number, string> = { 1: '#FF6B9D', 2: '#FFCC00', 3: '#4A9A40' };

const BENCH_GRID = [
  [0,1,1,1,1,1,1,1,1,0],
  [1,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,1],
  [0,1,0,0,0,0,0,0,1,0],
  [0,1,0,0,0,0,0,0,1,0],
];
const BENCH_COLORS: Record<number, string> = { 1: '#6B4226', 2: '#8B6E4E' };

const CUP_GRID = [
  [0,1,1,0],
  [1,2,2,1],
  [1,2,2,1],
  [0,1,1,0],
  [0,3,3,0],
];
const CUP_COLORS: Record<number, string> = { 1: '#E8E0D0', 2: '#8B6E4E', 3: '#E8E0D0' };

const CANDLE_GRID = [
  [0,1,0],
  [0,2,0],
  [0,3,0],
  [0,3,0],
  [4,3,4],
];
const CANDLE_COLORS: Record<number, string> = { 1: '#FFD700', 2: '#FFA500', 3: '#E8E0D0', 4: '#8B8B8B' };

const STAR_GRID = [
  [0,0,1,0,0],
  [0,1,1,1,0],
  [1,1,1,1,1],
  [0,1,1,1,0],
  [0,0,1,0,0],
];
const STAR_COLORS: Record<number, string> = { 1: '#FFE4B5' };

// --- 스테이지별 필드 배경 ---

function ParkField() {
  return (
    <>
      {/* 구름 */}
      {[{ l: 10, t: 8, s: 4 }, { l: 60, t: 5, s: 3 }, { l: 85, t: 12, s: 3.5 }].map((c, i) => (
        <motion.div
          key={`cloud-${i}`}
          className="absolute"
          style={{ left: `${c.l}%`, top: `${c.t}%` }}
          animate={{ x: [0, 15, 0] }}
          transition={{ duration: 8 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div style={{ width: 12 * c.s, height: 5 * c.s, background: 'rgba(255,255,255,0.6)', borderRadius: '50%' }} />
          <div style={{ width: 8 * c.s, height: 4 * c.s, background: 'rgba(255,255,255,0.5)', borderRadius: '50%', marginTop: -3 * c.s, marginLeft: 2 * c.s }} />
        </motion.div>
      ))}
      {/* 나무 */}
      <div className="absolute bottom-2 left-1 sm:left-3">
        <PixelSprite grid={TREE_GRID} colorMap={TREE_COLORS} scale={4} />
      </div>
      <div className="absolute bottom-2 right-2 sm:right-5">
        <PixelSprite grid={TREE_GRID} colorMap={{ 1: '#3B8B3B', 2: '#5AAA50', 3: '#7B5236' }} scale={3} />
      </div>
      <div className="absolute bottom-2 left-[25%]">
        <PixelSprite grid={TREE_GRID} colorMap={{ 1: '#2a6a2a', 2: '#3a8a30', 3: '#5a3a1a' }} scale={2} />
      </div>
      {/* 꽃 */}
      {[28, 38, 48, 58, 72].map((left, i) => (
        <div key={`flower-${i}`} className="absolute bottom-1" style={{ left: `${left}%` }}>
          <PixelSprite
            grid={FLOWER_GRID}
            colorMap={i % 2 === 0 ? FLOWER_COLORS : { 1: '#FFCC00', 2: '#FF6B9D', 3: '#4A9A40' }}
            scale={2}
          />
        </div>
      ))}
      {/* 벤치 */}
      <div className="absolute bottom-1 left-[50%]">
        <PixelSprite grid={BENCH_GRID} colorMap={BENCH_COLORS} scale={2} />
      </div>
      {/* 나비 */}
      {[{ x: 35, y: 30 }, { x: 65, y: 20 }].map((b, i) => (
        <motion.div
          key={`butterfly-${i}`}
          className="absolute font-['Press_Start_2P',monospace] text-[8px]"
          style={{ left: `${b.x}%`, top: `${b.y}%`, color: i === 0 ? '#ff9edd' : '#ffe088' }}
          animate={{ x: [0, 20, -10, 0], y: [0, -10, 5, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
        >
          {'\u2727'}
        </motion.div>
      ))}
      {/* 풀밭 디테일 */}
      {[5, 18, 35, 55, 70, 88].map((l, i) => (
        <div key={`grass-${i}`} className="absolute" style={{
          left: `${l}%`, bottom: 0, width: 5 + (i % 3) * 3, height: 6 + (i % 2) * 4,
          background: `linear-gradient(0deg, #228B22, ${i % 2 === 0 ? '#32ab32' : '#2a9a2a'})`,
          borderRadius: '40% 40% 0 0', opacity: 0.7,
        }} />
      ))}
    </>
  );
}

function CafeField() {
  return (
    <>
      {/* 창문 */}
      <div className="absolute top-[10%] left-[15%]" style={{
        width: 40, height: 50, background: 'rgba(135,206,235,0.2)', border: '3px solid #8B6E4E',
        boxShadow: 'inset 0 0 8px rgba(255,255,200,0.15)',
      }}>
        <div style={{ width: '100%', height: '50%', borderBottom: '2px solid #8B6E4E' }} />
      </div>
      <div className="absolute top-[10%] right-[15%]" style={{
        width: 40, height: 50, background: 'rgba(135,206,235,0.2)', border: '3px solid #8B6E4E',
        boxShadow: 'inset 0 0 8px rgba(255,255,200,0.15)',
      }}>
        <div style={{ width: '100%', height: '50%', borderBottom: '2px solid #8B6E4E' }} />
      </div>
      {/* 벽면 선반 */}
      <div className="absolute top-[25%] left-[40%]" style={{
        width: 60, height: 4, background: '#5C3D2E', boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      }} />
      {/* 선반 위 장식 */}
      {[0, 1, 2].map((i) => (
        <div key={`jar-${i}`} className="absolute" style={{
          top: '18%', left: `${42 + i * 8}%`, width: 8, height: 12,
          background: i === 1 ? '#E8C4FF' : '#D2B48C', border: '1px solid #8B6E4E', borderRadius: '2px 2px 0 0',
        }} />
      ))}
      {/* 조명 */}
      <motion.div className="absolute top-[5%] left-[50%]" style={{ transform: 'translateX(-50%)' }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div style={{ width: 6, height: 12, background: '#FFA500', borderRadius: '0 0 50% 50%' }} />
        <div style={{ width: 20, height: 3, background: '#4A3020', marginLeft: -7, marginTop: -1 }} />
      </motion.div>
      {/* 카페 테이블 */}
      <div className="absolute bottom-2 left-[33%]">
        <div style={{ width: 80, height: 32, background: '#6B4226', border: '2px solid #4A3020', borderRadius: 2 }} />
      </div>
      {/* 테이블 다리 */}
      {[0, 1].map((i) => (
        <div key={`leg-${i}`} className="absolute" style={{
          bottom: 0, left: `${36 + i * 16}%`, width: 4, height: 8, background: '#4A3020',
        }} />
      ))}
      {/* 컵 */}
      <div className="absolute bottom-9 left-[36%]">
        <PixelSprite grid={CUP_GRID} colorMap={CUP_COLORS} scale={2} />
      </div>
      <div className="absolute bottom-9 left-[50%]">
        <PixelSprite grid={CUP_GRID} colorMap={CUP_COLORS} scale={2} />
      </div>
      {/* 케이크 접시 */}
      <div className="absolute bottom-9 left-[43%]">
        <div style={{ width: 12, height: 8, background: '#FFE4B5', border: '1px solid #D2B48C', borderRadius: '2px 2px 0 0' }} />
        <div style={{ width: 16, height: 3, background: '#E8E0D0', borderRadius: '50%', marginLeft: -2 }} />
      </div>
      {/* 증기 */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={`steam-${i}`}
          className="absolute rounded-full"
          style={{ left: `${37 + i * 5}%`, bottom: '50%', width: 3, height: 3, background: 'rgba(255,255,255,0.4)' }}
          animate={{ y: [-2, -16], opacity: [0.5, 0] }}
          transition={{ duration: 1.4, delay: i * 0.25, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
      {/* 바닥 타일 패턴 */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={`tile-${i}`} className="absolute" style={{
          bottom: 0, left: `${i * 13}%`, width: '13%', height: 6,
          background: i % 2 === 0 ? '#5C3D2E' : '#6B4226', opacity: 0.4,
        }} />
      ))}
    </>
  );
}

function RestaurantField() {
  return (
    <>
      {/* 천장 샹들리에 */}
      <div className="absolute top-[3%] left-[50%]" style={{ transform: 'translateX(-50%)' }}>
        <div style={{ width: 2, height: 12, background: '#4A4A8E', margin: '0 auto' }} />
        <div style={{ width: 30, height: 6, background: '#5A5A9E', borderRadius: '0 0 50% 50%' }} />
        {[0, 1, 2].map((i) => (
          <motion.div key={`ch-light-${i}`} className="absolute" style={{
            bottom: -4, left: 4 + i * 10, width: 4, height: 4, borderRadius: '50%', background: '#FFD700',
          }}
            animate={{ opacity: [0.5, 1, 0.5], boxShadow: ['0 0 3px #FFD700', '0 0 8px #FFD700', '0 0 3px #FFD700'] }}
            transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity }}
          />
        ))}
      </div>
      {/* 벽면 커튼 */}
      {[5, 85].map((l, i) => (
        <div key={`curtain-${i}`} className="absolute" style={{
          left: `${l}%`, top: 0, width: 20, height: '70%',
          background: 'linear-gradient(180deg, #4A2040 0%, #3A1030 100%)',
          borderRadius: '0 0 30% 30%', opacity: 0.5,
        }} />
      ))}
      {/* 벽면 그림 */}
      <div className="absolute top-[15%] left-[25%]" style={{
        width: 24, height: 20, background: '#2a2a4e', border: '2px solid #8B8B8B',
        boxShadow: 'inset 0 0 6px rgba(255,200,100,0.1)',
      }} />
      <div className="absolute top-[15%] right-[25%]" style={{
        width: 24, height: 20, background: '#2a2a4e', border: '2px solid #8B8B8B',
        boxShadow: 'inset 0 0 6px rgba(255,200,100,0.1)',
      }} />
      {/* 테이블 */}
      <div className="absolute bottom-2 left-[28%]">
        <div style={{ width: 100, height: 10, background: '#3A3A6E', border: '2px solid #4A4A8E', borderRadius: 2 }} />
      </div>
      {/* 테이블 다리 */}
      {[0, 1].map((i) => (
        <div key={`rleg-${i}`} className="absolute" style={{
          bottom: 0, left: `${32 + i * 20}%`, width: 4, height: 8, background: '#2A2A4E',
        }} />
      ))}
      {/* 테이블보 */}
      <div className="absolute bottom-3 left-[28%]" style={{
        width: 100, height: 4, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
      }} />
      {/* 촛불들 */}
      <div className="absolute bottom-5 left-[36%]">
        <PixelSprite grid={CANDLE_GRID} colorMap={CANDLE_COLORS} scale={2} />
      </div>
      <div className="absolute bottom-5 left-[55%]">
        <PixelSprite grid={CANDLE_GRID} colorMap={CANDLE_COLORS} scale={2} />
      </div>
      {/* 와인 글라스 */}
      {[40, 50].map((l, i) => (
        <div key={`wine-${i}`} className="absolute" style={{ bottom: 12, left: `${l}%` }}>
          <div style={{ width: 6, height: 8, background: i === 0 ? 'rgba(180,40,40,0.6)' : 'rgba(180,40,40,0.4)', borderRadius: '50% 50% 0 0' }} />
          <div style={{ width: 2, height: 5, background: '#aaa', margin: '0 auto' }} />
          <div style={{ width: 8, height: 2, background: '#aaa', marginLeft: -1 }} />
        </div>
      ))}
      {/* 접시 */}
      {[42, 52].map((l, i) => (
        <div key={`plate-${i}`} className="absolute" style={{
          bottom: 12, left: `${l}%`, width: 14, height: 4, background: '#ddd', borderRadius: '50%', opacity: 0.5,
        }} />
      ))}
      {/* 촛불 빛 */}
      {['36%', '55%'].map((left, i) => (
        <motion.div
          key={`glow-${i}`}
          className="absolute rounded-full"
          style={{ left, bottom: '38%', width: 8, height: 8, background: '#FFD700' }}
          animate={{ boxShadow: ['0 0 6px #FFD700, 0 0 12px #FFA500', '0 0 12px #FFD700, 0 0 24px #FFA500', '0 0 6px #FFD700, 0 0 12px #FFA500'], scale: [1, 1.3, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      ))}
      {/* 바닥 타일 */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={`rtile-${i}`} className="absolute" style={{
          bottom: 0, left: `${i * 10}%`, width: '10%', height: 4,
          background: i % 2 === 0 ? '#1a1a3e' : '#22224e', opacity: 0.5,
        }} />
      ))}
    </>
  );
}

function NightField() {
  const stars = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i, x: 3 + Math.random() * 94, y: 3 + Math.random() * 55,
      size: Math.random() * 2.5 + 0.8, delay: Math.random() * 3,
    })),
    [],
  );

  return (
    <>
      {/* 별 */}
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, background: '#fff' }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 1.5 + s.size * 0.5, delay: s.delay, repeat: Infinity }}
        />
      ))}
      {/* 유성 */}
      <motion.div
        className="absolute"
        style={{ top: '8%', right: '30%', width: 3, height: 3, borderRadius: '50%', background: '#fff' }}
        animate={{ x: [0, -120], y: [0, 80], opacity: [1, 0] }}
        transition={{ duration: 1.5, delay: 3, repeat: Infinity, repeatDelay: 8, ease: 'easeIn' }}
      >
        <div style={{ position: 'absolute', top: 0, right: -20, width: 20, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5))' }} />
      </motion.div>
      {/* 달 */}
      <motion.div className="absolute top-[8%] right-[12%]"
        animate={{ filter: ['drop-shadow(0 0 6px #FFE4B580)', 'drop-shadow(0 0 14px #FFE4B5A0)', 'drop-shadow(0 0 6px #FFE4B580)'] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <PixelSprite grid={STAR_GRID} colorMap={STAR_COLORS} scale={5} />
      </motion.div>
      {/* 달 주변 헤일로 */}
      <div className="absolute top-[6%] right-[10%]" style={{
        width: 40, height: 40, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,228,181,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* 원거리 도시 실루엣 */}
      <div className="absolute bottom-0 w-full" style={{ height: 20, opacity: 0.15 }}>
        {[8, 15, 22, 30, 40, 52, 60, 70, 78, 88].map((l, i) => (
          <div key={`bldg-${i}`} className="absolute" style={{
            left: `${l}%`, bottom: 0,
            width: 6 + (i % 3) * 4, height: 8 + (i % 4) * 5,
            background: '#222244',
          }}>
            {/* 창문 불빛 */}
            {i % 2 === 0 && (
              <motion.div style={{ width: 2, height: 2, background: '#FFD700', margin: '2px auto' }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
              />
            )}
          </div>
        ))}
      </div>
      {/* 반딧불이 */}
      {[
        { x: 15, y: 50 }, { x: 35, y: 45 }, { x: 55, y: 55 },
        { x: 75, y: 48 }, { x: 85, y: 58 }, { x: 25, y: 60 },
      ].map((f, i) => (
        <motion.div
          key={`firefly-${i}`}
          className="absolute rounded-full"
          style={{ left: `${f.x}%`, top: `${f.y}%`, width: 3, height: 3, background: '#FFD700' }}
          animate={{
            x: [0, 8 * (i % 2 === 0 ? 1 : -1), -5, 0],
            y: [0, -6, 3, 0],
            opacity: [0.2, 0.9, 0.3, 0.2],
            boxShadow: ['0 0 2px #FFD700', '0 0 6px #FFD700', '0 0 2px #FFD700'],
          }}
          transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      {/* 링 박스 (프로포즈 스테이지) */}
      <div className="absolute bottom-4 left-[45%]">
        <div style={{ width: 20, height: 15, background: '#4A2040', border: '2px solid #8B4080', borderRadius: 3 }}>
          <motion.div
            style={{ width: 8, height: 8, background: '#FFD700', borderRadius: '50%', margin: '2px auto' }}
            animate={{ boxShadow: ['0 0 4px #FFD700', '0 0 14px #FFD700', '0 0 4px #FFD700'], scale: [1, 1.15, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
        {/* 링 박스 빛 */}
        <motion.div style={{
          position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
          width: 30, height: 30, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)',
        }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
    </>
  );
}

const STAGE_BACKGROUNDS: Record<number, { gradient: string; Field: React.FC }> = {
  0: { gradient: 'linear-gradient(180deg, #87CEEB 0%, #90EE90 65%, #228B22 85%, #1a5c1a 100%)', Field: ParkField },
  1: { gradient: 'linear-gradient(180deg, #5C3D2E 0%, #8B6E4E 40%, #D2B48C 70%, #6B4226 100%)', Field: CafeField },
  2: { gradient: 'linear-gradient(180deg, #0f0f2e 0%, #1a1a4e 50%, #2a2a5e 80%, #1a1a3e 100%)', Field: RestaurantField },
  3: { gradient: 'linear-gradient(180deg, #000011 0%, #050520 30%, #0a0a30 60%, #101040 100%)', Field: NightField },
};

// --- 대화창 ---

function MiniDialog({
  speaker,
  text,
  onComplete,
  speed = 35,
}: {
  speaker: string;
  text: string;
  onComplete?: () => void;
  speed?: number;
}) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  const handleAdvance = () => {
    if (!done) {
      setDisplayed(text);
      setDone(true);
    } else {
      onComplete?.();
    }
  };

  return (
    <div
      className="w-full cursor-pointer select-none"
      onClick={handleAdvance}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleAdvance(); } }}
      aria-label="Dialog - click to advance"
    >
      <div
        className="relative w-full px-4 py-3"
        style={{
          background: 'rgba(0,0,0,0.92)',
          border: `3px solid ${ARCADE_COLORS.gray}`,
          boxShadow: `inset 2px 2px 0px ${ARCADE_COLORS.darkGray}`,
          imageRendering: 'pixelated',
        }}
      >
        <div
          className="absolute -top-3.5 left-4 px-2 py-0.5 flex items-center gap-1.5"
          style={{ background: ARCADE_COLORS.bg, border: `2px solid ${ARCADE_COLORS.gray}` }}
        >
          {(speaker === '강태욱' || speaker === '김선경') && (
            <PixelCharacter character={speaker === '강태욱' ? 'groom' : 'bride'} size="mini" scale={1} />
          )}
          <span className="font-['Press_Start_2P',monospace] text-[10px] sm:text-[12px]" style={{ color: ARCADE_COLORS.gold }}>
            {speaker}
          </span>
        </div>
        <p
          className="font-['Press_Start_2P',monospace] text-[12px] sm:text-[14px] leading-[21px] sm:leading-[26px] mt-2 min-h-[48px] whitespace-pre-wrap"
          style={{ color: ARCADE_COLORS.text }}
        >
          {displayed}
        </p>
        {done && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="absolute bottom-2 right-4 font-['Press_Start_2P',monospace] text-[10px]"
            style={{ color: ARCADE_COLORS.text }}
          >
            {'\u25BC'}
          </motion.span>
        )}
      </div>
    </div>
  );
}

// --- 말풍선 이모티콘 ---

const EMOTION_BUBBLES: Partial<Record<EmotionType, string>> = {
  surprised: '!',
  nervous: '?',
  love: '♥',
  happy: '^^',
};

function SpeechBubble({ emoticon }: { emoticon: string }) {
  return (
    <motion.div
      initial={{ scale: 0, y: 5 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <div
        className="relative px-2.5 py-1.5"
        style={{
          background: 'rgba(255,255,255,0.95)',
          border: `2px solid ${ARCADE_COLORS.darkGray}`,
          imageRendering: 'pixelated',
        }}
      >
        <span
          className="font-['Press_Start_2P',monospace] text-[14px] sm:text-[18px]"
          style={{ color: ARCADE_COLORS.bg }}
        >
          {emoticon}
        </span>
        {/* 꼬리 */}
        <div
          className="absolute -bottom-[7px] left-1/2 -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: `7px solid ${ARCADE_COLORS.darkGray}`,
          }}
        />
        <div
          className="absolute -bottom-[5px] left-1/2 -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: '6px solid rgba(255,255,255,0.95)',
          }}
        />
      </div>
    </motion.div>
  );
}

// --- 스테이지 스크립트 ---

type ScriptStep =
  | { type: 'dialog'; speaker: string; text: string; groomEmotion?: EmotionType; brideEmotion?: EmotionType }
  | { type: 'choice'; prompt: string; options: string[]; escapeIdx?: number }
  | { type: 'effect'; effectType: 'hp_drain' | 'items' | 'hearts' }
  | { type: 'result'; text: string };

interface StageScript {
  title: string;
  brideEntrance?: boolean; // 신부 슬라이드 인 연출
  steps: ScriptStep[];
}

const ESCAPE_LINES = [
  '도망칠 수 없다!',
  '도망칠 수 없다! (진짜로)',
  '포기해. 운명이야.',
  '개발자면 포기란 없잖아?',
  '404: EXIT NOT FOUND',
];

const STAGE_SCRIPTS: StageScript[] = [
  {
    title: 'STAGE 1: First Encounter',
    brideEntrance: true,
    steps: [
      { type: 'dialog', speaker: 'SYSTEM', text: '야생의 김선경이(가) 나타났다!', groomEmotion: 'surprised', brideEmotion: 'idle' },
      { type: 'dialog', speaker: 'SYSTEM', text: '...잠깐, 심장 박동수가 180을 넘었다', groomEmotion: 'nervous' },
      { type: 'dialog', speaker: 'SYSTEM', text: 'WARNING: cardiac_event.exe 실행 중...', groomEmotion: 'nervous' },
      { type: 'choice', prompt: '어떻게 하시겠습니까?', options: ['말을 건다', '도망친다'], escapeIdx: 1 },
      { type: 'dialog', speaker: '강태욱', text: '안...안녕하세요! 저는 강태욱이라고...', groomEmotion: 'nervous' },
      { type: 'dialog', speaker: 'SYSTEM', text: '(내면의 소리: 아 왜 목소리가 옥타브가 올라가지)', groomEmotion: 'nervous' },
      { type: 'dialog', speaker: '김선경', text: '안녕하세요! 반가워요 :)', brideEmotion: 'happy' },
      { type: 'dialog', speaker: 'SYSTEM', text: '(강태욱의 뇌가 3초간 정지했다)', groomEmotion: 'surprised' },
      { type: 'dialog', speaker: 'SYSTEM', text: '(김선경은 이 어색함을 못 느낀 것 같다)', brideEmotion: 'happy' },
      { type: 'dialog', speaker: 'SYSTEM', text: '(아니 느꼈다)', brideEmotion: 'surprised' },
      { type: 'dialog', speaker: 'SYSTEM', text: '호감도가 급상승했다!\nDEBUG: 호감도 = Integer.MAX_VALUE', groomEmotion: 'love', brideEmotion: 'happy' },
      { type: 'result', text: '첫 만남 이벤트 클리어!' },
    ],
  },
  {
    title: 'STAGE 2: Butterfly Effect',
    steps: [
      { type: 'dialog', speaker: 'SYSTEM', text: '강태욱에게 상태이상이 걸렸다!', groomEmotion: 'surprised' },
      { type: 'dialog', speaker: 'SYSTEM', text: 'STATUS: LOVE_STRUCK\nDURATION: PERMANENT', groomEmotion: 'love', brideEmotion: 'happy' },
      { type: 'effect', effectType: 'hp_drain' },
      { type: 'dialog', speaker: 'SYSTEM', text: 'HP가 줄어들고 있다...!', groomEmotion: 'nervous' },
      { type: 'dialog', speaker: 'SYSTEM', text: '부작용 발현 중...' },
      { type: 'dialog', speaker: 'SYSTEM', text: '- 5분마다 카톡 확인\n- 이유 없이 웃음\n- 갑자기 연애 노래가 이해됨', groomEmotion: 'happy' },
      { type: 'dialog', speaker: 'SYSTEM', text: '치료 시도: 친구에게 상담' },
      { type: 'dialog', speaker: '친구', text: '야 너 완전 빠졌다 ㅋㅋㅋㅋ 치료 불가 ㅋㅋ' },
      { type: 'dialog', speaker: 'SYSTEM', text: '치료 실패! ...하지만 사랑의 HP는 무한이었다!', groomEmotion: 'love', brideEmotion: 'love' },
      { type: 'dialog', speaker: 'SYSTEM', text: '사랑 포인트 +9999! (이미 오버플로우)', groomEmotion: 'happy', brideEmotion: 'happy' },
      { type: 'result', text: '사랑 성장 이벤트 클리어!' },
    ],
  },
  {
    title: 'STAGE 3: Side Quests',
    steps: [
      { type: 'dialog', speaker: 'SYSTEM', text: '사이드 퀘스트 보상 정산 중...' },
      { type: 'effect', effectType: 'items' },
      { type: 'dialog', speaker: 'SYSTEM', text: '커플 잠옷을 획득했다! (착용 필수, 해제 불가)', groomEmotion: 'happy', brideEmotion: 'happy' },
      { type: 'dialog', speaker: 'SYSTEM', text: '서로의 폰 비밀번호 획득! (신뢰 +999)', brideEmotion: 'love' },
      { type: 'dialog', speaker: 'SYSTEM', text: 'IKEA 가구 공동 조립 퀘스트 클리어! (인내 +500, 관계 위기 +1)', groomEmotion: 'nervous', brideEmotion: 'nervous' },
      { type: 'dialog', speaker: 'SYSTEM', text: '첫 싸움을 경험했다!' },
      { type: 'dialog', speaker: 'SYSTEM', text: '...30분 만에 화해했다! 스킬 습득: 화해의 기술 Lv.MAX', groomEmotion: 'love', brideEmotion: 'love' },
      { type: 'dialog', speaker: 'SYSTEM', text: '맛집 리스트 x147 획득! (위장 용량 초과 경고)', groomEmotion: 'happy', brideEmotion: 'happy' },
      { type: 'dialog', speaker: 'SYSTEM', text: '숨겨진 업적 달성: "서로 없으면 안 되는 사이"', groomEmotion: 'love', brideEmotion: 'love' },
      { type: 'result', text: '기념일 이벤트 클리어!' },
    ],
  },
  {
    title: 'STAGE 4: The Proposal',
    steps: [
      { type: 'dialog', speaker: 'SYSTEM', text: '강태욱이 긴장 상태에 돌입했다!', groomEmotion: 'nervous' },
      { type: 'dialog', speaker: 'SYSTEM', text: '(손이 떨리고 있다)\n(무릎이 떨리고 있다)\n(전부 떨리고 있다)', groomEmotion: 'nervous' },
      { type: 'dialog', speaker: 'SYSTEM', text: '아이템 사용: Ring of Eternal Promise', groomEmotion: 'nervous' },
      { type: 'dialog', speaker: 'SYSTEM', text: '손이 너무 떨려서 반지를 떨어뜨렸다!', groomEmotion: 'surprised', brideEmotion: 'surprised' },
      { type: 'dialog', speaker: 'SYSTEM', text: '...어쨌든 반지를 주웠다', groomEmotion: 'nervous' },
      { type: 'dialog', speaker: 'SYSTEM', text: 'ERROR: NO 버튼을 찾을 수 없습니다' },
      { type: 'dialog', speaker: 'SYSTEM', text: 'NO.exe has been permanently deleted' },
      { type: 'choice', prompt: '결혼해 주시겠습니까?', options: ['YES', '당연하지', '빨리 반지 줘', '이미 YES'] },
      { type: 'dialog', speaker: 'SYSTEM', text: '효과는 굉장했다!', groomEmotion: 'happy', brideEmotion: 'happy' },
      { type: 'effect', effectType: 'hearts' },
      { type: 'dialog', speaker: '김선경', text: '...바보야. 당연하지!', brideEmotion: 'love', groomEmotion: 'love' },
      { type: 'dialog', speaker: 'SYSTEM', text: '강태욱이 울었다!\n김선경도 울었다!\n(근처 테이블 손님도 울었다)', groomEmotion: 'happy', brideEmotion: 'happy' },
      { type: 'dialog', speaker: 'SYSTEM', text: '프로포즈 대성공!\ncommit -m "feat: 영원의 약속"', groomEmotion: 'love', brideEmotion: 'love' },
      { type: 'result', text: '프로포즈 이벤트 클리어!' },
    ],
  },
];

// --- 메인 StageEvent 컴포넌트 ---

interface StageEventProps {
  stageIndex: number;
  onComplete: () => void;
  onClose: () => void;
}

export function StageEvent({ stageIndex, onComplete, onClose }: StageEventProps) {
  const script = STAGE_SCRIPTS[stageIndex] || STAGE_SCRIPTS[0];
  const bg = STAGE_BACKGROUNDS[stageIndex] || STAGE_BACKGROUNDS[0];
  const [stepIdx, setStepIdx] = useState(0);
  const [showClear, setShowClear] = useState(false);
  const [escapeAttempt, setEscapeAttempt] = useState(false);
  const [escapeCount, setEscapeCount] = useState(0);

  // 캐릭터 상태
  const [groomVisible, setGroomVisible] = useState(true);
  const [brideVisible, setBrideVisible] = useState(!script.brideEntrance);
  const [groomEmotion, setGroomEmotion] = useState<EmotionType>('idle');
  const [brideEmotion, setBrideEmotion] = useState<EmotionType>('idle');

  // 이펙트 상태
  const [shownItems, setShownItems] = useState<string[]>([]);
  const [showHearts, setShowHearts] = useState(false);
  const [hpPercent, setHpPercent] = useState(100);

  // 말풍선 이모티콘 상태
  const [groomBubble, setGroomBubble] = useState<string | null>(null);
  const [brideBubble, setBrideBubble] = useState<string | null>(null);

  // 대화 속도 상태
  const [dialogFast, setDialogFast] = useState(false);
  const dialogSpeed = dialogFast ? 10 : 35;

  const currentStep = script.steps[stepIdx];

  // 대사에 따른 감정 업데이트
  useEffect(() => {
    if (!currentStep) return;
    if (currentStep.type === 'dialog') {
      if (currentStep.groomEmotion) setGroomEmotion(currentStep.groomEmotion);
      if (currentStep.brideEmotion) setBrideEmotion(currentStep.brideEmotion);

      // "나타났다" 대사에서 신부 슬라이드 인
      if (script.brideEntrance && currentStep.text.includes('나타났다') && !brideVisible) {
        setTimeout(() => setBrideVisible(true), 300);
      }
    }
  }, [currentStep, stepIdx, script.brideEntrance, brideVisible]);

  // 감정 변화 시 말풍선 표시
  useEffect(() => {
    if (groomEmotion !== 'idle' && EMOTION_BUBBLES[groomEmotion]) {
      setGroomBubble(EMOTION_BUBBLES[groomEmotion]!);
    }
  }, [groomEmotion]);

  useEffect(() => {
    if (brideEmotion !== 'idle' && EMOTION_BUBBLES[brideEmotion]) {
      setBrideBubble(EMOTION_BUBBLES[brideEmotion]!);
    }
  }, [brideEmotion]);

  // 말풍선 자동 사라짐 (1.5초)
  useEffect(() => {
    if (!groomBubble) return;
    const timer = setTimeout(() => setGroomBubble(null), 1500);
    return () => clearTimeout(timer);
  }, [groomBubble]);

  useEffect(() => {
    if (!brideBubble) return;
    const timer = setTimeout(() => setBrideBubble(null), 1500);
    return () => clearTimeout(timer);
  }, [brideBubble]);

  const advanceStep = useCallback(() => {
    if (stepIdx < script.steps.length - 1) {
      setStepIdx((prev) => prev + 1);
    }
  }, [stepIdx, script.steps.length]);

  // 이펙트 자동 진행
  useEffect(() => {
    if (!currentStep || currentStep.type !== 'effect') return;

    if (currentStep.effectType === 'hp_drain') {
      const interval = setInterval(() => {
        setHpPercent((prev) => {
          if (prev <= 10) { clearInterval(interval); return 10; }
          return prev - 5;
        });
      }, 100);
      const timer = setTimeout(advanceStep, 1500);
      return () => { clearInterval(interval); clearTimeout(timer); };
    }

    if (currentStep.effectType === 'items') {
      const items = ['1주년 케이크', '추억의 사진 x99', '2주년 반지'];
      items.forEach((item, i) => {
        setTimeout(() => setShownItems((prev) => [...prev, item]), 600 * (i + 1));
      });
      const timer = setTimeout(advanceStep, 2500);
      return () => clearTimeout(timer);
    }

    if (currentStep.effectType === 'hearts') {
      setShowHearts(true);
      setGroomEmotion('love');
      setBrideEmotion('love');
      const timer = setTimeout(advanceStep, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, advanceStep]);

  // 결과 -> STAGE CLEAR
  useEffect(() => {
    if (currentStep?.type === 'result') {
      const timer = setTimeout(() => setShowClear(true), 500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleChoice = (choiceIdx: number) => {
    if (!currentStep || currentStep.type !== 'choice') return;
    if (currentStep.escapeIdx !== undefined && choiceIdx === currentStep.escapeIdx) {
      setEscapeAttempt(true);
      setEscapeCount((prev) => prev + 1);
      setTimeout(() => setEscapeAttempt(false), 1200);
      return;
    }
    advanceStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: ARCADE_COLORS.bg }}
    >
      {/* 닫기 + 속도 토글 버튼 */}
      <div className="absolute top-3 right-3 flex gap-2 z-20">
        <button
          onClick={() => setDialogFast((prev) => !prev)}
          className="font-['Press_Start_2P',monospace] text-[11px] px-2.5 py-1.5"
          style={{
            color: dialogFast ? ARCADE_COLORS.gold : ARCADE_COLORS.gray,
            border: `1px solid ${dialogFast ? ARCADE_COLORS.gold : ARCADE_COLORS.gray}`,
            background: 'rgba(0,0,0,0.7)',
          }}
          aria-label={dialogFast ? 'Normal speed' : 'Fast speed'}
        >
          {dialogFast ? '>>>' : '>>'}
        </button>
        <button
          onClick={onClose}
          className="font-['Press_Start_2P',monospace] text-[13px] px-3 py-1.5"
          style={{ color: ARCADE_COLORS.gray, border: `1px solid ${ARCADE_COLORS.gray}`, background: 'rgba(0,0,0,0.7)' }}
          aria-label="Close stage event"
        >
          X
        </button>
      </div>

      {/* 스테이지 타이틀 */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center py-2 flex-shrink-0 z-10"
      >
        <p className="font-['Press_Start_2P',monospace] text-[12px] sm:text-[14px]" style={{ color: ARCADE_COLORS.gold }}>
          {script.title}
        </p>
      </motion.div>

      {/* 필드 씬 (상단 ~55%) */}
      <div className="flex-1 relative overflow-hidden min-h-0" style={{ background: bg.gradient }}>
        {/* 배경 요소 */}
        <bg.Field />

        {/* 지면 라인 */}
        <div className="absolute bottom-0 w-full h-[3px]" style={{ background: 'rgba(0,0,0,0.3)' }} />

        {/* HP 바 (스테이지 1용) */}
        {stageIndex === 1 && (
          <div className="absolute top-2 left-3 right-3 z-10">
            <div className="w-full max-w-xs">
              <div className="flex justify-between mb-1">
                <span className="font-['Press_Start_2P',monospace] text-[9px]" style={{ color: ARCADE_COLORS.text }}>HP</span>
                <span className="font-['Press_Start_2P',monospace] text-[9px]" style={{ color: hpPercent > 30 ? ARCADE_COLORS.green : ARCADE_COLORS.red }}>
                  {hpPercent}%
                </span>
              </div>
              <div className="w-full h-4" style={{ background: ARCADE_COLORS.darkGray, border: `1px solid ${ARCADE_COLORS.gray}` }}>
                <motion.div className="h-full" style={{ background: hpPercent > 30 ? ARCADE_COLORS.green : ARCADE_COLORS.red }} animate={{ width: `${hpPercent}%` }} transition={{ duration: 0.2 }} />
              </div>
            </div>
          </div>
        )}

        {/* 아이템 표시 (스테이지 2용) */}
        {stageIndex === 2 && shownItems.length > 0 && (
          <div className="absolute top-2 right-3 flex flex-col gap-1 z-10">
            {shownItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="px-2 py-1"
                style={{ background: `${ARCADE_COLORS.gold}20`, border: `2px solid ${ARCADE_COLORS.gold}` }}
              >
                <span className="font-['Press_Start_2P',monospace] text-[9px]" style={{ color: ARCADE_COLORS.gold }}>
                  {item}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* 하트 폭발 */}
        {showHearts && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-[16px] sm:text-[20px]"
                style={{ left: `${10 + Math.random() * 80}%`, bottom: '10%', color: ARCADE_COLORS.pink }}
                initial={{ y: 0, opacity: 1, scale: 0.5 }}
                animate={{ y: -(80 + Math.random() * 100), opacity: [1, 1, 0], scale: [0.5, 1.2, 0.8], x: (Math.random() - 0.5) * 60 }}
                transition={{ duration: 1.5 + Math.random() * 0.5, delay: Math.random() * 0.5, ease: 'easeOut' }}
              >
                {'♥'}
              </motion.span>
            ))}
          </div>
        )}

        {/* 캐릭터: 신랑 (좌측) */}
        <AnimatePresence>
          {groomVisible && (
            <motion.div
              className="absolute z-[5]"
              style={{ bottom: '5%', left: '12%' }}
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 15 }}
            >
              <PixelCharacter character="groom" size="full" scale={4} emotion={groomEmotion} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 캐릭터: 신부 (우측) */}
        <AnimatePresence>
          {brideVisible && (
            <motion.div
              className="absolute z-[5]"
              style={{ bottom: '5%', right: '12%' }}
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 15, delay: script.brideEntrance ? 0.5 : 0 }}
            >
              <PixelCharacter character="bride" size="full" scale={4} emotion={brideEmotion} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 말풍선 이모티콘 */}
        <AnimatePresence>
          {groomBubble && groomVisible && (
            <motion.div
              key={`groom-bubble-${groomBubble}`}
              className="absolute z-10"
              style={{ bottom: 'calc(5% + 96px)', left: '12%' }}
            >
              <SpeechBubble emoticon={groomBubble} />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {brideBubble && brideVisible && (
            <motion.div
              key={`bride-bubble-${brideBubble}`}
              className="absolute z-10"
              style={{ bottom: 'calc(5% + 96px)', right: '12%' }}
            >
              <SpeechBubble emoticon={brideBubble} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 대화/선택 영역 (하단 ~45%) */}
      <div className="flex-shrink-0 px-3 pb-4 pt-2 sm:px-4" style={{ background: 'rgba(0,0,0,0.9)' }}>
        {/* 도망 시도 메시지 */}
        <AnimatePresence>
          {escapeAttempt && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 py-2 text-center mb-2"
              style={{ background: `${ARCADE_COLORS.red}20`, border: `2px solid ${ARCADE_COLORS.red}` }}
            >
              <p className="font-['Press_Start_2P',monospace] text-[12px] sm:text-[14px]" style={{ color: ARCADE_COLORS.red }}>
                {ESCAPE_LINES[(escapeCount - 1) % ESCAPE_LINES.length]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {currentStep?.type === 'dialog' && (
          <MiniDialog speaker={currentStep.speaker} text={currentStep.text} onComplete={advanceStep} speed={dialogSpeed} />
        )}

        {currentStep?.type === 'choice' && !escapeAttempt && (
          <div
            className="w-full px-4 py-3"
            style={{ background: 'rgba(0,0,0,0.9)', border: `3px solid ${ARCADE_COLORS.gray}`, imageRendering: 'pixelated' }}
          >
            <p className="font-['Press_Start_2P',monospace] text-[12px] sm:text-[13px] mb-3" style={{ color: ARCADE_COLORS.text }}>
              {currentStep.prompt}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {currentStep.options.map((option, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleChoice(i)}
                  className="px-3 py-2.5 font-['Press_Start_2P',monospace] text-[10px] sm:text-[12px] text-left"
                  style={{ color: ARCADE_COLORS.text, background: ARCADE_COLORS.darkGray, border: `2px solid ${ARCADE_COLORS.gray}` }}
                >
                  {'>'} {option}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {currentStep?.type === 'result' && (
          <MiniDialog speaker="SYSTEM" text={currentStep.text} onComplete={() => {}} speed={dialogSpeed} />
        )}

        {/* effect 진행 중일 때 안내 */}
        {currentStep?.type === 'effect' && (
          <div className="text-center py-3">
            <motion.p
              className="font-['Press_Start_2P',monospace] text-[10px]"
              style={{ color: ARCADE_COLORS.gray }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ...
            </motion.p>
          </div>
        )}
      </div>

      {/* STAGE CLEAR 오버레이 */}
      <AnimatePresence>
        {showClear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-30"
            style={{ background: 'rgba(0, 0, 0, 0.7)' }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-center"
            >
              <p
                className="font-['Press_Start_2P',monospace] text-[26px] sm:text-[40px]"
                style={{
                  color: ARCADE_COLORS.gold,
                  textShadow: `0 0 10px ${ARCADE_COLORS.gold}80, 0 0 20px ${ARCADE_COLORS.gold}40, 4px 4px 0px #b38f00`,
                }}
              >
                STAGE CLEAR!
              </p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="mt-3 h-[2px] w-48 mx-auto"
                style={{ background: `linear-gradient(90deg, transparent, ${ARCADE_COLORS.gold}, transparent)` }}
              />
            </motion.div>

            {/* 클리어 후 캐릭터 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 flex items-end gap-1"
            >
              <PixelCharacter character="groom" size="full" scale={3} emotion="love" />
              <PixelCharacter character="bride" size="full" scale={3} emotion="love" />
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={onComplete}
              className="mt-6 px-8 py-3.5 font-['Press_Start_2P',monospace] text-[12px] sm:text-[13px]"
              style={{ color: '#000', background: ARCADE_COLORS.gold, border: '2px solid #b38f00', boxShadow: '4px 4px 0px #b38f00' }}
            >
              CONTINUE
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

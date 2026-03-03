'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelCharacter, ARCADE_COLORS } from './shared';
import type { EmotionType } from './shared';

function hash01(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

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
  const petals = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: 4 + hash01(i * 17 + 3) * 92,
        y: 10 + hash01(i * 19 + 7) * 58,
        drift: 12 + hash01(i * 23 + 11) * 16,
        sway: (hash01(i * 27 + 13) - 0.5) * 12,
        delay: hash01(i * 29 + 13) * 2.8,
        duration: 4.2 + hash01(i * 31 + 17) * 2.5,
      })),
    [],
  );

  const sparkles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        x: 6 + hash01(i * 37 + 3) * 88,
        y: 14 + hash01(i * 41 + 7) * 56,
        size: 1.2 + hash01(i * 43 + 11) * 2.8,
        delay: hash01(i * 47 + 13) * 2.6,
      })),
    [],
  );

  const birds = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        id: i,
        x: 14 + i * 21,
        y: 14 + (i % 2) * 4,
        wing: 20 + i * 4,
        delay: i * 0.45,
      })),
    [],
  );

  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(204,239,255,0.42) 0%, rgba(184,241,215,0.22) 36%, rgba(98,182,94,0.08) 72%, transparent 100%)',
        }}
      />

      <motion.div
        className="absolute top-[6%] right-[10%] rounded-full"
        style={{
          width: 108,
          height: 108,
          background:
            'radial-gradient(circle, rgba(255,251,208,0.95) 0%, rgba(255,229,158,0.82) 46%, rgba(255,210,129,0.35) 70%, transparent 100%)',
        }}
        animate={{ opacity: [0.78, 1, 0.78], scale: [0.97, 1.06, 0.97] }}
        transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[3%] right-[4%] rounded-full"
        style={{
          width: 190,
          height: 190,
          background: 'radial-gradient(circle, rgba(255,244,187,0.2) 0%, rgba(255,228,160,0.12) 44%, transparent 76%)',
          filter: 'blur(1px)',
        }}
        animate={{ opacity: [0.35, 0.62, 0.35] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {birds.map((bird) => (
        <motion.div
          key={`park-bird-${bird.id}`}
          className="absolute"
          style={{ left: `${bird.x}%`, top: `${bird.y}%` }}
          animate={{ y: [0, -4, 0], x: [0, 6, 0] }}
          transition={{ duration: 4.6 + bird.id, delay: bird.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            style={{
              width: bird.wing,
              height: 2,
              background: 'rgba(98,125,147,0.55)',
              borderRadius: 999,
              transform: 'rotate(-16deg)',
              transformOrigin: 'left center',
            }}
          />
          <div
            style={{
              width: bird.wing * 0.8,
              height: 2,
              marginTop: 2,
              marginLeft: bird.wing * 0.45,
              background: 'rgba(98,125,147,0.52)',
              borderRadius: 999,
              transform: 'rotate(17deg)',
              transformOrigin: 'left center',
            }}
          />
        </motion.div>
      ))}

      {[{ l: 9, t: 15, s: 1.3 }, { l: 42, t: 10, s: 1 }, { l: 72, t: 16, s: 1.12 }].map((c, i) => (
        <motion.div
          key={`cloud-${i}`}
          className="absolute"
          style={{ left: `${c.l}%`, top: `${c.t}%` }}
          animate={{ x: [0, 24, 0] }}
          transition={{ duration: 10 + i * 2.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            style={{
              width: 68 * c.s,
              height: 24 * c.s,
              background: 'rgba(255,255,255,0.75)',
              borderRadius: '999px',
            }}
          />
          <div
            style={{
              width: 36 * c.s,
              height: 16 * c.s,
              background: 'rgba(255,255,255,0.56)',
              borderRadius: '999px',
              marginTop: -12 * c.s,
              marginLeft: 12 * c.s,
            }}
          />
        </motion.div>
      ))}

      <div
        className="absolute -top-[4%] -left-[5%]"
        style={{
          width: '34%',
          height: '35%',
          borderRadius: '62% 38% 50% 50%',
          background:
            'radial-gradient(circle at 48% 66%, rgba(255,183,214,0.42) 0%, rgba(251,168,206,0.28) 38%, rgba(249,205,228,0.12) 66%, transparent 100%)',
          filter: 'blur(9px)',
        }}
      />
      <div
        className="absolute -top-[6%] right-[-3%]"
        style={{
          width: '34%',
          height: '37%',
          borderRadius: '38% 62% 52% 48%',
          background:
            'radial-gradient(circle at 40% 64%, rgba(255,203,174,0.34) 0%, rgba(255,187,155,0.24) 42%, rgba(255,220,198,0.1) 66%, transparent 100%)',
          filter: 'blur(10px)',
        }}
      />

      <motion.div
        className="absolute left-[-15%] top-[18%] w-[130%] h-[28%]"
        style={{
          background:
            'linear-gradient(100deg, transparent 0%, rgba(255,252,235,0.22) 42%, rgba(255,248,214,0.09) 58%, transparent 100%)',
          transform: 'rotate(-7deg)',
          filter: 'blur(8px)',
        }}
        animate={{ opacity: [0.32, 0.58, 0.32] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 원경 구릉 */}
      <div className="absolute bottom-[24%] left-[-6%]" style={{ width: '34%', height: '18%', borderRadius: '60% 40% 0 0', background: 'rgba(127,191,112,0.54)' }} />
      <div className="absolute bottom-[24%] left-[18%]" style={{ width: '44%', height: '20%', borderRadius: '56% 44% 0 0', background: 'rgba(112,182,100,0.52)' }} />
      <div className="absolute bottom-[23%] left-[49%]" style={{ width: '38%', height: '19%', borderRadius: '58% 42% 0 0', background: 'rgba(106,175,96,0.54)' }} />
      <div className="absolute bottom-[25%] right-[-7%]" style={{ width: '33%', height: '17%', borderRadius: '58% 42% 0 0', background: 'rgba(120,186,108,0.52)' }} />

      {/* 잔디 + 길 */}
      <div className="absolute bottom-0 left-0 w-full" style={{ height: '35%', background: 'linear-gradient(180deg, #66bc61 0%, #469e48 52%, #296f37 100%)' }} />
      <div className="absolute bottom-[7%] left-[27%]" style={{ width: '46%', height: '20%', borderRadius: '50%', background: 'linear-gradient(180deg, rgba(234,214,177,0.62) 0%, rgba(208,181,136,0.34) 100%)' }} />

      {/* 포컬 포인트: 벤치 */}
      <div className="absolute bottom-[31%] left-[44%]" style={{ width: 92, height: 38 }}>
        <div
          style={{
            position: 'absolute',
            left: -12,
            top: 12,
            width: 124,
            height: 18,
            background: 'rgba(36,71,31,0.24)',
            filter: 'blur(2px)',
            borderRadius: '50%',
          }}
        />
        <PixelSprite grid={BENCH_GRID} colorMap={BENCH_COLORS} scale={9.4} />
      </div>

      {/* 개화 나무 */}
      {[{ x: 11, y: 27, blossom: 'rgba(255,184,209,0.88)' }, { x: 82, y: 28, blossom: 'rgba(255,206,178,0.84)' }].map((tree, i) => (
        <div key={`park-tree-${i}`} className="absolute" style={{ left: `${tree.x}%`, bottom: `${tree.y}%` }}>
          <PixelSprite grid={TREE_GRID} colorMap={TREE_COLORS} scale={9.4} />
          {[[-14, -18], [20, -24], [6, -34], [26, -10], [-22, -8], [5, -8]].map((pos, ci) => (
            <motion.div
              key={`tree-blossom-${i}-${ci}`}
              className="absolute rounded-full"
              style={{ left: pos[0], top: pos[1] - 18, width: 28, height: 22, background: tree.blossom }}
              animate={{ opacity: [0.68, 1, 0.68] }}
              transition={{ duration: 2 + ci * 0.25, repeat: Infinity }}
            />
          ))}
        </div>
      ))}

      {/* 가로등 */}
      {[33, 67].map((left, i) => (
        <div key={`park-lamp-${i}`} className="absolute" style={{ left: `${left}%`, bottom: '31%' }}>
          <div style={{ width: 4, height: 66, background: '#4f6943' }} />
          <motion.div
            className="rounded-full"
            style={{ width: 13, height: 13, marginLeft: -4, marginTop: -74, background: 'rgba(255,238,174,0.95)', boxShadow: '0 0 22px rgba(255,238,174,0.74)' }}
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2.2 + i * 0.4, repeat: Infinity }}
          />
        </div>
      ))}

      {/* 꽃 군락 */}
      {[25, 31, 38, 46, 54, 62, 70].map((left, i) => (
        <div key={`park-flower-${i}`} className="absolute" style={{ left: `${left}%`, bottom: `${23 + (i % 2) * 2}%` }}>
          <PixelSprite
            grid={FLOWER_GRID}
            colorMap={i % 2 === 0 ? FLOWER_COLORS : { 1: '#ffd78e', 2: '#ff89b3', 3: '#5aa24f' }}
            scale={3}
          />
        </div>
      ))}

      {/* 공기 반짝임 */}
      {sparkles.map((s) => (
        <motion.div
          key={`park-sparkle-${s.id}`}
          className="absolute rounded-full"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, background: 'rgba(255,255,255,0.62)' }}
          animate={{ opacity: [0.12, 0.72, 0.12], scale: [0.85, 1.14, 0.85] }}
          transition={{ duration: 2.2 + (s.id % 4) * 0.34, delay: s.delay, repeat: Infinity }}
        />
      ))}

      {/* 꽃잎 */}
      {petals.map((p) => (
        <motion.div
          key={`park-petal-${p.id}`}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: 4.8, height: 2.8, background: 'rgba(255,190,214,0.82)' }}
          animate={{ x: [0, p.drift, p.drift * 0.45, 0], y: [0, -8, 5, 0], rotate: [0, p.sway, -p.sway, 0], opacity: [0.22, 0.92, 0.34, 0.22] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </>
  );
}

function CafeField() {
  const dust = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        x: 5 + hash01(i * 13 + 3) * 90,
        y: 10 + hash01(i * 17 + 7) * 64,
        size: 1.6 + hash01(i * 19 + 11) * 2.8,
        delay: hash01(i * 23 + 13) * 2.6,
      })),
    [],
  );

  const bokeh = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: 7 + hash01(i * 29 + 3) * 86,
        y: 16 + hash01(i * 31 + 7) * 56,
        size: 6 + hash01(i * 37 + 11) * 11,
        alpha: 0.08 + hash01(i * 41 + 13) * 0.17,
        delay: hash01(i * 43 + 17) * 3,
      })),
    [],
  );

  const windowBuildings = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: i * 8.5,
        width: 7 + (i % 4) * 1.8,
        height: 10 + (i % 5) * 4.2,
      })),
    [],
  );

  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(56,34,24,0.56) 0%, rgba(70,42,29,0.44) 36%, rgba(44,27,20,0.72) 100%)',
        }}
      />

      <motion.div
        className="absolute left-[-8%] top-[18%] w-[116%] h-[30%]"
        style={{
          background:
            'linear-gradient(102deg, transparent 0%, rgba(255,218,169,0.21) 34%, rgba(255,232,196,0.15) 50%, rgba(255,210,154,0.08) 62%, transparent 100%)',
          filter: 'blur(8px)',
          transform: 'rotate(-7deg)',
        }}
        animate={{ opacity: [0.3, 0.56, 0.3] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 벽 텍스처 */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={`cafe-wall-line-${i}`}
          className="absolute left-0 w-full"
          style={{
            top: `${9 + i * 7.5}%`,
            height: 1,
            background: i % 2 === 0 ? 'rgba(138,102,72,0.26)' : 'rgba(99,70,51,0.22)',
          }}
        />
      ))}

      {/* 파노라마 창 */}
      <div
        className="absolute left-[16%] top-[9%]"
        style={{
          width: '68%',
          height: '44%',
          border: '4px solid #8f6548',
          borderRadius: 12,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, rgba(255,214,170,0.36) 0%, rgba(255,188,129,0.18) 58%, rgba(114,77,58,0.12) 100%)',
          boxShadow: 'inset 0 0 22px rgba(255,215,167,0.24)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(255,182,128,0.44) 0%, rgba(248,160,109,0.2) 60%, rgba(92,62,51,0.24) 100%)' }}
        />
        <motion.div
          className="absolute left-[8%] top-[18%] rounded-full"
          style={{ width: 120, height: 44, background: 'rgba(255,248,239,0.24)', filter: 'blur(1px)' }}
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-[10%] top-[30%] rounded-full"
          style={{ width: 84, height: 30, background: 'rgba(255,242,232,0.2)', filter: 'blur(1px)' }}
          animate={{ x: [0, -14, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="absolute bottom-0 left-0 w-full h-[34%]">
          {windowBuildings.map((b) => (
            <div
              key={`window-building-${b.id}`}
              className="absolute bottom-0"
              style={{
                left: `${b.x}%`,
                width: `${b.width}%`,
                height: `${b.height}%`,
                background: 'rgba(93,59,45,0.44)',
              }}
            />
          ))}
        </div>

        <div style={{ position: 'absolute', top: 0, left: '33.33%', width: 3, height: '100%', background: '#8f6548' }} />
        <div style={{ position: 'absolute', top: 0, left: '66.66%', width: 3, height: '100%', background: '#8f6548' }} />
        <div style={{ position: 'absolute', top: '48%', left: 0, width: '100%', height: 3, background: '#8f6548' }} />
      </div>

      {/* 벽 메뉴 보드 */}
      {[{ left: 7, text: 'LOVE LATTE' }, { left: 83, text: 'SWEET DATE' }].map((board, i) => (
        <div
          key={`cafe-board-${i}`}
          className="absolute top-[22%]"
          style={{
            left: `${board.left}%`,
            width: 92,
            height: 56,
            background: 'rgba(32,24,20,0.76)',
            border: '3px solid rgba(170,128,95,0.7)',
            boxShadow: '0 0 12px rgba(0,0,0,0.2)',
          }}
        >
          <p className="font-['Press_Start_2P',monospace] text-[10px] leading-4 pt-3 text-center" style={{ color: '#f6e2ca' }}>
            {board.text}
          </p>
        </div>
      ))}

      {/* 펜던트 조명 */}
      {[24, 40, 56, 72].map((left, i) => (
        <div key={`cafe-lamp-${i}`} className="absolute" style={{ left: `${left}%`, top: '4%' }}>
          <div style={{ width: 2, height: 26, background: '#533a2a' }} />
          <motion.div
            className="rounded-b-full"
            style={{ width: 22, height: 14, marginLeft: -10, background: '#ffc18b', boxShadow: '0 0 20px rgba(255,194,142,0.64)' }}
            animate={{ opacity: [0.56, 1, 0.56] }}
            transition={{ duration: 1.9 + i * 0.3, repeat: Infinity }}
          />
        </div>
      ))}

      {/* 카운터 */}
      <div
        className="absolute left-[8%] bottom-[23%] w-[84%]"
        style={{
          height: 52,
          background: 'linear-gradient(180deg, #8a5f43 0%, #65432f 100%)',
          borderTop: '3px solid #b38763',
          borderBottom: '3px solid #4a3022',
        }}
      />
      <div className="absolute left-[43%] bottom-[24.5%]" style={{ width: 120, height: 38, background: '#4e3326', border: '3px solid #b98d68' }}>
        <div className="absolute left-[12%] top-[24%]" style={{ width: 14, height: 10, background: '#f6e3cc' }} />
        <div className="absolute right-[12%] top-[24%]" style={{ width: 14, height: 10, background: '#f6e3cc' }} />
        <div className="absolute left-[18%] bottom-[16%]" style={{ width: 76, height: 5, background: '#cda57d' }} />
      </div>

      {/* 선반과 소품 */}
      <div className="absolute left-[14%] top-[34%]" style={{ width: 128, height: 6, background: '#6a4733' }} />
      <div className="absolute right-[14%] top-[34%]" style={{ width: 128, height: 6, background: '#6a4733' }} />
      {[16, 21, 26, 31].map((x, i) => (
        <div key={`cafe-jar-left-${i}`} className="absolute" style={{ left: `${x}%`, top: '30%', width: 10, height: 14, background: i === 1 ? '#f5d0a8' : '#d4b092', border: '1px solid #8f694d' }} />
      ))}
      {[64, 69, 74, 79].map((x, i) => (
        <div key={`cafe-jar-right-${i}`} className="absolute" style={{ left: `${x}%`, top: '30%', width: 10, height: 14, background: i === 2 ? '#e5c8ff' : '#d4b092', border: '1px solid #8f694d' }} />
      ))}

      {/* 데이트 테이블 포컬 */}
      <div className="absolute left-[30%] bottom-[13%]" style={{ width: '40%', height: 112 }}>
        <div style={{ width: '100%', height: 26, background: '#7c5239', border: '3px solid #4e3223', borderRadius: 8 }} />
        <div style={{ width: '92%', height: 15, margin: '8px auto 0', background: 'rgba(243,214,182,0.74)', borderRadius: 999 }} />
        <div style={{ position: 'absolute', left: '12%', top: 42, width: 13, height: 66, background: '#4e3223' }} />
        <div style={{ position: 'absolute', right: '12%', top: 42, width: 13, height: 66, background: '#4e3223' }} />
      </div>

      {/* 컵/케이크/꽃병 */}
      <div className="absolute left-[39%] bottom-[29%]">
        <PixelSprite grid={CUP_GRID} colorMap={CUP_COLORS} scale={3.6} />
      </div>
      <div className="absolute left-[52%] bottom-[29%]">
        <PixelSprite grid={CUP_GRID} colorMap={CUP_COLORS} scale={3.6} />
      </div>
      <div className="absolute left-[46%] bottom-[29%]">
        <div style={{ width: 24, height: 14, background: '#ffe0b0', border: '2px solid #c7a278', borderRadius: 3 }} />
        <div style={{ width: 30, height: 6, background: '#f4e7d6', borderRadius: 999, marginLeft: -3, marginTop: 1 }} />
      </div>
      <div className="absolute left-[58%] bottom-[29%]">
        <div style={{ width: 16, height: 18, background: 'rgba(208,230,245,0.74)', border: '2px solid rgba(170,204,224,0.94)', borderRadius: 4 }} />
        <motion.div
          className="rounded-full"
          style={{ width: 20, height: 14, marginLeft: -2, marginTop: -11, background: 'rgba(255,158,189,0.88)' }}
          animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.9, repeat: Infinity }}
        />
      </div>

      {/* 의자 실루엣 */}
      <div className="absolute left-[22%] bottom-[13%]" style={{ width: 52, height: 56, border: '3px solid #5a3a27', borderBottom: 'none' }} />
      <div className="absolute right-[22%] bottom-[13%]" style={{ width: 52, height: 56, border: '3px solid #5a3a27', borderBottom: 'none' }} />

      {/* 바닥 */}
      <div className="absolute bottom-0 left-0 w-full" style={{ height: '22%', background: 'linear-gradient(180deg, #7a563c 0%, #52362a 100%)' }} />
      {Array.from({ length: 14 }, (_, i) => (
        <div key={`cafe-floor-${i}`} className="absolute" style={{ bottom: 0, left: `${i * 7.2}%`, width: '7.2%', height: 14, background: i % 2 === 0 ? 'rgba(63,42,31,0.28)' : 'rgba(100,67,48,0.22)' }} />
      ))}

      {/* 증기 */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={`steam-${i}`}
          className="absolute rounded-full"
          style={{ left: `${39 + i * 5}%`, bottom: '42%', width: 5, height: 5, background: 'rgba(255,255,255,0.44)' }}
          animate={{ y: [-2, -30], x: [0, 4, -3, 0], opacity: [0.56, 0] }}
          transition={{ duration: 2 + i * 0.14, delay: i * 0.2, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* 보케 */}
      {bokeh.map((b) => (
        <motion.div
          key={`cafe-bokeh-${b.id}`}
          className="absolute rounded-full"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: b.size,
            height: b.size,
            background: 'radial-gradient(circle, rgba(255,227,188,0.62) 0%, rgba(255,205,157,0.1) 62%, transparent 100%)',
            opacity: b.alpha,
          }}
          animate={{ opacity: [b.alpha * 0.4, b.alpha, b.alpha * 0.4], scale: [0.86, 1.08, 0.86] }}
          transition={{ duration: 2.8 + (b.id % 4) * 0.34, delay: b.delay, repeat: Infinity }}
        />
      ))}

      {/* 공기 입자 */}
      {dust.map((d) => (
        <motion.div
          key={`cafe-dust-${d.id}`}
          className="absolute rounded-full"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size, background: 'rgba(255,222,178,0.66)' }}
          animate={{ opacity: [0.08, 0.68, 0.08], y: [0, -8, 0] }}
          transition={{ duration: 2.1 + (d.id % 4) * 0.45, delay: d.delay, repeat: Infinity }}
        />
      ))}
    </>
  );
}

function AnbandegiField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 140 }, (_, i) => ({
        id: i,
        x: ((i * 53 + 17) % 98) + 1,
        y: ((i * 31 + 13) % 66) + 1,
        size: 1.0 + ((i * 7) % 11) * 0.16,
        delay: ((i * 3) % 26) * 0.12,
        alpha: 0.42 + ((i * 5) % 9) * 0.055,
      })),
    [],
  );

  const glowStars = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: 6 + hash01(i * 17 + 3) * 88,
        y: 6 + hash01(i * 29 + 11) * 40,
        size: 1.9 + hash01(i * 43 + 7) * 1.8,
        delay: hash01(i * 61 + 13) * 2.4,
      })),
    [],
  );

  const meteorShower = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const seed = i + 1;
        const direction = hash01(seed * 37 + 5) > 0.5 ? 1 : -1;
        const dx = direction * (110 + hash01(seed * 41 + 7) * 130);
        const dy = 84 + hash01(seed * 53 + 11) * 88;
        const distance = Math.hypot(dx, dy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        return {
          id: i,
          x: -8 + hash01(seed * 17 + 3) * 116,
          y: -10 + hash01(seed * 23 + 9) * 60,
          size: 1.6 + hash01(seed * 61 + 13) * 0.8,
          tail: 34 + hash01(seed * 67 + 17) * 20,
          glow: 6 + hash01(seed * 71 + 19) * 4,
          delay: hash01(seed * 73 + 23) * 4.8,
          duration: 0.9 + hash01(seed * 79 + 29) * 0.55,
          repeatDelay: 2.2 + hash01(seed * 83 + 31) * 2.2,
          distance,
          angle,
        };
      }),
    [],
  );

  const majorMeteors = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => {
        const seed = i + 101;
        const direction = hash01(seed * 31 + 7) > 0.5 ? 1 : -1;
        const dx = direction * (170 + hash01(seed * 37 + 11) * 110);
        const dy = 118 + hash01(seed * 43 + 13) * 64;
        return {
          id: i,
          x: -6 + hash01(seed * 17 + 3) * 112,
          y: -12 + hash01(seed * 19 + 5) * 46,
          delay: hash01(seed * 47 + 17) * 8.5,
          duration: 1.2 + hash01(seed * 53 + 19) * 0.55,
          repeatDelay: 7.6 + hash01(seed * 59 + 23) * 2.6,
          size: 2.7 + hash01(seed * 61 + 29) * 0.9,
          tail: 58 + hash01(seed * 67 + 31) * 22,
          glow: 11 + hash01(seed * 71 + 37) * 4,
          distance: Math.hypot(dx, dy),
          angle: (Math.atan2(dy, dx) * 180) / Math.PI,
        };
      }).map((meteor, i) => ({
        id: i,
        x: meteor.x,
        y: meteor.y,
        delay: meteor.delay,
        duration: meteor.duration,
        repeatDelay: meteor.repeatDelay,
        size: meteor.size,
        tail: meteor.tail,
        glow: meteor.glow,
        distance: meteor.distance,
        angle: meteor.angle,
      })),
    [],
  );

  const grassGlow = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: 3 + ((i * 13) % 94),
        bottom: 16 + (i % 6) * 1.8,
        delay: i * 0.23,
      })),
    [],
  );

  return (
    <>
      {/* 하늘 비네팅/안개 */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 20%, rgba(72,108,186,0.2) 0%, rgba(16,25,57,0.25) 45%, rgba(5,10,27,0.55) 100%)',
          mixBlendMode: 'screen',
        }}
        animate={{ opacity: [0.5, 0.72, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 은하수 밴드 */}
      <motion.div
        className="absolute left-[-10%] top-[6%] w-[140%] h-[36%]"
        style={{
          background:
            'linear-gradient(115deg, transparent 0%, rgba(180, 205, 255, 0.07) 24%, rgba(255, 255, 255, 0.18) 46%, rgba(188, 214, 255, 0.09) 62%, transparent 100%)',
          filter: 'blur(7px)',
          transform: 'rotate(-9deg)',
        }}
        animate={{ opacity: [0.46, 0.78, 0.46] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-[-14%] top-[16%] w-[132%] h-[24%]"
        style={{
          background:
            'linear-gradient(110deg, transparent 0%, rgba(155, 185, 255, 0.05) 22%, rgba(220, 230, 255, 0.09) 44%, rgba(160, 186, 255, 0.05) 60%, transparent 100%)',
          filter: 'blur(9px)',
          transform: 'rotate(-8deg)',
        }}
        animate={{ opacity: [0.35, 0.58, 0.35], y: [0, -2, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 별 */}
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: '#ffffff',
            opacity: s.alpha,
            boxShadow: '0 0 3px rgba(255, 255, 255, 0.55)',
          }}
          animate={{
            opacity: [s.alpha * 0.4, s.alpha, s.alpha * 0.4],
            scale: [0.85, 1.2, 0.85],
          }}
          transition={{
            duration: 1.2 + s.size * 0.8,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* 밝은 별 */}
      {glowStars.map((s) => (
        <motion.div
          key={`glow-star-${s.id}`}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: '#f3f8ff',
            boxShadow: '0 0 10px rgba(190, 220, 255, 0.95)',
          }}
          animate={{
            opacity: [0.25, 1, 0.25],
            scale: [0.7, 1.35, 0.7],
            boxShadow: [
              '0 0 8px rgba(190, 220, 255, 0.55)',
              '0 0 14px rgba(215, 235, 255, 0.98)',
              '0 0 8px rgba(190, 220, 255, 0.55)',
            ],
          }}
          transition={{ duration: 1.8 + (s.id % 5) * 0.34, delay: s.delay, repeat: Infinity }}
        />
      ))}

      {/* 유성우 */}
      {meteorShower.map((meteor) => (
        <div
          key={`anbandegi-shower-${meteor.id}`}
          className="absolute pointer-events-none"
          style={{
            left: `${meteor.x}%`,
            top: `${meteor.y}%`,
            transform: `rotate(${meteor.angle}deg)`,
            transformOrigin: 'center',
          }}
        >
          <motion.div
            className="relative"
            style={{
              width: meteor.size,
              height: meteor.size,
              borderRadius: '50%',
              background: '#f8fbff',
              boxShadow: `0 0 ${meteor.glow}px rgba(235, 245, 255, 0.95)`,
            }}
            animate={{ x: [0, meteor.distance], opacity: [0, 0.95, 0.95, 0], scale: [0.8, 1, 1, 0.92] }}
            transition={{
              duration: meteor.duration,
              delay: meteor.delay,
              repeat: Infinity,
              repeatDelay: meteor.repeatDelay,
              ease: 'linear',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: -meteor.tail,
                top: meteor.size / 2 - 0.55,
                width: meteor.tail,
                height: 1.1,
                borderRadius: 999,
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(241,250,255,0.7) 72%, rgba(255,255,255,0.95) 100%)',
              }}
            />
          </motion.div>
        </div>
      ))}

      {/* 큰 유성 */}
      {majorMeteors.map((meteor) => (
        <div
          key={`anbandegi-major-${meteor.id}`}
          className="absolute pointer-events-none"
          style={{
            left: `${meteor.x}%`,
            top: `${meteor.y}%`,
            transform: `rotate(${meteor.angle}deg)`,
            transformOrigin: 'center',
          }}
        >
          <motion.div
            className="relative"
            style={{
              width: meteor.size,
              height: meteor.size,
              borderRadius: '50%',
              background: '#ffffff',
              boxShadow: `0 0 ${meteor.glow}px rgba(255,255,255,0.95)`,
            }}
            animate={{ x: [0, meteor.distance], opacity: [0, 1, 1, 0], scale: [0.84, 1, 1, 0.94] }}
            transition={{
              duration: meteor.duration,
              delay: meteor.delay,
              repeat: Infinity,
              repeatDelay: meteor.repeatDelay,
              ease: 'linear',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: -meteor.tail,
                top: meteor.size / 2 - 0.75,
                width: meteor.tail,
                height: 1.5,
                borderRadius: 999,
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(235,246,255,0.74) 74%, rgba(255,255,255,0.98) 100%)',
              }}
            />
          </motion.div>
        </div>
      ))}

      {/* 지평선 빛 */}
      <motion.div
        className="absolute bottom-[30%] left-[20%] w-[60%] h-[20%] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(157, 195, 255, 0.2) 0%, rgba(110, 150, 225, 0.06) 45%, transparent 80%)',
          filter: 'blur(8px)',
        }}
        animate={{ opacity: [0.3, 0.58, 0.3], scale: [0.96, 1.03, 0.96] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 안반데기 초원 실루엣 */}
      <div className="absolute bottom-0 left-0 w-full" style={{ height: '44%' }}>
        <div
          className="absolute bottom-0 left-[-8%]"
          style={{
            width: '42%',
            height: '50%',
            background: 'linear-gradient(180deg, #213d63 0%, #162d4e 100%)',
            borderRadius: '55% 45% 0 0',
            opacity: 0.78,
          }}
        />
        <div
          className="absolute bottom-0 left-[26%]"
          style={{
            width: '48%',
            height: '72%',
            background: 'linear-gradient(180deg, #2d4d79 0%, #1e365a 100%)',
            borderRadius: '52% 48% 0 0',
            opacity: 0.9,
          }}
        />
        <div
          className="absolute bottom-0 left-[58%]"
          style={{
            width: '36%',
            height: '54%',
            background: 'linear-gradient(180deg, #284768 0%, #1b314f 100%)',
            borderRadius: '64% 36% 0 0',
            opacity: 0.82,
          }}
        />
        <div
          className="absolute bottom-0 right-[-6%]"
          style={{
            width: '42%',
            height: '60%',
            background: 'linear-gradient(180deg, #203a61 0%, #122540 100%)',
            borderRadius: '58% 42% 0 0',
            opacity: 0.84,
          }}
        />
      </div>

      {/* 풀빛 하이라이트 */}
      {grassGlow.map((g) => (
        <motion.div
          key={`anbandegi-grass-${g.id}`}
          className="absolute"
          style={{
            left: `${g.left}%`,
            bottom: `${g.bottom}%`,
            width: 1.5,
            height: 5.5,
            background: 'linear-gradient(180deg, rgba(144,190,255,0.45) 0%, rgba(110,155,221,0.1) 100%)',
            borderRadius: 2,
          }}
          animate={{ opacity: [0.1, 0.45, 0.1], y: [0, -2, 0] }}
          transition={{ duration: 2.4 + (g.id % 5) * 0.3, delay: g.delay, repeat: Infinity }}
        />
      ))}

      {/* 풍력발전기 실루엣 (안반데기 상징) */}
      {[
        { left: '10%', bottom: '22%', scale: 1.55, towerH: 88, towerW: 5, rotor: 66, bladeH: 30, delay: 0 },
        { left: '44%', bottom: '26%', scale: 1.25, towerH: 76, towerW: 4, rotor: 56, bladeH: 26, delay: 0.65 },
        { left: '76%', bottom: '23%', scale: 1.45, towerH: 84, towerW: 4, rotor: 62, bladeH: 29, delay: 1.2 },
      ].map((w, i) => (
        <div
          key={`windmill-${i}`}
          className="absolute"
          style={{ left: w.left, bottom: w.bottom, transform: `scale(${w.scale})` }}
        >
          <div
            style={{
              width: w.towerW,
              height: w.towerH,
              background: 'linear-gradient(180deg, rgba(238,246,255,0.78) 0%, rgba(170,188,214,0.55) 100%)',
            }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{
              left: Math.floor(w.towerW / 2) - 1,
              top: -7,
              width: 3,
              height: 3,
              background: '#ffadad',
            }}
            animate={{ opacity: [0.25, 0.95, 0.25], boxShadow: ['0 0 2px #ffadad', '0 0 6px #ffadad', '0 0 2px #ffadad'] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: w.delay }}
          />
          <motion.div
            className="absolute"
            style={{
              left: -(w.rotor / 2 - w.towerW / 2),
              top: -(w.rotor * 0.45),
              width: w.rotor,
              height: w.rotor,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 5.4, repeat: Infinity, ease: 'linear', delay: w.delay }}
          >
            {[0, 120, 240].map((deg) => (
              <div
                key={deg}
                style={{
                  position: 'absolute',
                  left: w.rotor / 2 - 1.5,
                  top: 4,
                  width: 3,
                  height: w.bladeH,
                  background: 'linear-gradient(180deg, rgba(244,250,255,0.95) 0%, rgba(184,204,232,0.62) 100%)',
                  transformOrigin: `center ${w.bladeH - 2}px`,
                  transform: `rotate(${deg}deg)`,
                  borderRadius: 2,
                }}
              />
            ))}
          </motion.div>
          <div
            className="absolute rounded-full"
            style={{
              left: w.towerW / 2 - 2,
              top: -4,
              width: 5,
              height: 5,
              background: 'rgba(224, 239, 255, 0.85)',
            }}
          />
        </div>
      ))}
    </>
  );
}


function NightField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 72 }, (_, i) => ({
        id: i,
        x: 2 + hash01(i * 13 + 3) * 96,
        y: 4 + hash01(i * 17 + 7) * 60,
        size: 0.9 + hash01(i * 19 + 11) * 2.6,
        delay: hash01(i * 23 + 13) * 3.4,
        alpha: 0.24 + hash01(i * 29 + 17) * 0.7,
      })),
    [],
  );

  const fairyBulbs = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const lane = i < 16 ? 0 : 1;
        const idx = lane === 0 ? i : i - 16;
        const count = lane === 0 ? 16 : 14;
        return {
          id: i,
          lane,
          x: 4 + (idx * 92) / (count - 1),
          y: lane === 0 ? 9 + Math.sin(idx * 0.42) * 2.2 : 14 + Math.sin(idx * 0.44 + 0.8) * 2,
          delay: idx * 0.1 + lane * 0.25,
          warm: (i + lane) % 4 !== 0,
        };
      }),
    [],
  );

  const skyline = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: -2 + i * 6.1,
        width: 4 + (i % 5) * 1.8,
        height: 12 + ((i * 3) % 7) * 3.8,
      })),
    [],
  );

  const petals = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: 4 + hash01(i * 31 + 5) * 92,
        y: 34 + hash01(i * 37 + 11) * 26,
        drift: 12 + hash01(i * 41 + 13) * 16,
        delay: hash01(i * 43 + 17) * 2.8,
        duration: 4 + hash01(i * 47 + 19) * 2.4,
      })),
    [],
  );

  const fireflies = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: 8 + hash01(i * 59 + 7) * 84,
        y: 26 + hash01(i * 61 + 11) * 44,
        size: 3 + hash01(i * 67 + 13) * 5,
        delay: hash01(i * 71 + 17) * 2.2,
      })),
    [],
  );

  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(22,7,44,0.48) 0%, rgba(36,18,67,0.24) 45%, rgba(45,32,82,0.12) 100%)',
        }}
      />

      <motion.div
        className="absolute left-[-20%] top-[12%] w-[140%] h-[40%]"
        style={{
          background:
            'linear-gradient(110deg, transparent 0%, rgba(197,171,255,0.14) 28%, rgba(255,223,193,0.12) 50%, rgba(162,149,255,0.1) 64%, transparent 100%)',
          filter: 'blur(10px)',
          transform: 'rotate(-8deg)',
        }}
        animate={{ opacity: [0.34, 0.62, 0.34] }}
        transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-[-12%] top-[24%] w-[124%] h-[28%]"
        style={{
          background:
            'linear-gradient(102deg, transparent 0%, rgba(199,186,255,0.11) 36%, rgba(255,227,202,0.08) 54%, transparent 76%)',
          filter: 'blur(8px)',
          transform: 'rotate(-4deg)',
        }}
        animate={{ opacity: [0.22, 0.5, 0.22] }}
        transition={{ duration: 5.3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 별 */}
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: '#fff',
            opacity: s.alpha,
          }}
          animate={{ opacity: [s.alpha * 0.35, s.alpha, s.alpha * 0.35], scale: [0.82, 1.22, 0.82] }}
          transition={{ duration: 1.6 + s.size * 0.42, delay: s.delay, repeat: Infinity }}
        />
      ))}

      {/* 달 + 달무리 */}
      <motion.div
        className="absolute top-[7%] right-[8%] rounded-full"
        style={{
          width: 42,
          height: 42,
          background: 'radial-gradient(circle, rgba(255,243,210,0.95) 0%, rgba(255,214,156,0.88) 60%, rgba(255,182,128,0.55) 100%)',
          boxShadow: '0 0 30px rgba(255,232,188,0.62)',
        }}
        animate={{ scale: [0.96, 1.04, 0.96], opacity: [0.84, 1, 0.84] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className="absolute top-[2%] right-[3%] rounded-full"
        style={{
          width: 112,
          height: 112,
          background: 'radial-gradient(circle, rgba(255,227,173,0.18) 0%, rgba(255,205,146,0.06) 52%, transparent 78%)',
        }}
      />

      {/* 가랜드 조명 */}
      {fairyBulbs.map((bulb) => (
        <motion.div
          key={`proposal-bulb-${bulb.id}`}
          className="absolute rounded-full"
          style={{
            left: `${bulb.x}%`,
            top: `${bulb.y}%`,
            width: bulb.lane === 0 ? 4.8 : 4.2,
            height: bulb.lane === 0 ? 4.8 : 4.2,
            background: bulb.warm ? 'rgba(255,214,164,0.95)' : 'rgba(184,209,255,0.9)',
            boxShadow: bulb.warm
              ? '0 0 10px rgba(255,214,164,0.64)'
              : '0 0 9px rgba(184,209,255,0.6)',
          }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.7 + (bulb.id % 4) * 0.35, delay: bulb.delay, repeat: Infinity }}
        />
      ))}

      {/* 반딧불 광점 */}
      {fireflies.map((f) => (
        <motion.div
          key={`proposal-firefly-${f.id}`}
          className="absolute rounded-full"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: f.size,
            height: f.size,
            background: 'radial-gradient(circle, rgba(255,224,171,0.78) 0%, rgba(255,203,141,0.08) 68%, transparent 100%)',
          }}
          animate={{ opacity: [0.14, 0.54, 0.14], scale: [0.82, 1.12, 0.82], y: [0, -6, 0] }}
          transition={{ duration: 2.8 + (f.id % 3) * 0.5, delay: f.delay, repeat: Infinity }}
        />
      ))}

      {/* 원경 도시 */}
      <div className="absolute bottom-[31%] left-0 w-full" style={{ height: 46, opacity: 0.3 }}>
        {skyline.map((b) => (
          <div
            key={`proposal-skyline-${b.id}`}
            className="absolute"
            style={{
              left: `${b.x}%`,
              bottom: 0,
              width: b.width,
              height: b.height,
              background: '#222646',
            }}
          >
            {Array.from({ length: 2 + (b.id % 3) }).map((_, wi) => (
              <motion.div
                key={`window-${b.id}-${wi}`}
                style={{
                  width: 1.2,
                  height: 1.2,
                  marginTop: 1.6 + wi * 2.4,
                  marginLeft: 1.4 + ((wi + b.id) % 2) * 1.4,
                  background: 'rgba(255,215,150,0.86)',
                }}
                animate={{ opacity: [0.25, 0.82, 0.25] }}
                transition={{ duration: 2.4 + wi * 0.4, delay: b.id * 0.15, repeat: Infinity }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="absolute left-0 bottom-[29%] w-full h-[2px]" style={{ background: 'rgba(123, 109, 159, 0.48)' }} />
      <div className="absolute left-0 bottom-[28%] w-full h-[2px]" style={{ background: 'rgba(50, 38, 74, 0.55)' }} />
      {Array.from({ length: 24 }, (_, i) => (
        <div
          key={`proposal-rail-${i}`}
          className="absolute bottom-[28%]"
          style={{ left: `${i * 4.3}%`, width: 2, height: 12, background: 'rgba(90, 76, 126, 0.52)' }}
        />
      ))}

      {/* 무대 그라운드 */}
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{
          height: '36%',
          background:
            'linear-gradient(180deg, rgba(65,43,97,0.16) 0%, rgba(50,34,78,0.58) 44%, rgba(28,20,48,0.98) 100%)',
        }}
      />
      <div
        className="absolute bottom-[19%] left-[22%]"
        style={{
          width: '56%',
          height: '17%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(145,118,205,0.42) 0%, rgba(87,67,140,0.2) 52%, transparent 100%)',
          filter: 'blur(0.5px)',
        }}
      />

      {/* 플라워 아치 */}
      {[{ x: 17, flip: 1 }, { x: 83, flip: -1 }].map((arch, i) => (
        <div
          key={`proposal-arch-${i}`}
          className="absolute bottom-[22%]"
          style={{ left: `${arch.x}%`, width: 96, height: 110, transform: `translateX(-50%) scaleX(${arch.flip})` }}
        >
          <div style={{ position: 'absolute', left: 12, bottom: 0, width: 6, height: 88, background: '#57406f' }} />
          <div style={{ position: 'absolute', right: 12, bottom: 0, width: 6, height: 88, background: '#57406f' }} />
          <div style={{ position: 'absolute', left: 8, top: 4, width: 80, height: 38, borderRadius: '50%', border: '4px solid #6d518a', borderBottom: 'none' }} />
          {[0, 1, 2, 3, 4, 5].map((ci) => (
            <motion.div
              key={`proposal-arch-flower-${i}-${ci}`}
              className="absolute rounded-full"
              style={{
                left: 12 + ci * 12,
                top: 14 + (ci % 2) * 3,
                width: 10,
                height: 8,
                background: ci % 2 === 0 ? 'rgba(255,185,214,0.88)' : 'rgba(255,220,184,0.78)',
              }}
              animate={{ opacity: [0.56, 1, 0.56] }}
              transition={{ duration: 2 + ci * 0.2, repeat: Infinity }}
            />
          ))}
        </div>
      ))}

      {/* 부유 꽃잎 */}
      {petals.map((p) => (
        <motion.div
          key={`proposal-petal-${p.id}`}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: 2.8,
            height: 1.8,
            background: 'rgba(255,181,205,0.82)',
          }}
          animate={{
            x: [0, p.drift, p.drift * 0.35, 0],
            y: [0, -9, 5, 0],
            rotate: [0, 26, -16, 0],
            opacity: [0.2, 0.8, 0.3, 0.2],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* 링 박스 (프로포즈 스테이지) */}
      <div className="absolute bottom-[14%] left-1/2 -translate-x-1/2">
        <div style={{ width: 30, height: 20, background: '#4A2040', border: '2px solid #8B4080', borderRadius: 4 }}>
          <motion.div
            style={{ width: 11, height: 11, background: '#FFD700', borderRadius: '50%', margin: '2px auto' }}
            animate={{ boxShadow: ['0 0 6px #FFD700', '0 0 16px #FFD700', '0 0 6px #FFD700'], scale: [1, 1.16, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>

        {/* 링 박스 빛 */}
        <motion.div
          style={{
            position: 'absolute',
            top: -13,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,215,0,0.22) 0%, transparent 74%)',
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* 픽셀 반짝 별 */}
        <motion.div
          className="absolute"
          style={{ left: -18, top: -8 }}
          animate={{ opacity: [0.25, 0.95, 0.25], rotate: [0, 18, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <PixelSprite grid={STAR_GRID} colorMap={STAR_COLORS} scale={2} />
        </motion.div>
        <motion.div
          className="absolute"
          style={{ right: -20, top: -10 }}
          animate={{ opacity: [0.25, 0.95, 0.25], rotate: [0, -18, 0] }}
          transition={{ duration: 2.1, repeat: Infinity, delay: 0.4 }}
        >
          <PixelSprite grid={STAR_GRID} colorMap={STAR_COLORS} scale={2} />
        </motion.div>
      </div>
    </>
  );
}

const STAGE_BACKGROUNDS: Record<number, { gradient: string; Field: React.FC }> = {
  0: { gradient: 'linear-gradient(180deg, #a8dcff 0%, #b8f0cc 42%, #72c26e 72%, #2f7f3c 100%)', Field: ParkField },
  1: { gradient: 'linear-gradient(180deg, #6b4730 0%, #8a5c3d 34%, #b1835e 62%, #6a452f 100%)', Field: CafeField },
  2: { gradient: 'linear-gradient(180deg, #02040d 0%, #07122f 28%, #142347 60%, #102041 82%, #0b1733 100%)', Field: AnbandegiField },
  3: { gradient: 'linear-gradient(180deg, #120321 0%, #25103e 35%, #35285a 66%, #1f173f 100%)', Field: NightField },
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
  love: '\u2665',
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
  // ===== STAGE 1: 첫만남 =====
  {
    title: 'STAGE 1: 첫만남 (2021 봄)',
    brideEntrance: true,
    steps: [
      { type: 'dialog', speaker: 'SYSTEM', text: '2021년 봄, 첫 만남의 날.', groomEmotion: 'idle', brideEmotion: 'idle' },
      { type: 'dialog', speaker: 'SYSTEM', text: '수많은 사람 사이에서\n둘의 시선이 멈췄다.', groomEmotion: 'surprised' },
      { type: 'dialog', speaker: '김선경', text: '(저 사람... 생각보다 따뜻한 눈이다.)', brideEmotion: 'surprised' },
      { type: 'choice', prompt: '어떻게 하시겠습니까?', options: ['말을 건다', '도망친다'], escapeIdx: 1 },
      { type: 'dialog', speaker: '강태욱', text: '안녕하세요...\n강태욱입니다.', groomEmotion: 'nervous' },
      { type: 'dialog', speaker: 'SYSTEM', text: '(목소리가 살짝 떨렸다)', groomEmotion: 'nervous' },
      { type: 'dialog', speaker: '김선경', text: '안녕하세요, 김선경이에요.\n반가워요 :)', brideEmotion: 'happy' },
      { type: 'dialog', speaker: 'SYSTEM', text: '서로의 이름이\n마음속에 저장되었다.', groomEmotion: 'surprised', brideEmotion: 'happy' },
      { type: 'dialog', speaker: 'SYSTEM', text: '첫 페이지가 열렸다.', groomEmotion: 'love', brideEmotion: 'love' },
      { type: 'result', text: '첫만남 클리어!' },
    ],
  },
  // ===== STAGE 2: 썸 =====
  {
    title: 'STAGE 2: 썸 (2021.07)',
    steps: [
      { type: 'dialog', speaker: 'SYSTEM', text: '2021년 7월.\n썸 상태에 진입했다!', groomEmotion: 'surprised' },
      { type: 'effect', effectType: 'hp_drain' },
      { type: 'dialog', speaker: 'SYSTEM', text: '심박수 상승, 생각은 한 사람에게 고정.', groomEmotion: 'nervous' },
      { type: 'dialog', speaker: 'SYSTEM', text: '증상:\n- 카톡 알림 기다리기\n- 이유 없이 미소 짓기\n- 하루가 유난히 짧아짐', groomEmotion: 'happy' },
      { type: 'dialog', speaker: '김선경', text: '(나도 답장 오면 괜히 웃게 돼)', brideEmotion: 'nervous' },
      { type: 'dialog', speaker: 'SYSTEM', text: '첫 카페 데이트.\n서로 먼저 와서 긴장하고 있었다.', groomEmotion: 'nervous', brideEmotion: 'nervous' },
      { type: 'choice', prompt: '카톡이 왔다!', options: ['바로 답장한다', '쿨하게 참는다'], escapeIdx: 1 },
      { type: 'dialog', speaker: 'SYSTEM', text: '그날 밤, 서로의 하루 끝에\n서로가 있었다.', groomEmotion: 'happy', brideEmotion: 'happy' },
      { type: 'dialog', speaker: 'SYSTEM', text: '썸 게이지가 최고치에 도달했다!', groomEmotion: 'love', brideEmotion: 'love' },
      { type: 'result', text: '썸 클리어!' },
    ],
  },
  // ===== STAGE 3: 고백 =====
  {
    title: 'STAGE 3: 별빛 고백 (2021.09 안반데기)',
    steps: [
      { type: 'dialog', speaker: 'SYSTEM', text: '2021년 9월, 강원도 안반데기.', groomEmotion: 'idle' },
      { type: 'dialog', speaker: 'SYSTEM', text: '밤하늘에 별이 쏟아지고 있다.', groomEmotion: 'surprised', brideEmotion: 'surprised' },
      { type: 'dialog', speaker: '강태욱', text: '오늘 별이 정말 많다.\n그런데 내 눈에는 네가 더 선명해.', groomEmotion: 'nervous', brideEmotion: 'surprised' },
      { type: 'dialog', speaker: '김선경', text: '왜 이렇게 갑자기 진지해?\n...괜히 떨리네.', brideEmotion: 'nervous' },
      { type: 'choice', prompt: '별빛 아래, 뭐라고 말할까?', options: ['마음을 전한다', '조금 더 기다린다'], escapeIdx: 1 },
      { type: 'dialog', speaker: '강태욱', text: '이 밤을 너랑 오래 기억하고 싶어.\n우리... 사귈래?', groomEmotion: 'nervous', brideEmotion: 'surprised' },
      { type: 'dialog', speaker: 'SYSTEM', text: '잠시 바람이 멈추고\n별빛만 조용히 흔들렸다.', groomEmotion: 'surprised', brideEmotion: 'surprised' },
      { type: 'dialog', speaker: '김선경', text: '응.\n나도 같은 마음이야.', brideEmotion: 'love', groomEmotion: 'happy' },
      { type: 'effect', effectType: 'hearts' },
      { type: 'dialog', speaker: 'SYSTEM', text: '별빛 고백 성공!\n두 사람은 같은 하늘 아래 연인이 되었다.', groomEmotion: 'love', brideEmotion: 'love' },
      { type: 'result', text: '별빛 고백 클리어!' },
    ],
  },
  // ===== STAGE 4: 프로포즈 =====
  {
    title: 'STAGE 4: 프로포즈 (2026)',
    steps: [
      { type: 'dialog', speaker: 'SYSTEM', text: '2026년, 오래 준비한 순간이 왔다.', groomEmotion: 'nervous' },
      { type: 'dialog', speaker: 'SYSTEM', text: '손끝이 떨릴 만큼\n마음이 벅차오른다.', groomEmotion: 'nervous' },
      { type: 'dialog', speaker: 'SYSTEM', text: '아이템 사용: 영원의 반지', groomEmotion: 'nervous' },
      { type: 'dialog', speaker: 'SYSTEM', text: '심호흡...\n한 번 더 용기를 모았다.', groomEmotion: 'surprised', brideEmotion: 'surprised' },
      { type: 'dialog', speaker: '강태욱', text: '지금까지의 모든 계절을 지나\n이제는 평생을 약속하고 싶어.', groomEmotion: 'nervous', brideEmotion: 'happy' },
      { type: 'choice', prompt: '결혼해 주시겠습니까?', options: ['네!', '당연하지', '빨리 반지 줘', '이미 네!'] },
      { type: 'dialog', speaker: 'SYSTEM', text: '반짝이는 대답이 도착했다!', groomEmotion: 'happy', brideEmotion: 'happy' },
      { type: 'dialog', speaker: '김선경', text: '응, 당연하지.\n앞으로도 같이 가자.', brideEmotion: 'love', groomEmotion: 'love' },
      { type: 'effect', effectType: 'hearts' },
      { type: 'dialog', speaker: 'SYSTEM', text: '오래 사랑한 두 사람은\n더 오래 사랑하기로 했다.', groomEmotion: 'happy', brideEmotion: 'happy' },
      { type: 'dialog', speaker: 'SYSTEM', text: '프로포즈 대성공!', groomEmotion: 'love', brideEmotion: 'love' },
      { type: 'result', text: '프로포즈 클리어!' },
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
  const escapeResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 캐릭터 상태
  const [groomVisible] = useState(true);
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

  const heartBursts = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: 10 + hash01(stageIndex * 97 + i * 17 + 3) * 80,
        rise: 80 + hash01(stageIndex * 101 + i * 19 + 7) * 100,
        drift: (hash01(stageIndex * 107 + i * 23 + 11) - 0.5) * 60,
        duration: 1.5 + hash01(stageIndex * 109 + i * 29 + 13) * 0.5,
        delay: hash01(stageIndex * 113 + i * 31 + 17) * 0.5,
      })),
    [stageIndex],
  );

  const currentStep = script.steps[stepIdx];

  // 대사에 따른 감정 업데이트
  useEffect(() => {
    if (!currentStep) return;
    const timers: Array<ReturnType<typeof setTimeout>> = [];

    if (currentStep.type === 'dialog') {
      if (currentStep.groomEmotion) {
        const emotion = currentStep.groomEmotion;
        timers.push(setTimeout(() => setGroomEmotion(emotion), 0));
      }
      if (currentStep.brideEmotion) {
        const emotion = currentStep.brideEmotion;
        timers.push(setTimeout(() => setBrideEmotion(emotion), 0));
      }

      // Stage 1에서는 초반 대화가 시작되면 신부를 슬라이드 인
      if (script.brideEntrance && stepIdx >= 1 && !brideVisible) {
        timers.push(setTimeout(() => setBrideVisible(true), 300));
      }
    }

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [currentStep, stepIdx, script.brideEntrance, brideVisible]);

  // 감정 변화 시 말풍선 표시
  useEffect(() => {
    if (groomEmotion !== 'idle' && EMOTION_BUBBLES[groomEmotion]) {
      const bubble = EMOTION_BUBBLES[groomEmotion]!;
      const timer = setTimeout(() => setGroomBubble(bubble), 0);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [groomEmotion]);

  useEffect(() => {
    if (brideEmotion !== 'idle' && EMOTION_BUBBLES[brideEmotion]) {
      const bubble = EMOTION_BUBBLES[brideEmotion]!;
      const timer = setTimeout(() => setBrideBubble(bubble), 0);
      return () => clearTimeout(timer);
    }
    return undefined;
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
      const itemTimers: Array<ReturnType<typeof setTimeout>> = [];
      items.forEach((item, i) => {
        itemTimers.push(setTimeout(() => setShownItems((prev) => [...prev, item]), 600 * (i + 1)));
      });
      const timer = setTimeout(advanceStep, 2500);
      return () => {
        itemTimers.forEach((id) => clearTimeout(id));
        clearTimeout(timer);
      };
    }

    if (currentStep.effectType === 'hearts') {
      const startTimer = setTimeout(() => {
        setShowHearts(true);
        setGroomEmotion('love');
        setBrideEmotion('love');
      }, 0);
      const timer = setTimeout(advanceStep, 1500);
      return () => { clearTimeout(startTimer); clearTimeout(timer); };
    }
  }, [currentStep, advanceStep]);

  // 결과 -> STAGE CLEAR
  useEffect(() => {
    if (currentStep?.type === 'result') {
      const timer = setTimeout(() => setShowClear(true), 500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  useEffect(
    () => () => {
      if (escapeResetTimerRef.current) {
        clearTimeout(escapeResetTimerRef.current);
      }
    },
    [],
  );

  const handleChoice = (choiceIdx: number) => {
    if (!currentStep || currentStep.type !== 'choice') return;
    if (currentStep.escapeIdx !== undefined && choiceIdx === currentStep.escapeIdx) {
      setEscapeAttempt(true);
      setEscapeCount((prev) => prev + 1);
      if (escapeResetTimerRef.current) {
        clearTimeout(escapeResetTimerRef.current);
      }
      escapeResetTimerRef.current = setTimeout(() => setEscapeAttempt(false), 1200);
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
                <span className="font-['Press_Start_2P',monospace] text-[10px]" style={{ color: ARCADE_COLORS.text }}>HP</span>
                <span className="font-['Press_Start_2P',monospace] text-[10px]" style={{ color: hpPercent > 30 ? ARCADE_COLORS.green : ARCADE_COLORS.red }}>
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
                <span className="font-['Press_Start_2P',monospace] text-[10px]" style={{ color: ARCADE_COLORS.gold }}>
                  {item}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* 하트 폭발 */}
        {showHearts && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            {heartBursts.map((heart) => (
              <motion.span
                key={heart.id}
                className="absolute text-[16px] sm:text-[20px]"
                style={{ left: `${heart.left}%`, bottom: '10%', color: ARCADE_COLORS.pink }}
                initial={{ y: 0, opacity: 1, scale: 0.5 }}
                animate={{ y: -heart.rise, opacity: [1, 1, 0], scale: [0.5, 1.2, 0.8], x: heart.drift }}
                transition={{ duration: heart.duration, delay: heart.delay, ease: 'easeOut' }}
              >
                {'\u2665'}
              </motion.span>
            ))}
          </div>
        )}

        {/* 캐릭터 + 말풍선: 중앙 고정폭 레인으로 데스크톱/모바일 간격 일관화 */}
        <div className="absolute inset-x-0 z-[5] pointer-events-none" style={{ bottom: '5%' }}>
          <div className="mx-auto flex items-end justify-between" style={{ width: 'min(92vw, 440px)' }}>
            <div className="relative flex w-[116px] sm:w-[128px] items-end justify-center">
              <AnimatePresence>
                {groomVisible && (
                  <motion.div
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                  >
                    <PixelCharacter character="groom" size="full" scale={4} emotion={groomEmotion} />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {groomBubble && groomVisible && (
                  <motion.div
                    key={`groom-bubble-${groomBubble}`}
                    className="absolute z-10 left-1/2 -translate-x-1/2"
                    style={{ bottom: 96 }}
                  >
                    <SpeechBubble emoticon={groomBubble} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative flex w-[116px] sm:w-[128px] items-end justify-center">
              <AnimatePresence>
                {brideVisible && (
                  <motion.div
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 15, delay: script.brideEntrance ? 0.5 : 0 }}
                  >
                    <PixelCharacter character="bride" size="full" scale={4} emotion={brideEmotion} />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {brideBubble && brideVisible && (
                  <motion.div
                    key={`bride-bubble-${brideBubble}`}
                    className="absolute z-10 left-1/2 -translate-x-1/2"
                    style={{ bottom: 96 }}
                  >
                    <SpeechBubble emoticon={brideBubble} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
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
              다음으로
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

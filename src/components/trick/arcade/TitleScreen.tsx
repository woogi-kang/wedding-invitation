'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PixelCharacter } from './shared/PixelCharacter';

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

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

function createStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    speed: Math.random() * 0.3 + 0.1,
    opacity: Math.random() * 0.7 + 0.3,
  }));
}

interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  const [stars] = useState(() => createStars(60));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const starsRef = useRef(stars.map((s) => ({ ...s })));

  // Starfield animation on canvas for performance
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      for (const star of starsRef.current) {
        star.y = (star.y + star.speed * 0.05) % 100;
        const px = (star.x / 100) * w;
        const py = (star.y / 100) * h;

        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fillRect(Math.floor(px), Math.floor(py), star.size, star.size);
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  const handleStart = useCallback(() => {
    onStart();
  }, [onStart]);

  // Key press handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      handleStart();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleStart]);

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
      style={{ background: ARCADE_COLORS.bg }}
      onClick={handleStart}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleStart();
        }
      }}
      aria-label="Press to start the game"
    >
      {/* Starfield background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4">
        {/* Title */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center"
        >
          <motion.h1
            className="font-['Press_Start_2P',monospace] text-[24px] sm:text-[36px] md:text-[48px] leading-tight"
            style={{
              color: ARCADE_COLORS.gold,
              textShadow: `
                0 0 10px ${ARCADE_COLORS.gold}80,
                0 0 20px ${ARCADE_COLORS.gold}40,
                0 0 40px ${ARCADE_COLORS.gold}20,
                4px 4px 0px #b38f00
              `,
              imageRendering: 'pixelated',
            }}
            animate={{
              textShadow: [
                `0 0 10px ${ARCADE_COLORS.gold}80, 0 0 20px ${ARCADE_COLORS.gold}40, 0 0 40px ${ARCADE_COLORS.gold}20, 4px 4px 0px #b38f00`,
                `0 0 14px ${ARCADE_COLORS.gold}a0, 0 0 28px ${ARCADE_COLORS.gold}60, 0 0 50px ${ARCADE_COLORS.gold}30, 4px 4px 0px #b38f00`,
                `0 0 10px ${ARCADE_COLORS.gold}80, 0 0 20px ${ARCADE_COLORS.gold}40, 0 0 40px ${ARCADE_COLORS.gold}20, 4px 4px 0px #b38f00`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            WEDDING
            <br />
            QUEST
          </motion.h1>
        </motion.div>

        {/* Characters flanking subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex items-center gap-3 sm:gap-5"
        >
          <PixelCharacter character="groom" size="mini" scale={3} animate />
          <span
            className="font-['Press_Start_2P',monospace] text-[12px] sm:text-[16px]"
            style={{ color: ARCADE_COLORS.pink }}
          >
            {'♥'}
          </span>
          <PixelCharacter character="bride" size="mini" scale={3} animate />
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="w-48 sm:w-64 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${ARCADE_COLORS.gold}, transparent)` }}
        />

        {/* Press Start blinking */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ delay: 1.2, duration: 1.5, repeat: Infinity, times: [0, 0.1, 0.7, 1] }}
          className="font-['Press_Start_2P',monospace] text-[10px] sm:text-[14px] mt-8"
          style={{ color: ARCADE_COLORS.text }}
        >
          PRESS START
        </motion.p>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between items-end z-10">
        <span
          className="font-['Press_Start_2P',monospace] text-[7px] sm:text-[8px]"
          style={{ color: ARCADE_COLORS.gray }}
        >
          {'CREDIT: \u221E'}
        </span>
        <span
          className="font-['Press_Start_2P',monospace] text-[7px] sm:text-[8px]"
          style={{ color: ARCADE_COLORS.gray }}
        >
          &copy; 2026 LOVE STUDIO
        </span>
      </div>
    </div>
  );
}

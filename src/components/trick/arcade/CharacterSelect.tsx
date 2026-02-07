'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelCharacter } from './shared/PixelCharacter';
import { PixelButton } from './shared/PixelButton';

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

interface CharacterStats {
  name: string;
  englishName: string;
  className: string;
  stats: { label: string; value: number; color: string }[];
  specialAbility: string;
  equipment: string;
}

const GROOM_STATS: CharacterStats = {
  name: '강태욱',
  englishName: 'TAEWOOK',
  className: 'Developer',
  stats: [
    { label: 'STR', value: 75, color: ARCADE_COLORS.red },
    { label: 'INT', value: 95, color: ARCADE_COLORS.blue },
    { label: 'WIS', value: 80, color: ARCADE_COLORS.green },
    { label: 'CHA', value: 88, color: ARCADE_COLORS.pink },
    { label: 'LUK', value: 99, color: ARCADE_COLORS.gold },
  ],
  specialAbility: 'Debug of Love',
  equipment: 'Ring of Eternal Promise',
};

const BRIDE_STATS: CharacterStats = {
  name: '김선경',
  englishName: 'SEONGYEONG',
  className: 'Enchantress',
  stats: [
    { label: 'STR', value: 82, color: ARCADE_COLORS.red },
    { label: 'INT', value: 90, color: ARCADE_COLORS.blue },
    { label: 'WIS', value: 92, color: ARCADE_COLORS.green },
    { label: 'CHA', value: 99, color: ARCADE_COLORS.pink },
    { label: 'LUK', value: 95, color: ARCADE_COLORS.gold },
  ],
  specialAbility: 'Charm of Healing',
  equipment: 'Ring of Eternal Promise',
};

interface CharacterSelectProps {
  onComplete: () => void;
}

function StatBar({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  delay: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px] w-8 text-right"
        style={{ color: ARCADE_COLORS.gray }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-2.5 sm:h-3 relative"
        style={{ background: ARCADE_COLORS.darkGray, border: `1px solid ${ARCADE_COLORS.gray}40` }}
      >
        <motion.div
          className="h-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay, duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <span
        className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px] w-7"
        style={{ color }}
      >
        {value}
      </span>
    </div>
  );
}

function CharacterCard({
  character,
  side,
  baseDelay,
}: {
  character: CharacterStats;
  side: 'left' | 'right';
  baseDelay: number;
}) {
  return (
    <motion.div
      initial={{ x: side === 'left' ? -200 : 200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex-1 flex flex-col items-center gap-2 sm:gap-3 px-2 sm:px-4"
    >
      {/* Character pixel sprite */}
      <motion.div
        className="flex items-center justify-center"
        style={{
          filter: `drop-shadow(0 0 8px ${side === 'left' ? ARCADE_COLORS.blue : ARCADE_COLORS.pink}60)`,
        }}
        animate={{
          filter: [
            `drop-shadow(0 0 8px ${side === 'left' ? ARCADE_COLORS.blue : ARCADE_COLORS.pink}60)`,
            `drop-shadow(0 0 14px ${side === 'left' ? ARCADE_COLORS.blue : ARCADE_COLORS.pink}80)`,
            `drop-shadow(0 0 8px ${side === 'left' ? ARCADE_COLORS.blue : ARCADE_COLORS.pink}60)`,
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <PixelCharacter
          character={side === 'left' ? 'groom' : 'bride'}
          size="full"
          scale={3}
          animate
        />
      </motion.div>

      {/* Name */}
      <div className="text-center">
        <p
          className="font-['Press_Start_2P',monospace] text-[13px] sm:text-[18px]"
          style={{ color: ARCADE_COLORS.text }}
        >
          {character.englishName}
        </p>
        <p
          className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[12px] mt-0.5"
          style={{ color: ARCADE_COLORS.gray }}
        >
          {character.name}
        </p>
      </div>

      {/* Class */}
      <div
        className="px-2 py-0.5"
        style={{
          border: `1px solid ${side === 'left' ? ARCADE_COLORS.blue : ARCADE_COLORS.pink}`,
          background: `${side === 'left' ? ARCADE_COLORS.blue : ARCADE_COLORS.pink}20`,
        }}
      >
        <span
          className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px]"
          style={{ color: side === 'left' ? ARCADE_COLORS.blue : ARCADE_COLORS.pink }}
        >
          {character.className}
        </span>
      </div>

      {/* Stats */}
      <div className="w-full max-w-[240px] flex flex-col gap-1">
        {character.stats.map((stat, i) => (
          <StatBar
            key={stat.label}
            label={stat.label}
            value={stat.value}
            color={stat.color}
            delay={baseDelay + i * 0.15}
          />
        ))}
      </div>

      {/* Special ability */}
      <div className="text-center mt-1">
        <p
          className="font-['Press_Start_2P',monospace] text-[8px] sm:text-[9px]"
          style={{ color: ARCADE_COLORS.gray }}
        >
          SPECIAL
        </p>
        <p
          className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px]"
          style={{ color: ARCADE_COLORS.gold }}
        >
          {character.specialAbility}
        </p>
      </div>

      {/* Equipment */}
      <div className="text-center">
        <p
          className="font-['Press_Start_2P',monospace] text-[8px] sm:text-[9px]"
          style={{ color: ARCADE_COLORS.gray }}
        >
          EQUIP
        </p>
        <p
          className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px]"
          style={{ color: ARCADE_COLORS.green }}
        >
          {character.equipment}
        </p>
      </div>
    </motion.div>
  );
}

export function CharacterSelect({ onComplete }: CharacterSelectProps) {
  const [phase, setPhase] = useState<'entering' | 'vs' | 'heart' | 'formed'>('entering');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('vs'), 1500),
      setTimeout(() => setPhase('heart'), 2800),
      setTimeout(() => setPhase('formed'), 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-2"
      style={{ background: ARCADE_COLORS.bg }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 sm:mb-6"
      >
        <p
          className="font-['Press_Start_2P',monospace] text-[12px] sm:text-[16px] text-center"
          style={{ color: ARCADE_COLORS.gold }}
        >
          CHARACTER SELECT
        </p>
      </motion.div>

      {/* Character cards */}
      <div className="w-full max-w-2xl flex items-start justify-center gap-2 sm:gap-4">
        <CharacterCard character={GROOM_STATS} side="left" baseDelay={0.6} />

        {/* Center VS / Heart */}
        <div className="flex-shrink-0 flex items-center justify-center w-12 sm:w-16 pt-10 sm:pt-14">
          <AnimatePresence mode="wait">
            {phase === 'entering' && (
              <motion.span
                key="vs"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0, rotate: 180 }}
                className="font-['Press_Start_2P',monospace] text-[16px] sm:text-[24px]"
                style={{
                  color: ARCADE_COLORS.red,
                  textShadow: `0 0 8px ${ARCADE_COLORS.red}80`,
                }}
              >
                VS
              </motion.span>
            )}
            {phase === 'vs' && (
              <motion.span
                key="vs-still"
                initial={{ scale: 1 }}
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 10, -10, 0],
                }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.6 }}
                className="font-['Press_Start_2P',monospace] text-[16px] sm:text-[24px]"
                style={{
                  color: ARCADE_COLORS.red,
                  textShadow: `0 0 8px ${ARCADE_COLORS.red}80`,
                }}
              >
                VS
              </motion.span>
            )}
            {phase === 'heart' && (
              <motion.span
                key="heart"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: [0, 1.6, 1], rotate: 0 }}
                exit={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[24px] sm:text-[36px]"
                style={{
                  color: ARCADE_COLORS.pink,
                  textShadow: `0 0 12px ${ARCADE_COLORS.pink}80`,
                }}
              >
                {'♥'}
              </motion.span>
            )}
            {phase === 'formed' && (
              <motion.span
                key="heart-pulse"
                animate={{
                  scale: [1, 1.15, 1],
                }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-[24px] sm:text-[36px]"
                style={{
                  color: ARCADE_COLORS.pink,
                  textShadow: `0 0 12px ${ARCADE_COLORS.pink}80`,
                }}
              >
                {'♥'}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <CharacterCard character={BRIDE_STATS} side="right" baseDelay={0.8} />
      </div>

      {/* Party formed banner */}
      <AnimatePresence>
        {phase === 'formed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="mt-6 sm:mt-8 text-center"
          >
            <p
              className="font-['Press_Start_2P',monospace] text-[16px] sm:text-[24px]"
              style={{
                color: ARCADE_COLORS.gold,
                textShadow: `0 0 8px ${ARCADE_COLORS.gold}60, 0 0 16px ${ARCADE_COLORS.gold}30`,
              }}
            >
              PARTY FORMED!
            </p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-2 h-[2px] w-48 sm:w-64 mx-auto"
              style={{ background: `linear-gradient(90deg, transparent, ${ARCADE_COLORS.gold}, transparent)` }}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-5"
            >
              <PixelButton variant="primary" size="md" onClick={onComplete}>
                TAP TO CONTINUE
              </PixelButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

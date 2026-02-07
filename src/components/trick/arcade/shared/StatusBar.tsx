'use client';

import { motion } from 'framer-motion';
import { ARCADE_COLORS } from './RetroText';

interface StatusBarProps {
  label: string;
  current: number;
  max: number;
  color?: string;
  animateDelay?: number;
}

/**
 * HP/MP/EXP bar component with animated fill.
 * Displays label, colored progress bar, and current/max values.
 */
export function StatusBar({
  label,
  current,
  max,
  color = ARCADE_COLORS.green,
  animateDelay = 0,
}: StatusBarProps) {
  const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0;

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Label */}
      <span
        className="font-['Press_Start_2P',monospace] text-[10px] sm:text-[13px] w-8 sm:w-10 shrink-0 text-right"
        style={{ color: ARCADE_COLORS.text }}
      >
        {label}
      </span>

      {/* Bar container */}
      <div
        className="flex-1 h-3 sm:h-4 relative"
        style={{
          background: ARCADE_COLORS.darkGray,
          border: `1px solid ${ARCADE_COLORS.gray}`,
          imageRendering: 'pixelated',
        }}
      >
        {/* Fill bar */}
        <motion.div
          className="absolute inset-0"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.8,
            delay: animateDelay,
            ease: 'easeOut',
          }}
          style={{
            background: color,
            boxShadow: `inset 0 -2px 0 rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)`,
          }}
        />

        {/* Segmented overlay for pixel feel */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 3px,
              rgba(0, 0, 0, 0.15) 3px,
              rgba(0, 0, 0, 0.15) 4px
            )`,
          }}
        />
      </div>

      {/* Values */}
      <span
        className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px] w-16 sm:w-20 shrink-0"
        style={{ color: ARCADE_COLORS.text }}
      >
        {current}/{max}
      </span>
    </div>
  );
}

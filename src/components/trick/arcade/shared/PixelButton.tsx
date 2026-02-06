'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ARCADE_COLORS } from './RetroText';

const VARIANT_STYLES = {
  primary: {
    bg: ARCADE_COLORS.gold,
    text: '#000000',
    shadow: '#b38f00',
    hover: '#ffe033',
  },
  secondary: {
    bg: ARCADE_COLORS.gray,
    text: '#ffffff',
    shadow: '#5a5a5a',
    hover: '#a0a0a0',
  },
  danger: {
    bg: ARCADE_COLORS.red,
    text: '#ffffff',
    shadow: '#b30000',
    hover: '#ff6666',
  },
  love: {
    bg: ARCADE_COLORS.pink,
    text: '#ffffff',
    shadow: '#cc3370',
    hover: '#ff8db8',
  },
} as const;

const SIZE_STYLES = {
  sm: {
    padding: '6px 12px',
    fontSize: '8px',
    shadowOffset: 3,
  },
  md: {
    padding: '10px 20px',
    fontSize: '10px',
    shadowOffset: 4,
  },
  lg: {
    padding: '14px 28px',
    fontSize: '12px',
    shadowOffset: 5,
  },
} as const;

type ButtonVariant = keyof typeof VARIANT_STYLES;
type ButtonSize = keyof typeof SIZE_STYLES;

interface PixelButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * 8-bit styled button with pixel-art border and press animation.
 * Supports primary (gold), secondary (gray), danger (red), and love (pink) variants.
 */
export function PixelButton({
  variant = 'primary',
  size = 'md',
  children,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
}: PixelButtonProps) {
  const colors = VARIANT_STYLES[variant];
  const sizeConfig = SIZE_STYLES[size];
  const offset = sizeConfig.shadowOffset;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : {
        y: offset - 1,
      }}
      className={`
        relative inline-block cursor-pointer select-none
        font-['Press_Start_2P',monospace]
        transition-colors duration-100
        disabled:opacity-40 disabled:cursor-not-allowed
        ${className}
      `}
      style={{
        padding: sizeConfig.padding,
        fontSize: sizeConfig.fontSize,
        color: colors.text,
        background: disabled ? ARCADE_COLORS.darkGray : colors.bg,
        border: `2px solid ${disabled ? ARCADE_COLORS.gray : colors.text === '#000000' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)'}`,
        boxShadow: disabled
          ? 'none'
          : `
            ${offset}px ${offset}px 0px ${colors.shadow},
            inset -1px -1px 0px rgba(0,0,0,0.2),
            inset 1px 1px 0px rgba(255,255,255,0.2)
          `,
        imageRendering: 'pixelated' as const,
      }}
    >
      {/* Hover glow overlay */}
      <motion.span
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: disabled ? 0 : 0.15 }}
        style={{
          background: '#ffffff',
          mixBlendMode: 'overlay',
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

'use client';

import { ReactNode } from 'react';

// Retro RPG color palette
export const ARCADE_COLORS = {
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

type ArcadeColor = keyof typeof ARCADE_COLORS;

const SIZE_MAP = {
  xs: 'text-[8px] leading-[12px]',
  sm: 'text-[10px] leading-[14px]',
  md: 'text-[12px] leading-[18px]',
  lg: 'text-[16px] leading-[22px]',
  xl: 'text-[20px] leading-[28px]',
} as const;

interface RetroTextProps {
  children: ReactNode;
  color?: ArcadeColor;
  size?: keyof typeof SIZE_MAP;
  glow?: boolean;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'div';
}

/**
 * Utility component for pixelated text styling.
 * Applies "Press Start 2P" font with optional glow effects.
 */
export function RetroText({
  children,
  color = 'text',
  size = 'md',
  glow = false,
  className = '',
  as: Tag = 'span',
}: RetroTextProps) {
  const colorValue = ARCADE_COLORS[color];
  const sizeClass = SIZE_MAP[size];

  const glowStyle = glow
    ? {
        textShadow: `0 0 4px ${colorValue}, 0 0 8px ${colorValue}, 0 0 16px ${colorValue}`,
      }
    : {};

  return (
    <Tag
      className={`font-['Press_Start_2P',monospace] ${sizeClass} ${className}`}
      style={{
        color: colorValue,
        imageRendering: 'pixelated' as const,
        ...glowStyle,
      }}
    >
      {children}
    </Tag>
  );
}

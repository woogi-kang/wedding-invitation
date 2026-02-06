'use client';

import { ReactNode } from 'react';
import { ARCADE_COLORS } from './RetroText';

interface PixelBorderProps {
  children: ReactNode;
  variant?: 'window' | 'simple' | 'none';
  title?: string;
  className?: string;
}

/**
 * Wrapper component that adds pixel-art border to any content.
 * Uses CSS box-shadow technique to create chunky pixel borders.
 */
export function PixelBorder({
  children,
  variant = 'window',
  title,
  className = '',
}: PixelBorderProps) {
  if (variant === 'none') {
    return <div className={className}>{children}</div>;
  }

  if (variant === 'simple') {
    return (
      <div
        className={`relative ${className}`}
        style={{
          border: `2px solid ${ARCADE_COLORS.gray}`,
          imageRendering: 'pixelated',
        }}
      >
        {children}
      </div>
    );
  }

  // variant === 'window' (full RPG window)
  return (
    <div
      className={`relative ${className}`}
      style={{
        background: ARCADE_COLORS.bg,
        border: `3px solid ${ARCADE_COLORS.gray}`,
        boxShadow: `
          inset 2px 2px 0px ${ARCADE_COLORS.darkGray},
          inset -2px -2px 0px ${ARCADE_COLORS.darkGray},
          4px 4px 0px rgba(0, 0, 0, 0.5),
          inset 0 0 0 1px rgba(255, 255, 255, 0.1)
        `,
        imageRendering: 'pixelated',
      }}
    >
      {/* Title bar */}
      {title && (
        <div
          className="px-3 py-1.5 border-b-2 flex items-center"
          style={{
            borderColor: ARCADE_COLORS.gray,
            background: `linear-gradient(180deg, ${ARCADE_COLORS.bgLight} 0%, ${ARCADE_COLORS.bg} 100%)`,
          }}
        >
          <span
            className="font-['Press_Start_2P',monospace] text-[10px]"
            style={{ color: ARCADE_COLORS.gold }}
          >
            {title}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-3">
        {children}
      </div>
    </div>
  );
}

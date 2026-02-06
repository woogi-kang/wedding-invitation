'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ARCADE_COLORS } from './RetroText';

interface MenuOption {
  label: string;
  disabled?: boolean;
}

interface MenuBoxProps {
  options: MenuOption[];
  onSelect: (index: number) => void;
  columns?: 1 | 2;
}

/**
 * RPG command/selection menu with keyboard and touch support.
 * Displays a list of selectable options with animated cursor indicator.
 */
export function MenuBox({
  options,
  onSelect,
  columns = 1,
}: MenuBoxProps) {
  const [selectedIndex, setSelectedIndex] = useState(() => {
    // Start at the first non-disabled option
    const firstEnabled = options.findIndex((o) => !o.disabled);
    return firstEnabled >= 0 ? firstEnabled : 0;
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Find the next enabled option in a given direction
  const findNextEnabled = useCallback(
    (from: number, direction: 1 | -1): number => {
      let next = from + direction;
      const len = options.length;
      // Wrap around once
      for (let i = 0; i < len; i++) {
        if (next < 0) next = len - 1;
        if (next >= len) next = 0;
        if (!options[next].disabled) return next;
        next += direction;
      }
      return from;
    },
    [options],
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => findNextEnabled(prev, -1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => findNextEnabled(prev, 1));
          break;
        case 'ArrowLeft':
          if (columns === 2) {
            e.preventDefault();
            setSelectedIndex((prev) => findNextEnabled(prev, -1));
          }
          break;
        case 'ArrowRight':
          if (columns === 2) {
            e.preventDefault();
            setSelectedIndex((prev) => findNextEnabled(prev, 1));
          }
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (!options[selectedIndex]?.disabled) {
            onSelect(selectedIndex);
          }
          break;
      }
    },
    [selectedIndex, options, onSelect, findNextEnabled, columns],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Focus on mount for keyboard accessibility
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const gridClass = columns === 2
    ? 'grid grid-cols-2 gap-x-4 gap-y-1'
    : 'flex flex-col gap-1';

  return (
    <div
      ref={containerRef}
      className={`p-3 sm:p-4 outline-none ${gridClass}`}
      style={{
        background: ARCADE_COLORS.bg,
        border: `3px solid ${ARCADE_COLORS.gray}`,
        boxShadow: `
          inset 2px 2px 0px ${ARCADE_COLORS.darkGray},
          inset -2px -2px 0px ${ARCADE_COLORS.darkGray},
          4px 4px 0px rgba(0, 0, 0, 0.5)
        `,
        imageRendering: 'pixelated',
      }}
      role="listbox"
      tabIndex={0}
      aria-label="Menu selection"
    >
      {options.map((option, index) => {
        const isSelected = index === selectedIndex;
        const isDisabled = option.disabled;

        return (
          <div
            key={index}
            role="option"
            aria-selected={isSelected}
            aria-disabled={isDisabled}
            className={`
              flex items-center gap-2 px-2 py-1.5 cursor-pointer transition-colors
              ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}
            `}
            onClick={() => {
              if (!isDisabled) {
                setSelectedIndex(index);
                onSelect(index);
              }
            }}
            onMouseEnter={() => {
              if (!isDisabled) setSelectedIndex(index);
            }}
          >
            {/* Cursor indicator */}
            <span
              className="font-['Press_Start_2P',monospace] text-[10px] sm:text-[12px] w-4"
              style={{
                color: isSelected ? ARCADE_COLORS.gold : 'transparent',
              }}
            >
              {isSelected && (
                <motion.span
                  initial={{ x: -2 }}
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  {'\u25B6'}
                </motion.span>
              )}
            </span>

            {/* Option label */}
            <span
              className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[11px]"
              style={{
                color: isDisabled
                  ? ARCADE_COLORS.gray
                  : isSelected
                    ? ARCADE_COLORS.gold
                    : ARCADE_COLORS.text,
              }}
            >
              {option.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

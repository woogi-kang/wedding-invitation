'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ARCADE_COLORS } from './RetroText';

interface DialogLine {
  speaker: string;
  text: string;
}

interface DialogBoxProps {
  /** Single speaker name (used with single text prop) */
  speaker?: string;
  /** Single text line (used with speaker prop) */
  text?: string;
  /** Array of dialog lines for multi-line conversations */
  lines?: DialogLine[];
  /** Called when all dialog lines have been shown */
  onComplete?: () => void;
  /** Typing speed in milliseconds per character */
  speed?: number;
}

/**
 * RPG dialog box that appears at the bottom of the screen.
 * Supports typing animation, multi-line conversations, and click-to-advance.
 */
export function DialogBox({
  speaker,
  text,
  lines,
  onComplete,
  speed = 40,
}: DialogBoxProps) {
  // Normalize into a dialog lines array
  const dialogLines: DialogLine[] = lines
    ? lines
    : speaker && text
      ? [{ speaker, text }]
      : [];

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const charIndexRef = useRef(0);

  const currentLine = dialogLines[currentLineIndex];
  const isLastLine = currentLineIndex >= dialogLines.length - 1;

  // Type out the current line character by character
  useEffect(() => {
    if (!currentLine) return;

    // Reset for the new line
    let cancelled = false;
    charIndexRef.current = 0;
    setDisplayedText('');
    setTypingDone(false);

    const typeNextChar = () => {
      if (cancelled) return;
      if (charIndexRef.current < currentLine.text.length) {
        const nextIndex = charIndexRef.current + 1;
        charIndexRef.current = nextIndex;
        setDisplayedText(currentLine.text.slice(0, nextIndex));
        timerRef.current = setTimeout(typeNextChar, speed);
      } else {
        setTypingDone(true);
      }
    };

    timerRef.current = setTimeout(typeNextChar, speed);

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLineIndex, speed]);

  const handleClick = useCallback(() => {
    if (!currentLine) return;

    if (!typingDone) {
      // Speed up: show full text immediately
      if (timerRef.current) clearTimeout(timerRef.current);
      setDisplayedText(currentLine.text);
      charIndexRef.current = currentLine.text.length;
      setTypingDone(true);
    } else if (!isLastLine) {
      // Advance to next line
      setCurrentLineIndex((prev) => prev + 1);
    } else {
      // All lines shown
      onComplete?.();
    }
  }, [typingDone, isLastLine, currentLine, onComplete]);

  if (!currentLine) return null;

  return (
    <div
      className="w-full cursor-pointer select-none"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Dialog box - click to advance"
    >
      <div
        className="relative w-full px-4 py-3 sm:px-6 sm:py-4"
        style={{
          background: 'rgba(0, 0, 0, 0.85)',
          border: `3px solid ${ARCADE_COLORS.gray}`,
          boxShadow: `
            inset 2px 2px 0px ${ARCADE_COLORS.darkGray},
            inset -2px -2px 0px ${ARCADE_COLORS.darkGray},
            0 0 0 1px rgba(255, 255, 255, 0.1),
            0 -4px 20px rgba(0, 0, 0, 0.5)
          `,
          imageRendering: 'pixelated',
        }}
      >
        {/* Speaker name label */}
        <div
          className="absolute -top-3.5 left-4 px-2 py-0.5"
          style={{
            background: ARCADE_COLORS.bg,
            border: `2px solid ${ARCADE_COLORS.gray}`,
          }}
        >
          <span
            className="font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px]"
            style={{ color: ARCADE_COLORS.gold }}
          >
            {currentLine.speaker}
          </span>
        </div>

        {/* Dialog text with typing effect */}
        <p
          className="font-['Press_Start_2P',monospace] text-[10px] sm:text-[12px] leading-[18px] sm:leading-[22px] mt-2 min-h-[44px] sm:min-h-[54px] whitespace-pre-wrap"
          style={{ color: ARCADE_COLORS.text }}
        >
          {displayedText}
        </p>

        {/* Blinking triangle indicator */}
        <AnimatePresence>
          {typingDone && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="absolute bottom-2 right-4 font-['Press_Start_2P',monospace] text-[10px]"
              style={{ color: ARCADE_COLORS.text }}
            >
              {isLastLine ? '  ' : '\u25BC'}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

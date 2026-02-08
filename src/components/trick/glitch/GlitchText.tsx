'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchInterval?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`アイウエオカキクケコ01';

export function GlitchText({
  text,
  className = '',
  glitchInterval = 3000,
  as: Component = 'span',
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const glitch = useCallback(() => {
    if (shouldReduceMotion) return;

    setIsGlitching(true);

    // Random character replacement
    const glitchedText = text
      .split('')
      .map((char) =>
        Math.random() > 0.7
          ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
          : char
      )
      .join('');

    setDisplayText(glitchedText);

    // Quick recovery
    setTimeout(() => {
      setDisplayText(text);
      setIsGlitching(false);
    }, 100);
  }, [text, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayText(text);
      return;
    }

    const interval = setInterval(glitch, glitchInterval);
    return () => clearInterval(interval);
  }, [glitch, glitchInterval, shouldReduceMotion, text]);

  return (
    <Component
      className={`relative inline-block ${className}`}
      style={{
        textShadow: isGlitching
          ? '-1px 0 #ff0080, 1px 0 #00d4ff'
          : 'none',
      }}
    >
      {/* Base text */}
      <span className="relative z-10">{displayText}</span>

      {/* Glitch layers (only during glitch) */}
      {isGlitching && !shouldReduceMotion && (
        <>
          <motion.span
            className="absolute inset-0 text-[#ff0080] opacity-70 z-0"
            animate={{ x: [-2, 2, -2] }}
            transition={{ duration: 0.1 }}
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}
          >
            {displayText}
          </motion.span>
          <motion.span
            className="absolute inset-0 text-[#00d4ff] opacity-70 z-0"
            animate={{ x: [2, -2, 2] }}
            transition={{ duration: 0.1 }}
            style={{ clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)' }}
          >
            {displayText}
          </motion.span>
        </>
      )}
    </Component>
  );
}

// Typing glitch effect for hero sections
interface TypingGlitchProps {
  lines: string[];
  typingSpeed?: number;
  lineDelay?: number;
  onComplete?: () => void;
}

export function TypingGlitch({
  lines,
  typingSpeed = 30,
  lineDelay = 200,
  onComplete,
}: TypingGlitchProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayedLines(lines);
      setIsComplete(true);
      onComplete?.();
      return;
    }

    if (currentLine >= lines.length) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    const line = lines[currentLine];

    if (currentChar < line.length) {
      const timer = setTimeout(() => {
        setCurrentChar((prev) => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, line]);
        setCurrentLine((prev) => prev + 1);
        setCurrentChar(0);
      }, lineDelay);
      return () => clearTimeout(timer);
    }
  }, [currentLine, currentChar, lines, typingSpeed, lineDelay, onComplete, shouldReduceMotion]);

  const currentTypingLine = !isComplete && currentLine < lines.length
    ? lines[currentLine].slice(0, currentChar)
    : null;

  return (
    <div className="font-mono">
      {displayedLines.map((line, i) => (
        <div key={i} className="min-h-[1.5em]">
          {line.startsWith('[✓]') ? (
            <span className="text-white font-medium">{line}</span>
          ) : line.startsWith('>') || line.startsWith('→') ? (
            <span className="text-[#00ff41]">{line}</span>
          ) : (
            <span className="text-[#00ff41]/80">{line}</span>
          )}
        </div>
      ))}
      {currentTypingLine !== null && (
        <div className="min-h-[1.5em]">
          <span className="text-[#00ff41]">{currentTypingLine}</span>
          <span className="animate-pulse">▊</span>
        </div>
      )}
    </div>
  );
}

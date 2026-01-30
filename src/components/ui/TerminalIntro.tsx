'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface TerminalIntroProps {
  onEnter: () => void;
}

interface TerminalLine {
  text: string;
  type: 'command' | 'output' | 'highlight' | 'empty' | 'progress';
  delay?: number;
}

const TERMINAL_LINES: TerminalLine[] = [
  { text: '> Initializing wedding.exe...', type: 'command' },
  { text: '> Loading memories...', type: 'command' },
  { text: 'PROGRESS', type: 'progress' },
  { text: '', type: 'empty' },
  { text: '╔══════════════════════════════╗', type: 'output' },
  { text: '║    WEDDING INVITATION v1.0   ║', type: 'highlight' },
  { text: '╚══════════════════════════════╝', type: 'output' },
  { text: '', type: 'empty' },
  { text: '> 신랑: 강태욱 (Taewook)', type: 'output' },
  { text: '> 신부: 김선경 (Seongyeong)', type: 'output' },
  { text: '', type: 'empty' },
  { text: '> 날짜: 2026.04.05 (일요일)', type: 'output' },
  { text: '> 시간: 14:10:00', type: 'output' },
  { text: '> 장소: 라마다 서울 신도림 호텔', type: 'output' },
  { text: '', type: 'empty' },
  { text: '════════════════════════════════', type: 'output' },
  { text: '', type: 'empty' },
  { text: '두 사람의 새로운 시작에', type: 'highlight' },
  { text: '함께 해주시겠습니까?', type: 'highlight' },
];

// Typing speed (ms per character)
const TYPING_SPEED = 30;
const LINE_DELAY = 150;

export function TerminalIntro({ onEnter }: TerminalIntroProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [isSkipped, setIsSkipped] = useState(false);

  // Refs for timeout cleanup to prevent memory leaks
  const buttonTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (buttonTimeoutRef.current) {
        clearTimeout(buttonTimeoutRef.current);
      }
    };
  }, []);

  // Skip animation for users who prefer reduced motion
  useEffect(() => {
    if (shouldReduceMotion && !isTypingComplete) {
      const allLines = TERMINAL_LINES.map(line =>
        line.type === 'progress' ? '> [████████████████] 100%' : line.text
      );
      setDisplayedLines(allLines);
      setCurrentLineIndex(TERMINAL_LINES.length);
      setIsTypingComplete(true);
      setShowButton(true);
    }
  }, [shouldReduceMotion, isTypingComplete]);

  // Skip animation on tap
  const handleSkip = useCallback(() => {
    if (isTypingComplete) return;

    setIsSkipped(true);
    const allLines = TERMINAL_LINES.map(line =>
      line.type === 'progress' ? '> [████████████████] 100%' : line.text
    );
    setDisplayedLines(allLines);
    setCurrentLineIndex(TERMINAL_LINES.length);
    setIsTypingComplete(true);
    buttonTimeoutRef.current = setTimeout(() => setShowButton(true), 300);
  }, [isTypingComplete]);

  // Keyboard support for accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSkip();
    }
  }, [handleSkip]);

  // Typing animation
  useEffect(() => {
    if (isSkipped || currentLineIndex >= TERMINAL_LINES.length) {
      if (!isSkipped) {
        setIsTypingComplete(true);
        buttonTimeoutRef.current = setTimeout(() => setShowButton(true), 500);
      }
      return;
    }

    const currentLine = TERMINAL_LINES[currentLineIndex];

    // Handle progress bar specially
    if (currentLine.type === 'progress') {
      if (progressValue < 100) {
        const timer = setTimeout(() => {
          setProgressValue(prev => Math.min(prev + 5, 100));
        }, 30);
        return () => clearTimeout(timer);
      } else {
        // Progress complete, move to next line
        setDisplayedLines(prev => [...prev, `> [████████████████] 100%`]);
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
        return;
      }
    }

    // Handle empty lines
    if (currentLine.text === '') {
      const timer = setTimeout(() => {
        setDisplayedLines(prev => [...prev, '']);
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, LINE_DELAY);
      return () => clearTimeout(timer);
    }

    // Typing animation for text lines
    if (currentCharIndex < currentLine.text.length) {
      const timer = setTimeout(() => {
        setCurrentCharIndex(prev => prev + 1);
      }, TYPING_SPEED);
      return () => clearTimeout(timer);
    } else {
      // Line complete, move to next
      const timer = setTimeout(() => {
        setDisplayedLines(prev => [...prev, currentLine.text]);
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, LINE_DELAY);
      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, currentCharIndex, progressValue, isSkipped]);

  // Generate progress bar string with integer math for precision
  const getProgressBar = (value: number) => {
    const total = 16;
    const filled = Math.floor((value * total) / 100);
    const empty = total - filled;
    return `> [${'█'.repeat(filled)}${'░'.repeat(empty)}] ${value}%`;
  };

  // Get current typing text
  const getCurrentTypingText = () => {
    if (currentLineIndex >= TERMINAL_LINES.length) return null;
    const currentLine = TERMINAL_LINES[currentLineIndex];
    if (currentLine.type === 'progress') {
      return getProgressBar(progressValue);
    }
    return currentLine.text.slice(0, currentCharIndex);
  };

  const getLineColor = (line: string, index: number) => {
    const originalLine = TERMINAL_LINES[index];
    if (!originalLine) return 'text-green-400';

    switch (originalLine.type) {
      case 'command':
        return 'text-green-400';
      case 'highlight':
        return 'text-white font-medium';
      case 'output':
      default:
        return 'text-green-300/90';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black overflow-auto"
      onClick={handleSkip}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="청첩장 로딩 화면"
      aria-live="polite"
      tabIndex={0}
    >
      {/* Screen reader announcement */}
      <span className="sr-only">
        {isTypingComplete
          ? '로딩 완료. 버튼을 눌러 청첩장을 확인하세요.'
          : '청첩장을 로딩 중입니다...'}
      </span>
      {/* Scanline effect */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 255, 0, 0.03) 1px, rgba(0, 255, 0, 0.03) 2px)',
        }}
      />

      {/* CRT glow effect */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 100px rgba(0, 255, 0, 0.1)',
        }}
      />

      {/* Terminal content */}
      <div className="min-h-screen flex flex-col justify-center px-6 py-12 max-w-md mx-auto">
        <div className="font-mono text-sm sm:text-base leading-relaxed">
          {/* Rendered lines */}
          {displayedLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${getLineColor(line, index)} whitespace-pre min-h-[1.5em]`}
            >
              {line}
            </motion.div>
          ))}

          {/* Currently typing line */}
          {!isTypingComplete && currentLineIndex < TERMINAL_LINES.length && (
            <div className={`${getLineColor('', currentLineIndex)} whitespace-pre min-h-[1.5em]`}>
              {getCurrentTypingText()}
              <span className="animate-pulse">▊</span>
            </div>
          )}

          {/* Button */}
          <AnimatePresence>
            {showButton && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 space-y-4"
              >
                <div className="text-green-400 text-center">
                  {'> 선택하세요:'}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEnter();
                  }}
                  className="w-full py-4 border-2 border-green-500 text-green-400 font-mono text-lg hover:bg-green-500/20 active:bg-green-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="청첩장 보기"
                >
                  {'[ Y ] 함께하기'}
                </button>

                <div className="text-green-600/60 text-center text-xs">
                  <span className="animate-pulse">▊</span> 버튼을 탭하세요
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Skip hint */}
        {!isTypingComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="fixed bottom-8 left-0 right-0 text-center text-green-600/40 text-xs font-mono"
          >
            화면을 탭하면 스킵
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default TerminalIntro;

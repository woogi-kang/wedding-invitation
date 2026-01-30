'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { LetterGlitch } from './LetterGlitch';

// Sci-fi / "Her" movie style soft terminal sounds using Web Audio API
function createTerminalSound() {
  if (typeof window === 'undefined') return null;

  try {
    const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    // Create a soft, futuristic typing click
    const playTypingSound = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Soft sine wave with slight pitch variation
      const baseFreq = 1800 + Math.random() * 400;
      oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, audioContext.currentTime + 0.03);
      oscillator.type = 'sine';

      // Low-pass filter for softer sound
      filter.type = 'lowpass';
      filter.frequency.value = 3000;
      filter.Q.value = 1;

      // Very soft, quick fade
      gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.025);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.03);
    };

    // Soft progress tick
    const playProgressSound = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(2400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.02);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.02);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.025);
    };

    // Elegant completion chime (like "Her" movie UI sounds)
    const playCompleteSound = () => {
      const notes = [880, 1108.73, 1318.51, 1760]; // A5, C#6, E6, A6 (A major arpeggio)

      notes.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        filter.type = 'lowpass';
        filter.frequency.value = 4000;

        const startTime = audioContext.currentTime + i * 0.12;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.45);
      });
    };

    // Soft boot/startup sound
    const playStartSound = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.15);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.25);
    };

    return {
      playTypingSound,
      playProgressSound,
      playCompleteSound,
      playStartSound,
      resume: () => {
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
      }
    };
  } catch {
    return null;
  }
}

interface TerminalIntroProps {
  onEnter: () => void;
}

interface TerminalLine {
  text: string;
  type: 'command' | 'output' | 'highlight' | 'empty' | 'progress';
  delay?: number;
}

const TERMINAL_LINES: TerminalLine[] = [
  { text: '$ npx create-wedding', type: 'command' },
  { text: '', type: 'empty' },
  { text: 'PROGRESS', type: 'progress' },
  { text: '', type: 'empty' },
  { text: '[✓] 강태욱 ♥ 김선경', type: 'highlight' },
  { text: '[✓] 2026. 04. 05 (일)', type: 'output' },
  { text: '[✓] 오후 2시 10분', type: 'output' },
  { text: '[✓] 라마다 서울 신도림', type: 'output' },
  { text: '', type: 'empty' },
  { text: '→ Ready to launch', type: 'highlight' },
  { text: '', type: 'empty' },
  { text: '> 두 사람의 새로운 시작을', type: 'output' },
  { text: '> 함께 해주시겠습니까? _', type: 'command' },
];

// Typing speed (ms per character)
const TYPING_SPEED = 30;
const LINE_DELAY = 150;

export function TerminalIntro({ onEnter }: TerminalIntroProps) {
  const [hasStarted, setHasStarted] = useState(false); // Wait for user to start
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

  // Initialize terminal sound generator
  const sound = useMemo(() => createTerminalSound(), []);

  // Start typing animation with sound
  const handleStart = useCallback(() => {
    if (hasStarted) return;

    // Enable audio context on user interaction
    if (sound) {
      sound.resume();
      sound.playStartSound();
    }
    setHasStarted(true);
  }, [hasStarted, sound]);

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
    if (shouldReduceMotion && hasStarted && !isTypingComplete) {
      const allLines = TERMINAL_LINES.map(line =>
        line.type === 'progress' ? '> [████████████████] 100%' : line.text
      );
      setDisplayedLines(allLines);
      setCurrentLineIndex(TERMINAL_LINES.length);
      setIsTypingComplete(true);
      setShowButton(true);
    }
  }, [shouldReduceMotion, hasStarted, isTypingComplete]);

  // Skip animation on tap (after started)
  const handleSkip = useCallback(() => {
    if (!hasStarted || isTypingComplete) return;

    setIsSkipped(true);
    const allLines = TERMINAL_LINES.map(line =>
      line.type === 'progress' ? '> [████████████████] 100%' : line.text
    );
    setDisplayedLines(allLines);
    setCurrentLineIndex(TERMINAL_LINES.length);
    setIsTypingComplete(true);
    if (sound) sound.playCompleteSound();
    buttonTimeoutRef.current = setTimeout(() => setShowButton(true), 300);
  }, [hasStarted, isTypingComplete, sound]);

  // Keyboard support for accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSkip();
    }
  }, [handleSkip]);

  // Typing animation - only runs after hasStarted
  useEffect(() => {
    if (!hasStarted || isSkipped || currentLineIndex >= TERMINAL_LINES.length) {
      if (hasStarted && !isSkipped && currentLineIndex >= TERMINAL_LINES.length) {
        setIsTypingComplete(true);
        if (sound) sound.playCompleteSound();
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
          // Play progress sound every 20%
          if (sound && progressValue % 20 === 0) {
            sound.playProgressSound();
          }
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
        // Play typing sound for each character
        if (sound) {
          sound.playTypingSound();
        }
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
  }, [hasStarted, currentLineIndex, currentCharIndex, progressValue, isSkipped, sound]);

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

  // Handle tap - start if not started, skip if already started
  const handleTap = useCallback(() => {
    if (!hasStarted) {
      handleStart();
    } else {
      handleSkip();
    }
  }, [hasStarted, handleStart, handleSkip]);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      onClick={handleTap}
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

      {/* Letter Glitch Background */}
      <LetterGlitch
        glitchColors={['#2d5a27', '#4a7c45', '#1a3d16', '#3d6b37']}
        glitchSpeed={50}
        outerVignette={true}
        centerVignette={true}
        smooth={true}
      />

      {/* Scanline effect overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02] z-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 255, 0, 0.05) 1px, rgba(0, 255, 0, 0.05) 2px)',
        }}
      />

      {/* Glass Morphism Terminal Card */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md max-h-[85vh] overflow-auto rounded-2xl border border-green-500/30 bg-black/70 backdrop-blur-xl shadow-2xl shadow-green-900/20"
        >
          {/* Terminal Header */}
          <div className="sticky top-0 flex items-center gap-2 px-4 py-3 border-b border-green-500/20 bg-black/50 backdrop-blur-sm">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="ml-2 text-xs text-green-500/60 font-mono">wedding.exe</span>
          </div>

          {/* Terminal content */}
          <div className="p-4 sm:p-6">
            <div className="font-mono text-sm sm:text-base leading-relaxed">

          {/* Start Screen - shown before typing begins */}
          {!hasStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-6 text-4xl"
              >
                💒
              </motion.div>
              <p className="text-green-400 text-lg mb-2">Wedding Invitation</p>
              <p className="text-green-500/60 text-sm mb-8">v1.0.0</p>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-green-400 text-sm"
              >
                [ 화면을 터치하여 시작 ]
              </motion.div>
              <p className="text-green-600/40 text-xs mt-4">
                🔊 사운드와 함께 시작됩니다
              </p>
            </motion.div>
          )}
          {/* Rendered lines - only show after started */}
          {hasStarted && displayedLines.map((line, index) => (
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
          {hasStarted && !isTypingComplete && currentLineIndex < TERMINAL_LINES.length && (
            <div className={`${getLineColor('', currentLineIndex)} whitespace-pre min-h-[1.5em]`}>
              {getCurrentTypingText()}
              <span className="animate-pulse">▊</span>
            </div>
          )}

          {/* Button */}
          <AnimatePresence>
            {hasStarted && showButton && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 space-y-4"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEnter();
                  }}
                  className="w-full py-4 border-2 border-green-500 text-green-400 font-mono text-lg hover:bg-green-500/20 active:bg-green-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="청첩장 보기"
                >
                  {'함께하기 (버튼을 눌러주세요)'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

            {/* Skip hint - inside card */}
            {hasStarted && !isTypingComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="mt-6 text-center text-green-600/50 text-xs font-mono"
              >
                화면을 탭하면 스킵
              </motion.div>
            )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default TerminalIntro;

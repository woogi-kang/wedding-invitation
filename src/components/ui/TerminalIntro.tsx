'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { LetterGlitch } from './LetterGlitch';

// 8-bit style typing sound generator using Web Audio API
function create8BitSound() {
  if (typeof window === 'undefined') return null;

  try {
    const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    return {
      playTypingSound: () => {
        // Create oscillator for 8-bit beep
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Random frequency for variety (typical 8-bit range)
        const frequencies = [440, 523, 587, 659, 698, 784, 880];
        oscillator.frequency.value = frequencies[Math.floor(Math.random() * frequencies.length)];
        oscillator.type = 'square'; // Classic 8-bit square wave

        // Very short beep
        gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
      },
      playProgressSound: () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 220;
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.03);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.03);
      },
      playCompleteSound: () => {
        // Rising tone for completion
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.value = freq;
          oscillator.type = 'square';

          const startTime = audioContext.currentTime + i * 0.1;
          gainNode.gain.setValueAtTime(0.05, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

          oscillator.start(startTime);
          oscillator.stop(startTime + 0.15);
        });
      },
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
  const [soundEnabled, setSoundEnabled] = useState(false);
  const hasInteractedRef = useRef(false);

  // Initialize 8-bit sound generator
  const sound = useMemo(() => create8BitSound(), []);

  // Auto-enable sound on first user interaction anywhere
  useEffect(() => {
    const enableOnInteraction = () => {
      if (!hasInteractedRef.current && sound) {
        sound.resume();
        setSoundEnabled(true);
        hasInteractedRef.current = true;
      }
    };

    // Listen for any user interaction
    window.addEventListener('click', enableOnInteraction, { once: true });
    window.addEventListener('touchstart', enableOnInteraction, { once: true });
    window.addEventListener('keydown', enableOnInteraction, { once: true });

    return () => {
      window.removeEventListener('click', enableOnInteraction);
      window.removeEventListener('touchstart', enableOnInteraction);
      window.removeEventListener('keydown', enableOnInteraction);
    };
  }, [sound]);

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

  // Enable sound on first interaction (required by browser autoplay policy)
  const enableSound = useCallback(() => {
    if (!soundEnabled && sound) {
      sound.resume();
      setSoundEnabled(true);
      hasInteractedRef.current = true;
    }
  }, [soundEnabled, sound]);

  // Skip animation on tap (only skip on second tap, first tap enables sound)
  const handleSkip = useCallback(() => {
    if (isTypingComplete) return;

    // First interaction: enable sound only, don't skip
    if (!hasInteractedRef.current) {
      enableSound();
      return;
    }

    // Second interaction: skip animation
    setIsSkipped(true);
    const allLines = TERMINAL_LINES.map(line =>
      line.type === 'progress' ? '> [████████████████] 100%' : line.text
    );
    setDisplayedLines(allLines);
    setCurrentLineIndex(TERMINAL_LINES.length);
    setIsTypingComplete(true);
    if (sound && soundEnabled) sound.playCompleteSound();
    buttonTimeoutRef.current = setTimeout(() => setShowButton(true), 300);
  }, [isTypingComplete, enableSound, sound, soundEnabled]);

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
        if (sound && soundEnabled) sound.playCompleteSound();
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
          if (sound && soundEnabled && progressValue % 20 === 0) {
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
        // Play typing sound (throttled - every 2 characters)
        if (sound && soundEnabled && currentCharIndex % 2 === 0) {
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
  }, [currentLineIndex, currentCharIndex, progressValue, isSkipped, sound, soundEnabled]);

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

  // Handle tap to enable sound and skip
  const handleTap = useCallback(() => {
    enableSound();
    handleSkip();
  }, [enableSound, handleSkip]);

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

            {/* Skip hint - inside card */}
            {!isTypingComplete && (
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

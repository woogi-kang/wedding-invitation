'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelButton } from './shared';
import { PixelCharacter } from './shared/PixelCharacter';

const ARCADE_COLORS = {
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

// -- Sparkle particle system --

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

function createSparkles(count: number): Sparkle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 2 + 1.5,
    delay: Math.random() * 3,
  }));
}

function SparkleField({ count = 40 }: { count?: number }) {
  const sparkles = useMemo(() => createSparkles(count), [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: ARCADE_COLORS.gold,
            boxShadow: `0 0 ${s.size * 2}px ${ARCADE_COLORS.gold}`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// -- Credits data --

interface CreditBlock {
  heading: string;
  lines: { name: string; role: string }[];
}

const CREDITS: CreditBlock[] = [
  {
    heading: 'CAST',
    lines: [
      { name: '\uAC15\uD0DC\uC6B1', role: 'as The Groom' },
      { name: '\uAE40\uC120\uACBD', role: 'as The Bride' },
    ],
  },
  {
    heading: 'PRODUCED BY',
    lines: [
      { name: '\uAC15\uC2B9\uD638 & \uC774\uC9C0\uC21C', role: "Groom's Family" },
      { name: '\uAE40\uC885\uD0DC & \uC2E0\uD604\uC784', role: "Bride's Family" },
    ],
  },
  {
    heading: 'SPECIAL THANKS',
    lines: [
      { name: '\uC18C\uC911\uD55C \uD558\uAC1D \uC5EC\uB7EC\uBD84', role: 'Our Beloved Guests' },
    ],
  },
  {
    heading: 'DEVELOPED BY',
    lines: [
      { name: 'LOVE STUDIO', role: 'Since 2022' },
    ],
  },
  {
    heading: 'POWERED BY',
    lines: [
      { name: '\uC0AC\uB791 & \uBFFF\uC74C & \uCEE4\uD53C', role: 'Love & Trust & Coffee' },
    ],
  },
];

// -- Phase types --

type Phase = 'victory' | 'credits' | 'final';

// -- Phase 1: Victory Screen --

function VictoryScreen({ onSkip }: { onSkip: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-4"
      style={{ background: ARCADE_COLORS.bg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      onClick={onSkip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSkip();
        }
      }}
      aria-label="Victory screen - tap to continue"
    >
      <SparkleField count={50} />

      {/* Characters celebrating */}
      <motion.div
        className="relative z-10 flex items-end gap-4 sm:gap-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <PixelCharacter character="groom" size="full" scale={3} animate />
        <motion.span
          className="text-[20px] sm:text-[28px] mb-6"
          style={{ color: ARCADE_COLORS.pink }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          {'♥'}
        </motion.span>
        <PixelCharacter character="bride" size="full" scale={3} animate />
      </motion.div>

      {/* QUEST COMPLETE */}
      <motion.h1
        className="relative z-10 text-center font-['Press_Start_2P',monospace]"
        style={{
          color: ARCADE_COLORS.gold,
          fontSize: 'clamp(16px, 5vw, 28px)',
          lineHeight: 1.4,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          textShadow: [
            `0 0 10px ${ARCADE_COLORS.gold}80, 0 0 20px ${ARCADE_COLORS.gold}40`,
            `0 0 20px ${ARCADE_COLORS.gold}A0, 0 0 40px ${ARCADE_COLORS.gold}60`,
            `0 0 10px ${ARCADE_COLORS.gold}80, 0 0 20px ${ARCADE_COLORS.gold}40`,
          ],
        }}
        transition={{
          opacity: { duration: 1 },
          scale: { duration: 1 },
          textShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        QUEST COMPLETE!
      </motion.h1>

      {/* NEW GAME+ */}
      <motion.p
        className="relative z-10 mt-6 text-center font-['Press_Start_2P',monospace]"
        style={{
          color: ARCADE_COLORS.text,
          fontSize: 'clamp(8px, 2.5vw, 12px)',
          lineHeight: 1.8,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        NEW GAME+ UNLOCKED:
        <br />
        <span style={{ color: ARCADE_COLORS.pink }}>
          {'\uACB0\uD63C \uC0DD\uD65C'}
        </span>
      </motion.p>

      {/* Skip hint */}
      <motion.p
        className="absolute bottom-8 font-['Press_Start_2P',monospace] text-center"
        style={{
          color: ARCADE_COLORS.gray,
          fontSize: '8px',
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        TAP TO CONTINUE
      </motion.p>
    </motion.div>
  );
}

// -- Phase 2: Credits Roll --

function CreditsRoll({ onSkip }: { onSkip: () => void }) {
  // Calculate total height for scroll: heading + lines + spacing
  // Each credit block: heading + lines + gap
  const CREDITS_DURATION = 15;

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{ background: ARCADE_COLORS.bg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onClick={onSkip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSkip();
        }
      }}
      aria-label="Credits - tap to skip"
    >
      <SparkleField count={20} />

      {/* Scrolling credits container */}
      <div className="absolute inset-0 flex justify-center">
        <motion.div
          className="text-center px-4"
          style={{ paddingTop: '100vh' }}
          initial={{ y: 0 }}
          animate={{ y: '-100%' }}
          transition={{
            duration: CREDITS_DURATION,
            ease: 'linear',
          }}
        >
          {CREDITS.map((block, blockIdx) => (
            <div key={blockIdx} className="mb-12 sm:mb-16">
              {/* Section heading */}
              <p
                className="font-['Press_Start_2P',monospace] mb-6 sm:mb-8"
                style={{
                  color: ARCADE_COLORS.gold,
                  fontSize: 'clamp(8px, 2.5vw, 11px)',
                  letterSpacing: '0.15em',
                  textShadow: `0 0 8px ${ARCADE_COLORS.gold}40`,
                }}
              >
                {'\u2014 '}
                {block.heading}
                {' \u2014'}
              </p>

              {/* Names and roles */}
              {block.lines.map((line, lineIdx) => (
                <div key={lineIdx} className="mb-6 sm:mb-8">
                  <p
                    className="font-['Press_Start_2P',monospace]"
                    style={{
                      color: ARCADE_COLORS.text,
                      fontSize: 'clamp(10px, 3vw, 14px)',
                      lineHeight: 1.6,
                    }}
                  >
                    {line.name}
                  </p>
                  <p
                    className="mt-1 font-['Press_Start_2P',monospace]"
                    style={{
                      color: ARCADE_COLORS.gray,
                      fontSize: 'clamp(7px, 2vw, 9px)',
                      lineHeight: 1.6,
                    }}
                  >
                    {line.role}
                  </p>
                </div>
              ))}
            </div>
          ))}

          {/* Bottom padding so credits scroll fully off screen */}
          <div className="h-[60vh]" />
        </motion.div>
      </div>

      {/* Top/bottom gradient overlays for smooth edges */}
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-10"
        style={{
          background: `linear-gradient(to bottom, ${ARCADE_COLORS.bg}, transparent)`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10"
        style={{
          background: `linear-gradient(to top, ${ARCADE_COLORS.bg}, transparent)`,
        }}
      />

      {/* Skip hint */}
      <motion.p
        className="absolute bottom-6 left-0 right-0 text-center font-['Press_Start_2P',monospace] z-20"
        style={{
          color: ARCADE_COLORS.gray,
          fontSize: '7px',
        }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        TAP TO SKIP
      </motion.p>
    </motion.div>
  );
}

// -- Phase 3: Final Message --

function FinalMessage({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<'theend' | 'continued' | 'button'>('theend');

  useEffect(() => {
    if (step === 'theend') {
      const timer = setTimeout(() => setStep('continued'), 2000);
      return () => clearTimeout(timer);
    }
    if (step === 'continued') {
      const timer = setTimeout(() => setStep('button'), 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-4"
      style={{ background: ARCADE_COLORS.bg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center">
        <AnimatePresence mode="wait">
          {step === 'theend' && (
            <motion.p
              key="theend"
              className="font-['Press_Start_2P',monospace]"
              style={{
                color: ARCADE_COLORS.gray,
                fontSize: 'clamp(14px, 4vw, 22px)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              THE END...?
            </motion.p>
          )}

          {(step === 'continued' || step === 'button') && (
            <motion.div
              key="continued"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.p
                className="font-['Press_Start_2P',monospace]"
                style={{
                  color: ARCADE_COLORS.gold,
                  fontSize: 'clamp(14px, 4vw, 22px)',
                }}
                animate={{
                  textShadow: [
                    `0 0 8px ${ARCADE_COLORS.gold}60, 0 0 16px ${ARCADE_COLORS.gold}30`,
                    `0 0 16px ${ARCADE_COLORS.gold}90, 0 0 32px ${ARCADE_COLORS.gold}50`,
                    `0 0 8px ${ARCADE_COLORS.gold}60, 0 0 16px ${ARCADE_COLORS.gold}30`,
                  ],
                }}
                transition={{
                  textShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                }}
              >
                TO BE CONTINUED
              </motion.p>

              {/* Mini characters walking together */}
              <motion.div
                className="flex items-center justify-center gap-2 mt-6 sm:mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <PixelCharacter character="groom" size="mini" scale={2} animate />
                <PixelCharacter character="bride" size="mini" scale={2} animate />
              </motion.div>

              <motion.p
                className="mt-4"
                style={{
                  color: ARCADE_COLORS.pink,
                  fontSize: 'clamp(9px, 2.5vw, 12px)',
                  fontFamily: "'Press Start 2P', monospace",
                  lineHeight: 1.8,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {'\u2192 \uC9C4\uC9DC \uC5D4\uB529\uC740 \uACB0\uD63C\uC2DD\uC5D0\uC11C!'}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button appears after full sequence */}
        <AnimatePresence>
          {step === 'button' && (
            <motion.div
              className="mt-10 sm:mt-12"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <PixelButton variant="primary" size="md" onClick={onComplete}>
                {'\uB2E4\uC74C\uC73C\uB85C'}
              </PixelButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// -- Main EndingSequence Component --

interface EndingSequenceProps {
  onComplete: () => void;
}

export function EndingSequence({ onComplete }: EndingSequenceProps) {
  const [phase, setPhase] = useState<Phase>('victory');
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-advance from victory to credits after 3 seconds
  useEffect(() => {
    if (phase === 'victory') {
      autoAdvanceRef.current = setTimeout(() => {
        setPhase('credits');
      }, 3000);
      return () => {
        if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      };
    }
  }, [phase]);

  // Auto-advance from credits to final after credits duration
  useEffect(() => {
    if (phase === 'credits') {
      autoAdvanceRef.current = setTimeout(() => {
        setPhase('final');
      }, 15000);
      return () => {
        if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      };
    }
  }, [phase]);

  // Skip to next phase on tap/click
  const skipToNext = useCallback(() => {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }

    setPhase((current) => {
      if (current === 'victory') return 'credits';
      if (current === 'credits') return 'final';
      return current;
    });
  }, []);

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      style={{ background: ARCADE_COLORS.bg }}
    >
      <AnimatePresence mode="wait">
        {phase === 'victory' && (
          <VictoryScreen key="victory" onSkip={skipToNext} />
        )}

        {phase === 'credits' && (
          <CreditsRoll key="credits" onSkip={skipToNext} />
        )}

        {phase === 'final' && (
          <FinalMessage key="final" onComplete={onComplete} />
        )}
      </AnimatePresence>
    </div>
  );
}

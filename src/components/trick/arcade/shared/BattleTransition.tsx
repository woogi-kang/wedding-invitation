'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BattleTransitionProps {
  isActive: boolean;
  onComplete: () => void;
  duration?: number;
}

const BAR_COUNT = 8;

export function BattleTransition({
  isActive,
  onComplete,
  duration = 600,
}: BattleTransitionProps) {
  const [phase, setPhase] = useState<'idle' | 'enter' | 'hold' | 'exit'>('idle');

  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      return;
    }

    setPhase('enter');

    const holdTimer = setTimeout(() => setPhase('hold'), duration * 0.45);
    const exitTimer = setTimeout(() => setPhase('exit'), duration * 0.65);
    const completeTimer = setTimeout(() => {
      setPhase('idle');
      onComplete();
    }, duration);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [isActive, duration, onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'idle' && (
        <motion.div
          className="fixed inset-0 z-[60] pointer-events-none overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {Array.from({ length: BAR_COUNT }).map((_, i) => {
            const fromLeft = i % 2 === 0;
            const staggerDelay = i * 0.02;
            const barHeight = `${100 / BAR_COUNT}%`;

            return (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  top: `${(i / BAR_COUNT) * 100}%`,
                  left: 0,
                  width: '100%',
                  height: barHeight,
                  background: '#000',
                }}
                initial={{ x: fromLeft ? '-100%' : '100%' }}
                animate={{
                  x: phase === 'exit'
                    ? (fromLeft ? '100%' : '-100%')
                    : '0%',
                }}
                transition={{
                  duration: duration * 0.0004,
                  delay: staggerDelay,
                  ease: 'easeInOut',
                }}
              />
            );
          })}

          {/* 포켓몬 스타일 플래시 */}
          {phase === 'hold' && (
            <motion.div
              className="absolute inset-0"
              style={{ background: '#fff' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              transition={{ duration: duration * 0.0003 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

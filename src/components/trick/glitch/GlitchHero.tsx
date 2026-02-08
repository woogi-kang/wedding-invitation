'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TypingGlitch, GlitchText } from './GlitchText';
import { getBootSequence } from '@/lib/trick-content';
import { WEDDING_INFO } from '@/lib/constants';

interface GlitchHeroProps {
  onBootComplete?: () => void;
}

export function GlitchHero({ onBootComplete }: GlitchHeroProps) {
  const [bootComplete, setBootComplete] = useState(false);
  const bootLines = getBootSequence();

  const handleComplete = () => {
    setBootComplete(true);
    onBootComplete?.();
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        {/* Terminal Window */}
        <div className="rounded-lg border border-[#00ff41]/30 bg-black/80 backdrop-blur-sm overflow-hidden shadow-2xl shadow-[#00ff41]/10">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#00ff41]/20 bg-black/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="ml-2 text-xs text-[#00ff41]/60 font-mono">
              MATRIMONY.EXE - System Boot
            </span>
          </div>

          {/* Boot Sequence */}
          <div className="p-3 sm:p-6 min-h-[250px] sm:min-h-[400px]">
            <TypingGlitch
              lines={bootLines}
              typingSpeed={25}
              lineDelay={150}
              onComplete={handleComplete}
            />
          </div>
        </div>

        {/* Decorative Elements */}
        {bootComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <GlitchText
              text={`${WEDDING_INFO.groom.name} ♥ ${WEDDING_INFO.bride.name}`}
              className="text-xl sm:text-3xl md:text-4xl font-bold text-[#00ff41]"
              as="h1"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-4 text-[#00ff41]/60 font-mono text-sm"
            >
              scroll down to explore // 스크롤하여 탐색
            </motion.p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mt-4 text-[#00ff41]/40"
            >
              ▼
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

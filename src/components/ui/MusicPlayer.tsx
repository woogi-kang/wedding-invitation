'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Music, Pause, Play, Volume2 } from 'lucide-react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { WEDDING_INFO } from '@/lib/constants';

export function MusicPlayer() {
  const { music } = WEDDING_INFO;
  const { isPlaying, toggle } = useAudioPlayer(music.src, music.enabled);

  if (!music.enabled) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
      onClick={toggle}
      className="fixed bottom-4 right-4 min-[375px]:bottom-5 min-[375px]:right-5 sm:bottom-6 sm:right-6 z-40 flex h-11 w-11 min-[375px]:h-12 min-[375px]:w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:shadow-xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label={isPlaying ? 'Pause music' : 'Play music'}
    >
      {/* Background glow when playing */}
      {isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-full bg-[var(--color-primary)]"
          initial={{ scale: 1, opacity: 0.2 }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Icon */}
      <AnimatePresence mode="wait">
        {isPlaying ? (
          <motion.div
            key="playing"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Music className="h-5 w-5 text-[var(--color-primary)]" />
            </motion.div>

            {/* Sound waves */}
            <motion.div
              className="absolute -right-1 -top-1"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Volume2 className="h-3 w-3 text-[var(--color-accent)]" />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="paused"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Play className="ml-0.5 h-5 w-5 text-[var(--color-primary)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[var(--color-botanical-light)]"
        animate={isPlaying ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={{ duration: 1.5, repeat: isPlaying ? Infinity : 0 }}
      />
    </motion.button>
  );
}

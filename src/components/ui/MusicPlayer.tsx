'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { WEDDING_INFO } from '@/lib/constants';

// Animated sound bars component
function SoundBars({ isPlaying }: { isPlaying: boolean }) {
  const bars = [
    { delay: 0, height: [40, 100, 60, 80, 40] },
    { delay: 0.1, height: [60, 40, 90, 50, 60] },
    { delay: 0.2, height: [80, 60, 40, 100, 80] },
    { delay: 0.15, height: [50, 90, 70, 40, 50] },
  ];

  return (
    <div className="flex items-end gap-[2px] h-4">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full"
          style={{ backgroundColor: 'var(--color-primary)' }}
          initial={{ height: '40%' }}
          animate={
            isPlaying
              ? {
                  height: bar.height.map((h) => `${h}%`),
                }
              : { height: '30%' }
          }
          transition={
            isPlaying
              ? {
                  duration: 0.8,
                  repeat: Infinity,
                  delay: bar.delay,
                  ease: 'easeInOut',
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}

export function MusicPlayer() {
  const { music } = WEDDING_INFO;
  const { isPlaying, toggle } = useAudioPlayer(music.src, music.enabled);

  if (!music.enabled) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      onClick={toggle}
      className="fixed top-4 right-4 min-[375px]:top-5 min-[375px]:right-5 sm:top-6 sm:right-6 z-50 flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: isPlaying
          ? 'rgba(255, 255, 255, 0.95)'
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: isPlaying
          ? '0 4px 20px rgba(200, 164, 165, 0.3)'
          : '0 2px 10px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(200, 164, 165, 0.2)',
      }}
      aria-label={isPlaying ? '음악 끄기' : '음악 켜기'}
    >
      {/* Sound bars animation */}
      <SoundBars isPlaying={isPlaying} />

      {/* Play/Pause indicator */}
      <AnimatePresence mode="wait">
        {isPlaying ? (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1"
          >
            <span
              className="text-xs font-medium tracking-wide"
              style={{ color: 'var(--color-primary-dark)' }}
            >
              ON
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="paused"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1"
          >
            <span
              className="text-xs font-medium tracking-wide"
              style={{ color: 'var(--color-text-muted)' }}
            >
              OFF
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulsing ring when playing */}
      {isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: '1px solid var(--color-primary)' }}
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 1.3 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
    </motion.button>
  );
}

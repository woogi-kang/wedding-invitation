'use client';

import { motion } from 'framer-motion';
import { WEDDING_INFO } from '@/lib/constants';

interface CalendarProps {
  className?: string;
}

export function GlassMorphism({ className = '' }: CalendarProps) {
  const { dateDisplay } = WEDDING_INFO;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`relative flex items-center justify-center py-16 px-6 overflow-hidden ${className}`}
    >
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-10 -left-10 w-40 h-40 rounded-full"
          style={{
            background: 'var(--color-bride)',
            opacity: 0.3,
            filter: 'blur(40px)',
          }}
        />
        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full"
          style={{
            background: 'var(--color-groom)',
            opacity: 0.3,
            filter: 'blur(40px)',
          }}
        />
        <motion.div
          animate={{
            x: [0, 15, 0],
            y: [0, 15, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full"
          style={{
            background: 'var(--color-primary)',
            opacity: 0.2,
            filter: 'blur(30px)',
          }}
        />
      </div>

      {/* Glass Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative z-10 w-full max-w-xs py-10 px-8 rounded-2xl text-center"
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Label */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-[10px] tracking-[0.4em] uppercase"
          style={{
            fontFamily: 'var(--font-accent)',
            color: 'var(--color-text)',
          }}
        >
          Wedding Day
        </motion.span>

        {/* Main Date */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="my-6"
        >
          <span
            className="block text-6xl sm:text-7xl font-light"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-text)',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            {String(dateDisplay.month).padStart(2, '0')}.{String(dateDisplay.day).padStart(2, '0')}
          </span>
        </motion.div>

        {/* Year and Day */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-4"
        >
          <span
            className="text-sm"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-light)',
            }}
          >
            {dateDisplay.year}
          </span>
          <div
            className="w-1 h-1 rounded-full"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
          <span
            className="text-sm"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-light)',
            }}
          >
            {dateDisplay.dayOfWeek}
          </span>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="w-16 h-px mx-auto my-5"
          style={{ background: 'rgba(255, 255, 255, 0.5)' }}
        />

        {/* Time */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-sm tracking-wider"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text)',
          }}
        >
          {dateDisplay.time}
        </motion.span>

        {/* Decorative ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="absolute -top-3 -right-3 w-6 h-6 rounded-full"
          style={{
            background: 'rgba(255, 255, 255, 0.4)',
            border: '2px solid rgba(255, 255, 255, 0.6)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}

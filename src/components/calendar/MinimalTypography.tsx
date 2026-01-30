'use client';

import { motion } from 'framer-motion';
import { WEDDING_INFO } from '@/lib/constants';

interface CalendarProps {
  className?: string;
}

export function MinimalTypography({ className = '' }: CalendarProps) {
  const { dateDisplay } = WEDDING_INFO;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col items-center justify-center py-12 px-6 ${className}`}
    >
      {/* Year */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xs tracking-[0.5em] uppercase mb-4"
        style={{
          fontFamily: 'var(--font-accent)',
          color: 'var(--color-text-muted)',
        }}
      >
        {dateDisplay.year}
      </motion.span>

      {/* Large Day Number */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
        className="relative"
      >
        <span
          className="text-[120px] sm:text-[160px] font-light leading-none"
          style={{
            fontFamily: 'var(--font-accent)',
            color: 'var(--color-text)',
            letterSpacing: '-0.02em',
          }}
        >
          {String(dateDisplay.day).padStart(2, '0')}
        </span>

        {/* Subtle decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-px"
          style={{ backgroundColor: 'var(--color-primary)' }}
        />
      </motion.div>

      {/* Month and Day of Week */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-3 mt-6"
      >
        <span
          className="text-lg tracking-widest"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text)',
          }}
        >
          {dateDisplay.month}월
        </span>
        <span
          className="w-1 h-1 rounded-full"
          style={{ backgroundColor: 'var(--color-accent)' }}
        />
        <span
          className="text-lg tracking-widest"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text)',
          }}
        >
          {dateDisplay.dayOfWeek}
        </span>
      </motion.div>

      {/* Time */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-4 text-sm tracking-wider"
        style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-text-light)',
        }}
      >
        {dateDisplay.time}
      </motion.span>
    </motion.div>
  );
}

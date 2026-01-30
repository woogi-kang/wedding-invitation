'use client';

import { motion } from 'framer-motion';
import { WEDDING_INFO } from '@/lib/constants';

interface CalendarProps {
  className?: string;
}

export function ElegantScript({ className = '' }: CalendarProps) {
  const { dateDisplay, groom, bride } = WEDDING_INFO;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`relative flex flex-col items-center justify-center py-14 px-6 ${className}`}
    >
      {/* Decorative top flourish */}
      <motion.svg
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-32 h-8 mb-6"
        viewBox="0 0 120 30"
        fill="none"
      >
        <path
          d="M10 15 Q30 5 60 15 Q90 25 110 15"
          stroke="var(--color-gold)"
          strokeWidth="1"
          fill="none"
        />
        <circle cx="60" cy="15" r="3" fill="var(--color-gold)" />
        <path
          d="M10 15 Q30 25 60 15 Q90 5 110 15"
          stroke="var(--color-gold)"
          strokeWidth="0.5"
          fill="none"
          opacity="0.5"
        />
      </motion.svg>

      {/* Names */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-6"
      >
        <span
          className="text-2xl sm:text-3xl italic"
          style={{
            fontFamily: 'var(--font-accent)',
            color: 'var(--color-text)',
          }}
        >
          {groom.englishName}
        </span>
        <span
          className="mx-3 text-lg"
          style={{ color: 'var(--color-bride)' }}
        >
          &
        </span>
        <span
          className="text-2xl sm:text-3xl italic"
          style={{
            fontFamily: 'var(--font-accent)',
            color: 'var(--color-text)',
          }}
        >
          {bride.englishName}
        </span>
      </motion.div>

      {/* Request text */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xs tracking-[0.3em] uppercase mb-8"
        style={{
          fontFamily: 'var(--font-accent)',
          color: 'var(--color-text-muted)',
        }}
      >
        Request the pleasure of your company
      </motion.span>

      {/* Main Date Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-center"
      >
        {/* Day of week */}
        <span
          className="block text-sm tracking-[0.4em] uppercase mb-2"
          style={{
            fontFamily: 'var(--font-accent)',
            color: 'var(--color-text-light)',
          }}
        >
          {dateDisplay.dayOfWeek}
        </span>

        {/* Month */}
        <span
          className="block text-3xl sm:text-4xl italic mb-2"
          style={{
            fontFamily: 'var(--font-accent)',
            color: 'var(--color-text)',
          }}
        >
          {monthNames[dateDisplay.month - 1]}
        </span>

        {/* Day number - large */}
        <span
          className="block text-7xl sm:text-8xl font-light"
          style={{
            fontFamily: 'var(--font-accent)',
            color: 'var(--color-primary)',
            lineHeight: 1,
          }}
        >
          {dateDisplay.day}
        </span>

        {/* Year */}
        <span
          className="block text-xl tracking-[0.5em] mt-2"
          style={{
            fontFamily: 'var(--font-accent)',
            color: 'var(--color-text-light)',
          }}
        >
          {dateDisplay.year}
        </span>
      </motion.div>

      {/* Decorative divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="flex items-center gap-4 my-6"
      >
        <div className="w-16 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--color-gold)">
          <path d="M8 0C8 4.5 4.5 8 0 8C4.5 8 8 11.5 8 16C8 11.5 11.5 8 16 8C11.5 8 8 4.5 8 0Z" />
        </svg>
        <div className="w-16 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
      </motion.div>

      {/* Time */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <span
          className="text-sm tracking-widest"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-light)',
          }}
        >
          at {dateDisplay.time}
        </span>
      </motion.div>

      {/* Decorative bottom flourish */}
      <motion.svg
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="w-24 h-6 mt-6"
        viewBox="0 0 100 20"
        fill="none"
      >
        <path
          d="M0 10 Q25 0 50 10 Q75 20 100 10"
          stroke="var(--color-gold)"
          strokeWidth="1"
          fill="none"
        />
      </motion.svg>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { WEDDING_INFO } from '@/lib/constants';

interface CalendarProps {
  className?: string;
}

export function GeometricArt({ className = '' }: CalendarProps) {
  const { dateDisplay } = WEDDING_INFO;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`relative flex flex-col items-center justify-center py-14 px-6 overflow-hidden ${className}`}
      style={{ backgroundColor: 'var(--color-secondary)' }}
    >
      {/* Geometric Background Shapes */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Large triangle */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{ duration: 0.8 }}
          points="50,250 200,50 350,250"
          fill="var(--color-primary)"
        />

        {/* Circle */}
        <motion.circle
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          cx="320"
          cy="80"
          r="60"
          fill="var(--color-bride)"
        />

        {/* Rectangle */}
        <motion.rect
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.06, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          x="30"
          y="60"
          width="80"
          height="120"
          fill="var(--color-groom)"
        />

        {/* Small triangles */}
        <motion.polygon
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ delay: 0.4 }}
          points="350,200 380,260 320,260"
          fill="var(--color-gold)"
        />
      </svg>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Top geometric accent */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div
            className="w-3 h-3 rotate-45"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
          <span
            className="text-[10px] tracking-[0.5em] uppercase"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-text-muted)',
            }}
          >
            Wedding Day
          </span>
          <div
            className="w-3 h-3 rotate-45"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
        </motion.div>

        {/* Year in geometric frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative inline-block mb-4"
        >
          <div
            className="absolute -inset-3 border-2"
            style={{ borderColor: 'var(--color-primary)' }}
          />
          <span
            className="text-lg tracking-[0.5em]"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-text)',
            }}
          >
            {dateDisplay.year}
          </span>
        </motion.div>

        {/* Large Date Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex items-center justify-center gap-4 my-4"
        >
          {/* Month */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="absolute -inset-4 rounded-full border"
              style={{ borderColor: 'var(--color-bride)', opacity: 0.5 }}
            />
            <span
              className="text-5xl sm:text-6xl font-bold"
              style={{
                fontFamily: 'var(--font-accent)',
                color: 'var(--color-text)',
              }}
            >
              {String(dateDisplay.month).padStart(2, '0')}
            </span>
          </div>

          {/* Separator */}
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-2 h-2 rotate-45"
              style={{ backgroundColor: 'var(--color-gold)' }}
            />
            <div
              className="w-1 h-8"
              style={{ backgroundColor: 'var(--color-border)' }}
            />
            <div
              className="w-2 h-2 rotate-45"
              style={{ backgroundColor: 'var(--color-gold)' }}
            />
          </div>

          {/* Day */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: 'spring' }}
              className="absolute -inset-4 border"
              style={{ borderColor: 'var(--color-primary)', opacity: 0.5 }}
            />
            <span
              className="text-5xl sm:text-6xl font-bold"
              style={{
                fontFamily: 'var(--font-accent)',
                color: 'var(--color-primary)',
              }}
            >
              {String(dateDisplay.day).padStart(2, '0')}
            </span>
          </div>
        </motion.div>

        {/* Day of week with geometric underline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6"
        >
          <span
            className="text-base tracking-[0.3em]"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
            }}
          >
            {dateDisplay.dayOfWeek}
          </span>

          {/* Geometric underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex items-center justify-center gap-1 mt-3"
          >
            <div className="w-8 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: 'var(--color-bride)' }} />
            <div className="w-8 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
          </motion.div>
        </motion.div>

        {/* Time */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="block mt-4 text-sm tracking-wider"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-light)',
          }}
        >
          {dateDisplay.time}
        </motion.span>
      </div>

      {/* Corner geometric accents */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute top-4 left-4"
      >
        <div className="w-6 h-6 border-l-2 border-t-2" style={{ borderColor: 'var(--color-primary)' }} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-4 right-4"
      >
        <div className="w-6 h-6 border-r-2 border-b-2" style={{ borderColor: 'var(--color-primary)' }} />
      </motion.div>
    </motion.div>
  );
}

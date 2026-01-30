'use client';

import { motion } from 'framer-motion';
import { WEDDING_INFO } from '@/lib/constants';

interface CalendarProps {
  className?: string;
}

export function SplitScreen({ className = '' }: CalendarProps) {
  const { dateDisplay } = WEDDING_INFO;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col sm:flex-row items-stretch overflow-hidden rounded-sm ${className}`}
      style={{ minHeight: '280px' }}
    >
      {/* Left Side - Date */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex-1 flex flex-col items-center justify-center py-10 px-6"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <span
          className="text-[10px] tracking-[0.4em] uppercase mb-4"
          style={{
            fontFamily: 'var(--font-accent)',
            color: 'var(--color-white)',
            opacity: 0.7,
          }}
        >
          Date
        </span>

        <div className="text-center">
          <span
            className="block text-7xl sm:text-8xl font-light"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-white)',
              lineHeight: 0.9,
            }}
          >
            {String(dateDisplay.day).padStart(2, '0')}
          </span>
          <span
            className="block text-xl tracking-widest mt-2"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-white)',
              opacity: 0.9,
            }}
          >
            {dateDisplay.month}월
          </span>
          <span
            className="block text-sm tracking-wider mt-1"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-white)',
              opacity: 0.6,
            }}
          >
            {dateDisplay.year}
          </span>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-12 h-px mt-6"
          style={{ backgroundColor: 'var(--color-white)', opacity: 0.3 }}
        />

        <span
          className="mt-4 text-xs tracking-widest"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-white)',
            opacity: 0.7,
          }}
        >
          {dateDisplay.dayOfWeek}
        </span>
      </motion.div>

      {/* Divider */}
      <div className="hidden sm:block w-px" style={{ backgroundColor: 'var(--color-border)' }} />
      <div className="block sm:hidden h-px" style={{ backgroundColor: 'var(--color-border)' }} />

      {/* Right Side - Time */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex-1 flex flex-col items-center justify-center py-10 px-6"
        style={{ backgroundColor: 'var(--color-white)' }}
      >
        <span
          className="text-[10px] tracking-[0.4em] uppercase mb-4"
          style={{
            fontFamily: 'var(--font-accent)',
            color: 'var(--color-text-muted)',
          }}
        >
          Time
        </span>

        <div className="text-center">
          <span
            className="block text-5xl sm:text-6xl font-light"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-text)',
              lineHeight: 1,
            }}
          >
            {dateDisplay.timeDetail}
          </span>
          <span
            className="block text-lg tracking-wider mt-3"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-light)',
            }}
          >
            {dateDisplay.time.includes('오후') ? 'PM' : 'AM'}
          </span>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="w-12 h-px mt-6"
          style={{ backgroundColor: 'var(--color-border)' }}
        />

        <span
          className="mt-4 text-xs tracking-wider"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-muted)',
          }}
        >
          {dateDisplay.time}
        </span>
      </motion.div>
    </motion.div>
  );
}

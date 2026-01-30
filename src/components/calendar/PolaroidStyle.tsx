'use client';

import { motion } from 'framer-motion';
import { WEDDING_INFO } from '@/lib/constants';

interface CalendarProps {
  className?: string;
}

export function PolaroidStyle({ className = '' }: CalendarProps) {
  const { dateDisplay, groom, bride } = WEDDING_INFO;

  return (
    <motion.div
      initial={{ opacity: 0, rotate: -3 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 0.8, type: 'spring' }}
      className={`flex flex-col items-center justify-center py-8 px-6 ${className}`}
    >
      {/* Polaroid Card */}
      <motion.div
        whileHover={{ rotate: 2, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="relative"
        style={{
          backgroundColor: 'var(--color-white)',
          padding: '12px 12px 40px 12px',
          boxShadow: `
            0 1px 3px rgba(0, 0, 0, 0.08),
            0 4px 12px rgba(0, 0, 0, 0.06),
            0 8px 24px rgba(0, 0, 0, 0.04)
          `,
        }}
      >
        {/* Photo Area */}
        <div
          className="w-56 h-56 sm:w-64 sm:h-64 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, var(--color-botanical-light) 0%, var(--color-rose-light) 100%)`,
          }}
        >
          {/* Decorative pattern inside */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center"
            >
              {/* Month in large */}
              <span
                className="block text-6xl sm:text-7xl font-light"
                style={{
                  fontFamily: 'var(--font-accent)',
                  color: 'var(--color-primary)',
                  opacity: 0.9,
                }}
              >
                {String(dateDisplay.month).padStart(2, '0')}
              </span>

              {/* Day */}
              <span
                className="block text-8xl sm:text-9xl font-light -mt-4"
                style={{
                  fontFamily: 'var(--font-accent)',
                  color: 'var(--color-text)',
                }}
              >
                {String(dateDisplay.day).padStart(2, '0')}
              </span>
            </motion.div>
          </div>

          {/* Subtle overlay gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.05) 100%)',
            }}
          />
        </div>

        {/* Caption Area (Polaroid bottom) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center"
        >
          <p
            className="text-base tracking-wider"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
            }}
          >
            {groom.name} & {bride.name}
          </p>
        </motion.div>

        {/* Tape decoration on top */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
            backdropFilter: 'blur(2px)',
            transform: 'translateX(-50%) rotate(-2deg)',
          }}
        />
      </motion.div>

      {/* Date label below polaroid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-6 text-center"
      >
        <p
          className="text-sm tracking-[0.2em]"
          style={{
            fontFamily: 'var(--font-accent)',
            color: 'var(--color-text-muted)',
          }}
        >
          {dateDisplay.year}.{String(dateDisplay.month).padStart(2, '0')}.{String(dateDisplay.day).padStart(2, '0')}
        </p>
        <p
          className="text-xs mt-1"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-light)',
          }}
        >
          {dateDisplay.dayOfWeek} {dateDisplay.time}
        </p>
      </motion.div>
    </motion.div>
  );
}

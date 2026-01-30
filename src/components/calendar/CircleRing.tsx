'use client';

import { motion } from 'framer-motion';
import { WEDDING_INFO } from '@/lib/constants';

interface CalendarProps {
  className?: string;
}

export function CircleRing({ className = '' }: CalendarProps) {
  const { dateDisplay } = WEDDING_INFO;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col items-center justify-center py-12 px-6 ${className}`}
    >
      {/* Outer decorative ring with rotating text */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80">
        {/* Rotating text ring */}
        <motion.svg
          initial={{ rotate: 0, opacity: 0 }}
          animate={{ rotate: 360, opacity: 1 }}
          transition={{
            rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 0.5 },
          }}
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 200 200"
        >
          <defs>
            <path
              id="circlePath"
              d="M 100, 100 m -85, 0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0"
            />
          </defs>
          <text
            fill="var(--color-text-muted)"
            fontSize="8"
            letterSpacing="0.15em"
            style={{ fontFamily: 'var(--font-accent)' }}
          >
            <textPath href="#circlePath">
              WEDDING DAY * {dateDisplay.year}.{String(dateDisplay.month).padStart(2, '0')}.{String(dateDisplay.day).padStart(2, '0')} * {dateDisplay.dayOfWeek} * {dateDisplay.time} *
            </textPath>
          </text>
        </motion.svg>

        {/* Middle decorative ring */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute inset-6 sm:inset-8 rounded-full border-2"
          style={{ borderColor: 'var(--color-accent)' }}
        />

        {/* Inner ring with gradient */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="absolute inset-10 sm:inset-14 rounded-full"
          style={{
            background: `linear-gradient(135deg, var(--color-secondary) 0%, var(--color-white) 100%)`,
            boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.05)',
          }}
        />

        {/* Center content */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          {/* Month */}
          <span
            className="text-xs tracking-[0.3em] uppercase"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-text-muted)',
            }}
          >
            April
          </span>

          {/* Day */}
          <span
            className="text-5xl sm:text-6xl font-light my-1"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-primary)',
            }}
          >
            {String(dateDisplay.day).padStart(2, '0')}
          </span>

          {/* Year */}
          <span
            className="text-sm tracking-widest"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-light)',
            }}
          >
            {dateDisplay.year}
          </span>

          {/* Decorative dot */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="w-1.5 h-1.5 rounded-full mt-3"
            style={{ backgroundColor: 'var(--color-bride)' }}
          />

          {/* Time */}
          <span
            className="text-xs mt-2 tracking-wider"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-muted)',
            }}
          >
            {dateDisplay.time}
          </span>
        </motion.div>

        {/* Decorative corner elements */}
        {[0, 90, 180, 270].map((rotation, i) => (
          <motion.div
            key={rotation}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="absolute w-2 h-2"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${rotation}deg) translate(110px, 0) translate(-50%, -50%)`,
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{ backgroundColor: 'var(--color-gold)' }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { WEDDING_INFO } from '@/lib/constants';

interface CalendarProps {
  className?: string;
}

export function NeonGlow({ className = '' }: CalendarProps) {
  const { dateDisplay } = WEDDING_INFO;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`relative flex flex-col items-center justify-center py-14 px-6 overflow-hidden rounded-lg ${className}`}
      style={{ backgroundColor: '#1a1a2e' }}
    >
      {/* Subtle star particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          className="absolute w-0.5 h-0.5 rounded-full"
          style={{
            backgroundColor: '#fff',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Glow effect behind text */}
      <motion.div
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(187, 114, 115, 0.3) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Label with glow */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-[10px] tracking-[0.5em] uppercase"
          style={{
            fontFamily: 'var(--font-accent)',
            color: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          Save the Date
        </motion.span>

        {/* Main Date with neon glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="my-6"
        >
          <span
            className="block text-5xl sm:text-6xl font-light"
            style={{
              fontFamily: 'var(--font-accent)',
              color: '#BB7273',
              textShadow: `
                0 0 10px rgba(187, 114, 115, 0.8),
                0 0 20px rgba(187, 114, 115, 0.6),
                0 0 40px rgba(187, 114, 115, 0.4),
                0 0 60px rgba(187, 114, 115, 0.2)
              `,
            }}
          >
            {dateDisplay.year}
          </span>
        </motion.div>

        {/* Date numbers with different glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-3"
        >
          <span
            className="text-4xl sm:text-5xl font-light"
            style={{
              fontFamily: 'var(--font-accent)',
              color: '#fff',
              textShadow: `
                0 0 10px rgba(255, 255, 255, 0.5),
                0 0 20px rgba(255, 255, 255, 0.3)
              `,
            }}
          >
            {String(dateDisplay.month).padStart(2, '0')}
          </span>

          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-3xl"
            style={{
              color: '#BB7273',
              textShadow: '0 0 10px rgba(187, 114, 115, 0.8)',
            }}
          >
            /
          </motion.span>

          <span
            className="text-4xl sm:text-5xl font-light"
            style={{
              fontFamily: 'var(--font-accent)',
              color: '#fff',
              textShadow: `
                0 0 10px rgba(255, 255, 255, 0.5),
                0 0 20px rgba(255, 255, 255, 0.3)
              `,
            }}
          >
            {String(dateDisplay.day).padStart(2, '0')}
          </span>
        </motion.div>

        {/* Day of week */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <span
            className="text-sm tracking-[0.3em]"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            {dateDisplay.dayOfWeek}
          </span>
        </motion.div>

        {/* Time with soft glow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-4 px-6 py-2 rounded-full"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <span
            className="text-sm tracking-wider"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            {dateDisplay.time}
          </span>
        </motion.div>
      </div>

      {/* Corner decorations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.8 }}
        className="absolute top-4 left-4 w-8 h-8 border-l border-t"
        style={{ borderColor: 'rgba(187, 114, 115, 0.5)' }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.9 }}
        className="absolute bottom-4 right-4 w-8 h-8 border-r border-b"
        style={{ borderColor: 'rgba(187, 114, 115, 0.5)' }}
      />
    </motion.div>
  );
}

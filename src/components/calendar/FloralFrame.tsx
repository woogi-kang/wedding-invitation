'use client';

import { motion } from 'framer-motion';
import { WEDDING_INFO } from '@/lib/constants';

interface CalendarProps {
  className?: string;
}

export function FloralFrame({ className = '' }: CalendarProps) {
  const { dateDisplay } = WEDDING_INFO;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col items-center justify-center py-12 px-6 ${className}`}
    >
      <div className="relative w-72 sm:w-80">
        {/* Floral Corner Decorations - Top Left */}
        <motion.svg
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="absolute -top-4 -left-4 w-20 h-20"
          viewBox="0 0 80 80"
          fill="none"
        >
          <path
            d="M10 40 Q10 10 40 10"
            stroke="var(--color-primary)"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M15 35 Q20 20 35 15"
            stroke="var(--color-primary)"
            strokeWidth="0.5"
            fill="none"
            opacity="0.5"
          />
          {/* Leaf shapes */}
          <ellipse cx="25" cy="20" rx="8" ry="4" fill="var(--color-primary)" opacity="0.15" transform="rotate(-45 25 20)" />
          <ellipse cx="18" cy="28" rx="6" ry="3" fill="var(--color-primary)" opacity="0.1" transform="rotate(-30 18 28)" />
          <circle cx="10" cy="40" r="2" fill="var(--color-bride)" opacity="0.6" />
          <circle cx="40" cy="10" r="2" fill="var(--color-bride)" opacity="0.6" />
        </motion.svg>

        {/* Floral Corner Decorations - Top Right */}
        <motion.svg
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute -top-4 -right-4 w-20 h-20"
          viewBox="0 0 80 80"
          fill="none"
        >
          <path
            d="M70 40 Q70 10 40 10"
            stroke="var(--color-primary)"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M65 35 Q60 20 45 15"
            stroke="var(--color-primary)"
            strokeWidth="0.5"
            fill="none"
            opacity="0.5"
          />
          <ellipse cx="55" cy="20" rx="8" ry="4" fill="var(--color-primary)" opacity="0.15" transform="rotate(45 55 20)" />
          <ellipse cx="62" cy="28" rx="6" ry="3" fill="var(--color-primary)" opacity="0.1" transform="rotate(30 62 28)" />
          <circle cx="70" cy="40" r="2" fill="var(--color-bride)" opacity="0.6" />
          <circle cx="40" cy="10" r="2" fill="var(--color-bride)" opacity="0.6" />
        </motion.svg>

        {/* Floral Corner Decorations - Bottom Left */}
        <motion.svg
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="absolute -bottom-4 -left-4 w-20 h-20"
          viewBox="0 0 80 80"
          fill="none"
        >
          <path
            d="M10 40 Q10 70 40 70"
            stroke="var(--color-primary)"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M15 45 Q20 60 35 65"
            stroke="var(--color-primary)"
            strokeWidth="0.5"
            fill="none"
            opacity="0.5"
          />
          <ellipse cx="25" cy="60" rx="8" ry="4" fill="var(--color-primary)" opacity="0.15" transform="rotate(45 25 60)" />
          <ellipse cx="18" cy="52" rx="6" ry="3" fill="var(--color-primary)" opacity="0.1" transform="rotate(30 18 52)" />
          <circle cx="10" cy="40" r="2" fill="var(--color-bride)" opacity="0.6" />
          <circle cx="40" cy="70" r="2" fill="var(--color-bride)" opacity="0.6" />
        </motion.svg>

        {/* Floral Corner Decorations - Bottom Right */}
        <motion.svg
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="absolute -bottom-4 -right-4 w-20 h-20"
          viewBox="0 0 80 80"
          fill="none"
        >
          <path
            d="M70 40 Q70 70 40 70"
            stroke="var(--color-primary)"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M65 45 Q60 60 45 65"
            stroke="var(--color-primary)"
            strokeWidth="0.5"
            fill="none"
            opacity="0.5"
          />
          <ellipse cx="55" cy="60" rx="8" ry="4" fill="var(--color-primary)" opacity="0.15" transform="rotate(-45 55 60)" />
          <ellipse cx="62" cy="52" rx="6" ry="3" fill="var(--color-primary)" opacity="0.1" transform="rotate(-30 62 52)" />
          <circle cx="70" cy="40" r="2" fill="var(--color-bride)" opacity="0.6" />
          <circle cx="40" cy="70" r="2" fill="var(--color-bride)" opacity="0.6" />
        </motion.svg>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative py-10 px-8 text-center"
          style={{
            backgroundColor: 'var(--color-white)',
            border: '1px solid var(--color-border-light)',
          }}
        >
          {/* English label */}
          <span
            className="text-[10px] tracking-[0.4em] uppercase"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-primary)',
            }}
          >
            Save the Date
          </span>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 my-4">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-border)' }} />
            <svg width="12" height="12" viewBox="0 0 12 12" fill="var(--color-bride)">
              <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" />
            </svg>
            <div className="h-px w-8" style={{ backgroundColor: 'var(--color-border)' }} />
          </div>

          {/* Date Display */}
          <div className="space-y-1">
            <p
              className="text-3xl sm:text-4xl"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text)',
              }}
            >
              {dateDisplay.year}
            </p>
            <p
              className="text-xl"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text)',
              }}
            >
              {dateDisplay.month}월 {dateDisplay.day}일
            </p>
            <p
              className="text-sm"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text-light)',
              }}
            >
              {dateDisplay.dayOfWeek}
            </p>
          </div>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 my-4">
            <div className="h-px w-12" style={{ backgroundColor: 'var(--color-border)' }} />
          </div>

          {/* Time */}
          <p
            className="text-sm tracking-wider"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-text-muted)',
            }}
          >
            {dateDisplay.time}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { WEDDING_INFO } from '@/lib/constants';

interface CalendarProps {
  className?: string;
}

export function VerticalTimeline({ className = '' }: CalendarProps) {
  const { dateDisplay } = WEDDING_INFO;

  const timelineItems = [
    { label: 'Year', value: String(dateDisplay.year), korean: '년' },
    { label: 'Month', value: String(dateDisplay.month).padStart(2, '0'), korean: '월' },
    { label: 'Day', value: String(dateDisplay.day).padStart(2, '0'), korean: '일' },
    { label: 'Time', value: dateDisplay.timeDetail, korean: '' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col items-center py-12 px-6 ${className}`}
    >
      {/* Header */}
      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xs tracking-[0.4em] uppercase mb-10"
        style={{
          fontFamily: 'var(--font-accent)',
          color: 'var(--color-primary)',
        }}
      >
        Wedding Day
      </motion.span>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute left-1/2 top-0 bottom-0 w-px origin-top"
          style={{ backgroundColor: 'var(--color-border)' }}
        />

        {/* Timeline Items */}
        <div className="flex flex-col gap-8">
          {timelineItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.15, duration: 0.5 }}
              className={`flex items-center gap-6 ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Content */}
              <div
                className={`w-28 ${
                  index % 2 === 0 ? 'text-right' : 'text-left'
                }`}
              >
                <span
                  className="text-[10px] tracking-[0.2em] uppercase block mb-1"
                  style={{
                    fontFamily: 'var(--font-accent)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {item.label}
                </span>
                <span
                  className="text-2xl sm:text-3xl"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-text)',
                  }}
                >
                  {item.value}
                  <span className="text-base ml-1" style={{ color: 'var(--color-text-light)' }}>
                    {item.korean}
                  </span>
                </span>
              </div>

              {/* Dot */}
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.15, type: 'spring' }}
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    opacity: 0.3,
                    animationDuration: '2s',
                    animationDelay: `${index * 0.5}s`,
                  }}
                />
              </div>

              {/* Spacer */}
              <div className="w-28" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Day of Week */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-10 px-5 py-2 rounded-sm border"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <span
          className="text-sm tracking-widest"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-light)',
          }}
        >
          {dateDisplay.dayOfWeek}
        </span>
      </motion.div>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { WEDDING_INFO } from '@/lib/constants';

interface CalendarProps {
  className?: string;
}

export function WatercolorWash({ className = '' }: CalendarProps) {
  const { dateDisplay } = WEDDING_INFO;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`relative flex flex-col items-center justify-center py-14 px-6 overflow-hidden ${className}`}
    >
      {/* Watercolor background blobs */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="watercolor">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* Soft pink wash */}
        <motion.ellipse
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1.5 }}
          cx="100"
          cy="80"
          rx="150"
          ry="100"
          fill="#BB7273"
          filter="url(#watercolor)"
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Soft green wash */}
        <motion.ellipse
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          cx="300"
          cy="200"
          rx="180"
          ry="120"
          fill="#43573a"
          filter="url(#watercolor)"
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* Soft gold accent */}
        <motion.ellipse
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.25, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          cx="200"
          cy="150"
          rx="100"
          ry="80"
          fill="#b7a989"
          filter="url(#watercolor)"
          style={{ mixBlendMode: 'multiply' }}
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Script header */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-sm tracking-[0.3em] italic"
          style={{
            fontFamily: 'var(--font-accent)',
            color: 'var(--color-text-muted)',
          }}
        >
          We&apos;re getting married
        </motion.span>

        {/* Main Date Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="my-8"
        >
          {/* Year */}
          <span
            className="block text-xl tracking-[0.5em] mb-2"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-text-light)',
            }}
          >
            {dateDisplay.year}
          </span>

          {/* Month and Day */}
          <div className="flex items-baseline justify-center gap-2">
            <span
              className="text-3xl sm:text-4xl italic"
              style={{
                fontFamily: 'var(--font-accent)',
                color: 'var(--color-text)',
              }}
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][dateDisplay.month - 1]}
            </span>
            <span
              className="text-6xl sm:text-7xl font-light"
              style={{
                fontFamily: 'var(--font-accent)',
                color: 'var(--color-primary)',
              }}
            >
              {dateDisplay.day}
            </span>
          </div>
        </motion.div>

        {/* Decorative brush stroke */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.6 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="w-32 h-1 mx-auto mb-6 rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--color-bride), transparent)',
          }}
        />

        {/* Day and Time */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="space-y-1"
        >
          <span
            className="block text-base tracking-widest"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
            }}
          >
            {dateDisplay.dayOfWeek}
          </span>
          <span
            className="block text-sm tracking-wider"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-light)',
            }}
          >
            {dateDisplay.time}
          </span>
        </motion.div>
      </div>

      {/* Decorative watercolor splatter dots */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ delay: 1 + i * 0.1 }}
          className="absolute rounded-full"
          style={{
            width: `${8 + Math.random() * 12}px`,
            height: `${8 + Math.random() * 12}px`,
            backgroundColor: i % 2 === 0 ? 'var(--color-bride)' : 'var(--color-primary)',
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
            filter: 'blur(1px)',
          }}
        />
      ))}
    </motion.div>
  );
}

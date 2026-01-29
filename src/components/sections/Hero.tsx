'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { WEDDING_INFO } from '@/lib/constants';

export function Hero() {
  const { groom, bride, dateDisplay, venue } = WEDDING_INFO;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)] px-6 py-20">
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative corner borders */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-[var(--color-primary)]/20" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-[var(--color-primary)]/20" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-[var(--color-primary)]/20" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-[var(--color-primary)]/20" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="relative z-10 text-center max-w-md mx-auto"
      >
        {/* English Quote */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8 text-xs tracking-[0.3em] uppercase"
          style={{
            fontFamily: 'var(--font-accent)',
            color: 'var(--color-text-muted)',
            fontStyle: 'italic',
          }}
        >
          We are getting married
        </motion.p>

        {/* Decorative Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isLoaded ? { scaleX: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-10 h-px w-16 origin-center"
          style={{ backgroundColor: 'var(--color-primary)' }}
        />

        {/* Names - Korean */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mb-4"
        >
          <h1
            className="text-3xl min-[375px]:text-4xl sm:text-5xl tracking-wider"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
              fontWeight: 400,
            }}
          >
            <span style={{ color: 'var(--color-groom)' }}>{groom.name}</span>
            <span className="mx-3 text-2xl" style={{ color: 'var(--color-gold)' }}>
              &
            </span>
            <span style={{ color: 'var(--color-bride)' }}>{bride.name}</span>
          </h1>
        </motion.div>

        {/* Names - English */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mb-12 text-sm tracking-[0.2em]"
          style={{
            fontFamily: 'var(--font-accent)',
            color: 'var(--color-text-light)',
            fontStyle: 'italic',
          }}
        >
          {groom.englishName} & {bride.englishName}
        </motion.p>

        {/* Date & Venue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mb-8"
        >
          <p
            className="text-lg min-[375px]:text-xl mb-2 tracking-wider"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text)',
            }}
          >
            {dateDisplay.year}. {String(dateDisplay.month).padStart(2, '0')}. {String(dateDisplay.day).padStart(2, '0')}
          </p>
          <p
            className="text-sm tracking-wider"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-light)',
            }}
          >
            {dateDisplay.dayOfWeek} {dateDisplay.time}
          </p>
        </motion.div>

        {/* Venue */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="text-sm tracking-wider"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-muted)',
          }}
        >
          {venue.name}
        </motion.p>

        {/* Decorative Line Bottom */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isLoaded ? { scaleX: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-12 h-px w-16 origin-center"
          style={{ backgroundColor: 'var(--color-primary)' }}
        />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--color-text-muted)',
            }}
          >
            Scroll
          </span>
          <ChevronDown
            className="h-4 w-4"
            style={{ color: 'var(--color-text-muted)' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

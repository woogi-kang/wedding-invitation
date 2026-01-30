'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { WEDDING_INFO } from '@/lib/constants';

// Shared style objects to reduce duplication
const heroTextAccent = {
  fontFamily: 'var(--font-accent)',
  color: 'var(--color-text)',
  fontStyle: 'italic' as const,
  textShadow: '0 1px 4px rgba(255, 255, 255, 0.8)',
};

const heroTextHeading = {
  fontFamily: 'var(--font-heading)',
  color: 'var(--color-text)',
  textShadow: '0 1px 4px rgba(255, 255, 255, 0.8)',
};

const heroTextHeadingLarge = {
  ...heroTextHeading,
  fontWeight: 400,
  textShadow: '0 2px 8px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.5)',
};

// Animation timing constants
const BASE_DELAY = 1;
const STAGGER = 0.2;

export function Hero() {
  const { groom, bride, dateDisplay, venue } = WEDDING_INFO;
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollY } = useScroll();

  // Parallax for text overlay only
  const textY = useTransform(scrollY, [0, 500], [0, -30]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    // Use requestAnimationFrame for proper paint timing instead of arbitrary timeout
    const frame = requestAnimationFrame(() => setIsLoaded(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[var(--color-background)]">
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Split Screen Photo Reveal */}
      <div className="absolute inset-0 flex">
        {/* Left Panel - Groom */}
        <motion.div
          className="relative w-1/2 overflow-hidden"
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={isLoaded ? { clipPath: 'inset(0 0% 0 0)' } : {}}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            role="img"
            aria-label="신랑 사진"
            style={{
              backgroundImage: 'url(/images/hero/groom.jpg)',
              willChange: 'auto',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[var(--color-background)]/80" />
          <div className="absolute inset-0 bg-[var(--color-groom)]/10" />
        </motion.div>

        {/* Right Panel - Bride */}
        <motion.div
          className="relative w-1/2 overflow-hidden"
          initial={{ clipPath: 'inset(0 0 0 100%)' }}
          animate={isLoaded ? { clipPath: 'inset(0 0 0 0%)' } : {}}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            role="img"
            aria-label="신부 사진"
            style={{
              backgroundImage: 'url(/images/hero/bride.jpg)',
              willChange: 'auto',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[var(--color-background)]/80" />
          <div className="absolute inset-0 bg-[var(--color-bride)]/10" />
        </motion.div>
      </div>

      {/* Center Gradient Blend - Semi-transparent */}
      <motion.div
        className="absolute left-1/2 top-0 bottom-0 w-24 -translate-x-1/2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 2, delay: 1 }}
        style={{
          background: 'linear-gradient(to right, transparent, color-mix(in srgb, var(--color-background) 50%, transparent) 35%, color-mix(in srgb, var(--color-background) 60%, transparent) 50%, color-mix(in srgb, var(--color-background) 50%, transparent) 65%, transparent)',
        }}
      />

      {/* Main Content - Center on desktop, Bottom on mobile with glass card */}
      <motion.div
        className="relative z-10 flex min-h-screen flex-col items-center justify-end sm:justify-center px-4 pb-20 sm:px-6 sm:pb-0"
        style={{ y: textY, opacity }}
      >
        {/* Glass Card Container - visible only on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: BASE_DELAY - 0.2, duration: 0.8 }}
          className="w-full max-w-sm sm:max-w-none sm:bg-transparent sm:backdrop-blur-none sm:border-0 sm:shadow-none sm:rounded-none sm:p-0 rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md shadow-lg p-6"
        >
          {/* English Quote */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: BASE_DELAY, duration: 0.8 }}
            className="mb-6 sm:mb-8 text-xs tracking-[0.3em] uppercase text-center"
            style={heroTextAccent}
          >
            We are getting married
          </motion.p>

          {/* Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isLoaded ? { scaleX: 1 } : {}}
            transition={{ delay: BASE_DELAY + STAGGER, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-6 sm:mb-10 h-px w-12 sm:w-16 origin-center"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />

          {/* Names - Korean */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: BASE_DELAY + STAGGER * 2, duration: 0.8 }}
            className="mb-3 sm:mb-4 text-center"
          >
            <h1
              className="text-2xl min-[375px]:text-3xl sm:text-5xl tracking-wider"
              style={heroTextHeadingLarge}
            >
              <span>{groom.name}</span>
              <span className="mx-2 sm:mx-3 text-xl sm:text-2xl" style={{ color: 'var(--color-gold)' }}>
                &
              </span>
              <span>{bride.name}</span>
            </h1>
          </motion.div>

          {/* Names - English */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: BASE_DELAY + STAGGER * 3, duration: 0.8 }}
            className="mb-8 sm:mb-12 text-xs sm:text-sm tracking-[0.2em] text-center"
            style={heroTextAccent}
          >
            {groom.englishName} & {bride.englishName}
          </motion.p>

          {/* Date & Venue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: BASE_DELAY + STAGGER * 4, duration: 0.8 }}
            className="mb-6 sm:mb-8 text-center"
          >
            <p
              className="text-base min-[375px]:text-lg sm:text-xl mb-1 sm:mb-2 tracking-wider"
              style={heroTextHeading}
            >
              {dateDisplay.year}. {String(dateDisplay.month).padStart(2, '0')}. {String(dateDisplay.day).padStart(2, '0')}
            </p>
            <p
              className="text-xs sm:text-sm tracking-wider"
              style={heroTextHeading}
            >
              {dateDisplay.dayOfWeek} {dateDisplay.time}
            </p>
          </motion.div>

          {/* Venue */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: BASE_DELAY + STAGGER * 5, duration: 0.8 }}
            className="text-xs sm:text-sm tracking-wider text-center"
            style={heroTextHeading}
          >
            {venue.name}
          </motion.p>

          {/* Decorative Line Bottom */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isLoaded ? { scaleX: 1 } : {}}
            transition={{ delay: BASE_DELAY + STAGGER * 6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 sm:mt-12 h-px w-12 sm:w-16 origin-center"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - hidden on very small screens */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ delay: BASE_DELAY + STAGGER * 7.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 hidden min-[375px]:block"
        style={{ opacity }}
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

      {/* Bottom Fade to Content */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, var(--color-background), transparent)',
        }}
      />
    </section>
  );
}

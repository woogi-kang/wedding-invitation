'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { WEDDING_INFO } from '@/lib/constants';

export function Hero() {
  const { groom, bride, dateDisplay, venue } = WEDDING_INFO;
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollY } = useScroll();

  // Parallax for text overlay only
  const textY = useTransform(scrollY, [0, 500], [0, -30]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
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
            style={{
              backgroundImage: 'url(/images/hero/bride.jpg)',
              willChange: 'auto',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[var(--color-background)]/80" />
          <div className="absolute inset-0 bg-[var(--color-bride)]/10" />
        </motion.div>
      </div>

      {/* Center Gradient Blend */}
      <motion.div
        className="absolute left-1/2 top-0 bottom-0 w-32 -translate-x-1/2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 2, delay: 1 }}
        style={{
          background: 'linear-gradient(to right, transparent, var(--color-background) 40%, var(--color-background) 60%, transparent)',
        }}
      />

      {/* Main Content - Center */}
      <motion.div
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6"
        style={{ y: textY, opacity }}
      >
        {/* English Quote */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
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
          transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-10 h-px w-16 origin-center"
          style={{ backgroundColor: 'var(--color-primary)' }}
        />

        {/* Names - Korean */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4, duration: 0.8 }}
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
          transition={{ delay: 1.6, duration: 0.8 }}
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
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mb-8 text-center"
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
          transition={{ delay: 2, duration: 0.8 }}
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
          transition={{ delay: 2.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-12 h-px w-16 origin-center"
          style={{ backgroundColor: 'var(--color-primary)' }}
        />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
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

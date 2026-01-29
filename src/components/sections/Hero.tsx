'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { WEDDING_INFO } from '@/lib/constants';
import { useCountdown } from '@/hooks/useCountdown';

export function Hero() {
  const { groom, bride, dateDisplay, date } = WEDDING_INFO;
  const countdown = useCountdown(date);
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollY } = useScroll();

  // Parallax effects
  const leftImageY = useTransform(scrollY, [0, 500], [0, 100]);
  const rightImageY = useTransform(scrollY, [0, 500], [0, 150]);
  const textY = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#FFFBF9]">
      {/* Textured Background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
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
          style={{ y: leftImageY }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(/images/hero/groom.jpg)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#FFFBF9]/80" />
          <div className="absolute inset-0 bg-[#C8A4A5]/10" />
        </motion.div>

        {/* Right Panel - Bride */}
        <motion.div
          className="relative w-1/2 overflow-hidden"
          initial={{ clipPath: 'inset(0 0 0 100%)' }}
          animate={isLoaded ? { clipPath: 'inset(0 0 0 0%)' } : {}}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
          style={{ y: rightImageY }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(/images/hero/bride.jpg)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#FFFBF9]/80" />
          <div className="absolute inset-0 bg-[#E8B4B8]/10" />
        </motion.div>
      </div>

      {/* Center Gradient Blend */}
      <motion.div
        className="absolute left-1/2 top-0 bottom-0 w-32 -translate-x-1/2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 2, delay: 1 }}
        style={{
          background: 'linear-gradient(to right, transparent, #FFFBF9 40%, #FFFBF9 60%, transparent)',
        }}
      />

      {/* Vertical Calligraphy Lines - Left */}
      <motion.div
        className="absolute left-[8%] top-1/4 hidden sm:block"
        initial={{ opacity: 0, y: 50 }}
        animate={isLoaded ? { opacity: 0.15, y: 0 } : {}}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <div
          className="writing-mode-vertical text-[3rem] leading-tight tracking-widest"
          style={{
            fontFamily: 'var(--font-calligraphy)',
            color: 'var(--color-primary-dark)',
            writingMode: 'vertical-rl',
          }}
        >
          사랑
        </div>
      </motion.div>

      {/* Vertical Calligraphy Lines - Right */}
      <motion.div
        className="absolute right-[8%] top-1/3 hidden sm:block"
        initial={{ opacity: 0, y: 50 }}
        animate={isLoaded ? { opacity: 0.15, y: 0 } : {}}
        transition={{ duration: 1, delay: 1.4 }}
      >
        <div
          className="writing-mode-vertical text-[3rem] leading-tight tracking-widest"
          style={{
            fontFamily: 'var(--font-calligraphy)',
            color: 'var(--color-primary-dark)',
            writingMode: 'vertical-rl',
          }}
        >
          영원
        </div>
      </motion.div>

      {/* Main Content - Center */}
      <motion.div
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6"
        style={{ y: textY, opacity }}
      >
        {/* Decorative Brush Stroke Top */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isLoaded ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 h-[2px] w-20 origin-center"
          style={{
            background: 'linear-gradient(to right, transparent, var(--color-primary), transparent)',
          }}
        />

        {/* Korean Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="mb-8"
        >
          <span
            className="text-[10px] min-[375px]:text-xs tracking-[0.5em] uppercase"
            style={{
              fontFamily: 'var(--font-elegant)',
              color: 'var(--color-text-muted)',
            }}
          >
            Wedding Invitation
          </span>
        </motion.div>

        {/* Names - Dramatic Reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 1 }}
          className="mb-2 text-center"
        >
          {/* Korean Names with Brush Style */}
          <h1 className="flex flex-col items-center gap-2 sm:flex-row sm:gap-0">
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="text-4xl min-[375px]:text-5xl sm:text-6xl lg:text-7xl"
              style={{
                fontFamily: 'var(--font-calligraphy)',
                color: 'var(--color-text)',
              }}
            >
              {groom.name}
            </motion.span>

            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.6, duration: 0.5, type: 'spring' }}
              className="mx-4 sm:mx-6 text-2xl sm:text-3xl"
              style={{ color: 'var(--color-rose)' }}
            >
              &#10084;
            </motion.span>

            <motion.span
              initial={{ opacity: 0, x: 30 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="text-4xl min-[375px]:text-5xl sm:text-6xl lg:text-7xl"
              style={{
                fontFamily: 'var(--font-calligraphy)',
                color: 'var(--color-text)',
              }}
            >
              {bride.name}
            </motion.span>
          </h1>
        </motion.div>

        {/* English Names */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mb-10 text-[10px] min-[375px]:text-xs tracking-[0.35em] uppercase"
          style={{
            fontFamily: 'var(--font-elegant)',
            color: 'var(--color-text-light)',
          }}
        >
          {groom.englishName} & {bride.englishName}
        </motion.p>

        {/* Date - Elegant Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2, duration: 0.8 }}
          className="mb-8 text-center"
        >
          {/* Large Date Number */}
          <div className="mb-2 flex items-center justify-center gap-2 min-[375px]:gap-3">
            <span
              className="text-5xl min-[375px]:text-6xl sm:text-7xl font-light"
              style={{
                fontFamily: 'var(--font-elegant)',
                color: 'var(--color-primary)',
              }}
            >
              {String(dateDisplay.day).padStart(2, '0')}
            </span>
            <div className="flex flex-col items-start">
              <span
                className="text-sm min-[375px]:text-base tracking-wider"
                style={{
                  fontFamily: 'var(--font-elegant)',
                  color: 'var(--color-text-light)',
                }}
              >
                {dateDisplay.year}. {String(dateDisplay.month).padStart(2, '0')}
              </span>
              <span
                className="text-xs min-[375px]:text-sm tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {dateDisplay.dayOfWeek}
              </span>
            </div>
          </div>
          <p
            className="text-xs min-[375px]:text-sm tracking-[0.2em]"
            style={{ color: 'var(--color-text-light)' }}
          >
            {dateDisplay.time}
          </p>
        </motion.div>

        {/* D-Day Counter - Ink Drop Style */}
        <AnimatePresence>
          {!countdown.isExpired && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 2.2, duration: 0.8 }}
              className="relative"
            >
              {/* Ink splatter background */}
              <div className="absolute -inset-4 opacity-[0.08]">
                <svg viewBox="0 0 100 60" className="w-full h-full">
                  <ellipse cx="50" cy="30" rx="48" ry="25" fill="var(--color-primary)" />
                  <ellipse cx="20" cy="35" rx="15" ry="8" fill="var(--color-primary)" />
                  <ellipse cx="80" cy="35" rx="12" ry="6" fill="var(--color-primary)" />
                </svg>
              </div>

              <div
                className="relative flex items-center gap-3 min-[375px]:gap-4 sm:gap-6 px-6 min-[375px]:px-8 py-3 min-[375px]:py-4 rounded-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--color-border-light)',
                }}
              >
                <CountdownUnit value={countdown.days} label="일" />
                <div className="h-6 w-px bg-[var(--color-border)]" />
                <CountdownUnit value={countdown.hours} label="시" />
                <div className="h-6 w-px bg-[var(--color-border)]" />
                <CountdownUnit value={countdown.minutes} label="분" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {countdown.isExpired && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="px-8 py-4 rounded-full"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--color-primary-light)',
            }}
          >
            <span
              className="text-base sm:text-lg tracking-widest"
              style={{
                fontFamily: 'var(--font-calligraphy)',
                color: 'var(--color-primary)',
              }}
            >
              We got married
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Scroll Indicator - Brush Style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="absolute bottom-6 min-[375px]:bottom-8 left-1/2 z-10 -translate-x-1/2"
        style={{ opacity }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span
            className="text-[9px] min-[375px]:text-[10px] tracking-[0.3em] uppercase"
            style={{
              fontFamily: 'var(--font-elegant)',
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

// Countdown unit component
function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center min-w-[36px] min-[375px]:min-w-[44px]">
      <span
        className="block text-xl min-[375px]:text-2xl sm:text-3xl font-light"
        style={{
          fontFamily: 'var(--font-elegant)',
          color: 'var(--color-text)',
        }}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span
        className="text-[8px] min-[375px]:text-[9px] tracking-[0.2em] uppercase"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {label}
      </span>
    </div>
  );
}

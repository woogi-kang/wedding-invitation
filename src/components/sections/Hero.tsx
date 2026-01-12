'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { WEDDING_INFO } from '@/lib/constants';
import { useCountdown } from '@/hooks/useCountdown';

export function Hero() {
  const { groom, bride, dateDisplay, date } = WEDDING_INFO;
  const countdown = useCountdown(date);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://picsum.photos/seed/hero/1080/1920)',
        }}
      >
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2F3633]/40 via-[#2F3633]/30 to-[#2F3633]/50" />
      </div>

      {/* Decorative Frame */}
      <div className="absolute inset-6 sm:inset-12 pointer-events-none">
        <div className="absolute top-0 left-0 w-16 h-16 sm:w-24 sm:h-24 border-l border-t border-white/20" />
        <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 border-r border-t border-white/20" />
        <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 border-l border-b border-white/20" />
        <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-24 sm:h-24 border-r border-b border-white/20" />
      </div>

      {/* Floating Botanical Elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 opacity-20"
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full fill-white/30">
          <path d="M50 10 C30 30, 20 50, 50 90 C80 50, 70 30, 50 10" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-32 right-10 w-24 h-24 opacity-20"
        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full fill-white/30">
          <path d="M50 10 C30 30, 20 50, 50 90 C80 50, 70 30, 50 10" />
        </svg>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center text-white">
        {/* Elegant Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-8"
        >
          <span className="font-serif text-xs tracking-[0.4em] text-white/70 uppercase">
            청첩장
          </span>
        </motion.div>

        {/* Names */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-4 sm:mb-6"
        >
          <h1 className="font-serif text-3xl font-light tracking-wider min-[375px]:text-4xl sm:text-5xl lg:text-6xl">
            <span className="inline-block">{groom.name}</span>
            <span className="mx-3 min-[375px]:mx-4 sm:mx-6 inline-block text-[var(--color-accent-light)] opacity-80">&</span>
            <span className="inline-block">{bride.name}</span>
          </h1>
        </motion.div>

        {/* English Names */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-8 sm:mb-12 font-serif text-xs min-[375px]:text-sm tracking-[0.2em] min-[375px]:tracking-[0.3em] text-white/60 uppercase"
        >
          {groom.englishName} & {bride.englishName}
        </motion.p>

        {/* Decorative Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-6 sm:mb-10 h-px w-16 min-[375px]:w-20 sm:w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent"
        />

        {/* Date Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mb-6 sm:mb-8"
        >
          <p className="font-serif text-base min-[375px]:text-lg tracking-[0.1em] min-[375px]:tracking-[0.15em] sm:text-xl">
            {dateDisplay.year}. {String(dateDisplay.month).padStart(2, '0')}. {String(dateDisplay.day).padStart(2, '0')}
          </p>
          <p className="mt-1.5 sm:mt-2 text-xs min-[375px]:text-sm tracking-wider text-white/70">
            {dateDisplay.dayOfWeek} {dateDisplay.time}
          </p>
        </motion.div>

        {/* D-Day Counter */}
        {!countdown.isExpired && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="glass-dark rounded-sm px-4 min-[375px]:px-6 sm:px-8 py-3 min-[375px]:py-4"
          >
            <div className="flex items-center gap-4 min-[375px]:gap-5 sm:gap-8">
              <div className="text-center min-w-[40px] min-[375px]:min-w-[48px]">
                <span className="block font-serif text-xl min-[375px]:text-2xl sm:text-3xl font-light">
                  {countdown.days}
                </span>
                <span className="text-[9px] min-[375px]:text-[10px] tracking-[0.15em] min-[375px]:tracking-[0.2em] text-white/50 uppercase">일</span>
              </div>
              <div className="h-6 min-[375px]:h-8 w-px bg-white/20" />
              <div className="text-center min-w-[40px] min-[375px]:min-w-[48px]">
                <span className="block font-serif text-xl min-[375px]:text-2xl sm:text-3xl font-light">
                  {String(countdown.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] min-[375px]:text-[10px] tracking-[0.15em] min-[375px]:tracking-[0.2em] text-white/50 uppercase">시간</span>
              </div>
              <div className="h-6 min-[375px]:h-8 w-px bg-white/20" />
              <div className="text-center min-w-[40px] min-[375px]:min-w-[48px]">
                <span className="block font-serif text-xl min-[375px]:text-2xl sm:text-3xl font-light">
                  {String(countdown.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] min-[375px]:text-[10px] tracking-[0.15em] min-[375px]:tracking-[0.2em] text-white/50 uppercase">분</span>
              </div>
            </div>
          </motion.div>
        )}

        {countdown.isExpired && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="glass-dark rounded-sm px-6 sm:px-8 py-3 sm:py-4"
          >
            <span className="font-serif text-base sm:text-lg tracking-wider">결혼했습니다</span>
          </motion.div>
        )}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] text-white/50 uppercase">아래로</span>
          <ChevronDown className="h-5 w-5 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}

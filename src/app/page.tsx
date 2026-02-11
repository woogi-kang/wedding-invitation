'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { WEDDING_INFO } from '@/lib/constants';
import { startGlobalAudio } from '@/hooks/useAudioPlayer';

const STAGGER = 0.15;

export default function Home() {
  const router = useRouter();
  const { groom, bride, dateDisplay, venue } = WEDDING_INFO;

  useEffect(() => {
    router.prefetch('/invitation');
    router.prefetch('/invitation/glitch');
  }, [router]);

  const handlePrimaryCTA = () => {
    startGlobalAudio();
    router.push('/invitation');
  };

  const handleSecondaryCTA = () => {
    router.push('/invitation/glitch');
  };

  return (
    <main className="relative min-h-screen">
      {/* Full-screen Cover Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <Image
          src="/images/hero/cover.webp"
          alt="Wedding cover photo"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.40) 50%, rgba(0,0,0,0.50) 100%)',
          }}
        />
      </motion.div>

      {/* Centered Card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center text-center py-12 px-8 rounded-2xl backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
          }}
        >
          {/* English Quote */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: STAGGER * 2 }}
            className="text-[12px] tracking-[0.4em] uppercase mb-6"
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'rgba(255, 255, 255, 0.60)',
            }}
          >
            We are getting married
          </motion.p>

          {/* Decorative Line Top */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: STAGGER * 3, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 h-px w-16 origin-center"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
          />

          {/* Names */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: STAGGER * 4 }}
            className="text-[29px] min-[375px]:text-[34px] sm:text-[46px] tracking-wider mb-5"
            style={{
              fontFamily: 'var(--font-heading)',
              color: '#FFFFFF',
            }}
          >
            {groom.name}
            <span
              className="mx-2 sm:mx-3 text-[19px] min-[375px]:text-[23px] sm:text-[29px]"
              style={{ color: '#d4c9b0' }}
            >
              &
            </span>
            {bride.name}
          </motion.h1>

          {/* Date */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: STAGGER * 5 }}
            className="text-[17px] sm:text-[19px] tracking-wider mb-2"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'rgba(255, 255, 255, 0.90)',
            }}
          >
            {dateDisplay.year}. {String(dateDisplay.month).padStart(2, '0')}. {String(dateDisplay.day).padStart(2, '0')}
          </motion.p>

          {/* Day & Time */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: STAGGER * 6 }}
            className="text-[15px] tracking-wider mb-2"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'rgba(255, 255, 255, 0.70)',
            }}
          >
            {dateDisplay.dayOfWeek} {dateDisplay.time}
          </motion.p>

          {/* Venue */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: STAGGER * 7 }}
            className="text-[13px] sm:text-[15px] tracking-wider mb-8"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'rgba(255, 255, 255, 0.60)',
            }}
          >
            신도림 라마다 호텔 14F 하늘정원
          </motion.p>

          {/* Decorative Line Bottom */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: STAGGER * 8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 h-px w-16 origin-center"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
          />

          {/* Primary CTA */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: STAGGER * 9 }}
            onClick={handlePrimaryCTA}
            className="mb-4 inline-flex items-center justify-center px-8 py-3 text-sm tracking-[0.15em] border border-white/40 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/60 transition-all duration-300"
          >
            청첩장 보기
          </motion.button>

          {/* Secondary CTA */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: STAGGER * 10 }}
            onClick={handleSecondaryCTA}
            className="inline-flex items-center justify-center text-[12px] tracking-[0.1em] text-white/40 hover:text-white/70 underline underline-offset-4 decoration-white/20 hover:decoration-white/40 transition-all duration-300 bg-transparent border-none"
          >
            히든 버전 열기
          </motion.button>
        </motion.div>
      </div>
    </main>
  );
}

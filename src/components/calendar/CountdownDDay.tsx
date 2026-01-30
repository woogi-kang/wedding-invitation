'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WEDDING_INFO } from '@/lib/constants';

interface CalendarProps {
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function FlipCard({ value, label }: { value: number; label: string }) {
  const [prevValue, setPrevValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setPrevValue(value);
        setIsFlipping(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  const displayValue = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-20 sm:w-20 sm:h-24 perspective-500">
        {/* Card Background */}
        <div
          className="absolute inset-0 rounded-lg shadow-lg"
          style={{ backgroundColor: 'var(--color-primary-dark)' }}
        />

        {/* Static number display */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={value}
              initial={{ y: isFlipping ? -20 : 0, opacity: isFlipping ? 0 : 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="text-3xl sm:text-4xl font-light"
              style={{
                fontFamily: 'var(--font-accent)',
                color: 'var(--color-white)',
              }}
            >
              {displayValue}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Center divider line */}
        <div
          className="absolute left-0 right-0 top-1/2 h-px opacity-20"
          style={{ backgroundColor: 'var(--color-white)' }}
        />
      </div>

      <span
        className="mt-2 text-[10px] sm:text-xs tracking-[0.2em] uppercase"
        style={{
          fontFamily: 'var(--font-accent)',
          color: 'var(--color-text-muted)',
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function CountdownDDay({ className = '' }: CalendarProps) {
  const { dateDisplay } = WEDDING_INFO;
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = () => {
      const weddingDate = new Date(
        dateDisplay.year,
        dateDisplay.month - 1,
        dateDisplay.day,
        14, 10
      );
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [dateDisplay]);

  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col items-center py-10 px-4 ${className}`}
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <span
          className="text-xs tracking-[0.3em] uppercase"
          style={{
            fontFamily: 'var(--font-accent)',
            color: 'var(--color-text-muted)',
          }}
        >
          Counting down to
        </span>
        <p
          className="mt-2 text-lg"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text)',
          }}
        >
          {dateDisplay.year}.{String(dateDisplay.month).padStart(2, '0')}.{String(dateDisplay.day).padStart(2, '0')}
        </p>
      </motion.div>

      {/* Countdown Cards */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="flex items-center gap-2 sm:gap-4"
      >
        <FlipCard value={timeLeft.days} label="Days" />
        <span
          className="text-2xl sm:text-3xl font-light pb-6"
          style={{ color: 'var(--color-text-muted)' }}
        >
          :
        </span>
        <FlipCard value={timeLeft.hours} label="Hours" />
        <span
          className="text-2xl sm:text-3xl font-light pb-6"
          style={{ color: 'var(--color-text-muted)' }}
        >
          :
        </span>
        <FlipCard value={timeLeft.minutes} label="Mins" />
        <span
          className="text-2xl sm:text-3xl font-light pb-6"
          style={{ color: 'var(--color-text-muted)' }}
        >
          :
        </span>
        <FlipCard value={timeLeft.seconds} label="Secs" />
      </motion.div>

      {/* D-Day indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 px-6 py-2 rounded-full"
        style={{ backgroundColor: 'var(--color-bride)', opacity: 0.9 }}
      >
        <span
          className="text-sm tracking-wider"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-white)',
          }}
        >
          D-{timeLeft.days}
        </span>
      </motion.div>
    </motion.div>
  );
}

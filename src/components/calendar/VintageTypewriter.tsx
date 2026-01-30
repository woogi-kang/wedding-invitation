'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WEDDING_INFO } from '@/lib/constants';

interface CalendarProps {
  className?: string;
}

export function VintageTypewriter({ className = '' }: CalendarProps) {
  const { dateDisplay, groom, bride } = WEDDING_INFO;
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const fullText = `${groom.name} & ${bride.name}`;

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [fullText]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col items-center justify-center py-12 px-6 ${className}`}
      style={{ backgroundColor: '#f9f6f0' }}
    >
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative w-full max-w-sm p-8 text-center"
        style={{
          backgroundColor: '#fff',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e8e4dc',
        }}
      >
        {/* Typewriter header */}
        <div
          className="text-[10px] tracking-[0.5em] uppercase mb-6"
          style={{
            fontFamily: '"Courier New", Courier, monospace',
            color: '#666',
          }}
        >
          - WEDDING INVITATION -
        </div>

        {/* Main Date - Typewriter style */}
        <div className="space-y-2 mb-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl sm:text-5xl"
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              color: '#333',
              letterSpacing: '0.1em',
            }}
          >
            {dateDisplay.year}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 text-2xl"
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              color: '#333',
            }}
          >
            <span>{String(dateDisplay.month).padStart(2, '0')}</span>
            <span style={{ color: '#999' }}>.</span>
            <span>{String(dateDisplay.day).padStart(2, '0')}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm"
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              color: '#666',
            }}
          >
            ( {dateDisplay.dayOfWeek} )
          </motion.div>
        </div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="w-24 h-px mx-auto mb-6"
          style={{ backgroundColor: '#ccc' }}
        />

        {/* Time */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-sm mb-6"
          style={{
            fontFamily: '"Courier New", Courier, monospace',
            color: '#666',
          }}
        >
          {dateDisplay.timeDetail} ({dateDisplay.time})
        </motion.div>

        {/* Typing names effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-lg"
          style={{
            fontFamily: '"Courier New", Courier, monospace',
            color: '#333',
          }}
        >
          {displayedText}
          <span
            style={{
              opacity: showCursor ? 1 : 0,
              color: 'var(--color-bride)',
            }}
          >
            |
          </span>
        </motion.div>

        {/* Corner fold effect */}
        <div
          className="absolute bottom-0 right-0 w-8 h-8"
          style={{
            background: 'linear-gradient(135deg, transparent 50%, #e8e4dc 50%)',
          }}
        />
      </motion.div>

      {/* Stamp decoration */}
      <motion.div
        initial={{ opacity: 0, rotate: -15, scale: 0.8 }}
        animate={{ opacity: 1, rotate: -12, scale: 1 }}
        transition={{ delay: 1.6, type: 'spring' }}
        className="absolute bottom-8 right-8 sm:right-16 px-3 py-1 rounded-sm"
        style={{
          border: '2px solid var(--color-bride)',
          color: 'var(--color-bride)',
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '10px',
          letterSpacing: '0.1em',
        }}
      >
        SAVE THE DATE
      </motion.div>
    </motion.div>
  );
}

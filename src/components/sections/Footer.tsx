'use client';

import { motion } from 'framer-motion';
import { WEDDING_INFO } from '@/lib/constants';

export function Footer() {
  const { groom, bride, dateDisplay } = WEDDING_INFO;

  return (
    <footer className="relative py-16 px-6 text-center" style={{ backgroundColor: 'var(--color-secondary)' }}>
      {/* Decorative Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mx-auto mb-10 h-px w-16 origin-center"
        style={{ backgroundColor: 'var(--color-border)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-md mx-auto"
      >
        {/* Names */}
        <div className="mb-4 flex items-center justify-center gap-3">
          <span
            className="text-lg tracking-wider"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-groom)',
            }}
          >
            {groom.name}
          </span>
          <span
            className="text-sm"
            style={{ color: 'var(--color-gold)' }}
          >
            &
          </span>
          <span
            className="text-lg tracking-wider"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-bride)',
            }}
          >
            {bride.name}
          </span>
        </div>

        {/* Date */}
        <p
          className="mb-8 text-sm tracking-wider"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-light)',
          }}
        >
          {dateDisplay.year}. {String(dateDisplay.month).padStart(2, '0')}. {String(dateDisplay.day).padStart(2, '0')}
        </p>

        {/* Thank you */}
        <p
          className="mb-8 text-sm italic"
          style={{
            fontFamily: 'var(--font-accent)',
            color: 'var(--color-text-muted)',
          }}
        >
          감사합니다
        </p>

        {/* Copyright */}
        <p
          className="text-xs tracking-wider"
          style={{ color: 'var(--color-text-muted)' }}
        >
          © 2026 woogi & looppy. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
}
